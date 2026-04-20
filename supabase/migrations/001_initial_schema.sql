-- LAS Fleet Monitoring System Database Schema
-- PT. Pelayaran Lestari Abadi Serasi
-- Migration: 001_initial_schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('Admin', 'Crewing Manager', 'Operator');
CREATE TYPE vessel_status AS ENUM ('operational', 'docking', 'building');
CREATE TYPE crew_status AS ENUM ('onboard', 'leave', 'standby', 'medical');
CREATE TYPE rotation_status AS ENUM ('leave', 'planned', 'enroute', 'onboard');
CREATE TYPE voyage_status AS ENUM ('active', 'port', 'planned', 'completed');
CREATE TYPE incident_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE incident_status AS ENUM ('investigation', 'closed');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'Operator',
  avatar_initials VARCHAR(2),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vessels table
CREATE TABLE public.vessels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'LCT',
  gt NUMERIC(8,2),
  dwt NUMERIC(8,2),
  loa NUMERIC(6,2),
  breadth NUMERIC(6,2),
  depth NUMERIC(6,2),
  draft NUMERIC(6,2),
  year_built INTEGER,
  class VARCHAR(20) DEFAULT 'BKI',
  port VARCHAR(100) DEFAULT 'Samarinda',
  flag VARCHAR(50) DEFAULT 'Indonesia',
  engine TEXT,
  status vessel_status DEFAULT 'operational',
  crew_count INTEGER DEFAULT 13,
  location VARCHAR(200),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crew table
CREATE TABLE public.crew (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  rank VARCHAR(80) NOT NULL,
  vessel_id UUID REFERENCES vessels(id) ON DELETE SET NULL,
  nationality VARCHAR(50) DEFAULT 'Indonesia',
  passport_no VARCHAR(30),
  seaman_book VARCHAR(30),
  date_of_birth DATE,
  status crew_status DEFAULT 'standby',
  coc_number VARCHAR(50),
  coc_expiry DATE,
  medical_expiry DATE,
  gmdss_expiry DATE,
  emergency_contact VARCHAR(200),
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents table
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vessel_id UUID REFERENCES vessels(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  name VARCHAR(200) NOT NULL,
  issue_date DATE,
  expiry_date DATE,
  issuer VARCHAR(100),
  file_url TEXT,
  file_name VARCHAR(255),
  file_size INTEGER,
  notes TEXT,
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rotations table (Crew Roster Schedule)
CREATE TABLE public.rotations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  crew_id UUID REFERENCES crew(id) ON DELETE CASCADE,
  vessel_id UUID REFERENCES vessels(id) ON DELETE SET NULL,
  rank VARCHAR(80) NOT NULL,
  sign_on_date DATE,
  sign_off_date DATE,
  status rotation_status DEFAULT 'planned',
  port VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MLC Work Hours Log
CREATE TABLE public.mlc_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  crew_id UUID REFERENCES crew(id) ON DELETE CASCADE,
  vessel_id UUID REFERENCES vessels(id) ON DELETE SET NULL,
  log_date DATE NOT NULL,
  work_hours NUMERIC(4,1) NOT NULL CHECK (work_hours >= 0 AND work_hours <= 24),
  rest_hours NUMERIC(4,1) NOT NULL CHECK (rest_hours >= 0 AND rest_hours <= 24),
  notes TEXT,
  is_compliant BOOLEAN GENERATED ALWAYS AS (rest_hours >= 10 AND work_hours <= 14) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(crew_id, log_date)
);

-- Incidents table
CREATE TABLE public.incidents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vessel_id UUID REFERENCES vessels(id) ON DELETE SET NULL,
  incident_date TIMESTAMPTZ NOT NULL,
  type VARCHAR(80) NOT NULL,
  description TEXT NOT NULL,
  action_taken TEXT,
  severity incident_severity DEFAULT 'low',
  status incident_status DEFAULT 'investigation',
  investigator VARCHAR(100),
  file_url TEXT,
  file_name VARCHAR(255),
  reported_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Voyages table (Enhanced with new columns)
CREATE TABLE public.voyages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vessel_id UUID REFERENCES vessels(id) ON DELETE CASCADE,
  voyage_number VARCHAR(30) UNIQUE NOT NULL,
  port_from VARCHAR(100) NOT NULL,
  port_to VARCHAR(100) NOT NULL,
  cargo_type VARCHAR(200),
  cargo_quantity VARCHAR(50),
  distance_nm NUMERIC(8,2), -- Nautical Miles
  etd TIMESTAMPTZ, -- Estimated Time of Departure
  eta TIMESTAMPTZ, -- Estimated Time of Arrival
  actual_departure TIMESTAMPTZ,
  actual_arrival TIMESTAMPTZ,
  fuel_consumption NUMERIC(10,2), -- In metric tons or liters
  fuel_unit VARCHAR(20) DEFAULT 'MT',
  status voyage_status DEFAULT 'planned',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity Log table
CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Company Settings table
CREATE TABLE public.company_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name VARCHAR(200) DEFAULT 'PT. Pelayaran Lestari Abadi Serasi',
  email VARCHAR(150) DEFAULT 'ahmadmabrur.lasshipping@gmail.com',
  phone VARCHAR(30) DEFAULT '021-45850929',
  fax VARCHAR(30) DEFAULT '021-45850930',
  address TEXT DEFAULT 'Rukan Artha Gading Niaga H18, Kelapa Gading Barat, Jakarta Utara 14240',
  website VARCHAR(100) DEFAULT 'www.lasshipping.co.id',
  pic_name VARCHAR(100) DEFAULT 'Ahmad Mabrur',
  logo_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_vessels_status ON vessels(status);
CREATE INDEX idx_crew_status ON crew(status);
CREATE INDEX idx_crew_vessel ON crew(vessel_id);
CREATE INDEX idx_documents_vessel ON documents(vessel_id);
CREATE INDEX idx_documents_expiry ON documents(expiry_date);
CREATE INDEX idx_rotations_crew ON rotations(crew_id);
CREATE INDEX idx_rotations_vessel ON rotations(vessel_id);
CREATE INDEX idx_rotations_status ON rotations(status);
CREATE INDEX idx_mlc_logs_crew ON mlc_logs(crew_id);
CREATE INDEX idx_mlc_logs_date ON mlc_logs(log_date);
CREATE INDEX idx_mlc_logs_compliant ON mlc_logs(is_compliant);
CREATE INDEX idx_incidents_vessel ON incidents(vessel_id);
CREATE INDEX idx_incidents_date ON incidents(incident_date);
CREATE INDEX idx_voyages_vessel ON voyages(vessel_id);
CREATE INDEX idx_voyages_status ON voyages(status);
CREATE INDEX idx_activities_user ON activities(user_id);
CREATE INDEX idx_activities_created ON activities(created_at DESC);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vessels ENABLE ROW LEVEL SECURITY;
ALTER TABLE crew ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE rotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE mlc_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE voyages ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Read access for all authenticated users, Write based on role)
-- Users
CREATE POLICY "Users can view all users" ON users FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage users" ON users FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'Admin')
);

-- Vessels (All can read, Admin/Crewing Manager can write)
CREATE POLICY "Anyone can view vessels" ON vessels FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage vessels" ON vessels FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('Admin', 'Crewing Manager'))
);

-- Crew (All can read, Admin/Crewing Manager can write)
CREATE POLICY "Anyone can view crew" ON crew FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins and Crewing Managers can manage crew" ON crew FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('Admin', 'Crewing Manager'))
);

-- Documents (All can read, All authenticated can upload)
CREATE POLICY "Anyone can view documents" ON documents FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can upload documents" ON documents FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage documents" ON documents FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'Admin')
);

-- Similar policies for other tables
CREATE POLICY "Anyone can view rotations" ON rotations FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Crewing managers can manage rotations" ON rotations FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('Admin', 'Crewing Manager'))
);

CREATE POLICY "Anyone can view mlc_logs" ON mlc_logs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "All can log MLC hours" ON mlc_logs FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Anyone can view incidents" ON incidents FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "All can report incidents" ON incidents FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Anyone can view voyages" ON voyages FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Operators can manage voyages" ON voyages FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Anyone can view activities" ON activities FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "System can log activities" ON activities FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view settings" ON company_settings FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can update settings" ON company_settings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'Admin')
);

-- Insert default company settings
INSERT INTO company_settings (id) VALUES (uuid_generate_v4());

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vessels_updated_at BEFORE UPDATE ON vessels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_crew_updated_at BEFORE UPDATE ON crew FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rotations_updated_at BEFORE UPDATE ON rotations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mlc_logs_updated_at BEFORE UPDATE ON mlc_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON incidents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_voyages_updated_at BEFORE UPDATE ON voyages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_company_settings_updated_at BEFORE UPDATE ON company_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
