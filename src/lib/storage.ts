// NUCLEAR SAFE STORAGE - MEMORY ONLY - NEVER TOUCHES BROWSER STORAGE
export class SafeStorage {
  private static memoryStorage = new Map<string, string>();

  // ALWAYS return from memory - never touch browser storage
  static getItem(key: string, fallback: string = ''): string {
    return this.memoryStorage.get(key) || fallback;
  }

  // ALWAYS store in memory - never touch browser storage  
  static setItem(key: string, value: string): boolean {
    this.memoryStorage.set(key, value);
    return true;
  }

  // Enhanced get with memory persistence
  static getItemWithMemoryFallback(key: string, fallback: string = ''): string {
    return this.getItem(key, fallback);
  }

  // Enhanced set with memory persistence
  static setItemWithMemoryFallback(key: string, value: string): boolean {
    return this.setItem(key, value);
  }

  // Remove from memory
  static removeItem(key: string): boolean {
    this.memoryStorage.delete(key);
    return true;
  }

  // Remove item silently (for Supabase storage adapter)
  static removeItemSilently(key: string): void {
    this.memoryStorage.delete(key);
  }

  // Get storage status for debugging
  static getStorageStatus(): {
    localStorage: boolean;
    sessionStorage: boolean;  
    memoryFallback: boolean;
    memoryKeys: string[];
  } {
    return {
      localStorage: false,  // Always false - we never use it
      sessionStorage: false, // Always false - we never use it
      memoryFallback: true,  // Always true - memory only
      memoryKeys: Array.from(this.memoryStorage.keys())
    };
  }

  // Reset memory storage
  static resetAvailabilityCache(): void {
    this.memoryStorage.clear();
  }

  // Request storage permission (no-op since we don't use browser storage)
  static async requestStoragePermission(): Promise<boolean> {
    return true; // Always succeed since we don't need real storage
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