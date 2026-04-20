import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { VesselStatusBadge } from '@/components/ui/Badge';
import Modal, { ModalActions } from '@/components/ui/Modal';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmpty } from '@/components/ui/Table';
import { useVessels } from '@/hooks/useSupabase';
import { Ship, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function FleetPage() {
  const { data: vessels, loading, refetch } = useVessels();
  const [showModal, setShowModal] = useState(false);
  const [selectedVessel, setSelectedVessel] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'LCT',
    gt: '',
    dwt: '',
    loa: '',
    breadth: '',
    depth: '',
    draft: '',
    year_built: '',
    status: 'operational',
    crew_count: '13',
    location: '',
    engine: '',
    notes: '',
  });

  const handleOpenModal = (vessel?: any) => {
    if (vessel) {
      setSelectedVessel(vessel);
      setFormData(vessel);
    } else {
      setSelectedVessel(null);
      setFormData({
        name: '',
        type: 'LCT',
        gt: '',
        dwt: '',
        loa: '',
        breadth: '',
        depth: '',
        draft: '',
        year_built: '',
        status: 'operational',
        crew_count: '13',
        location: '',
        engine: '',
        notes: '',
      });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    toast.success(selectedVessel ? 'Kapal berhasil diupdate' : 'Kapal berhasil ditambahkan');
    setShowModal(false);
    refetch();
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-neon/30 border-t-neon rounded-full animate-spin mx-auto mb-4" />
            <p className="text-text-400">Memuat data armada...</p>
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
            <h1 className="text-2xl font-extrabold mb-1">Armada Kapal</h1>
            <p className="text-sm text-text-400">
              CRUD Data Kapal — Unit LCT Terdaftar
            </p>
          </div>
          <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => handleOpenModal()}>
            Tambah Kapal
          </Button>
        </div>

        {/* Fleet Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Card variant="sm" className="p-3">
            <div className="text-[10px] text-text-400 font-bold uppercase tracking-wider mb-1">
              Total Armada
            </div>
            <div className="text-2xl font-extrabold text-neon font-mono">
              {vessels.length}
            </div>
          </Card>
          <Card variant="sm" className="p-3">
            <div className="text-[10px] text-text-400 font-bold uppercase tracking-wider mb-1">
              Beroperasi
            </div>
            <div className="text-2xl font-extrabold text-green-400 font-mono">
              {vessels.filter((v: any) => v.status === 'operational').length}
            </div>
          </Card>
          <Card variant="sm" className="p-3">
            <div className="text-[10px] text-text-400 font-bold uppercase tracking-wider mb-1">
              Docking
            </div>
            <div className="text-2xl font-extrabold text-yellow-400 font-mono">
              {vessels.filter((v: any) => v.status === 'docking').length}
            </div>
          </Card>
          <Card variant="sm" className="p-3">
            <div className="text-[10px] text-text-400 font-bold uppercase tracking-wider mb-1">
              Total GT
            </div>
            <div className="text-2xl font-extrabold text-blue-400 font-mono">
              {formatNumber(vessels.reduce((sum: number, v: any) => sum + (v.gt || 0), 0))}
            </div>
          </Card>
        </div>

        {/* Vessels Table */}
        <Card title="Daftar Kapal" subtitle={`${vessels.length} unit LCT terdaftar`}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Kapal</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>GT</TableHead>
                <TableHead>DWT</TableHead>
                <TableHead>LOA</TableHead>
                <TableHead>Tahun</TableHead>
                <TableHead>Kru</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vessels.length === 0 ? (
                <TableEmpty message="Belum ada data kapal" />
              ) : (
                vessels.map((vessel: any) => (
                  <TableRow key={vessel.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-cyan to-blue-600 flex items-center justify-center">
                          <Ship className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-xs">{vessel.name}</div>
                          <div className="text-[9px] text-text-400">{vessel.class}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">{vessel.type}</TableCell>
                    <TableCell className="text-xs font-mono">{formatNumber(vessel.gt)}T</TableCell>
                    <TableCell className="text-xs font-mono">{formatNumber(vessel.dwt)}T</TableCell>
                    <TableCell className="text-xs font-mono">{vessel.loa}m</TableCell>
                    <TableCell className="text-xs font-mono">{vessel.year_built}</TableCell>
                    <TableCell className="text-xs font-mono">
                      <span className={vessel.crew_count < 13 ? 'text-yellow-400' : 'text-green-400'}>
                        {vessel.crew_count}/13
                      </span>
                    </TableCell>
                    <TableCell>
                      <VesselStatusBadge status={vessel.status} />
                    </TableCell>
                    <TableCell className="text-xs text-text-400 max-w-[150px] truncate">
                      {vessel.location || '—'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button size="xs" variant="ghost" icon={<Eye className="w-3 h-3" />} />
                        <Button
                          size="xs"
                          variant="ghost"
                          icon={<Edit className="w-3 h-3" />}
                          onClick={() => handleOpenModal(vessel)}
                        />
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
        title={selectedVessel ? 'Edit Data Kapal' : 'Tambah Kapal Baru'}
        size="lg"
      >
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Nama Kapal"
            placeholder="LCT. DEWA SAMUDERA ABADI"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Tipe"
            placeholder="LCT"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          />
          <Input
            label="GT (Gross Tonnage)"
            type="number"
            placeholder="707"
            value={formData.gt}
            onChange={(e) => setFormData({ ...formData, gt: e.target.value })}
          />
          <Input
            label="DWT (Dead Weight Tonnage)"
            type="number"
            placeholder="1200"
            value={formData.dwt}
            onChange={(e) => setFormData({ ...formData, dwt: e.target.value })}
          />
          <Input
            label="LOA (Length Overall) - m"
            type="number"
            step="0.01"
            placeholder="59.61"
            value={formData.loa}
            onChange={(e) => setFormData({ ...formData, loa: e.target.value })}
          />
          <Input
            label="Breadth (Lebar) - m"
            type="number"
            step="0.01"
            placeholder="12.20"
            value={formData.breadth}
            onChange={(e) => setFormData({ ...formData, breadth: e.target.value })}
          />
          <Input
            label="Depth (Dalam) - m"
            type="number"
            step="0.01"
            placeholder="4.00"
            value={formData.depth}
            onChange={(e) => setFormData({ ...formData, depth: e.target.value })}
          />
          <Input
            label="Draft (Sarat) - m"
            type="number"
            step="0.01"
            placeholder="3.00"
            value={formData.draft}
            onChange={(e) => setFormData({ ...formData, draft: e.target.value })}
          />
          <Input
            label="Tahun Pembangunan"
            type="number"
            placeholder="2014"
            value={formData.year_built}
            onChange={(e) => setFormData({ ...formData, year_built: e.target.value })}
          />
          <Select
            label="Status Kapal"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={[
              { value: 'operational', label: 'Beroperasi' },
              { value: 'docking', label: 'Docking' },
              { value: 'building', label: 'Building Process' },
            ]}
          />
          <Input
            label="Jumlah Kru"
            type="number"
            placeholder="13"
            value={formData.crew_count}
            onChange={(e) => setFormData({ ...formData, crew_count: e.target.value })}
          />
          <Input
            label="Lokasi Terakhir"
            placeholder="Selat Makassar"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
          <div className="col-span-2">
            <Textarea
              label="Spesifikasi Mesin"
              placeholder="2x Yanmar Marine Diesel 6AYM-WTE 500kW"
              value={formData.engine}
              onChange={(e) => setFormData({ ...formData, engine: e.target.value })}
              rows={2}
            />
          </div>
          <div className="col-span-2">
            <Textarea
              label="Catatan"
              placeholder="Rampdoor: 9.00×7.50m | Aux: 1x Yuchai 53kW"
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
            {selectedVessel ? 'Update' : 'Simpan'}
          </Button>
        </ModalActions>
      </Modal>
    </MainLayout>
  );
}
