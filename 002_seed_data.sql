-- Seed Data for LAS Fleet Monitoring System
-- Migration: 002_seed_data

-- Insert default users (passwords will be set via Supabase Auth)
-- Note: In production, users should be created via Supabase Auth UI or API
-- This is just for reference structure

-- Insert vessels from Ship Particular documents
INSERT INTO vessels (name, type, gt, dwt, loa, breadth, depth, draft, year_built, class, port, flag, engine, status, crew_count, location, notes) VALUES
('LCT. DEWA SAMUDERA ABADI', 'LCT', 707, 1200, 59.61, 12.20, 4.00, 3.00, 2014, 'BKI', 'Samarinda', 'Indonesia', 
  '2x Yanmar Marine Diesel 6AYM-WTE 500kW', 'operational', 13, 'Selat Makassar — Samarinda', 
  'Rampdoor: 9.00×7.50m | Aux: 1x Yuchai 53kW + YC2115C 40kW | Pump: 2x Ebara 65×50 FSJ'),
  
('LCT. LAS 2', 'LCT', 1085, 2000, 78.12, 13.50, 4.20, 3.15, 2015, 'BKI', 'Samarinda', 'Indonesia',
  '2x Mitsubishi Diesel S6R2-MPTK2', 'operational', 13, 'Laut Jawa — Menuju Surabaya',
  'Rampdoor: 7.30×8.00m | Aux: 2x Mitsubishi S6R-60kVA | SSAS, AIS'),
  
('LCT. RADJA SAMUDERA ABADI', 'LCT', 719, 1200, 59.85, 12.20, 4.00, 3.00, 2014, 'BKI', 'Samarinda', 'Indonesia',
  '2x Yanmar Marine Diesel 6HYM-WET X YX161L/500kW', 'operational', 13, 'Perairan Kalimantan Timur',
  'Rampdoor: 9.00×7.50m | Aux: 2x Yuchai YC6105CA 53kW | Thuraya Tracking VHF Marine'),
  
('CINTA SAMUDERA ABADI', 'LCT', 1240, 2400, 76.88, 15.00, 4.50, 3.24, 2021, 'BKI', 'Samarinda', 'Indonesia',
  '2x 829HP Yanmar 6AYM-WET | Kecepatan maks. 11 knot', 'docking', 8, 'Galangan Kapal Samarinda',
  'Kapasitas: 86 TEUS | Rampdoor: 10.00×9.00m | Aux: 2x Doosan AD136 85kVA | Pump: Ebara 65×50 FSJ');

-- Get vessel IDs for reference
DO $$
DECLARE
  v1_id UUID;
  v2_id UUID;
  v3_id UUID;
  v4_id UUID;
BEGIN
  SELECT id INTO v1_id FROM vessels WHERE name = 'LCT. DEWA SAMUDERA ABADI';
  SELECT id INTO v2_id FROM vessels WHERE name = 'LCT. LAS 2';
  SELECT id INTO v3_id FROM vessels WHERE name = 'LCT. RADJA SAMUDERA ABADI';
  SELECT id INTO v4_id FROM vessels WHERE name = 'CINTA SAMUDERA ABADI';

  -- Insert crew members
  INSERT INTO crew (name, rank, vessel_id, nationality, passport_no, seaman_book, date_of_birth, status, coc_number, coc_expiry, medical_expiry, gmdss_expiry, emergency_contact) VALUES
  ('Capt. Budi Santoso', 'Nakhoda (Master)', v1_id, 'Indonesia', 'A1234567', 'SB-001', '1975-03-15', 'onboard', 'COC-NKD-001', '2025-12-31', '2025-06-30', '2025-09-01', 'Siti Fatimah — 0812-3456-7890'),
  ('Rahman Hidayat', 'Mualim I (Chief Officer)', v1_id, 'Indonesia', 'A2345678', 'SB-002', '1980-07-22', 'onboard', 'COC-MUA1-002', '2026-03-31', '2025-08-15', '2026-01-01', 'Dewi Rahayu — 0813-4567-8901'),
  ('Capt. Agus Setiawan', 'Nakhoda (Master)', v2_id, 'Indonesia', 'A3456789', 'SB-003', '1978-11-05', 'onboard', 'COC-NKD-003', '2025-04-30', '2025-07-01', '2025-11-30', 'Rina Susanti — 0814-5678-9012'),
  ('Hendra Kusuma', 'KKM (Chief Engineer)', v2_id, 'Indonesia', 'A4567890', 'SB-004', '1982-04-18', 'onboard', 'COC-KKM-004', '2026-06-30', '2025-10-20', NULL, 'Maya Sari — 0815-6789-0123'),
  ('Capt. Dedy Wahyono', 'Nakhoda (Master)', v3_id, 'Indonesia', 'A5678901', 'SB-005', '1976-08-30', 'onboard', 'COC-NKD-005', '2025-05-15', '2025-12-01', '2025-07-30', 'Lina Wati — 0816-7890-1234'),
  ('Supriadi Noor', 'Masinis I', v3_id, 'Indonesia', 'A6789012', 'SB-006', '1985-01-25', 'onboard', 'COC-MSN1-006', '2026-01-31', '2026-01-01', NULL, 'Ani Kurnia — 0817-8901-2345'),
  ('Muhamad Rizki', 'Mualim II', v4_id, 'Indonesia', 'A7890123', 'SB-007', '1988-09-12', 'onboard', 'COC-MUA2-007', '2026-09-30', '2026-04-01', '2026-06-01', 'Tari Oktavia — 0818-9012-3456'),
  ('Andi Pratama', 'AB Deck', v1_id, 'Indonesia', 'A8901234', 'SB-008', '1990-12-08', 'onboard', 'COC-ABD-008', '2025-03-31', '2025-05-15', NULL, 'Sari Indah — 0819-0123-4567'),
  ('Feri Susanto', 'Bosun', v2_id, 'Indonesia', 'A9012345', 'SB-009', '1987-06-20', 'onboard', 'COC-BSN-009', '2026-04-30', '2025-11-01', NULL, 'Wati Lestari — 0811-1234-5678'),
  ('Surya Darma', 'Juru Masak', v3_id, 'Indonesia', 'A0123456', 'SB-010', '1992-03-15', 'onboard', 'COC-JMK-010', '2026-03-15', '2025-09-01', NULL, 'Nani Suharti — 0812-2345-6789'),
  ('Ismail Harun', 'Mualim III', NULL, 'Indonesia', 'B1234567', 'SB-011', '1993-07-04', 'leave', 'COC-MUA3-011', '2026-07-04', '2026-02-01', '2026-05-01', 'Yuni Astuti — 0813-3456-7890'),
  ('Bambang Sutrisno', 'Masinis II', NULL, 'Indonesia', 'B2345678', 'SB-012', '1986-10-28', 'standby', 'COC-MSN2-012', '2025-10-28', '2025-08-01', NULL, 'Rita Amalia — 0814-4567-8901'),
  ('Yusuf Alimin', 'Kelasi', v1_id, 'Indonesia', 'B3456789', 'SB-013', '1995-02-14', 'onboard', 'COC-KLS-013', '2026-02-14', '2026-01-01', NULL, 'Ida Permata — 0815-5678-9012');

  -- Insert documents
  INSERT INTO documents (vessel_id, type, name, issuer, issue_date, expiry_date, notes) VALUES
  (v1_id, 'ISM', 'Safety Management Certificate', 'BKI / Det Norske Veritas', '2021-01-10', '2027-01-10', ''),
  (v1_id, 'ISPS', 'ISPS Code Certificate', 'DJPL Kemenhub RI', '2021-04-19', '2026-04-30', 'Renewal setiap 5 tahun'),
  (v1_id, 'Registrasi', 'Certificate of Registry (Surat Laut)', 'DJPL Samarinda', '2014-06-01', '2029-06-01', ''),
  (v1_id, 'Safety Equipment', 'Safety Equipment Certificate', 'BKI', '2022-05-01', '2025-05-01', ''),
  (v2_id, 'Kelas BKI', 'Certificate of Classification', 'BKI Samarinda', '2020-03-05', '2025-03-05', 'Perpanjangan 5 tahunan'),
  (v2_id, 'Load Line', 'International Load Line Certificate', 'BKI', '2020-07-12', '2025-07-12', ''),
  (v2_id, 'MARPOL', 'MARPOL Certificate Annex I', 'BKI / Kemenhub', '2022-01-01', '2027-01-01', ''),
  (v3_id, 'ISM', 'Document of Compliance (DOC)', 'BKI Jakarta', '2021-08-20', '2026-08-20', ''),
  (v3_id, 'ISPS', 'Ship Security Certificate (SSC)', 'DJPL', '2022-03-01', '2027-03-01', ''),
  (v4_id, 'Kelas BKI', 'Certificate of Classification', 'BKI Jakarta', '2021-09-15', '2026-09-15', 'Kapal baru 2021'),
  (v4_id, 'Registrasi', 'Surat Laut / Certificate of Registry', 'DJPL Samarinda', '2021-10-01', '2031-10-01', '');

  -- Insert sample voyages (Enhanced with new columns)
  INSERT INTO voyages (vessel_id, voyage_number, port_from, port_to, cargo_type, cargo_quantity, distance_nm, etd, eta, fuel_consumption, fuel_unit, status) VALUES
  (v1_id, 'V2025-041', 'Samarinda', 'Surabaya', 'Alat Berat & Material Konstruksi', '1.200 MT', 485.5, '2025-04-10 08:00:00+07', '2025-04-16 16:00:00+07', 38.5, 'MT', 'active'),
  (v2_id, 'V2025-039', 'Balikpapan', 'Bitung', 'Peti Kemas (Container)', '800 MT', 672.3, '2025-04-12 06:00:00+07', '2025-04-18 12:00:00+07', 52.8, 'MT', 'active'),
  (v3_id, 'V2025-038', 'Samarinda', 'Makassar', 'Material Konstruksi Jalan', '1.200 MT', 512.0, '2025-04-08 07:00:00+07', '2025-04-15 10:00:00+07', 41.2, 'MT', 'port'),
  (v4_id, 'DOC-2025-003', 'Samarinda', 'Galangan Kapal', 'Dry Dock Maintenance', '—', 0, '2025-04-01 00:00:00+07', '2025-04-30 00:00:00+07', 0, 'MT', 'port');

END $$;
