import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getCurrentUser } from '@/lib/supabase';

export default function IndexPage() {
  const router = useRouter();

  useEffect(() => {
    checkAuthAndRedirect();
  }, []);

  const checkAuthAndRedirect = async () => {
    const { user } = await getCurrentUser();
    
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-navy-950">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-neon/30 border-t-neon rounded-full animate-spin mx-auto mb-4" />
        <p className="text-text-400 text-sm">Memuat...</p>
      </div>
    </div>
  );
}
