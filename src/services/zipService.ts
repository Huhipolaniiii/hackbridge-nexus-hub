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
      
      // Add project data files
      zip.file("project-data/users.json", JSON.stringify(projectData.users, null, 2));
      zip.file("project-data/courses.json", JSON.stringify(projectData.courses, null, 2));
      zip.file("project-data/tasks.json", JSON.stringify(projectData.tasks, null, 2));
      
      // Add project info
      zip.file("project-info.txt", 
        `HackBridge Platform Export\n` +
        `Version: 1.0.0\n` +
        `Export Date: ${projectData.exportDate}\n` +
        `Users Count: ${projectData.users.length}\n` +
        `Courses Count: ${projectData.courses.length}\n` +
        `Tasks Count: ${projectData.tasks.length}`
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
