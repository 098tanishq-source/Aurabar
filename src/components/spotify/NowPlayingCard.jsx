import React, { useRef, useEffect } from 'react';
import { formatTime } from './spotifyUtils';

export default function NowPlayingCard({
  track,
  isPlaying,
  progressSec,
  durationSec,
  progressPercent,
  isLiked,
  onToggleLike,
  isShuffle,
  onToggleShuffle,
  isRepeat,
  onToggleRepeat,
  onPlayPause,
  onPrev,
  onNext,
  onSeek,
  volume = 74,
  onVolumeChange
}) {
  const scrubberRef = useRef(null);
  const volTrackRef = useRef(null);
  const isDraggingVol = useRef(false);

  const handleSeekClick = (e) => {
    if (!scrubberRef.current) return;
    const rect = scrubberRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek(Math.round(pct * durationSec));
  };

  const updateVolPointer = (clientY) => {
    if (!volTrackRef.current) return;
    const rect = volTrackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, Math.round(100 - ((clientY - rect.top) / rect.height) * 100)));
    if (onVolumeChange) onVolumeChange(pct);
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
        width: '740px',
        height: '100%',
        background: 'linear-gradient(180deg, #ec4899 0%, #a21caf 52%, #18051e 100%)',
        padding: '28px 30px',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: '26px',
        position: 'relative',
        flexShrink: 0,
        borderRight: '1px solid rgba(255,255,255,0.08)'
      }}
    >
      <div
        style={{
          width: '230px',
          height: '230px',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 20px 48px rgba(0,0,0,0.65)',
          flexShrink: 0,
          backgroundColor: '#181818'
        }}
      >
        <img
          src={track.cover}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      <div
        style={{
          flex: 1,
          height: '230px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minWidth: 0,
          paddingRight: '18px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
          <div style={{ minWidth: 0 }}>
            <h1
              style={{
                margin: 0,
                fontSize: '28px',
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '-0.025em',
                lineHeight: 1.2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {track.title}
            </h1>
            <h2
              style={{
                margin: '6px 0 0 0',
                fontSize: '18px',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.85)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {track.artist}
            </h2>
          </div>

          <button
            onClick={onToggleLike}
            style={{
              background: 'none',
              border: 'none',
              color: isLiked ? '#ffffff' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              padding: '4px',
              fontSize: '22px'
            }}
          >
            ♥
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '330px', margin: '4px 0' }}>
          <button
            onClick={onToggleShuffle}
            style={{ background: 'none', border: 'none', color: isShuffle ? '#1ed760' : 'rgba(255,255,255,0.85)', cursor: 'pointer', fontSize: '18px' }}
          >
            🔀
          </button>

          <button
            onClick={onPrev}
            style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '20px' }}
          >
            ⏮
          </button>

          <button
            onClick={onPlayPause}
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
            onClick={onNext}
            style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '20px' }}
          >
            ⏭
          </button>

          <button
            onClick={onToggleRepeat}
            style={{ background: 'none', border: 'none', color: isRepeat ? '#1ed760' : 'rgba(255,255,255,0.85)', cursor: 'pointer', fontSize: '18px' }}
          >
            🔁
          </button>
        </div>

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
                height: '5.5px',
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
                    width: '13px',
                    height: '13px',
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
              fontSize: '12px',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.85)',
              marginTop: '2px'
            }}
          >
            <span>{formatTime(progressSec)}</span>
            <span>{formatTime(durationSec)}</span>
          </div>
        </div>
      </div>

      <div
        style={{
          height: '230px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '12px',
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
                width: '11px',
                height: '11px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                boxShadow: '0 2px 6px rgba(0,0,0,0.5)'
              }}
            />
          </div>
        </div>

        <span style={{ fontSize: '16px', color: 'rgba(255,255,255,0.85)' }}>
          🔊
        </span>
      </div>
    </div>
  );
}