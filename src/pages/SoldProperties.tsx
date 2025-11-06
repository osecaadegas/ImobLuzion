import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, DollarSign } from 'lucide-react';
import { useProperty } from '../contexts/PropertyContext';
import { Property } from '../types/Property';
import Layout from '../components/Layout';

const SoldProperties: React.FC = () => {
  const { properties } = useProperty();
  
  // Filter only sold properties
  const soldProperties = properties.filter((property: Property) => property.status === 'sold');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <Layout title="Propriedades Vendidas">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/admin"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar ao Admin
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Propriedades Vendidas</h1>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total de Propriedades Vendidas</p>
            <p className="text-2xl font-bold text-green-600">{soldProperties.length}</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Valor Total de Vendas</h3>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(soldProperties.reduce((sum, prop) => sum + (prop.financials?.soldPrice || 0), 0))}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Lucro Total</h3>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(soldProperties.reduce((sum, prop) => sum + (prop.financials?.profit || 0), 0))}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Custo Total</h3>
            <p className="text-2xl font-bold text-orange-600">
              {formatCurrency(soldProperties.reduce((sum, prop) => sum + (prop.financials?.totalInvestment || 0), 0))}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Margem Média</h3>
            <p className="text-2xl font-bold text-purple-600">
              {soldProperties.length > 0 
                ? (soldProperties.reduce((sum, prop) => sum + (prop.financials?.profitMargin || 0), 0) / soldProperties.length).toFixed(1)
                : 0}%
            </p>
          </div>
        </div>

        {/* Properties List */}
        {soldProperties.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 text-lg">Nenhuma propriedade vendida encontrada.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {soldProperties.map((property) => (
              <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{property.title}</h3>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{property.location.address}, {property.location.city}</span>
                  </div>
                  
                  {/* Financial Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Preço de Compra:</span>
                      <span className="text-sm font-medium">
                        {formatCurrency(property.financials?.purchasePrice || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Custos do Projeto:</span>
                      <span className="text-sm font-medium">
                        {formatCurrency(property.financials?.projectCosts || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Preço de Venda:</span>
                      <span className="text-sm font-medium text-green-600">
                        {formatCurrency(property.financials?.soldPrice || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-sm font-semibold text-gray-700">Lucro:</span>
                      <span className="text-sm font-bold text-blue-600">
                        {formatCurrency(property.financials?.profit || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-semibold text-gray-700">Margem:</span>
                      <span className="text-sm font-bold text-purple-600">
                        {property.financials?.profitMargin?.toFixed(1) || 0}%
                      </span>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span>{property.details.bedrooms} quartos</span>
                    <span>{property.details.bathrooms} banheiros</span>
                    <span>{property.details.sqft} m²</span>
                  </div>

                  <Link
                    to={`/property/${property.id}`}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <DollarSign className="w-4 h-4" />
                    Ver Detalhes
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SoldProperties;