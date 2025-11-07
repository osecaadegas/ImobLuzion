import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import DarkModeToggle from './DarkModeToggle';
import { LogOut, Home, BarChart3, Heart, MessageCircle, ChevronDown, Settings, Plus, FileText } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function Layout({ children, title }: LayoutProps) {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Home className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Real Estate Pro</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {user.role === 'admin' && (
                <div className="flex items-center space-x-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  <BarChart3 className="w-4 h-4" />
                  <span>{t.nav.adminPanel}</span>
                </div>
              )}
              
              <DarkModeToggle />
              <LanguageSelector />
              
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
                  <ChevronDown className="w-4 h-4 text-gray-400" />
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
                      <Home className="w-4 h-4 text-blue-600" />
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

                    {/* Admin & Agent Options */}
                    {(user.role === 'admin' || user.role === 'agent') && (
                      <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                        <div className="px-4 py-2">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            {user.role === 'admin' ? 'Administração' : 'Agente'}
                          </p>
                        </div>
                        
                        <Link
                          to="/admin"
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <Settings className="w-4 h-4 text-blue-600" />
                          <div>
                            <div className="font-medium">
                              {user.role === 'admin' ? 'Painel Admin' : 'Painel Agente'}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Gerenciar propriedades e usuários
                            </div>
                          </div>
                        </Link>

                        <Link
                          to="/admin/add-property"
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <Plus className="w-4 h-4 text-green-600" />
                          <div>
                            <div className="font-medium">Adicionar Propriedade</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Nova propriedade ao catálogo
                            </div>
                          </div>
                        </Link>

                        {user.role === 'admin' && (
                          <Link
                            to="/admin/financial-dashboard"
                            className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => setShowProfileMenu(false)}
                          >
                            <FileText className="w-4 h-4 text-orange-600" />
                            <div>
                              <div className="font-medium">Dashboard Financeiro</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Relatórios e análises
                              </div>
                            </div>
                          </Link>
                        )}
                      </div>
                    )}
                    
                    <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                      <button
                        onClick={logout}
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t.nav.logout}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}