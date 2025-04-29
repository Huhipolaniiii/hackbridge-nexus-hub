
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

/**
 * Сервис для создания zip-файлов проекта
 */
export const zipService = {
  /**
   * Создает zip-архив с данными пользователя и скачивает его
   * @param userData - данные пользователя для сохранения в архиве
   */
  createUserDataZip: async (userData: any) => {
    try {
      const zip = new JSZip();
      
      // Добавляем файл с данными пользователя
      zip.file("user-data.json", JSON.stringify(userData, null, 2));
      
      // Добавляем информацию о проекте
      zip.file("project-info.txt", "HackBridge Platform\nVersion: 1.0.0\nExported: " + new Date().toISOString());
      
      // Создаем папку для настроек
      const settingsFolder = zip.folder("settings");
      settingsFolder?.file("profile-settings.json", JSON.stringify({
        username: userData.username,
        email: userData.email,
        notifications: {
          email: true,
          marketing: false
        },
        security: {
          twoFactor: false
        }
      }, null, 2));
      
      // Генерируем zip-файл и скачиваем его
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `hackbridge-${userData.username || 'user'}-data.zip`);
      
      return true;
    } catch (error) {
      console.error("Error creating zip file:", error);
      return false;
    }
  },

  createProjectZip: async (projectData: any) => {
    try {
      const zip = new JSZip();
      
      // Add project source files
      zip.file("src/services/zipService.ts", sourceFiles.zipService);
      zip.file("src/pages/AdminPanel.tsx", sourceFiles.adminPanel);
      zip.file("src/python/sample.py", sourceFiles.pythonSample);
      zip.file("public/robots.txt", sourceFiles.robots);
      zip.file("index.html", sourceFiles.indexHtml);
      zip.file("src/components/ui/tabs.tsx", sourceFiles.tabs);
      zip.file("src/components/ui/sheet.tsx", sourceFiles.sheet);
      zip.file("src/components/ui/sidebar.tsx", sourceFiles.sidebar);
      zip.file("src/electron/pythonBridge.js", sourceFiles.pythonBridge);
      zip.file("PYTHON_INTEGRATION.md", sourceFiles.pythonDocs);
      
      // Add electron files
      zip.file("electron/main.js", sourceFiles.electronMain);
      zip.file("electron/preload.js", sourceFiles.electronPreload);
      zip.file("electron/electron-dev.js", sourceFiles.electronDev);
      zip.file("electron-builder.json", sourceFiles.electronBuilderConfig);
      
      // Add project data files
      const dataFolder = zip.folder("project-data");
      dataFolder?.file("users.json", JSON.stringify(projectData.users, null, 2));
      dataFolder?.file("courses.json", JSON.stringify(projectData.courses, null, 2));
      dataFolder?.file("tasks.json", JSON.stringify(projectData.tasks, null, 2));
      
      // Add configuration files
      zip.file("package.json", JSON.stringify({
        "name": "hackbridge-nexus-hub",
        "private": true,
        "version": "1.0.0",
        "scripts": {
          "dev": "vite",
          "build": "tsc && vite build",
          "electron:dev": "concurrently \"vite\" \"wait-on http://localhost:8080 && node electron/electron-dev.js\"",
          "electron:build": "tsc && vite build && electron-builder"
        },
        "dependencies": {
          "@hookform/resolvers": "^3.9.0",
          "@radix-ui/react-tabs": "^1.1.0",
          "jszip": "^3.10.1",
          "react": "^18.3.1",
          "react-dom": "^18.3.1",
          "electron": "^29.1.0",
          "concurrently": "^8.2.2",
          "wait-on": "^7.2.0",
          "file-saver": "^2.0.5"
        }
      }, null, 2));
      
      zip.file("tsconfig.json", JSON.stringify({
        "compilerOptions": {
          "target": "ES2020",
          "useDefineForClassFields": true,
          "lib": ["ES2020", "DOM", "DOM.Iterable"],
          "module": "ESNext",
          "skipLibCheck": true,
          "moduleResolution": "bundler",
          "allowImportingTsExtensions": true,
          "resolveJsonModule": true,
          "isolatedModules": true,
          "noEmit": true,
          "jsx": "react-jsx",
          "strict": true,
          "noUnusedLocals": true,
          "noUnusedParameters": true,
          "noFallthroughCasesInSwitch": true
        },
        "include": ["src"],
        "references": [{ "path": "./tsconfig.node.json" }]
      }, null, 2));

      // Add project info and README with launch instructions
      zip.file("README.md", 
        `# HackBridge Platform\n\n` +
        `Export Date: ${projectData.exportDate}\n` +
        `Platform Version: 1.0.0\n\n` +
        `## Quick Start\n\n` +
        `1. Make sure you have Node.js 16+ installed\n` +
        `2. Double-click 'start-app.bat' to launch the desktop application\n` +
        `3. The app will automatically install dependencies if needed\n\n` +
        `## Key Features\n\n` +
        `- Secure Python code execution environment\n` +
        `- Real-time code analysis\n` +
        `- Automated task verification\n` +
        `- Performance metrics collection\n\n` +
        `## Project Statistics\n` +
        `- Users: ${projectData.users.length}\n` +
        `- Courses: ${projectData.courses.length}\n` +
        `- Tasks: ${projectData.tasks.length}\n` +
        `\nFor detailed information about Python integration, see PYTHON_INTEGRATION.md`
      );
      
      // Add simplified HTML launcher
      zip.file("launch.html", 
        `<!DOCTYPE html>
        <html>
        <head>
            <title>HackBridge Launcher</title>
            <style>
                body { 
                    font-family: Arial, sans-serif;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    margin: 0;
                    background: #1a1a1a;
                    color: white;
                }
                .container {
                    text-align: center;
                    padding: 20px;
                    border-radius: 8px;
                    background: #2a2a2a;
                }
                .button {
                    background: #4CAF50;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    margin: 10px;
                    font-size: 16px;
                }
                .button:hover {
                    background: #45a049;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>HackBridge Desktop Launcher</h2>
                <p>Выберите способ запуска:</p>
                <button class="button" onclick="runDesktop()">Запустить десктопную версию</button>
                <button class="button" onclick="runBrowser()">Открыть в браузере</button>
            </div>
            <script>
                function runDesktop() {
                    const isWindows = navigator.platform.indexOf('Win') > -1;
                    if (isWindows) {
                        const bat = new ActiveXObject('WScript.Shell');
                        bat.Run('start-app.bat', 1, true);
                    } else {
                        alert('Запуск десктопной версии доступен только для Windows');
                    }
                }
                
                function runBrowser() {
                    window.location.href = 'index.html';
                }
            </script>
        </body>
        </html>`
      );
      
      // Add simplified batch file
      zip.file("start-app.bat", 
        "@echo off\n" +
        "echo Starting HackBridge Desktop Application...\n\n" +
        "IF \"%~d0\"==\"\\\\\" (\n" +
        "  C:\n" +
        "  CD %TEMP%\\HackBridge\n" +
        "  MD %TEMP%\\HackBridge 2>nul\n" +
        "  XCOPY \"%~dp0\\*\" \"%TEMP%\\HackBridge\\\" /E /I /Y\n" +
        "  cd %TEMP%\\HackBridge\n" +
        ") ELSE (\n" +
        "  cd %~dp0\n" +
        ")\n\n" +
        "npm install\n" +
        "npm run electron:dev\n" +
        "pause"
      );
      
      // Add build-exe.bat file for generating the executable
      zip.file("build-exe.bat", 
        "@echo off\n" +
        "echo Building HackBridge Executable...\n\n" +
        "IF \"%~d0\"==\"\\\\\" (\n" +
        "  C:\n" +
        "  CD %TEMP%\\HackBridge\n" +
        "  MD %TEMP%\\HackBridge 2>nul\n" +
        "  XCOPY \"%~dp0\\*\" \"%TEMP%\\HackBridge\\\" /E /I /Y\n" +
        "  cd %TEMP%\\HackBridge\n" +
        ") ELSE (\n" +
        "  cd %~dp0\n" +
        ")\n\n" +
        "echo Installing dependencies...\n" +
        "call npm install\n\n" +
        "echo Building application...\n" +
        "call npm run build\n\n" +
        "echo Building executable...\n" +
        "call npm run electron:build\n\n" +
        "echo The executable has been created in the release folder.\n" +
        "explorer %CD%\\release\n" +
        "pause"
      );
      
      // Update package.json to include build script
      zip.file("package.json", JSON.stringify({
        "name": "hackbridge-nexus-hub",
        "private": true,
        "version": "1.0.0",
        "scripts": {
          "dev": "vite",
          "build": "tsc && vite build",
          "electron:dev": "concurrently \"vite\" \"wait-on http://localhost:8080 && node electron/electron-dev.js\"",
          "electron:build": "electron-builder",
          "build:win": "tsc && vite build && electron-builder --win"
        },
        "dependencies": {
          "@hookform/resolvers": "^3.9.0",
          "@radix-ui/react-tabs": "^1.1.0",
          "jszip": "^3.10.1",
          "react": "^18.3.1",
          "react-dom": "^18.3.1",
          "electron": "^29.1.0",
          "concurrently": "^8.2.2",
          "wait-on": "^7.2.0",
          "file-saver": "^2.0.5"
        },
        "devDependencies": {
          "electron-builder": "^24.12.0"
        }
      }, null, 2));
      
      // Add EXE info to the launcher HTML
      zip.file("launch.html", 
        `<!DOCTYPE html>
        <html>
        <head>
            <title>HackBridge Launcher</title>
            <style>
                body { 
                    font-family: Arial, sans-serif;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    margin: 0;
                    background: #1a1a1a;
                    color: white;
                }
                .container {
                    text-align: center;
                    padding: 20px;
                    border-radius: 8px;
                    background: #2a2a2a;
                }
                .button {
                    background: #4CAF50;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    margin: 10px;
                    font-size: 16px;
                }
                .button:hover {
                    background: #45a049;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>HackBridge Desktop Launcher</h2>
                <p>Выберите способ запуска:</p>
                <button class="button" onclick="runDesktop()">Запустить десктопную версию</button>
                <button class="button" onclick="runBrowser()">Открыть в браузере</button>
                <button class="button" onclick="buildExe()">Создать .exe файл</button>
            </div>
            <div class="container" style="margin-top:20px; padding:10px;">
                <p>Для создания .exe файла требуется Node.js и npm. После создания файл появится в папке release.</p>
            </div>
            <script>
                function runDesktop() {
                    const isWindows = navigator.platform.indexOf('Win') > -1;
                    if (isWindows) {
                        try {
                            const bat = new ActiveXObject('WScript.Shell');
                            bat.Run('start-app.bat', 1, true);
                        } catch(e) {
                            alert('Ошибка запуска: ' + e.message + '. Запустите start-app.bat вручную.');
                        }
                    } else {
                        alert('Запуск десктопной версии доступен только для Windows');
                    }
                }
                
                function runBrowser() {
                    window.location.href = 'index.html';
                }
                
                function buildExe() {
                    const isWindows = navigator.platform.indexOf('Win') > -1;
                    if (isWindows) {
                        try {
                            const bat = new ActiveXObject('WScript.Shell');
                            bat.Run('build-exe.bat', 1, true);
                        } catch(e) {
                            alert('Ошибка запуска: ' + e.message + '. Запустите build-exe.bat вручную.');
                        }
                    } else {
                        alert('Создание .exe файла доступен только для Windows');
                    }
                }
            </script>
        </body>
        </html>`
      );
      
      // Generate and download the zip file
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `hackbridge-project-export-${new Date().toISOString().split('T')[0]}.zip`);
      
      return true;
    } catch (error) {
      console.error("Error creating project zip file:", error);
      return false;
    }
  }
};

// Project source files content
const sourceFiles = {
  zipService: `// Current file content...\n${new TextEncoder().encode(document.querySelector('[data-filepath="src/services/zipService.ts"]')?.textContent || '')}`,
  adminPanel: `// Admin panel component...\n${new TextEncoder().encode(document.querySelector('[data-filepath="src/pages/AdminPanel.tsx"]')?.textContent || '')}`,
  pythonSample: `// Python integration sample...\n${new TextEncoder().encode(document.querySelector('[data-filepath="src/python/sample.py"]')?.textContent || '')}`,
  robots: document.querySelector('[data-filepath="public/robots.txt"]')?.textContent || '',
  indexHtml: document.querySelector('[data-filepath="index.html"]')?.textContent || '',
  tabs: document.querySelector('[data-filepath="src/components/ui/tabs.tsx"]')?.textContent || '',
  sheet: document.querySelector('[data-filepath="src/components/ui/sheet.tsx"]')?.textContent || '',
  sidebar: document.querySelector('[data-filepath="src/components/ui/sidebar.tsx"]')?.textContent || '',
  pythonBridge: document.querySelector('[data-filepath="src/electron/pythonBridge.js"]')?.textContent || '',
  pythonDocs: document.querySelector('[data-filepath="PYTHON_INTEGRATION.md"]')?.textContent || '',
  electronMain: document.querySelector('[data-filepath="electron/main.js"]')?.textContent || '',
  electronPreload: document.querySelector('[data-filepath="electron/preload.js"]')?.textContent || '',
  electronDev: document.querySelector('[data-filepath="electron/electron-dev.js"]')?.textContent || '',
  electronBuilderConfig: document.querySelector('[data-filepath="electron-builder.json"]')?.textContent || ''
};
