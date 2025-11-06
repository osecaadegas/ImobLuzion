import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, DollarSign, Home, BarChart3, PieChart } from 'lucide-react';
import { Property } from '../types/Property';
import { useLanguage } from '../contexts/LanguageContext';

interface FinancialStatsProps {
  properties: Property[];
}

export default function FinancialStats({ properties }: FinancialStatsProps) {
  const { language } = useLanguage();

  // Calculate financial statistics
  const stats = React.useMemo(() => {
    const soldProperties = properties.filter(p => p.status === 'sold' && p.financials);
    const rentalProperties = properties.filter(p => p.type === 'rent' && p.financials?.totalRentalEarned);
    
    // Sale profits
    const totalSaleProfit = soldProperties.reduce((sum, property) => {
      const investment = (property.financials?.purchasePrice || 0) + (property.financials?.projectCosts || 0);
      const profit = (property.financials?.soldPrice || 0) - investment;
      return sum + profit;
    }, 0);

    const totalSaleInvestment = soldProperties.reduce((sum, property) => {
      return sum + (property.financials?.purchasePrice || 0) + (property.financials?.projectCosts || 0);
    }, 0);

    const averageSaleMargin = totalSaleInvestment > 0 ? (totalSaleProfit / totalSaleInvestment) * 100 : 0;

    // Rental income
    const totalRentalIncome = rentalProperties.reduce((sum, property) => {
      return sum + (property.financials?.totalRentalEarned || 0);
    }, 0);

    const monthlyRentalIncome = properties
      .filter(p => p.status === 'rented' && p.financials?.rentalIncome)
      .reduce((sum, property) => sum + (property.financials?.rentalIncome || 0), 0);

    // Overall stats
    const totalEarnings = totalSaleProfit + totalRentalIncome;
    const totalProperties = properties.length;
    const activeListings = properties.filter(p => p.status === 'active').length;

    return {
      totalEarnings,
      totalSaleProfit,
      totalRentalIncome,
      monthlyRentalIncome,
      averageSaleMargin,
      soldCount: soldProperties.length,
      rentalCount: rentalProperties.length,
      totalProperties,
      activeListings,
      soldProperties,
      rentalProperties
    };
  }, [properties]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === 'pt' ? 'pt-PT' : 'en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    color = 'blue',
    trend,
    link 
  }: {
    title: string;
    value: string;
    subtitle?: string;
    icon: React.ElementType;
    color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
    trend?: 'up' | 'down';
    link?: string;
  }) => {
    const colorClasses = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
      red: 'from-red-500 to-red-600'
    };

    const CardContent = () => (
      <div className={`bg-white rounded-2xl shadow-xl p-6 border border-gray-100 transition-all duration-300 ${link ? 'hover:shadow-2xl hover:scale-[1.02] cursor-pointer' : 'hover:shadow-2xl'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses[color]} text-white`}>
            <Icon className="w-6 h-6" />
          </div>
          {trend && (
            <div className={`flex items-center ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            </div>
          )}
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
    );

    return link ? (
      <Link to={link}>
        <CardContent />
      </Link>
    ) : (
      <CardContent />
    );
  };

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {language === 'pt' ? 'Resumo Financeiro' : 'Financial Overview'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title={language === 'pt' ? 'Lucros Totais' : 'Total Earnings'}
            value={formatCurrency(stats.totalEarnings)}
            subtitle={language === 'pt' ? 'Vendas + Rendas' : 'Sales + Rentals'}
            icon={DollarSign}
            color="green"
            trend={stats.totalEarnings > 0 ? 'up' : undefined}
            link="/admin/financial-dashboard"
          />
          
          <StatCard
            title={language === 'pt' ? 'Lucro de Vendas' : 'Sale Profits'}
            value={formatCurrency(stats.totalSaleProfit)}
            subtitle={`${stats.soldCount} ${language === 'pt' ? 'propriedades vendidas' : 'properties sold'}`}
            icon={TrendingUp}
            color="blue"
            link="/admin/sold-properties"
          />
          
          <StatCard
            title={language === 'pt' ? 'Rendas Acumuladas' : 'Total Rental Income'}
            value={formatCurrency(stats.totalRentalIncome)}
            subtitle={`${stats.rentalCount} ${language === 'pt' ? 'propriedades arrendadas' : 'rental properties'}`}
            icon={Home}
            color="purple"
          />
          
          <StatCard
            title={language === 'pt' ? 'Renda Mensal Atual' : 'Current Monthly Rental'}
            value={formatCurrency(stats.monthlyRentalIncome)}
            subtitle={language === 'pt' ? 'Rendimento mensal' : 'Monthly income'}
            icon={BarChart3}
            color="orange"
          />
        </div>
      </div>

      {/* Detailed Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sale Performance */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            {language === 'pt' ? 'Performance de Vendas' : 'Sales Performance'}
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">
                {language === 'pt' ? 'Margem Média de Lucro' : 'Average Profit Margin'}
              </span>
              <span className={`font-bold ${stats.averageSaleMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.averageSaleMargin.toFixed(1)}%
              </span>
            </div>
            
            <div className="space-y-2">
              {stats.soldProperties.slice(0, 3).map((property) => {
                const investment = (property.financials?.purchasePrice || 0) + (property.financials?.projectCosts || 0);
                const profit = (property.financials?.soldPrice || 0) - investment;
                const margin = investment > 0 ? (profit / investment) * 100 : 0;
                
                return (
                  <div key={property.id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 truncate">{property.title}</span>
                    <div className="flex items-center space-x-2">
                      <span className={`font-medium ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(profit)}
                      </span>
                      <span className={`text-xs ${margin >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        ({margin.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-blue-600" />
            {language === 'pt' ? 'Visão Geral do Portfolio' : 'Portfolio Overview'}
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.totalProperties}</div>
                <div className="text-sm text-gray-600">
                  {language === 'pt' ? 'Total Propriedades' : 'Total Properties'}
                </div>
              </div>
              
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.activeListings}</div>
                <div className="text-sm text-gray-600">
                  {language === 'pt' ? 'Anúncios Ativos' : 'Active Listings'}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{language === 'pt' ? 'Vendidas' : 'Sold'}</span>
                <span className="font-medium text-gray-900">{stats.soldCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{language === 'pt' ? 'Arrendadas' : 'Rented'}</span>
                <span className="font-medium text-gray-900">
                  {properties.filter(p => p.status === 'rented').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{language === 'pt' ? 'Pendentes' : 'Pending'}</span>
                <span className="font-medium text-gray-900">
                  {properties.filter(p => p.status === 'pending').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}