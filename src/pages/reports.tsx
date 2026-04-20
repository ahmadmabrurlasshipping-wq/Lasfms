import MainLayout from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { BarChart3, Download, Calendar, TrendingUp } from 'lucide-react';

export default function ReportsPage() {
  const reports = [
    { name: 'Laporan Operasional Bulanan', desc: 'Ringkasan voyage, fuel consumption, revenue', icon: BarChart3, color: 'text-neon' },
    { name: 'Analisa Biaya Operasional', desc: 'Breakdown cost per vessel & per voyage', icon: TrendingUp, color: 'text-green-400' },
    { name: 'Laporan Kepatuhan MLC', desc: 'Compliance report jam kerja & istirahat', icon: Calendar, color: 'text-yellow-400' },
    { name: 'Certificate Expiry Report', desc: 'Dokumen yang akan dan sudah kadaluarsa', icon: Calendar, color: 'text-red-400' },
    { name: 'Crew Manning Report', desc: 'Status manning level per vessel', icon: BarChart3, color: 'text-cyan-400' },
    { name: 'Incident & Near-Miss Report', desc: 'Safety statistics & trend analysis', icon: TrendingUp, color: 'text-orange' },
  ];

  return (
    <MainLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-extrabold mb-1">Laporan & Analitik</h1>
          <p className="text-sm text-text-400">Business Intelligence Armada</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {reports.map((report) => {
            const Icon = report.icon;
            return (
              <Card key={report.name} variant="sm" className="p-4 hover:border-neon/30 transition-all cursor-pointer">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-cyan/10 to-blue-500/10 flex items-center justify-center">
                    <Icon className={`w-5 h-5 ${report.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm mb-1">{report.name}</h3>
                    <p className="text-[10px] text-text-400">{report.desc}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="w-full" icon={<Download className="w-3 h-3" />}>
                  Generate PDF
                </Button>
              </Card>
            );
          })}
        </div>

        <Card title="Filter Laporan" subtitle="Customize periode dan parameter laporan">
          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase text-text-400 mb-2">Periode</label>
              <select className="input input-sm w-full">
                <option>Bulan Ini</option>
                <option>3 Bulan Terakhir</option>
                <option>6 Bulan Terakhir</option>
                <option>Tahun Ini</option>
                <option>Custom Range</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-text-400 mb-2">Kapal</label>
              <select className="input input-sm w-full">
                <option>Semua Kapal</option>
                <option>LCT. DEWA SAMUDERA ABADI</option>
                <option>LCT. LAS 2</option>
                <option>LCT. RADJA SAMUDERA ABADI</option>
                <option>CINTA SAMUDERA ABADI</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-text-400 mb-2">Format</label>
              <select className="input input-sm w-full">
                <option>PDF</option>
                <option>Excel (XLSX)</option>
                <option>CSV</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button variant="primary" className="w-full" size="sm">
                Generate
              </Button>
            </div>
          </div>
        </Card>

        <Card title="Dashboard Analytics" className="p-0">
          <div className="h-64 flex items-center justify-center text-text-600">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 mx-auto mb-3 opacity-20" />
              <p className="text-sm">Chart.js Visualization akan ditampilkan di sini</p>
              <p className="text-xs">Revenue, Fuel Consumption, Voyage Performance</p>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
