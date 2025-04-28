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

  /**
   * Создает zip-архив с данными проекта и скачивает его
   * @param projectData - данные проекта для сохранения в архиве
   */
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
        "dependencies": {
          "@hookform/resolvers": "^3.9.0",
          "@radix-ui/react-tabs": "^1.1.0",
          "jszip": "^3.10.1",
          "react": "^18.3.1",
          "react-dom": "^18.3.1",
          // ... и другие зависимости
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

      // Add project info
      zip.file("README.md", 
        `# HackBridge Platform\n\n` +
        `Export Date: ${projectData.exportDate}\n` +
        `Platform Version: 1.0.0\n\n` +
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
};
