
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
  const electronCheck = window.electronAPI !== undefined;
  console.log(`Electron check: ${electronCheck ? 'Running in Electron' : 'Running in browser'}`);
  return electronCheck;
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
    console.log(`Calling Electron API method: ${method}`, args);
    const result = await window.electronAPI!.executePythonBridge(method, ...args);
    console.log(`Result from ${method}:`, result);
    return result;
  } catch (error) {
    console.error('Error executing Python bridge method:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

