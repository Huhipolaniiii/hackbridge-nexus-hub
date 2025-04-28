
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electronAPI', {
    executePythonBridge: (method, ...args) => {
      console.log(`Preload: calling python-bridge-execute with method ${method}`);
      return ipcRenderer.invoke('python-bridge-execute', method, ...args);
    }
  }
);

console.log('Preload script executed, electronAPI exposed');

