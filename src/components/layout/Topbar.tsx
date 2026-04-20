import { useState } from 'react';
import { useRouter } from 'next/router';
import { Bell, Globe, Search, LogOut, User } from 'lucide-react';
import { signOut } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface TopbarProps {
  user?: {
    name: string;
    email: string;
    role: string;
    avatar_initials?: string;
  };
  title: string;
  subtitle: string;
  onNotificationClick?: () => void;
  notificationCount?: number;
}

export default function Topbar({
  user,
  title,
  subtitle,
  onNotificationClick,
  notificationCount = 0,
}: TopbarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logout berhasil');
      router.push('/login');
    } catch (error) {
      toast.error('Gagal logout');
      console.error(error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement global search
      toast('Pencarian: ' + searchQuery, { icon: '🔍' });
    }
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-orange-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-cyan-500',
    ];
    const index = (name?.charCodeAt(0) || 0) % colors.length;
    return colors[index];
  };

  return (
    <header className="h-[62px] flex-shrink-0 bg-navy-900/88 border-b border-glass-border2 backdrop-blur-xl px-5">
      <div className="h-full flex items-center gap-3">
        {/* Title Section */}
        <div className="flex-1">
          <h1 className="text-[15px] font-bold text-text-100">
            {title}
          </h1>
          <p className="text-[11px] text-text-400 mt-0.5">
            {subtitle}
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex">
          <div className="flex items-center gap-2 bg-black/30 border border-glass-border2 rounded-lg px-3 py-1.5">
            <Search className="w-3.5 h-3.5 text-text-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kapal, kru, dokumen..."
              className="bg-transparent border-none text-[12px] text-text-100 placeholder:text-text-600 focus:outline-none w-48"
            />
          </div>
        </form>

        {/* Action Icons */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button
            onClick={onNotificationClick}
            className={cn(
              "w-8 h-8 rounded-lg bg-black/30 border border-glass-border2",
              "flex items-center justify-center text-text-400",
              "hover:bg-neon-cyan/10 hover:text-neon-cyan transition-all relative"
            )}
          >
            <Bell className="w-3.5 h-3.5" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full border-2 border-navy-900" />
            )}
          </button>

          {/* Language Toggle */}
          <button
            className={cn(
              "w-8 h-8 rounded-lg bg-black/30 border border-glass-border2",
              "flex items-center justify-center text-text-400",
              "hover:bg-neon-cyan/10 hover:text-neon-cyan transition-all"
            )}
          >
            <Globe className="w-3.5 h-3.5" />
          </button>

          {/* User Profile */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={cn(
                  "flex items-center gap-2 bg-black/30 border border-glass-border2",
                  "px-3 py-1 rounded-full hover:bg-neon-cyan/8 transition-all"
                )}
              >
                <div
                  className={cn(
                    "w-6 h-6 rounded-md flex items-center justify-center",
                    "text-[9px] font-bold text-white",
                    getAvatarColor(user.name)
                  )}
                >
                  {user.avatar_initials || user.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-[12px] font-semibold text-text-100">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-text-400">
                    {user.role}
                  </div>
                </div>
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-navy-800/95 border border-glass-border backdrop-blur-xl rounded-xl shadow-xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-glass-border2">
                    <div className="font-semibold text-[13px] text-text-100">
                      {user.name}
                    </div>
                    <div className="text-[11px] text-text-400 mt-0.5">
                      {user.email}
                    </div>
                    <div className="mt-1.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20">
                        {user.role}
                      </span>
                    </div>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => router.push('/settings')}
                      className="w-full px-4 py-2 text-left text-[12px] text-text-200 hover:bg-glass-bg flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      Profil Saya
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-[12px] text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
