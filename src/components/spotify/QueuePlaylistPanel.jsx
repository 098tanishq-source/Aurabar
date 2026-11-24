import React from 'react';
import { formatTime } from './spotifyUtils';

export default function QueuePlaylistPanel({
  activeNav,
  playlist = [],
  currentTrackIndex,
  onSelectTrack
}) {
  return (
    <div
      style={{
        flex: 1,
        height: '100%',
        backgroundColor: '#121212',
        padding: '18px 24px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        minWidth: 0
      }}
    >
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
        <span style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff' }}>
          {activeNav}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b3b3b3', fontSize: '13px' }}>
          <span style={{ cursor: 'pointer' }}>〈</span>
          <span style={{ cursor: 'pointer' }}>〉</span>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '26px 1.4fr 1.1fr 1.1fr 90px 45px',
          alignItems: 'center',
          padding: '6px 8px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          fontSize: '10px',
          fontWeight: 700,
          color: '#8e8e8e',
          letterSpacing: '0.08em',
          textTransform: 'uppercase'
        }}
      >
        <span></span>
        <span>TITLE</span>
        <span>ARTIST</span>
        <span>ALBUM</span>
        <span>DATE</span>
        <span style={{ textAlign: 'right' }}>⏱</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {playlist.map((trk, idx) => {
          const isCurrent = idx === currentTrackIndex;
          return (
            <div
              key={trk.id || idx}
              onClick={() => onSelectTrack(idx)}
              style={{
                display: 'grid',
                gridTemplateColumns: '26px 1.4fr 1.1fr 1.1fr 90px 45px',
                alignItems: 'center',
                padding: '8px',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                fontSize: '12.5px',
                color: isCurrent ? '#1ed760' : '#ffffff',
                cursor: 'pointer',
                borderRadius: '6px',
                backgroundColor: isCurrent ? 'rgba(30,215,96,0.08)' : 'transparent'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', color: isCurrent ? '#1ed760' : '#8e8e8e', fontSize: '11px' }}>
                {isCurrent ? '🔊' : '♥'}
              </div>

              <span style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '8px' }}>
                {trk.title}
              </span>

              <span style={{ color: isCurrent ? '#1ed760' : '#b3b3b3', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '8px', fontSize: '12px' }}>
                {trk.artist}
              </span>

              <span style={{ color: isCurrent ? '#1ed760' : '#8e8e8e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '8px', fontSize: '11.5px' }}>
                {trk.album}
              </span>

              <span style={{ color: '#8e8e8e', fontSize: '11px' }}>
                {trk.added || '2 hours ago'}
              </span>

              <span style={{ textAlign: 'right', color: isCurrent ? '#1ed760' : '#8e8e8e', fontSize: '11px' }}>
                {formatTime(trk.durationSec)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}