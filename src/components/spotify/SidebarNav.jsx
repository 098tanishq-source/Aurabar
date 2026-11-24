import React from 'react';

export default function SidebarNav({ activeNav, onSelectNav, onClose }) {
  return (
    <div
      style={{
        width: '180px',
        height: '100%',
        backgroundColor: '#121212',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '22px 0 16px 0',
        boxSizing: 'border-box',
        flexShrink: 0,
        position: 'relative'
      }}
    >
      <div
        style={{
          position: 'absolute',
          right: '4px',
          top: '46px',
          width: '3.5px',
          height: '76px',
          backgroundColor: 'rgba(255,255,255,0.85)',
          borderRadius: '999px'
        }}
      />

      <div>
        <span
          style={{
            display: 'block',
            padding: '0 20px',
            fontSize: '9.5px',
            fontWeight: 700,
            color: '#a7a7a7',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '10px'
          }}
        >
          YOUR LIBRARY
        </span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {['Made For You', 'Recently Played', 'Liked Songs', 'Albums', 'Artists'].map((item) => {
            const active = activeNav === item;
            return (
              <button
                key={item}
                onClick={() => onSelectNav(item)}
                style={{
                  position: 'relative',
                  padding: '7px 20px',
                  background: 'none',
                  border: 'none',
                  color: active ? '#ffffff' : '#b3b3b3',
                  fontSize: '13px',
                  fontWeight: active ? 700 : 500,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                {active && (
                  <span
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '3px',
                      bottom: '3px',
                      width: '4px',
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

        <span
          style={{
            display: 'block',
            padding: '0 20px',
            fontSize: '9.5px',
            fontWeight: 700,
            color: '#a7a7a7',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginTop: '18px',
            marginBottom: '8px'
          }}
        >
          PLAYLISTS
        </span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {['Mood off', '1245ff'].map((item) => (
            <button
              key={item}
              onClick={() => onSelectNav(item)}
              style={{
                position: 'relative',
                padding: '6px 20px',
                background: 'none',
                border: 'none',
                color: activeNav === item ? '#1ed760' : '#b3b3b3',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              {activeNav === item && (
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '3px',
                    bottom: '3px',
                    width: '4px',
                    backgroundColor: '#1ed760',
                    borderRadius: '0 4px 4px 0'
                  }}
                />
              )}
              {item}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: '8px',
            backgroundColor: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#e2e8f0',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          ← Cockpit Home
        </button>
      </div>
    </div>
  );
}