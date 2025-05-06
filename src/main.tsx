
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Check if running in Electron
const isElectron = 'electronAPI' in window;

// Initialize the application
const startApp = () => {
  const container = document.getElementById("root");
  if (!container) {
    throw new Error("Root element not found");
  }
  
  const root = createRoot(container);
  root.render(<App />);
  
  // Log the runtime environment
  console.log(`Running in ${isElectron ? 'Electron' : 'browser'} mode`);
  
  if (isElectron) {
    console.log("Electron API available");
    // Initialize Electron-specific features if needed
  } else {
    console.info("Running in browser mode, Electron features will be disabled");
    // Initialize browser-only features if needed
  }
};

// Start the application
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded, starting app');
  startApp();
});
