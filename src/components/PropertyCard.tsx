import React, { useState } from 'react';
import { Heart, MapPin, Bed, Bath, Square, Phone, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import { Property } from '../types/Property';
import { useLanguage } from '../contexts/LanguageContext';

interface PropertyCardProps {
  property: Property;
  onLike: (id: string) => void;
  onContact: (agent: Property['agent']) => void;
  onViewDetails?: (property: Property) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onLike, onContact, onViewDetails }) => {
  const { t, language } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const {
    id,
    title,
    price,
    images,
    location,
    details,
    listedDate,
    agent,
    type,
    isLiked
  } = property;

  // Handle image navigation
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  // Use the current image or fallback
  const currentImage = images[currentImageIndex] || 'https://via.placeholder.com/400x300/gray/white?text=No+Image';

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === 'pt' ? 'pt-PT' : 'en-US', {
      style: 'currency',
      currency: language === 'pt' ? 'EUR' : 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const timeAgo = formatDistanceToNow(
    typeof listedDate === 'string' ? parseISO(listedDate) : listedDate, 
    { 
      addSuffix: true,
      locale: language === 'pt' ? ptBR : enUS 
    }
  );

  return (
    <div className="group bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-850 rounded-2xl shadow-xl hover:shadow-2xl overflow-hidden transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-700">
      {/* Property Image with Navigation */}
      <div className="relative overflow-hidden h-56">
        <img
          src={currentImage}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        
        {/* Image Navigation Controls */}
        {images.length > 1 && (
          <>
            {/* Previous Image Button */}
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-800 hover:bg-white hover:scale-110 transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {/* Next Image Button */}
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-800 hover:bg-white hover:scale-110 transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            
            {/* Image Dots Indicator */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => goToImage(index, e)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentImageIndex 
                      ? 'bg-white scale-125' 
                      : 'bg-white/60 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
            
            {/* Image Counter */}
            <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-white text-xs font-medium">
              {currentImageIndex + 1} / {images.length}
            </div>
          </>
        )}
        
        {/* Like Button */}
        <button
          onClick={() => onLike(id)}
          className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-sm transition-all duration-200 ${
            isLiked 
              ? 'bg-red-500 text-white shadow-lg' 
              : 'bg-white/90 text-gray-600 hover:bg-white hover:scale-110'
          }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
        </button>
        
        <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
          {type === 'sale' ? 'Venda' : 'Arrendamento'}
        </div>
        
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium">
            +{images.length - 1} {language === 'pt' ? 'mais' : 'more'}
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight line-clamp-2">{title}</h3>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4 mr-2 text-blue-500" />
            <span className="text-sm">{location.city}, {location.state}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {formatPrice(price)}
            {type === 'rent' && <span className="text-sm font-normal text-gray-500">/{language === 'pt' ? 'mês' : 'mo'}</span>}
          </div>
        </div>

        {/* Property Features */}
        <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mb-2">
              <Bed className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{details.bedrooms}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{t.property.bedrooms.toLowerCase()}</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mb-2">
              <Bath className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{details.bathrooms}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{language === 'pt' ? 'WC' : 'bath'}</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full mb-2">
              <Square className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{details.sqft}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">m²</span>
          </div>
        </div>

        {/* Agent Info & Actions */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img
                src={agent.image}
                alt={agent.name}
                className="w-10 h-10 rounded-full ring-2 ring-gray-200 dark:ring-gray-600"
              />
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{agent.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {language === 'pt' ? 'Publicado' : 'Listed'} {timeAgo}
                </p>
              </div>
            </div>
            <button
              onClick={() => onContact(agent)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <Phone className="w-5 h-5" />
            </button>
          </div>
          
          {/* View Details Button */}
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(property)}
              className="w-full bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-600 dark:hover:to-gray-500 text-gray-700 dark:text-gray-200 py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 group border border-gray-200 dark:border-gray-600"
            >
              <Eye className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">
                {language === 'pt' ? 'Ver Detalhes' : 'View Details'}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;