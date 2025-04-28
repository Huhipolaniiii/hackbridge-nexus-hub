
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
  return window.electronAPI !== undefined;
};

/**
 * Execute a Python bridge method
 * @param method The method name to call
 * @param args Arguments to pass to the method
 */
export const executePythonBridge = async (method: string, ...args: any[]) => {
  if (!isElectron()) {
    console.warn('Electron API not available. Running in browser mode.');
    return { success: false, error: 'Electron API not available' };
  }
  
  try {
    const result = await window.electronAPI!.executePythonBridge(method, ...args);
    return result;
  } catch (error) {
    console.error('Error executing Python bridge method:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};
