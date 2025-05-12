
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Check for Electron/Desktop environment more safely
const isElectron = window.electronAPI !== undefined;

// Initialize the application
const startApp = () => {
  const container = document.getElementById("root");
  if (!container) {
    throw new Error("Root element not found");
  }
  
  console.log("App environment:", isElectron ? "Desktop (Electron)" : "Web Browser");

  // In the web version, we use localStorage
  console.log("Using localStorage for data storage (web mode)");
  
  const root = createRoot(container);
  root.render(<App />);
};

// Start the application
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded, starting app');
  startApp();
});
