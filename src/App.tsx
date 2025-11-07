import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { PropertyProvider } from './contexts/PropertyContext';
import { DarkModeProvider } from './contexts/DarkModeContext';
import LoginForm from './components/LoginForm';
import AuthCallback from './components/AuthCallback';
import AdminPanel from './pages/AdminPanel';
import SoldProperties from './pages/SoldProperties';
import FinancialDashboard from './pages/FinancialDashboard';
import PublicPropertyBrowser from './pages/PublicPropertyBrowser';
import PropertyDetailWrapper from './pages/PropertyDetailWrapper';
import { SafeStorage } from './lib/storage';
import { StorageErrorBoundary } from './components/StorageErrorBoundary';

function AppRoutes() {
  const { user, isLoading } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Debug storage availability
  useEffect(() => {
    const status = SafeStorage.getStorageStatus();
    console.log('Storage Status:', status);
    
    // Test storage operations
    try {
      SafeStorage.setItemWithMemoryFallback('storage_test', 'test_value');
      const retrieved = SafeStorage.getItemWithMemoryFallback('storage_test');
      console.log('Storage test result:', retrieved);
    } catch (error) {
      console.error('Storage test failed:', error);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes - no login required */}
      <Route path="/" element={<PublicPropertyBrowser />} />
      <Route path="/property/:id" element={<PropertyDetailWrapper />} />
      
      {/* Login route */}
      <Route 
        path="/login" 
        element={
          <LoginForm
            onToggleMode={() => setIsRegisterMode(!isRegisterMode)}
            isRegisterMode={isRegisterMode}
          />
        } 
      />
      
      {/* Auth callback route for OAuth */}
      <Route path="/auth/callback" element={<AuthCallback />} />
      
      {/* Legacy dashboard route - redirect to home */}
      <Route path="/dashboard" element={<Navigate to="/" replace />} />
      
      {/* Protected admin panel */}
      <Route
        path="/admin"
        element={
          user && user.role === 'admin' ? (
            <AdminPanel />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      
      {/* Admin sold properties page */}
      <Route
        path="/admin/sold-properties"
        element={
          user && user.role === 'admin' ? (
            <SoldProperties />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      
      {/* Admin financial dashboard page */}
      <Route
        path="/admin/financial-dashboard"
        element={
          user && user.role === 'admin' ? (
            <FinancialDashboard />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      
      {/* Fallback to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <StorageErrorBoundary>
      <Router>
        <DarkModeProvider>
          <LanguageProvider>
            <PropertyProvider>
              <AuthProvider>
                <AppRoutes />
              </AuthProvider>
            </PropertyProvider>
          </LanguageProvider>
        </DarkModeProvider>
      </Router>
    </StorageErrorBoundary>
  );
}

export default App;