export function formatTime(sec) {
  if (!sec || isNaN(sec) || sec < 0) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export const BASE_TRACK_POOL = [
  {
    id: 't1',
    title: 'Ride It',
    artist: 'Regard',
    album: 'Ride It',
    durationSec: 158,
    added: '2 hours ago',
    cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=electronic-future-beats-117997.mp3'
  },
  {
    id: 't2',
    title: 'Viva La Vida',
    artist: 'Coldplay',
    album: 'Viva La Vida or D...',
    durationSec: 242,
    added: '2020-03-24',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=chill-abstract-intention-12099.mp3'
  },
  {
    id: 't3',
    title: 'Let You Love Me',
    artist: 'Rita Ora',
    album: 'Phoenix (Deluxe)',
    durationSec: 190,
    added: '2020-03-04',
    cover: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=lofi-study-112191.mp3'
  },
  {
    id: 't4',
    title: 'Fix You',
    artist: 'Coldplay',
    album: 'X&Y',
    durationSec: 295,
    added: '2020-03-21',
    cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db65949a81.mp3?filename=watr-fluid-10149.mp3'
  },
  {
    id: 't5',
    title: '2002',
    artist: 'Anne-Marie',
    album: 'Speak Your Mind...',
    durationSec: 187,
    added: '2020-03-16',
    cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=tuesday-glitch-122413.mp3'
  },
  {
    id: 't6',
    title: 'All I Ask',
    artist: 'Adele',
    album: '25',
    durationSec: 272,
    added: '2020-03-15',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_51a2e37920.mp3?filename=spring-flowers-11440.mp3'
  }
];

export const INITIAL_PLAYLISTS = {
  'Liked Songs': BASE_TRACK_POOL,
  'Made For You': [...BASE_TRACK_POOL.slice(2), ...BASE_TRACK_POOL.slice(0, 2)],
  'Recently Played': [...BASE_TRACK_POOL.slice(0, 4)],
  'Albums': [...BASE_TRACK_POOL.slice(1)],
  'Artists': [...BASE_TRACK_POOL.slice(3)],
  'Mood off': [...BASE_TRACK_POOL.slice(4), ...BASE_TRACK_POOL.slice(0, 4)],
  '1245ff': [...BASE_TRACK_POOL.slice(2), ...BASE_TRACK_POOL.slice(0, 2)]
};