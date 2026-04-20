import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Settings, Building2, Bell, Shield, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [companyData, setCompanyData] = useState({
    name: 'PT. Pelayaran Lestari Abadi Serasi',
    email: 'ahmadmabrur.lasshipping@gmail.com',
    phone: '021-45850929',
    fax: '021-45850930',
    address: 'Rukan Artha Gading Niaga H18, Kelapa Gading Barat, Jakarta Utara 14240',
    website: 'www.lasshipping.co.id',
    pic_name: 'Ahmad Mabrur',
  });

  const handleSave = () => {
    toast.success('Pengaturan berhasil disimpan');
  };

  return (
    <MainLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-extrabold mb-1">Pengaturan Sistem</h1>
          <p className="text-sm text-text-400">Konfigurasi Perusahaan & Notifikasi</p>
        </div>

        {/* Company Profile */}
        <Card title="Profil Perusahaan" className="p-5">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neon-cyan to-blue-600 flex items-center justify-center flex-shrink-0 shadow-glow">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <Button size="sm" variant="ghost" icon={<Settings className="w-3 h-3" />}>
                Upload Logo
              </Button>
              <p className="text-xs text-text-400 mt-2">
                PNG, JPG atau SVG. Maksimal 2MB. Resolusi minimum 512×512px.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nama Perusahaan"
              value={companyData.name}
              onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              value={companyData.email}
              onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
            />
            <Input
              label="Telepon"
              value={companyData.phone}
              onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
            />
            <Input
              label="Fax"
              value={companyData.fax}
              onChange={(e) => setCompanyData({ ...companyData, fax: e.target.value })}
            />
            <Input
              label="Website"
              value={companyData.website}
              onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
            />
            <Input
              label="PIC"
              value={companyData.pic_name}
              onChange={(e) => setCompanyData({ ...companyData, pic_name: e.target.value })}
            />
            <div className="col-span-2">
              <Textarea
                label="Alamat Kantor Pusat"
                value={companyData.address}
                onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                rows={2}
              />
            </div>
          </div>

          <div className="flex justify-end mt-5 pt-4 border-t border-glass-border2">
            <Button variant="primary" onClick={handleSave}>
              Simpan Perubahan
            </Button>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card title="Pengaturan Notifikasi" className="p-5">
          <div className="space-y-4">
            {[
              { label: 'Dokumen akan kadaluarsa (30 hari sebelumnya)', checked: true },
              { label: 'Pelanggaran MLC jam kerja terdeteksi', checked: true },
              { label: 'Insiden baru dilaporkan', checked: true },
              { label: 'Vessel docking selesai', checked: false },
              { label: 'Rotasi kru akan berakhir (7 hari sebelumnya)', checked: true },
              { label: 'Voyage baru dibuat', checked: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 glass-card-sm">
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-neon" />
                  <span className="text-sm">{item.label}</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked={item.checked} />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon"></div>
                </label>
              </div>
            ))}
          </div>
        </Card>

        {/* User Profile */}
        <Card title="Profil Pengguna" className="p-5">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-16 h-16 rounded-xl bg-blue-500 flex items-center justify-center text-white font-bold text-xl">
              AM
            </div>
            <div>
              <h3 className="font-bold text-sm">Ahmad Mabrur</h3>
              <p className="text-xs text-text-400">ahmadmabrur.lasshipping@gmail.com</p>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-neon/10 text-neon border border-neon/20 mt-1">
                Admin
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Nama Lengkap" placeholder="Ahmad Mabrur" />
            <Input label="Email" type="email" placeholder="ahmadmabrur.lasshipping@gmail.com" />
            <Input label="Password Baru" type="password" placeholder="••••••••" />
            <Input label="Konfirmasi Password" type="password" placeholder="••••••••" />
          </div>

          <div className="flex justify-end mt-5 pt-4 border-t border-glass-border2">
            <Button variant="primary">
              Update Profil
            </Button>
          </div>
        </Card>

        {/* Security */}
        <Card title="Keamanan & Akses" className="p-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 glass-card-sm">
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-green-400" />
                <div>
                  <div className="text-sm font-semibold">Two-Factor Authentication</div>
                  <div className="text-xs text-text-400">Tingkatkan keamanan akun dengan 2FA</div>
                </div>
              </div>
              <Button size="sm" variant="ghost">
                Aktifkan
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 glass-card-sm">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-cyan-400" />
                <div>
                  <div className="text-sm font-semibold">Manajemen User</div>
                  <div className="text-xs text-text-400">Kelola akses user lain dalam sistem</div>
                </div>
              </div>
              <Button size="sm" variant="ghost">
                Kelola
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 glass-card-sm">
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4 text-orange" />
                <div>
                  <div className="text-sm font-semibold">Audit Log</div>
                  <div className="text-xs text-text-400">Lihat riwayat aktivitas sistem</div>
                </div>
              </div>
              <Button size="sm" variant="ghost">
                Lihat Log
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
