import { ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { getCurrentUser, getUserProfile } from '@/lib/supabase';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

const pageConfig: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': {
    title: 'Dashboard Armada',
    subtitle: 'PT. Pelayaran Lestari Abadi Serasi — Monitoring Real-Time',
  },
  '/fleet': {
    title: 'Armada Kapal',
    subtitle: 'CRUD Data Kapal — Unit LCT Terdaftar',
  },
  '/crew': {
    title: 'Manajemen Kru',
    subtitle: 'Data & Sertifikasi Awak Kapal',
  },
  '/roster': {
    title: 'Roster & Penjadwalan Kru',
    subtitle: 'Papan Roster Sign-ON / Sign-OFF Awak Kapal',
  },
  '/mlc': {
    title: 'Monitoring Jam Kerja MLC 2006',
    subtitle: 'STCW Chapter VIII — Kepatuhan Jam Kerja & Istirahat',
  },
  '/documents': {
    title: 'Dokumen Kapal',
    subtitle: 'Monitoring Sertifikat & Izin Resmi Armada',
  },
  '/operations': {
    title: 'Operasi Kapal',
    subtitle: 'Voyage Tracking & Log Operasional',
  },
  '/incidents': {
    title: 'Manajemen Insiden',
    subtitle: 'Safety Management & Near-Miss Reporting',
  },
  '/compliance': {
    title: 'Kepatuhan STCW & OCIMF',
    subtitle: 'Validasi Kompetensi & Matriks Perwira',
  },
  '/reports': {
    title: 'Laporan & Analitik',
    subtitle: 'Business Intelligence Armada',
  },
  '/settings': {
    title: 'Pengaturan Sistem',
    subtitle: 'Konfigurasi Perusahaan & Notifikasi',
  },
};

export default function MainLayout({ children, title, subtitle }: MainLayoutProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [badges, setBadges] = useState<Record<string, number>>({});

  useEffect(() => {
    checkUser();
    calculateBadges();
  }, []);

  const checkUser = async () => {
    try {
      const { user: authUser, error } = await getCurrentUser();
      if (error || !authUser) {
        router.push('/login');
        return;
      }

      const { data: profile } = await getUserProfile(authUser.id);
      setUser(profile);
    } catch (error) {
      console.error('Error checking user:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const calculateBadges = async () => {
    // TODO: Fetch real data from Supabase
    // For now, mock data
    setBadges({
      '/mlc': 3, // MLC violations
      '/documents': 5, // Documents expiring soon
    });
  };

  const config = pageConfig[router.pathname] || {
    title: title || 'LAS Fleet Monitoring',
    subtitle: subtitle || 'PT. Pelayaran Lestari Abadi Serasi',
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-navy-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-cyan to-blue-600 flex items-center justify-center mb-4 shadow-glow animate-pulse mx-auto">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <p className="text-text-400 text-sm">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-navy-950 overflow-hidden flex">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 90% 70% at 10% 0%, rgba(0, 80, 160, 0.18) 0%, transparent 55%),
              radial-gradient(ellipse 60% 50% at 85% 90%, rgba(255, 107, 53, 0.07) 0%, transparent 50%)
            `,
          }}
        />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 180, 255, 0.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 180, 255, 0.025) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Sidebar */}
      <Sidebar badges={badges} className="relative z-10" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
        {/* Topbar */}
        <Topbar
          user={user}
          title={config.title}
          subtitle={config.subtitle}
          onNotificationClick={() => setShowNotifications(!showNotifications)}
          notificationCount={Object.values(badges).reduce((a, b) => a + b, 0)}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-5">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>

      {/* Notification Panel (Slide-in from right) */}
      {showNotifications && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setShowNotifications(false)}
          />
          <div className="fixed top-[62px] right-0 w-80 h-[calc(100vh-62px)] bg-navy-900/97 border-l border-glass-border backdrop-blur-xl z-50 overflow-y-auto p-4 animate-slide-in">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-[13px]">🔔 Notifikasi</h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-text-400 hover:text-text-100"
              >
                ✕
              </button>
            </div>
            {/* Notification items will go here */}
            <div className="text-center text-text-400 text-sm py-8">
              Tidak ada notifikasi aktif ✓
            </div>
          </div>
        </>
      )}
    </div>
  );
}
