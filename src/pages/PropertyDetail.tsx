import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MapPin, Bed, Bath, Square, Car, Phone, Mail, ChevronLeft, ChevronRight, Home, Calendar, Shield, Wifi } from 'lucide-react';
import { useProperty } from '../contexts/PropertyContext';
import { useLanguage } from '../contexts/LanguageContext';
import DarkModeToggle from '../components/DarkModeToggle';
import Footer from '../components/Footer';

interface PropertyDetailProps {
  onLike: (id: string) => void;
  onContact: (property: any) => void;
}

const PropertyDetail: React.FC<PropertyDetailProps> = ({ onLike, onContact }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { properties } = useProperty();
  const { language } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const property = properties.find(p => p.id === id);
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === 'pt' ? 'pt-PT' : 'en-US', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const nextImage = () => {
    if (property && property.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (property && property.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {language === 'pt' ? 'Propriedade não encontrada' : 'Property not found'}
          </h2>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {language === 'pt' ? 'Voltar às Propriedades' : 'Back to Properties'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              {language === 'pt' ? 'Voltar às Propriedades' : 'Back to Properties'}
            </button>
            <DarkModeToggle />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
              <div className="relative h-96 bg-gray-200 dark:bg-gray-700">
                <img
                  src={property.images[currentImageIndex]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-700" />
                    </button>
                    
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {property.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 rounded-full transition-all ${
                            index === currentImageIndex 
                              ? 'bg-white shadow-lg' 
                              : 'bg-white/50 hover:bg-white/75'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
              <div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  {property.title}
                </h1>
                <div className="flex items-center text-gray-600 dark:text-gray-300 mb-4">
                  <MapPin className="w-5 h-5 mr-2 text-red-500" />
                  <span className="text-lg">{property.location.address}, {property.location.city}</span>
                </div>
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                  {formatPrice(property.price)}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-shrink-0">
                    <Bed className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{property.details.bedrooms}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {language === 'pt' ? 'Quartos' : 'Bedrooms'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-shrink-0">
                    <Bath className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{property.details.bathrooms}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {language === 'pt' ? 'Casas de banho' : 'Bathrooms'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-shrink-0">
                    <Square className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{property.details.sqft}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">m</div>
                  </div>
                </div>
                
                {property.details.parking && (
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex-shrink-0">
                      <Car className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white"></div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {language === 'pt' ? 'Estacionamento' : 'Parking'}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {language === 'pt' ? 'Descrição' : 'Description'}
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                  {property.description}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {language === 'pt' ? 'Características' : 'Features'}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>{language === 'pt' ? 'Seguro' : 'Secure'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                    <Wifi className="w-4 h-4 text-green-500" />
                    <span>{language === 'pt' ? 'Internet' : 'Internet'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                    <Home className="w-4 h-4 text-green-500" />
                    <span>{language === 'pt' ? 'Mobilado' : 'Furnished'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                    <Calendar className="w-4 h-4 text-green-500" />
                    <span>{language === 'pt' ? 'Disponível' : 'Available'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps Location */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-red-500" />
                {language === 'pt' ? 'Localização' : 'Location'}
              </h3>
              <div className="mb-3">
                <p className="text-gray-600">
                  {property.location.address}, {property.location.city}, {property.location.state}
                </p>
              </div>
              <div className="rounded-lg overflow-hidden border-2 border-gray-200">
                {GOOGLE_MAPS_API_KEY ? (
                  <iframe
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(
                      `${property.location.address}, ${property.location.city}, ${property.location.state}`
                    )}&zoom=15`}
                    title={language === 'pt' ? 'Localização da Propriedade' : 'Property Location'}
                  ></iframe>
                ) : (
                  <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center text-center p-8">
                    <div>
                      <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 mb-2">
                        {language === 'pt' 
                          ? 'Mapa não disponível. Configure a chave da API do Google Maps.' 
                          : 'Map unavailable. Please configure Google Maps API key.'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {property.location.address}, {property.location.city}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${property.location.address}, ${property.location.city}, ${property.location.state}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  {language === 'pt' ? 'Ver no Google Maps' : 'View in Google Maps'}
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {language === 'pt' ? 'Contactar Agente' : 'Contact Agent'}
              </h3>
              
              <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">LA</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">Luzion Agency</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {language === 'pt' ? 'Agente Imobiliário' : 'Real Estate Agent'}
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <button
                  onClick={() => onContact(property)}
                  className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  {language === 'pt' ? 'Ligar Agora' : 'Call Now'}
                </button>
                
                <button
                  onClick={() => onContact(property)}
                  className="w-full flex items-center justify-center px-4 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  {language === 'pt' ? 'Enviar Email' : 'Send Email'}
                </button>
                
                <button
                  onClick={() => onLike(property.id)}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  {language === 'pt' ? 'Adicionar aos Favoritos' : 'Add to Favorites'}
                </button>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  {language === 'pt' ? 'Resumo da Propriedade' : 'Property Summary'}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      {language === 'pt' ? 'Tipo:' : 'Type:'}
                    </span>
                    <span className="font-medium dark:text-gray-200">
                      {language === 'pt' ? 'Apartamento' : 'Apartment'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      {language === 'pt' ? 'Ano:' : 'Year:'}
                    </span>
                    <span className="font-medium dark:text-gray-200">2023</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">ID:</span>
                    <span className="font-medium dark:text-gray-200">{property.id}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PropertyDetail;
