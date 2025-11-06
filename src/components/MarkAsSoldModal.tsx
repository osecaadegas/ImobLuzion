import React, { useState } from 'react';
import { X, DollarSign, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface MarkAsSoldModalProps {
  isOpen: boolean;
  property: {
    id: string;
    title: string;
    price: number;
  } | null;
  onClose: () => void;
  onConfirm: (propertyId: string, soldPrice: number) => void;
}

export default function MarkAsSoldModal({ isOpen, property, onClose, onConfirm }: MarkAsSoldModalProps) {
  const { language } = useLanguage();
  const [soldPrice, setSoldPrice] = useState(property?.price || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property || soldPrice <= 0) return;

    setIsSubmitting(true);
    try {
      onConfirm(property.id, soldPrice);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === 'pt' ? 'pt-PT' : 'en-US', {
      style: 'currency',
      currency: language === 'pt' ? 'EUR' : 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (!isOpen || !property) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            {language === 'pt' ? 'Marcar como Vendido' : 'Mark as Sold'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">{property.title}</h3>
            <p className="text-sm text-gray-600">
              {language === 'pt' ? 'Preço original' : 'Listed price'}: {formatPrice(property.price)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'pt' ? 'Preço de venda final' : 'Final sale price'} 
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                min="0"
                step="100"
                value={soldPrice}
                onChange={(e) => setSoldPrice(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={language === 'pt' ? 'Ex: 275000' : 'e.g., 275000'}
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {language === 'pt' 
                ? 'Esta propriedade será marcada como vendida e arquivada' 
                : 'This property will be marked as sold and archived'
              }
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              {language === 'pt' ? 'Cancelar' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || soldPrice <= 0}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {language === 'pt' ? 'A processar...' : 'Processing...'}
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  {language === 'pt' ? 'Marcar como Vendido' : 'Mark as Sold'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}