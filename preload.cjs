const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onLiveMediaData: (callback) => {
    const listener = (_e, data) => callback(data);
    ipcRenderer.on('live-media-data', listener);
    return () => ipcRenderer.removeListener('live-media-data', listener);
  },
  onTelemetryData: (callback) => {
    const listener = (_e, data) => callback(data);
    ipcRenderer.on('telemetry-data', listener);
    return () => ipcRenderer.removeListener('telemetry-data', listener);
  },
  onSimulatedKnobStep: (callback) => {
    const listener = (_event, dir) => callback(dir);
    ipcRenderer.on('simulated-knob-step', listener);
    return () => ipcRenderer.removeListener('simulated-knob-step', listener);
  },
  onSimulatedMacroKey: (callback) => {
    const listener = (_e, data) => callback(data);
    ipcRenderer.on('simulated-macro-key', listener);
    return () => ipcRenderer.removeListener('simulated-macro-key', listener);
  },
  onOpenSpotifyDeck: (callback) => {
    const listener = () => callback();
    ipcRenderer.on('open-spotify-deck', listener);
    return () => ipcRenderer.removeListener('open-spotify-deck', listener);
  },

  getLiveMedia: () => ipcRenderer.invoke('get-live-media'),
  seekMedia: (seconds) => ipcRenderer.send('seek-media', seconds),
  sendKey: (action) => ipcRenderer.send('send-key', action),
  setVolumeStep: (direction) => ipcRenderer.send('set-volume-step', direction),
  launchAppTarget: (appConfig) => ipcRenderer.send('launch-app-target', appConfig),
  triggerMacroAction: (key) => ipcRenderer.send('trigger-macro-action', key),
  exitApp: () => ipcRenderer.send('exit-app'),
  selectExecutableFile: () => ipcRenderer.invoke('select-executable-file')
});