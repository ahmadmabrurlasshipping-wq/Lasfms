import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useRotations, useCrew, useVessels } from '@/hooks/useSupabase';
import { Calendar, Plus, AlertTriangle, Users } from 'lucide-react';
import { formatDate, getInitials, getAvatarColor } from '@/lib/utils';

const rosterColumns = [
  { key: 'leave', label: 'Cuti', color: 'var(--neon)', badge: 'info' as const },
  { key: 'planned', label: 'Direncanakan', color: 'var(--text-400)', badge: 'muted' as const },
  { key: 'enroute', label: 'Dalam Perjalanan (En Route)', color: 'var(--warning)', badge: 'warning' as const },
  { key: 'onboard', label: 'Di Kapal (Onboard)', color: 'var(--success)', badge: 'success' as const },
];

export default function RosterPage() {
  const { data: rotations, loading, refetch } = useRotations();
  const { data: crew } = useCrew();
  const { data: vessels } = useVessels();

  const [showModal, setShowModal] = useState(false);

  // Group rotations by status
  const rosterByStatus = rosterColumns.map((column) => ({
    ...column,
    items: rotations.filter((r: any) => r.status === column.key),
  }));

  // Gap analysis - vessels with insufficient crew
  const gapAlerts = vessels.filter((v: any) => {
    if (v.status === 'docking') return false;
    const crewOnboard = crew.filter((c: any) => c.vessel_id === v.id && c.status === 'onboard');
    return crewOnboard.length < 13;
  });

  const getCrewInfo = (crewId: string) => {
    return crew.find((c: any) => c.id === crewId);
  };

  const getVesselName = (vesselId: string | null) => {
    if (!vesselId) return 'Belum ditentukan';
    const vessel = vessels.find((v: any) => v.id === vesselId);
    return vessel?.name || '—';
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-neon/30 border-t-neon rounded-full animate-spin mx-auto mb-4" />
            <p className="text-text-400">Memuat data roster...</p>
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
            <h1 className="text-2xl font-extrabold mb-1">Roster & Penjadwalan Kru</h1>
            <p className="text-sm text-text-400">
              Papan Roster Sign-ON / Sign-OFF Awak Kapal
            </p>
          </div>
          <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setShowModal(true)}>
            Jadwalkan Rotasi
          </Button>
        </div>

        {/* Gap Analysis Alerts */}
        {gapAlerts.length > 0 && (
          <div className="space-y-2">
            {gapAlerts.map((vessel: any) => {
              const crewCount = crew.filter((c: any) => c.vessel_id === vessel.id && c.status === 'onboard').length;
              const gap = 13 - crewCount;

              return (
                <div key={vessel.id} className="alert alert-warning">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <div>
                    <strong>GAP ANALISIS — {vessel.name}:</strong> Hanya{' '}
                    <strong>{crewCount}/13</strong> kru onboard. Diperlukan{' '}
                    <strong>{gap} pengganti</strong>.{' '}
                    <button
                      onClick={() => setShowModal(true)}
                      className="underline font-semibold hover:text-yellow-200"
                    >
                      Jadwalkan rotasi →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Roster Board (Kanban-style) */}
        <Card title="Papan Roster Kru" subtitle="Drag & drop untuk mengubah status (coming soon)">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {rosterByStatus.map((column) => (
              <div key={column.key} className="roster-column">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-glass-border2">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-text-400">
                    {column.label}
                  </span>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ color: column.color, background: `${column.color}15` }}
                  >
                    {column.items.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {column.items.map((rotation: any) => {
                    const crewInfo = getCrewInfo(rotation.crew_id);
                    if (!crewInfo) return null;

                    const initials = getInitials(crewInfo.name);
                    const avatarColor = getAvatarColor(crewInfo.name);

                    return (
                      <div key={rotation.id} className="roster-card">
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                            style={{ background: avatarColor }}
                          >
                            {initials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-xs truncate">{crewInfo.name}</div>
                          </div>
                        </div>
                        <div className="text-[10px] text-neon mb-1">{rotation.rank}</div>
                        <div className="text-[10px] text-text-400 mb-1">
                          {getVesselName(rotation.vessel_id)}
                        </div>
                        {rotation.port && (
                          <div className="text-[10px] text-text-400 flex items-center gap-1 mb-1">
                            📍 {rotation.port}
                          </div>
                        )}
                        <div className="text-[9px] text-text-600 font-mono">
                          {formatDate(rotation.sign_on_date)} → {formatDate(rotation.sign_off_date)}
                        </div>
                      </div>
                    );
                  })}

                  {column.items.length === 0 && (
                    <div className="text-center text-text-600 text-xs py-4 px-2">
                      Tidak ada data
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Rotation Schedule Table */}
        <Card
          title="Jadwal Rotasi Mendatang"
          subtitle="Daftar lengkap Sign-ON / Sign-OFF yang dijadwalkan"
        >
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Nama Kru</th>
                  <th>Jabatan</th>
                  <th>Kapal</th>
                  <th>Pelabuhan Join</th>
                  <th>Rencana Sign-ON</th>
                  <th>Rencana Sign-OFF</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {rotations.map((rotation: any) => {
                  const crewInfo = getCrewInfo(rotation.crew_id);
                  if (!crewInfo) return null;

                  const column = rosterColumns.find((c) => c.key === rotation.status);

                  return (
                    <tr key={rotation.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold"
                            style={{ background: getAvatarColor(crewInfo.name) }}
                          >
                            {getInitials(crewInfo.name)}
                          </div>
                          <div>
                            <div className="font-semibold text-xs">{crewInfo.name}</div>
                            <div className="text-[9px] text-text-400">{crewInfo.rank}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-xs">{rotation.rank}</td>
                      <td className="text-xs text-neon">{getVesselName(rotation.vessel_id)}</td>
                      <td className="text-xs text-text-400">{rotation.port || '—'}</td>
                      <td className="text-xs font-mono">{formatDate(rotation.sign_on_date)}</td>
                      <td className="text-xs font-mono">{formatDate(rotation.sign_off_date)}</td>
                      <td>
                        {column && <Badge variant={column.badge}>{column.label}</Badge>}
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <Button size="xs" variant="ghost">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </Button>
                          <Button size="xs" variant="danger">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
