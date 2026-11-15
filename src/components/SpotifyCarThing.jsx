import React, { useState, useEffect, useRef } from 'react';

function formatTime(sec) {
  if (!sec || isNaN(sec) || sec < 0) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

const Svg = {
  Home: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.5 3.247a1 1 0 0 0-1 0L4 7.577V20h4.5v-6a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v6H20V7.577l-7.5-4.33zm-2-1.732a3 3 0 0 1 3 0l7.5 4.33a2 2 0 0 1 1 1.732V21a1 1 0 0 1-1 1h-6.5a1 1 0 0 1-1-1v-6h-3v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.577a2 2 0 0 1 1-1.732l7.5-4.33z" />
    </svg>
  ),
  Browse: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <circle cx="12" cy="14.5" r="2.5" />
    </svg>
  ),
  Radio: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14" />
    </svg>
  ),
  Search: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Heart: ({ filled }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? "#1ed760" : "none"} stroke={filled ? "#1ed760" : "currentColor"} strokeWidth="1.8">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  PlusCircle: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  ),
  Shuffle: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 3 21 3 21 8" />
      <line x1="4" y1="20" x2="21" y2="3" />
      <polyline points="21 16 21 21 16 21" />
      <line x1="15" y1="15" x2="21" y2="21" />
      <line x1="4" y1="4" x2="9" y2="9" />
    </svg>
  ),
  Prev: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <polygon points="19 20 9 12 19 4 19 20" />
      <rect x="5" y="4" width="2.5" height="16" rx="1" />
    </svg>
  ),
  Next: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 4 15 12 5 20 5 4" />
      <rect x="16.5" y="4" width="2.5" height="16" rx="1" />
    </svg>
  ),
  Play: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#000000" style={{ marginLeft: '2px' }}>
      <polygon points="6 4 20 12 6 20 6 4" />
    </svg>
  ),
  Pause: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#000000">
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  ),
  Repeat: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  ),
  RowSpeaker: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  VideoCam: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  ),
  MicLyrics: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12" />
      <circle cx="17" cy="7" r="5" />
    </svg>
  ),
  QueueIcon: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="14" y2="18" />
    </svg>
  ),
  MiniplayerIcon: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <rect x="11" y="11" width="8" height="7" rx="1" fill="currentColor" />
    </svg>
  ),
  FullscreenIcon: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  )
};

const BASE_TRACK_POOL = [
  { id: 't1', title: 'Starboy', artist: 'The Weeknd', album: 'Starboy', durationSec: 230, cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=200' },
  { id: 't2', title: 'Die With A Smile', artist: 'Lady Gaga & Bruno Mars', album: 'Die With A Smile', durationSec: 252, cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200' },
  { id: 't3', title: 'Timeless', artist: 'The Weeknd & Playboi Carti', album: 'Hurry Up Tomorrow', durationSec: 256, cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200' },
  { id: 't4', title: 'Cheap Thrills', artist: 'Sia', album: 'This Is Acting', durationSec: 211, cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200' },
  { id: 't5', title: 'Hymn for the Weekend', artist: 'Coldplay', album: 'A Head Full of Dreams', durationSec: 258, cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200' },
  { id: 't6', title: 'Mockingbird', artist: 'Eminem', album: 'Encore', durationSec: 250, cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200' },
  { id: 't7', title: 'Heat Waves', artist: 'Glass Animals', album: 'Dreamland', durationSec: 239, cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=200' },
  { id: 't8', title: 'Counting Stars', artist: 'OneRepublic', album: 'Native', durationSec: 257, cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=200' },
  { id: 't9', title: 'M. - Sped Up Version', artist: 'Anıl Emre Daldal', album: 'SILLY MATTERS', durationSec: 176, cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200' },
  { id: 't10', title: 'Hislerim', artist: 'Serhat Durmus', album: 'Hislerim', durationSec: 214, cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200' },
  { id: 't11', title: 'Living Life, In The Night', artist: 'Cheriimoya, Sierra Kidd', album: 'Living Life', durationSec: 135, cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200' },
  { id: 't12', title: 'Tu hai kahan', artist: 'AUR', album: 'Tu hai kahan', durationSec: 263, cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200' },
  { id: 't13', title: 'moonlight (kali uchis) [sped up]', artist: 'Kali Uchis', album: 'Red Moon', durationSec: 156, cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200' },
  { id: 't14', title: "eyes blue or brown, can't remember", artist: 'sped up viral', album: 'Speed Viral', durationSec: 138, cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=200' },
  { id: 't15', title: 'bloody mary (lady gaga) [sped up]', artist: 'sped up viral', album: 'Viral Hits', durationSec: 174, cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=200' },
  { id: 't16', title: 'After Hours', artist: 'The Weeknd', album: 'After Hours', durationSec: 361, cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200' },
  { id: 't17', title: 'Green Light', artist: 'Lorde', album: 'Melodrama', durationSec: 234, cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200' },
  { id: 't18', title: 'Die Again', artist: 'SLEEPYHEAD', album: 'Phonk Vol. 1', durationSec: 168, cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200' },
  { id: 't19', title: 'Devil Eyes', artist: 'Hippie Sabotage', album: 'Providence', durationSec: 137, cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200' },
  { id: 't20', title: 'I Miss You (feat. Julia Michaels)', artist: 'Clean Bandit', album: 'What Is Love?', durationSec: 201, cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=200' }
];

const INITIAL_PLAYLISTS = {
  'Liked Songs': BASE_TRACK_POOL,
  'Mood off': [...BASE_TRACK_POOL.slice(5, 20), ...BASE_TRACK_POOL.slice(0, 5)],
  '1245ff': [...BASE_TRACK_POOL.slice(7, 20), ...BASE_TRACK_POOL.slice(0, 7)],
  'My Shazam Tracks': [...BASE_TRACK_POOL.slice(2, 18)],
  'Made For You': [...BASE_TRACK_POOL.slice(0, 16)]
};

const SPOTIFY_HOME_QUICK_TILES = [
  { id: 'qt1', name: 'Mood off', sub: 'Playlist • tanishq', cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=200', targetPlaylist: 'Mood off' },
  { id: 'qt2', name: '1245ff', sub: 'Playlist • tanishq', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200', targetPlaylist: '1245ff' },
  { id: 'qt3', name: 'Liked Songs', sub: 'Playlist • 248 songs', cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200', targetPlaylist: 'Liked Songs' },
  { id: 'qt4', name: 'My Shazam Tracks', sub: 'Playlist • tanishq', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200', targetPlaylist: 'My Shazam Tracks' }
];

const BROWSE_CATEGORIES = [
  { id: 'bc1', title: 'Sped Up & Viral', sub: 'Nightcore & TikTok Hits', query: 'sped up viral', bg: '#e1118c', cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200' },
  { id: 'bc2', title: 'Drift Phonk', sub: 'Kordhell & Gym Phonk', query: 'drift phonk', bg: '#dc148c', cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=200' },
  { id: 'bc3', title: 'Desi & Hindi Hits', sub: 'Arijit Singh & Pritam', query: 'arijit singh hindi', bg: '#b02897', cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200' },
  { id: 'bc4', title: 'Gaming Anthems', sub: 'Valorant & FPS Hype', query: 'the weeknd playboi carti', bg: '#1e3264', cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=200' },
  { id: 'bc5', title: 'Global Pop', sub: 'Lady Gaga, Bruno Mars, Sia', query: 'lady gaga bruno mars sia', bg: '#148a08', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200' },
  { id: 'bc6', title: 'Late Night Chill', sub: 'Lo-Fi Study & Sleep', query: 'lofi chill beats', bg: '#503750', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200' },
  { id: 'bc7', title: 'Hip-Hop & Rap', sub: 'Eminem, Travis Scott, Drake', query: 'eminem travis scott drake', bg: '#ba5d07', cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200' },
  { id: 'bc8', title: 'Rock Classics', sub: 'Coldplay & OneRepublic', query: 'coldplay onerepublic', bg: '#e8115b', cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=200' },
  { id: 'bc9', title: 'Turkish Viral', sub: 'Anıl Emre Daldal & Serhat', query: 'anil emre daldal serhat durmus', bg: '#0d73ec', cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=200' }
];

const SPOTIFY_RECOMMENDED_CARDS = [
  { id: 'rc1', title: 'Hislerim', artist: 'Serhat Durmus', album: 'Hislerim', durationSec: 214, cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300', type: 'song' },
  { id: 'rc2', title: 'Living Life, In The Night', artist: 'Cheriimoya, Sierra Kidd', album: 'Living Life', durationSec: 135, cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300', type: 'song' },
  { id: 'rc3', title: 'The Weeknd Radio', artist: 'The Weeknd, Kali Uchis, Drake', cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300', type: 'playlist', targetPlaylist: 'Made For You', badge: 'RADIO' },
  { id: 'rc4', title: 'Arijit Singh Radio', artist: 'Arijit Singh, Pritam, Atif Aslam', cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300', type: 'playlist', targetPlaylist: 'Made For You', badge: 'RADIO' }
];

export default function SpotifyCarThing({
  media,
  onClose,
  onControl,
  onSelectTrack,
  onSeek,
  volume,
  onVolumeChange,
  showVolOsd,
  isMuted,
  onToggleMute,
  onOpenYtMusic
}) {
  const [activeNav, setActiveNav] = useState('Liked Songs');
  const [activeTab, setActiveTab] = useState('UP NEXT'); // 'UP NEXT' | 'LYRICS' | 'VIDEO' | 'PLAYLIST'
  const [homeCategoryPill, setHomeCategoryPill] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [isPlayerMinimized, setIsPlayerMinimized] = useState(false);
  const [isVideoStage, setIsVideoStage] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isLiked, setIsLiked] = useState(true);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  const [bgColors, setBgColors] = useState({
    top: '#7a1c24',
    mid: '#3b0d12',
    bot: '#0b0e14'
  });

  const [playlistsMap, setPlaylistsMap] = useState(INITIAL_PLAYLISTS);
  const [nextInQueueList, setNextInQueueList] = useState(BASE_TRACK_POOL.slice(1, 15));
  const [recentlyPlayed, setRecentlyPlayed] = useState(BASE_TRACK_POOL.slice(0, 12));
  const [lyricsLines, setLyricsLines] = useState([]);
  const [queueToast, setQueueToast] = useState(null);

  const scrubberRef = useRef(null);
  const miniScrubberRef = useRef(null);
  const videoPlayerRef = useRef(null);
  const isDraggingScrubber = useRef(false);

  const isPlaying = media.status === 'Playing';
  const duration = media.duration > 0 ? media.duration : 230;
  const position = media.position || 0;
  const progressPercent = Math.min(100, Math.max(0, (position / duration) * 100));

  // Only show the search bar when on Home or Browse screens!
  const isSearchScreen = activeNav === 'Home' || activeNav === 'Browse';

  // 1. Dynamic Album Cover RGB Extraction
  useEffect(() => {
    const coverUrl = media.albumCover;
    if (!coverUrl) return;

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = coverUrl;

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 24;
        canvas.height = 24;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 24, 24);
        const data = ctx.getImageData(0, 0, 24, 24).data;

        let rTotal = 0, gTotal = 0, bTotal = 0, count = 0;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i + 1], b = data[i + 2];
          const brightness = (r + g + b) / 3;
          if (brightness > 25 && brightness < 235) {
            rTotal += r;
            gTotal += g;
            bTotal += b;
            count++;
          }
        }

        if (count > 0) {
          const r = Math.min(240, Math.round((rTotal / count) * 1.15));
          const g = Math.min(240, Math.round((gTotal / count) * 1.15));
          const b = Math.min(240, Math.round((bTotal / count) * 1.15));

          setBgColors({
            top: `rgb(${r}, ${g}, ${b})`,
            mid: `rgb(${Math.round(r * 0.45)}, ${Math.round(g * 0.45)}, ${Math.round(b * 0.45)})`,
            bot: '#0b0e14'
          });
        }
      } catch (e) {}
    };
  }, [media.albumCover, media.title]);

  // 2. Auto-Enrich Playlists on Mount
  useEffect(() => {
    const queries = {
      '1245ff': 'the weeknd phonk night drive',
      'Mood off': 'sad lofi chill hindi turkish',
      'Liked Songs': 'top pop hits lady gaga the weeknd sia'
    };

    Object.entries(queries).forEach(([plName, q]) => {
      fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(q)}&entity=song&limit=25`)
        .then(r => r.json())
        .then(data => {
          if (data.results && data.results.length > 0) {
            const fetched = data.results.map(item => ({
              id: `pl-${plName}-${item.trackId}`,
              title: item.trackName,
              artist: item.artistName,
              album: item.collectionName || 'Single',
              durationSec: Math.round((item.trackTimeMillis || 180000) / 1000),
              cover: item.artworkUrl100 ? item.artworkUrl100.replace('100x100bb', '300x300bb') : null,
              previewUrl: item.previewUrl
            }));
            setPlaylistsMap(prev => {
              const existing = prev[plName] || [];
              const combined = [...existing];
              fetched.forEach(f => {
                if (!combined.some(e => e.title.toLowerCase() === f.title.toLowerCase())) {
                  combined.push(f);
                }
              });
              return { ...prev, [plName]: combined };
            });
          }
        })
        .catch(() => {});
    });
  }, []);

  // 3. Dynamically Update "Next Up" Queue & Lyrics Whenever Active Song Changes
  useEffect(() => {
    if (!media.title || media.title.includes('Ready')) return;

    const currentItem = {
      id: `live-${media.title}`,
      title: media.title,
      artist: media.artist || 'Spotify',
      album: media.album || 'Single',
      durationSec: media.duration || 210,
      cover: media.albumCover || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200'
    };

    setRecentlyPlayed(prev => {
      const filtered = prev.filter(t => t.title.toLowerCase() !== media.title.toLowerCase());
      return [currentItem, ...filtered].slice(0, 20);
    });

    const artistTerm = (media.artist || 'The Weeknd').split(/[,&]/)[0].trim();
    fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(artistTerm)}&entity=song&limit=12`)
      .then(r => r.json())
      .then(data => {
        if (data.results && data.results.length > 0) {
          const related = data.results
            .filter(item => item.trackName.toLowerCase() !== media.title.toLowerCase())
            .map(item => ({
              id: `rel-${item.trackId}`,
              title: item.trackName,
              artist: item.artistName,
              album: item.collectionName || 'Single',
              durationSec: Math.round((item.trackTimeMillis || 180000) / 1000),
              cover: item.artworkUrl100 ? item.artworkUrl100.replace('100x100bb', '300x300bb') : null,
              previewUrl: item.previewUrl
            }));

          if (related.length > 0) {
            setNextInQueueList(prev => {
              const manualQueued = prev.filter(t => t.queuedNext && t.title.toLowerCase() !== media.title.toLowerCase());
              const existingIds = new Set(manualQueued.map(m => m.title.toLowerCase()));
              const freshRelated = related.filter(r => !existingIds.has(r.title.toLowerCase()));
              return [...manualQueued, ...freshRelated];
            });
          }
        }
      })
      .catch(() => {});

    const cleanQuery = `${media.title.replace(/\(.*?\)|\[.*?\]|- sped up/gi, '')} ${media.artist || ''}`.trim();
    fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(cleanQuery)}&entity=musicVideo&limit=1`)
      .then(r => r.json())
      .then(data => {
        if (data.results && data.results.length > 0 && data.results[0].previewUrl) {
          setVideoUrl(data.results[0].previewUrl);
        }
      })
      .catch(() => {});

    fetch(`https://lrclib.net/api/search?q=${encodeURIComponent(cleanQuery)}`)
      .then(r => r.json())
      .then(list => {
        if (Array.isArray(list) && list.length > 0 && list[0].plainLyrics) {
          setLyricsLines(list[0].plainLyrics.split('\n').filter(l => l.trim() !== ''));
        } else {
          setLyricsLines([
            `♪ ${media.title} — ${media.artist}`,
            'Syncing live lyrics with playback timer...',
            'Instrumental / Vocal track active'
          ]);
        }
      })
      .catch(() => {});
  }, [media.title, media.artist]);

  // 4. Live Search Input Handler (Only active on Home / Browse)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(searchQuery)}&entity=song&limit=25`)
        .then(r => r.json())
        .then(data => {
          if (data.results) {
            setSearchResults(
              data.results.map(item => ({
                id: `sr-${item.trackId}`,
                title: item.trackName,
                artist: item.artistName,
                album: item.collectionName || 'Single',
                durationSec: Math.round((item.trackTimeMillis || 180000) / 1000),
                cover: item.artworkUrl100 ? item.artworkUrl100.replace('100x100bb', '300x300bb') : null,
                previewUrl: item.previewUrl
              }))
            );
          }
          setIsSearching(false);
        })
        .catch(() => setIsSearching(false));
    }, 260);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (!videoPlayerRef.current) return;
    if (isPlaying) {
      videoPlayerRef.current.play().catch(() => {});
    } else {
      videoPlayerRef.current.pause();
    }
  }, [isPlaying, videoUrl, isVideoStage, activeTab]);

  const handlePlayNext = (song, e) => {
    if (e) e.stopPropagation();
    setNextInQueueList(prev => {
      const rest = prev.filter(t => t.title.toLowerCase() !== song.title.toLowerCase());
      return [{ ...song, id: `next-${Date.now()}`, queuedNext: true }, ...rest];
    });
    setQueueToast(`Queued Next: ${song.title}`);
    setTimeout(() => setQueueToast(null), 1800);
  };

  const handleAddSongToCurrentPlaylist = (song, e) => {
    if (e) e.stopPropagation();
    const targetPlaylistName = playlistsMap[activeNav] ? activeNav : 'Liked Songs';
    setPlaylistsMap(prev => {
      const list = prev[targetPlaylistName] || [];
      if (list.some(t => t.title.toLowerCase() === song.title.toLowerCase())) return prev;
      return {
        ...prev,
        [targetPlaylistName]: [song, ...list]
      };
    });
    setQueueToast(`Saved to ${targetPlaylistName}`);
    setTimeout(() => setQueueToast(null), 1800);
  };

  const handlePlayTrackDirectly = (trk, sourceList) => {
    if (sourceList && Array.isArray(sourceList)) {
      const idx = sourceList.findIndex(t => t.title === trk.title);
      if (idx !== -1) {
        const upcoming = [...sourceList.slice(idx + 1), ...sourceList.slice(0, idx)];
        if (upcoming.length > 0) setNextInQueueList(upcoming);
      }
    }
    if (onSelectTrack) onSelectTrack(trk, false);
  };

  const handleSkipNextSmart = () => {
    if (nextInQueueList.length > 0) {
      setNextInQueueList(prev => [...prev.slice(1), prev[0]]);
    }
    onControl('next');
  };
  const handleSkipPrevSmart = () => {
    if (position > 5 && onSeek) {
      onSeek(0);
      return;
    }
    onControl('prev');
  };

  const handleOpenPlaylistLibrary = (playlistName) => {
    setActiveNav(playlistName);
    setActiveTab('PLAYLIST');
    setSearchQuery('');
  };

  const updateSeekFromPointer = (clientX, refToUse) => {
    const activeRef = refToUse || scrubberRef.current;
    if (!activeRef) return;
    const rect = activeRef.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const targetSec = Math.round(pct * duration);
    if (onSeek) onSeek(targetSec);
  };

  useEffect(() => {
    const onMove = (e) => {
      if (isDraggingScrubber.current) updateSeekFromPointer(e.clientX, scrubberRef.current);
    };
    const onUp = () => {
      isDraggingScrubber.current = false;
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [duration]);

  const currentPlaylistSongs =
    activeNav === 'Recently Played'
      ? recentlyPlayed
      : playlistsMap[activeNav] || playlistsMap['Liked Songs'];

  const displayedList =
    isSearchScreen && searchQuery.trim() !== ''
      ? searchResults
      : currentPlaylistSongs;

  const isHomeMode = activeNav === 'Home' && searchQuery.trim() === '';
  const isBrowseMode = activeNav === 'Browse' && searchQuery.trim() === '';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        width: '1920px',
        height: '480px',
        backgroundColor: '#050507',
        padding: '8px 12px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
        fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* ── POP-UP VOLUME BAR OSD ── */}
      {(showVolOsd || isMuted) && (
        <div
          style={{
            position: 'fixed',
            top: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 250,
            backgroundColor: 'rgba(15, 23, 42, 0.94)',
            backdropFilter: 'blur(12px)',
            border: isMuted ? '1.5px solid #ef4444' : '1.5px solid #1ed760',
            borderRadius: '999px',
            padding: '7px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 12px 32px rgba(0,0,0,0.75)'
          }}
        >
          <button
            onClick={onToggleMute}
            style={{ background: 'none', border: 'none', color: isMuted ? '#ef4444' : '#1ed760', fontSize: '12px', fontWeight: 800, cursor: 'pointer', padding: 0 }}
          >
            {isMuted ? 'MUTED' : 'VOL'}
          </button>
          <div style={{ width: '130px', height: '6px', backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: '999px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${isMuted ? 0 : volume}%`,
                height: '100%',
                backgroundColor: isMuted ? '#ef4444' : '#1ed760',
                borderRadius: '999px',
                transition: 'width 0.1s ease'
              }}
            />
          </div>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#ffffff', minWidth: '32px', textAlign: 'right' }}>
            {isMuted ? '0%' : `${volume}%`}
          </span>
        </div>
      )}

      {/* ── HARDWARE RECTANGULAR BEZEL CONTAINER ── */}
      <div
        style={{
          width: '100%',
          flex: 1,
          backgroundColor: '#121212',
          borderRadius: '18px',
          border: '1.5px solid rgba(255,255,255,0.1)',
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.8), 0 16px 40px rgba(0,0,0,0.9)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>

          {/* ── 1. LEFT SIDEBAR ── */}
          <div
            style={{
              width: '200px',
              height: '100%',
              backgroundColor: '#121212',
              borderRight: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '14px 0 10px 0',
              boxSizing: 'border-box',
              flexShrink: 0,
              position: 'relative'
            }}
          >
            <div
              style={{
                position: 'absolute',
                right: '5px',
                top: '18px',
                width: '4px',
                height: '80px',
                backgroundColor: 'rgba(255,255,255,0.85)',
                borderRadius: '999px'
              }}
            />

            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {[
                  { id: 'Home', label: 'Home', icon: <Svg.Home /> },
                  { id: 'Browse', label: 'Browse', icon: <Svg.Browse /> },
                  { id: 'Radio', label: 'Radio', icon: <Svg.Radio /> }
                ].map((nav) => {
                  const active = activeNav === nav.id;
                  return (
                    <button
                      key={nav.id}
                      onClick={() => {
                        setActiveNav(nav.id);
                        setSearchQuery('');
                        if (nav.id === 'Radio') setActiveTab('UP NEXT');
                      }}
                      style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '7px 20px',
                        background: 'none',
                        border: 'none',
                        color: active ? '#ffffff' : '#b3b3b3',
                        fontSize: '14px',
                        fontWeight: active ? 700 : 600,
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      {active && (
                        <span
                          style={{
                            position: 'absolute',
                            left: 0,
                            top: '4px',
                            bottom: '4px',
                            width: '4px',
                            backgroundColor: '#1ed760',
                            borderRadius: '0 4px 4px 0'
                          }}
                        />
                      )}
                      <span style={{ display: 'flex' }}>{nav.icon}</span>
                      <span>{nav.label}</span>
                    </button>
                  );
                })}
              </div>

              <div style={{ marginTop: '12px' }}>
                <span
                  style={{
                    display: 'block',
                    padding: '0 20px',
                    fontSize: '10px',
                    fontWeight: 700,
                    color: '#a7a7a7',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    marginBottom: '4px'
                  }}
                >
                  YOUR LIBRARY
                </span>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                  {['Made For You', 'Recently Played', 'Liked Songs', 'Mood off', '1245ff', 'My Shazam Tracks'].map((item) => {
                    const active = activeNav === item;
                    return (
                      <button
                        key={item}
                        onClick={() => handleOpenPlaylistLibrary(item)}
                        style={{
                          position: 'relative',
                          padding: '5px 20px',
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
              </div>
            </div>

            <div style={{ padding: '0 12px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {onOpenYtMusic && (
                <button
                  onClick={onOpenYtMusic}
                  style={{
                    width: '100%',
                    padding: '5px 8px',
                    borderRadius: '7px',
                    backgroundColor: 'rgba(255, 0, 0, 0.16)',
                    border: '1px solid rgba(255, 70, 70, 0.35)',
                    color: '#fca5a5',
                    fontSize: '10.5px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  ▶ Open YT Music
                </button>
              )}

              <div style={{ display: 'flex', gap: '5px' }}>
                <button
                  onClick={() => setIsPlayerMinimized(!isPlayerMinimized)}
                  title="Minimize / Expand Player Bar"
                  style={{
                    flex: 1,
                    padding: '5px 6px',
                    borderRadius: '7px',
                    backgroundColor: isPlayerMinimized ? 'rgba(30,215,96,0.18)' : 'rgba(255,255,255,0.06)',
                    border: isPlayerMinimized ? '1px solid #1ed760' : '1px solid rgba(255,255,255,0.08)',
                    color: isPlayerMinimized ? '#1ed760' : '#e2e8f0',
                    fontSize: '10.5px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {isPlayerMinimized ? '⤢ Expand' : '─ Minimize'}
                </button>
                <button
                  onClick={onClose}
                  title="Return to Dashboard"
                  style={{
                    padding: '5px 9px',
                    borderRadius: '7px',
                    backgroundColor: 'rgba(239,68,68,0.18)',
                    border: '1px solid rgba(239,68,68,0.35)',
                    color: '#fca5a5',
                    fontSize: '10.5px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          {/* ── 2. CENTER NOW PLAYING CARD ── */}
          {!isPlayerMinimized && (
            <div
              style={{
                width: '720px',
                height: '100%',
                background: `linear-gradient(180deg, ${bgColors.top} 0%, ${bgColors.mid} 52%, ${bgColors.bot} 100%)`,
                transition: 'background 0.75s cubic-bezier(0.22, 1, 0.36, 1)',
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
              <div
                style={{
                  width: '224px',
                  height: '224px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 22px 50px rgba(0,0,0,0.68)',
                  flexShrink: 0,
                  backgroundColor: '#101014',
                  position: 'relative'
                }}
              >
                {isVideoStage && videoUrl ? (
                  <video
                    ref={videoPlayerRef}
                    src={videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <img
                    src={media.albumCover || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600'}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}

                <button
                  onClick={() => setIsVideoStage(!isVideoStage)}
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '10px',
                    backgroundColor: 'rgba(0,0,0,0.75)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: isVideoStage ? '#1ed760' : '#ffffff',
                    borderRadius: '999px',
                    padding: '4px 10px',
                    fontSize: '10px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    cursor: 'pointer'
                  }}
                >
                  <Svg.VideoCam />
                  <span>{isVideoStage ? 'Switch to Audio' : 'Switch to Video'}</span>
                </button>
              </div>

              <div
                style={{
                  flex: 1,
                  height: '224px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minWidth: 0
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ minWidth: 0 }}>
                    <h1
                      style={{
                        margin: 0,
                        fontSize: '25px',
                        fontWeight: 700,
                        color: '#ffffff',
                        letterSpacing: '-0.025em',
                        lineHeight: 1.2,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {media.title}
                    </h1>
                    <h2
                      style={{
                        margin: '5px 0 0 0',
                        fontSize: '16.5px',
                        fontWeight: 500,
                        color: 'rgba(255,255,255,0.82)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {media.artist}
                    </h2>
                  </div>

                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ffffff',
                      cursor: 'pointer',
                      padding: '4px',
                      flexShrink: 0
                    }}
                  >
                    <Svg.Heart filled={isLiked} />
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '330px', margin: '4px 0' }}>
                  <button
                    onClick={() => setIsShuffle(!isShuffle)}
                    style={{ ...iconBtnStyle, color: isShuffle ? '#1ed760' : '#ffffff' }}
                  >
                    <Svg.Shuffle />
                  </button>

                  <button onClick={handleSkipPrevSmart} style={iconBtnStyle} title="Previous Track">
                    <Svg.Prev />
                  </button>

                  <button
                    onClick={() => onControl('play-pause')}
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '50%',
                      backgroundColor: '#ffffff',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
                    }}
                  >
                    {isPlaying ? <Svg.Pause /> : <Svg.Play />}
                  </button>

                  <button onClick={handleSkipNextSmart} style={iconBtnStyle} title="Next Track">
                    <Svg.Next />
                  </button>

                  <button
                    onClick={() => setIsRepeat(!isRepeat)}
                    style={{ ...iconBtnStyle, color: isRepeat ? '#1ed760' : '#ffffff' }}
                  >
                    <Svg.Repeat />
                  </button>
                </div>

                <div style={{ width: '100%' }}>
                  <div
                    ref={scrubberRef}
                    onMouseDown={(e) => {
                      isDraggingScrubber.current = true;
                      updateSeekFromPointer(e.clientX, scrubberRef.current);
                    }}
                    onClick={(e) => updateSeekFromPointer(e.clientX, scrubberRef.current)}
                    style={{
                      width: '100%',
                      height: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: '7px',
                        backgroundColor: 'rgba(255,255,255,0.24)',
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
                          backgroundImage: 'repeating-linear-gradient(90deg, #1ed760 0px, #1ed760 4px, rgba(0,0,0,0.35) 4px, rgba(0,0,0,0.35) 6px)',
                          borderRadius: '999px',
                          position: 'relative'
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            right: '-7px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '14px',
                            height: '14px',
                            borderRadius: '50%',
                            backgroundColor: '#ffffff',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.6)'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      color: 'rgba(255,255,255,0.85)',
                      marginTop: '2px'
                    }}
                  >
                    <span>{formatTime(position)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              3. RIGHT PANEL: SEARCH ONLY ON HOME/BROWSE; YT MUSIC PANEL TABS OTHERWISE
              ════════════════════════════════════════════════════════════════ */}
          <div
            style={{
              flex: 1,
              height: '100%',
              backgroundColor: '#121212',
              padding: '14px 18px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              minWidth: 0
            }}
          >
            {/* Top Header: Search Bar ONLY on Home/Browse; YT Music Tabs (UP NEXT / LYRICS / VIDEO / LIBRARY) on all other screens */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                paddingBottom: '8px',
                marginBottom: '8px',
                flexShrink: 0
              }}
            >
              {isSearchScreen ? (
                <>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: '#242424',
                      borderRadius: '999px',
                      padding: '6px 14px',
                      border: '1px solid rgba(255,255,255,0.14)',
                      width: isPlayerMinimized ? '380px' : '260px',
                      flexShrink: 0
                    }}
                  >
                    <span style={{ color: '#b3b3b3', display: 'flex' }}><Svg.Search /></span>
                    <input
                      type="text"
                      placeholder="What do you want to play?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        background: 'none',
                        border: 'none',
                        outline: 'none',
                        color: '#ffffff',
                        fontSize: '12px',
                        width: '100%'
                      }}
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        style={{ background: 'none', border: 'none', color: '#9e9e9e', cursor: 'pointer', padding: 0, fontSize: '11px' }}
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto' }}>
                    {['All', 'Music', 'Podcasts', 'Audiobooks'].map((pill) => {
                      const active = homeCategoryPill === pill;
                      return (
                        <button
                          key={pill}
                          onClick={() => setHomeCategoryPill(pill)}
                          style={{
                            padding: '4px 12px',
                            borderRadius: '999px',
                            border: 'none',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            backgroundColor: active ? '#ffffff' : '#242424',
                            color: active ? '#000000' : '#ffffff',
                            cursor: 'pointer',
                            flexShrink: 0
                          }}
                        >
                          {pill}
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                /* Clean YT Music-style Panel Header (NO Search Bar) */
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', whiteSpace: 'nowrap' }}>
                    {activeNav}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
                    {[
                      { id: 'UP NEXT', label: 'UP NEXT' },
                      { id: 'LYRICS', label: 'LYRICS' },
                      { id: 'VIDEO', label: 'VIDEO' },
                      { id: 'PLAYLIST', label: `LIBRARY (${currentPlaylistSongs.length})` }
                    ].map((tab) => {
                      const active = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            borderBottom: active ? '2px solid #1ed760' : '2px solid transparent',
                            color: active ? '#ffffff' : '#9e9e9e',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            letterSpacing: '0.06em',
                            padding: '4px 0',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {queueToast && (
              <div style={{ marginBottom: '6px', fontSize: '11px', fontWeight: 700, color: '#1ed760', backgroundColor: 'rgba(30,215,96,0.14)', padding: '3px 10px', borderRadius: '6px', alignSelf: 'flex-start' }}>
                ✓ {queueToast}
              </div>
            )}

            {/* ── VIEW 1: BROWSE TILES ── */}
            {isBrowseMode ? (
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '4px', minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff' }}>Browse All</span>
                  <span style={{ fontSize: '10.5px', color: '#a7a7a7', fontWeight: 600 }}>Tap any card to load songs</span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isPlayerMinimized ? 'repeat(4, minmax(0, 1fr))' : 'repeat(3, minmax(0, 1fr))',
                    gap: '10px',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                >
                  {BROWSE_CATEGORIES.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => setSearchQuery(cat.query)}
                      style={{
                        height: '88px',
                        backgroundColor: cat.bg,
                        borderRadius: '8px',
                        padding: '10px 12px',
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden',
                        boxSizing: 'border-box',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                      }}
                    >
                      <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#ffffff', lineHeight: 1.2, maxWidth: '72%' }}>
                        {cat.title}
                      </div>
                      <div style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginTop: '3px', maxWidth: '68%' }}>
                        {cat.sub}
                      </div>

                      <img
                        src={cat.cover}
                        alt=""
                        style={{
                          position: 'absolute',
                          right: '-8px',
                          bottom: '-6px',
                          width: '56px',
                          height: '56px',
                          borderRadius: '6px',
                          objectFit: 'cover',
                          transform: 'rotate(22deg)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.45)'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : isHomeMode ? (
              /* ── VIEW 2: SPOTIFY HOME SCREEN ── */
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', paddingRight: '4px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px' }}>
                  {SPOTIFY_HOME_QUICK_TILES.map((tile) => (
                    <div
                      key={tile.id}
                      onClick={() => handleOpenPlaylistLibrary(tile.targetPlaylist)}
                      style={{
                        height: '46px',
                        backgroundColor: '#282828',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingRight: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                        <img src={tile.cover} alt="" style={{ width: '46px', height: '46px', objectFit: 'cover', flexShrink: 0 }} />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {tile.name}
                          </div>
                          <div style={{ fontSize: '10px', color: '#a7a7a7' }}>{tile.sub}</div>
                        </div>
                      </div>
                      <span style={{ color: '#1ed760', fontSize: '11px', fontWeight: 800 }}>lll</span>
                    </div>
                  ))}
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                    <div>
                      <span style={{ fontSize: '10px', color: '#a7a7a7', display: 'block' }}>Inspired by your recent activity</span>
                      <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#ffffff' }}>Recommended for you</h3>
                    </div>
                    <button
                      onClick={() => handleOpenPlaylistLibrary('Liked Songs')}
                      style={{ background: 'none', border: 'none', color: '#b3b3b3', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Show all
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '10px' }}>
                    {SPOTIFY_RECOMMENDED_CARDS.map((card) => (
                      <div
                        key={card.id}
                        onClick={() => {
                          if (card.type === 'song') {
                            handlePlayTrackDirectly(card, INITIAL_PLAYLISTS['Liked Songs']);
                          } else {
                            handleOpenPlaylistLibrary(card.targetPlaylist);
                          }
                        }}
                        style={{
                          backgroundColor: '#181818',
                          borderRadius: '8px',
                          padding: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '5px'
                        }}
                      >
                        <div style={{ position: 'relative', width: '100%', height: '86px', borderRadius: '6px', overflow: 'hidden' }}>
                          <img src={card.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <div
                            style={{
                              position: 'absolute',
                              bottom: '6px',
                              right: '6px',
                              width: '26px',
                              height: '26px',
                              borderRadius: '50%',
                              backgroundColor: '#1ed760',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <span style={{ color: '#000', fontSize: '10px', fontWeight: 900 }}>▶</span>
                          </div>
                        </div>
                        <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {card.title}
                        </div>
                        <div style={{ fontSize: '10px', color: '#a7a7a7', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {card.artist}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : !isSearchScreen && activeTab === 'VIDEO' ? (
              <div style={{ flex: 1, backgroundColor: '#090a0f', borderRadius: '12px', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {videoUrl ? (
                  <video src={videoUrl} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600 }}>Loading Official Music Video Stream...</div>
                )}
              </div>
            ) : !isSearchScreen && activeTab === 'LYRICS' ? (
              <div style={{ flex: 1, backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '16px 22px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#1ed760', textTransform: 'uppercase' }}>
                  Lyrics Preview • {media.title}
                </span>
                {lyricsLines.map((line, i) => (
                  <p key={i} style={{ margin: 0, fontSize: '19px', fontWeight: 700, lineHeight: 1.35, color: i < 2 ? '#ffffff' : 'rgba(255,255,255,0.45)' }}>
                    {line}
                  </p>
                ))}
              </div>
            ) : !isSearchScreen && activeTab === 'UP NEXT' ? (
              /* ── VIEW 5: YT MUSIC / SPOTIFY UP NEXT QUEUE ── */
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '4px' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#a7a7a7', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '4px' }}>
                    Now Playing
                  </span>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '28px 1.4fr 1fr 60px',
                      alignItems: 'center',
                      padding: '7px 10px',
                      backgroundColor: 'rgba(30,215,96,0.12)',
                      border: '1px solid rgba(30,215,96,0.28)',
                      borderRadius: '8px',
                      color: '#1ed760',
                      fontSize: '13px'
                    }}
                  >
                    <Svg.RowSpeaker />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden', paddingRight: '8px' }}>
                      <img src={media.albumCover} alt="" style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover', flexShrink: 0 }} />
                      <span style={{ fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{media.title}</span>
                    </div>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '12px' }}>{media.artist}</span>
                    <span style={{ textAlign: 'right', fontSize: '11px', fontWeight: 700 }}>{formatTime(duration)}</span>
                  </div>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#1ed760', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '4px' }}>
                    Next Up ({nextInQueueList.length})
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {nextInQueueList.map((trk, idx) => (
                      <div
                        key={trk.id || idx}
                        onClick={() => handlePlayTrackDirectly(trk, nextInQueueList)}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '28px 1.4fr 1fr 76px',
                          alignItems: 'center',
                          padding: '6px 8px',
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                          fontSize: '12.5px',
                          color: '#ffffff',
                          cursor: 'pointer'
                        }}
                      >
                        <span style={{ color: '#9e9e9e', fontSize: '11px', fontWeight: 700 }}>{idx + 1}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden', paddingRight: '8px', minWidth: 0 }}>
                          {trk.cover && <img src={trk.cover} alt="" style={{ width: '30px', height: '30px', borderRadius: '4px', objectFit: 'cover', flexShrink: 0 }} />}
                          <span style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{trk.title}</span>
                        </div>
                        <span style={{ color: '#b3b3b3', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '12px' }}>{trk.artist}</span>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <button
                            onClick={(e) => handlePlayNext(trk, e)}
                            style={{
                              padding: '3px 7px',
                              borderRadius: '5px',
                              backgroundColor: trk.queuedNext ? 'rgba(30,215,96,0.2)' : 'rgba(255,255,255,0.08)',
                              border: trk.queuedNext ? '1px solid #1ed760' : '1px solid rgba(255,255,255,0.12)',
                              color: trk.queuedNext ? '#1ed760' : '#e2e8f0',
                              fontSize: '10px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            {trk.queuedNext ? 'TOP' : '↑ Top'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* ── VIEW 6: PLAYLIST LIBRARY / SEARCH RESULTS + LOWER "NEXT UP" STRIP ── */
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', gap: '8px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '28px 1.35fr 1fr 105px',
                      alignItems: 'center',
                      padding: '0 8px 5px 8px',
                      borderBottom: '1px solid rgba(255,255,255,0.08)',
                      fontSize: '10px',
                      fontWeight: 600,
                      color: '#9e9e9e',
                      letterSpacing: '0.08em'
                    }}
                  >
                    <span>#</span>
                    <span>TITLE</span>
                    <span>ARTIST</span>
                    <span style={{ textAlign: 'right' }}>QUEUE</span>
                  </div>

                  <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                    {isSearching ? (
                      <div style={{ padding: '20px', textAlign: 'center', color: '#9e9e9e', fontSize: '12px' }}>Searching Spotify catalog...</div>
                    ) : (
                      displayedList.map((trk, idx) => {
                        const isCurrent = trk.title.toLowerCase() === media.title.toLowerCase();
                        return (
                          <div
                            key={trk.id || idx}
                            onClick={() => handlePlayTrackDirectly(trk, displayedList)}
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '28px 1.35fr 1fr 105px',
                              alignItems: 'center',
                              padding: '6px 8px',
                              borderBottom: '1px solid rgba(255,255,255,0.04)',
                              fontSize: '12.5px',
                              backgroundColor: isCurrent ? 'rgba(30,215,96,0.08)' : 'transparent',
                              color: isCurrent ? '#1ed760' : '#ffffff',
                              borderRadius: '6px',
                              cursor: 'pointer'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', color: isCurrent ? '#1ed760' : '#b3b3b3', fontSize: '11px', fontWeight: 700 }}>
                              {isCurrent ? <Svg.RowSpeaker /> : idx + 1}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden', paddingRight: '10px', minWidth: 0 }}>
                              {trk.cover && <img src={trk.cover} alt="" style={{ width: '30px', height: '30px', borderRadius: '4px', objectFit: 'cover', flexShrink: 0 }} />}
                              <span style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{trk.title}</span>
                            </div>

                            <span style={{ color: isCurrent ? '#1ed760' : '#b3b3b3', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '8px', minWidth: 0, fontSize: '12px' }}>
                              {trk.artist}
                            </span>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                              {isSearchScreen && searchQuery.trim() !== '' && (
                                <button
                                  onClick={(e) => handleAddSongToCurrentPlaylist(trk, e)}
                                  style={{ padding: '3px 6px', borderRadius: '5px', backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#1ed760', fontSize: '10px', fontWeight: 800, cursor: 'pointer' }}
                                >
                                  + Save
                                </button>
                              )}
                              <button
                                onClick={(e) => handlePlayNext(trk, e)}
                                style={{
                                  padding: '3px 7px',
                                  borderRadius: '5px',
                                  backgroundColor: trk.queuedNext ? 'rgba(30,215,96,0.2)' : 'rgba(255,255,255,0.08)',
                                  border: trk.queuedNext ? '1px solid #1ed760' : '1px solid rgba(255,255,255,0.12)',
                                  color: trk.queuedNext ? '#1ed760' : '#e2e8f0',
                                  fontSize: '10px',
                                  fontWeight: 700,
                                  cursor: 'pointer'
                                }}
                              >
                                {trk.queuedNext ? 'NEXT' : '+ Next'}
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Lower Section: Always-Accurate "Next Up" Bar */}
                {nextInQueueList.length > 0 && (
                  <div
                    onClick={() => handleSkipNextSmart()}
                    style={{
                      height: '40px',
                      backgroundColor: '#1a1d24',
                      borderRadius: '8px',
                      border: '1px solid rgba(30,215,96,0.28)',
                      padding: '0 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                      <span style={{ fontSize: '10px', fontWeight: 800, color: '#1ed760', textTransform: 'uppercase', flexShrink: 0 }}>
                        NEXT UP:
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {nextInQueueList[0].title} — {nextInQueueList[0].artist}
                      </span>
                    </div>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab('UP NEXT');
                      }}
                      style={{ fontSize: '10px', fontWeight: 700, color: '#1ed760', flexShrink: 0 }}
                    >
                      Open Queue ({nextInQueueList.length}) →
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── 4. SPOTIFY BOTTOM MINI-PLAYER BAR ── */}
        {isPlayerMinimized && (
          <div
            style={{
              width: '100%',
              height: '80px',
              backgroundColor: '#000000',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              padding: '0 20px',
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
              zIndex: 50
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '360px', minWidth: 0 }}>
              <img
                src={media.albumCover}
                alt=""
                onClick={() => setIsPlayerMinimized(false)}
                style={{ width: '52px', height: '52px', borderRadius: '6px', objectFit: 'cover', cursor: 'pointer', flexShrink: 0 }}
              />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {media.title}
                </div>
                <div style={{ fontSize: '12px', color: '#b3b3b3', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {media.artist}
                </div>
              </div>
              <button
                onClick={() => setIsPlayerMinimized(false)}
                style={{ background: 'none', border: 'none', color: '#b3b3b3', cursor: 'pointer', fontSize: '15px', padding: '4px' }}
              >
                ✕
              </button>
              <button
                onClick={() => handleAddSongToCurrentPlaylist({ title: media.title, artist: media.artist, album: media.album, durationSec: duration, cover: media.albumCover })}
                style={{ background: 'none', border: 'none', color: '#b3b3b3', cursor: 'pointer', padding: '4px', display: 'flex' }}
              >
                <Svg.PlusCircle />
              </button>
            </div>

            <div style={{ flex: 1, maxWidth: '640px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
                <button onClick={() => setIsShuffle(!isShuffle)} style={{ ...iconBtnStyle, padding: '2px', color: isShuffle ? '#1ed760' : '#b3b3b3' }}>
                  <Svg.Shuffle size={16} />
                </button>
                <button onClick={handleSkipPrevSmart} style={{ ...iconBtnStyle, padding: '2px' }}>
                  <Svg.Prev size={18} />
                </button>
                <button
                  onClick={() => onControl('play-pause')}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  {isPlaying ? <Svg.Pause size={16} /> : <Svg.Play size={16} />}
                </button>
                <button onClick={handleSkipNextSmart} style={{ ...iconBtnStyle, padding: '2px' }}>
                  <Svg.Next size={18} />
                </button>
                <button onClick={() => setIsRepeat(!isRepeat)} style={{ ...iconBtnStyle, padding: '2px', color: isRepeat ? '#1ed760' : '#b3b3b3' }}>
                  <Svg.Repeat size={16} />
                </button>
              </div>

              <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '11px', color: '#a7a7a7', minWidth: '30px', textAlign: 'right' }}>
                  {formatTime(position)}
                </span>
                <div
                  ref={miniScrubberRef}
                  onClick={(e) => updateSeekFromPointer(e.clientX, miniScrubberRef.current)}
                  style={{ flex: 1, height: '12px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                >
                  <div style={{ width: '100%', height: '4px', backgroundColor: '#4d4d4d', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${progressPercent}%`, height: '100%', backgroundColor: '#ffffff', borderRadius: '999px' }} />
                  </div>
                </div>
                <span style={{ fontSize: '11px', color: '#a7a7a7', minWidth: '30px' }}>
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '14px', width: '360px' }}>
              <button
                onClick={() => {
                  setActiveNav('Liked Songs');
                  setActiveTab('LYRICS');
                }}
                style={{ ...iconBtnStyle, padding: '4px', color: activeTab === 'LYRICS' ? '#1ed760' : '#b3b3b3' }}
              >
                <Svg.MicLyrics />
              </button>
              <button
                onClick={() => {
                  setActiveNav('Liked Songs');
                  setActiveTab('UP NEXT');
                }}
                style={{ ...iconBtnStyle, padding: '4px', color: activeTab === 'UP NEXT' ? '#1ed760' : '#b3b3b3' }}
              >
                <Svg.QueueIcon />
              </button>

              <button
                onClick={onToggleMute}
                style={{ ...iconBtnStyle, padding: '4px', color: isMuted ? '#ef4444' : '#b3b3b3', fontSize: '13px' }}
              >
                {isMuted ? '🔇' : '🔊'}
              </button>

              <div
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = Math.max(0, Math.min(100, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
                  if (onVolumeChange) onVolumeChange(pct);
                }}
                style={{ width: '90px', height: '4px', backgroundColor: '#4d4d4d', borderRadius: '999px', cursor: 'pointer', overflow: 'hidden' }}
              >
                <div style={{ width: `${isMuted ? 0 : volume}%`, height: '100%', backgroundColor: '#ffffff', borderRadius: '999px' }} />
              </div>

              <button
                onClick={() => setIsPlayerMinimized(false)}
                style={{ ...iconBtnStyle, padding: '4px', color: '#1ed760' }}
              >
                <Svg.MiniplayerIcon />
              </button>
              <button
                onClick={() => {
                  setIsPlayerMinimized(false);
                  setIsVideoStage(true);
                }}
                style={{ ...iconBtnStyle, padding: '4px', color: '#b3b3b3' }}
              >
                <Svg.FullscreenIcon />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const iconBtnStyle = {
  background: 'none',
  border: 'none',
  color: '#ffffff',
  cursor: 'pointer',
  padding: '6px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0.92
};