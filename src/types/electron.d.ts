
interface ElectronAPI {
  isElectron: boolean;
  getUsers?: () => Promise<any[]>;
  getCourses?: () => Promise<any[]>;
  createUser?: (userData: any) => Promise<any>;
  // Add other API methods as needed
}

interface Window {
  electronAPI?: ElectronAPI;
}
