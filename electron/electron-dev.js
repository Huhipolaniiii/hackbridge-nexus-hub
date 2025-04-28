
// Development script for running Electron with hot-reload
const { spawn } = require('child_process');
const electron = require('electron');
const path = require('path');

// Function to start Electron
function startElectron() {
  const electronProcess = spawn(electron, [path.join(__dirname, 'main.js')], {
    env: {
      ...process.env,
      NODE_ENV: 'development',
      ELECTRON_START_URL: 'http://localhost:8080'
    }
  });

  electronProcess.stdout.on('data', data => {
    console.log(`Electron: ${data}`);
  });

  electronProcess.stderr.on('data', data => {
    console.error(`Electron Error: ${data}`);
  });

  electronProcess.on('close', code => {
    console.log(`Electron process exited with code ${code}`);
    process.exit(code);
  });
}

console.log('Starting Electron...');
startElectron();
