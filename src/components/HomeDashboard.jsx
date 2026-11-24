import React, { useState, useRef, useEffect } from 'react';
import braveImg from '../assets/Brave.jpg';
import discordImg from '../assets/Discord.jpg';
import obsImg from '../assets/OBS.jpg';
import spotifyImg from '../assets/Spotify.jpg';
import steamImg from '../assets/Steam.jpg';
import valoImg from '../assets/Valo.jpg';
import ytmusicImg from '../assets/YTmusic.jpg';

const DEFAULT_WALLPAPER = 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?w=1920';
const DEFAULT_WIDGET_IMG = 'https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?w=400';

function WeatherIconMoon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#ffffff" fillOpacity="0.9" />
    </svg>
  );
}

function WeatherIconCloudMoon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M17 11a4 4 0 0 0-4-4 4 4 0 0 0-3.9 3.1A3.5 3.5 0 0 0 6 13.5 3.5 3.5 0 0 0 9.5 17h8a3.5 3.5 0 0 0 3.5-3.5 3.5 3.5 0 0 0-4-2.5z" fill="#cbd5e1" />
      <path d="M15 4a4.5 4.5 0 0 1 4 4.5 4.5 4.5 0 0 1-.2 1.3A4 4 0 0 0 17 9a4 4 0 0 0-3.8 2.8A4.5 4.5 0 0 1 15 4z" fill="#facc15" />
    </svg>
  );
}

function WeatherIconCloud({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M17.5 19H7a5 5 0 0 1-1-9.9 6 6 0 0 1 11.8-1.6A4.5 4.5 0 0 1 17.5 19z" fill="#94a3b8" />
    </svg>
  );
}

function ClockFace({ timeString }) {
  const [hours, minutes] = (timeString || '21:23').split(':');
  const ticks = Array.from({ length: 48 }, (_, i) => i);

  return (
    <div
      style={{
        width: '144px',
        height: '144px',
        backgroundColor: '#ffffff',
        borderRadius: '32px',
        boxShadow: '0 16px 36px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(0,0,0,0.06)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        overflow: 'hidden'
      }}
    >
      <div style={{ position: 'absolute', inset: '6px', pointerEvents: 'none' }}>
        {ticks.map((t) => {
          const angle = (t / 48) * 360;
          const isQuarter = t % 12 === 0;
          return (
            <div
              key={t}
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                width: isQuarter ? '2px' : '1px',
                height: isQuarter ? '7px' : '4px',
                backgroundColor: isQuarter ? '#0f172a' : '#cbd5e1',
                transformOrigin: '50% 66px',
                transform: `translateX(-50%) rotate(${angle}deg)`
              }}
            />
          );
        })}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          fontSize: '42px',
          fontWeight: 900,
          color: '#0a0a0a',
          letterSpacing: '-0.04em',
          fontFamily: "'SF Pro Display', -apple-system, sans-serif",
          zIndex: 2
        }}
      >
        <span>{hours || '21'}</span>
        <span style={{ margin: '0 1px', opacity: 0.85 }}>:</span>
        <span>{minutes || '23'}</span>
      </div>
    </div>
  );
}

export default function HomeDashboard({
  currentTime = '21:23',
  calendarInfo = {},
  telemetry = {},
  media = {},
  openedApps = ['Spotify'],
  onControl = () => {},
  onOpenSpotifyDeck = () => {},
  onLaunchApp = () => {}
}) {
  const [wallpaperUrl, setWallpaperUrl] = useState(() => {
    return localStorage.getItem('aurabar_custom_wallpaper') || DEFAULT_WALLPAPER;
  });
  const [wallpaperPosY, setWallpaperPosY] = useState(() => {
    return Number(localStorage.getItem('aurabar_wallpaper_pos_y') || 50);
  });
  const [wallpaperPosX, setWallpaperPosX] = useState(() => {
    return Number(localStorage.getItem('aurabar_wallpaper_pos_x') || 50);
  });
  const [wallpaperScale, setWallpaperScale] = useState(() => {
    return Number(localStorage.getItem('aurabar_wallpaper_scale') || 100);
  });

  const [widgetImgUrl, setWidgetImgUrl] = useState(() => {
    return localStorage.getItem('aurabar_widget_card_img') || DEFAULT_WIDGET_IMG;
  });

  const [isAdjustMode, setIsAdjustMode] = useState(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [mousePos, setMousePos] = useState(null);
  const dockRef = useRef(null);

  const isDraggingWallpaper = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, startPosX: 50, startPosY: 50 });

  const now = new Date();
  const year = calendarInfo?.year || String(now.getFullYear());
  const monthNameShort = now.toLocaleString('en-US', { month: 'short' });
  const monthNameFull = (calendarInfo?.monthFull || now.toLocaleString('en-US', { month: 'long' })).toUpperCase();
  const dayNameFull = now.toLocaleString('en-US', { weekday: 'long' }).toUpperCase();
  const dayNumber = calendarInfo?.dayNum ? Number(calendarInfo.dayNum) : now.getDate();

  const mIdx = now.getMonth();
  const firstDay = new Date(year, mIdx, 1).getDay();
  const startOffset = firstDay;
  const daysInMonth = new Date(year, mIdx + 1, 0).getDate();

  const calendarGrid = [];
  for (let i = 0; i < startOffset; i++) calendarGrid.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarGrid.push(d);

  const isPlaying = media?.status === 'Playing';
  const songTitle = media?.title && media.title !== 'Spotify Ready' ? media.title : 'EVIL JORDAN';
  const artistName = media?.artist && media.artist !== 'Play a song on Spotify' ? media.artist : 'Playboi Carti';
  const coverUrl = media?.albumCover || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300';

  const dockApps = [
    { id: 'spotify', name: 'Spotify', img: spotifyImg, action: onOpenSpotifyDeck },
    { id: 'ytmusic', name: 'YT Music', img: ytmusicImg, action: () => onLaunchApp({ name: 'YT Music', url: 'https://music.youtube.com' }) },
    { id: 'valo', name: 'Valorant', img: valoImg, action: () => onLaunchApp({ name: 'Valorant' }) },
    { id: 'discord', name: 'Discord', img: discordImg, action: () => onLaunchApp({ name: 'Discord' }) },
    { id: 'brave', name: 'Brave', img: braveImg, action: () => onLaunchApp({ name: 'Brave' }) },
    { id: 'obs', name: 'OBS Studio', img: obsImg, action: () => onLaunchApp({ name: 'OBS Studio' }) },
    { id: 'steam', name: 'Steam', img: steamImg, action: () => onLaunchApp({ name: 'Steam' }) }
  ];

  const handleStartDrag = (clientX, clientY) => {
    isDraggingWallpaper.current = true;
    dragStart.current = {
      x: clientX,
      y: clientY,
      startPosX: wallpaperPosX,
      startPosY: wallpaperPosY
    };
  };

  const handleMoveDrag = (clientX, clientY) => {
    if (!isDraggingWallpaper.current) return;
    const deltaX = clientX - dragStart.current.x;
    const deltaY = clientY - dragStart.current.y;

    const sens = 0.25;
    const nextY = Math.min(100, Math.max(0, Math.round(dragStart.current.startPosY - deltaY * sens)));
    const nextX = Math.min(100, Math.max(0, Math.round(dragStart.current.startPosX - deltaX * sens)));

    setWallpaperPosY(nextY);
    setWallpaperPosX(nextX);
  };

  const handleEndDrag = () => {
    if (isDraggingWallpaper.current) {
      isDraggingWallpaper.current = false;
      localStorage.setItem('aurabar_wallpaper_pos_y', String(wallpaperPosY));
      localStorage.setItem('aurabar_wallpaper_pos_x', String(wallpaperPosX));
    }
  };

  const handleWheelZoom = (e) => {
    if (!isAdjustMode) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -6 : 6;
    const newScale = Math.min(260, Math.max(40, wallpaperScale + delta));
    setWallpaperScale(newScale);
    localStorage.setItem('aurabar_wallpaper_scale', String(newScale));
  };

  useEffect(() => {
    const onWindowMouseMove = (e) => {
      if (isDraggingWallpaper.current) handleMoveDrag(e.clientX, e.clientY);
    };
    const onWindowMouseUp = () => handleEndDrag();

    window.addEventListener('mousemove', onWindowMouseMove);
    window.addEventListener('mouseup', onWindowMouseUp);
    return () => {
      window.removeEventListener('mousemove', onWindowMouseMove);
      window.removeEventListener('mouseup', onWindowMouseUp);
    };
  }, [wallpaperPosX, wallpaperPosY]);

  const handleWallpaperUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const res = evt.target?.result;
        if (typeof res === 'string') {
          setWallpaperUrl(res);
          localStorage.setItem('aurabar_custom_wallpaper', res);
          setIsAdjustMode(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWidgetImgUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const res = evt.target?.result;
        if (typeof res === 'string') {
          setWidgetImgUrl(res);
          localStorage.setItem('aurabar_widget_card_img', res);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDockMouseMove = (e) => {
    if (!dockRef.current) return;
    const rect = dockRef.current.getBoundingClientRect();
    setMousePos(e.clientX - rect.left);
  };

  const handleDockMouseLeave = () => {
    setMousePos(null);
  };

  return (
    <div
      onWheel={handleWheelZoom}
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#050608',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        userSelect: 'none',
        overflow: 'hidden',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', sans-serif",
        cursor: isAdjustMode ? 'grab' : 'default'
      }}
    >
      {/* ── WALLPAPER LAYER (ZERO DISTORTION + TRUE ZOOM-OUT) ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      >
        <img
          src={wallpaperUrl}
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: `${wallpaperPosX}% ${wallpaperPosY}%`,
            transform: `scale(${wallpaperScale / 100})`,
            transformOrigin: `${wallpaperPosX}% ${wallpaperPosY}%`,
            transition: isDraggingWallpaper.current ? 'none' : 'transform 0.15s ease'
          }}
        />
      </div>

      {/* ── DRAGGABLE TOUCH SURFACE (ADJUST MODE) ── */}
      {isAdjustMode && (
        <div
          onMouseDown={(e) => handleStartDrag(e.clientX, e.clientY)}
          onTouchStart={(e) => handleStartDrag(e.touches[0].clientX, e.touches[0].clientY)}
          onTouchMove={(e) => handleMoveDrag(e.touches[0].clientX, e.touches[0].clientY)}
          onTouchEnd={handleEndDrag}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 35,
            cursor: 'grabbing',
            backgroundColor: 'rgba(0,0,0,0.22)'
          }}
        />
      )}

      {/* ── PHONE-STYLE "MOVE & SCALE" PILL ── */}
      {isAdjustMode && (
        <div
          style={{
            position: 'absolute',
            top: '14px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 60,
            backgroundColor: 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(30px) saturate(200%)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: '999px',
            padding: '7px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 16px 40px rgba(0,0,0,0.75)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px' }}>✋</span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#f8fafc' }}>
              Drag up/down to frame • Scroll wheel to zoom
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#94a3b8' }}>
            <span>Pan: {wallpaperPosY}%</span>
            <span>•</span>
            <span>Scale: {wallpaperScale}%</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => {
                setWallpaperPosY(50);
                setWallpaperPosX(50);
                setWallpaperScale(100);
                localStorage.setItem('aurabar_wallpaper_pos_y', '50');
                localStorage.setItem('aurabar_wallpaper_pos_x', '50');
                localStorage.setItem('aurabar_wallpaper_scale', '100');
              }}
              style={{
                backgroundColor: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: '999px',
                padding: '4px 12px',
                color: '#e2e8f0',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Reset
            </button>

            <button
              onClick={() => setIsAdjustMode(false)}
              style={{
                backgroundColor: '#10b981',
                border: 'none',
                borderRadius: '999px',
                padding: '5px 16px',
                color: '#000000',
                fontSize: '11.5px',
                fontWeight: 900,
                cursor: 'pointer'
              }}
            >
              ✓ Set Wallpaper
            </button>
          </div>
        </div>
      )}

      {/* ── MAIN WORKSPACE ── */}
      <div
        style={{
          flex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 28px',
          boxSizing: 'border-box',
          position: 'relative',
          minHeight: 0
        }}
      >
        {/* ── LEFT COLUMN WIDGETS ── */}
        <div
          style={{
            width: '304px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            zIndex: 10
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <ClockFace timeString={currentTime} />

            <div
              onClick={() => setIsCustomizeOpen(true)}
              title="Click to customize photo card"
              style={{
                width: '144px',
                height: '144px',
                borderRadius: '32px',
                overflow: 'hidden',
                boxShadow: '0 16px 36px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.3)',
                position: 'relative',
                flexShrink: 0,
                cursor: 'pointer'
              }}
            >
              <img
                src={widgetImgUrl}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.7) 100%)',
                  padding: '14px',
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start'
                }}
              >
                <span
                  style={{
                    fontSize: '15px',
                    fontWeight: 900,
                    color: '#4ade80',
                    lineHeight: 1.1,
                    textTransform: 'uppercase',
                    letterSpacing: '-0.02em',
                    textShadow: '0 2px 8px rgba(0,0,0,0.9)'
                  }}
                >
                  {dayNameFull}
                </span>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 800,
                    color: '#facc15',
                    lineHeight: 1.1,
                    marginTop: '2px',
                    textShadow: '0 2px 8px rgba(0,0,0,0.9)'
                  }}
                >
                  {monthNameShort} {dayNumber}
                </span>
              </div>
            </div>
          </div>

          <div
            style={{
              width: '304px',
              height: '150px',
              backgroundColor: 'rgba(23, 27, 46, 0.72)',
              backdropFilter: 'blur(36px) saturate(200%)',
              WebkitBackdropFilter: 'blur(36px) saturate(200%)',
              borderRadius: '32px',
              border: '1px solid rgba(255, 255, 255, 0.22)',
              boxShadow: '0 18px 45px rgba(0,0,0,0.65), inset 0 1px 1.5px rgba(255,255,255,0.35)',
              padding: '14px 18px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              color: '#ffffff'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>
                  <span>Delhi</span>
                  <span style={{ fontSize: '10px' }}>↗</span>
                </div>
                <div style={{ fontSize: '36px', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.03em', marginTop: '2px' }}>
                  23°
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '5px' }}>
                  <WeatherIconMoon size={14} />
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#ffffff' }}>Mostly Clear</span>
                </div>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', display: 'block', marginTop: '2px' }}>
                  H:28°  L:21°
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid rgba(255,255,255,0.14)',
                paddingTop: '6px'
              }}
            >
              {[
                { time: '12 AM', icon: <WeatherIconMoon size={13} />, temp: '23°' },
                { time: '1 AM', icon: <WeatherIconMoon size={13} />, temp: '23°' },
                { time: '2 AM', icon: <WeatherIconCloudMoon size={14} />, temp: '23°' },
                { time: '3 AM', icon: <WeatherIconCloudMoon size={14} />, temp: '23°' },
                { time: '4 AM', icon: <WeatherIconCloud size={14} />, temp: '23°' },
                { time: '5 AM', icon: <WeatherIconCloud size={14} />, temp: '23°' }
              ].map((slot, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                  <span style={{ fontSize: '9px', fontWeight: 600, color: 'rgba(255,255,255,0.75)' }}>{slot.time}</span>
                  <div style={{ height: '16px', display: 'flex', alignItems: 'center' }}>{slot.icon}</div>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#ffffff' }}>{slot.temp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN WIDGETS ── */}
        <div
          style={{
            width: '320px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            zIndex: 10
          }}
        >
          <div
            style={{
              width: '320px',
              height: '150px',
              backgroundColor: 'rgba(28, 30, 36, 0.78)',
              backdropFilter: 'blur(36px) saturate(200%)',
              WebkitBackdropFilter: 'blur(36px) saturate(200%)',
              borderRadius: '32px',
              border: '1px solid rgba(255, 255, 255, 0.22)',
              boxShadow: '0 18px 45px rgba(0,0,0,0.65), inset 0 1px 1.5px rgba(255,255,255,0.35)',
              padding: '14px 18px',
              boxSizing: 'border-box',
              display: 'flex',
              gap: '14px',
              position: 'relative'
            }}
          >
            <div
              onClick={() => setIsCustomizeOpen(true)}
              title="Customize Wallpaper & Widgets"
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.16)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.22)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                color: '#ffffff',
                cursor: 'pointer'
              }}
            >
              ⚙
            </div>

            <div
              style={{
                width: '42%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRight: '1px solid rgba(255,255,255,0.12)',
                paddingRight: '10px'
              }}
            >
              <div>
                <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#ff453a', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {dayNameFull}
                </span>
                <div style={{ fontSize: '46px', fontWeight: 900, color: '#ffffff', lineHeight: 1.05, letterSpacing: '-0.04em' }}>
                  {dayNumber}
                </div>
              </div>
              <span style={{ fontSize: '10.5px', color: '#94a3b8', fontWeight: 600 }}>
                No Events Today
              </span>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#ff453a', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {monthNameFull}
              </span>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontSize: '8.5px', fontWeight: 700, color: '#636366' }}>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <span key={i}>{d}</span>)}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', textAlign: 'center', fontSize: '9.5px' }}>
                {calendarGrid.slice(0, 35).map((d, idx) => {
                  const isCurrent = d === dayNumber;
                  return (
                    <div
                      key={idx}
                      style={{
                        height: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isCurrent ? '#ffffff' : d ? '#cbd5e1' : 'transparent',
                        backgroundColor: isCurrent ? '#ff453a' : 'transparent',
                        borderRadius: '50%',
                        fontWeight: isCurrent ? 900 : 500,
                        boxShadow: isCurrent ? '0 0 10px rgba(255, 69, 58, 0.6)' : 'none'
                      }}
                    >
                      {d || ''}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div
            onClick={onOpenSpotifyDeck}
            style={{
              width: '320px',
              height: '150px',
              backgroundColor: 'rgba(245, 242, 235, 0.94)',
              backdropFilter: 'blur(30px)',
              borderRadius: '32px',
              border: '1px solid rgba(255, 255, 255, 0.45)',
              boxShadow: '0 18px 45px rgba(0,0,0,0.55), inset 0 1px 1.5px rgba(255,255,255,0.6)',
              padding: '16px',
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            <div
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '18px',
                overflow: 'hidden',
                boxShadow: '0 10px 22px rgba(0,0,0,0.25)',
                flexShrink: 0,
                backgroundColor: '#e2e8f0'
              }}
            >
              <img
                src={coverUrl}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#475569',
                  lineHeight: 1.25,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {songTitle}
              </div>

              <div
                style={{
                  fontSize: '17px',
                  fontWeight: 900,
                  color: '#0f172a',
                  lineHeight: 1.15,
                  marginTop: '5px',
                  letterSpacing: '-0.02em',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {artistName}
              </div>

              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onControl('play-pause');
                }}
                style={{
                  alignSelf: 'flex-start',
                  marginTop: '10px',
                  padding: '5px 12px',
                  backgroundColor: '#0f172a',
                  borderRadius: '999px',
                  color: '#ffffff',
                  fontSize: '10.5px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}
              >
                <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
                <span>{isPlaying ? '⏸' : '▶'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM DOCK ── */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          paddingBottom: '8px',
          zIndex: 60,
          pointerEvents: 'none'
        }}
      >
        <div
          ref={dockRef}
          onMouseMove={handleDockMouseMove}
          onMouseLeave={handleDockMouseLeave}
          style={{
            pointerEvents: 'auto',
            height: '56px',
            backgroundColor: 'rgba(255, 255, 255, 0.16)',
            backdropFilter: 'blur(36px) saturate(220%)',
            WebkitBackdropFilter: 'blur(36px) saturate(220%)',
            borderRadius: '22px',
            border: '1px solid rgba(255, 255, 255, 0.32)',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7), inset 0 1.5px 1.5px rgba(255, 255, 255, 0.45)',
            display: 'flex',
            alignItems: 'flex-end',
            gap: '10px',
            padding: '6px 14px',
            boxSizing: 'border-box'
          }}
        >
          {dockApps.map((app, index) => {
            const iconDefaultWidth = 44;
            const iconCenter = index * (iconDefaultWidth + 10) + iconDefaultWidth / 2;

            let scale = 1;
            let translateY = 0;

            if (mousePos !== null) {
              const distance = Math.abs(mousePos - iconCenter);
              const maxDistance = 110;
              if (distance < maxDistance) {
                const factor = Math.cos((distance / maxDistance) * (Math.PI / 2));
                scale = 1 + factor * 0.48;
                translateY = -factor * 16;
              }
            }

            const isAppOpen = openedApps.includes(app.name);

            return (
              <div
                key={app.id}
                onClick={app.action}
                title={app.name}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transform: `translateY(${translateY}px) scale(${scale})`,
                  transformOrigin: 'bottom center',
                  transition: mousePos === null ? 'all 0.25s cubic-bezier(0.2, 0.9, 0.3, 1)' : 'none',
                  cursor: 'pointer'
                }}
              >
                <div
                  style={{
                    width: `${iconDefaultWidth}px`,
                    height: `${iconDefaultWidth}px`,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    backgroundColor: '#181b24',
                    boxShadow: '0 8px 18px rgba(0,0,0,0.5)',
                    border: '1px solid rgba(255,255,255,0.22)'
                  }}
                >
                  <img
                    src={app.img}
                    alt={app.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {isAppOpen ? (
                  <div
                    style={{
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      boxShadow: '0 0 6px rgba(255,255,255,0.9)',
                      marginTop: '3px'
                    }}
                  />
                ) : (
                  <div style={{ width: '4px', height: '4px', marginTop: '3px' }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── CUSTOMIZE MODAL ── */}
      {isCustomizeOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(16px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div
            style={{
              width: '440px',
              backgroundColor: '#161922',
              borderRadius: '26px',
              border: '1px solid rgba(255,255,255,0.18)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.85)',
              padding: '22px',
              boxSizing: 'border-box',
              color: '#ffffff',
              maxHeight: '94vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '15px', fontWeight: 800 }}>Display & Wallpaper Setup</span>
              <button
                onClick={() => setIsCustomizeOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '18px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <button
                onClick={() => {
                  setIsCustomizeOpen(false);
                  setIsAdjustMode(true);
                }}
                style={{
                  width: '100%',
                  padding: '11px',
                  borderRadius: '12px',
                  backgroundColor: '#10b981',
                  border: 'none',
                  color: '#000000',
                  fontWeight: 800,
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 6px 18px rgba(16, 185, 129, 0.35)'
                }}
              >
                <span>✋</span> Move and Scale Wallpaper Directly
              </button>

              <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '8px' }}>
                  Fine Position Sliders
                </span>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: '#cbd5e1', marginBottom: '2px' }}>
                      <span>Vertical Pan (Up / Down)</span>
                      <span>{wallpaperPosY}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={wallpaperPosY}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setWallpaperPosY(val);
                        localStorage.setItem('aurabar_wallpaper_pos_y', String(val));
                      }}
                      style={{ width: '100%', accentColor: '#10b981' }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: '#cbd5e1', marginBottom: '2px' }}>
                      <span>Zoom / Scale (Zoom out supported)</span>
                      <span>{wallpaperScale}%</span>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="260"
                      value={wallpaperScale}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setWallpaperScale(val);
                        localStorage.setItem('aurabar_wallpaper_scale', String(val));
                      }}
                      style={{ width: '100%', accentColor: '#10b981' }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                  Upload Wallpaper (.jpg / .png):
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleWallpaperUpload}
                  style={{
                    fontSize: '11px',
                    color: '#94a3b8',
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    padding: '8px',
                    borderRadius: '8px',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                  Photo Card Image (Date Card Widget):
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleWidgetImgUpload}
                  style={{
                    fontSize: '11px',
                    color: '#94a3b8',
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    padding: '8px',
                    borderRadius: '8px',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                <button
                  onClick={() => setIsCustomizeOpen(false)}
                  style={{
                    backgroundColor: '#10b981',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 16px',
                    color: '#000000',
                    fontWeight: 800,
                    fontSize: '11.5px',
                    cursor: 'pointer'
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}