// Storage utility with error handling for restricted contexts
export class SafeStorage {
  private static isStorageAvailable(type: 'localStorage' | 'sessionStorage'): boolean {
    try {
      const storage = window[type];
      const test = '__storage_test__';
      storage.setItem(test, test);
      storage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  static getItem(key: string, fallback: string = ''): string {
    try {
      if (!this.isStorageAvailable('localStorage')) {
        console.warn('localStorage not available, using fallback value');
        return fallback;
      }
      return localStorage.getItem(key) || fallback;
    } catch (error) {
      console.warn('Error accessing localStorage:', error);
      return fallback;
    }
  }

  static setItem(key: string, value: string): boolean {
    try {
      if (!this.isStorageAvailable('localStorage')) {
        console.warn('localStorage not available, cannot save:', key);
        return false;
      }
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn('Error saving to localStorage:', error);
      return false;
    }
  }

  static removeItem(key: string): boolean {
    try {
      if (!this.isStorageAvailable('localStorage')) {
        console.warn('localStorage not available, cannot remove:', key);
        return false;
      }
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('Error removing from localStorage:', error);
      return false;
    }
  }

  // In-memory fallback for when storage is not available
  private static memoryStorage: { [key: string]: string } = {};

  static getItemWithMemoryFallback(key: string, fallback: string = ''): string {
    // Try localStorage first
    const storageValue = this.getItem(key, null as any);
    if (storageValue !== null && storageValue !== '') {
      return storageValue;
    }

    // Fall back to memory storage
    return this.memoryStorage[key] || fallback;
  }

  static setItemWithMemoryFallback(key: string, value: string): boolean {
    // Try localStorage first
    const success = this.setItem(key, value);
    
    // Always store in memory as backup
    this.memoryStorage[key] = value;
    
    return success;
  }
}