# ⚓ LAS Fleet Monitoring System v2.0

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.1-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)

**Sistem Manajemen Armada Modern & Modular**  
PT. Pelayaran Lestari Abadi Serasi — Shipping Lines

[Live Demo](#) | [Documentation](#) | [Support](mailto:ahmadmabrur.lasshipping@gmail.com)

</div>

---

## 📋 Deskripsi

**LAS Fleet Monitoring System v2.0** adalah aplikasi web modern berbasis Next.js dengan database Supabase untuk manajemen operasional armada kapal PT. Pelayaran Lestari Abadi Serasi. 

### ✨ Fitur Utama v2.0

- ⚡ **Modular Component Architecture** — Sidebar, Topbar, dan Layout reusable di semua halaman
- 🗄️ **Database Online** — Supabase PostgreSQL dengan real-time sync
- 🔐 **Role-Based Authentication** — Admin, Crewing Manager, Operator
- 📤 **File Upload** — Upload dokumen kapal & sertifikat kru ke Supabase Storage
- 🚢 **Enhanced Voyage Tracking** — Kolom lengkap: No, Kapal, Route, Muatan, Jarak (NM), ETD, ETA, Fuel Consumption
- 🏗️ **Updated Vessel Status** — Beroperasi, Docking, Building Process
- 🎨 **Glassmorphism Design** — Navy blue & neon theme tetap dipertahankan
- 🚀 **CI/CD Ready** — GitHub Actions + Vercel/Docker deployment

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18.0.0
- **npm** ≥ 9.0.0
- **Supabase Account** (gratis di [supabase.com](https://supabase.com))
- **Git**

### 1. Clone Repository

```bash
git clone https://github.com/your-org/las-fleet-monitoring.git
cd las-fleet-monitoring
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Supabase

#### a. Buat Project Baru di Supabase

1. Buka https://app.supabase.com
2. Klik **New Project**
3. Pilih Organization
4. Isi detail project:
   - **Name**: LAS Fleet Monitoring
   - **Database Password**: (simpan dengan aman)
   - **Region**: Southeast Asia (Singapore)
5. Tunggu hingga project selesai dibuat (~2 menit)

#### b. Jalankan Migrations

1. Buka **SQL Editor** di dashboard Supabase
2. Copy isi file `supabase/migrations/001_initial_schema.sql`
3. Paste ke SQL Editor dan klik **RUN**
4. Ulangi untuk `supabase/migrations/002_seed_data.sql`

#### c. Setup Storage Bucket

1. Buka **Storage** di sidebar Supabase
2. Klik **New Bucket**
3. Name: `las-documents`
4. Public: **Enabled**
5. Klik **Create Bucket**

#### d. Setup Authentication

1. Buka **Authentication** > **Providers**
2. Enable **Email** provider
3. Buka **URL Configuration**
4. Site URL: `http://localhost:3000` (development)
5. Redirect URLs: `http://localhost:3000/**`

#### e. Create Initial Users

Buka **Authentication** > **Users** > **Add User**, tambahkan:

| Email | Password | Metadata (JSON) |
|-------|----------|-----------------|
| `ahmadmabrur.lasshipping@gmail.com` | `Adminoperation77` | `{"name": "Ahmad Mabrur", "role": "Admin"}` |
| `rudi@lasshipping.co.id` | `Rudi1234` | `{"name": "Rudi Hartono", "role": "Crewing Manager"}` |
| `dewi@lasshipping.co.id` | `Dewi1234` | `{"name": "Dewi Sartika", "role": "Operator"}` |

### 4. Environment Variables

Copy `.env.example` ke `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` dan isi dengan credentials dari Supabase:

```env
# Dapatkan dari Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_STORAGE_BUCKET=las-documents
```

### 5. Run Development Server

```bash
npm run dev
```

Buka browser ke **http://localhost:3000**

### 6. Login

Gunakan salah satu akun yang sudah dibuat di step 3.e:
- Email: `ahmadmabrur.lasshipping@gmail.com`
- Password: `Adminoperation77`

---

## 🏗️ Project Structure

```
las-fleet-monitoring/
├── public/                  # Static assets
│   └── assets/             # Images, icons
├── src/
│   ├── components/         # React components
│   │   ├── layout/        # Layout components (Sidebar, Topbar, MainLayout)
│   │   ├── ui/            # UI components (Button, Card, Modal, etc.)
│   │   └── features/      # Feature-specific components
│   ├── pages/             # Next.js pages (routes)
│   │   ├── _app.tsx      # Global app wrapper
│   │   ├── index.tsx     # Landing page
│   │   ├── login.tsx     # Login page
│   │   ├── dashboard.tsx # Dashboard
│   │   ├── fleet/        # Fleet management pages
│   │   ├── crew/         # Crew management pages
│   │   ├── roster/       # Crew roster schedule (fixed: Kanban → Roster)
│   │   └── ...           # Other pages
│   ├── lib/               # Utilities & configurations
│   │   ├── supabase.ts   # Supabase client
│   │   └── utils.ts      # Helper functions
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript types
│   │   └── supabase.ts   # Generated Supabase types
│   └── styles/            # Global styles
│       └── globals.css   # Tailwind CSS
├── supabase/
│   └── migrations/        # Database migrations
│       ├── 001_initial_schema.sql
│       └── 002_seed_data.sql
├── .github/
│   └── workflows/         # GitHub Actions CI/CD
│       └── ci-cd.yml
├── Dockerfile             # Docker containerization
├── docker-compose.yml     # Docker compose for local dev
├── package.json           # Dependencies
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

---

## 📦 Key Features Detail

### 1. **Modular Component System**

Semua halaman menggunakan komponen layout yang sama:

```tsx
// src/pages/dashboard.tsx
import MainLayout from '@/components/layout/MainLayout';

export default function Dashboard() {
  return (
    <MainLayout>
      {/* Your page content */}
    </MainLayout>
  );
}
```

**Keuntungan:**
- Perubahan Sidebar/Topbar otomatis teraplikasi di semua halaman
- Konsistensi UI/UX
- Mudah maintenance

### 2. **Enhanced Voyage Tracking**

Kolom baru yang ditambahkan:

| Kolom | Tipe Data | Keterangan |
|-------|-----------|------------|
| `distance_nm` | NUMERIC(8,2) | Jarak dalam Nautical Miles |
| `etd` | TIMESTAMPTZ | Estimated Time of Departure |
| `eta` | TIMESTAMPTZ | Estimated Time of Arrival |
| `fuel_consumption` | NUMERIC(10,2) | Konsumsi bahan bakar (MT/Liter) |
| `fuel_unit` | VARCHAR(20) | Satuan (MT/Liter) |

### 3. **Vessel Status Update**

Status kapal yang tersedia (corrected from operational/route/drydock):

- ✅ **Beroperasi** (operational) — Kapal sedang beroperasi normal
- 🔧 **Docking** — Kapal sedang dalam proses docking/maintenance
- 🏗️ **Building Process** — Kapal dalam tahap pembangunan

### 4. **File Upload System**

```tsx
// Upload dokumen
import { uploadFile, getFileUrl } from '@/lib/supabase';

const handleUpload = async (file: File) => {
  const path = `documents/${Date.now()}_${file.name}`;
  const { data, error } = await uploadFile('las-documents', path, file);
  
  if (!error) {
    const url = getFileUrl('las-documents', path);
    // Save url to database
  }
};
```

### 5. **Roster Management** (Fixed from "Kanban")

Nama yang dikoreksi:
- ❌ ~~"Papan Kanban Rotasi"~~
- ✅ **"Papan Roster Kru"** atau **"Crew Roster Schedule"**

Status roster:
- Cuti
- Direncanakan
- En Route (Dalam Perjalanan)
- Di Kapal (Onboard)

---

## 🚢 Database Schema

### Tabel Utama

1. **vessels** — Data kapal
2. **crew** — Data kru
3. **documents** — Dokumen & sertifikat kapal
4. **rotations** — Jadwal roster kru
5. **mlc_logs** — Log jam kerja MLC 2006
6. **incidents** — Laporan insiden
7. **voyages** — Tracking voyage (enhanced dengan jarak, ETD, ETA, fuel)
8. **users** — User authentication & roles

Lihat detail lengkap di `supabase/migrations/001_initial_schema.sql`

---

## 🔐 Role-Based Access Control

| Role | Permissions |
|------|-------------|
| **Admin** | Full access — semua CRUD operations |
| **Crewing Manager** | Manage crew, rotations, MLC logs |
| **Operator** | View data, input voyages, report incidents |

RLS (Row Level Security) sudah dikonfigurasi di Supabase.

---

## 🚀 Deployment

### Option 1: Vercel (Recommended)

1. Push code ke GitHub
2. Buka https://vercel.com/new
3. Import repository
4. Tambahkan Environment Variables (dari `.env.local`)
5. Deploy

**Auto-deployment** via GitHub Actions sudah dikonfigurasi di `.github/workflows/ci-cd.yml`

### Option 2: Docker

```bash
# Build image
docker build -t las-fleet-monitoring .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your-url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key \
  las-fleet-monitoring
```

Atau gunakan Docker Compose:

```bash
docker-compose up -d
```

### Option 3: VPS/Server (Manual)

```bash
# Build production
npm run build

# Start server
npm start
```

---

## 🔧 Development

### Generate TypeScript Types dari Supabase

```bash
npm run db:generate
```

### Run Type Checking

```bash
npm run type-check
```

### Run Linting

```bash
npm run lint
```

---

## 📊 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 + React 18 + TypeScript |
| **Styling** | Tailwind CSS 3.4 + Custom Glassmorphism |
| **Database** | Supabase (PostgreSQL 15) |
| **Authentication** | Supabase Auth (JWT) |
| **File Storage** | Supabase Storage |
| **Charts** | Chart.js 4.4 + react-chartjs-2 |
| **Forms** | React Hook Form + Zod validation |
| **Icons** | Lucide React |
| **Deployment** | Vercel / Docker |
| **CI/CD** | GitHub Actions |

---

## 🏢 Company Information

| | |
|---|---|
| **Perusahaan** | PT. Pelayaran Lestari Abadi Serasi |
| **Website** | www.lasshipping.co.id |
| **Kantor Pusat** | Rukan Artha Gading Niaga H18, Kelapa Gading Barat, Jakarta Utara 14240 |
| **Telp / Fax** | 021-45850929 / 021-45850930 |
| **Email** | ahmadmabrur.lasshipping@gmail.com |

**Cabang:**
- **Surabaya** — Puskopal Armatim Lt. 2, Jl. Ikan Dorang No. 1 · (031) 3536068
- **Balikpapan** — Jl. MT Haryono Blok D6/10 · (0542) 875490
- **Makassar** — Komplek Bumi Tirta Paotere Blok A No. 4 · (0411) 8945038

---

## 📝 Changelog v2.0

### ✨ New Features
- Modular component architecture (reusable Layout, Sidebar, Topbar)
- Supabase database integration dengan real-time sync
- File upload untuk dokumen kapal & sertifikat kru
- Enhanced voyage tracking (distance, ETD, ETA, fuel consumption)
- Updated vessel status (Beroperasi, Docking, Building Process)

### 🐛 Bug Fixes
- Fixed typo: "Kanban" → "Roster" di semua halaman
- Corrected vessel status terminology
- Fixed reactive data binding across pages

### 🔧 Technical Improvements
- TypeScript strict mode
- ESLint + Prettier configuration
- Docker containerization
- CI/CD pipeline (GitHub Actions)
- Environment-based configuration
- RLS security policies

---

## 🤝 Contributing

Untuk internal development tim LAS Shipping:

1. Create feature branch dari `develop`
2. Commit dengan pesan deskriptif
3. Create Pull Request ke `develop`
4. Request review dari tech lead
5. Merge setelah approved

---

## 📄 License

**Proprietary** — © 2024 PT. Pelayaran Lestari Abadi Serasi  
Internal use only. All rights reserved.

---

## 🆘 Support

Jika ada pertanyaan atau issue:

1. Check dokumentasi di `/docs`
2. Hubungi IT Support: it@lasshipping.co.id
3. Contact PIC: Ahmad Mabrur (ahmadmabrur.lasshipping@gmail.com)

---

<div align="center">

**Built with ❤️ for PT. Pelayaran Lestari Abadi Serasi**

⚓ *"Keselamatan adalah prioritas utama dalam setiap pelayaran"* ⚓

</div>
