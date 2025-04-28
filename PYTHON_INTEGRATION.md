
# Python Integration в HackBridge Platform

## Обзор

Python Integration является ключевым компонентом платформы HackBridge, обеспечивающим безопасное выполнение и анализ кода. Интеграция построена на связке Python + Electron, что позволяет:

- Безопасно выполнять код пользователей в изолированной среде
- Проводить автоматический анализ безопасности кода
- Осуществлять проверку решений заданий
- Собирать метрики производительности

## Архитектура

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   React UI      │ --> │  Electron Bridge │ --> │  Python Engine  │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

## Основные компоненты

1. **Python Engine** (sample.py)
   - Класс HackBridgeData для обработки данных
   - Безопасное выполнение кода
   - Анализ безопасности
   - Метрики производительности

2. **Electron Bridge** (pythonBridge.js)
   - Управление Python-процессами
   - Маршрутизация команд
   - Обработка ошибок
   - JSON-сериализация данных

## Использование

### Получение данных пользователя
```javascript
const bridge = require('./electron/pythonBridge');

// Получение данных пользователя
const userData = await bridge.getUserData();
console.log(userData);
```

### Отправка задания на проверку
```javascript
// Проверка решения задания
const result = await bridge.submitTask('task-123', 'def solution(): return 42');
console.log(result.score); // 100
```

### Анализ безопасности кода
```javascript
// Анализ безопасности кода
const security = await bridge.analyzeCode('import os; print("Hello")');
console.log(security.safe); // true/false
```

## Безопасность

- Изолированное выполнение кода
- Ограничение доступа к системным ресурсам
- Анализ импортируемых модулей
- Контроль времени выполнения

## Требования

- Python 3.8+
- Node.js 18+
- Electron 25+

## Развертывание

1. Установите зависимости:
   ```bash
   npm install
   pip install -r requirements.txt
   ```

2. Настройте переменные окружения:
   ```
   PYTHON_PATH=/path/to/python
   NODE_ENV=production
   ```

3. Запустите приложение:
   ```bash
   npm start
   ```

## Важные примечания

- Всегда используйте try-catch при работе с Python-bridge
- Следите за версиями Python и зависимостей
- Регулярно обновляйте систему безопасности

