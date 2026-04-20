// INCIDENTS PAGE
import MainLayout from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useIncidents, useVessels } from '@/hooks/useSupabase';
import { AlertTriangle, Plus } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

export default function IncidentsPage() {
  const { data: incidents, loading } = useIncidents();
  const { data: vessels } = useVessels();

  const severityConfig = {
    low: { variant: 'info' as const, label: 'Rendah' },
    medium: { variant: 'warning' as const, label: 'Sedang' },
    high: { variant: 'danger' as const, label: 'Tinggi' },
    critical: { variant: 'danger' as const, label: 'Kritis' },
  };

  if (loading) {
    return <MainLayout><div className="text-center py-20 text-text-400">Loading...</div></MainLayout>;
  }

  return (
    <MainLayout>
      <div className="space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-extrabold mb-1">Manajemen Insiden</h1>
            <p className="text-sm text-text-400">Safety Management & Near-Miss Reporting</p>
          </div>
          <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
            Laporkan Insiden
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <Card variant="sm" className="p-3">
            <div className="text-[10px] text-text-400 font-bold uppercase mb-1">Total Insiden</div>
            <div className="text-2xl font-extrabold text-neon font-mono">{incidents.length}</div>
          </Card>
          <Card variant="sm" className="p-3 border-l-2 border-red-500/30">
            <div className="text-[10px] text-text-400 font-bold uppercase mb-1">Kritis</div>
            <div className="text-2xl font-extrabold text-red-400 font-mono">
              {incidents.filter((i: any) => i.severity === 'critical').length}
            </div>
          </Card>
          <Card variant="sm" className="p-3 border-l-2 border-yellow-500/30">
            <div className="text-[10px] text-text-400 font-bold uppercase mb-1">Investigasi</div>
            <div className="text-2xl font-extrabold text-yellow-400 font-mono">
              {incidents.filter((i: any) => i.status === 'investigation').length}
            </div>
          </Card>
          <Card variant="sm" className="p-3 border-l-2 border-green-500/30">
            <div className="text-[10px] text-text-400 font-bold uppercase mb-1">Ditutup</div>
            <div className="text-2xl font-extrabold text-green-400 font-mono">
              {incidents.filter((i: any) => i.status === 'closed').length}
            </div>
          </Card>
        </div>

        <Card title="Daftar Insiden" subtitle="Laporan kecelakaan dan near-miss">
          <div className="space-y-3">
            {incidents.map((incident: any) => {
              const vessel = vessels.find((v: any) => v.id === incident.vessel_id);
              const config = severityConfig[incident.severity as keyof typeof severityConfig];

              return (
                <div key={incident.id} className="glass-card-sm p-4 hover:border-neon/20 transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        incident.severity === 'critical' ? 'bg-red-500/10' : 'bg-yellow-500/10'
                      }`}>
                        <AlertTriangle className={`w-5 h-5 ${
                          incident.severity === 'critical' ? 'text-red-400' : 'text-yellow-400'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm">{incident.type}</h3>
                        <p className="text-xs text-text-400">{vessel?.name || 'Unknown Vessel'}</p>
                      </div>
                    </div>
                    <Badge variant={config.variant}>{config.label}</Badge>
                  </div>
                  <p className="text-xs text-text-300 mb-2">{incident.description}</p>
                  <div className="flex items-center justify-between text-[10px] text-text-600">
                    <span>{formatDateTime(incident.incident_date)}</span>
                    <span>{incident.status === 'closed' ? '✓ Ditutup' : '🔍 Investigasi'}</span>
                  </div>
                </div>
              );
            })}
            {incidents.length === 0 && (
              <div className="text-center py-12 text-text-400">Tidak ada insiden dilaporkan ✓</div>
            )}
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
