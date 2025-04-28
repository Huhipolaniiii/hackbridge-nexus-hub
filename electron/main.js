const { app, BrowserWindow, ipcMain } = require('electron');
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
      nodeIntegration: true,
      contextIsolation: false,
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
  
  mainWindow.loadURL(startUrl);
  
  // Open DevTools in development mode
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

// Create window when Electron has finished initialization
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function() {
  if (mainWindow === null) createWindow();
});

// Set up IPC handlers for Python bridge communication
ipcMain.handle('python-bridge-execute', async (event, method, ...args) => {
  try {
    if (!pythonBridge[method]) {
      throw new Error(`Method ${method} not found in pythonBridge`);
    }
    const result = await pythonBridge[method](...args);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
