import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Property } from '../types/Property';
import { propertyAPI } from '../lib/database';

interface PropertyContextType {
  properties: Property[];
  setProperties: React.Dispatch<React.SetStateAction<Property[]>>;
  handleLike: (id: string) => void;
  handleContact: (agent: Property['agent']) => void;
  refreshProperties: () => Promise<void>;
  isLoading: boolean;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

interface PropertyProviderProps {
  children: ReactNode;
}

export const PropertyProvider: React.FC<PropertyProviderProps> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load properties on mount
  useEffect(() => {
    refreshProperties();
  }, []);

  const refreshProperties = async () => {
    setIsLoading(true);
    try {
      const fetchedProperties = await propertyAPI.getAll();
      setProperties(fetchedProperties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = (id: string) => {
    setProperties(prev => 
      prev.map(property => 
        property.id === id 
          ? { ...property, isLiked: !property.isLiked }
          : property
      )
    );
  };

  const handleContact = (agent: Property['agent']) => {
    // This could open a contact modal or redirect to contact page
    const message = `Contact ${agent.name} at ${agent.phone} (${agent.email})`;
    alert(message);
  };

  return (
    <PropertyContext.Provider 
      value={{ 
        properties, 
        setProperties, 
        handleLike, 
        handleContact,
        refreshProperties,
        isLoading
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
};