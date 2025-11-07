// Placeholder image utility with fallback options
export class PlaceholderService {
  
  // Alternative placeholder services
  private static readonly SERVICES = [
    'https://picsum.photos', // Lorem Picsum (reliable)
    'https://dummyimage.com', // Dummy Image
    'data:image/svg+xml;base64' // SVG fallback
  ];

  /**
   * Generate a placeholder avatar with initials
   */
  static getAvatarPlaceholder(name: string, size = 40): string {
    const initial = name ? name.charAt(0).toUpperCase() : '?';
    const color = this.getColorFromName(name);
    
    // Create SVG-based placeholder as base64
    const svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.4}" fill="white" text-anchor="middle" dy=".35em">${initial}</text>
    </svg>`;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  /**
   * Generate a placeholder for property images
   */
  static getPropertyPlaceholder(width = 400, height = 300, text = 'No Image'): string {
    // Use Lorem Picsum for property images (more reliable than via.placeholder.com)
    const picsum = `https://picsum.photos/${width}/${height}?random=1&blur=2`;
    
    // SVG fallback
    const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="18" fill="#9ca3af" text-anchor="middle" dy=".35em">${text}</text>
    </svg>`;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  /**
   * Generate a simple colored placeholder
   */
  static getSimplePlaceholder(width = 150, height = 150, color = '#6b7280'): string {
    const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
    </svg>`;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  /**
   * Generate agent placeholder with letter
   */
  static getAgentPlaceholder(name: string, size = 150): string {
    const initial = name ? name.charAt(0).toUpperCase() : 'A';
    const color = '#6c5ce7'; // Purple color as used in original
    
    const svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.3}" fill="white" text-anchor="middle" dy=".35em">${initial}</text>
    </svg>`;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  /**
   * Generate a color based on name for consistency
   */
  private static getColorFromName(name: string): string {
    const colors = [
      '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
      '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
    ];
    
    if (!name) return colors[0];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
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
    img.src = PlaceholderService.getSimplePlaceholder();
  }
};