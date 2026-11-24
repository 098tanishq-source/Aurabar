import React, { useState, useEffect, useRef } from 'react';
import HomeDashboard from './components/HomeDashboard';
import SpotifyCarThing from './components/SpotifyCarThing';

export default function App() {
  const [isSpotifyDeckOpen, setIsSpotifyDeckOpen] = useState(false);
  const [embeddedApp, setEmbeddedApp] = useState(null);
  const [isEmbeddedMinimized, setIsEmbeddedMinimized] = useState(false);

  const [openedApps, setOpenedApps] = useState(['Spotify']);
  const [volume, setVolume] = useState(74);

  const [media, setMedia] = useState({
    title: 'Starboy',
    artist: 'The Weeknd',
    album: 'Starboy',
    status: 'Paused',
    position: 20,
    duration: 230,
    albumCover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300'
  });

  const [telemetry, setTelemetry] = useState({
    cpu: 18,
    cpuGhz: '2.60',
    cpuTemp: 25,
    ramUsed: '11.4',
    ramTotal: '15.7',
    ramPercent: 58
  });

  const [currentTime, setCurrentTime] = useState('21:23');
  const [calendarInfo, setCalendarInfo] = useState({
    year: '2026',
    monthNum: '11',
    monthFull: 'NOVEMBER',
    dayNum: 24
  });

  const webviewRef = useRef(null);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(
        `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      );
      setCalendarInfo({
        year: String(now.getFullYear()),
        monthNum: String(now.getMonth() + 1).padStart(2, '0'),
        monthFull: now.toLocaleString('en-US', { month: 'long' }).toUpperCase(),
        dayNum: now.getDate()
      });
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!window.electronAPI) return;

    window.electronAPI.getLiveMedia?.().then((initial) => {
      if (initial && initial.title) {
        setMedia((prev) => ({ ...prev, ...initial }));
      }
    });

    const unsubs = [
      window.electronAPI.onOpenSpotifyDeck?.(() => {
        setOpenedApps((prev) => (prev.includes('Spotify') ? prev : [...prev, 'Spotify']));
        setIsSpotifyDeckOpen(true);
      }),
      window.electronAPI.onLiveMediaData?.((data) => {
        if (data && data.title) {
          setMedia((prev) => ({
            ...prev,
            title: data.title,
            artist: data.artist || 'Spotify',
            album: data.album || prev.album,
            status: data.status || prev.status,
            position: typeof data.position === 'number' ? data.position : prev.position,
            duration: data.duration || prev.duration,
            albumCover: data.albumCover || prev.albumCover
          }));
        } else if (data && data.status) {
          setMedia((prev) => ({ ...prev, status: data.status }));
        }
      }),
      window.electronAPI.onTelemetryData?.((data) => {
        if (data && typeof data === 'object') {
          setTelemetry((prev) => ({ ...prev, ...data }));
        }
      }),
      window.electronAPI.onSimulatedKnobStep?.((dir) => {
        if (dir === 'up') setVolume((v) => Math.min(100, v + 2));
        else if (dir === 'down') setVolume((v) => Math.max(0, v - 2));
      })
    ];

    return () => unsubs.forEach((fn) => typeof fn === 'function' && fn());
  }, []);

  const handleVolumeChange = (newVol) => {
    const clamped = Math.min(100, Math.max(0, newVol));
    setVolume(clamped);
    window.electronAPI?.setVolumeStep?.(newVol > volume ? 'up' : 'down');
  };

  const handleMediaControl = (action) => {
    if (action === 'play-pause') {
      setMedia((m) => ({ ...m, status: m.status === 'Playing' ? 'Paused' : 'Playing' }));
    }
    window.electronAPI?.sendKey?.(action);
  };

  const handleSeek = (sec) => {
    setMedia((m) => ({ ...m, position: sec }));
    window.electronAPI?.seekMedia?.(sec);
  };

  const handleLaunchApp = (appConfig) => {
    const appName = appConfig.name || '';
    setOpenedApps((prev) => (prev.includes(appName) ? prev : [...prev, appName]));

    if (appName.toLowerCase() === 'spotify') {
      setIsSpotifyDeckOpen(true);
      return;
    }

    if (appName === 'YT Music') {
      setIsSpotifyDeckOpen(false);
      setIsEmbeddedMinimized(false);
      setEmbeddedApp({ name: 'YT Music', url: 'https://music.youtube.com' });
      return;
    }

    window.electronAPI?.launchAppTarget?.(appConfig);
  };

  const handleCloseEmbedded = () => {
    if (embeddedApp) {
      setOpenedApps((prev) => prev.filter((n) => n !== embeddedApp.name));
    }
    setEmbeddedApp(null);
    setIsEmbeddedMinimized(false);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', userSelect: 'none' }}>
      {/* ── View 1: Spotify Deck ── */}
      {isSpotifyDeckOpen && (
        <SpotifyCarThing
          media={media}
          onClose={() => setIsSpotifyDeckOpen(false)}
          onMinimize={() => setIsSpotifyDeckOpen(false)}
          onOpenYTMusic={() => handleLaunchApp({ name: 'YT Music' })}
          onControl={handleMediaControl}
          onSeek={handleSeek}
          volume={volume}
          onVolumeChange={handleVolumeChange}
        />
      )}

      {/* ── View 2: Embedded YouTube Music ── */}
      {embeddedApp && !isEmbeddedMinimized && !isSpotifyDeckOpen && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 40,
            backgroundColor: '#000000',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '12px',
              right: '20px',
              zIndex: 50,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(15, 23, 42, 0.88)',
              backdropFilter: 'blur(20px)',
              padding: '6px 14px',
              borderRadius: '999px',
              border: '1px solid rgba(255,255,255,0.18)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.7)'
            }}
          >
            <button
              onClick={() => setIsEmbeddedMinimized(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#38bdf8',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              ← Back to Cockpit
            </button>

            <div style={{ width: '1px', height: '14px', backgroundColor: 'rgba(255,255,255,0.2)' }} />

            <button
              onClick={handleCloseEmbedded}
              style={{
                background: 'none',
                border: 'none',
                color: '#f87171',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              ✕ Close
            </button>
          </div>

          <webview
            ref={webviewRef}
            src={embeddedApp.url}
            partition="persist:aurabar_apps"
            style={{ width: '100%', height: '100%', border: 'none' }}
            allowpopups="true"
          />
        </div>
      )}

      {/* ── View 3: Main Cockpit Home ── */}
      <HomeDashboard
        currentTime={currentTime}
        calendarInfo={calendarInfo}
        telemetry={telemetry}
        media={media}
        openedApps={openedApps}
        onControl={handleMediaControl}
        onOpenSpotifyDeck={() => {
          setOpenedApps((prev) => (prev.includes('Spotify') ? prev : [...prev, 'Spotify']));
          setIsSpotifyDeckOpen(true);
        }}
        onLaunchApp={handleLaunchApp}
      />
    </div>
  );
}