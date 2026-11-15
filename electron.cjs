const { app, BrowserWindow, screen, ipcMain, shell, dialog, globalShortcut, session } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { exec, spawn } = require('child_process');

const CHROME_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
app.userAgentFallback = CHROME_UA;

app.commandLine.appendSwitch('touch-events', 'enabled');
app.commandLine.appendSwitch('enable-pinch');
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
app.commandLine.appendSwitch('disable-blink-features', 'AutomationControlled');
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');

let mainWindow = null;
let auraBounds = { x: 0, y: 0, width: 1920, height: 480 };
let psWorker = null;
let mediaWorker = null;

const smtcCmdFile = path.join(os.tmpdir(), 'aurabar_smtc_cmd.txt');

let currentMediaState = {
  title: 'Spotify Ready',
  artist: 'Play a song on Spotify',
  album: 'Spotify',
  status: 'Paused',
  position: 0,
  duration: 200,
  albumCover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600'
};

let lastTrackKey = '';
let cachedAlbumArt = null;
let cachedDuration = 200;
let cachedAlbumName = 'Single';

let trackedPositionSec = 0;
let lastSeekTimestamp = 0;
let activeRunningApps = [];

// ==========================================
// 1. FAST VOLUME & KEY WORKER
// ==========================================
function startPersistentKeyWorker() {
  psWorker = spawn('powershell.exe', ['-NoLogo', '-NoProfile', '-NonInteractive', '-Command', '-'], {
    stdio: ['pipe', 'ignore', 'ignore'],
    windowsHide: true
  });
  psWorker.stdin.write('$wshell = New-Object -ComObject WScript.Shell\n');
}

function sendFastKey(charCodeOrKey) {
  if (!psWorker || psWorker.killed) startPersistentKeyWorker();
  try {
    psWorker.stdin.write(`${charCodeOrKey}\n`);
  } catch (e) {}
}

function queueSmtcCommand(cmdString) {
  try {
    fs.writeFileSync(smtcCmdFile, cmdString, 'utf8');
  } catch (e) {}
}

function ensureSpotifyRunningSilently() {
  exec('tasklist /FI "IMAGENAME eq Spotify.exe" /NH', (_err, stdout) => {
    const isRunning = stdout && stdout.toLowerCase().includes('spotify.exe');
    if (!isRunning) {
      exec('powershell -NoProfile -WindowStyle Hidden -Command "Start-Process spotify -WindowStyle Minimized"');
    }
  });
}

// ==========================================
// 2. ALBUM ART & METADATA ENRICHMENT
// ==========================================
async function fetchTrackMetadata(title, artist) {
  const query = `${title} ${artist}`.trim();
  if (query === lastTrackKey && cachedAlbumArt) {
    return { albumCover: cachedAlbumArt, duration: cachedDuration, album: cachedAlbumName };
  }

  try {
    const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=1`);
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      const item = data.results[0];
      cachedAlbumArt = item.artworkUrl100 ? item.artworkUrl100.replace('100x100bb', '600x600bb') : null;
      cachedDuration = item.trackTimeMillis ? Math.round(item.trackTimeMillis / 1000) : 200;
      cachedAlbumName = item.collectionName || 'Single';
      lastTrackKey = query;
      return { albumCover: cachedAlbumArt, duration: cachedDuration, album: cachedAlbumName };
    }
  } catch (e) {}
  return { albumCover: null, duration: 200, album: 'Spotify' };
}

// 1-second stopwatch that ONLY ticks when Desktop Spotify is actively Playing
function startServerStopwatch() {
  setInterval(() => {
    if (currentMediaState.status === 'Playing') {
      const maxDur = currentMediaState.duration || 200;
      if (trackedPositionSec < maxDur) {
        trackedPositionSec += 1;
      }
      currentMediaState.position = trackedPositionSec;

      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('live-media-data', currentMediaState);
      }
    }
  }, 1000);
}

// ==========================================
// 3. WINDOWS SMTC & SPOTIFY PROCESS WATCHER
// ==========================================
function startWindowsMediaWatcher() {
  const psScriptPath = path.join(os.tmpdir(), 'aurabar_media_watcher_v5.ps1');
  const escapedCmdPath = smtcCmdFile.replace(/\\/g, '\\\\');

  const scriptLines = [
    '[Console]::OutputEncoding = [System.Text.Encoding]::UTF8',
    'Add-Type -AssemblyName System.Runtime.WindowsRuntime',
    '$asTaskGeneric = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq "AsTask" -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq "IAsyncOperation`1" })[0]',
    'function Await($WinRtTask, $ResultType) {',
    '  try {',
    '    $asTask = $asTaskGeneric.MakeGenericMethod($ResultType)',
    '    $netTask = $asTask.Invoke($null, @($WinRtTask))',
    '    if ($netTask.Wait(700)) { return $netTask.Result }',
    '  } catch {}',
    '  return $null',
    '}',
    '$wshell = New-Object -ComObject WScript.Shell',
    '$manager = $null',
    'try {',
    '  [Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager,Windows.Media.Control,ContentType=WindowsRuntime] | Out-Null',
    '  $manager = Await ([Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager]::RequestAsync()) ([Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager])',
    '} catch {}',
    `$cmdFile = "${escapedCmdPath}"`,
    'while ($true) {',
    '  try {',
    '    $spotProcs = Get-Process -Name Spotify -ErrorAction SilentlyContinue',
    '    if (-not $spotProcs) {',
    '      if (Test-Path $cmdFile) { Remove-Item $cmdFile -Force -ErrorAction SilentlyContinue }',
    '      $closedObj = @{ status = "Closed"; title = "Spotify Closed"; artist = "Open Spotify on PC"; position = 0; duration = 0 }',
    '      [Console]::WriteLine(($closedObj | ConvertTo-Json -Compress))',
    '      [Console]::Out.Flush()',
    '      Start-Sleep -Milliseconds 1000',
    '      continue',
    '    }',
    '    $activeSession = $null',
    '    if ($manager) {',
    '      $sessions = $manager.GetSessions()',
    '      $activeSession = $sessions | Where-Object { $_.SourceAppUserModelId -like "*Spotify*" } | Select-Object -First 1',
    '    }',
    '    if (Test-Path $cmdFile) {',
    '      $rawCmd = (Get-Content $cmdFile -Raw -ErrorAction SilentlyContinue).Trim()',
    '      Remove-Item $cmdFile -Force -ErrorAction SilentlyContinue',
    '      if ($activeSession) {',
    '        if ($rawCmd -eq "PLAYPAUSE") { $null = Await ($activeSession.TryTogglePlayPauseAsync()) ([bool]) }',
    '        elseif ($rawCmd -eq "PAUSE") { $null = Await ($activeSession.TryPauseAsync()) ([bool]) }',
    '        elseif ($rawCmd -eq "NEXT") { $null = Await ($activeSession.TrySkipNextAsync()) ([bool]) }',
    '        elseif ($rawCmd -eq "PREV") { $null = Await ($activeSession.TrySkipPreviousAsync()) ([bool]) }',
    '        elseif ($rawCmd -like "SEEK:*") {',
    '          $sec = [long]($rawCmd.Split(":")[1])',
    '          $ticks = [long]($sec * 10000000)',
    '          $null = Await ($activeSession.TryChangePlaybackPositionAsync($ticks)) ([bool])',
    '        }',
    '      } else {',
    '        if ($rawCmd -eq "PLAYPAUSE") { $wshell.SendKeys([char]0xB3) }',
    '        elseif ($rawCmd -eq "NEXT") { $wshell.SendKeys([char]0xB0) }',
    '        elseif ($rawCmd -eq "PREV") { $wshell.SendKeys([char]0xB1) }',
    '      }',
    '      Start-Sleep -Milliseconds 150',
    '    }',
    '    $emitted = $false',
    '    if ($activeSession) {',
    '      $media = Await ($activeSession.TryGetMediaPropertiesAsync()) ([Windows.Media.Control.GlobalSystemMediaTransportControlsSessionMediaProperties])',
    '      $playback = $activeSession.GetPlaybackInfo()',
    '      $timeline = $activeSession.GetTimelineProperties()',
    '      if ($media -and $media.Title) {',
    '        $stat = if ($playback) { $playback.PlaybackStatus.ToString() } else { "Playing" }',
    '        $dur = if ($timeline -and $timeline.EndTime.TotalSeconds -gt 0) { [int][Math]::Round($timeline.EndTime.TotalSeconds) } else { 0 }',
    '        $basePos = if ($timeline -and $timeline.Position.TotalSeconds -ge 0) { $timeline.Position.TotalSeconds } else { -1 }',
    '        $pos = -1',
    '        if ($basePos -ge 0) {',
    '          $pos = [int][Math]::Floor($basePos)',
    '          if (($stat -eq "Playing" -or $stat -eq "4") -and $timeline.LastUpdatedTime -and $timeline.LastUpdatedTime.Year -gt 2000) {',
    '            $elapsed = ([DateTimeOffset]::UtcNow - $timeline.LastUpdatedTime).TotalSeconds',
    '            if ($elapsed -ge 0 -and $elapsed -lt 3600) {',
    '              $pos = [int][Math]::Floor($basePos + $elapsed)',
    '            }',
    '          }',
    '        }',
    '        $obj = @{ title = $media.Title; artist = (if ($media.Artist) { $media.Artist } else { "Spotify" }); status = $stat; position = $pos; duration = $dur }',
    '        [Console]::WriteLine(($obj | ConvertTo-Json -Compress))',
    '        [Console]::Out.Flush()',
    '        $emitted = $true',
    '      }',
    '    }',
    '    if (-not $emitted) {',
    '      $titledProcs = $spotProcs | Where-Object { $_.MainWindowTitle -ne "" }',
    '      foreach ($p in $titledProcs) {',
    '        $t = $p.MainWindowTitle.Trim()',
    '        if ($t -match "^(.*?)\\s+-\\s+(.*)$") {',
    '          $obj = @{ title = $matches[2].Trim(); artist = $matches[1].Trim(); status = "Playing"; position = -1; duration = 0 }',
    '          [Console]::WriteLine(($obj | ConvertTo-Json -Compress))',
    '          [Console]::Out.Flush()',
    '          break',
    '        } elseif ($t -eq "Spotify" -or $t -like "Spotify *") {',
    '          $obj = @{ status = "Paused" }',
    '          [Console]::WriteLine(($obj | ConvertTo-Json -Compress))',
    '          [Console]::Out.Flush()',
    '          break',
    '        }',
    '      }',
    '    }',
    '  } catch {}',
    '  Start-Sleep -Milliseconds 400',
    '}'
  ];

  try {
    fs.writeFileSync(psScriptPath, scriptLines.join('\r\n'), 'utf8');
  } catch (e) {}

  mediaWorker = spawn('powershell.exe', ['-NoLogo', '-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', psScriptPath], {
    windowsHide: true
  });

  let buffer = '';

  mediaWorker.stdout.on('data', async (chunk) => {
    buffer += chunk.toString('utf8');
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop();

    for (const line of lines) {
      if (!line.trim() || !line.startsWith('{')) continue;
      try {
        const raw = JSON.parse(line.trim());

        if (raw.status === 'Closed') {
          trackedPositionSec = 0;
          currentMediaState = {
            title: 'Spotify Closed',
            artist: 'Open Spotify on PC',
            album: 'Spotify',
            status: 'Paused',
            position: 0,
            duration: 0,
            albumCover: currentMediaState.albumCover
          };
          if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('live-media-data', currentMediaState);
          }
          continue;
        }

        if (raw.title && raw.artist) {
          const trackChanged = raw.title !== currentMediaState.title || raw.artist !== currentMediaState.artist;
          const meta = await fetchTrackMetadata(raw.title, raw.artist);
          const totalDur = raw.duration > 0 ? raw.duration : meta.duration;
          const isNowPlaying = raw.status === 'Playing' || raw.status === '4';

          if (trackChanged) {
            trackedPositionSec = raw.position >= 0 ? raw.position : 0;
          } else if (raw.position >= 0 && (Date.now() - lastSeekTimestamp > 2500)) {
            trackedPositionSec = Math.min(totalDur, raw.position);
          }

          currentMediaState = {
            title: raw.title,
            artist: raw.artist,
            album: meta.album,
            status: isNowPlaying ? 'Playing' : 'Paused',
            position: trackedPositionSec,
            duration: totalDur,
            albumCover: meta.albumCover || currentMediaState.albumCover
          };
        } else if (raw.status) {
          currentMediaState.status = raw.status === 'Playing' || raw.status === '4' ? 'Playing' : 'Paused';
        }

        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('live-media-data', currentMediaState);
        }
      } catch (e) {}
    }
  });

  mediaWorker.on('exit', () => setTimeout(startWindowsMediaWatcher, 1500));
}

// ==========================================
// 4. DISPLAY BOUNDS & WINDOW CREATION
// ==========================================
function resolveAuraBarDisplay() {
  const displays = screen.getAllDisplays();
  const primary = screen.getPrimaryDisplay();

  const match = displays.find(d => 
    (d.bounds.width === 1920 && d.bounds.height === 480) ||
    (d.bounds.width === 480 && d.bounds.height === 1920)
  ) || displays.find(d => d.id !== primary.id);

  if (match) {
    auraBounds = { x: match.bounds.x, y: match.bounds.y, width: 1920, height: 480 };
  } else {
    auraBounds = { x: primary.bounds.x, y: primary.bounds.y, width: 1920, height: 480 };
  }
  return auraBounds;
}

function configureCleanSession(ses) {
  ses.setUserAgent(CHROME_UA);
  ses.setPermissionRequestHandler((_wc, permission, callback) => {
    const allowed = ['media', 'mediaKeySystem', 'autoplay', 'notifications', 'fullscreen'];
    callback(allowed.includes(permission));
  });
}

function createAuraBarWindow() {
  resolveAuraBarDisplay();

  configureCleanSession(session.defaultSession);
  configureCleanSession(session.fromPartition('persist:aurabar_apps'));

  mainWindow = new BrowserWindow({
    x: auraBounds.x,
    y: auraBounds.y,
    width: auraBounds.width,
    height: auraBounds.height,
    frame: false,
    transparent: false,
    backgroundColor: '#0a0d14',
    resizable: false,
    fullscreen: false,
    alwaysOnTop: false,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true,
      plugins: true,
      backgroundThrottling: false,
      preload: path.join(__dirname, 'preload.cjs')
    }
  });

  app.on('web-contents-created', (_event, contents) => {
    if (contents.getType() === 'webview') {
      contents.setUserAgent(CHROME_UA);
      contents.setWindowOpenHandler(({ url }) => {
        contents.loadURL(url);
        return { action: 'deny' };
      });
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html')).catch(() => {
    mainWindow.loadURL('http://localhost:5173');
  });

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('live-media-data', currentMediaState);
  });

  const handleDisplayChange = () => {
    resolveAuraBarDisplay();
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.setBounds(auraBounds);
    }
  };

  screen.on('display-metrics-changed', handleDisplayChange);
  screen.on('display-added', handleDisplayChange);
  screen.on('display-removed', handleDisplayChange);
}

// ==========================================
// 5. HARDWARE TELEMETRY & RUNNING DOCK APPS
// ==========================================
let prevCpuInfo = os.cpus();

function getLightweightCpuUsage() {
  const currentCpus = os.cpus();
  let idleDiff = 0;
  let totalDiff = 0;

  for (let i = 0; i < currentCpus.length; i++) {
    const prev = prevCpuInfo[i].times;
    const curr = currentCpus[i].times;
    const prevTotal = prev.user + prev.nice + prev.sys + prev.idle + prev.irq;
    const currTotal = curr.user + curr.nice + curr.sys + curr.idle + curr.irq;

    idleDiff += curr.idle - prev.idle;
    totalDiff += currTotal - prevTotal;
  }

  prevCpuInfo = currentCpus;
  return totalDiff === 0 ? 18 : Math.max(1, Math.min(100, Math.round(100 - (100 * idleDiff) / totalDiff)));
}

function scanRunningDesktopApps() {
  exec('tasklist /NH /FO CSV', (_err, stdout) => {
    if (!stdout) return;
    const lower = stdout.toLowerCase();
    const detected = [];
    if (lower.includes('spotify.exe')) detected.push('Spotify');
    if (lower.includes('valorant') || lower.includes('riotclient')) detected.push('Valorant');
    if (lower.includes('brave.exe')) detected.push('Brave');
    if (lower.includes('discord.exe')) detected.push('Discord');
    if (lower.includes('code.exe')) detected.push('VS Code');
    if (lower.includes('steam.exe')) detected.push('Steam');
    if (lower.includes('obs64.exe')) detected.push('OBS Studio');
    if (lower.includes('windowsterminal.exe') || lower.includes('wt.exe')) detected.push('Terminal');
    activeRunningApps = detected;
  });
}

function startLightweightTelemetry() {
  setInterval(scanRunningDesktopApps, 3000);
  scanRunningDesktopApps();

  setInterval(() => {
    if (!mainWindow || mainWindow.isDestroyed()) return;

    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const cpuSpeed = os.cpus()[0]?.speed || 2600;

    mainWindow.webContents.send('telemetry-data', {
      cpu: getLightweightCpuUsage(),
      cpuGhz: (cpuSpeed / 1000).toFixed(2),
      ramUsed: (usedMem / (1024 ** 3)).toFixed(1),
      ramTotal: (totalMem / (1024 ** 3)).toFixed(1),
      ramPercent: Math.round((usedMem / totalMem) * 100),
      nvidiaLoad: Math.min(100, Math.round(14 + Math.random() * 8)),
      intelLoad: 18,
      diskLoad: 2,
      runningApps: activeRunningApps
    });
  }, 1000);
}

// ==========================================
// 6. ARDUINO RP2040 SERIAL & HOTKEYS
// ==========================================
function initSerialHardware() {
  try {
    const { SerialPort } = require('serialport');
    const { ReadlineParser } = require('@serialport/parser-readline');

    SerialPort.list().then(ports => {
      const arduinoPort = ports.find(p => 
        (p.manufacturer && (p.manufacturer.toLowerCase().includes('arduino') || p.manufacturer.toLowerCase().includes('raspberry'))) ||
        (p.friendlyName && (p.friendlyName.toLowerCase().includes('ch340') || p.friendlyName.toLowerCase().includes('rp2040'))) ||
        p.vendorId
      );

      if (arduinoPort) {
        const port = new SerialPort({ path: arduinoPort.path, baudRate: 115200 });
        const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

        parser.on('data', line => {
          const raw = line.trim();
          if (raw === 'KNOB_UP') {
            sendFastKey('$wshell.SendKeys([char]0xAF)');
            mainWindow?.webContents.send('simulated-knob-step', 'up');
          } else if (raw === 'KNOB_DOWN') {
            sendFastKey('$wshell.SendKeys([char]0xAE)');
            mainWindow?.webContents.send('simulated-knob-step', 'down');
          } else if (raw === 'KNOB_MUTE') {
            sendFastKey('$wshell.SendKeys([char]0xAD)');
            mainWindow?.webContents.send('simulated-knob-step', 'mute');
          } else if (raw.startsWith('KEY_')) {
            executeMacroAction(raw.replace('KEY_', ''));
          }
        });
      }
    }).catch(() => {});
  } catch (e) {}
}

function executeMacroAction(key) {
  if (key === 'F7' || key === 'M1') {
    exec('taskmgr');
    mainWindow?.webContents.send('simulated-macro-key', { key: 'M1 / F7', label: 'Task Manager' });
  } else if (key === 'F8' || key === 'M2') {
    exec('start explorer shell:::{2559a160-21d7-11d4-bdaf-00c04f60b9f0}');
    mainWindow?.webContents.send('simulated-macro-key', { key: 'M2 / F8', label: 'Windows Search' });
  } else if (key === 'F9' || key === 'M3') {
    exec('snippingtool');
    mainWindow?.webContents.send('simulated-macro-key', { key: 'M3 / F9', label: 'Screen Snipping' });
  }
}

function registerTestbenchHotkeys() {
  globalShortcut.unregisterAll();
  const tryRegister = (acc, cb) => {
    try { globalShortcut.register(acc, cb); } catch (e) {}
  };

  tryRegister('ArrowUp', () => {
    sendFastKey('$wshell.SendKeys([char]0xAF)');
    mainWindow?.webContents.send('simulated-knob-step', 'up');
  });

  tryRegister('ArrowDown', () => {
    sendFastKey('$wshell.SendKeys([char]0xAE)');
    mainWindow?.webContents.send('simulated-knob-step', 'down');
  });

  tryRegister('Backslash', () => {
    sendFastKey('$wshell.SendKeys([char]0xAD)');
    mainWindow?.webContents.send('simulated-knob-step', 'mute');
  });

  tryRegister('F7', () => executeMacroAction('F7'));
  tryRegister('F8', () => executeMacroAction('F8'));
  tryRegister('F9', () => executeMacroAction('F9'));
}

// ==========================================
// 7. IPC HANDLERS
// ==========================================
ipcMain.handle('get-live-media', () => currentMediaState);

ipcMain.on('seek-media', (_e, seconds) => {
  const sec = Math.max(0, Math.round(seconds));
  trackedPositionSec = sec;
  lastSeekTimestamp = Date.now();
  currentMediaState.position = sec;
  queueSmtcCommand(`SEEK:${sec}`);
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('live-media-data', currentMediaState);
  }
});

ipcMain.on('send-key', (_, action) => {
  if (action === 'play-pause') {
    currentMediaState.status = currentMediaState.status === 'Playing' ? 'Paused' : 'Playing';
    queueSmtcCommand('PLAYPAUSE');
  } else if (action === 'pause-only') {
    currentMediaState.status = 'Paused';
    queueSmtcCommand('PAUSE');
  } else if (action === 'next') {
    trackedPositionSec = 0;
    currentMediaState.position = 0;
    queueSmtcCommand('NEXT');
  } else if (action === 'prev') {
    trackedPositionSec = 0;
    currentMediaState.position = 0;
    queueSmtcCommand('PREV');
  } else if (action === 'mute') {
    sendFastKey('$wshell.SendKeys([char]0xAD)');
  } else if (action === 'mic-mute') {
    sendFastKey('$wshell.SendKeys("^+m")');
  }
});

ipcMain.on('set-volume-step', (_, direction) => {
  const vKey = direction === 'up' ? '0xAF' : (direction === 'mute' ? '0xAD' : '0xAE');
  sendFastKey(`$wshell.SendKeys([char]${vKey})`);
});

ipcMain.on('trigger-macro-action', (_, key) => executeMacroAction(key));

ipcMain.on('launch-app-target', (_event, appConfig) => {
  const { name, target } = appConfig;

  if (name && name.toLowerCase() === 'spotify') {
    mainWindow?.webContents.send('open-spotify-deck');
    ensureSpotifyRunningSilently();
    return;
  }

  if (target && target.endsWith('.exe')) {
    exec(`start "" "${target}"`);
    return;
  }

  if (name === 'Discord') exec('start discord:');
  else if (name === 'Brave') exec('start brave');
  else if (name === 'Valorant') {
    exec('start "" "C:\\Riot Games\\Riot Client\\RiotClientServices.exe" --launch-product=valorant --launch-patchline=live', (err) => {
      if (err) exec('start valorant:');
    });
  } else if (name === 'VS Code') exec('code .');
  else if (name === 'Steam') shell.openPath('C:\\Program Files (x86)\\Steam\\steam.exe');
  else if (name === 'OBS Studio') shell.openPath('C:\\Program Files\\obs-studio\\bin\\64bit\\obs64.exe');
  else if (name === 'Terminal') exec('start wt');
});

ipcMain.handle('select-executable-file', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Select Application Executable',
    filters: [{ name: 'Executables & Shortcuts', extensions: ['exe', 'lnk', 'url'] }],
    properties: ['openFile']
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const filePath = result.filePaths[0];
    return { filePath, fileName: path.basename(filePath, path.extname(filePath)) };
  }
  return null;
});

ipcMain.on('exit-app', () => app.quit());

app.whenReady().then(() => {
  startPersistentKeyWorker();
  createAuraBarWindow();
  startLightweightTelemetry();
  registerTestbenchHotkeys();
  startWindowsMediaWatcher();
  startServerStopwatch();
  initSerialHardware();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createAuraBarWindow();
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
  if (psWorker && !psWorker.killed) psWorker.kill();
  if (mediaWorker && !mediaWorker.killed) mediaWorker.kill();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});