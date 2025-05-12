
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize the application in web-only mode
const startApp = () => {
  const container = document.getElementById("root");
  if (!container) {
    throw new Error("Root element not found");
  }
  
  console.log("App environment: Web Browser");
  console.log("Using localStorage for data storage (web mode)");
  
  const root = createRoot(container);
  root.render(<App />);
};

// Start the application
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded, starting app');
  startApp();
});
