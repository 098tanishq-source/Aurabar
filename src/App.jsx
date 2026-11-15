import React, { useState, useEffect, useRef } from 'react';
import HomeDashboard from './components/HomeDashboard';
import SpotifyCarThing from './components/SpotifyCarThing';

const defaultDockApps = [
  { id: 1, name: "Spotify", type: "desktop", icon: "🎧", color: "#1DB954" },
  { id: 2, name: "YT Music", type: "embedded", url: "https://music.youtube.com", icon: "🎵", color: "#FF0000" },
  { id: 3, name: "Valorant", type: "desktop", icon: "🎯", color: "#FF4655" },
  { id: 4, name: "Brave", type: "embedded", url: "https://search.brave.com", icon: "🦁", color: "#FB542B" },
  { id: 5, name: "Discord", type: "embedded", url: "https://discord.com/app", icon: "💬", color: "#5865F2" },
  { id: 6, name: "VS Code", type: "desktop", icon: "💻", color: "#007ACC" },
  { id: 7, name: "Steam", type: "desktop", icon: "🎮", color: "#171A21" },
  { id: 8, name: "OBS Studio", type: "desktop", icon: "🎥", color: "#302E31" },
  { id: 9, name: "Terminal", type: "desktop", icon: "⚡", color: "#0F1A1B" }
];

const Icons = {
  Play: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <polygon points="6 4 20 12 6 20 6 4" />
    </svg>
  ),
  Pause: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="4" width="4" height="16" rx="1.5" />
      <rect x="14" y="4" width="4" height="16" rx="1.5" />
    </svg>
  ),
  SkipBack: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <polygon points="19 20 9 12 19 4 19 20" />
      <line x1="5" y1="19" x2="5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  SkipForward: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 4 15 12 5 20 5 4" />
      <line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  Heart: ({ size = 15, filled = false }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "#ef4444" : "none"} stroke={filled ? "#ef4444" : "currentColor"} strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  Repeat: ({ size = 15 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  ),
  ListMusic: ({ size = 15 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15V6" /><path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
      <path d="M12 12H3" /><path d="M16 6H3" /><path d="M12 18H3" />
    </svg>
  ),
  CheckCircle: ({ size = 17, checked = false }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={checked ? "#1e293b" : "none"} stroke="#1e293b" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      {checked && <polyline points="16 9 10.5 14.5 8 12" stroke="#ffffff" strokeWidth="2.2" />}
    </svg>
  ),
  Plus: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Speedometer: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v2" /><path d="M4.93 4.93l1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" />
      <path d="M17.66 6.34l1.41-1.41" /><path d="M12 6a6 6 0 0 0-6 6c0 1.93.91 3.65 2.33 4.75L12 12" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  ),
  BarChart: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /><line x1="12" y1="20" x2="12" y2="8" />
    </svg>
  ),
  GridGauge: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" /><path d="M14 6a5 5 0 0 1 7 5" />
      <rect x="3" y="14" width="7" height="7" rx="1" /><circle cx="17.5" cy="17.5" r="3.5" />
    </svg>
  ),
  KnobDial: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="9" /><line x1="12" y1="3" x2="12" y2="8" />
    </svg>
  ),
  Settings: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  Mic: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  ),
  MicOff: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="1" y1="1" x2="23" y2="23" /><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
      <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
    </svg>
  ),
  Headphones: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  ),
  Video: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  ),
  Gamepad: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="6" y1="12" x2="10" y2="12" /><line x1="8" y1="10" x2="8" y2="14" />
      <rect x="2" y="6" width="20" height="12" rx="6" />
    </svg>
  ),
  Columns: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="12" y1="3" x2="12" y2="21" />
    </svg>
  ),
  X: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
};

export default function App() {
  const [activeProfile, setActiveProfile] = useState('NORMAL');
  const isGameMode = activeProfile === 'GAME';

  const [isSpotifyDeckOpen, setIsSpotifyDeckOpen] = useState(false);
  const [slot1App, setSlot1App] = useState(null);
  const [slot2App, setSlot2App] = useState(null);
  const [isSplitMode, setIsSplitMode] = useState(false);
  const [isEmbeddedMinimized, setIsEmbeddedMinimized] = useState(false);

  const [openedApps, setOpenedApps] = useState(['Spotify']);

  const [volume, setVolume] = useState(74);
  const [showVolOsd, setShowVolOsd] = useState(false);
  const [knobPulse, setKnobPulse] = useState(false);
  const [dialAngle, setDialAngle] = useState(45);
  const [macroFeedback, setMacroFeedback] = useState(null);

  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const [telemetry, setTelemetry] = useState({
    cpu: 18, cpuGhz: '2.60', ramUsed: '11.4', ramTotal: '15.7',
    ramPercent: 72, nvidiaLoad: 14, intelLoad: 18, diskLoad: 2,
    runningApps: ['Spotify', 'Discord']
  });

  const [currentTime, setCurrentTime] = useState('02:58');
  const [calendarInfo, setCalendarInfo] = useState({
    monthShort: 'NOV', monthFull: 'NOVEMBER', dayNum: 16, daysInMonth: 30, startDay: 6
  });

  const [tasks, setTasks] = useState([
    { id: 1, text: 'Discord Voice Connected.', done: true },
    { id: 2, text: 'Test Stream Deck Macros.', done: true },
    { id: 3, text: 'Calibrate Rotary Encoder.', done: false }
  ]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskInput, setNewTaskInput] = useState('');

  const [media, setMedia] = useState({
    title: 'Spotify Ready',
    artist: 'Play a song on Spotify',
    album: 'Spotify',
    status: 'Paused',
    position: 0,
    duration: 200,
    albumCover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600'
  });

  const [apps] = useState(() => {
    try {
      const saved = localStorage.getItem('aurabar_apps_v8');
      if (saved) return JSON.parse(saved);
      localStorage.setItem('aurabar_apps_v8', JSON.stringify(defaultDockApps));
    } catch (e) {}
    return defaultDockApps;
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const webview1Ref = useRef(null);
  const webview2Ref = useRef(null);
  const volOsdTimeoutRef = useRef(null);
  const optimisticLockRef = useRef(0);

  const triggerVolOsd = () => {
    setShowVolOsd(true);
    if (volOsdTimeoutRef.current) clearTimeout(volOsdTimeoutRef.current);
    volOsdTimeoutRef.current = setTimeout(() => setShowVolOsd(false), 1800);
  };

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);

      const monthsShort = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const monthsFull = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

      const mIdx = now.getMonth();
      const firstDay = new Date(now.getFullYear(), mIdx, 1).getDay();
      const adjustedStartDay = firstDay === 0 ? 6 : firstDay - 1;
      const totalDays = new Date(now.getFullYear(), mIdx + 1, 0).getDate();

      setCalendarInfo({
        monthShort: monthsShort[mIdx],
        monthFull: monthsFull[mIdx],
        dayNum: now.getDate(),
        daysInMonth: totalDays,
        startDay: adjustedStartDay
      });
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!window.electronAPI) return;

    window.electronAPI.getLiveMedia?.().then((initial) => {
      if (initial && initial.title) {
        setMedia(prev => ({ ...prev, ...initial, albumCover: initial.albumCover || prev.albumCover }));
      }
    });

    const unsubs = [
      window.electronAPI.onOpenSpotifyDeck(() => setIsSpotifyDeckOpen(true)),
      window.electronAPI.onLiveMediaData((data) => {
        if (Date.now() < optimisticLockRef.current) return;

        if (data && data.title) {
          setMedia(prev => ({
            ...prev,
            title: data.title,
            artist: data.artist || 'Spotify',
            album: data.album || prev.album,
            status: data.status || 'Paused',
            position: typeof data.position === 'number' ? data.position : prev.position,
            duration: data.duration || prev.duration,
            albumCover: data.albumCover || prev.albumCover
          }));
        } else if (data && data.status) {
          setMedia(prev => ({ ...prev, status: data.status }));
        }
      }),
      window.electronAPI.onTelemetryData(data => data && setTelemetry(data)),
      window.electronAPI.onSimulatedKnobStep((dir) => {
        setKnobPulse(true);
        triggerVolOsd();
        setTimeout(() => setKnobPulse(false), 200);
        if (dir === 'up') {
          setVolume(v => Math.min(100, v + 2));
          setDialAngle(a => a + 12);
          setIsDeafened(false);
        } else if (dir === 'down') {
          setVolume(v => Math.max(0, v - 2));
          setDialAngle(a => a - 12);
        } else if (dir === 'mute') {
          setIsDeafened(d => !d);
        }
      }),
      window.electronAPI.onSimulatedMacroKey(data => {
        setMacroFeedback(data);
        setTimeout(() => setMacroFeedback(null), 2000);
      })
    ];

    return () => unsubs.forEach(fn => typeof fn === 'function' && fn());
  }, []);

  // Seeking Handler: Directly seeks Desktop Spotify via Windows SMTC
  const handleSeek = (targetSeconds) => {
    optimisticLockRef.current = Date.now() + 1800;
    const clamped = Math.max(0, Math.min(media.duration || 200, targetSeconds));
    setMedia(prev => ({ ...prev, position: clamped }));
    window.electronAPI?.seekMedia?.(clamped);
  };

  // Clicking a song row skips Desktop Spotify forward so only ONE audio source ever plays
  const handleSelectTrackFromQueue = () => {
    optimisticLockRef.current = Date.now() + 1500;
    setMedia(prev => ({ ...prev, position: 0, status: 'Playing' }));
    window.electronAPI?.sendKey?.('next');
  };

  const handleVolumeChange = (newVol) => {
    const clamped = Math.min(100, Math.max(0, newVol));
    const diff = clamped - volume;
    if (diff === 0) return;

    const direction = diff > 0 ? 'up' : 'down';
    const steps = Math.max(1, Math.min(8, Math.round(Math.abs(diff) / 2)));

    for (let i = 0; i < steps; i++) {
      window.electronAPI?.setVolumeStep?.(direction);
    }

    setDialAngle(a => (diff > 0 ? a + 12 : a - 12));
    setVolume(clamped);
    if (clamped > 0 && isDeafened) setIsDeafened(false);
    setKnobPulse(true);
    triggerVolOsd();
    setTimeout(() => setKnobPulse(false), 180);
  };

  const handleToggleAudioMute = () => {
    window.electronAPI?.sendKey?.('mute');
    triggerVolOsd();
    setIsDeafened(prev => !prev);
  };

  const handleToggleMicMute = () => {
    window.electronAPI?.sendKey?.('mic-mute');
    setIsMicMuted(prev => {
      const next = !prev;
      setMacroFeedback({ key: 'MICROPHONE', label: next ? 'Microphone Muted' : 'Microphone Active' });
      setTimeout(() => setMacroFeedback(null), 1500);
      return next;
    });
  };

  const handleMediaAction = (action) => {
    optimisticLockRef.current = Date.now() + 1800;

    if (action === 'play-pause') {
      const nextStatus = media.status === 'Playing' ? 'Paused' : 'Playing';
      setMedia(m => ({ ...m, status: nextStatus }));
      window.electronAPI?.sendKey?.('play-pause');
      return;
    }

    if (action === 'next' || action === 'prev') {
      setMedia(prev => ({ ...prev, position: 0, status: 'Playing' }));
      window.electronAPI?.sendKey?.(action);
    }
  };

  const handleDockClick = (app) => {
    setOpenedApps(prev => (prev.includes(app.name) ? prev : [...prev, app.name]));

    if (app.name.toLowerCase() === 'spotify') {
      setIsSpotifyDeckOpen(true);
      window.electronAPI?.launchAppTarget?.(app);
      return;
    }

    if (app.type === 'embedded') {
      setIsSpotifyDeckOpen(false);
      setIsEmbeddedMinimized(false);
      if (!slot1App) setSlot1App(app);
      else if (!isSplitMode) {
        setSlot1App(app);
      } else {
        if (!slot2App && slot1App.id !== app.id) setSlot2App(app);
        else if (slot1App.id !== app.id) setSlot2App(app);
      }
      return;
    }

    window.electronAPI?.launchAppTarget?.(app);
  };

  const handleWebviewReady = (ref) => {
    if (ref.current) {
      ref.current.insertCSS(`
        body { zoom: 0.76 !important; overflow-y: auto !important; }
        ytmusic-nav-bar { height: 44px !important; }
      `);
    }
  };

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    setTasks(prev => [...prev, { id: Date.now(), text: newTaskInput.trim(), done: false }]);
    setNewTaskInput('');
    setIsAddingTask(false);
  };

  const deleteTask = (id, e) => {
    e.stopPropagation();
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleCloseSpotifyDeck = () => {
    setIsSpotifyDeckOpen(false);
  };

  const handleSwitchToYtMusic = () => {
    const ytApp = apps.find(a => a.name === 'YT Music') || defaultDockApps[1];
    setIsSpotifyDeckOpen(false);
    setIsEmbeddedMinimized(false);
    setSlot1App(ytApp);
  };

  const handleToggleSplitMode = () => {
    if (isSplitMode) {
      setIsSplitMode(false);
      setSlot2App(null);
    } else {
      setIsSplitMode(true);
    }
  };

  const handleCloseEmbeddedTabs = () => {
    const closingNames = [slot1App?.name, slot2App?.name].filter(Boolean);
    setOpenedApps(prev => prev.filter(n => !closingNames.includes(n)));
    setSlot1App(null);
    setSlot2App(null);
    setIsSplitMode(false);
    setIsEmbeddedMinimized(false);
  };

  const handleToggleProfileMode = () => {
    setActiveProfile(p => (p === 'NORMAL' ? 'GAME' : 'NORMAL'));
  };

  const handleOpenSpotifyFromDashboard = () => {
    setIsSpotifyDeckOpen(true);
    window.electronAPI?.launchAppTarget?.({ name: 'Spotify' });
  };

  const allOpenAppNames = Array.from(new Set([
    ...(telemetry.runningApps || []),
    ...openedApps,
    ...(isSpotifyDeckOpen ? ['Spotify'] : []),
    ...(slot1App ? [slot1App.name] : []),
    ...(slot2App ? [slot2App.name] : [])
  ]));

  const showEmbeddedStage = Boolean(slot1App && !isEmbeddedMinimized && !isSpotifyDeckOpen);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', userSelect: 'none' }}>
      <link href="https://fonts.googleapis.com/css2?family=Audiowide&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes vinylSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spinning-disc {
          animation: vinylSpin 5s linear infinite;
        }
        .paused-disc {
          animation-play-state: paused;
        }
      `}</style>

      {/* ── View 1: Spotify Automotive Deck ── */}
      {isSpotifyDeckOpen && (
        <SpotifyCarThing
          media={media}
          onClose={handleCloseSpotifyDeck}
          onControl={handleMediaAction}
          onSelectTrack={handleSelectTrackFromQueue}
          onSeek={handleSeek}
          volume={volume}
          onVolumeChange={handleVolumeChange}
          showVolOsd={showVolOsd}
          isMuted={isDeafened}
          onToggleMute={handleToggleAudioMute}
          onOpenYtMusic={handleSwitchToYtMusic}
        />
      )}

      {/* ── View 2: Embedded YT Music / Brave / Discord 50-50 Split View ── */}
      {showEmbeddedStage ? (
        <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, zIndex: 20, display: 'flex', backgroundColor: '#000000', paddingBottom: '54px', boxSizing: 'border-box' }}>
          <div style={{
            position: 'absolute', top: '10px', right: '20px', zIndex: 50, display: 'flex', alignItems: 'center',
            gap: '8px', backgroundColor: '#0f172a', padding: '5px 12px', borderRadius: '999px',
            border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 8px 24px rgba(0,0,0,0.65)'
          }}>
            <button
              onClick={handleToggleSplitMode}
              style={{
                ...pillBtn,
                color: isSplitMode ? '#38bdf8' : '#ffffff',
                backgroundColor: isSplitMode ? 'rgba(56,189,248,0.22)' : 'transparent',
                borderRadius: '6px'
              }}
            >
              <Icons.Columns size={14} /> {isSplitMode ? 'Split Mode' : 'Split'}
            </button>

            <div style={{ width: '1px', height: '14px', backgroundColor: 'rgba(255,255,255,0.15)' }} />

            <button
              onClick={() => setIsEmbeddedMinimized(true)}
              style={{ ...pillBtn, color: '#cbd5e1' }}
            >
              ← Back to Dashboard
            </button>

            <button
              onClick={() => setIsEmbeddedMinimized(true)}
              style={{ ...pillBtn, color: '#38bdf8' }}
            >
              ─ Minimize
            </button>

            <button
              onClick={handleCloseEmbeddedTabs}
              style={{ ...pillBtn, color: '#f87171' }}
            >
              <Icons.X size={13} /> Close Tab
            </button>
          </div>

          <div style={{ flex: 1, height: '100%', position: 'relative', borderRight: isSplitMode ? '2px solid rgba(255,255,255,0.15)' : 'none' }}>
            <webview
              ref={webview1Ref}
              src={slot1App.url}
              partition="persist:aurabar_apps"
              style={{ width: '100%', height: '100%', border: 'none' }}
              allowpopups="true"
              onDomReady={() => handleWebviewReady(webview1Ref)}
            />
          </div>

          {isSplitMode && (
            <div style={{ flex: 1, height: '100%', position: 'relative' }}>
              {slot2App ? (
                <webview
                  ref={webview2Ref}
                  src={slot2App.url}
                  partition="persist:aurabar_apps"
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  allowpopups="true"
                  onDomReady={() => handleWebviewReady(webview2Ref)}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', color: '#94a3b8' }}>
                  <Icons.Columns size={32} />
                  <span style={{ marginTop: '10px', fontSize: '13px', fontWeight: 700, color: '#e2e8f0' }}>
                    Tap a 2nd App in the Dock below to open side-by-side
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* ── View 3: Main Desktop Dashboard Cockpit ── */
        <HomeDashboard
          media={media}
          telemetry={telemetry}
          currentTime={currentTime}
          calendarInfo={calendarInfo}
          tasks={tasks}
          onToggleTask={toggleTask}
          isAddingTask={isAddingTask}
          setIsAddingTask={setIsAddingTask}
          newTaskInput={newTaskInput}
          setNewTaskInput={setNewTaskInput}
          onAddTask={addTask}
          onDeleteTask={deleteTask}
          isVideoOff={isVideoOff}
          setIsVideoOff={setIsVideoOff}
          isMicMuted={isMicMuted}
          onToggleMicMute={handleToggleMicMute}
          isDeafened={isDeafened}
          onToggleAudioMute={handleToggleAudioMute}
          isGameMode={isGameMode}
          onToggleProfile={handleToggleProfileMode}
          onOpenSpotifyDeck={handleOpenSpotifyFromDashboard}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onControl={handleMediaAction}
          onSeek={handleSeek}
          volume={volume}
          dialAngle={dialAngle}
          knobPulse={knobPulse}
          onVolumeChange={handleVolumeChange}
          Icons={Icons}
        />
      )}

      {/* ── GLOBAL WINDOWS-STYLE TASKBAR DOCK ── */}
      {!isSpotifyDeckOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '6px',
            left: '47%',
            transform: 'translateX(-50%)',
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.25)',
            padding: '4px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 60
          }}
        >
          {apps.map((app) => {
            const isOpen = allOpenAppNames.includes(app.name);
            return (
              <div
                key={app.id}
                onClick={() => handleDockClick(app)}
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  padding: '4px 7px 6px 7px',
                  borderRadius: '12px',
                  backgroundColor: isOpen ? '#f1f5f9' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    backgroundColor: app.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '13px',
                    boxShadow: isOpen ? '0 2px 8px rgba(0,0,0,0.18)' : 'none'
                  }}
                >
                  {app.icon}
                </div>
                <span style={{ fontSize: '7px', fontWeight: 800, color: '#1e293b' }}>{app.name}</span>

                {isOpen && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '2px',
                      width: '12px',
                      height: '3px',
                      borderRadius: '999px',
                      backgroundColor: '#0284c7'
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Toast Feedback */}
      {macroFeedback && (
        <div style={{
          position: 'fixed', top: '14px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 110, backgroundColor: '#0f172a', border: '1px solid #38bdf8',
          borderRadius: '999px', padding: '5px 16px', display: 'flex', alignItems: 'center',
          gap: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
        }}>
          <span style={{ backgroundColor: '#0284c7', color: '#ffffff', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 800 }}>
            {macroFeedback.key}
          </span>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff' }}>
            {macroFeedback.label}
          </span>
        </div>
      )}
    </div>
  );
}

const pillBtn = {
  background: 'none',
  border: 'none',
  color: '#ffffff',
  fontSize: '11.5px',
  fontWeight: 700,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '4px 8px'
};