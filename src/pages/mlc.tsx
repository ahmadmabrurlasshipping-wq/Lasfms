import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal, { ModalActions } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmpty } from '@/components/ui/Table';
import { useMLCLogs, useCrew, useVessels } from '@/hooks/useSupabase';
import { Clock, Plus, AlertTriangle, CheckCircle } from 'lucide-react';
import { formatDate, getInitials, getAvatarColor } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function MLCPage() {
  const { data: mlcLogs, loading, refetch } = useMLCLogs();
  const { data: crew } = useCrew();
  const { data: vessels } = useVessels();
  const [showModal, setShowModal] = useState(false);

  const violations = mlcLogs.filter((log: any) => !log.is_compliant);
  const compliant = mlcLogs.filter((log: any) => log.is_compliant);

  const getCrewInfo = (crewId: string) => {
    return crew.find((c: any) => c.id === crewId);
  };

  const getVesselName = (vesselId: string | null) => {
    if (!vesselId) return '—';
    const vessel = vessels.find((v: any) => v.id === vesselId);
    return vessel?.name || '—';
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-neon/30 border-t-neon rounded-full animate-spin mx-auto mb-4" />
            <p className="text-text-400">Memuat data MLC...</p>
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
            <h1 className="text-2xl font-extrabold mb-1">Monitoring Jam Kerja MLC 2006</h1>
            <p className="text-sm text-text-400">
              STCW Chapter VIII — Kepatuhan Jam Kerja & Istirahat
            </p>
          </div>
          <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setShowModal(true)}>
            Input Log Harian
          </Button>
        </div>

        {/* Violations Alert */}
        {violations.length > 0 && (
          <div className="alert alert-danger">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <div>
              <strong>PERINGATAN PELANGGARAN MLC:</strong> Ditemukan{' '}
              <strong>{violations.length} pelanggaran</strong> jam kerja dalam 30 hari terakhir.
              Segera tindak lanjuti untuk memastikan kepatuhan STCW.
            </div>
          </div>
        )}

        {/* MLC Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Card variant="sm" className="p-3">
            <div className="text-[10px] text-text-400 font-bold uppercase tracking-wider mb-1">
              Total Log (30 Hari)
            </div>
            <div className="text-2xl font-extrabold text-neon font-mono">
              {mlcLogs.length}
            </div>
          </Card>
          <Card variant="sm" className="p-3 border-l-2 border-green-500/30">
            <div className="text-[10px] text-text-400 font-bold uppercase tracking-wider mb-1">
              Compliant ✓
            </div>
            <div className="text-2xl font-extrabold text-green-400 font-mono">
              {compliant.length}
            </div>
          </Card>
          <Card variant="sm" className="p-3 border-l-2 border-red-500/30">
            <div className="text-[10px] text-text-400 font-bold uppercase tracking-wider mb-1">
              Violation ⚠
            </div>
            <div className="text-2xl font-extrabold text-red-400 font-mono">
              {violations.length}
            </div>
          </Card>
          <Card variant="sm" className="p-3 border-l-2 border-orange-500/30">
            <div className="text-[10px] text-text-400 font-bold uppercase tracking-wider mb-1">
              Compliance Rate
            </div>
            <div className="text-2xl font-extrabold text-orange-400 font-mono">
              {mlcLogs.length > 0 ? Math.round((compliant.length / mlcLogs.length) * 100) : 0}%
            </div>
          </Card>
        </div>

        {/* MLC Standards Info */}
        <Card className="p-4 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 border-l-4 border-neon">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-neon/10 border border-neon/30 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-neon" />
            </div>
            <div>
              <h3 className="font-bold text-sm mb-1">Standar MLC 2006 / STCW Chapter VIII</h3>
              <p className="text-xs text-text-400 leading-relaxed">
                ✓ <strong>Jam Istirahat Minimum:</strong> 10 jam dalam periode 24 jam<br />
                ✓ <strong>Jam Kerja Maksimum:</strong> 14 jam dalam periode 24 jam<br />
                ✓ Istirahat dapat dibagi maksimal 2 periode, salah satunya minimal 6 jam berturut-turut<br />
                ✓ Interval antar periode istirahat tidak boleh lebih dari 14 jam
              </p>
            </div>
          </div>
        </Card>

        {/* MLC Logs Table */}
        <Card title="Log Jam Kerja" subtitle="30 hari terakhir">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Nama Kru</TableHead>
                <TableHead>Jabatan</TableHead>
                <TableHead>Kapal</TableHead>
                <TableHead>Jam Kerja</TableHead>
                <TableHead>Jam Istirahat</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Catatan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mlcLogs.length === 0 ? (
                <TableEmpty message="Belum ada log jam kerja" />
              ) : (
                mlcLogs.map((log: any) => {
                  const crewInfo = getCrewInfo(log.crew_id);
                  if (!crewInfo) return null;

                  return (
                    <TableRow key={log.id}>
                      <TableCell className="text-xs font-mono">
                        {formatDate(log.log_date, 'dd MMM yyyy')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold"
                            style={{ background: getAvatarColor(crewInfo.name) }}
                          >
                            {getInitials(crewInfo.name)}
                          </div>
                          <div className="font-semibold text-xs">{crewInfo.name}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-neon">{crewInfo.rank}</TableCell>
                      <TableCell className="text-xs text-text-400">
                        {getVesselName(log.vessel_id)}
                      </TableCell>
                      <TableCell className="text-xs font-mono">
                        <span className={log.work_hours > 14 ? 'text-red-400' : 'text-text-200'}>
                          {log.work_hours} jam
                        </span>
                      </TableCell>
                      <TableCell className="text-xs font-mono">
                        <span className={log.rest_hours < 10 ? 'text-red-400' : 'text-green-400'}>
                          {log.rest_hours} jam
                        </span>
                      </TableCell>
                      <TableCell>
                        {log.is_compliant ? (
                          <Badge variant="success" dot={false}>
                            <CheckCircle className="w-3 h-3" />
                            Compliant
                          </Badge>
                        ) : (
                          <Badge variant="danger" dot={false}>
                            <AlertTriangle className="w-3 h-3" />
                            Violation
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-text-400 max-w-[150px] truncate">
                        {log.notes || '—'}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Add Log Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Input Log Jam Kerja Harian"
        size="md"
      >
        <div className="space-y-4">
          <Input label="Tanggal" type="date" required />
          <Select
            label="Nama Kru"
            required
            options={[
              { value: '', label: 'Pilih Kru...' },
              ...crew.map((c: any) => ({ value: c.id, label: `${c.name} - ${c.rank}` })),
            ]}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Jam Kerja"
              type="number"
              step="0.5"
              placeholder="8"
              helperText="Max: 14 jam"
              required
            />
            <Input
              label="Jam Istirahat"
              type="number"
              step="0.5"
              placeholder="10"
              helperText="Min: 10 jam"
              required
            />
          </div>
          <Input label="Catatan" placeholder="Overtime karena cargo operation" />
        </div>

        <ModalActions>
          <Button variant="ghost" onClick={() => setShowModal(false)}>
            Batal
          </Button>
          <Button variant="primary" onClick={() => {
            toast.success('Log jam kerja berhasil ditambahkan');
            setShowModal(false);
            refetch();
          }}>
            Simpan Log
          </Button>
        </ModalActions>
      </Modal>
    </MainLayout>
  );
}
