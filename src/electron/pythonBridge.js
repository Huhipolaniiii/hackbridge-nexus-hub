
const { spawn } = require('child_process');
const path = require('path');

/**
 * Функция для запуска Python-скрипта из Electron
 * @param {string} scriptPath - путь к Python скрипту
 * @param {Array} args - аргументы командной строки для скрипта
 * @returns {Promise} - промис с результатом выполнения скрипта
 */
function runPythonScript(scriptPath, args = []) {
  return new Promise((resolve, reject) => {
    // Определяем путь к скрипту относительно корня проекта
    const pythonPath = process.env.NODE_ENV === 'development' 
      ? 'python' // для разработки используем системный Python
      : path.join(process.resourcesPath, 'python_env/bin/python'); // для сборки

    const script = spawn(pythonPath, [scriptPath, ...args]);
    
    let outputData = '';
    let errorData = '';

    script.stdout.on('data', (data) => {
      outputData += data.toString();
    });

    script.stderr.on('data', (data) => {
      errorData += data.toString();
    });

    script.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python script exited with code ${code}: ${errorData}`));
        return;
      }
      resolve(outputData);
    });
  });
}

module.exports = {
  runPythonScript
};
