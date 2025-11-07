import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('Processing auth callback...');
        console.log('Current URL:', window.location.href);
        
        // Get the current URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const errorParam = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');
        
        if (errorParam) {
          console.error('OAuth error:', errorParam, errorDescription);
          setError(errorDescription || errorParam);
          setIsProcessing(false);
          setTimeout(() => navigate('/login?error=auth_failed'), 3000);
          return;
        }

        // Handle the OAuth callback by exchanging the code for a session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          setError(error.message);
          setIsProcessing(false);
          setTimeout(() => navigate('/login?error=auth_failed'), 3000);
          return;
        }

        if (data.session && data.session.user) {
          console.log('Auth callback successful, user:', data.session.user.email);
          
          // Wait a moment for the auth state to propagate and user profile to be created
          console.log('Waiting for auth state to propagate...');
          setTimeout(() => {
            setIsProcessing(false);
            navigate('/', { replace: true });
          }, 2000);
        } else {
          console.log('No session found in callback, checking for hash parameters...');
          
          // Sometimes the auth data is in the hash fragment
          if (window.location.hash) {
            console.log('Hash found, processing...', window.location.hash);
            // Let Supabase handle the hash automatically
            setTimeout(() => {
              navigate('/', { replace: true });
            }, 1000);
          } else {
            console.log('No session or hash found');
            setIsProcessing(false);
            setTimeout(() => navigate('/login'), 2000);
          }
        }
      } catch (error: any) {
        console.error('Auth callback error:', error);
        setError(error.message);
        setIsProcessing(false);
        setTimeout(() => navigate('/login?error=auth_failed'), 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center max-w-md">
        {error ? (
          <>
            <div className="text-red-500 text-xl mb-4">⚠️</div>
            <p className="text-red-600 dark:text-red-400 mb-4">Authentication Error</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{error}</p>
            <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">Redirecting to login...</p>
          </>
        ) : isProcessing ? (
          <>
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Completing authentication...</p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Setting up your profile...</p>
            <p className="text-gray-400 dark:text-gray-600 text-xs mt-4">This may take a few seconds</p>
          </>
        ) : (
          <>
            <div className="text-green-500 text-xl mb-4">✓</div>
            <p className="text-gray-600 dark:text-gray-400">Authentication complete!</p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Redirecting...</p>
          </>
        )}
      </div>
    </div>
  );
}