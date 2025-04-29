
const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const url = require('url');
const pythonBridge = require('../src/electron/pythonBridge');

// Keep a global reference of the window object to prevent garbage collection
let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, '../public/favicon.ico'),
    title: 'HackBridge',
  });

  // Load the app
  const startUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:8080' 
    : url.format({
        pathname: path.join(__dirname, '../dist/index.html'),
        protocol: 'file:',
        slashes: true,
      });
  
  console.log(`Starting application at: ${startUrl}`);
  mainWindow.loadURL(startUrl);
  
  // Open DevTools in development mode
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
    console.log('Development mode: DevTools opened');
  }

  // Emitted when the window is closed
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

// Create window when Electron has finished initialization
app.whenReady().then(() => {
  console.log('Electron app is ready');
  createWindow();
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function() {
  if (mainWindow === null) createWindow();
});

// Set up IPC handlers for Python bridge communication
ipcMain.handle('python-bridge-execute', async (event, method, ...args) => {
  console.log(`Executing Python bridge method: ${method}`);
  try {
    if (!pythonBridge[method]) {
      throw new Error(`Method ${method} not found in pythonBridge`);
    }
    const result = await pythonBridge[method](...args);
    return { success: true, data: result };
  } catch (error) {
    console.error(`Error executing ${method}:`, error);
    return { success: false, error: error.message };
  }
});

// Handler for getting app version
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

// Handler for checking updates
ipcMain.handle('check-for-updates', () => {
  // This is a placeholder for an update check mechanism
  // In a real app, you would implement proper update checking logic here
  return { hasUpdate: false, version: app.getVersion() };
});

// Handler for opening external links
ipcMain.handle('open-external-link', (event, url) => {
  return shell.openExternal(url);
});
