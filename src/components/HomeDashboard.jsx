import React, { useRef, useEffect, useState } from 'react';

function formatTime(sec) {
  if (!sec || isNaN(sec) || sec <= 0) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function HomeDashboard({
  media,
  telemetry,
  currentTime,
  calendarInfo,
  tasks,
  onToggleTask,
  isAddingTask,
  setIsAddingTask,
  newTaskInput,
  setNewTaskInput,
  onAddTask,
  onDeleteTask,
  isVideoOff,
  setIsVideoOff,
  isMicMuted,
  onToggleMicMute,
  isDeafened,
  onToggleAudioMute,
  isGameMode,
  onToggleProfile,
  onOpenSpotifyDeck,
  onOpenSettings,
  onControl,
  onSeek,
  volume,
  dialAngle,
  knobPulse,
  onVolumeChange,
  Icons
}) {
  const videoRef = useRef(null);
  const homeScrubberRef = useRef(null);
  const [activeTelemetryTip, setActiveTelemetryTip] = useState(null);
  const isSongPlaying = media.status === 'Playing';
  const duration = media.duration > 0 ? media.duration : 176;
  const position = media.position || 0;
  const progressPercent = Math.min(100, Math.max(0, (position / duration) * 100));

  useEffect(() => {
    let streamTrack = null;
    if (!isVideoOff) {
      navigator.mediaDevices?.getUserMedia({ video: { width: 320, height: 240, frameRate: 24 }, audio: false })
        .then((stream) => {
          streamTrack = stream;
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(() => {});
    } else if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    return () => {
      if (streamTrack) streamTrack.getTracks().forEach(t => t.stop());
    };
  }, [isVideoOff]);

  const handleHomeSeek = (e) => {
    if (!homeScrubberRef.current || !onSeek) return;
    const rect = homeScrubberRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek(Math.round(pct * duration));
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        padding: '10px 12px 62px 12px',
        gap: '10px',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
        userSelect: 'none',
        backgroundColor: '#eceef3',
        color: '#1e293b',
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
      }}
    >
      {/* ── 1. LEFT RAIL: TELEMETRY HUD ── */}
      <div
        style={{
          width: '58px',
          backgroundColor: '#27292f',
          borderRadius: '24px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 4px',
          boxSizing: 'border-box',
          flexShrink: 0,
          position: 'relative',
          zIndex: 30
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', alignItems: 'center' }}>
          <div
            onMouseEnter={() => setActiveTelemetryTip('cpu')}
            onMouseLeave={() => setActiveTelemetryTip(null)}
            style={metricBoxStyle}
          >
            <Icons.Speedometer size={16} />
            <span style={{ fontSize: '8px', fontWeight: 800, marginTop: '2px', color: '#38bdf8' }}>{telemetry.cpu}%</span>
            {activeTelemetryTip === 'cpu' && (
              <div style={{ ...tooltipStyle, top: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px', marginBottom: '4px', fontSize: '11px', fontWeight: 800, color: '#38bdf8' }}>
                  <span>CPU UTILIZATION</span>
                  <span style={{ color: '#10b981' }}>52°C</span>
                </div>
                <div style={{ fontSize: '10px', color: '#cbd5e1' }}>
                  <div>Base Clock: {telemetry.cpuGhz} GHz</div>
                  <div>Live Load: {telemetry.cpu}%</div>
                </div>
              </div>
            )}
          </div>

          <div
            onMouseEnter={() => setActiveTelemetryTip('gpu')}
            onMouseLeave={() => setActiveTelemetryTip(null)}
            style={metricBoxStyle}
          >
            <Icons.GridGauge size={16} />
            <span style={{ fontSize: '8px', fontWeight: 800, marginTop: '2px', color: '#10b981' }}>{telemetry.intelLoad}%</span>
            {activeTelemetryTip === 'gpu' && (
              <div style={{ ...tooltipStyle, top: '70px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px', marginBottom: '4px', fontSize: '11px', fontWeight: 800, color: '#10b981' }}>
                  <span>GRAPHICS LOAD</span>
                  <span style={{ color: '#fbbf24' }}>58°C</span>
                </div>
                <div style={{ fontSize: '10px', color: '#cbd5e1' }}>
                  <div>RTX 3050: {telemetry.nvidiaLoad}%</div>
                  <div>Intel UHD: {telemetry.intelLoad}%</div>
                </div>
              </div>
            )}
          </div>

          <div
            onMouseEnter={() => setActiveTelemetryTip('ram')}
            onMouseLeave={() => setActiveTelemetryTip(null)}
            style={metricBoxStyle}
          >
            <Icons.BarChart size={16} />
            <span style={{ fontSize: '8px', fontWeight: 800, marginTop: '2px', color: '#fbbf24' }}>{telemetry.ramUsed}G</span>
            {activeTelemetryTip === 'ram' && (
              <div style={{ ...tooltipStyle, top: '120px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px', marginBottom: '4px', fontSize: '11px', fontWeight: 800, color: '#fbbf24' }}>
                  <span>MEMORY ALLOCATION</span>
                  <span style={{ color: '#38bdf8' }}>{telemetry.ramPercent}%</span>
                </div>
                <div style={{ fontSize: '10px', color: '#cbd5e1' }}>
                  <div>RAM: {telemetry.ramUsed} / {telemetry.ramTotal} GB</div>
                  <div>NVMe Disk: {telemetry.diskLoad}% Load</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ width: '30px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }} />

        <div onClick={onOpenSettings} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '8px', padding: '2px 4px', width: '38px', textAlign: 'center' }}>
            <div style={{ fontSize: '7px', color: '#94a3b8', fontWeight: 700 }}>Shift</div>
            <div style={{ fontSize: '8px', color: '#ffffff', fontWeight: 800 }}>F2</div>
          </div>
          <button style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: '2px' }}>
            <Icons.Settings size={15} />
          </button>
        </div>

        <div style={{ width: '30px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }} />

        <button onClick={() => window.electronAPI?.exitApp?.()} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}>
          <Icons.X size={15} />
        </button>
      </div>

      {/* ── 2. CENTER 2x2 MAIN GRID ── */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: '1.25fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: '10px'
        }}
      >
        {/* Quadrant 1 (Top-Left): Live Media Player */}
        <div
          style={{
            backgroundColor: '#f6f7fb', borderRadius: '22px', border: '1px solid #e2e8f0',
            boxShadow: '0 4px 14px rgba(0,0,0,0.03)', padding: '12px 16px', display: 'flex',
            alignItems: 'center', justifyContent: 'space-between', overflow: 'hidden'
          }}
        >
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', minWidth: 0, paddingRight: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ minWidth: 0 }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {media.title}
                </h3>
                <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {media.artist}
                </p>
              </div>

              <button
                onClick={onOpenSpotifyDeck}
                style={{
                  padding: '4px 10px', fontSize: '10px', fontWeight: 700,
                  backgroundColor: 'rgba(30, 215, 96, 0.15)', color: '#059669',
                  border: '1px solid rgba(30, 215, 96, 0.35)', borderRadius: '8px',
                  cursor: 'pointer', flexShrink: 0
                }}
              >
                Open Spotify
              </button>
            </div>

            {/* Interactive Click-to-Seek Scrubber */}
            <div style={{ paddingRight: '8px' }}>
              <div
                ref={homeScrubberRef}
                onClick={handleHomeSeek}
                style={{ width: '100%', height: '14px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              >
                <div style={{ width: '100%', height: '5px', backgroundColor: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${progressPercent}%`, height: '100%', backgroundColor: '#1e293b', borderRadius: '999px' }} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#94a3b8', fontWeight: 600 }}>
                <span>{formatTime(position)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button onClick={() => onControl('prev')} style={smallBtn}>
                <Icons.SkipBack size={13} />
              </button>
              <button onClick={() => onControl('play-pause')} style={{ ...smallBtn, width: '36px', height: '36px' }}>
                {isSongPlaying ? <Icons.Pause size={15} /> : <Icons.Play size={15} />}
              </button>
              <button onClick={() => onControl('next')} style={smallBtn}>
                <Icons.SkipForward size={13} />
              </button>
            </div>
          </div>

          <div
            style={{
              width: '118px', height: '118px', borderRadius: '50%', backgroundColor: '#eef1f6',
              boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.08)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}
          >
            <div
              className={`spinning-disc ${!isSongPlaying ? 'paused-disc' : ''}`}
              style={{
                width: '104px', height: '104px', borderRadius: '50%',
                background: 'radial-gradient(circle, #0f172a 0%, #1e293b 40%, #0f172a 45%, #1e293b 80%, #0f172a 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <div
                style={{
                  width: '54px', height: '54px', borderRadius: '50%',
                  backgroundImage: `url("${media.albumCover || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500'}")`,
                  backgroundSize: 'cover', backgroundPosition: 'center', border: '2px solid #ffffff'
                }}
              />
            </div>
          </div>
        </div>

        {/* Quadrant 2 (Top-Right): Reminders & Tasks */}
        <div
          style={{
            borderRadius: '22px', backgroundColor: '#fffdf9', boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
            border: '1px solid #f1ece2', overflow: 'hidden', display: 'flex', flexDirection: 'column'
          }}
        >
          <div
            style={{
              background: 'linear-gradient(180deg, #f59e0b 0%, #fbbf24 40%, rgba(251, 191, 36, 0.4) 100%)',
              padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}
          >
            <div>
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#451a03' }}>Reminders</span>
              <div style={{ fontSize: '9px', color: '#78350f', fontWeight: 600 }}>{currentTime}</div>
            </div>
            <button
              onClick={() => setIsAddingTask(!isAddingTask)}
              style={{ backgroundColor: 'rgba(254, 243, 199, 0.85)', border: 'none', borderRadius: '999px', padding: '2px 8px', fontSize: '9px', fontWeight: 700, color: '#78350f', cursor: 'pointer' }}
            >
              {isAddingTask ? 'Cancel' : 'Done'}
            </button>
          </div>

          <div style={{ backgroundColor: '#fffdf9', borderTopLeftRadius: '18px', borderTopRightRadius: '18px', marginTop: '-8px', padding: '8px 12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
              <h4 style={{ margin: 0, fontSize: '11px', fontWeight: 800, color: '#271b12' }}>Tasks for Today</h4>
              <span style={{ fontSize: '9px', fontWeight: 700, color: '#9a3412' }}>
                {tasks.filter(t => t.done).length}/{tasks.length} Done
              </span>
            </div>

            {isAddingTask && (
              <form onSubmit={onAddTask} style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                <input
                  type="text" autoFocus placeholder="Add task..."
                  value={newTaskInput} onChange={e => setNewTaskInput(e.target.value)}
                  style={{ flex: 1, padding: '2px 6px', fontSize: '10px', borderRadius: '6px', border: '1px solid #fed7aa', outline: 'none' }}
                />
                <button type="submit" style={{ backgroundColor: '#f59e0b', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '2px 6px', fontSize: '9px', fontWeight: 700, cursor: 'pointer' }}>
                  Add
                </button>
              </form>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', maxHeight: '66px', overflowY: 'auto' }}>
              {tasks.map(task => (
                <div key={task.id} onClick={() => onToggleTask(task.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Icons.CheckCircle checked={task.done} size={12} />
                    <span style={{ fontSize: '10px', fontWeight: 600, color: task.done ? '#1e293b' : '#78716c' }}>
                      {task.text}
                    </span>
                  </div>
                  <span onClick={(e) => onDeleteTask(task.id, e)} style={{ fontSize: '11px', color: '#dc2626', opacity: 0.6, cursor: 'pointer', padding: '0 4px' }}>
                    ×
                  </span>
                </div>
              ))}
            </div>

            <div
              onClick={() => setIsAddingTask(!isAddingTask)}
              style={{
                position: 'absolute', right: '10px', bottom: '6px', width: '22px', height: '22px',
                borderRadius: '50%', backgroundColor: '#fffaf0', border: '1px solid #fed7aa',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9a3412', cursor: 'pointer'
              }}
            >
              <Icons.Plus size={12} />
            </div>
          </div>
        </div>

        {/* Quadrant 3 (Bottom-Left): Real-Time Clock & Calendar */}
        <div
          style={{
            backgroundColor: '#000000', borderRadius: '22px', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
            padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: '12px', color: '#ffffff', boxSizing: 'border-box'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
            <span style={{ fontFamily: "'Audiowide', cursive", fontSize: '16px', fontWeight: 800, color: '#d92662', letterSpacing: '1px', lineHeight: 1 }}>
              {calendarInfo.monthShort}
            </span>
            <span style={{ fontFamily: "'Audiowide', cursive", fontSize: '42px', fontWeight: 900, color: '#ffffff', lineHeight: 1, marginTop: '2px' }}>
              {calendarInfo.dayNum}
            </span>
            <span style={{ fontSize: '7px', fontWeight: 700, color: '#38bdf8', marginTop: '3px' }}>
              TODAY • ACTIVE
            </span>
          </div>

          <div style={{ flex: 1, maxWidth: '190px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontFamily: "'Audiowide', cursive", fontSize: '9px', color: '#ffffff', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>
              {calendarInfo.monthFull}
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', width: '100%', textAlign: 'center', fontFamily: "'Audiowide', cursive", fontSize: '7px', color: '#a1a1aa', marginBottom: '2px' }}>
              <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', width: '100%', textAlign: 'center', gap: '1px 0', fontFamily: "'Audiowide', cursive", fontSize: '8px', color: '#ffffff' }}>
              {Array.from({ length: calendarInfo.startDay }).map((_, i) => (
                <span key={`emp-${i}`} style={{ opacity: 0 }}>0</span>
              ))}
              {Array.from({ length: calendarInfo.daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isToday = day === calendarInfo.dayNum;
                return (
                  <div key={`day-${day}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '13px' }}>
                    {isToday ? (
                      <span style={{ backgroundColor: '#ffffff', color: '#000000', fontWeight: 900, borderRadius: '2px', padding: '0 3px', fontSize: '7px' }}>
                        {day}
                      </span>
                    ) : (
                      <span style={{ opacity: 0.9 }}>{day}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quadrant 4 (Bottom-Right): Discord Voice + Mirror Webcam */}
        <div
          style={{
            borderRadius: '22px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
            overflow: 'hidden', position: 'relative', backgroundColor: '#0f172a',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '8px'
          }}
        >
          {!isVideoOff ? (
            <video
              ref={videoRef} autoPlay playsInline muted
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)', zIndex: 0 }}
            />
          ) : (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1e293b', color: '#94a3b8', zIndex: 0 }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>👤</div>
              <span style={{ fontSize: '9px', marginTop: '2px', color: '#cbd5e1', fontWeight: 600 }}>Camera Muted</span>
            </div>
          )}

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2px 6px', backgroundColor: 'rgba(0,0,0,0.65)', borderRadius: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isVideoOff ? '#ef4444' : '#10b981' }} />
              <span style={{ fontSize: '8px', fontWeight: 700, color: '#ffffff' }}>Discord Voice</span>
            </div>
            <span style={{ fontSize: '8px', color: '#5865F2', fontWeight: 800 }}>READY</span>
          </div>

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '3px 6px', backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: isMicMuted ? '#ef4444' : '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                {isMicMuted ? <Icons.MicOff size={7} /> : <Icons.Mic size={7} />}
              </div>
              <span style={{ fontSize: '8px', fontWeight: 700, color: '#ffffff' }}>
                {isMicMuted ? 'Muted' : 'Speaking'}
              </span>
            </div>
            <button
              onClick={() => setIsVideoOff(!isVideoOff)}
              style={{ background: isVideoOff ? '#10b981' : '#ef4444', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '2px 6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px', fontSize: '8px', fontWeight: 700 }}
            >
              {isVideoOff ? <Icons.Video size={7} /> : <Icons.X size={7} />}
              <span>{isVideoOff ? 'Cam On' : 'Hide'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 3. RIGHT RAIL: PROFILE NOTCH WITH REAL MUTE ACTIONS ── */}
      <div
        style={{
          width: '58px',
          backgroundColor: '#0f172a',
          borderRadius: '28px 16px 16px 28px',
          border: '1px solid #334155',
          boxShadow: '0 6px 20px rgba(15, 23, 42, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '12px 0',
          boxSizing: 'border-box',
          flexShrink: 0
        }}
      >
        <div onClick={onToggleMicMute} style={{ cursor: 'pointer', textAlign: 'center' }} title="Toggle Mic Mute">
          <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: '#1e293b', border: `2px solid ${isMicMuted ? '#ef4444' : '#0284c7'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: isMicMuted ? '#ef4444' : '#0284c7' }}>
            {isMicMuted ? <Icons.MicOff size={13} /> : <Icons.Mic size={13} />}
          </div>
          <span style={{ fontSize: '7px', fontWeight: 800, color: isMicMuted ? '#ef4444' : '#94a3b8', display: 'block', marginTop: '2px' }}>
            {isMicMuted ? 'MUTED' : 'MIC'}
          </span>
        </div>

        <div onClick={onToggleAudioMute} style={{ cursor: 'pointer', textAlign: 'center' }} title="Mute System Audio">
          <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: '#1e293b', border: `2px solid ${isDeafened ? '#ef4444' : '#10b981'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDeafened ? '#ef4444' : '#10b981' }}>
            <Icons.Headphones size={13} />
          </div>
          <span style={{ fontSize: '7px', fontWeight: 800, color: isDeafened ? '#ef4444' : '#94a3b8', display: 'block', marginTop: '2px' }}>
            {isDeafened ? 'MUTED' : 'AUDIO'}
          </span>
        </div>

        <div onClick={onToggleProfile} style={{ cursor: 'pointer', textAlign: 'center' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: '#1e293b', border: '2px solid #64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
            <Icons.Gamepad size={15} />
          </div>
          <span style={{ fontSize: '7px', fontWeight: 800, color: '#0284c7', display: 'block', marginTop: '2px' }}>
            {isGameMode ? 'GAME' : 'NORM'}
          </span>
        </div>
      </div>

      {/* ── 4. BOTTOM-RIGHT EC11 ROTARY KNOB INDICATOR ── */}
      <div
        style={{
          position: 'fixed',
          bottom: '8px',
          right: '78px',
          zIndex: 40,
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: knobPulse ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
          boxShadow: '0 4px 14px rgba(15, 23, 42, 0.1)',
          padding: '4px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}
      >
        <button onClick={() => onVolumeChange(volume - 4)} style={{ background: 'none', border: 'none', color: '#64748b', fontWeight: 800, cursor: 'pointer', fontSize: '10px' }}>▼</button>
        <div onClick={onToggleAudioMute} style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
          <div
            style={{
              width: '20px', height: '20px', borderRadius: '50%', backgroundColor: isDeafened ? '#ef4444' : '#1e293b',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDeafened ? '#ffffff' : '#38bdf8',
              transform: `rotate(${dialAngle}deg)`, transition: 'transform 0.12s ease'
            }}
          >
            <Icons.KnobDial size={11} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '9px', fontWeight: 900, color: isDeafened ? '#ef4444' : '#0f172a', lineHeight: 1 }}>
              {isDeafened ? 'MUTE' : `${volume}%`}
            </span>
            <span style={{ fontSize: '5px', fontWeight: 800, color: '#94a3b8' }}>EC11</span>
          </div>
        </div>
        <button onClick={() => onVolumeChange(volume + 4)} style={{ background: 'none', border: 'none', color: '#0284c7', fontWeight: 800, cursor: 'pointer', fontSize: '10px' }}>▲</button>
      </div>
    </div>
  );
}

const metricBoxStyle = {
  width: '44px',
  height: '44px',
  borderRadius: '14px',
  border: '1px solid rgba(255,255,255,0.1)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#ffffff',
  cursor: 'pointer',
  position: 'relative'
};

const tooltipStyle = {
  position: 'fixed',
  left: '74px',
  width: '190px',
  backgroundColor: '#0f172a',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: '12px',
  padding: '10px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
  zIndex: 100,
  textAlign: 'left',
  pointerEvents: 'none',
  color: '#ffffff'
};

const smallBtn = {
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  backgroundColor: '#f8fafc',
  border: 'none',
  boxShadow: '2px 2px 5px rgba(0,0,0,0.06), -1px -1px 3px rgba(255,255,255,0.8)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#1e293b',
  cursor: 'pointer'
};