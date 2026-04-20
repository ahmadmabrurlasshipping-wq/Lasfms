# ⚓ LAS Fleet Monitoring System

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Status](https://img.shields.io/badge/status-production--ready-green)
![License](https://img.shields.io/badge/license-proprietary-orange)
![Lang](https://img.shields.io/badge/bahasa-Indonesia-red)

**Sistem Manajemen Armada Internal**  
PT. Pelayaran Lestari Abadi Serasi — Shipping Lines

</div>

-----

## 📋 Deskripsi

**LAS Fleet Monitoring System (LAS FMS)** adalah aplikasi web internal berbasis single-file HTML untuk manajemen operasional armada kapal PT. Pelayaran Lestari Abadi Serasi. Sistem ini mencakup manajemen kru, sertifikasi, dokumen kapal, voyage tracking, kepatuhan MLC 2006, dan pelaporan insiden.

-----

## 🚀 Cara Menjalankan

### Tanpa Server (Langsung Buka)

```
Buka file LAS_Fleet_Monitoring_System.html di browser
(Chrome / Edge / Firefox versi terbaru)
```

### Dengan Server Lokal (Opsional)

```bash
# Python 3
python -m http.server 8080

# Node.js
npx serve .

# Kemudian buka: http://localhost:8080/LAS_Fleet_Monitoring_System.html
```

> ⚠️ **Catatan:** Untuk fitur iframe live tracking (`citrack.com`) bekerja optimal, gunakan server lokal atau deploy ke hosting.

-----

## 🔐 Akun Login

|Email                              |Password          |Role           |
|-----------------------------------|------------------|---------------|
|`ahmadmabrur.lasshipping@gmail.com`|`Adminoperation77`|Admin          |
|`rudi@lasshipping.co.id`           |`Rudi1234`        |Crewing Manager|
|`dewi@lasshipping.co.id`           |`Dewi1234`        |Operator       |

-----

## 🚢 Data Armada (Seeded dari Ship Particular)

|Nama Kapal               |Jenis|GT     |DWT    |LOA    |Tahun|Status     |
|-------------------------|-----|-------|-------|-------|-----|-----------|
|LCT. DEWA SAMUDERA ABADI |LCT  |707 T  |1.200 T|59.61 m|2014 |Operasional|
|LCT. LAS 2               |LCT  |1.085 T|2.000 T|78.12 m|2015 |Berlayar   |
|LCT. RADJA SAMUDERA ABADI|LCT  |719 T  |1.200 T|59.85 m|2014 |Operasional|
|CINTA SAMUDERA ABADI     |LCT  |1.240 T|2.400 T|76.88 m|2021 |Naik Dok   |

Semua kapal terdaftar di **Samarinda**, kelas **BKI**, bendera **Indonesia**.

-----

## 📦 Modul & Fitur

### 1. 🏠 Dashboard

- KPI cards: Total kru, kapal aktif, dokumen kadaluarsa, pelanggaran MLC
- Fleet status cards real-time
- Alert & notifikasi aktif
- Activity timeline
- Chart performa armada (kru / dokumen / operasi)
- Peta posisi live via iframe `citrack.com`
- Distribusi status kru (donut chart)

### 2. 🚢 Armada Kapal

- **CRUD penuh**: Tambah, edit, hapus kapal
- Filter: Semua / Operasional / Dok / Berlayar
- Detail: GT, DWT, LOA, mesin, lokasi, kru
- Integrasi Live Tracking: <http://2g.citrack.com/track/index.php>

### 3. 👥 Manajemen Kru

- **CRUD penuh**: Tambah, edit, hapus data kru
- Field: nama, jabatan, kebangsaan, paspor, buku pelaut, kapal, status
- Sertifikasi: COC, medis, GMDSS beserta tanggal kadaluarsa
- Filter: Di Kapal / Cuti / Standby / Cuti Medis
- Search real-time nama / jabatan
- Badge status kadaluarsa otomatis (hijau/kuning/merah)

### 4. 🔄 Rotasi & Penjadwalan

- **Kanban Board**: Cuti → Direncanakan → En Route → Di Kapal
- Jadwal Sign-ON / Sign-OFF
- **Gap Analysis otomatis**: peringatan jika kru < 13 per kapal
- Tabel jadwal rotasi mendatang

### 5. ⏱️ Jam Kerja MLC 2006

- Input jam kerja harian per kru
- **Deteksi pelanggaran otomatis**: istirahat < 10j atau kerja > 14j
- Grid visual 7 hari (biru=kerja, hijau=istirahat, merah=pelanggaran)
- Statistik kepatuhan armada
- Email otomatis ke PIC saat pelanggaran terdeteksi

> 📌 **Referensi regulasi:** MLC 2006 Standard A2.3.5 & STCW Chapter VIII

### 6. 📋 Dokumen Kapal

- **CRUD penuh**: Upload, edit, hapus dokumen
- Jenis: ISM, ISPS, Registrasi, Kelas BKI, Load Line, MARPOL, dll.
- Tracking kadaluarsa dengan sisa hari
- Alert urgent (<30 hari) tampil otomatis di atas halaman
- Filter per kapal & per jenis dokumen
- **Email alert** ke `ahmadmabrur.lasshipping@gmail.com`
- Tombol kirim alert manual per dokumen
- Export Excel

### 7. ⚙️ Operasi Kapal

- Status operasional per kapal (berlayar / di pelabuhan / dok)
- **Voyage CRUD**: Input dan kelola data perjalanan
- Field voyage: nomor, rute, muatan, ETA, status
- Progress bar per voyage
- Live tracking iframe terintegrasi
- Log voyage history

### 8. ⚠️ Insiden & Laporan

- Input laporan insiden / near-miss
- Jenis: Near Miss, Kecelakaan, Kebakaran, Tumpahan, dll.
- Tingkat keparahan: Rendah / Sedang / Tinggi / Kritis
- Status investigasi: Investigasi / Ditutup
- Notifikasi otomatis ke DPA & email PIC
- Zero Accident Days counter
- Upload bukti foto (placeholder siap integrasi storage)

### 9. ✅ Kepatuhan STCW & OCIMF

- Validasi sertifikasi per jabatan (COC, BST, GMDSS, ECDIS, Medis)
- Matriks regulasi STCW (II/1, II/2, III/1, III/2)
- Skor kepatuhan per kapal (bar chart horizontal)
- Persentase kepatuhan armada keseluruhan

### 10. 📊 Laporan & Analitik

- Chart rotasi 12 bulan (Sign-ON vs Sign-OFF)
- Distribusi jabatan kru (donut chart)
- Tren kepatuhan dokumen 7 bulan
- Ringkasan status per kapal
- **Export PDF** & **Export Excel** (siap integrasi backend)

### 11. ⚙️ Pengaturan

- Profil perusahaan (editable): nama, email, PIC, telepon, alamat, website
- Manajemen pengguna & role (Admin / Crewing Manager / Operator)
- Toggle notifikasi email per jenis event
- Konfigurasi bahasa (Indonesia / English)
- Informasi versi sistem

-----

## 🗄️ Struktur Data (localStorage)

```json
{
  "vessels": [...],       // Data kapal
  "crew": [...],          // Data kru
  "documents": [...],     // Dokumen & sertifikat kapal
  "rotations": [...],     // Jadwal rotasi kru
  "mlcLogs": [...],       // Log jam kerja harian
  "incidents": [...],     // Laporan insiden
  "voyages": [...],       // Log perjalanan kapal
  "activities": [...]     // Log aktivitas sistem
}
```

Data tersimpan secara otomatis di `localStorage` browser — **tidak hilang saat refresh**.  
Untuk reset ke data awal, hapus `las_data` dari localStorage browser.

-----

## 🛠️ Tech Stack

|Layer       |Teknologi                            |
|------------|-------------------------------------|
|UI Framework|Vanilla HTML5 + CSS3 (single-file)   |
|Styling     |Custom CSS (glassmorphism dark theme)|
|Charts      |Chart.js v4.4.1                      |
|Icons       |Font Awesome 6.5                     |
|Fonts       |Outfit + IBM Plex Mono (Google Fonts)|
|Data Storage|Browser localStorage                 |
|Map/Tracking|iframe → citrack.com                 |

-----

## 🔮 Rencana Pengembangan (Roadmap)

### Phase 2 — Backend Integration

- [ ] Migrasi ke **Next.js** (frontend) + **Node.js** (API)
- [ ] Database **PostgreSQL** dengan skema lengkap
- [ ] Auth sistem dengan JWT + refresh token
- [ ] File upload ke **AWS S3** / Google Drive API
- [ ] Email notifikasi via **Nodemailer** / SendGrid

### Phase 3 — Advanced Features

- [ ] Integrasi AIS (Automatic Identification System) real-time
- [ ] Kalkulasi jam kerja bergulir 24-jam (rolling window) otomatis
- [ ] Generate dokumen PDF (Crew List IMO, Surat Jaminan)
- [ ] Offline mode (PWA / Service Worker)
- [ ] Mobile app (React Native)
- [ ] Dashboard laporan keuangan penggajian kru
- [ ] Notifikasi push browser

### Phase 4 — Compliance Deep Dive

- [ ] OCIMF Officer Matrix validation
- [ ] PSC inspection checklist
- [ ] Audit trail lengkap semua perubahan data
- [ ] Digital signature untuk dokumen resmi

-----

## 📁 Struktur File

```
las-fms/
│
├── LAS_Fleet_Monitoring_System.html    # Aplikasi utama (single-file)
├── README.md                           # Dokumentasi ini
│
└── (untuk pengembangan lanjut):
    ├── /src
    │   ├── /components
    │   ├── /pages
    │   ├── /api
    │   └── /styles
    ├── /public
    ├── /database
    │   └── schema.sql
    └── package.json
```

-----

## 🗃️ Database Schema (untuk Phase 2)

```sql
-- Kapal
CREATE TABLE vessels (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  type        VARCHAR(50),
  gt          NUMERIC,
  dwt         NUMERIC,
  loa         NUMERIC,
  breadth     NUMERIC,
  year_built  INTEGER,
  class       VARCHAR(20),
  port        VARCHAR(100),
  flag        VARCHAR(50),
  engine      TEXT,
  status      VARCHAR(20) CHECK (status IN ('operational','drydock','route')),
  location    VARCHAR(200),
  notes       TEXT,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Kru
CREATE TABLE crew (
  id           SERIAL PRIMARY KEY,
  name         VARCHAR(100) NOT NULL,
  rank         VARCHAR(80),
  vessel_id    INTEGER REFERENCES vessels(id),
  nationality  VARCHAR(50),
  passport_no  VARCHAR(30),
  seaman_book  VARCHAR(30),
  dob          DATE,
  status       VARCHAR(20) CHECK (status IN ('onboard','leave','standby','medical')),
  coc_no       VARCHAR(50),
  coc_expiry   DATE,
  medical_exp  DATE,
  gmdss_exp    DATE,
  emergency    VARCHAR(200),
  created_at   TIMESTAMP DEFAULT NOW()
);

-- Sertifikat & Dokumen Kapal
CREATE TABLE documents (
  id         SERIAL PRIMARY KEY,
  vessel_id  INTEGER REFERENCES vessels(id),
  type       VARCHAR(50),
  name       VARCHAR(200) NOT NULL,
  issue_date DATE,
  expiry     DATE,
  issuer     VARCHAR(100),
  file_url   VARCHAR(500),
  notes      TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Rotasi Kru
CREATE TABLE rotations (
  id         SERIAL PRIMARY KEY,
  crew_id    INTEGER REFERENCES crew(id),
  vessel_id  INTEGER REFERENCES vessels(id),
  rank       VARCHAR(80),
  sign_on    DATE,
  sign_off   DATE,
  status     VARCHAR(20),
  port       VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Log Jam Kerja MLC
CREATE TABLE mlc_logs (
  id         SERIAL PRIMARY KEY,
  crew_id    INTEGER REFERENCES crew(id),
  log_date   DATE NOT NULL,
  hours      NUMERIC(4,1),
  rest       NUMERIC(4,1),
  notes      TEXT,
  compliant  BOOLEAN GENERATED ALWAYS AS (rest >= 10 AND hours <= 14) STORED,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insiden
CREATE TABLE incidents (
  id           SERIAL PRIMARY KEY,
  vessel_id    INTEGER REFERENCES vessels(id),
  incident_date TIMESTAMP,
  type         VARCHAR(80),
  description  TEXT,
  action_taken TEXT,
  severity     VARCHAR(20) CHECK (severity IN ('low','medium','high','critical')),
  status       VARCHAR(30),
  investigator VARCHAR(100),
  file_url     VARCHAR(500),
  created_at   TIMESTAMP DEFAULT NOW()
);

-- Voyage
CREATE TABLE voyages (
  id          SERIAL PRIMARY KEY,
  vessel_id   INTEGER REFERENCES vessels(id),
  voyage_no   VARCHAR(30),
  port_from   VARCHAR(100),
  port_to     VARCHAR(100),
  cargo       VARCHAR(200),
  quantity    VARCHAR(50),
  depart_time TIMESTAMP,
  eta         TIMESTAMP,
  status      VARCHAR(20),
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Users
CREATE TABLE users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100),
  email      VARCHAR(150) UNIQUE NOT NULL,
  password   VARCHAR(255),
  role       VARCHAR(30) CHECK (role IN ('Admin','Crewing Manager','Operator')),
  is_active  BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

-----

## 🏢 Informasi Perusahaan

|                |                                                                      |
|----------------|----------------------------------------------------------------------|
|**Perusahaan**  |PT. Pelayaran Lestari Abadi Serasi                                    |
|**Website**     |www.lasshipping.co.id                                                 |
|**Kantor Pusat**|Rukan Artha Gading Niaga H18, Kelapa Gading Barat, Jakarta Utara 14240|
|**Telp / Fax**  |021-45850929 / 021-45850930                                           |
|**Email Alert** |ahmadmabrur.lasshipping@gmail.com                                     |
|**PIC Sistem**  |Ahmad Mabrur                                                          |

**Cabang:**

- Surabaya — Puskopal Armatim Lt. 2, Jl. Ikan Dorang No. 1 · (031) 3536068
- Balikpapan — Jl. MT Haryono Blok D6/10 · (0542) 875490
- Makassar — Komplek Bumi Tirta Paotere Blok A No. 4 · (0411) 8945038

-----

## 🔒 Keamanan & Catatan

- Data saat ini disimpan di `localStorage` (client-side) — **tidak ada transmisi ke server**
- Untuk production: implementasi backend API + PostgreSQL + enkripsi password (bcrypt)
- Akses fitur dibatasi berdasarkan role pengguna
- Email alert berfungsi penuh setelah integrasi SMTP / SendGrid

-----

## 👨‍💻 Pengembang

Dibangun untuk **PT. Pelayaran Lestari Abadi Serasi**  
Versi: `1.0.0` · © 2024 LAS Shipping Lines

-----

> *“Keselamatan adalah prioritas utama dalam setiap pelayaran.”*
