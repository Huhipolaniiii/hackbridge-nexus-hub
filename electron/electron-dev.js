
// Development script for running Electron with hot-reload
const { spawn } = require('child_process');
const electron = require('electron');
const path = require('path');
const waitOn = require('wait-on');
const fs = require('fs');

// Function to check if Vite server is running
async function checkViteServer() {
  console.log('Checking if Vite server is running...');
  try {
    await waitOn({
      resources: ['http://localhost:8080'],
      timeout: 5000 // 5 seconds timeout
    });
    console.log('Vite server is running.');
    return true;
  } catch (error) {
    console.log('Vite server is not running. Starting Vite server...');
    return false;
  }
}

// Function to start Vite server
function startViteServer() {
  console.log('Starting Vite server...');
  const viteProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true
  });

  viteProcess.on('error', (err) => {
    console.error('Failed to start Vite server:', err);
    process.exit(1);
  });

  return viteProcess;
}

// Function to start Electron
function startElectron() {
  console.log('Starting Electron development environment...');
  console.log('Current directory:', process.cwd());
  
  const mainJsPath = path.join(__dirname, 'main.js');
  console.log('Main.js path:', mainJsPath);
  
  // Check if main.js exists
  if (!fs.existsSync(mainJsPath)) {
    console.error('Error: main.js not found at path:', mainJsPath);
    process.exit(1);
  }

  const electronProcess = spawn(electron, [mainJsPath], {
    env: {
      ...process.env,
      NODE_ENV: 'development',
      ELECTRON_START_URL: 'http://localhost:8080'
    },
    stdio: 'inherit' // This will pipe the child process stdio to the parent
  });

  electronProcess.on('close', code => {
    console.log(`Electron process exited with code ${code}`);
    process.exit(code);
  });
}

// Main execution
async function main() {
  console.log('Starting Electron in development mode...');
  
  // Check if Vite is running, start it if not
  const isViteRunning = await checkViteServer();
  let viteProcess;
  if (!isViteRunning) {
    viteProcess = startViteServer();
    
    // Wait for Vite server to start
    try {
      await waitOn({
        resources: ['http://localhost:8080'],
        timeout: 30000 // 30 seconds timeout
      });
      console.log('Vite server started successfully.');
    } catch (error) {
      console.error('Timeout waiting for Vite server to start:', error);
      if (viteProcess) viteProcess.kill();
      process.exit(1);
    }
  }
  
  // Start Electron
  startElectron();
}

main();
