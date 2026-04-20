import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { StatusBadge, ExpiryBadge } from '@/components/ui/Badge';
import Modal, { ModalActions } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmpty } from '@/components/ui/Table';
import { useCrew, useVessels } from '@/hooks/useSupabase';
import { Users, Plus, Edit, Trash2, Upload, Download } from 'lucide-react';
import { formatDate, getInitials, getAvatarColor } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function CrewPage() {
  const { data: crew, loading, refetch } = useCrew();
  const { data: vessels } = useVessels();
  const [showModal, setShowModal] = useState(false);
  const [selectedCrew, setSelectedCrew] = useState<any>(null);

  const crewByStatus = {
    onboard: crew.filter((c: any) => c.status === 'onboard'),
    leave: crew.filter((c: any) => c.status === 'leave'),
    standby: crew.filter((c: any) => c.status === 'standby'),
    medical: crew.filter((c: any) => c.status === 'medical'),
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
            <p className="text-text-400">Memuat data kru...</p>
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
            <h1 className="text-2xl font-extrabold mb-1">Manajemen Kru</h1>
            <p className="text-sm text-text-400">
              Data & Sertifikasi Awak Kapal
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" icon={<Download className="w-4 h-4" />}>
              Export Excel
            </Button>
            <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setShowModal(true)}>
              Tambah Kru
            </Button>
          </div>
        </div>

        {/* Crew Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Card variant="sm" className="p-3">
            <div className="text-[10px] text-text-400 font-bold uppercase tracking-wider mb-1">
              Total Kru
            </div>
            <div className="text-2xl font-extrabold text-neon font-mono">
              {crew.length}
            </div>
          </Card>
          <Card variant="sm" className="p-3 border-l-2 border-green-500/30">
            <div className="text-[10px] text-text-400 font-bold uppercase tracking-wider mb-1">
              Di Kapal
            </div>
            <div className="text-2xl font-extrabold text-green-400 font-mono">
              {crewByStatus.onboard.length}
            </div>
          </Card>
          <Card variant="sm" className="p-3 border-l-2 border-cyan-500/30">
            <div className="text-[10px] text-text-400 font-bold uppercase tracking-wider mb-1">
              Cuti
            </div>
            <div className="text-2xl font-extrabold text-cyan-400 font-mono">
              {crewByStatus.leave.length}
            </div>
          </Card>
          <Card variant="sm" className="p-3 border-l-2 border-orange-500/30">
            <div className="text-[10px] text-text-400 font-bold uppercase tracking-wider mb-1">
              Standby
            </div>
            <div className="text-2xl font-extrabold text-orange-400 font-mono">
              {crewByStatus.standby.length}
            </div>
          </Card>
        </div>

        {/* Crew Table */}
        <Card
          title="Daftar Kru"
          subtitle={`${crew.length} awak kapal terdaftar`}
          action={
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Cari nama, jabatan..."
                className="input input-sm w-48"
              />
            </div>
          }
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama & Jabatan</TableHead>
                <TableHead>Kapal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Passport</TableHead>
                <TableHead>Seaman Book</TableHead>
                <TableHead>CoC</TableHead>
                <TableHead>Medical</TableHead>
                <TableHead>GMDSS</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {crew.length === 0 ? (
                <TableEmpty message="Belum ada data kru" />
              ) : (
                crew.map((member: any) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-bold"
                          style={{ background: getAvatarColor(member.name) }}
                        >
                          {getInitials(member.name)}
                        </div>
                        <div>
                          <div className="font-bold text-xs">{member.name}</div>
                          <div className="text-[9px] text-neon">{member.rank}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-text-400">
                      {getVesselName(member.vessel_id)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={member.status} />
                    </TableCell>
                    <TableCell className="text-xs font-mono text-text-400">
                      {member.passport_no || '—'}
                    </TableCell>
                    <TableCell className="text-xs font-mono text-text-400">
                      {member.seaman_book || '—'}
                    </TableCell>
                    <TableCell>
                      <ExpiryBadge expiryDate={member.coc_expiry} />
                    </TableCell>
                    <TableCell>
                      <ExpiryBadge expiryDate={member.medical_expiry} />
                    </TableCell>
                    <TableCell>
                      <ExpiryBadge expiryDate={member.gmdss_expiry} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button size="xs" variant="ghost" icon={<Edit className="w-3 h-3" />} />
                        <Button size="xs" variant="ghost" icon={<Upload className="w-3 h-3" />} />
                        <Button size="xs" variant="danger" icon={<Trash2 className="w-3 h-3" />} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Tambah Kru Baru"
        size="lg"
      >
        <div className="grid grid-cols-2 gap-4">
          <Input label="Nama Lengkap" placeholder="Capt. Budi Santoso" required />
          <Input label="Jabatan" placeholder="Nakhoda (Master)" required />
          <Select
            label="Kapal"
            options={[
              { value: '', label: 'Belum ditentukan' },
              ...vessels.map((v: any) => ({ value: v.id, label: v.name })),
            ]}
          />
          <Select
            label="Status"
            options={[
              { value: 'standby', label: 'Standby' },
              { value: 'onboard', label: 'Di Kapal' },
              { value: 'leave', label: 'Cuti' },
              { value: 'medical', label: 'Cuti Medis' },
            ]}
          />
          <Input label="Passport No" placeholder="A1234567" />
          <Input label="Seaman Book No" placeholder="SB-001" />
          <Input label="Tanggal Lahir" type="date" />
          <Input label="Kewarganegaraan" placeholder="Indonesia" />
          <Input label="CoC Number" placeholder="COC-NKD-001" />
          <Input label="CoC Expiry" type="date" />
          <Input label="Medical Expiry" type="date" />
          <Input label="GMDSS Expiry" type="date" />
          <div className="col-span-2">
            <Input label="Kontak Darurat" placeholder="Nama — No. Telp" />
          </div>
        </div>

        <ModalActions>
          <Button variant="ghost" onClick={() => setShowModal(false)}>
            Batal
          </Button>
          <Button variant="primary" onClick={() => {
            toast.success('Kru berhasil ditambahkan');
            setShowModal(false);
            refetch();
          }}>
            Simpan
          </Button>
        </ModalActions>
      </Modal>
    </MainLayout>
  );
}
