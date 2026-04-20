import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { getCurrentUser } from '@/lib/supabase';

// Pages that don't require authentication
const publicPages = ['/login', '/'];

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, [router.pathname]);

  const checkAuth = async () => {
    if (publicPages.includes(router.pathname)) {
      return;
    }

    const { user, error } = await getCurrentUser();
    
    if (error || !user) {
      router.push('/login');
    }
  };

  return (
    <>
      <Component {...pageProps} />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(7, 22, 48, 0.95)',
            color: '#e8f4ff',
            border: '1px solid rgba(0, 212, 255, 0.16)',
            backdropFilter: 'blur(12px)',
            borderRadius: '10px',
            fontSize: '13px',
          },
          success: {
            iconTheme: {
              primary: '#00e5a0',
              secondary: '#e8f4ff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ff3d5a',
              secondary: '#e8f4ff',
            },
          },
        }}
      />
    </>
  );
}
