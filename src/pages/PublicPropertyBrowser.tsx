import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import { LanguageSelector } from '../components/LanguageSelector';
import DarkModeToggle from '../components/DarkModeToggle';
import Footer from '../components/Footer';
import { Search, Filter, Heart, MapPin, User, Settings, LogOut, MessageCircle, ChevronDown, ArrowUpDown } from 'lucide-react';
import { Property } from '../types/Property';
import { useLanguage } from '../contexts/LanguageContext';
import { useProperty } from '../contexts/PropertyContext';
import { useAuth } from '../contexts/AuthContext';

type SortOption = 'newest' | 'oldest' | 'price-low' | 'price-high' | 'year-new' | 'year-old';

export default function PublicPropertyBrowser() {
  const { t, language } = useLanguage();
  const { properties, handleLike, handleContact } = useProperty();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'sale' | 'rent'>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleViewDetails = (property: Property) => {
    navigate(`/property/${property.id}`);
  };

  const filteredProperties = properties
    .filter(property => {
      const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           property.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           property.location.address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || property.type === filterType;
      const matchesFavorites = !showFavoritesOnly || property.isLiked;
      
      return matchesSearch && matchesType && matchesFavorites;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'newest':
          return new Date(b.listedDate).getTime() - new Date(a.listedDate).getTime();
        case 'oldest':
          return new Date(a.listedDate).getTime() - new Date(b.listedDate).getTime();
        case 'year-new':
          return (b.details.yearBuilt || 0) - (a.details.yearBuilt || 0);
        case 'year-old':
          return (a.details.yearBuilt || 0) - (b.details.yearBuilt || 0);
        default:
          return 0;
      }
    });

  const favoriteCount = properties.filter(p => p.isLiked).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Modern Navigation Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-xl border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Real Estate Pro
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                  {language === 'pt' ? 'Encontre a sua casa ideal' : 'Find your perfect home'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <DarkModeToggle />
              <LanguageSelector />
              
              {user ? (
                // Authenticated user navigation
                <>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-all duration-200 transform hover:scale-105"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="hidden sm:inline">Admin</span>
                    </Link>
                  )}
                  
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="hidden sm:block text-left">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    </button>

                    {showProfileMenu && (
                      <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                        <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                        </div>
                        
                        <Link
                          to="/"
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <MapPin className="w-4 h-4 text-blue-600" />
                          <div>
                            <div className="font-medium">Navegar Propriedades</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Explore nosso catálogo</div>
                          </div>
                        </Link>
                        
                        <Link
                          to="/favorites"
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <Heart className="w-4 h-4 text-green-600" />
                          <div>
                            <div className="font-medium">Minhas Favoritas</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Propriedades salvas</div>
                          </div>
                        </Link>
                        
                        <Link
                          to="/contact"
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <MessageCircle className="w-4 h-4 text-purple-600" />
                          <div>
                            <div className="font-medium">Contato</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Entre em contato</div>
                          </div>
                        </Link>
                        
                        <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                          <button
                            onClick={logout}
                            className="flex items-center space-x-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sair</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                // Non-authenticated user navigation
                <>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-200 transform hover:scale-105"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {language === 'pt' ? 'Entrar' : 'Login'}
                    </span>
                  </Link>
                  
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 transform hover:scale-105"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Hero Section */}
          <div className="text-center space-y-3 mb-8">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
              {language === 'pt' ? 'Descubra o Seu Lar Perfeito' : 'Discover Your Perfect Home'}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {language === 'pt' 
                ? 'Explore centenas de propriedades premium em Portugal com a nossa plataforma moderna'
                : 'Explore hundreds of premium properties in Portugal with our modern platform'
              }
            </p>
          </div>

          {/* Modern Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-4 text-white transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{properties.length}</p>
                  <p className="text-blue-100 text-sm font-medium">{t.dashboard.totalProperties}</p>
                </div>
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl shadow-lg p-4 text-white transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{favoriteCount}</p>
                  <p className="text-red-100 text-sm font-medium">{t.dashboard.favoriteProperties}</p>
                </div>
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Heart className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-4 text-white transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{filteredProperties.length}</p>
                  <p className="text-green-100 text-sm font-medium">{language === 'pt' ? 'A mostrar' : 'Showing'}</p>
                </div>
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Filter className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Modern Search and Filters */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-lg p-4 border border-gray-200/50 dark:border-gray-700/50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="md:col-span-2 lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                  <input
                    type="text"
                    placeholder={t.dashboard.searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-base border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 dark:bg-gray-700/50 dark:text-white dark:placeholder-gray-400"
                  />
                </div>
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | 'sale' | 'rent')}
                className="px-4 py-3 text-base border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 dark:bg-gray-700/50 dark:text-white font-medium"
              >
                <option value="all">{t.dashboard.allTypes}</option>
                <option value="sale">{language === 'pt' ? 'Venda' : 'For Sale'}</option>
                <option value="rent">{language === 'pt' ? 'Arrendamento' : 'For Rent'}</option>
              </select>
              <div className="relative">
                <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full pl-10 pr-4 py-3 text-base border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 dark:bg-gray-700/50 dark:text-white font-medium appearance-none"
                >
                  <option value="newest">
                    {language === 'pt' ? '📅 Mais Recente' : '📅 Newest First'}
                  </option>
                  <option value="oldest">
                    {language === 'pt' ? '📅 Mais Antigo' : '📅 Oldest First'}
                  </option>
                  <option value="price-low">
                    {language === 'pt' ? '💰 Preço: Menor' : '💰 Price: Low to High'}
                  </option>
                  <option value="price-high">
                    {language === 'pt' ? '💰 Preço: Maior' : '💰 Price: High to Low'}
                  </option>
                  <option value="year-new">
                    {language === 'pt' ? '🏗️ Ano: Mais Novo' : '🏗️ Year: Newest'}
                  </option>
                  <option value="year-old">
                    {language === 'pt' ? '🏗️ Ano: Mais Velho' : '🏗️ Year: Oldest'}
                  </option>
                </select>
              </div>
              <button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 text-sm ${
                  showFavoritesOnly
                    ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border-2 border-gray-200 dark:border-gray-600'
                }`}
              >
                {showFavoritesOnly 
                  ? (language === 'pt' ? 'Mostrar tudo' : 'Show All') 
                  : (language === 'pt' ? 'Só favoritos' : 'Favorites Only')
                }
              </button>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map(property => (
              <PropertyCard
                key={property.id}
                property={property}
                onLike={handleLike}
                onContact={handleContact}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>

          {filteredProperties.length === 0 && (
            <div className="text-center py-16 bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl">
              <div className="text-8xl mb-6">🏠</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t.dashboard.noProperties}</h3>
              <p className="text-gray-600 text-lg">
                {language === 'pt' ? 'Tente ajustar os critérios de pesquisa' : 'Try adjusting your search criteria'}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}