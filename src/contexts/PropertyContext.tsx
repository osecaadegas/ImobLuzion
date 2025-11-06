import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Property, mockEnhancedProperties } from '../types/Property';

interface PropertyContextType {
  properties: Property[];
  setProperties: React.Dispatch<React.SetStateAction<Property[]>>;
  handleLike: (id: string) => void;
  handleContact: (agent: Property['agent']) => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

interface PropertyProviderProps {
  children: ReactNode;
}

export const PropertyProvider: React.FC<PropertyProviderProps> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>(mockEnhancedProperties);

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
        handleContact 
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