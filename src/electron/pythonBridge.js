
const { spawn } = require('child_process');
const path = require('path');

/**
 * Класс для взаимодействия с Python-скриптами
 */
class PythonBridge {
  constructor() {
    this.pythonPath = process.env.NODE_ENV === 'development'
      ? 'python'
      : path.join(process.resourcesPath, 'python_env/bin/python');
    
    this.scriptPath = path.join(__dirname, '../python/sample.py');
  }

  /**
   * Запуск Python-скрипта с аргументами
   * @param {Array} args - аргументы командной строки
   * @returns {Promise} результат выполнения скрипта
   */
  async runScript(args = []) {
    return new Promise((resolve, reject) => {
      const script = spawn(this.pythonPath, [this.scriptPath, ...args]);
      
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
        try {
          resolve(JSON.parse(outputData));
        } catch (error) {
          reject(new Error(`Failed to parse Python output: ${error.message}`));
        }
      });
    });
  }

  /**
   * Получение данных пользователя
   */
  async getUserData() {
    return this.runScript(['get_user']);
  }

  /**
   * Отправка задания на проверку
   * @param {string} taskId - ID задания
   * @param {string} code - код решения
   */
  async submitTask(taskId, code) {
    return this.runScript(['submit_task', taskId, code]);
  }

  /**
   * Анализ безопасности кода
   * @param {string} code - код для анализа
   */
  async analyzeCode(code) {
    return this.runScript(['analyze', code]);
  }
}

module.exports = new PythonBridge();

