
// Development script for running Electron with hot-reload
const { spawn } = require('child_process');
const electron = require('electron');
const path = require('path');

// Function to start Electron
function startElectron() {
  console.log('Starting Electron development environment...');
  console.log('Current directory:', process.cwd());
  console.log('Main.js path:', path.join(__dirname, 'main.js'));
  
  const electronProcess = spawn(electron, [path.join(__dirname, 'main.js')], {
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

console.log('Starting Electron in development mode...');
startElectron();

