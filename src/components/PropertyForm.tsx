import { useState, useRef } from 'react';
import { X, Plus, Trash2, Save, Upload, Image as ImageIcon } from 'lucide-react';
import { Property, PropertyFormData } from '../types/Property';
import { useLanguage } from '../contexts/LanguageContext';

interface PropertyFormProps {
  property?: Property | null;
  onSave: (propertyData: PropertyFormData) => void;
  onCancel: () => void;
  isOpen: boolean;
}

const propertyTypes = [
  { value: 'apartment', label: 'Apartment', labelPt: 'Apartamento' },
  { value: 'house', label: 'House', labelPt: 'Casa' },
  { value: 'condo', label: 'Condo', labelPt: 'Condomínio' },
  { value: 'townhouse', label: 'Townhouse', labelPt: 'Casa geminada' },
  { value: 'villa', label: 'Villa', labelPt: 'Moradia' }
] as const;

const statusOptions = [
  { value: 'active', label: 'Active', labelPt: 'Ativo' },
  { value: 'pending', label: 'Pending', labelPt: 'Pendente' },
  { value: 'sold', label: 'Sold', labelPt: 'Vendido' },
  { value: 'rented', label: 'Rented', labelPt: 'Arrendado' }
] as const;

const commonFeatures = [
  { en: 'Pool', pt: 'Piscina' },
  { en: 'Garage', pt: 'Garagem' },
  { en: 'Garden', pt: 'Jardim' },
  { en: 'Balcony', pt: 'Varanda' },
  { en: 'Fireplace', pt: 'Lareira' },
  { en: 'Gym', pt: 'Ginásio' },
  { en: 'Doorman', pt: 'Porteiro' },
  { en: 'Elevator', pt: 'Elevador' },
  { en: 'Pet Friendly', pt: 'Aceita Animais' },
  { en: 'Parking', pt: 'Estacionamento' },
  { en: 'Security System', pt: 'Sistema de Segurança' },
  { en: 'Air Conditioning', pt: 'Ar Condicionado' },
  { en: 'Hardwood Floors', pt: 'Piso de Madeira' },
  { en: 'Updated Kitchen', pt: 'Cozinha Renovada' },
  { en: 'Walk-in Closet', pt: 'Closet' },
  { en: 'City View', pt: 'Vista da Cidade' },
  { en: 'Ocean View', pt: 'Vista do Mar' },
  { en: 'Mountain View', pt: 'Vista da Montanha' },
  { en: 'Near Transportation', pt: 'Perto de Transportes' },
  { en: 'Rooftop Access', pt: 'Acesso ao Terraço' },
  { en: 'Central Heating', pt: 'Aquecimento Central' },
  { en: 'Solar Panels', pt: 'Painéis Solares' },
  { en: 'Wine Cellar', pt: 'Adega' },
  { en: 'Swimming Pool', pt: 'Piscina' },
  { en: 'Tennis Court', pt: 'Campo de Ténis' }
];

export default function PropertyForm({ property, onSave, onCancel, isOpen }: PropertyFormProps) {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState<PropertyFormData>(() => {
    if (property) {
      return {
        title: property.title,
        description: property.description,
        price: property.price,
        images: property.images,
        address: property.location.address,
        city: property.location.city,
        state: property.location.state,
        zipCode: property.location.zipCode,
        bedrooms: property.details.bedrooms,
        bathrooms: property.details.bathrooms,
        sqft: property.details.sqft,
        yearBuilt: property.details.yearBuilt || '',
        propertyType: property.details.propertyType,
        lotSize: property.details.lotSize || '',
        parking: property.details.parking || '',
        features: property.features,
        type: property.type,
        status: property.status,
        // Financial fields
        purchasePrice: property.financials?.purchasePrice || '',
        projectCosts: property.financials?.projectCosts || '',
        soldPrice: property.financials?.soldPrice || '',
        rentalIncome: property.financials?.rentalIncome || '',
        totalRentalEarned: property.financials?.totalRentalEarned || '',
        // Agent fields
        agentName: property.agent.name,
        agentPhone: property.agent.phone,
        agentEmail: property.agent.email
      };
    }
    return {
      title: '',
      description: '',
      price: 0,
      images: [],
      address: '',
      city: '',
      state: '',
      zipCode: '',
      bedrooms: 1,
      bathrooms: 1,
      sqft: 0,
      yearBuilt: '',
      propertyType: 'apartment',
      lotSize: '',
      parking: '',
      features: [],
      type: 'sale',
      status: 'active',
      // Financial fields
      purchasePrice: '',
      projectCosts: '',
      soldPrice: '',
      rentalIncome: '',
      totalRentalEarned: '',
      // Agent fields
      agentName: '',
      agentPhone: '',
      agentEmail: ''
    };
  });

  const [newImageUrl, setNewImageUrl] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(new Set(formData.features));
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      features: Array.from(selectedFeatures)
    };
    onSave(finalData);
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()]
      }));
      setNewImageUrl('');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert(`${file.name} is not an image file`);
          return;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          alert(`${file.name} is too large. Maximum size is 5MB`);
          return;
        }

        // Convert file to base64 for display and storage
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64String = e.target?.result as string;
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, base64String]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const toggleFeature = (feature: string) => {
    const newSelected = new Set(selectedFeatures);
    if (newSelected.has(feature)) {
      newSelected.delete(feature);
    } else {
      newSelected.add(feature);
    }
    setSelectedFeatures(newSelected);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {property ? t.form.editProperty : t.form.addProperty}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">{t.form.title}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.form.title} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t.form.titlePlaceholder}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.form.description} <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t.form.descriptionPlaceholder}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.form.price} (€) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t.form.pricePlaceholder}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.form.type} <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'sale' | 'rent' }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="sale">{language === 'pt' ? 'Venda' : 'For Sale'}</option>
                  <option value="rent">{language === 'pt' ? 'Arrendamento' : 'For Rent'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Property Images */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">{t.form.images}</h3>
            
            {/* Upload Method Toggle */}
            <div className="flex space-x-4 mb-4">
              <button
                type="button"
                onClick={() => setUploadMethod('file')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  uploadMethod === 'file'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Upload className="w-4 h-4 inline mr-2" />
                Upload Files
              </button>
              <button
                type="button"
                onClick={() => setUploadMethod('url')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  uploadMethod === 'url'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ImageIcon className="w-4 h-4 inline mr-2" />
                Image URLs
              </button>
            </div>

            <div className="space-y-4">
              {uploadMethod === 'file' ? (
                // File Upload Section
                <div className="space-y-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Upload property images</p>
                      <p className="text-sm text-gray-500 mb-4">
                        JPG, PNG, GIF up to 5MB each. You can upload multiple images.
                      </p>
                      <button
                        type="button"
                        onClick={triggerFileUpload}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                      >
                        Choose Images
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // URL Upload Section
                <div className="flex space-x-2">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter image URL"
                  />
                  <button
                    type="button"
                    onClick={addImage}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>
              )}

              {/* Image Preview Grid */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Property image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {formData.images.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No images uploaded yet
                </div>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">{t.property.location}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.form.address} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t.form.addressPlaceholder}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.form.city} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t.form.cityPlaceholder}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.form.state} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t.form.statePlaceholder}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.form.zipCode} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter ZIP code"
                  required
                />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">{language === 'pt' ? 'Detalhes da Propriedade' : 'Property Details'}</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.form.bedrooms} <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: Number(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.form.bathrooms} <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: Number(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.form.area} (m²) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.sqft}
                  onChange={(e) => setFormData(prev => ({ ...prev, sqft: Number(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t.form.areaPlaceholder}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.form.yearBuilt}
                </label>
                <input
                  type="number"
                  min="1800"
                  max="2030"
                  value={formData.yearBuilt}
                  onChange={(e) => setFormData(prev => ({ ...prev, yearBuilt: e.target.value ? Number(e.target.value) : '' }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t.form.yearBuiltPlaceholder}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.form.type} <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.propertyType}
                  onChange={(e) => setFormData(prev => ({ ...prev, propertyType: e.target.value as any }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {propertyTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {language === 'pt' ? type.labelPt : type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'pt' ? 'Lugares de garagem' : 'Parking Spaces'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.parking}
                  onChange={(e) => setFormData(prev => ({ ...prev, parking: e.target.value ? Number(e.target.value) : '' }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={language === 'pt' ? 'Opcional' : 'Optional'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statusOptions.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              {language === 'pt' ? 'Características da Propriedade' : 'Property Features'}
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {commonFeatures.map(feature => {
                const featureKey = language === 'pt' ? feature.pt : feature.en;
                const featureValue = feature.en; // Store English value for consistency
                return (
                  <label key={featureValue} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFeatures.has(featureValue)}
                      onChange={() => toggleFeature(featureValue)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{featureKey}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Financial Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              {language === 'pt' ? 'Informação Financeira' : 'Financial Information'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'pt' ? 'Preço de Compra (€)' : 'Purchase Price (€)'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.purchasePrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, purchasePrice: Number(e.target.value) || '' }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={language === 'pt' ? 'Quanto pagou pela propriedade' : 'How much you paid for the property'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'pt' ? 'Custos do Projeto (€)' : 'Project Costs (€)'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.projectCosts}
                  onChange={(e) => setFormData(prev => ({ ...prev, projectCosts: Number(e.target.value) || '' }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={language === 'pt' ? 'Renovações, melhorias, etc.' : 'Renovations, improvements, etc.'}
                />
              </div>

              {formData.status === 'sold' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'pt' ? 'Preço de Venda (€)' : 'Sold Price (€)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.soldPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, soldPrice: Number(e.target.value) || '' }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={language === 'pt' ? 'Preço final de venda' : 'Final sale price'}
                  />
                </div>
              )}

              {(formData.type === 'rent' || formData.status === 'rented') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'pt' ? 'Renda Mensal (€)' : 'Monthly Rental (€)'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.rentalIncome}
                      onChange={(e) => setFormData(prev => ({ ...prev, rentalIncome: Number(e.target.value) || '' }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={language === 'pt' ? 'Renda mensal recebida' : 'Monthly rental received'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'pt' ? 'Total Rendas Recebidas (€)' : 'Total Rental Earned (€)'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.totalRentalEarned}
                      onChange={(e) => setFormData(prev => ({ ...prev, totalRentalEarned: Number(e.target.value) || '' }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={language === 'pt' ? 'Total acumulado de rendas' : 'Total accumulated rental income'}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Profit Calculation Display */}
            {(formData.purchasePrice || formData.projectCosts || formData.soldPrice) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">
                  {language === 'pt' ? 'Cálculo de Lucro' : 'Profit Calculation'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">
                      {language === 'pt' ? 'Investimento Total:' : 'Total Investment:'}
                    </span>
                    <div className="font-semibold text-gray-900">
                      €{((Number(formData.purchasePrice) || 0) + (Number(formData.projectCosts) || 0)).toLocaleString()}
                    </div>
                  </div>
                  {formData.soldPrice && (
                    <>
                      <div>
                        <span className="text-gray-600">
                          {language === 'pt' ? 'Preço de Venda:' : 'Sale Price:'}
                        </span>
                        <div className="font-semibold text-gray-900">
                          €{Number(formData.soldPrice).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">
                          {language === 'pt' ? 'Lucro:' : 'Profit:'}
                        </span>
                        <div className={`font-bold ${
                          (Number(formData.soldPrice) - (Number(formData.purchasePrice) || 0) - (Number(formData.projectCosts) || 0)) >= 0 
                            ? 'text-green-600' : 'text-red-600'
                        }`}>
                          €{(Number(formData.soldPrice) - (Number(formData.purchasePrice) || 0) - (Number(formData.projectCosts) || 0)).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">
                          {language === 'pt' ? 'Margem:' : 'Margin:'}
                        </span>
                        <div className={`font-bold ${
                          (Number(formData.soldPrice) - (Number(formData.purchasePrice) || 0) - (Number(formData.projectCosts) || 0)) >= 0 
                            ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {((Number(formData.soldPrice) - (Number(formData.purchasePrice) || 0) - (Number(formData.projectCosts) || 0)) / 
                            ((Number(formData.purchasePrice) || 0) + (Number(formData.projectCosts) || 0)) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Agent Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              {language === 'pt' ? 'Informação do Agente' : 'Agent Information'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'pt' ? 'Nome do Agente' : 'Agent Name'}
                </label>
                <input
                  type="text"
                  value={formData.agentName}
                  onChange={(e) => setFormData(prev => ({ ...prev, agentName: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={language === 'pt' ? 'Inserir nome do agente' : 'Enter agent name'}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'pt' ? 'Telefone do Agente' : 'Agent Phone'}
                </label>
                <input
                  type="tel"
                  value={formData.agentPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, agentPhone: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={language === 'pt' ? 'Inserir número de telefone' : 'Enter phone number'}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'pt' ? 'Email do Agente' : 'Agent Email'}
                </label>
                <input
                  type="email"
                  value={formData.agentEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, agentEmail: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={language === 'pt' ? 'Inserir endereço de email' : 'Enter email address'}
                  required
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
            >
              {language === 'pt' ? 'Cancelar' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>
                {property 
                  ? (language === 'pt' ? 'Atualizar Propriedade' : 'Update Property')
                  : (language === 'pt' ? 'Guardar Propriedade' : 'Save Property')
                }
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}