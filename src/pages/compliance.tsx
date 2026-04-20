import MainLayout from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Shield, CheckCircle, AlertCircle } from 'lucide-react';

export default function CompliancePage() {
  return (
    <MainLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-extrabold mb-1">Kepatuhan STCW & OCIMF</h1>
          <p className="text-sm text-text-400">Validasi Kompetensi & Matriks Perwira</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card variant="sm" className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <div className="text-[10px] text-text-400 font-bold uppercase">STCW Compliant</div>
                <div className="text-2xl font-extrabold text-green-400 font-mono">95%</div>
              </div>
            </div>
            <p className="text-xs text-text-400">Sertifikat kru sesuai STCW 2010 Manila Amendments</p>
          </Card>

          <Card variant="sm" className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <div className="text-[10px] text-text-400 font-bold uppercase">ISM Audit</div>
                <div className="text-2xl font-extrabold text-cyan-400 font-mono">A+</div>
              </div>
            </div>
            <p className="text-xs text-text-400">Terakhir audit: 15 Maret 2025 oleh BKI</p>
          </Card>

          <Card variant="sm" className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <div className="text-[10px] text-text-400 font-bold uppercase">NC/OBS Open</div>
                <div className="text-2xl font-extrabold text-yellow-400 font-mono">3</div>
              </div>
            </div>
            <p className="text-xs text-text-400">Non-conformity & Observations yang perlu ditindaklanjuti</p>
          </Card>
        </div>

        <Card title="Matriks Kompetensi Perwira" subtitle="Sertifikasi STCW Chapter II & III">
          <div className="space-y-4">
            {['Nakhoda', 'Mualim I', 'KKM', 'Masinis I'].map((rank) => (
              <div key={rank} className="flex items-center justify-between p-3 glass-card-sm">
                <div>
                  <div className="font-bold text-sm">{rank}</div>
                  <div className="text-xs text-text-400">CoC, GMDSS, Medical, BST, ARPA, ECDIS</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="badge badge-success">Valid ✓</span>
                  <span className="text-xs text-text-400 font-mono">4 orang</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Checklist TMSA/SIRE 2.0" subtitle="Tanker Management & Self Assessment">
          <div className="grid grid-cols-2 gap-3">
            {[
              'Safety Management System',
              'Crew Management & Training',
              'Navigation Safety',
              'Environmental Protection',
              'Cargo & Ballast Operations',
              'Ship Structural Integrity',
              'Mooring Operations',
              'Emergency Preparedness',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 p-2 glass-card-sm">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-xs">{item}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
