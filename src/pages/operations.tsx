import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal, { ModalActions } from '@/components/ui/Modal';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmpty } from '@/components/ui/Table';
import { useVoyages, useVessels } from '@/hooks/useSupabase';
import { Route, Plus, Edit, Eye } from 'lucide-react';
import { formatDate, formatDateTime, formatNumber } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function OperationsPage() {
  const { data: voyages, loading, refetch } = useVoyages();
  const { data: vessels } = useVessels();
  const [showModal, setShowModal] = useState(false);
  const [selectedVoyage, setSelectedVoyage] = useState<any>(null);
  const [formData, setFormData] = useState({
    vessel_id: '',
    voyage_number: '',
    port_from: '',
    port_to: '',
    cargo_type: '',
    cargo_quantity: '',
    distance_nm: '',
    etd: '',
    eta: '',
    fuel_consumption: '',
    fuel_unit: 'MT',
    status: 'planned',
    notes: '',
  });

  const getVesselInfo = (vesselId: string) => {
    return vessels.find((v: any) => v.id === vesselId);
  };

  const handleOpenModal = (voyage?: any) => {
    if (voyage) {
      setSelectedVoyage(voyage);
      setFormData({
        ...voyage,
        etd: voyage.etd?.substring(0, 16) || '',
        eta: voyage.eta?.substring(0, 16) || '',
      });
    } else {
      setSelectedVoyage(null);
      setFormData({
        vessel_id: '',
        voyage_number: `V${new Date().getFullYear()}-${String(voyages.length + 1).padStart(3, '0')}`,
        port_from: '',
        port_to: '',
        cargo_type: '',
        cargo_quantity: '',
        distance_nm: '',
        etd: '',
        eta: '',
        fuel_consumption: '',
        fuel_unit: 'MT',
        status: 'planned',
        notes: '',
      });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    toast.success(selectedVoyage ? 'Voyage berhasil diupdate' : 'Voyage berhasil ditambahkan');
    setShowModal(false);
    refetch();
  };

  const voyageStatusConfig = {
    planned: { variant: 'muted' as const, label: 'Direncanakan' },
    active: { variant: 'info' as const, label: 'Berlayar' },
    port: { variant: 'warning' as const, label: 'Di Pelabuhan' },
    completed: { variant: 'success' as const, label: 'Selesai' },
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-neon/30 border-t-neon rounded-full animate-spin mx-auto mb-4" />
            <p className="text-text-400">Memuat data voyage...</p>
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
            <h1 className="text-2xl font-extrabold mb-1">Operasi Kapal</h1>
            <p className="text-sm text-text-400">
              Voyage Tracking & Log Operasional
            </p>
          </div>
          <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => handleOpenModal()}>
            Buat Voyage Baru
          </Button>
        </div>

        {/* Voyage Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Card variant="sm" className="p-3">
            <div className="text-[10px] text-text-400 font-bold uppercase tracking-wider mb-1">
              Total Voyage
            </div>
            <div className="text-2xl font-extrabold text-neon font-mono">
              {voyages.length}
            </div>
          </Card>
          <Card variant="sm" className="p-3 border-l-2 border-cyan-500/30">
            <div className="text-[10px] text-text-400 font-bold uppercase tracking-wider mb-1">
              Sedang Berlayar
            </div>
            <div className="text-2xl font-extrabold text-cyan-400 font-mono">
              {voyages.filter((v: any) => v.status === 'active').length}
            </div>
          </Card>
          <Card variant="sm" className="p-3 border-l-2 border-yellow-500/30">
            <div className="text-[10px] text-text-400 font-bold uppercase tracking-wider mb-1">
              Di Pelabuhan
            </div>
            <div className="text-2xl font-extrabold text-yellow-400 font-mono">
              {voyages.filter((v: any) => v.status === 'port').length}
            </div>
          </Card>
          <Card variant="sm" className="p-3 border-l-2 border-green-500/30">
            <div className="text-[10px] text-text-400 font-bold uppercase tracking-wider mb-1">
              Selesai (Bulan Ini)
            </div>
            <div className="text-2xl font-extrabold text-green-400 font-mono">
              {voyages.filter((v: any) => v.status === 'completed').length}
            </div>
          </Card>
        </div>

        {/* Voyage Tracking Table */}
        <Card
          title="Log Voyage Tracking"
          subtitle="Detail pelayaran, muatan, dan konsumsi bahan bakar"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No. Voyage</TableHead>
                <TableHead>Nama Kapal</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Muatan</TableHead>
                <TableHead>Jarak (NM)</TableHead>
                <TableHead>ETD</TableHead>
                <TableHead>ETA</TableHead>
                <TableHead>Fuel Cons.</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {voyages.length === 0 ? (
                <TableEmpty message="Belum ada voyage terdaftar" />
              ) : (
                voyages.map((voyage: any) => {
                  const vessel = getVesselInfo(voyage.vessel_id);
                  const statusConfig = voyageStatusConfig[voyage.status as keyof typeof voyageStatusConfig];

                  return (
                    <TableRow key={voyage.id}>
                      <TableCell className="text-xs font-mono font-bold text-neon">
                        {voyage.voyage_number}
                      </TableCell>
                      <TableCell className="text-xs font-semibold">
                        {vessel?.name || '—'}
                      </TableCell>
                      <TableCell className="text-xs">
                        <div className="flex items-center gap-1">
                          <span className="text-text-400">{voyage.port_from}</span>
                          <svg className="w-3 h-3 text-neon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                          <span className="text-text-100">{voyage.port_to}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">
                        <div className="text-text-200">{voyage.cargo_type}</div>
                        <div className="text-[10px] text-text-600">{voyage.cargo_quantity}</div>
                      </TableCell>
                      <TableCell className="text-xs font-mono text-orange">
                        {voyage.distance_nm ? `${formatNumber(voyage.distance_nm, 1)} NM` : '—'}
                      </TableCell>
                      <TableCell className="text-xs font-mono text-text-400">
                        {voyage.etd ? formatDateTime(voyage.etd) : '—'}
                      </TableCell>
                      <TableCell className="text-xs font-mono text-text-400">
                        {voyage.eta ? formatDateTime(voyage.eta) : '—'}
                      </TableCell>
                      <TableCell className="text-xs font-mono">
                        {voyage.fuel_consumption ? (
                          <span className="text-yellow-400">
                            {formatNumber(voyage.fuel_consumption, 1)} {voyage.fuel_unit}
                          </span>
                        ) : (
                          '—'
                        )}
                      </TableCell>
                      <TableCell>
                        {statusConfig && (
                          <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button size="xs" variant="ghost" icon={<Eye className="w-3 h-3" />} />
                          <Button
                            size="xs"
                            variant="ghost"
                            icon={<Edit className="w-3 h-3" />}
                            onClick={() => handleOpenModal(voyage)}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Add/Edit Voyage Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedVoyage ? 'Edit Voyage' : 'Buat Voyage Baru'}
        size="lg"
      >
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="No. Voyage"
            placeholder="V2025-041"
            value={formData.voyage_number}
            onChange={(e) => setFormData({ ...formData, voyage_number: e.target.value })}
            required
          />
          <Select
            label="Nama Kapal"
            value={formData.vessel_id}
            onChange={(e) => setFormData({ ...formData, vessel_id: e.target.value })}
            required
            options={[
              { value: '', label: 'Pilih Kapal...' },
              ...vessels.map((v: any) => ({ value: v.id, label: v.name })),
            ]}
          />
          <Input
            label="Pelabuhan Asal"
            placeholder="Samarinda"
            value={formData.port_from}
            onChange={(e) => setFormData({ ...formData, port_from: e.target.value })}
            required
          />
          <Input
            label="Pelabuhan Tujuan"
            placeholder="Surabaya"
            value={formData.port_to}
            onChange={(e) => setFormData({ ...formData, port_to: e.target.value })}
            required
          />
          <div className="col-span-2">
            <Input
              label="Jenis Muatan"
              placeholder="Alat Berat & Material Konstruksi"
              value={formData.cargo_type}
              onChange={(e) => setFormData({ ...formData, cargo_type: e.target.value })}
            />
          </div>
          <Input
            label="Kuantitas Muatan"
            placeholder="1.200 MT"
            value={formData.cargo_quantity}
            onChange={(e) => setFormData({ ...formData, cargo_quantity: e.target.value })}
          />
          <Input
            label="Jarak (Nautical Miles)"
            type="number"
            step="0.1"
            placeholder="485.5"
            value={formData.distance_nm}
            onChange={(e) => setFormData({ ...formData, distance_nm: e.target.value })}
          />
          <Input
            label="ETD (Estimated Time of Departure)"
            type="datetime-local"
            value={formData.etd}
            onChange={(e) => setFormData({ ...formData, etd: e.target.value })}
          />
          <Input
            label="ETA (Estimated Time of Arrival)"
            type="datetime-local"
            value={formData.eta}
            onChange={(e) => setFormData({ ...formData, eta: e.target.value })}
          />
          <Input
            label="Konsumsi Bahan Bakar"
            type="number"
            step="0.1"
            placeholder="38.5"
            value={formData.fuel_consumption}
            onChange={(e) => setFormData({ ...formData, fuel_consumption: e.target.value })}
          />
          <Select
            label="Satuan Bahan Bakar"
            value={formData.fuel_unit}
            onChange={(e) => setFormData({ ...formData, fuel_unit: e.target.value })}
            options={[
              { value: 'MT', label: 'Metric Ton (MT)' },
              { value: 'Liter', label: 'Liter' },
            ]}
          />
          <Select
            label="Status Voyage"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={[
              { value: 'planned', label: 'Direncanakan' },
              { value: 'active', label: 'Sedang Berlayar' },
              { value: 'port', label: 'Di Pelabuhan' },
              { value: 'completed', label: 'Selesai' },
            ]}
          />
          <div className="col-span-2">
            <Textarea
              label="Catatan"
              placeholder="Informasi tambahan tentang voyage ini..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
            />
          </div>
        </div>

        <ModalActions>
          <Button variant="ghost" onClick={() => setShowModal(false)}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {selectedVoyage ? 'Update' : 'Simpan'}
          </Button>
        </ModalActions>
      </Modal>
    </MainLayout>
  );
}
