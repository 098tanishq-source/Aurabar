import React, { useState, useEffect, useRef } from 'react';
import { BASE_TRACK_POOL, INITIAL_PLAYLISTS, formatTime } from './spotify/spotifyUtils';

function getDynamicGradient(title = '', artist = '') {
  const combined = `${title} ${artist}`.toLowerCase();
  if (combined.includes('starboy') || combined.includes('weeknd')) {
    return 'linear-gradient(135deg, #7f1d1d 0%, #450a0a 48%, #140406 100%)';
  }
  if (combined.includes('moonlight') || combined.includes('kali uchis') || combined.includes('sped up')) {
    return 'linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 52%, #080d1a 100%)';
  }
  if (combined.includes('evil jordan') || combined.includes('carti')) {
    return 'linear-gradient(135deg, #4c1d95 0%, #2e1065 50%, #0c0316 100%)';
  }
  if (combined.includes('baby doll') || combined.includes('mms')) {
    return 'linear-gradient(135deg, #78350f 0%, #451a03 50%, #120501 100%)';
  }
  if (combined.includes('let you love me') || combined.includes('rita')) {
    return 'linear-gradient(135deg, #a21caf 0%, #701a75 50%, #160218 100%)';
  }
  
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    hash = combined.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `linear-gradient(135deg, hsl(${hue}, 65%, 28%) 0%, hsl(${hue}, 70%, 14%) 50%, #0a0a0e 100%)`;
}

export default function SpotifyCarThing({
  media,
  onClose,
  onMinimize,
  onOpenYTMusic,
  onControl,
  onSeek,
  volume = 74,
  onVolumeChange
}) {
  const [activeNav, setActiveNav] = useState('Liked Songs');
  const [activeTab, setActiveTab] = useState('UP NEXT'); // 'LIBRARY (10)' | 'UP NEXT' | 'LYRICS' | 'RELATED'
  const [playlistsMap] = useState(INITIAL_PLAYLISTS);
  
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isLiked, setIsLiked] = useState(true);

  const scrubberRef = useRef(null);
  const volTrackRef = useRef(null);
  const isDraggingVol = useRef(false);

  const isPlaying = media?.status === 'Playing';
  const durationSec = media?.duration && media.duration > 0 ? media.duration : 230;
  const positionSec = media?.position || 20;
  const progressPercent = Math.min(100, Math.max(0, (positionSec / durationSec) * 100));

  const currentPlaylist = playlistsMap[activeNav] || playlistsMap['Liked Songs'];
  const gradientBg = getDynamicGradient(media?.title, media?.artist);

  const handleSeekClick = (e) => {
    if (!scrubberRef.current) return;
    const rect = scrubberRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const target = Math.round(pct * durationSec);
    onSeek?.(target);
  };

  const updateVolPointer = (clientY) => {
    if (!volTrackRef.current) return;
    const rect = volTrackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, Math.round(100 - ((clientY - rect.top) / rect.height) * 100)));
    onVolumeChange?.(pct);
  };

  useEffect(() => {
    const onMove = (e) => {
      if (isDraggingVol.current) updateVolPointer(e.clientY);
    };
    const onUp = () => {
      isDraggingVol.current = false;
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000000',
        padding: '6px 10px',
        boxSizing: 'border-box',
        display: 'flex',
        userSelect: 'none',
        fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif"
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#0a0a0c',
          borderRadius: '22px',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.8), 0 20px 50px rgba(0,0,0,0.9)',
          display: 'flex',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* ── 1. LEFT SIDEBAR (SCREENSHOT 16/17 EXACT REPLICA) ── */}
        <div
          style={{
            width: '185px',
            height: '100%',
            backgroundColor: '#000000',
            borderRight: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '16px 0 12px 0',
            boxSizing: 'border-box',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {[
                { name: 'Home', icon: '⌂' },
                { name: 'Browse', icon: '🗂' },
                { name: 'Radio', icon: '📡' }
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveNav(item.name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '7px 20px',
                    background: 'none',
                    border: 'none',
                    color: activeNav === item.name ? '#ffffff' : '#b3b3b3',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ fontSize: '15px' }}>{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              ))}
            </div>

            <span
              style={{
                display: 'block',
                padding: '14px 20px 8px 20px',
                fontSize: '10px',
                fontWeight: 800,
                color: '#8e8e93',
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}
            >
              YOUR LIBRARY
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {[
                'Made For You',
                'Recently Played',
                'Liked Songs',
                'Mood off',
                '1245ff',
                'My Shazam Tracks'
              ].map((item) => {
                const active = activeNav === item;
                return (
                  <button
                    key={item}
                    onClick={() => setActiveNav(item)}
                    style={{
                      position: 'relative',
                      padding: '6px 20px',
                      background: 'none',
                      border: 'none',
                      color: active ? '#1ed760' : '#b3b3b3',
                      fontSize: '12.5px',
                      fontWeight: active ? 700 : 500,
                      cursor: 'pointer',
                      textAlign: 'left',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {active && (
                      <span
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: '2px',
                          bottom: '2px',
                          width: '3.5px',
                          backgroundColor: '#1ed760',
                          borderRadius: '0 4px 4px 0'
                        }}
                      />
                    )}
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Controls */}
          <div style={{ padding: '0 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button
              onClick={onOpenYTMusic}
              style={{
                width: '100%',
                padding: '7px 10px',
                borderRadius: '999px',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                color: '#ef4444',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <span>▶</span> Open YT Music
            </button>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={onMinimize || onClose}
                style={{
                  flex: 1,
                  padding: '6px 8px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#cbd5e1',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                — Minimize
              </button>
              <button
                onClick={onClose}
                style={{
                  padding: '6px 10px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#f87171',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* ── 2. CENTER STAGE (DYNAMIC COLOR GRADIENT HERO) ── */}
        <div
          style={{
            width: '750px',
            height: '100%',
            background: gradientBg,
            transition: 'background 0.6s ease',
            padding: '24px 28px',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            gap: '26px',
            position: 'relative',
            flexShrink: 0,
            borderRight: '1px solid rgba(255,255,255,0.08)'
          }}
        >
          {/* Rounded Album Art with "Switch to Audio" Badge */}
          <div
            style={{
              width: '220px',
              height: '220px',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 20px 48px rgba(0,0,0,0.7)',
              flexShrink: 0,
              backgroundColor: '#181818',
              position: 'relative'
            }}
          >
            <img
              src={media?.albumCover || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500'}
              alt={media?.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                left: '10px',
                backgroundColor: 'rgba(0,0,0,0.65)',
                backdropFilter: 'blur(8px)',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '9.5px',
                fontWeight: 700,
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>🎥</span> Switch to Audio
            </div>
          </div>

          {/* Meta & Interactive Controls */}
          <div
            style={{
              flex: 1,
              height: '220px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minWidth: 0,
              paddingRight: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
              <div style={{ minWidth: 0 }}>
                <h1
                  style={{
                    margin: 0,
                    fontSize: '29px',
                    fontWeight: 800,
                    color: '#ffffff',
                    letterSpacing: '-0.025em',
                    lineHeight: 1.15,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {media?.title || 'Starboy'}
                </h1>
                <h2
                  style={{
                    margin: '5px 0 0 0',
                    fontSize: '17px',
                    fontWeight: 500,
                    color: 'rgba(255,255,255,0.85)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {media?.artist || 'The Weeknd'}
                </h2>
              </div>

              <button
                onClick={() => setIsLiked(!isLiked)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isLiked ? '#1ed760' : 'rgba(255,255,255,0.6)',
                  cursor: 'pointer',
                  padding: '4px',
                  fontSize: '22px'
                }}
              >
                ♥
              </button>
            </div>

            {/* Transport Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '330px', margin: '4px 0' }}>
              <button
                onClick={() => setIsShuffle(!isShuffle)}
                style={{ background: 'none', border: 'none', color: isShuffle ? '#1ed760' : 'rgba(255,255,255,0.85)', cursor: 'pointer', fontSize: '18px' }}
              >
                🔀
              </button>

              <button
                onClick={() => onControl?.('prev')}
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '20px' }}
              >
                ⏮
              </button>

              <button
                onClick={() => onControl?.('play-pause')}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: '#000000',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.35)'
                }}
              >
                {isPlaying ? '⏸' : '▶'}
              </button>

              <button
                onClick={() => onControl?.('next')}
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '20px' }}
              >
                ⏭
              </button>

              <button
                onClick={() => setIsRepeat(!isRepeat)}
                style={{ background: 'none', border: 'none', color: isRepeat ? '#1ed760' : 'rgba(255,255,255,0.85)', cursor: 'pointer', fontSize: '18px' }}
              >
                🔁
              </button>
            </div>

            {/* Live Green Scrubber */}
            <div style={{ width: '100%' }}>
              <div
                ref={scrubberRef}
                onClick={handleSeekClick}
                style={{
                  width: '100%',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '5px',
                    backgroundColor: 'rgba(255,255,255,0.22)',
                    borderRadius: '999px',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <div
                    style={{
                      width: `${progressPercent}%`,
                      height: '100%',
                      backgroundColor: '#1ed760',
                      borderRadius: '999px',
                      position: 'relative'
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        right: '-6px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: '#ffffff',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.5)'
                      }}
                    />
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.85)',
                  marginTop: '1px'
                }}
              >
                <span>{formatTime(positionSec)}</span>
                <span>{formatTime(durationSec)}</span>
              </div>
            </div>
          </div>

          {/* Vertical Volume Slider on Right Edge */}
          <div
            style={{
              height: '220px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '10px',
              padding: '0 4px'
            }}
          >
            <div
              ref={volTrackRef}
              onMouseDown={(e) => {
                isDraggingVol.current = true;
                updateVolPointer(e.clientY);
              }}
              style={{
                width: '4px',
                height: '135px',
                backgroundColor: 'rgba(255,255,255,0.25)',
                borderRadius: '999px',
                position: 'relative',
                cursor: 'pointer'
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: `${volume}%`,
                  backgroundColor: '#ffffff',
                  borderRadius: '999px'
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '-5px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.5)'
                  }}
                />
              </div>
            </div>

            <span style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)' }}>
              🔊
            </span>
          </div>
        </div>

        {/* ── 3. RIGHT PANEL (TABBED VIEW: UP NEXT, LYRICS, LIBRARY) ── */}
        <div
          style={{
            flex: 1,
            height: '100%',
            backgroundColor: '#0a0a0c',
            padding: '16px 20px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            minWidth: 0
          }}
        >
          {/* Header Row with Active Tabs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              paddingBottom: '8px',
              marginBottom: '6px'
            }}
          >
            <span style={{ fontSize: '14.5px', fontWeight: 800, color: '#ffffff' }}>
              {activeNav}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '11px', fontWeight: 700 }}>
              {['LIBRARY (10)', 'UP NEXT', 'LYRICS', 'RELATED'].map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: isActive ? '#1ed760' : '#8e8e93',
                      borderBottom: isActive ? '2px solid #1ed760' : '2px solid transparent',
                      paddingBottom: '4px',
                      cursor: 'pointer',
                      fontWeight: 800,
                      letterSpacing: '0.04em'
                    }}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>

          {/* TAB 1 & 2: TRACK LIST / UP NEXT */}
          {(activeTab === 'UP NEXT' || activeTab === 'LIBRARY (10)') && (
            <>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '22px 34px 1.4fr 1.1fr',
                  alignItems: 'center',
                  padding: '4px 6px',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  fontSize: '9.5px',
                  fontWeight: 800,
                  color: '#636366',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase'
                }}
              >
                <span>#</span>
                <span></span>
                <span>TITLE</span>
                <span style={{ textAlign: 'right' }}>ARTIST</span>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                {currentPlaylist.map((trk, idx) => {
                  const isCurrent = trk.title.toLowerCase() === (media?.title || 'starboy').toLowerCase();
                  return (
                    <div
                      key={trk.id || idx}
                      onClick={() => onControl?.('next')}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '22px 34px 1.4fr 1.1fr',
                        alignItems: 'center',
                        padding: '6px 6px',
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        fontSize: '12px',
                        color: isCurrent ? '#1ed760' : '#ffffff',
                        cursor: 'pointer',
                        borderRadius: '6px',
                        backgroundColor: isCurrent ? 'rgba(30,215,96,0.08)' : 'transparent'
                      }}
                    >
                      <span style={{ fontSize: '11px', color: isCurrent ? '#1ed760' : '#636366' }}>
                        {isCurrent ? '🔊' : idx + 1}
                      </span>

                      <div style={{ width: '26px', height: '26px', borderRadius: '4px', overflow: 'hidden' }}>
                        <img src={trk.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>

                      <span style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '8px' }}>
                        {trk.title}
                      </span>

                      <span style={{ textAlign: 'right', color: isCurrent ? '#1ed760' : '#8e8e93', fontSize: '11.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {trk.artist}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* TAB 3: LYRICS */}
          {activeTab === 'LYRICS' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ fontSize: '11px', color: '#8e8e93', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800 }}>
                Synced Lyrics • {media?.title || 'Starboy'}
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', lineHeight: 1.4 }}>
                I'm tryna put you in the worst mood, ah
              </div>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#ffffff', lineHeight: 1.4, textShadow: '0 0 16px rgba(30,215,96,0.4)' }}>
                P1 cleaner than your church shoes, ah
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', lineHeight: 1.4 }}>
                Milli point two just to hurt you, ah
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', lineHeight: 1.4 }}>
                All red Lamb' just to tease you, ah
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', lineHeight: 1.4 }}>
                None of these toys on lease too, ah
              </div>
            </div>
          )}

          {/* TAB 4: RELATED */}
          {activeTab === 'RELATED' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '10px 4px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '11px', color: '#8e8e93', fontWeight: 800, textTransform: 'uppercase' }}>
                Fans Also Like
              </span>
              {['Travis Scott', 'Metro Boomin', 'Future', 'Playboi Carti', 'Don Toliver'].map((artist, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>{artist}</span>
                  <button style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '999px', padding: '4px 12px', color: '#ffffff', fontSize: '10.5px', fontWeight: 700 }}>
                    Radio
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}