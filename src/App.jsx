import React, { useState, useEffect, useRef } from 'react';

const Icons = {
  Play: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <polygon points="6 4 20 12 6 20 6 4" />
    </svg>
  ),
  Pause: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
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
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "#ef4444" : "none"} stroke={filled ? "#ef4444" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  Repeat: ({ size = 15 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  ),
  ListMusic: ({ size = 15 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15V6" />
      <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
      <path d="M12 12H3" />
      <path d="M16 6H3" />
      <path d="M12 18H3" />
    </svg>
  ),
  Volume: ({ size = 15 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  ),
  MoreHorizontal: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
    </svg>
  ),
  ChevronLeft: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  ChevronRight: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  CheckCircle: ({ size = 17, checked = false }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={checked ? "#1e293b" : "none"} stroke="#1e293b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      {checked && <polyline points="16 9 10.5 14.5 8 12" stroke="#ffffff" strokeWidth="2.2" />}
    </svg>
  ),
  Plus: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Speedometer: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v2" />
      <path d="M4.93 4.93l1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="M17.66 6.34l1.41-1.41" />
      <path d="M12 6a6 6 0 0 0-6 6c0 1.93.91 3.65 2.33 4.75L12 12" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  ),
  BarChart: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
      <line x1="12" y1="20" x2="12" y2="8" />
    </svg>
  ),
  GridGauge: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <path d="M14 6a5 5 0 0 1 7 5" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <circle cx="17.5" cy="17.5" r="3.5" />
    </svg>
  ),
  KnobDial: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="3" x2="12" y2="8" />
    </svg>
  ),
  Settings: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  Mic: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  ),
  MicOff: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
      <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
      <line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  ),
  Headphones: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  ),
  Video: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  ),
  VideoOff: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M21 15.5l-5-3.5 5-3.5v7z" /><path d="M16 16v1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7" /><path d="M10 5h4a2 2 0 0 1 2 2v3" />
    </svg>
  ),
  Gamepad: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="12" x2="10" y2="12" /><line x1="8" y1="10" x2="8" y2="14" />
      <line x1="15" y1="13" x2="15.01" y2="13" /><line x1="18" y1="11" x2="18.01" y2="11" />
      <rect x="2" y="6" width="20" height="12" rx="6" />
    </svg>
  ),
  Columns: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="12" y1="3" x2="12" y2="21" />
    </svg>
  ),
  PhoneOff: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" />
      <line x1="23" y1="1" x2="1" y2="23" />
    </svg>
  ),
  X: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
};

export default function App() {
  const [activeProfile, setActiveProfile] = useState('NORMAL');
  const isGameMode = activeProfile === 'GAME';

  const [slot1App, setSlot1App] = useState(null);
  const [slot2App, setSlot2App] = useState(null);
  const [isSplitMode, setIsSplitMode] = useState(false);

  // Volume in bottom-right corner (0-100)
  const [volume, setVolume] = useState(70);

  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isDockHovered, setIsDockHovered] = useState(false);
  const [hoveredAppId, setHoveredAppId] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  // Telemetry HUD state and hover inspection popup
  const [hoveredMetric, setHoveredMetric] = useState(null); // 'cpu', 'gpu', 'ram', 'shortcut'
  const [telemetry, setTelemetry] = useState({
    cpu: 34,
    cpuGhz: '2.60',
    ramUsed: '13.2',
    ramTotal: '15.7',
    ramPercent: 84,
    nvidiaLoad: 0,
    intelLoad: 24,
    diskLoad: 3,
    netDownload: 512,
    netUpload: 24
  });

  // Time & Calendar State
  const [currentTime, setCurrentTime] = useState('14:17');
  const [calendarInfo, setCalendarInfo] = useState({
    monthShort: 'NOV',
    monthFull: 'NOVEMBER',
    dayNum: 11,
    daysInMonth: 30,
    startDay: 6
  });

  // Interactive Tasks & Notes with Add-on system
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Update portfolio website.', done: true },
    { id: 2, text: 'Reply to client feedback.', done: true },
    { id: 3, text: 'Schedule X posts.', done: false },
    { id: 4, text: 'Export assets for dev handoff.', done: false }
  ]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskInput, setNewTaskInput] = useState('');

  // Media Player State
  const [mediaInfo, setMediaInfo] = useState({
    title: 'House of Card',
    artist: 'Radiohead',
    status: 'Playing',
    currentTime: '02:09',
    totalTime: '05:46',
    progress: 38
  });

  // Live Hardware Webcam Stream
  const videoRef = useRef(null);
  const [cameraError, setCameraError] = useState(false);
  const [callDuration, setCallDuration] = useState(42);

  const webview1Ref = useRef(null);
  const webview2Ref = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setCallDuration(p => p + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCallTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Clock & Calendar sync
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);

      const monthsShort = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const monthsFull = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

      const monthIndex = now.getMonth();
      const firstDay = new Date(now.getFullYear(), monthIndex, 1).getDay();
      const adjustedStartDay = firstDay === 0 ? 6 : firstDay - 1;
      const totalDays = new Date(now.getFullYear(), monthIndex + 1, 0).getDate();

      setCalendarInfo({
        monthShort: monthsShort[monthIndex],
        monthFull: monthsFull[monthIndex],
        dayNum: now.getDate(),
        daysInMonth: totalDays,
        startDay: adjustedStartDay
      });
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleWebviewReady = (ref) => {
    if (ref.current) {
      ref.current.insertCSS(`
        body { zoom: 0.74 !important; overflow-y: auto !important; }
        ytmusic-nav-bar { height: 44px !important; }
      `);
    }
  };

  useEffect(() => {
    let streamTrack = null;
    if (!isVideoOff && !slot1App) {
      navigator.mediaDevices?.getUserMedia({ video: { width: 480, height: 360 }, audio: false })
        .then((stream) => {
          streamTrack = stream;
          if (videoRef.current) videoRef.current.srcObject = stream;
          setCameraError(false);
        })
        .catch(() => setCameraError(true));
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(t => t.stop());
        videoRef.current.srcObject = null;
      }
    }
    return () => {
      if (streamTrack) streamTrack.getTracks().forEach(t => t.stop());
    };
  }, [isVideoOff, slot1App]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (slot1App || slot2App) {
          setSlot1App(null);
          setSlot2App(null);
          setIsSplitMode(false);
        } else {
          try {
            if (window.require) {
              const { ipcRenderer } = window.require('electron');
              ipcRenderer.send('exit-app');
            }
          } catch (err) {}
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slot1App, slot2App]);

  useEffect(() => {
    let cleanUpMedia = null;
    let cleanUpTelemetry = null;
    try {
      if (typeof window !== 'undefined' && window.require) {
        const { ipcRenderer } = window.require('electron');
        const handleMedia = (_e, data) => {
          if (data && data.Title) {
            setMediaInfo(prev => ({
              ...prev,
              title: data.Title,
              artist: data.Artist || 'Windows Audio',
              status: data.Status || 'Playing'
            }));
          }
        };
        ipcRenderer.on('live-media-data', handleMedia);
        cleanUpMedia = () => ipcRenderer.removeListener('live-media-data', handleMedia);

        const handleTelemetry = (_e, data) => {
          if (data) setTelemetry(data);
        };
        ipcRenderer.on('telemetry-data', handleTelemetry);
        cleanUpTelemetry = () => ipcRenderer.removeListener('telemetry-data', handleTelemetry);
      }
    } catch (err) {}
    return () => {
      if (cleanUpMedia) cleanUpMedia();
      if (cleanUpTelemetry) cleanUpTelemetry();
    };
  }, []);

  const sendKey = (action) => {
    if (window.require) {
      try {
        const { ipcRenderer } = window.require('electron');
        ipcRenderer.send('send-key', action);
        if (action === 'play-pause') {
          setMediaInfo(p => ({
            ...p,
            status: p.status === 'Playing' ? 'Paused' : 'Playing'
          }));
        }
      } catch (err) {}
    }
  };

  const handleVolumeChange = (newVol) => {
    const direction = newVol > volume ? 'up' : 'down';
    const clamped = Math.min(100, Math.max(0, newVol));
    setVolume(clamped);
    if (window.require) {
      try {
        const { ipcRenderer } = window.require('electron');
        ipcRenderer.send('set-volume-step', direction);
      } catch (e) {}
    }
  };

  const launchDesktopApp = (appName) => {
    if (window.require) {
      try {
        const { ipcRenderer } = window.require('electron');
        ipcRenderer.send('launch-main-app', appName);
      } catch (err) {}
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

  const dockApps = [
    { id: 1, name: 'YT Music', type: 'embedded', url: 'https://music.youtube.com', icon: '🎵', color: '#146BBC' },
    { id: 2, name: 'Brave', type: 'embedded', url: 'https://search.brave.com', icon: '🦁', color: '#6ECBD3' },
    { id: 3, name: 'Discord', type: 'embedded', url: 'https://discord.com/app', icon: '💬', color: '#146BBC' },
    { id: 4, name: 'VS Code', type: 'desktop', icon: '💻', color: '#6ECBD3' },
    { id: 5, name: 'Steam', type: 'desktop', icon: '🎮', color: '#9FE7E7' },
    { id: 6, name: 'OBS Studio', type: 'desktop', icon: '🎥', color: '#146BBC' },
    { id: 7, name: 'Terminal', type: 'desktop', icon: '⚡', color: '#0F1A1B' }
  ];

  const handleDockClick = (app) => {
    if (app.type === 'embedded') {
      if (!slot1App) {
        setSlot1App(app);
      } else if (!isSplitMode) {
        if (slot1App.id === app.id) {
          setSlot1App(null);
        } else {
          setSlot1App(app);
        }
      } else {
        if (!slot2App && slot1App.id !== app.id) {
          setSlot2App(app);
        } else if (slot1App.id === app.id) {
          setSlot1App(slot2App);
          setSlot2App(null);
          setIsSplitMode(false);
        } else if (slot2App?.id === app.id) {
          setSlot2App(null);
        } else {
          setSlot2App(app);
        }
      }
    } else {
      launchDesktopApp(app.name);
    }
  };

  const theme = {
    bg: '#eceef3',
    cardBg: '#ffffff',
    cardBorder: '1px solid #e2e8f0',
    cardShadow: '0 6px 20px rgba(15, 23, 42, 0.06)',
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
    accent1: '#0284c7',
    notchBg: '#0f172a',
    dockBg: '#ffffff'
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: theme.bg,
      color: theme.textPrimary,
      position: 'relative',
      overflow: 'hidden',
      userSelect: 'none',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      <link href="https://fonts.googleapis.com/css2?family=Audiowide&display=swap" rel="stylesheet" />

      {/* ── 1. ACTIVE APP EMBED VIEW ── */}
      {slot1App ? (
        <div style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          display: 'flex',
          backgroundColor: '#000000'
        }}>
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '24px',
            zIndex: 40,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(16px)',
            padding: '6px 14px',
            borderRadius: '9999px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)'
          }}>
            <button onClick={() => sendKey('prev')} style={pillBtn}>⏮</button>
            <button onClick={() => sendKey('play-pause')} style={pillBtn}>⏯</button>
            <button onClick={() => sendKey('next')} style={pillBtn}>⏭</button>

            <button
              onClick={() => {
                if (isSplitMode) {
                  setIsSplitMode(false);
                  setSlot2App(null);
                } else {
                  setIsSplitMode(true);
                }
              }}
              style={{
                ...pillBtn,
                color: isSplitMode ? '#38bdf8' : '#ffffff',
                backgroundColor: isSplitMode ? 'rgba(56, 189, 248, 0.25)' : 'transparent',
                borderRadius: '6px',
                padding: '4px 8px'
              }}
            >
              <Icons.Columns size={14} /> {isSplitMode ? 'Split Mode' : 'Split'}
            </button>

            <button
              onClick={() => {
                setSlot1App(null);
                setSlot2App(null);
                setIsSplitMode(false);
              }}
              style={{ ...pillBtn, color: '#f87171' }}
            >
              <Icons.X size={14} /> Close
            </button>
          </div>

          <div style={{
            flex: 1,
            height: '100%',
            position: 'relative',
            borderRight: isSplitMode ? '2px solid rgba(255, 255, 255, 0.15)' : 'none'
          }}>
            <webview
              ref={webview1Ref}
              src={slot1App.url}
              style={{ width: '100%', height: '100%', border: 'none' }}
              allowpopups="true"
              onDomReady={() => handleWebviewReady(webview1Ref)}
              useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
            />
          </div>

          {isSplitMode && (
            <div style={{ flex: 1, height: '100%', position: 'relative' }}>
              {slot2App ? (
                <webview
                  ref={webview2Ref}
                  src={slot2App.url}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  allowpopups="true"
                  onDomReady={() => handleWebviewReady(webview2Ref)}
                  useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#0F172A',
                  color: '#94a3b8'
                }}>
                  <Icons.Columns size={34} />
                  <span style={{ marginTop: '12px', fontSize: '13px', fontWeight: 700, color: '#e2e8f0' }}>
                    Click a 2nd App in the Dock to run side-by-side
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* ── 2. QUADRANT HOME VIEW ── */
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          padding: '16px 20px 84px 20px',
          boxSizing: 'border-box',
          gap: '16px'
        }}>

          {/* ── LEFT STRIP: HARDWARE TELEMETRY HUD WITH HOVER INFO POPUP ── */}
          <div style={{
            width: '68px',
            backgroundColor: '#27292f',
            borderRadius: '26px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 6px',
            boxSizing: 'border-box',
            flexShrink: 0,
            position: 'relative',
            zIndex: 30
          }}>
            {/* Top Interactive Metric Triggers */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', alignItems: 'center' }}>
              
              {/* CPU Indicator */}
              <div
                onMouseEnter={() => setHoveredMetric('cpu')}
                onMouseLeave={() => setHoveredMetric(null)}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '16px',
                  backgroundColor: hoveredMetric === 'cpu' ? '#383b44' : 'transparent',
                  border: hoveredMetric === 'cpu' ? '1.5px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <Icons.Speedometer size={20} />
                <span style={{ fontSize: '8px', fontWeight: 800, marginTop: '2px', color: '#38bdf8' }}>
                  {telemetry.cpu}%
                </span>

                {/* CPU Hover Tooltip Card */}
                {hoveredMetric === 'cpu' && (
                  <div style={hoverTooltipStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '6px', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 800, color: '#38bdf8', fontSize: '11px' }}>CPU PROCESSOR</span>
                      <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 700 }}>52°C</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '10px', color: '#cbd5e1' }}>
                      <div><strong>Model:</strong> Intel Core i5-12th Gen</div>
                      <div><strong>Load:</strong> {telemetry.cpu}% Utilization</div>
                      <div><strong>Base Clock:</strong> {telemetry.cpuGhz} GHz</div>
                      <div><strong>Cores:</strong> 8 Cores / 12 Threads</div>
                    </div>
                  </div>
                )}
              </div>

              {/* GPU Indicator */}
              <div
                onMouseEnter={() => setHoveredMetric('gpu')}
                onMouseLeave={() => setHoveredMetric(null)}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '16px',
                  backgroundColor: hoveredMetric === 'gpu' ? '#383b44' : 'transparent',
                  border: hoveredMetric === 'gpu' ? '1.5px solid #10b981' : '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <Icons.GridGauge size={20} />
                <span style={{ fontSize: '8px', fontWeight: 800, marginTop: '2px', color: '#10b981' }}>
                  {telemetry.intelLoad}%
                </span>

                {/* GPU Hover Tooltip Card */}
                {hoveredMetric === 'gpu' && (
                  <div style={hoverTooltipStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '6px', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 800, color: '#10b981', fontSize: '11px' }}>DUAL GRAPHICS</span>
                      <span style={{ fontSize: '10px', color: '#fbbf24', fontWeight: 700 }}>64°C</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '10px', color: '#cbd5e1' }}>
                      <div><strong>Dedicated:</strong> RTX 3050 ({telemetry.nvidiaLoad}%)</div>
                      <div><strong>Integrated:</strong> Intel UHD ({telemetry.intelLoad}%)</div>
                      <div><strong>VRAM:</strong> 4GB GDDR6</div>
                      <div><strong>Render:</strong> Direct3D 12</div>
                    </div>
                  </div>
                )}
              </div>

              {/* RAM Indicator */}
              <div
                onMouseEnter={() => setHoveredMetric('ram')}
                onMouseLeave={() => setHoveredMetric(null)}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '16px',
                  backgroundColor: hoveredMetric === 'ram' ? '#383b44' : 'transparent',
                  border: hoveredMetric === 'ram' ? '1.5px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <Icons.BarChart size={20} />
                <span style={{ fontSize: '8px', fontWeight: 800, marginTop: '2px', color: '#fbbf24' }}>
                  {telemetry.ramUsed}G[cite: 7]
                </span>

                {/* RAM Hover Tooltip Card */}
                {hoveredMetric === 'ram' && (
                  <div style={hoverTooltipStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '6px', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 800, color: '#fbbf24', fontSize: '11px' }}>MEMORY & DISK</span>
                      <span style={{ fontSize: '10px', color: '#38bdf8', fontWeight: 700 }}>{telemetry.ramPercent}%</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '10px', color: '#cbd5e1' }}>
                      <div><strong>Memory:</strong> {telemetry.ramUsed} GB / {telemetry.ramTotal} GB</div>
                      <div><strong>NVMe Disk:</strong> {telemetry.diskLoad}% Load</div>
                      <div><strong>Wi-Fi Down:</strong> {telemetry.netDownload} KB/s</div>
                      <div><strong>Wi-Fi Up:</strong> {telemetry.netUpload} KB/s</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Glowing Accent Line */}
            <div style={{
              width: '38px',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
              margin: '4px 0'
            }} />

            {/* Shift + F2 Shortcut Indicator */}
            <div
              onMouseEnter={() => setHoveredMetric('shortcut')}
              onMouseLeave={() => setHoveredMetric(null)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%', position: 'relative', cursor: 'pointer' }}
            >
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                borderRadius: '12px',
                padding: '4px 2px',
                width: '46px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '8px', color: '#94a3b8', fontWeight: 700 }}>Shift</div>
                <div style={{ fontSize: '7px', color: '#64748b', fontWeight: 800 }}>+</div>
                <div style={{ fontSize: '9px', color: '#ffffff', fontWeight: 800 }}>F2</div>
              </div>

              {hoveredMetric === 'shortcut' && (
                <div style={hoverTooltipStyle}>
                  <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '11px', marginBottom: '4px' }}>AURABAR SHORTCUT</div>
                  <div style={{ fontSize: '10px', color: '#cbd5e1' }}>Press <strong>Shift + F2</strong> globally on your PC to toggle the secondary display command center focus.</div>
                </div>
              )}

              <div style={{
                width: '10px',
                height: '10px',
                transform: 'rotate(45deg)',
                backgroundColor: '#ffffff',
                boxShadow: '0 0 8px rgba(255, 255, 255, 0.8)',
                margin: '2px 0'
              }} />

              <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}>
                <Icons.Settings size={16} />
              </button>
            </div>

            {/* Glowing Accent Line */}
            <div style={{
              width: '38px',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
              margin: '4px 0'
            }} />

            {/* Exit App Button */}
            <button
              onClick={() => {
                if (window.require) {
                  try {
                    const { ipcRenderer } = window.require('electron');
                    ipcRenderer.send('exit-app');
                  } catch (e) {}
                }
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Icons.X size={18} />
            </button>
          </div>

          {/* ── 4 CARDS CENTER WORKSPACE (2x2 GRID) ── */}
          <div style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gridTemplateRows: '1fr 1fr',
            gap: '16px'
          }}>

            {/* ── CARD 1: NEUMORPHIC PLAYER (TOP-LEFT) ── */}
            <div style={{
              backgroundColor: '#f6f7fb',
              borderRadius: '28px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 10px 28px rgba(0, 0, 0, 0.05)',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}>
                      <Icons.ChevronLeft size={16} />
                    </button>
                    <div>
                      <h3 style={{
                        margin: 0,
                        fontSize: '15px',
                        fontWeight: 700,
                        color: '#1e293b',
                        maxWidth: '180px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {mediaInfo.title}
                      </h3>
                      <p style={{
                        margin: 0,
                        fontSize: '11px',
                        color: '#94a3b8',
                        fontWeight: 500,
                        maxWidth: '180px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {mediaInfo.artist}
                      </p>
                    </div>
                  </div>
                  <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                    <Icons.MoreHorizontal size={16} />
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '22px', color: '#64748b', paddingLeft: '4px', margin: '4px 0' }}>
                  <button onClick={() => setIsLiked(!isLiked)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit' }}>
                    <Icons.Heart size={15} filled={isLiked} />
                  </button>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit' }}>
                    <Icons.Repeat size={15} />
                  </button>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit' }}>
                    <Icons.ListMusic size={15} />
                  </button>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit' }}>
                    <Icons.Volume size={15} />
                  </button>
                </div>

                <div style={{ paddingRight: '16px' }}>
                  <div style={{
                    width: '100%',
                    height: '4px',
                    backgroundColor: '#e2e8f0',
                    borderRadius: '9999px',
                    position: 'relative',
                    cursor: 'pointer'
                  }}>
                    <div style={{
                      width: `${mediaInfo.progress}%`,
                      height: '100%',
                      backgroundColor: '#1e293b',
                      borderRadius: '9999px',
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        right: '-4px',
                        top: '-3px',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: '#ffffff',
                        border: '2px solid #1e293b',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
                      }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#94a3b8', fontWeight: 600, marginTop: '3px' }}>
                    <span>{mediaInfo.currentTime}</span>
                    <span>{mediaInfo.totalTime}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingTop: '2px' }}>
                  <button onClick={() => sendKey('prev')} style={neumorphicBtnStyle}>
                    <Icons.SkipBack size={15} />
                  </button>
                  <button
                    onClick={() => sendKey('play-pause')}
                    style={{ ...neumorphicBtnStyle, width: '46px', height: '46px' }}
                  >
                    {mediaInfo.status === 'Playing' ? <Icons.Pause size={18} /> : <Icons.Play size={18} />}
                  </button>
                  <button onClick={() => sendKey('next')} style={neumorphicBtnStyle}>
                    <Icons.SkipForward size={15} />
                  </button>
                </div>
              </div>

              {/* Embedded Vinyl Record Well */}
              <div style={{
                width: '142px',
                height: '142px',
                borderRadius: '50%',
                backgroundColor: '#eef1f6',
                boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.08), 0 4px 14px rgba(255,255,255,0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <div style={{
                  width: '124px',
                  height: '124px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, #0f172a 0%, #1e293b 40%, #0f172a 45%, #1e293b 80%, #0f172a 100%)',
                  boxShadow: '0 8px 18px rgba(0,0,0,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: mediaInfo.status === 'Playing' ? 'spin 12s linear infinite' : 'none'
                }}>
                  <div style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    backgroundImage: 'url("https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200&auto=format&fit=crop&q=80")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: '3px solid #ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ fontSize: '7px', color: '#ffffff', fontWeight: 700, textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                      AlbumCover
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── CARD 2: REMINDERS & NOTES (SWAPPED TO TOP-RIGHT) ── */}
            <div style={{
              borderRadius: '28px',
              backgroundColor: '#fffdf9',
              boxShadow: '0 10px 28px rgba(0, 0, 0, 0.05)',
              border: '1px solid #f1ece2',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}>
              {/* Golden Orange Header */}
              <div style={{
                background: 'linear-gradient(180deg, #f59e0b 0%, #fbbf24 40%, rgba(251, 191, 36, 0.4) 100%)',
                padding: '10px 18px 20px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#451a03' }}>Reminders</span>
                  <div style={{ fontSize: '10px', color: '#78350f', fontWeight: 600, marginTop: '1px' }}>{currentTime}</div>
                </div>
                <button
                  onClick={() => setIsAddingTask(!isAddingTask)}
                  style={{
                    backgroundColor: 'rgba(254, 243, 199, 0.85)',
                    border: 'none',
                    borderRadius: '9999px',
                    padding: '3px 12px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#78350f',
                    cursor: 'pointer'
                  }}
                >
                  {isAddingTask ? 'Cancel' : 'Done'}
                </button>
              </div>

              {/* Tasks List Container */}
              <div style={{
                backgroundColor: '#fffdf9',
                borderTopLeftRadius: '22px',
                borderTopRightRadius: '22px',
                marginTop: '-12px',
                padding: '12px 18px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 800, color: '#271b12' }}>
                    Tasks for Today
                  </h4>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#9a3412' }}>
                    {tasks.filter(t => t.done).length}/{tasks.length} Done
                  </span>
                </div>

                {/* Inline Add Task Input Form */}
                {isAddingTask && (
                  <form onSubmit={addTask} style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                    <input
                      type="text"
                      autoFocus
                      placeholder="Add task & press Enter..."
                      value={newTaskInput}
                      onChange={(e) => setNewTaskInput(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '4px 8px',
                        fontSize: '11px',
                        borderRadius: '8px',
                        border: '1px solid #fed7aa',
                        backgroundColor: '#ffffff',
                        color: '#1e293b',
                        outline: 'none'
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        backgroundColor: '#f59e0b',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '4px 10px',
                        fontSize: '10px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Add
                    </button>
                  </form>
                )}

                {/* Task Checklist Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', maxHeight: '82px', overflowY: 'auto' }}>
                  {tasks.map(task => (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <Icons.CheckCircle size={14} checked={task.done} />
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          color: task.done ? '#1e293b' : '#78716c'
                        }}>
                          {task.text}
                        </span>
                      </div>
                      <span
                        onClick={(e) => deleteTask(task.id, e)}
                        style={{ fontSize: '12px', color: '#dc2626', opacity: 0.6, cursor: 'pointer', padding: '0 4px' }}
                      >
                        ×
                      </span>
                    </div>
                  ))}
                </div>

                {/* Floating Add Task Button */}
                <div
                  onClick={() => setIsAddingTask(!isAddingTask)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    bottom: '10px',
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: '#fffaf0',
                    border: '1.5px solid #fed7aa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#9a3412',
                    boxShadow: '0 4px 10px rgba(251, 146, 60, 0.15)',
                    cursor: 'pointer'
                  }}
                >
                  <Icons.Plus size={15} />
                </div>
              </div>
            </div>

            {/* ── CARD 3: CALENDAR (SWAPPED TO BOTTOM-LEFT & TIGHTENED UP) ── */}
            <div style={{
              backgroundColor: '#000000',
              borderRadius: '28px',
              boxShadow: '0 10px 28px rgba(0, 0, 0, 0.25)',
              padding: '16px 22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between', // Balanced filling across entire width
              gap: '20px',
              color: '#ffffff',
              boxSizing: 'border-box'
            }}>
              {/* Left Side: Audiowide Pink Month + Day Number */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
                <span style={{
                  fontFamily: "'Audiowide', cursive",
                  fontSize: '22px',
                  fontWeight: 800,
                  color: '#d92662',
                  letterSpacing: '1.5px',
                  lineHeight: 1
                }}>
                  {calendarInfo.monthShort}
                </span>
                <span style={{
                  fontFamily: "'Audiowide', cursive",
                  fontSize: '56px',
                  fontWeight: 900,
                  color: '#ffffff',
                  lineHeight: 1,
                  marginTop: '4px',
                  letterSpacing: '-1px'
                }}>
                  {calendarInfo.dayNum}
                </span>
                <span style={{ fontSize: '9px', fontWeight: 700, color: '#38bdf8', marginTop: '6px', letterSpacing: '0.5px' }}>
                  TODAY • ACTIVE
                </span>
              </div>

              {/* Right Side: Matrix with tight spacing */}
              <div style={{ flex: 1, maxWidth: '240px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{
                  fontFamily: "'Audiowide', cursive",
                  fontSize: '11px',
                  color: '#ffffff',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  marginBottom: '8px'
                }}>
                  {calendarInfo.monthFull}
                </span>

                {/* Day Headers (M T W T F S S) */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  width: '100%',
                  textAlign: 'center',
                  fontFamily: "'Audiowide', cursive",
                  fontSize: '9px',
                  color: '#a1a1aa',
                  marginBottom: '4px'
                }}>
                  <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                </div>

                {/* Compact Dates Matrix (No weird gap) */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  width: '100%',
                  textAlign: 'center',
                  gap: '3px 0',
                  fontFamily: "'Audiowide', cursive",
                  fontSize: '10px',
                  color: '#ffffff'
                }}>
                  {Array.from({ length: calendarInfo.startDay }).map((_, i) => (
                    <span key={`emp-${i}`} style={{ opacity: 0 }}>0</span>
                  ))}
                  {Array.from({ length: calendarInfo.daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const isToday = day === calendarInfo.dayNum;
                    return (
                      <div
                        key={`day-${day}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '16px'
                        }}
                      >
                        {isToday ? (
                          <span style={{
                            backgroundColor: '#ffffff',
                            color: '#000000',
                            fontWeight: 900,
                            borderRadius: '4px',
                            padding: '1px 5px',
                            fontSize: '9px',
                            boxShadow: '0 2px 6px rgba(255,255,255,0.4)'
                          }}>
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

            {/* ── CARD 4: LIVE WEBCAM & DISCORD HUD (BOTTOM-RIGHT) ── */}
            <div style={{
              borderRadius: '28px',
              border: theme.cardBorder,
              boxShadow: theme.cardShadow,
              overflow: 'hidden',
              position: 'relative',
              backgroundColor: '#0f172a',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '12px'
            }}>
              {!isVideoOff && !cameraError ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: 'scaleX(-1)',
                    zIndex: 0
                  }}
                />
              ) : (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#1e293b',
                  color: '#94a3b8',
                  zIndex: 0
                }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: '#334155',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px'
                  }}>
                    👤
                  </div>
                  <span style={{ fontSize: '11px', marginTop: '8px', color: '#cbd5e1', fontWeight: 600 }}>
                    {isVideoOff ? 'Camera Muted' : 'Camera Feed Idle'}
                  </span>
                </div>
              )}

              {/* Status Header Overlay */}
              <div style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '4px 6px',
                backgroundColor: 'rgba(0, 0, 0, 0.45)',
                backdropFilter: 'blur(8px)',
                borderRadius: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: isVideoOff ? '#ef4444' : '#10b981',
                    boxShadow: isVideoOff ? 'none' : '0 0 8px #10b981'
                  }} />
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#ffffff' }}>
                    Discord Live
                  </span>
                </div>
                <span style={{ fontSize: '10px', color: '#FFD166', fontWeight: 700 }}>
                  {formatCallTime(callDuration)}
                </span>
              </div>

              {/* Bottom Speaking Controls */}
              <div style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 10px',
                backgroundColor: 'rgba(0, 0, 0, 0.55)',
                backdropFilter: 'blur(8px)',
                borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: isMicMuted ? '#ef4444' : '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff'
                  }}>
                    {isMicMuted ? <Icons.MicOff size={10} /> : <Icons.Mic size={10} />}
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#ffffff' }}>
                    {isMicMuted ? 'Muted' : 'Speaking'}
                  </span>
                </div>
                <button
                  onClick={() => setIsVideoOff(!isVideoOff)}
                  style={{
                    background: isVideoOff ? '#10b981' : '#ef4444',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '4px 8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '10px',
                    fontWeight: 700
                  }}
                >
                  {isVideoOff ? <Icons.Video size={10} /> : <Icons.PhoneOff size={10} />}
                  <span>{isVideoOff ? 'Turn Cam On' : 'Hide'}</span>
                </button>
              </div>
            </div>

          </div>

          {/* Right Notch Strip */}
          <div style={{
            width: '74px',
            backgroundColor: theme.notchBg,
            borderRadius: '34px 18px 18px 34px',
            border: '1px solid #334155',
            boxShadow: theme.cardShadow,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-around',
            padding: '18px 0',
            boxSizing: 'border-box',
            flexShrink: 0
          }}>
            <div onClick={() => setIsMicMuted(!isMicMuted)} style={{ cursor: 'pointer', textAlign: 'center' }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '50%',
                backgroundColor: '#1e293b',
                border: `2px solid ${isMicMuted ? '#ef4444' : theme.accent1}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: isMicMuted ? '#ef4444' : theme.accent1
              }}>
                {isMicMuted ? <Icons.MicOff /> : <Icons.Mic />}
              </div>
              <span style={{ fontSize: '9px', fontWeight: 800, color: '#94a3b8', display: 'block', marginTop: '3px' }}>
                {isMicMuted ? 'MUTED' : 'MIC'}
              </span>
            </div>

            <div onClick={() => setIsDeafened(!isDeafened)} style={{ cursor: 'pointer', textAlign: 'center' }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '50%',
                backgroundColor: '#1e293b',
                border: `2px solid ${isDeafened ? '#ef4444' : '#10b981'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: isDeafened ? '#ef4444' : '#10b981'
              }}>
                <Icons.Headphones />
              </div>
              <span style={{ fontSize: '9px', fontWeight: 800, color: '#94a3b8', display: 'block', marginTop: '3px' }}>
                AUDIO
              </span>
            </div>

            <div onClick={() => setActiveProfile(p => p === 'NORMAL' ? 'GAME' : 'NORMAL')} style={{ cursor: 'pointer', textAlign: 'center' }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '50%',
                backgroundColor: '#1e293b',
                border: '2px solid #64748b',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#ffffff'
              }}>
                <Icons.Gamepad size={20} />
              </div>
              <span style={{ fontSize: '9px', fontWeight: 800, color: theme.accent1, display: 'block', marginTop: '3px' }}>
                {isGameMode ? 'GAME' : 'NORM'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── 3. BOTTOM FLOATING APP DOCK (CLEAN ICONS ONLY) ── */}
      <div
        onMouseEnter={() => setIsDockHovered(true)}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '38px',
          zIndex: 40
        }}
      />

      <div
        onMouseEnter={() => setIsDockHovered(true)}
        onMouseLeave={() => { setIsDockHovered(false); setHoveredAppId(null); }}
        style={{
          position: 'absolute',
          bottom: '12px',
          left: '46%', // Shifted to make room for corner volume dial
          transform: `translateX(-50%) translateY(${isDockHovered || (!slot1App && !slot2App) ? '0px' : '90px'})`,
          transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease',
          opacity: isDockHovered || (!slot1App && !slot2App) ? 1 : 0,
          backgroundColor: theme.dockBg,
          backdropFilter: 'blur(24px)',
          borderRadius: '24px',
          border: theme.cardBorder,
          boxShadow: '0 12px 32px rgba(15, 23, 42, 0.15)',
          padding: '8px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          zIndex: 50
        }}
      >
        {dockApps.map((app) => {
          const isSelected = slot1App?.id === app.id || slot2App?.id === app.id;
          const isHovered = hoveredAppId === app.id;

          return (
            <div
              key={app.id}
              onClick={() => handleDockClick(app)}
              onMouseEnter={() => setHoveredAppId(app.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 10px',
                borderRadius: '14px',
                backgroundColor: isSelected ? '#f1f5f9' : 'transparent',
                cursor: 'pointer',
                transform: isHovered ? 'scale(1.18) translateY(-4px)' : (isSelected ? 'scale(1.08)' : 'scale(1)'),
                transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            >
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: app.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '17px',
                boxShadow: isSelected ? `0 0 14px ${app.color}55` : 'none'
              }}>
                {app.icon}
              </div>
              <span style={{ fontSize: '9px', fontWeight: 800, color: theme.textPrimary }}>
                {app.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── 4. RIGHT CORNER VOLUME DIAL (Tied to EC11 Encoder) ── */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        right: '102px', // Docked right next to the right notch strip
        zIndex: 50,
        backgroundColor: '#ffffff',
        borderRadius: '22px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)',
        padding: '6px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        {/* Step Down */}
        <button
          onClick={() => handleVolumeChange(volume - 4)}
          style={{
            background: 'none',
            border: 'none',
            color: '#64748b',
            fontWeight: 800,
            cursor: 'pointer',
            fontSize: '12px',
            padding: '2px'
          }}
        >
          ▼
        </button>

        {/* Rotary Dial Widget */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: '#1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#38bdf8',
            boxShadow: '0 2px 6px rgba(0,0,0,0.18)'
          }}>
            <Icons.KnobDial size={15} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '11px', fontWeight: 900, color: '#0f172a' }}>
              {volume}%
            </span>
            <span style={{ fontSize: '7px', fontWeight: 800, color: '#94a3b8' }}>
              EC11 KNOB
            </span>
          </div>
        </div>

        {/* Step Up */}
        <button
          onClick={() => handleVolumeChange(volume + 4)}
          style={{
            background: 'none',
            border: 'none',
            color: '#0284c7',
            fontWeight: 800,
            cursor: 'pointer',
            fontSize: '12px',
            padding: '2px'
          }}
        >
          ▲
        </button>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const pillBtn = {
  background: 'none',
  border: 'none',
  color: '#ffffff',
  fontSize: '12px',
  fontWeight: 800,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '4px 8px'
};

const neumorphicBtnStyle = {
  width: '38px',
  height: '38px',
  borderRadius: '50%',
  backgroundColor: '#f8fafc',
  border: 'none',
  boxShadow: '4px 4px 10px rgba(0,0,0,0.08), -3px -3px 8px rgba(255,255,255,0.9)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#1e293b',
  cursor: 'pointer'
};

const hoverTooltipStyle = {
  position: 'absolute',
  left: '60px',
  top: '0',
  width: '185px',
  backgroundColor: 'rgba(15, 23, 42, 0.95)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  borderRadius: '14px',
  padding: '10px 12px',
  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.45)',
  zIndex: 100,
  pointerEvents: 'none',
  textAlign: 'left'
};