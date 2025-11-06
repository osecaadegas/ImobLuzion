import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import DarkModeToggle from './DarkModeToggle';
import { Eye, EyeOff, LogIn, UserPlus, Home } from 'lucide-react';

interface LoginFormProps {
  onToggleMode: () => void;
  isRegisterMode: boolean;
}

export default function LoginForm({ onToggleMode, isRegisterMode }: LoginFormProps) {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, register, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegisterMode) {
      const success = await register(email, password, name);
      if (!success) {
        setError(t.auth.userExists);
      } else {
        // Redirect to home after successful registration
        navigate('/');
      }
    } else {
      const success = await login(email, password);
      if (!success) {
        setError(t.auth.invalidCredentials);
      } else {
        // Redirect based on user role after successful login
        // Check user role from the auth context after login
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (currentUser.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-indigo-200 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4">
        <DarkModeToggle />
      </div>
      
      <div className="bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-gray-900/50 backdrop-blur-sm rounded-2xl shadow-xl w-full max-w-md p-8 border border-white/20 dark:border-gray-700/50">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {isRegisterMode ? t.auth.register : t.auth.login}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {isRegisterMode ? t.auth.switchToRegister : t.auth.switchToLogin}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isRegisterMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-gray-50/50 dark:bg-gray-700/50 dark:text-white dark:placeholder-gray-400"
                placeholder="Enter your full name"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-gray-50/50 dark:bg-gray-700/50 dark:text-white dark:placeholder-gray-400"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-gray-50/50 dark:bg-gray-700/50 dark:text-white dark:placeholder-gray-400"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {isRegisterMode ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                <span>{isRegisterMode ? 'Create Account' : 'Sign In'}</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            {isRegisterMode ? 'Already have an account?' : "Don't have an account?"}
            <button
              onClick={onToggleMode}
              className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              {isRegisterMode ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-600/50 rounded-lg transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>{language === 'pt' ? 'Ver propriedades sem login' : 'Browse properties without login'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}