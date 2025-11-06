// Enhanced Property Interface
export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[]; // Array of image URLs
  location: {
    address?: string;
    city: string;
    state?: string;
    zipCode?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  details: {
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    yearBuilt?: number;
    propertyType: 'apartment' | 'house' | 'condo' | 'townhouse' | 'other';
    lotSize?: number;
    parking?: number;
    floors?: number;
    furnished?: boolean;
    petFriendly?: boolean;
  };
  features: string[]; // Array of features like "Pool", "Garage", "Garden", etc.
  amenities?: string[]; // Additional amenities like "WiFi", "Air Conditioning", etc.
  type: 'sale' | 'rent';
  status: 'active' | 'pending' | 'sold' | 'rented';
  // Financial tracking fields
  financials?: {
    purchasePrice?: number; // How much was paid for the property
    projectCosts?: number; // Renovation/improvement costs
    totalInvestment?: number; // purchasePrice + projectCosts (calculated)
    soldPrice?: number; // Final sale price
    rentalIncome?: number; // Monthly rental income
    totalRentalEarned?: number; // Total rental income received
    profit?: number; // soldPrice - totalInvestment (calculated)
    profitMargin?: number; // (profit / totalInvestment) * 100 (calculated)
  };
  soldDate?: string; // Date when property was sold
  isArchived?: boolean; // Whether property is archived
  agent?: {
    name?: string;
    phone?: string;
    email?: string;
    image?: string;
  };
  listedDate?: string;
  updatedDate?: string;
  isLiked?: boolean; // For user favorites
}

// Property Form Data Interface
export interface PropertyFormData {
  title: string;
  description: string;
  price: number;
  images: string[];
  address: string;
  city: string;
  state: string;
  zipCode: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  yearBuilt: number | '';
  propertyType: Property['details']['propertyType'];
  lotSize: number | '';
  parking: number | '';
  features: string[];
  type: Property['type'];
  status: Property['status'];
  // Financial fields
  purchasePrice: number | '';
  projectCosts: number | '';
  soldPrice: number | '';
  rentalIncome: number | '';
  totalRentalEarned: number | '';
  // Agent fields
  agentName: string;
  agentPhone: string;
  agentEmail: string;
}

// Mock enhanced properties data - now empty since we're using real database
export const mockEnhancedProperties: Property[] = [];