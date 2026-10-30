-- ==============================================================================
-- Velenburg Retreat Murree — Hardened Supabase Production Security Schema
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor -> New query)
-- ==============================================================================

-- 1. Create rooms table (4 Uniform Luxury Suites) with column integrity constraints
CREATE TABLE IF NOT EXISTS rooms (
  id INT PRIMARY KEY CHECK (id BETWEEN 1 AND 4),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  price_per_night_pkr INT NOT NULL DEFAULT 18000 CHECK (price_per_night_pkr > 0),
  airbnb_ical_url TEXT,
  booking_com_ical_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial 4 uniform suites
INSERT INTO rooms (id, name, slug, price_per_night_pkr) VALUES
  (1, 'Room 1 — Luxury Suite 01', 'room-1', 18000),
  (2, 'Room 2 — Luxury Suite 02', 'room-2', 18000),
  (3, 'Room 3 — Luxury Suite 03', 'room-3', 18000),
  (4, 'Room 4 — Luxury Suite 04', 'room-4', 18000)
ON CONFLICT (id) DO NOTHING;

-- 2. Create bookings table with strict integrity checks
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_ref TEXT UNIQUE NOT NULL,
  room_id INT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE CHECK (room_id BETWEEN 1 AND 4),
  guest_name TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  guests_count INT NOT NULL DEFAULT 2 CHECK (guests_count BETWEEN 1 AND 10),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  nights INT NOT NULL CHECK (nights >= 1),
  total_price_pkr INT NOT NULL CHECK (total_price_pkr >= 0),
  status TEXT NOT NULL DEFAULT 'pending_whatsapp' CHECK (status IN ('pending_whatsapp', 'confirmed', 'cancelled')),
  source TEXT NOT NULL DEFAULT 'website' CHECK (source IN ('website', 'manual_block', 'airbnb', 'booking_com')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT chk_booking_dates CHECK (check_out > check_in)
);

CREATE INDEX IF NOT EXISTS idx_bookings_room_dates ON bookings (room_id, check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings (status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings (created_at DESC);

-- 3. Row Level Security (RLS) Configuration - Enterprise Hardened
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Clean up any legacy or weak policies
DROP POLICY IF EXISTS "Allow public read access to rooms" ON rooms;
DROP POLICY IF EXISTS "Allow public read of confirmed bookings" ON bookings;
DROP POLICY IF EXISTS "Allow public insert of booking inquiries" ON bookings;
DROP POLICY IF EXISTS "Allow public read of rooms" ON rooms;
DROP POLICY IF EXISTS "Allow public insert of pending inquiries only" ON bookings;

-- ROOMS SECURITY:
-- Public can READ room details (name, slug, pricing)
CREATE POLICY "Allow public read of rooms" 
  ON rooms FOR SELECT 
  TO anon, authenticated 
  USING (true);

-- Only service_role (verified serverless API) can insert/update/delete rooms
-- Anon is strictly denied write access to rooms.

-- BOOKINGS SECURITY:
-- PRIVACY PROTECTION:
-- We revoke direct public SELECT on the raw bookings table so scrapers/attackers
-- cannot harvest customer phone numbers, names, or notes via the public anon key.
-- Availability calendar data is served securely via /api/availability which filters
-- and anonymizes the records on the server.
REVOKE SELECT ON bookings FROM anon;

-- ANTI-HIJACKING INSERT POLICY:
-- Anon can only insert booking inquiries with status = 'pending_whatsapp' and source = 'website'.
-- Anon is strictly prevented from inserting status = 'confirmed' or source = 'manual_block'
-- which would maliciously block the hotel calendar!
CREATE POLICY "Allow public insert of pending inquiries only" 
  ON bookings FOR INSERT 
  TO anon, authenticated 
  WITH CHECK (
    status = 'pending_whatsapp' 
    AND source = 'website'
    AND check_out > check_in
    AND room_id BETWEEN 1 AND 4
  );

-- No public UPDATE or DELETE on bookings is allowed for anon.
-- Updates (confirming bookings) and deletions (unblocking) are exclusively
-- performed via service_role in verified /api/admin & /api/bookings endpoints.
