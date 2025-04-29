
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize the application
const startApp = () => {
  const container = document.getElementById("root");
  if (!container) {
    throw new Error("Root element not found");
  }
  
  const root = createRoot(container);
  root.render(<App />);
  
  // Log the runtime environment
  const isElectron = 'electronAPI' in window;
  console.log(`Running in ${isElectron ? 'Electron' : 'browser'} mode`);
  
  if (isElectron) {
    console.log("Electron API available");
    // We could initialize Electron-specific features here
  } else {
    console.info("Running in browser mode, Electron features will be disabled");
  }
};

// Start the application
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded, starting app');
  startApp();
});
