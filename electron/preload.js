
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electronAPI', {
    executePythonBridge: (method, ...args) => {
      console.log(`Preload: calling python-bridge-execute with method ${method}`);
      return ipcRenderer.invoke('python-bridge-execute', method, ...args);
    },
    getAppVersion: () => {
      return ipcRenderer.invoke('get-app-version');
    },
    checkForUpdates: () => {
      return ipcRenderer.invoke('check-for-updates');
    },
    openExternalLink: (url) => {
      return ipcRenderer.invoke('open-external-link', url);
    },
    // New methods for persistent storage
    saveData: (key, data) => {
      return ipcRenderer.invoke('save-data', key, data);
    },
    loadData: (key) => {
      return ipcRenderer.invoke('load-data', key);
    }
  }
);

console.log('Preload script executed, electronAPI exposed');
