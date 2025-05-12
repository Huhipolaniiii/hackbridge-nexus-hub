
// Define empty interface for backward compatibility with existing code
interface ElectronAPI {
  isElectron: boolean;
}

// Ensure window.electronAPI is defined as optional but doesn't break web mode
interface Window {
  electronAPI?: ElectronAPI;
}
