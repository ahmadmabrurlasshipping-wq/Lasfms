import { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { supabase } from '@/lib/supabase';
import { Ship, Users, FileText, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import { formatNumber, formatRelativeTime, daysUntil } from '@/lib/utils';

interface KPIData {
  totalCrew: number;
  vesselsOperational: number;
  totalVessels: number;
  docsExpiring: number;
  mlcViolations: number;
}

export default function DashboardPage() {
  const [kpiData, setKpiData] = useState<KPIData>({
    totalCrew: 0,
    vesselsOperational: 0,
    totalVessels: 0,
    docsExpiring: 0,
    mlcViolations: 0,
  });
  const [loading, setLoading] = useState(true);
  const [vessels, setVessels] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch KPI data
      const [crewRes, vesselsRes, docsRes, mlcRes, activitiesRes] = await Promise.all([
        supabase.from('crew').select('id', { count: 'exact', head: true }),
        supabase.from('vessels').select('*'),
        supabase.from('documents').select('expiry_date'),
        supabase.from('mlc_logs').select('is_compliant'),
        supabase.from('activities').select('*').order('created_at', { ascending: false }).limit(10),
      ]);

      const totalCrew = crewRes.count || 0;
      const allVessels = vesselsRes.data || [];
      const vesselsOperational = allVessels.filter((v) => v.status !== 'docking').length;
      
      // Count documents expiring within 60 days
      const docs = docsRes.data || [];
      const docsExpiring = docs.filter((d) => {
        if (!d.expiry_date) return false;
        const days = daysUntil(d.expiry_date);
        return days >= 0 && days < 60;
      }).length;

      // Count MLC violations
      const mlcLogs = mlcRes.data || [];
      const mlcViolations = mlcLogs.filter((log) => !log.is_compliant).length;

      setKpiData({
        totalCrew,
        vesselsOperational,
        totalVessels: allVessels.length,
        docsExpiring,
        mlcViolations,
      });

      setVessels(allVessels);
      setActivities(activitiesRes.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const kpiCards = [
    {
      label: 'Total Kru Terdaftar',
      value: kpiData.totalCrew,
      icon: Users,
      color: 'text-neon',
      trend: '+12%',
      trendUp: true,
      bgGradient: 'from-cyan-500/10 to-blue-500/10',
    },
    {
      label: 'Kapal Beroperasi',
      value: `${kpiData.vesselsOperational}/${kpiData.totalVessels}`,
      icon: Ship,
      color: 'text-green-400',
      trend: `${kpiData.totalVessels - kpiData.vesselsOperational} docking`,
      trendUp: false,
      bgGradient: 'from-green-500/10 to-emerald-500/10',
    },
    {
      label: 'Dokumen Kadaluarsa',
      value: kpiData.docsExpiring,
      icon: FileText,
      color: 'text-yellow-400',
      trend: 'Perlu perpanjangan',
      trendUp: false,
      bgGradient: 'from-yellow-500/10 to-amber-500/10',
    },
    {
      label: 'Pelanggaran MLC',
      value: kpiData.mlcViolations,
      icon: Clock,
      color: 'text-red-400',
      trend: 'Memerlukan tindakan',
      trendUp: false,
      bgGradient: 'from-red-500/10 to-rose-500/10',
    },
  ];

  const vesselStatusConfig = {
    operational: { label: 'Beroperasi', color: 'text-green-400', bgColor: 'bg-green-500/10' },
    docking: { label: 'Docking', color: 'text-yellow-400', bgColor: 'bg-yellow-500/10' },
    building: { label: 'Building', color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-neon/30 border-t-neon rounded-full animate-spin mx-auto mb-4" />
            <p className="text-text-400">Memuat data...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-5">
        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-extrabold mb-1">Dashboard Armada</h1>
            <p className="text-sm text-text-400">
              PT. Pelayaran Lestari Abadi Serasi — Monitoring Real-Time
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-text-600">
              {new Date().toLocaleString('id-ID', {
                weekday: 'short',
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            <button
              onClick={fetchDashboardData}
              className="btn btn-ghost btn-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((card, index) => (
            <div key={index} className="stat-card">
              <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-50`} />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-text-400">
                    {card.label}
                  </span>
                  <card.icon className={`w-7 h-7 ${card.color} opacity-20`} />
                </div>
                <div className={`text-3xl font-extrabold font-mono mb-1 ${card.color}`}>
                  {typeof card.value === 'number' ? formatNumber(card.value) : card.value}
                </div>
                <div className={`text-xs flex items-center gap-1 ${card.trendUp ? 'text-green-400' : 'text-text-400'}`}>
                  {card.trendUp ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <AlertTriangle className="w-3 h-3" />
                  )}
                  <span>{card.trend}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Fleet Status Cards */}
        <div>
          <h2 className="text-sm font-bold mb-3 flex items-center gap-2">
            <Ship className="w-4 h-4 text-neon" />
            Status Armada
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {vessels.map((vessel) => {
              const status = vesselStatusConfig[vessel.status as keyof typeof vesselStatusConfig] || vesselStatusConfig.operational;
              const crewPercentage = Math.round((vessel.crew_count / 13) * 100);

              return (
                <div key={vessel.id} className={`vessel-card ${vessel.status}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-sm mb-1">{vessel.name}</h3>
                      <p className="text-[10px] text-text-400">
                        {vessel.type} · {vessel.year_built} · GT {formatNumber(vessel.gt)}T
                      </p>
                    </div>
                    <span className={`badge badge-${vessel.status === 'operational' ? 'success' : vessel.status === 'docking' ? 'warning' : 'info'}`}>
                      {status.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[10px] text-text-400 mb-2">
                    <div>
                      DWT
                      <div className="text-sm font-bold text-text-100">{formatNumber(vessel.dwt)}T</div>
                    </div>
                    <div>
                      LOA
                      <div className="text-sm font-bold text-text-100">{vessel.loa}m</div>
                    </div>
                    <div>
                      Kru
                      <div className={`text-sm font-bold ${crewPercentage < 100 ? 'text-yellow-400' : 'text-green-400'}`}>
                        {vessel.crew_count}/13
                      </div>
                    </div>
                  </div>
                  <div className="progress mb-2">
                    <div
                      className={`progress-bar ${vessel.status === 'docking' ? 'progress-bar-orange' : 'progress-bar-green'}`}
                      style={{ width: `${crewPercentage}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-text-400 flex items-center gap-1">
                    <svg className="w-3 h-3 text-orange" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {vessel.location || '—'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="glass-card p-5">
          <h2 className="text-sm font-bold mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-neon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Aktivitas Terbaru
          </h2>
          <div className="timeline">
            {activities.map((activity) => (
              <div key={activity.id} className="timeline-item">
                <div className="timeline-dot" />
                <div className="text-[9px] text-text-600 font-mono mb-0.5">
                  {formatRelativeTime(activity.created_at)}
                </div>
                <div className="text-xs text-text-200">{activity.action}</div>
                {activity.details && (
                  <div className="text-[10px] text-neon mt-0.5">{activity.details}</div>
                )}
              </div>
            ))}
            {activities.length === 0 && (
              <div className="text-center text-text-400 text-sm py-8">
                Belum ada aktivitas terbaru
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
