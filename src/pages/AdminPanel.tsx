import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import PropertyForm from '../components/PropertyForm';
import MarkAsSoldModal from '../components/MarkAsSoldModal';
import FinancialStats from '../components/FinancialStats';
import { Plus, Edit, Trash2, Users, Home, DollarSign, TrendingUp, CheckCircle, BarChart3, Mail, Phone, Shield, UserCog, X, Save, Send, Check } from 'lucide-react';
import { Property, PropertyFormData } from '../types/Property';
import { useLanguage } from '../contexts/LanguageContext';
import { useProperty } from '../contexts/PropertyContext';
import { propertyAPI, authAPI } from '../lib/database';
import { emailService } from '../lib/emailService';
import { PlaceholderService } from '../lib/placeholders';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'user' | 'agent';
  registeredDate: Date;
  favoriteProperties: string[];
  contactedProperties: string[];
}

export default function AdminPanel() {
  const { language } = useLanguage();
  const { properties, setProperties, refreshProperties } = useProperty();
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'users' | 'finances'>('overview');
  const [showSoldModal, setShowSoldModal] = useState(false);
  const [propertyToSell, setPropertyToSell] = useState<Property | null>(null);
  
  // User management state
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user' as 'admin' | 'user' | 'agent'
  });
  
  // Load users from database
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoadingUsers(true);
      const fetchedUsers = await authAPI.getAllUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      // Set empty array as fallback to prevent infinite loading
      setUsers([]);
    } finally {
      setIsLoadingUsers(false);
    }
  };
  
  // Email notification state
  const [showEmailNotification, setShowEmailNotification] = useState(false);
  const [emailStatus, setEmailStatus] = useState<{
    sending: boolean;
    success: boolean;
    message: string;
    sentCount: number;
  }>({
    sending: false,
    success: false,
    message: '',
    sentCount: 0
  });

  const handleDeleteProperty = async (id: string) => {
    if (confirm('Are you sure you want to delete this property?')) {
      try {
        const success = await propertyAPI.delete(id);
        if (success) {
          await refreshProperties(); // Reload from database
          console.log('Property deleted successfully');
        } else {
          alert('Failed to delete property. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting property:', error);
        alert('Error deleting property. Please try again.');
      }
    }
  };

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setShowPropertyForm(true);
  };

  const handleSaveProperty = async (propertyData: PropertyFormData) => {
    try {
      if (editingProperty) {
        // Update existing property
        const updatedProperty = {
          title: propertyData.title,
          description: propertyData.description,
          price: propertyData.price,
          images: propertyData.images,
          location: {
            address: propertyData.address,
            city: propertyData.city,
            state: propertyData.state,
            zipCode: propertyData.zipCode,
            coordinates: editingProperty.location.coordinates // Keep existing coordinates
          },
          details: {
            ...editingProperty.details,
            bedrooms: propertyData.bedrooms,
            bathrooms: propertyData.bathrooms,
            sqft: propertyData.sqft,
            yearBuilt: propertyData.yearBuilt || undefined,
            propertyType: propertyData.propertyType,
            lotSize: propertyData.lotSize || undefined,
            parking: propertyData.parking || undefined
          },
          features: propertyData.features,
          type: propertyData.type,
          status: propertyData.status,
          agent: {
            name: propertyData.agentName,
            phone: propertyData.agentPhone,
            email: propertyData.agentEmail,
            image: editingProperty.agent.image // Keep existing image
          },
          updatedDate: new Date().toISOString()
        };

        const result = await propertyAPI.update(editingProperty.id, updatedProperty);
        if (result) {
          await refreshProperties(); // Reload from database
          console.log('Property updated successfully');
        } else {
          alert('Failed to update property. Please try again.');
          return;
        }
      } else {
        // Add new property
        const newProperty = {
          title: propertyData.title,
          description: propertyData.description,
          price: propertyData.price,
          images: propertyData.images,
          location: {
            address: propertyData.address,
            city: propertyData.city,
            state: propertyData.state,
            zipCode: propertyData.zipCode
          },
          details: {
            bedrooms: propertyData.bedrooms,
            bathrooms: propertyData.bathrooms,
            sqft: propertyData.sqft,
            yearBuilt: propertyData.yearBuilt || undefined,
            propertyType: propertyData.propertyType,
            lotSize: propertyData.lotSize || undefined,
            parking: propertyData.parking || undefined
          },
          features: propertyData.features,
          type: propertyData.type,
          status: propertyData.status,
          agent: {
            name: propertyData.agentName,
            phone: propertyData.agentPhone,
            email: propertyData.agentEmail,
            image: PlaceholderService.getAgentPlaceholder(propertyData.agentName, 150)
          },
          listedDate: new Date().toISOString(),
          updatedDate: new Date().toISOString(),
          isLiked: false
        };

        const result = await propertyAPI.create(newProperty);
        if (result) {
          await refreshProperties(); // Reload from database
          console.log('Property created successfully');

          // Send email notifications for new properties only
          setShowEmailNotification(true);
          setEmailStatus({ sending: true, success: false, message: '', sentCount: 0 });
          
          // Send email notifications to all users
          const recipients = users.map(user => ({
            name: user.name,
            email: user.email
          }));
          
          const propertyEmailData = {
            propertyTitle: propertyData.title,
            propertyPrice: propertyData.price,
            propertyLocation: `${propertyData.address}, ${propertyData.city}`,
            propertyImage: propertyData.images[0] || '',
            propertyLink: `${window.location.origin}/property/${result.id}`
          };
          
          try {
            // Send emails
            const emailResult = await emailService.sendNewPropertyNotification(
              recipients,
              propertyEmailData,
              language
            );
            
            // Update email status
            setEmailStatus({
              sending: false,
              success: emailResult.success,
              message: emailResult.message,
              sentCount: emailResult.sentCount
            });
            
            // Auto-close notification after 5 seconds if successful
            if (emailResult.success) {
              setTimeout(() => {
                setShowEmailNotification(false);
              }, 5000);
            }
          } catch (emailError) {
            console.error('Error sending notifications:', emailError);
            setEmailStatus({
              sending: false,
              success: false,
              message: 'Property created but failed to send notifications',
              sentCount: 0
            });
          }
        } else {
          alert('Failed to create property. Please try again.');
          return;
        }
      }
      
      setShowPropertyForm(false);
      setEditingProperty(null);
    } catch (error) {
      console.error('Error saving property:', error);
      alert('Failed to save property. Please try again.');
    }
  };

  const handleCloseForm = () => {
    setShowPropertyForm(false);
    setEditingProperty(null);
  };

  // User management handlers
  const handleAddUser = () => {
    setEditingUser(null);
    setUserFormData({ name: '', email: '', phone: '', role: 'user' });
    setShowUserForm(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    });
    setShowUserForm(true);
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm(language === 'pt' ? 'Tem certeza que deseja excluir este utilizador?' : 'Are you sure you want to delete this user?')) {
      try {
        const success = await authAPI.deleteUser(id);
        if (success) {
          await loadUsers(); // Reload users from database
          console.log('User deleted successfully');
        } else {
          alert('Failed to delete user. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user. Please try again.');
      }
    }
  };

  const handleSaveUser = async () => {
    try {
      if (editingUser) {
        // Update existing user
        const success = await authAPI.updateUserProfile(editingUser.id, {
          name: userFormData.name,
          role: userFormData.role
        });
        
        if (success) {
          await loadUsers(); // Reload users from database
          console.log('User updated successfully');
        } else {
          alert('Failed to update user. Please try again.');
          return;
        }
      } else {
        // Note: Creating new users requires email/password which should be handled differently
        // For now, we'll show a message that user creation should be done via registration
        alert('New users must register through the registration process. Only existing users can be edited here.');
        return;
      }
      
      setShowUserForm(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Failed to save user. Please try again.');
    }
  };

  const handleCloseUserForm = () => {
    setShowUserForm(false);
    setEditingUser(null);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-gradient-to-r from-red-500 to-pink-600 text-white';
      case 'agent': return 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return language === 'pt' ? 'Administrador' : 'Administrator';
      case 'agent': return language === 'pt' ? 'Agente' : 'Agent';
      default: return language === 'pt' ? 'Utilizador' : 'User';
    }
  };

  const handleMarkAsSold = (property: Property) => {
    setPropertyToSell(property);
    setShowSoldModal(true);
  };

  const handleConfirmSold = async (propertyId: string, soldPrice: number) => {
    try {
      const property = properties.find(p => p.id === propertyId);
      if (!property) {
        alert('Property not found');
        return;
      }

      const updatedProperty = {
        ...property,
        status: 'sold' as const,
        financials: {
          ...property.financials,
          soldPrice,
          profit: soldPrice - ((property.financials?.purchasePrice || 0) + (property.financials?.projectCosts || 0)),
          profitMargin: ((soldPrice - ((property.financials?.purchasePrice || 0) + (property.financials?.projectCosts || 0))) / ((property.financials?.purchasePrice || 0) + (property.financials?.projectCosts || 0))) * 100
        },
        soldDate: new Date().toISOString(),
        isArchived: true,
        updatedDate: new Date().toISOString()
      };

      const result = await propertyAPI.update(propertyId, updatedProperty);
      if (result) {
        await refreshProperties(); // Reload from database
        console.log('Property marked as sold successfully');
      } else {
        alert('Failed to mark property as sold. Please try again.');
        return;
      }
    } catch (error) {
      console.error('Error marking property as sold:', error);
      alert('Failed to mark property as sold. Please try again.');
    }
    
    setShowSoldModal(false);
    setPropertyToSell(null);
  };

  const handleCloseSoldModal = () => {
    setShowSoldModal(false);
    setPropertyToSell(null);
  };

  const stats = {
    totalProperties: properties.length,
    activeProperties: properties.filter(p => p.status === 'active').length,
    soldProperties: properties.filter(p => p.status === 'sold').length,
    totalValue: properties.reduce((sum, p) => sum + p.price, 0),
    totalSoldValue: properties.filter(p => p.status === 'sold').reduce((sum, p) => sum + (p.financials?.soldPrice || p.price), 0),
    totalUsers: users.length
  };

  return (
    <Layout title={language === 'pt' ? 'Painel de Administração' : 'Admin Dashboard'}>
      {/* Modern Background */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Modern Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-8 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{stats.totalProperties}</p>
                <p className="text-blue-100 font-medium">
                  {language === 'pt' ? 'Total de Propriedades' : 'Total Properties'}
                </p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Home className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-8 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{stats.soldProperties}</p>
                <p className="text-green-100 font-medium">{language === 'pt' ? 'Propriedades Vendidas' : 'Properties Sold'}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl shadow-xl p-8 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">€{(stats.totalValue / 1000000).toFixed(1)}M</p>
                <p className="text-yellow-100 font-medium">
                  {language === 'pt' ? 'Valor Total' : 'Total Value'}
                </p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-xl p-8 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{stats.totalUsers}</p>
                <p className="text-purple-100 font-medium">
                  {language === 'pt' ? 'Utilizadores Registados' : 'Registered Users'}
                </p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Modern Navigation Tabs */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              {[
                { key: 'overview', label: language === 'pt' ? 'Visão Geral' : 'Overview', icon: TrendingUp },
                { key: 'properties', label: language === 'pt' ? 'Propriedades' : 'Properties', icon: Home },
                { key: 'finances', label: language === 'pt' ? 'Finanças' : 'Finances', icon: BarChart3 },
                { key: 'users', label: language === 'pt' ? 'Utilizadores' : 'Users', icon: Users }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`py-6 px-2 border-b-2 font-semibold text-sm flex items-center space-x-3 transition-all duration-300 ${
                      activeTab === tab.key
                        ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl text-white">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {language === 'pt' ? 'Atividade Recente' : 'Recent Activity'}
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Plus className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900">
                        {language === 'pt' ? 'Sistema de propriedades atualizado' : 'Property management system updated'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {language === 'pt' ? 'Formulários melhorados com fotos e descrições - agora' : 'Enhanced forms with photos and descriptions - now'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900">
                        {language === 'pt' ? 'Controlos de acesso implementados' : 'User access controls implemented'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {language === 'pt' ? 'Os utilizadores agora só podem ver propriedades - há 1 hora' : 'Users can now only view properties - 1 hour ago'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'properties' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white">
                      <Home className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {language === 'pt' ? 'Gestão de Propriedades' : 'Property Management'}
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowPropertyForm(true)}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl flex items-center space-x-3 font-semibold shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    <Plus className="w-5 h-5" />
                    <span>{language === 'pt' ? 'Adicionar Propriedade' : 'Add Property'}</span>
                  </button>
                </div>

                <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <tr>
                          <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            {language === 'pt' ? 'Propriedade' : 'Property'}
                          </th>
                          <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            {language === 'pt' ? 'Preço' : 'Price'}
                          </th>
                          <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            {language === 'pt' ? 'Tipo' : 'Type'}
                          </th>
                          <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            {language === 'pt' ? 'Estado' : 'Status'}
                          </th>
                          <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            {language === 'pt' ? 'Imagens' : 'Images'}
                          </th>
                          <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            {language === 'pt' ? 'Ações' : 'Actions'}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white/70 divide-y divide-gray-200">
                        {properties.map(property => (
                          <tr key={property.id} className="hover:bg-white/90 transition-colors duration-200">
                            <td className="px-8 py-6 whitespace-nowrap">
                              <div>
                                <div className="text-base font-semibold text-gray-900">{property.title}</div>
                                <div className="text-sm text-gray-600">{property.location.city}, {property.location.state}</div>
                                <div className="text-xs text-gray-500 mt-2 flex items-center space-x-3">
                                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg font-medium">
                                    {property.details.bedrooms}bd
                                  </span>
                                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-lg font-medium">
                                    {property.details.bathrooms}ba
                                  </span>
                                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-lg font-medium">
                                    {property.details.sqft} sqft
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6 whitespace-nowrap">
                              <div className="text-lg font-bold text-gray-900">
                                {language === 'pt' ? '€' : '$'}{property.price.toLocaleString()}
                                {property.type === 'rent' && <span className="text-sm text-gray-500 font-normal">/{language === 'pt' ? 'mês' : 'mo'}</span>}
                              </div>
                              {property.financials?.soldPrice && (
                                <div className="text-sm text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-lg mt-1">
                                  {language === 'pt' ? 'Vendido por' : 'Sold for'}: {language === 'pt' ? '€' : '$'}{property.financials.soldPrice.toLocaleString()}
                                </div>
                              )}
                            </td>
                            <td className="px-8 py-6 whitespace-nowrap">
                              <span className="text-sm font-semibold text-gray-900 capitalize bg-gray-100 px-3 py-1 rounded-lg">
                                {property.type === 'sale' ? (language === 'pt' ? 'Venda' : 'Sale') : 
                                 property.type === 'rent' ? (language === 'pt' ? 'Arrendamento' : 'Rent') : 
                                 property.type}
                              </span>
                            </td>
                            <td className="px-8 py-6 whitespace-nowrap">
                              <span className={`px-3 py-2 text-sm font-bold rounded-xl ${
                                property.status === 'active' ? 'bg-green-100 text-green-800' :
                                property.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                property.status === 'sold' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {property.status === 'active' ? (language === 'pt' ? 'Ativo' : 'Active') :
                                 property.status === 'pending' ? (language === 'pt' ? 'Pendente' : 'Pending') :
                                 property.status === 'sold' ? (language === 'pt' ? 'Vendido' : 'Sold') :
                                 property.status === 'rented' ? (language === 'pt' ? 'Arrendado' : 'Rented') :
                                 property.status}
                              </span>
                              {property.soldDate && (
                                <div className="text-xs text-gray-500 mt-2 bg-gray-50 px-2 py-1 rounded-lg">
                                  {new Date(property.soldDate).toLocaleDateString(language === 'pt' ? 'pt-PT' : 'en-US')}
                                </div>
                              )}
                            </td>
                            <td className="px-8 py-6 whitespace-nowrap">
                              <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-lg text-sm font-semibold">
                                {property.images.length} {language === 'pt' ? 'fotos' : 'photos'}
                              </span>
                            </td>
                            <td className="px-8 py-6 whitespace-nowrap text-sm font-medium space-x-3">
                              <button
                                onClick={() => handleEditProperty(property)}
                                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg transition-all duration-200 inline-flex items-center"
                                title={language === 'pt' ? 'Editar Propriedade' : 'Edit Property'}
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              {property.status !== 'sold' && property.type === 'sale' && (
                                <button
                                  onClick={() => handleMarkAsSold(property)}
                                  className="text-green-600 hover:text-green-800 hover:bg-green-50 p-2 rounded-lg transition-all duration-200 inline-flex items-center"
                                  title={language === 'pt' ? 'Marcar como Vendido' : 'Mark as Sold'}
                                >
                                  <CheckCircle className="w-5 h-5" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteProperty(property.id)}
                                className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-all duration-200 inline-flex items-center"
                                title={language === 'pt' ? 'Eliminar Propriedade' : 'Delete Property'}
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl text-white">
                      <Users className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {language === 'pt' ? 'Gestão de Utilizadores' : 'User Management'}
                    </h3>
                  </div>
                  <button
                    onClick={handleAddUser}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl flex items-center space-x-3 font-semibold shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    <Plus className="w-5 h-5" />
                    <span>{language === 'pt' ? 'Adicionar Utilizador' : 'Add User'}</span>
                  </button>
                </div>

                {/* User Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-purple-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          {language === 'pt' ? 'Total de Utilizadores' : 'Total Users'}
                        </p>
                        <p className="text-3xl font-bold text-gray-900">{users.length}</p>
                      </div>
                      <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
                        <Users className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-red-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          {language === 'pt' ? 'Administradores' : 'Administrators'}
                        </p>
                        <p className="text-3xl font-bold text-gray-900">
                          {users.filter(u => u.role === 'admin').length}
                        </p>
                      </div>
                      <div className="p-3 bg-gradient-to-br from-red-100 to-pink-100 rounded-lg">
                        <Shield className="w-6 h-6 text-red-600" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-blue-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          {language === 'pt' ? 'Agentes' : 'Agents'}
                        </p>
                        <p className="text-3xl font-bold text-gray-900">
                          {users.filter(u => u.role === 'agent').length}
                        </p>
                      </div>
                      <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg">
                        <UserCog className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Users Table */}
                <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                        <tr>
                          <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            {language === 'pt' ? 'Utilizador' : 'User'}
                          </th>
                          <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            {language === 'pt' ? 'Contacto' : 'Contact'}
                          </th>
                          <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            {language === 'pt' ? 'Função' : 'Role'}
                          </th>
                          <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            {language === 'pt' ? 'Data de Registo' : 'Registered'}
                          </th>
                          <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            {language === 'pt' ? 'Atividade' : 'Activity'}
                          </th>
                          <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            {language === 'pt' ? 'Ações' : 'Actions'}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white/70 divide-y divide-gray-200">
                        {isLoadingUsers ? (
                          <tr>
                            <td colSpan={4} className="px-8 py-12 text-center">
                              <div className="flex items-center justify-center space-x-2">
                                <div className="w-6 h-6 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-gray-600">
                                  {language === 'pt' ? 'Carregando utilizadores...' : 'Loading users...'}
                                </span>
                              </div>
                            </td>
                          </tr>
                        ) : users.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-8 py-12 text-center text-gray-500">
                              {language === 'pt' ? 'Nenhum utilizador encontrado' : 'No users found'}
                            </td>
                          </tr>
                        ) : (
                          users.map(user => (
                          <tr key={user.id} className="hover:bg-white/90 transition-colors duration-200">
                            <td className="px-8 py-6 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                  {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="ml-4">
                                  <div className="text-base font-semibold text-gray-900">{user.name}</div>
                                  <div className="text-sm text-gray-600">{user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6 whitespace-nowrap">
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Phone className="w-4 h-4 text-purple-600" />
                                <span>{user.phone}</span>
                              </div>
                            </td>
                            <td className="px-8 py-6 whitespace-nowrap">
                              <span className={`px-4 py-2 inline-flex text-sm leading-5 font-semibold rounded-full ${getRoleBadgeColor(user.role)} shadow-md`}>
                                {getRoleLabel(user.role)}
                              </span>
                            </td>
                            <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-600">
                              {new Date(user.registeredDate).toLocaleDateString(language === 'pt' ? 'pt-PT' : 'en-US')}
                            </td>
                            <td className="px-8 py-6 whitespace-nowrap">
                              <div className="flex space-x-3">
                                <div className="flex items-center space-x-1 text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                                  <span className="font-bold">{user.favoriteProperties.length}</span>
                                  <span>{language === 'pt' ? 'Favoritos' : 'Favorites'}</span>
                                </div>
                                <div className="flex items-center space-x-1 text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full">
                                  <span className="font-bold">{user.contactedProperties.length}</span>
                                  <span>{language === 'pt' ? 'Contactos' : 'Contacts'}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEditUser(user)}
                                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg transition-all duration-200 inline-flex items-center"
                                  title={language === 'pt' ? 'Editar Utilizador' : 'Edit User'}
                                >
                                  <Edit className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-all duration-200 inline-flex items-center"
                                  title={language === 'pt' ? 'Eliminar Utilizador' : 'Delete User'}
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'finances' && (
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl text-white">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {language === 'pt' ? 'Análise Financeira' : 'Financial Analysis'}
                  </h3>
                </div>
                <FinancialStats properties={properties} />
              </div>
            )}
          </div>
        </div>

        {/* Property Form Modal */}
        <PropertyForm
          property={editingProperty}
          onSave={handleSaveProperty}
          onCancel={handleCloseForm}
          isOpen={showPropertyForm}
        />

        {/* Mark as Sold Modal */}
        <MarkAsSoldModal
          isOpen={showSoldModal}
          property={propertyToSell ? {
            id: propertyToSell.id,
            title: propertyToSell.title,
            price: propertyToSell.price
          } : null}
          onClose={handleCloseSoldModal}
          onConfirm={handleConfirmSold}
        />

        {/* User Form Modal */}
        {showUserForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white">
                    {editingUser 
                      ? (language === 'pt' ? 'Editar Utilizador' : 'Edit User')
                      : (language === 'pt' ? 'Adicionar Utilizador' : 'Add User')}
                  </h3>
                  <button
                    onClick={handleCloseUserForm}
                    className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {language === 'pt' ? 'Nome Completo' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    value={userFormData.name}
                    onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder={language === 'pt' ? 'Nome do utilizador' : 'User name'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {language === 'pt' ? 'Email' : 'Email'}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={userFormData.email}
                      onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder={language === 'pt' ? 'email@exemplo.com' : 'email@example.com'}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {language === 'pt' ? 'Telefone' : 'Phone'}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={userFormData.phone}
                      onChange={(e) => setUserFormData({ ...userFormData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="+351 912 345 678"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {language === 'pt' ? 'Função' : 'Role'}
                  </label>
                  <select
                    value={userFormData.role}
                    onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value as 'admin' | 'user' | 'agent' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="user">{language === 'pt' ? 'Utilizador' : 'User'}</option>
                    <option value="agent">{language === 'pt' ? 'Agente' : 'Agent'}</option>
                    <option value="admin">{language === 'pt' ? 'Administrador' : 'Administrator'}</option>
                  </select>
                  <p className="mt-2 text-xs text-gray-500">
                    {userFormData.role === 'admin' && (language === 'pt' 
                      ? 'Acesso total ao sistema' 
                      : 'Full system access')}
                    {userFormData.role === 'agent' && (language === 'pt' 
                      ? 'Pode gerir propriedades' 
                      : 'Can manage properties')}
                    {userFormData.role === 'user' && (language === 'pt' 
                      ? 'Apenas visualização' 
                      : 'View only access')}
                  </p>
                </div>
              </div>

              <div className="p-6 bg-gray-50 rounded-b-2xl flex space-x-3">
                <button
                  onClick={handleCloseUserForm}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
                >
                  {language === 'pt' ? 'Cancelar' : 'Cancel'}
                </button>
                <button
                  onClick={handleSaveUser}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg flex items-center justify-center space-x-2"
                >
                  <Save className="w-5 h-5" />
                  <span>{language === 'pt' ? 'Guardar' : 'Save'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Email Notification Modal */}
        {showEmailNotification && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="p-8 text-center">
                {emailStatus.sending ? (
                  <>
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                      <Send className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {language === 'pt' ? 'Enviando Emails...' : 'Sending Emails...'}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {language === 'pt' 
                        ? `Notificando ${users.length} utilizadores sobre a nova propriedade`
                        : `Notifying ${users.length} users about the new property`}
                    </p>
                    <div className="flex space-x-2 justify-center">
                      <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </>
                ) : emailStatus.success ? (
                  <>
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {language === 'pt' ? 'Emails Enviados!' : 'Emails Sent!'}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      {emailStatus.message}
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                      {language === 'pt' 
                        ? `${emailStatus.sentCount} notificações enviadas com sucesso`
                        : `${emailStatus.sentCount} notifications sent successfully`}
                    </p>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                      <p className="text-sm text-green-800">
                        📧 {language === 'pt' 
                          ? 'Todos os utilizadores foram notificados sobre a nova propriedade!'
                          : 'All users have been notified about the new property!'}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowEmailNotification(false)}
                      className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
                    >
                      {language === 'pt' ? 'Fechar' : 'Close'}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <X className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {language === 'pt' ? 'Erro ao Enviar' : 'Send Error'}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {emailStatus.message}
                    </p>
                    <button
                      onClick={() => setShowEmailNotification(false)}
                      className="w-full px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg font-semibold hover:from-gray-700 hover:to-gray-800 transition-all shadow-lg"
                    >
                      {language === 'pt' ? 'Fechar' : 'Close'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </Layout>
  );
}