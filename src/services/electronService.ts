
/**
 * Service for interacting with Electron's features
 */

// Type definition for the Electron API
interface ElectronAPI {
  executePythonBridge: (method: string, ...args: any[]) => Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }>;
  getAppVersion: () => Promise<string>;
  checkForUpdates: () => Promise<{hasUpdate: boolean, version: string}>;
  openExternalLink: (url: string) => Promise<void>;
  saveData: (key: string, data: any) => Promise<void>;
  loadData: (key: string) => Promise<any>;
}

// Global window object with Electron API
declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

/**
 * Check if the application is running in Electron
 */
export const isElectron = (): boolean => {
  return 'electronAPI' in window;
};

/**
 * Execute a Python bridge method
 */
export const executePythonBridge = async (method: string, ...args: any[]) => {
  if (!isElectron()) {
    console.warn('Electron API not available. Running in browser mode.');
    return { success: false, error: 'Electron API not available' };
  }
  
  try {
    return await window.electronAPI!.executePythonBridge(method, ...args);
  } catch (error) {
    console.error('Error executing Python bridge method:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

/**
 * Get the application version
 */
export const getAppVersion = async (): Promise<string | null> => {
  if (!isElectron()) return null;
  try {
    return await window.electronAPI!.getAppVersion();
  } catch (error) {
    return null;
  }
};

/**
 * Open an external link in the default browser
 */
export const openExternalLink = async (url: string): Promise<boolean> => {
  if (!isElectron()) {
    window.open(url, '_blank');
    return true;
  }
  
  try {
    await window.electronAPI!.openExternalLink(url);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Save data persistently (in Electron mode)
 */
export const saveData = async (key: string, data: any): Promise<boolean> => {
  if (!isElectron()) return false;
  
  try {
    await window.electronAPI!.saveData(key, data);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Load data persistently (in Electron mode)
 */
export const loadData = async (key: string): Promise<any> => {
  if (!isElectron()) return null;
  
  try {
    return await window.electronAPI!.loadData(key);
  } catch (error) {
    return null;
  }
};
