// Bulletproof storage utility for restricted contexts
export class SafeStorage {
  private static memoryStorage: { [key: string]: string } = {};
  private static isLocalStorageAvailable: boolean | null = null;
  private static isSessionStorageAvailable: boolean | null = null;

  /**
   * Comprehensive storage availability check
   */
  private static checkStorageAvailability(type: 'localStorage' | 'sessionStorage'): boolean {
    try {
      const storage = window[type];
      if (!storage) return false;
      
      // Test actual read/write operations
      const testKey = '__storage_test__';
      storage.setItem(testKey, 'test');
      const retrieved = storage.getItem(testKey);
      storage.removeItem(testKey);
      
      return retrieved === 'test';
    } catch (e) {
      // Check for specific storage restriction errors
      if (e instanceof DOMException) {
        const isQuotaError = (
          e.code === 22 || // QUOTA_EXCEEDED_ERR
          e.code === 1014 || // Firefox
          e.name === 'QuotaExceededError' ||
          e.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
          e.name === 'SecurityError'
        );
        
        if (isQuotaError) {
          console.warn(`${type} is restricted or unavailable:`, e.message);
          return false;
        }
      }
      
      console.warn(`${type} access failed:`, e);
      return false;
    }
  }

  /**
   * Get cached availability status or test it
   */
  private static isStorageAvailable(type: 'localStorage' | 'sessionStorage'): boolean {
    if (typeof window === 'undefined') return false;
    
    if (type === 'localStorage') {
      if (this.isLocalStorageAvailable === null) {
        this.isLocalStorageAvailable = this.checkStorageAvailability('localStorage');
      }
      return this.isLocalStorageAvailable;
    } else {
      if (this.isSessionStorageAvailable === null) {
        this.isSessionStorageAvailable = this.checkStorageAvailability('sessionStorage');
      }
      return this.isSessionStorageAvailable;
    }
  }

  /**
   * Safe get with multiple fallback levels
   */
  static getItem(key: string, fallback: string = ''): string {
    // Try localStorage first
    if (this.isStorageAvailable('localStorage')) {
      try {
        const value = localStorage.getItem(key);
        if (value !== null) return value;
      } catch (error) {
        console.warn('localStorage.getItem failed:', error);
        // Mark as unavailable to prevent future attempts
        this.isLocalStorageAvailable = false;
      }
    }

    // Try sessionStorage as fallback
    if (this.isStorageAvailable('sessionStorage')) {
      try {
        const value = sessionStorage.getItem(key);
        if (value !== null) return value;
      } catch (error) {
        console.warn('sessionStorage.getItem failed:', error);
        // Mark as unavailable to prevent future attempts
        this.isSessionStorageAvailable = false;
      }
    }

    // Fall back to memory storage
    return this.memoryStorage[key] || fallback;
  }

  /**
   * Safe set with multiple storage attempts
   */
  static setItem(key: string, value: string): boolean {
    let success = false;

    // Try localStorage first
    if (this.isStorageAvailable('localStorage')) {
      try {
        localStorage.setItem(key, value);
        success = true;
      } catch (error) {
        console.warn('localStorage.setItem failed:', error);
        // Mark as unavailable to prevent future attempts
        this.isLocalStorageAvailable = false;
      }
    }

    // Try sessionStorage as fallback
    if (!success && this.isStorageAvailable('sessionStorage')) {
      try {
        sessionStorage.setItem(key, value);
        success = true;
      } catch (error) {
        console.warn('sessionStorage.setItem failed:', error);
        // Mark as unavailable to prevent future attempts
        this.isSessionStorageAvailable = false;
      }
    }

    // Always store in memory as ultimate fallback
    this.memoryStorage[key] = value;

    return success;
  }

  /**
   * Enhanced get with memory persistence across page loads
   */
  static getItemWithMemoryFallback(key: string, fallback: string = ''): string {
    return this.getItem(key, fallback);
  }

  /**
   * Enhanced set with memory persistence
   */
  static setItemWithMemoryFallback(key: string, value: string): boolean {
    return this.setItem(key, value);
  }

  /**
   * Safe remove operation
   */
  static removeItem(key: string): boolean {
    let success = false;

    // Try localStorage
    if (this.isStorageAvailable('localStorage')) {
      try {
        localStorage.removeItem(key);
        success = true;
      } catch (error) {
        console.warn('localStorage.removeItem failed:', error);
        this.isLocalStorageAvailable = false;
      }
    }

    // Try sessionStorage
    if (this.isStorageAvailable('sessionStorage')) {
      try {
        sessionStorage.removeItem(key);
        success = true;
      } catch (error) {
        console.warn('sessionStorage.removeItem failed:', error);
        this.isSessionStorageAvailable = false;
      }
    }

    // Remove from memory storage
    delete this.memoryStorage[key];

    return success;
  }

  /**
   * Get storage status for debugging
   */
  static getStorageStatus(): {
    localStorage: boolean;
    sessionStorage: boolean;
    memoryFallback: boolean;
    memoryKeys: string[];
  } {
    return {
      localStorage: this.isStorageAvailable('localStorage'),
      sessionStorage: this.isStorageAvailable('sessionStorage'),
      memoryFallback: Object.keys(this.memoryStorage).length > 0,
      memoryKeys: Object.keys(this.memoryStorage)
    };
  }

  /**
   * Reset availability cache (for testing)
   */
  static resetAvailabilityCache(): void {
    this.isLocalStorageAvailable = null;
    this.isSessionStorageAvailable = null;
  }
}

/**
 * Helper function to handle image loading errors
 */
export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>, fallbackSrc?: string) => {
  const img = event.currentTarget;
  if (fallbackSrc && img.src !== fallbackSrc) {
    img.src = fallbackSrc;
  } else {
    // Use a simple gray placeholder SVG
    img.src = 'data:image/svg+xml;base64,' + btoa(`
      <svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="18" fill="#9ca3af" text-anchor="middle" dy=".35em">Image Not Available</text>
      </svg>
    `);
  }
};