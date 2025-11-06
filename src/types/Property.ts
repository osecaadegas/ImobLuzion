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

// Mock enhanced properties data
export const mockEnhancedProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Downtown Apartment',
    description: 'A stunning modern apartment in the heart of downtown with breathtaking city views. This luxury unit features floor-to-ceiling windows, hardwood floors, and state-of-the-art appliances. Perfect for professionals who want to be close to everything the city has to offer.',
    price: 350000,
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2004&q=80'
    ],
    location: {
      address: '123 Main Street',
      city: 'Lisboa',
      state: 'Lisboa',
      zipCode: '1050-001',
      coordinates: { lat: 38.7223, lng: -9.1393 }
    },
    details: {
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      yearBuilt: 2020,
      propertyType: 'apartment',
      parking: 1,
      floors: 1,
      furnished: false,
      petFriendly: true
    },
    features: ['City View', 'Hardwood Floors', 'In-Unit Laundry', 'Doorman', 'Gym', 'Rooftop Terrace'],
    amenities: ['WiFi', 'Air Conditioning', '24h Security', 'Garage', 'Swimming Pool'],
    type: 'sale',
    status: 'active',
    agent: {
      name: 'Maria Silva',
      phone: '+351 910 123 456',
      email: 'maria.silva@realestate.pt',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b494?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80'
    },
    listedDate: new Date('2024-01-15'),
    updatedDate: new Date('2024-01-15'),
    isLiked: false
  },
  {
    id: '2',
    title: 'Luxury Penthouse Suite',
    description: 'Experience ultimate luxury in this exquisite penthouse suite featuring panoramic views of the city skyline. With premium finishes, a private terrace, and exclusive amenities, this is urban living at its finest.',
    price: 850000,
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2053&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2053&q=80'
    ],
    location: {
      address: '456 Avenida da Liberdade',
      city: 'Lisboa',
      state: 'Lisboa',
      zipCode: '1250-096',
      coordinates: { lat: 38.7167, lng: -9.1500 }
    },
    details: {
      bedrooms: 3,
      bathrooms: 3,
      sqft: 2400,
      yearBuilt: 2018,
      propertyType: 'apartment',
      parking: 2,
      floors: 2,
      furnished: true,
      petFriendly: false
    },
    features: ['Panoramic Views', 'Private Terrace', 'Premium Finishes', 'Concierge', 'Wine Cellar', 'Smart Home'],
    amenities: ['WiFi', 'Air Conditioning', '24h Security', 'Valet Parking', 'Fitness Center', 'Spa'],
    type: 'sale',
    status: 'pending',
    agent: {
      name: 'João Santos',
      phone: '+351 920 987 654',
      email: 'joao.santos@realestate.pt',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
    },
    listedDate: new Date('2024-01-20'),
    updatedDate: new Date('2024-01-25'),
    isLiked: true
  },
  {
    id: '3',
    title: 'Cozy Studio Rental',
    description: 'Charming studio apartment perfect for young professionals or students. Located in a vibrant neighborhood with easy access to public transportation, cafes, and entertainment venues.',
    price: 1200,
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2058&q=80',
      'https://images.unsplash.com/photo-1560448075-bb485b067938?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    ],
    location: {
      address: '789 Rua do Príncipe Real',
      city: 'Lisboa',
      state: 'Lisboa',
      zipCode: '1150-314',
      coordinates: { lat: 38.7133, lng: -9.1478 }
    },
    details: {
      bedrooms: 1,
      bathrooms: 1,
      sqft: 650,
      yearBuilt: 2015,
      propertyType: 'apartment',
      petFriendly: true
    },
    features: ['Near Transportation', 'Vibrant Neighborhood', 'Updated Kitchen', 'Pet Friendly'],
    type: 'rent',
    status: 'active',
    agent: {
      name: 'Ana Costa',
      phone: '+351 930 456 789',
      email: 'ana.costa@realestate.pt',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=761&q=80'
    },
    listedDate: new Date('2024-01-25'),
    updatedDate: new Date('2024-01-25'),
    isLiked: false
  },
  {
    id: '4',
    title: 'Family House with Garden',
    description: 'Spacious family home with beautiful garden in a quiet residential area. Perfect for families with children, featuring multiple bedrooms, large living spaces, and outdoor areas for entertainment.',
    price: 485000,
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2006&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    ],
    location: {
      address: '321 Cascais Villa District',
      city: 'Cascais',
      state: 'Lisboa',
      zipCode: '2750-350',
      coordinates: { lat: 38.6973, lng: -9.4214 }
    },
    details: {
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2800,
      yearBuilt: 2010,
      propertyType: 'house',
      parking: 2,
      floors: 2,
      lotSize: 8000,
      furnished: false,
      petFriendly: true
    },
    features: ['Large Garden', 'Fireplace', 'Garage', 'Near Schools', 'Quiet Neighborhood', 'BBQ Area'],
    amenities: ['Garden', 'Garage', 'Storage Room', 'Barbecue Area'],
    type: 'sale',
    status: 'active',
    agent: {
      name: 'Carlos Mendes',
      phone: '+351 940 123 789',
      email: 'carlos.mendes@realestate.pt',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80'
    },
    listedDate: new Date('2024-01-10'),
    updatedDate: new Date('2024-01-12'),
    isLiked: true
  },
  {
    id: '5',
    title: 'Ocean View Villa',
    description: 'Breathtaking ocean view villa with private pool and direct beach access. This luxury property offers the perfect combination of modern amenities and coastal living. Wake up to stunning sunrises over the Atlantic.',
    price: 1250000,
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80'
    ],
    location: {
      address: '100 Praia da Rocha',
      city: 'Portimão',
      state: 'Faro',
      zipCode: '8500-802',
      coordinates: { lat: 37.1204, lng: -8.5367 }
    },
    details: {
      bedrooms: 5,
      bathrooms: 4,
      sqft: 3500,
      yearBuilt: 2019,
      propertyType: 'other',
      parking: 3,
      floors: 2,
      lotSize: 15000,
      furnished: true,
      petFriendly: true
    },
    features: ['Ocean View', 'Private Pool', 'Beach Access', 'Wine Cellar', 'Home Theater', 'Chef Kitchen'],
    amenities: ['Swimming Pool', 'Private Beach', 'Wine Cellar', 'Home Theater', 'Landscaped Garden'],
    type: 'sale',
    status: 'active',
    agent: {
      name: 'Sofia Rodrigues',
      phone: '+351 960 555 123',
      email: 'sofia.rodrigues@realestate.pt',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
    },
    listedDate: new Date('2024-01-05'),
    updatedDate: new Date('2024-01-08'),
    isLiked: false
  },
  {
    id: '6',
    title: 'Historic Townhouse',
    description: 'Beautifully restored historic townhouse in the heart of Porto. This unique property combines traditional Portuguese architecture with modern conveniences. Rich in character and perfectly located.',
    price: 420000,
    images: [
      'https://images.unsplash.com/photo-1520637836862-4d197d17c68a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2058&q=80',
      'https://images.unsplash.com/photo-1560185127-1b5b6c1b3c3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1564078516393-cf04bd966897?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80'
    ],
    location: {
      address: '555 Rua das Flores',
      city: 'Porto',
      state: 'Porto',
      zipCode: '4050-262',
      coordinates: { lat: 41.1496, lng: -8.6109 }
    },
    details: {
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1800,
      yearBuilt: 1890,
      propertyType: 'townhouse',
      parking: 1,
      floors: 3,
      furnished: false,
      petFriendly: true
    },
    features: ['Historic Character', 'Restored Original Features', 'Central Location', 'High Ceilings', 'Original Tiles'],
    amenities: ['Historic Features', 'Central Location', 'Near Metro'],
    type: 'sale',
    status: 'active',
    agent: {
      name: 'Miguel Ferreira',
      phone: '+351 910 987 321',
      email: 'miguel.ferreira@realestate.pt',
      image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80'
    },
    listedDate: new Date('2024-01-18'),
    updatedDate: new Date('2024-01-20'),
    isLiked: true
  },
  {
    id: '7',
    title: 'Modern Loft Space',
    description: 'Industrial chic loft in a converted warehouse. High ceilings, exposed brick walls, and large windows create a unique living space perfect for artists, entrepreneurs, or anyone who appreciates distinctive design.',
    price: 2800,
    images: [
      'https://images.unsplash.com/photo-1586105251261-72a756497a11?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2058&q=80',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1559767949-0faa5c7e9992?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80'
    ],
    location: {
      address: '200 LX Factory',
      city: 'Lisboa',
      state: 'Lisboa',
      zipCode: '1300-663',
      coordinates: { lat: 38.7056, lng: -9.1739 }
    },
    details: {
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1600,
      yearBuilt: 2021,
      propertyType: 'apartment',
      parking: 1,
      floors: 1,
      furnished: true,
      petFriendly: true
    },
    features: ['High Ceilings', 'Exposed Brick', 'Large Windows', 'Industrial Design', 'Art District'],
    amenities: ['Creative Community', 'Near Art Galleries', 'Cafes and Restaurants'],
    type: 'rent',
    status: 'active',
    agent: {
      name: 'Beatriz Almeida',
      phone: '+351 920 654 987',
      email: 'beatriz.almeida@realestate.pt',
      image: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=686&q=80'
    },
    listedDate: new Date('2024-01-22'),
    updatedDate: new Date('2024-01-23'),
    isLiked: false
  },
  {
    id: '8',
    title: 'Countryside Retreat',
    description: 'Peaceful countryside house surrounded by vineyards and olive groves. Perfect for those seeking tranquility and connection with nature. Features traditional Portuguese architecture with modern updates.',
    price: 320000,
    images: [
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2006&q=80',
      'https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    ],
    location: {
      address: '400 Quinta do Vale',
      city: 'Óbidos',
      state: 'Leiria',
      zipCode: '2510-999',
      coordinates: { lat: 39.3606, lng: -9.1571 }
    },
    details: {
      bedrooms: 3,
      bathrooms: 2,
      sqft: 2200,
      yearBuilt: 1950,
      propertyType: 'house',
      parking: 2,
      floors: 1,
      lotSize: 25000,
      furnished: false,
      petFriendly: true
    },
    features: ['Vineyard Views', 'Traditional Architecture', 'Large Plot', 'Wine Cellar', 'Fruit Trees', 'Stone Fireplace'],
    amenities: ['Vineyard', 'Olive Grove', 'Wine Cellar', 'Garden'],
    type: 'sale',
    status: 'active',
    agent: {
      name: 'Teresa Gomes',
      phone: '+351 935 789 456',
      email: 'teresa.gomes@realestate.pt',
      image: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
    },
    listedDate: new Date('2024-01-12'),
    updatedDate: new Date('2024-01-15'),
    isLiked: false
  },
  {
    id: '9',
    title: 'Beachfront Apartment',
    description: 'Wake up to the sound of waves in this stunning beachfront apartment. Floor-to-ceiling windows offer panoramic ocean views. Perfect for vacation rentals or permanent seaside living.',
    price: 1800,
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80',
      'https://images.unsplash.com/photo-1574691250077-03a929faece5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
      'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    ],
    location: {
      address: '80 Avenida Marginal',
      city: 'Nazaré',
      state: 'Leiria',
      zipCode: '2450-065',
      coordinates: { lat: 39.6017, lng: -9.0705 }
    },
    details: {
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1100,
      yearBuilt: 2017,
      propertyType: 'apartment',
      parking: 1,
      floors: 1,
      furnished: true,
      petFriendly: false
    },
    features: ['Ocean View', 'Beach Access', 'Fully Furnished', 'Balcony', 'Modern Kitchen'],
    amenities: ['Beach Access', 'Swimming Pool', 'Concierge'],
    type: 'rent',
    status: 'active',
    agent: {
      name: 'Ricardo Silva',
      phone: '+351 965 432 108',
      email: 'ricardo.silva@realestate.pt',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80'
    },
    listedDate: new Date('2024-01-28'),
    updatedDate: new Date('2024-01-30'),
    isLiked: true
  },
  {
    id: '10',
    title: 'City Center Condo',
    description: 'Modern condominium in the bustling city center. Walking distance to shopping, dining, and entertainment. Features contemporary design with smart home technology and premium amenities.',
    price: 395000,
    images: [
      'https://images.unsplash.com/photo-1560448075-bb485b067938?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    ],
    location: {
      address: '750 Rua Augusta',
      city: 'Lisboa',
      state: 'Lisboa',
      zipCode: '1100-053',
      coordinates: { lat: 38.7092, lng: -9.1365 }
    },
    details: {
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1300,
      yearBuilt: 2022,
      propertyType: 'condo',
      parking: 1,
      floors: 1,
      furnished: false,
      petFriendly: true
    },
    features: ['Smart Home', 'City Center', 'Modern Design', 'Rooftop Garden', 'Gym Access', 'Concierge'],
    amenities: ['Fitness Center', 'Rooftop Garden', 'Concierge', '24h Security'],
    type: 'sale',
    status: 'active',
    agent: {
      name: 'Inês Pereira',
      phone: '+351 915 678 234',
      email: 'ines.pereira@realestate.pt',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80'
    },
    listedDate: new Date('2024-02-01'),
    updatedDate: new Date('2024-02-02'),
    isLiked: false
  }
];