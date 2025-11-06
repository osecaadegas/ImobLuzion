import React from 'react';
import PropertyDetail from './PropertyDetail';
import { useProperty } from '../contexts/PropertyContext';

const PropertyDetailWrapper: React.FC = () => {
  const { handleLike, handleContact } = useProperty();

  return (
    <PropertyDetail 
      onLike={handleLike}
      onContact={handleContact}
    />
  );
};

export default PropertyDetailWrapper;