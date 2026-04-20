import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ExpiryBadge } from '@/components/ui/Badge';
import Modal, { ModalActions } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmpty } from '@/components/ui/Table';
import { useDocuments, useVessels, useFileUpload } from '@/hooks/useSupabase';
import { FileText, Plus, Upload, Download, Trash2, AlertTriangle } from 'lucide-react';
import { formatDate, daysUntil } from '@/lib/utils';
import toast from 'react-hot-toast';

const documentTypes = [
  'ISM Certificate',
  'ISPS Certificate',
  'Certificate of Registry',
  'Safety Equipment Certificate',
  'Certificate of Classification',
  'Load Line Certificate',
  'MARPOL Certificate',
  'Document of Compliance (DOC)',
  'Ship Security Certificate (SSC)',
  'Radio License',
  'Crew List',
  'MLCMARITIME LABOUR CERTIFICATE',
];

export default function DocumentsPage() {
  const { data: documents, loading, refetch } = useDocuments();
  const { data: vessels } = useVessels();
  const { upload, uploading, progress } = useFileUpload();
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    vessel_id: '',
    type: '',
    name: '',
    issue_date: '',
    expiry_date: '',
    issuer: '',
    notes: '',
  });

  // Documents expiring soon (within 60 days)
  const expiringSoon = documents.filter((doc: any) => {
    if (!doc.expiry_date) return false;
    const days = daysUntil(doc.expiry_date);
    return days >= 0 && days < 60;
  });

  // Expired documents
  const expired = documents.filter((doc: any) => {
    if (!doc.expiry_date) return false;
    return daysUntil(doc.expiry_date) < 0;
  });

  const getVesselName = (vesselId: string | null) => {
    if (!vesselId) return 'Umum';
    const vessel = vessels.find((v: any) => v.id === vesselId);
    return vessel?.name || '—';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    try {
      let fileUrl = '';
      if (selectedFile) {
        const path = `documents/${Date.now()}_${selectedFile.name}`;
        fileUrl = await upload(selectedFile, path);
      }

      toast.success('Dokumen berhasil ditambahkan');
      setShowModal(false);
      refetch();
    } catch (error) {
      console.error('Error saving document:', error);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-neon/30 border-t-neon rounded-full animate-spin mx-auto mb-4" />
            <p className="text-text-400">Memuat data dokumen...</p>
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
            <h1 className="text-2xl font-extrabold mb-1">Dokumen Kapal</h1>
            <p className="text-sm text-text-400">
              Monitoring Sertifikat & Izin Resmi Armada
            </p>
          </div>
          <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setShowModal(true)}>
            Upload Dokumen
          </Button>
        </div>

        {/* Alerts */}
        {expired.length > 0 && (
          <div className="alert alert-danger">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <div>
              <strong>DOKUMEN KADALUARSA:</strong> {expired.length} dokumen sudah melewati masa berlaku.
              Segera perpanjang untuk menghindari pelanggaran regulasi.
            </div>
          </div>
        )}

        {expiringSoon.length > 0 && (
          <div className="alert alert-warning">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <div>
              <strong>DOKUMEN SEGERA KADALUARSA:</strong> {expiringSoon.length} dokumen akan kadaluarsa
              dalam 60 hari ke depan. Rencanakan perpanjangan sekarang.
            </div>
          </div>
        )}

        {/* Document Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Card variant="sm" className="p-3">
            <div className="text-[10px] text-text-400 font-bold uppercase tracking-wider mb-1">
              Total Dokumen
            </div>
            <div className="text-2xl font-extrabold text-neon font-mono">
              {documents.length}
            </div>
          </Card>
          <Card variant="sm" className="p-3 border-l-2 border-green-500/30">
            <div className="text-[10px] text-text-400 font-bold uppercase tracking-wider mb-1">
              Valid ✓
            </div>
            <div className="text-2xl font-extrabold text-green-400 font-mono">
              {documents.length - expired.length - expiringSoon.length}
            </div>
          </Card>
          <Card variant="sm" className="p-3 border-l-2 border-yellow-500/30">
            <div className="text-[10px] text-text-400 font-bold uppercase tracking-wider mb-1">
              Segera Kadaluarsa
            </div>
            <div className="text-2xl font-extrabold text-yellow-400 font-mono">
              {expiringSoon.length}
            </div>
          </Card>
          <Card variant="sm" className="p-3 border-l-2 border-red-500/30">
            <div className="text-[10px] text-text-400 font-bold uppercase tracking-wider mb-1">
              Kadaluarsa ⚠
            </div>
            <div className="text-2xl font-extrabold text-red-400 font-mono">
              {expired.length}
            </div>
          </Card>
        </div>

        {/* Documents Table */}
        <Card title="Daftar Dokumen" subtitle={`${documents.length} sertifikat & izin terdaftar`}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipe Dokumen</TableHead>
                <TableHead>Nama Dokumen</TableHead>
                <TableHead>Kapal</TableHead>
                <TableHead>Penerbit</TableHead>
                <TableHead>Tanggal Terbit</TableHead>
                <TableHead>Tanggal Kadaluarsa</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>File</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.length === 0 ? (
                <TableEmpty message="Belum ada dokumen terupload" />
              ) : (
                documents.map((doc: any) => (
                  <TableRow key={doc.id}>
                    <TableCell className="text-xs font-semibold text-neon">
                      {doc.type}
                    </TableCell>
                    <TableCell className="text-xs">
                      {doc.name}
                    </TableCell>
                    <TableCell className="text-xs text-text-400">
                      {getVesselName(doc.vessel_id)}
                    </TableCell>
                    <TableCell className="text-xs text-text-400">
                      {doc.issuer || '—'}
                    </TableCell>
                    <TableCell className="text-xs font-mono">
                      {formatDate(doc.issue_date)}
                    </TableCell>
                    <TableCell className="text-xs font-mono">
                      {formatDate(doc.expiry_date)}
                    </TableCell>
                    <TableCell>
                      <ExpiryBadge expiryDate={doc.expiry_date} />
                    </TableCell>
                    <TableCell>
                      {doc.file_url ? (
                        <Button
                          size="xs"
                          variant="ghost"
                          icon={<Download className="w-3 h-3" />}
                          onClick={() => window.open(doc.file_url, '_blank')}
                        >
                          Download
                        </Button>
                      ) : (
                        <span className="text-xs text-text-600">No file</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
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

      {/* Upload Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Upload Dokumen Baru"
        size="md"
      >
        <div className="space-y-4">
          <Select
            label="Kapal"
            value={formData.vessel_id}
            onChange={(e) => setFormData({ ...formData, vessel_id: e.target.value })}
            options={[
              { value: '', label: 'Dokumen Umum (Semua Kapal)' },
              ...vessels.map((v: any) => ({ value: v.id, label: v.name })),
            ]}
          />
          <Select
            label="Tipe Dokumen"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            required
            options={[
              { value: '', label: 'Pilih Tipe...' },
              ...documentTypes.map((type) => ({ value: type, label: type })),
            ]}
          />
          <Input
            label="Nama Dokumen"
            placeholder="Safety Management Certificate"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Penerbit"
            placeholder="BKI / Det Norske Veritas"
            value={formData.issuer}
            onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Tanggal Terbit"
              type="date"
              value={formData.issue_date}
              onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
            />
            <Input
              label="Tanggal Kadaluarsa"
              type="date"
              value={formData.expiry_date}
              onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold tracking-wider uppercase text-text-400 mb-2">
              Upload File (PDF, JPG, PNG)
            </label>
            <div className="relative">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="input file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-neon/10 file:text-neon hover:file:bg-neon/20"
              />
            </div>
            {selectedFile && (
              <p className="text-xs text-green-400 mt-2">
                ✓ {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
              </p>
            )}
            {uploading && (
              <div className="mt-2">
                <div className="progress">
                  <div className="progress-bar progress-bar-blue" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-xs text-neon text-center mt-1">{progress}%</p>
              </div>
            )}
          </div>
        </div>

        <ModalActions>
          <Button variant="ghost" onClick={() => setShowModal(false)} disabled={uploading}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleSave} loading={uploading}>
            Upload & Simpan
          </Button>
        </ModalActions>
      </Modal>
    </MainLayout>
  );
}
