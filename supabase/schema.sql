-- ==============================================================================
-- Velenburg Retreat Murree — Supabase Production Database Schema
-- Run this script in your Supabase SQL Editor (Dashboard -> SQL Editor -> New query)
-- ==============================================================================

-- 1. Create rooms table (4 Uniform Luxury Suites)
CREATE TABLE IF NOT EXISTS rooms (
  id INT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  price_per_night_pkr INT NOT NULL DEFAULT 18000,
  airbnb_ical_url TEXT,
  booking_com_ical_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed 4 uniform suites if not already inserted
INSERT INTO rooms (id, name, slug, price_per_night_pkr) VALUES
  (1, 'Room 1 — Luxury Suite 01', 'room-1', 18000),
  (2, 'Room 2 — Luxury Suite 02', 'room-2', 18000),
  (3, 'Room 3 — Luxury Suite 03', 'room-3', 18000),
  (4, 'Room 4 — Luxury Suite 04', 'room-4', 18000)
ON CONFLICT (id) DO NOTHING;

-- 2. Create bookings & calendar blocks table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_ref TEXT UNIQUE NOT NULL,
  room_id INT REFERENCES rooms(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  guests_count INT DEFAULT 2,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  nights INT NOT NULL,
  total_price_pkr INT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_whatsapp', -- 'pending_whatsapp' | 'confirmed' | 'cancelled'
  source TEXT NOT NULL DEFAULT 'website',          -- 'website' | 'manual_block' | 'airbnb' | 'booking_com'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast range queries and room lookups
CREATE INDEX IF NOT EXISTS idx_bookings_room_dates ON bookings (room_id, check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings (status);

-- 3. Row Level Security (RLS) Configuration
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow public read of rooms (to display suite info on website)
CREATE POLICY "Allow public read access to rooms" 
  ON rooms FOR SELECT 
  TO anon, authenticated
  USING (true);

-- Allow public read of active reservations (only dates & sources needed for calendar availability)
CREATE POLICY "Allow public read of confirmed bookings" 
  ON bookings FOR SELECT 
  TO anon, authenticated
  USING (status = 'confirmed' OR source = 'manual_block');

-- Allow public insert of incoming booking inquiries from WhatsApp handoff
CREATE POLICY "Allow public insert of booking inquiries" 
  ON bookings FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- Note: The server-side API routes (/api/*) use SUPABASE_SERVICE_ROLE_KEY,
-- which bypasses RLS and allows full admin blocking/unblocking and iCal configuration.

