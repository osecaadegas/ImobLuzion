import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, DollarSign, PieChart, BarChart3, Calculator } from 'lucide-react';
import { useProperty } from '../contexts/PropertyContext';
import { Property } from '../types/Property';
import Layout from '../components/Layout';

const FinancialDashboard: React.FC = () => {
  const { properties } = useProperty();
  
  // Filter sold properties
  const soldProperties = properties.filter((property: Property) => property.status === 'sold');
  
  // Calculate statistics
  const totalSales = soldProperties.reduce((sum: number, prop: Property) => sum + (prop.financials?.soldPrice || 0), 0);
  const totalCosts = soldProperties.reduce((sum: number, prop: Property) => sum + (prop.financials?.totalInvestment || 0), 0);
  const totalProfit = soldProperties.reduce((sum: number, prop: Property) => sum + (prop.financials?.profit || 0), 0);
  const averageMargin = soldProperties.length > 0 
    ? soldProperties.reduce((sum: number, prop: Property) => sum + (prop.financials?.profitMargin || 0), 0) / soldProperties.length 
    : 0;

  // Calculate property type breakdown
  const propertyTypeBreakdown = soldProperties.reduce((acc: Record<string, any>, prop: Property) => {
    const type = prop.details.propertyType;
    if (!acc[type]) {
      acc[type] = { count: 0, totalSales: 0, totalProfit: 0 };
    }
    acc[type].count += 1;
    acc[type].totalSales += prop.financials?.soldPrice || 0;
    acc[type].totalProfit += prop.financials?.profit || 0;
    return acc;
  }, {});

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <Layout title="Dashboard Financeiro">
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
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Financeiro</h1>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Propriedades Analisadas</p>
            <p className="text-2xl font-bold text-blue-600">{soldProperties.length}</p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Vendas Totais</p>
                <p className="text-2xl font-bold">{formatCurrency(totalSales)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Lucro Total</p>
                <p className="text-2xl font-bold">{formatCurrency(totalProfit)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Investimento Total</p>
                <p className="text-2xl font-bold">{formatCurrency(totalCosts)}</p>
              </div>
              <Calculator className="w-8 h-8 text-orange-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Margem Média</p>
                <p className="text-2xl font-bold">{formatPercentage(averageMargin)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-200" />
            </div>
          </div>
        </div>

        {/* Property Type Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Análise por Tipo de Propriedade</h2>
            </div>
            <div className="space-y-4">
              {Object.entries(propertyTypeBreakdown).map(([type, data]: [string, any]) => (
                <div key={type} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-700 capitalize">{type}</h3>
                    <span className="text-sm text-gray-500">{data.count} propriedades</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Vendas Totais</p>
                      <p className="font-semibold text-green-600">{formatCurrency(data.totalSales)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Lucro Total</p>
                      <p className="font-semibold text-blue-600">{formatCurrency(data.totalProfit)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Performance Financeira</h2>
            </div>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-3">ROI Médio por Investimento</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Return on Investment</span>
                    <span className="font-semibold text-green-600">
                      {totalCosts > 0 ? formatPercentage((totalProfit / totalCosts) * 100) : '0%'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${Math.min((totalProfit / totalCosts) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-3">Ticket Médio</h3>
                <div className="text-2xl font-bold text-blue-600">
                  {soldProperties.length > 0 ? formatCurrency(totalSales / soldProperties.length) : formatCurrency(0)}
                </div>
                <p className="text-sm text-gray-500">Valor médio por venda</p>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-3">Lucro Médio</h3>
                <div className="text-2xl font-bold text-green-600">
                  {soldProperties.length > 0 ? formatCurrency(totalProfit / soldProperties.length) : formatCurrency(0)}
                </div>
                <p className="text-sm text-gray-500">Lucro médio por propriedade</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performing Properties */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">Propriedades com Maior Lucro</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Propriedade</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tipo</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Investimento</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Venda</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Lucro</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Margem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {soldProperties
                  .sort((a: Property, b: Property) => (b.financials?.profit || 0) - (a.financials?.profit || 0))
                  .slice(0, 10)
                  .map((property: Property) => (
                    <tr key={property.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{property.title}</p>
                          <p className="text-sm text-gray-500">{property.location.city}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 capitalize">
                        {property.details.propertyType}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-orange-600">
                        {formatCurrency(property.financials?.totalInvestment || 0)}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-green-600">
                        {formatCurrency(property.financials?.soldPrice || 0)}
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-blue-600">
                        {formatCurrency(property.financials?.profit || 0)}
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-purple-600">
                        {formatPercentage(property.financials?.profitMargin || 0)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <Link
            to="/admin/sold-properties"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <DollarSign className="w-5 h-5" />
            Ver Todas as Propriedades Vendidas
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default FinancialDashboard;