import { useRouter } from 'next/router';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { 
  Ship, Users, Calendar, Clock, FileText, 
  Shield, AlertTriangle, BarChart3, Settings,
  Route, Gauge
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  section: string;
}

const navItems: NavItem[] = [
  // Main
  { name: 'Dashboard', href: '/dashboard', icon: Gauge, section: 'Utama' },
  
  // Fleet
  { name: 'Armada Kapal', href: '/fleet', icon: Ship, section: 'Armada' },
  { name: 'Operasi Kapal', href: '/operations', icon: Route, section: 'Armada' },
  
  // Crew Management
  { name: 'Manajemen Kru', href: '/crew', icon: Users, section: 'SDM Kru' },
  { name: 'Roster & Jadwal', href: '/roster', icon: Calendar, section: 'SDM Kru' },
  { name: 'Jam Kerja MLC', href: '/mlc', icon: Clock, section: 'SDM Kru' },
  
  // Compliance
  { name: 'Dokumen Kapal', href: '/documents', icon: FileText, section: 'Kepatuhan' },
  { name: 'Kepatuhan STCW', href: '/compliance', icon: Shield, section: 'Kepatuhan' },
  { name: 'Insiden', href: '/incidents', icon: AlertTriangle, section: 'Kepatuhan' },
  
  // Admin
  { name: 'Laporan & Analitik', href: '/reports', icon: BarChart3, section: 'Administrasi' },
  { name: 'Pengaturan', href: '/settings', icon: Settings, section: 'Administrasi' },
];

interface SidebarProps {
  className?: string;
  badges?: Record<string, number>;
}

export default function Sidebar({ className, badges = {} }: SidebarProps) {
  const router = useRouter();
  const currentPath = router.pathname;

  // Group navigation items by section
  const sections = navItems.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, NavItem[]>);

  return (
    <aside 
      className={cn(
        "w-64 flex-shrink-0 bg-navy-900/92 border-r border-glass-border2",
        "backdrop-blur-xl overflow-y-auto overflow-x-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="px-3.5 py-4 border-b border-glass-border2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-neon-cyan to-blue-600 flex items-center justify-center flex-shrink-0 shadow-glow-sm">
            <Ship className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-extrabold tracking-wide text-text-100">
              LAS FMS
            </div>
            <div className="text-[9px] text-text-400 tracking-wider uppercase">
              Lestari Abadi Serasi
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2.5 py-1.5">
        {Object.entries(sections).map(([section, items]) => (
          <div key={section} className="mb-1">
            <div className="px-2 py-2 text-[9px] font-bold tracking-wider uppercase text-text-600">
              {section}
            </div>
            <div className="space-y-0.5">
              {items.map((item) => {
                const isActive = currentPath === item.href || 
                               (item.href !== '/dashboard' && currentPath.startsWith(item.href));
                const Icon = item.icon;
                const badgeCount = badges[item.href] || 0;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2.5 px-2.5 py-2 rounded-lg",
                      "text-[12.5px] font-medium transition-all duration-200",
                      "relative group",
                      isActive
                        ? "bg-neon-cyan/12 text-neon-cyan border border-neon-cyan/18 shadow-glow-sm"
                        : "text-text-400 hover:bg-neon-cyan/7 hover:text-text-200"
                    )}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-3/5 bg-neon-cyan rounded-r" />
                    )}
                    <Icon className={cn(
                      "w-[18px] h-[18px] flex-shrink-0",
                      isActive ? "text-neon-cyan" : ""
                    )} />
                    <span className="flex-1 whitespace-nowrap">{item.name}</span>
                    {badgeCount > 0 && (
                      <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
                        {badgeCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
