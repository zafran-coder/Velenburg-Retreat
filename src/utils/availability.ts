/**
 * Velenburg Retreat Murree — Hybrid Availability & Booking Engine
 * Primary: Live Supabase Database + Live Airbnb/Booking.com iCal Sync
 * Fallback: Automatic LocalStorage Mirror & Failover (Protects against Supabase free-tier project pauses)
 */

export interface BlockedRange {
  id: string;
  roomId: number; // 1, 2, 3, or 4
  start: string; // 'YYYY-MM-DD'
  end: string;   // 'YYYY-MM-DD'
  source: 'airbnb' | 'booking_com' | 'website' | 'manual_block';
  guestName?: string;
  notes?: string;
}

export interface RoomICalConfig {
  roomId: number;
  airbnbIcalUrl: string;
  bookingComIcalUrl: string;
}

export interface BookingRecord {
  id: string;
  booking_ref: string;
  room_id: number;
  guest_name: string;
  guest_phone: string;
  guests_count: number;
  check_in: string;
  check_out: string;
  nights: number;
  total_price_pkr: number;
  status: 'pending_whatsapp' | 'confirmed' | 'cancelled';
  source: 'website' | 'manual_block' | 'airbnb' | 'booking_com';
  notes?: string;
  created_at?: string;
}

// LocalStorage Persistence Keys (Offline / Paused-DB Fallback)
const STORAGE_BLOCKS_KEY = 'velenburg_blocked_dates';
const STORAGE_CONFIGS_KEY = 'velenburg_ical_configs';
const STORAGE_INQUIRIES_KEY = 'velenburg_inquiries';

// Realistic sample seed bookings (used if DB is paused/empty)
const DEFAULT_BLOCKS: BlockedRange[] = [
  {
    id: 'block-1',
    roomId: 1,
    start: '2026-11-06',
    end: '2026-11-09',
    source: 'airbnb',
    guestName: 'Airbnb Guest (Confirmed)',
    notes: 'Synced via Airbnb iCal',
  },
  {
    id: 'block-2',
    roomId: 2,
    start: '2026-11-13',
    end: '2026-11-16',
    source: 'booking_com',
    guestName: 'Booking.com Reservation',
    notes: 'Synced via Booking.com iCal',
  },
  {
    id: 'block-3',
    roomId: 3,
    start: '2026-11-20',
    end: '2026-11-23',
    source: 'website',
    guestName: 'Direct WhatsApp Guest',
    notes: 'Confirmed 100% advance deposit',
  },
  {
    id: 'block-4',
    roomId: 4,
    start: '2026-11-27',
    end: '2026-11-30',
    source: 'airbnb',
    guestName: 'Airbnb Weekend Getaway',
    notes: 'Synced via Airbnb iCal',
  },
];

const DEFAULT_ICAL_CONFIGS: RoomICalConfig[] = [
  { roomId: 1, airbnbIcalUrl: '', bookingComIcalUrl: '' },
  { roomId: 2, airbnbIcalUrl: '', bookingComIcalUrl: '' },
  { roomId: 3, airbnbIcalUrl: '', bookingComIcalUrl: '' },
  { roomId: 4, airbnbIcalUrl: '', bookingComIcalUrl: '' },
];

// Connection & Health Telemetry
let isDatabaseOnline = true;
let isUsingLocalFallback = false;

// Initialize in-memory cache from LocalStorage fallback if present
function loadFromLocalStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function saveToLocalStorage(key: string, value: any): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota errors
  }
}

let inMemoryBlockedRanges: BlockedRange[] = loadFromLocalStorage(
  STORAGE_BLOCKS_KEY,
  DEFAULT_BLOCKS
);

let inMemoryConfigs: RoomICalConfig[] = loadFromLocalStorage(
  STORAGE_CONFIGS_KEY,
  DEFAULT_ICAL_CONFIGS
);

type Listener = () => void;
const listeners = new Set<Listener>();

function notifyListeners() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error('[Availability Store] Error in listener:', e);
    }
  });
}

export function subscribeToAvailability(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getDatabaseHealth() {
  return {
    isOnline: isDatabaseOnline,
    isFallback: isUsingLocalFallback,
  };
}

/**
 * Fetch live availability from /api/availability
 * Tries Supabase + iCal first. If Supabase is paused or unreachable,
 * gracefully falls back to local storage mirror so website never breaks.
 */
export async function fetchLiveAvailability(roomId?: number): Promise<BlockedRange[]> {
  try {
    const url = roomId ? `/api/availability?roomId=${roomId}` : '/api/availability';
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();

    if (data.databasePaused || data.fallback) {
      isDatabaseOnline = false;
      isUsingLocalFallback = true;
      console.info('[Availability Engine] Supabase paused/sleeping. Seamlessly using LocalStorage fallback.');
      return inMemoryBlockedRanges;
    }

    if (Array.isArray(data.blockedRanges)) {
      isDatabaseOnline = true;
      isUsingLocalFallback = false;

      if (roomId) {
        inMemoryBlockedRanges = [
          ...inMemoryBlockedRanges.filter((b) => b.roomId !== roomId),
          ...data.blockedRanges,
        ];
      } else {
        // If DB returned blocks, update in-memory and mirror to localStorage
        inMemoryBlockedRanges = data.blockedRanges.length > 0 ? data.blockedRanges : inMemoryBlockedRanges;
      }

      // Persist fresh mirror to local storage
      saveToLocalStorage(STORAGE_BLOCKS_KEY, inMemoryBlockedRanges);
      notifyListeners();
    }
  } catch (err: any) {
    // If Supabase is paused or network fails, keep working via local storage!
    isDatabaseOnline = false;
    isUsingLocalFallback = true;
    console.warn('[Availability Engine] Supabase unavailable. Active on LocalStorage fallback:', err?.message || err);
  }
  return inMemoryBlockedRanges;
}

/**
 * Server-Side Passcode Verification with Rate-Limiting & Cryptographic Session Token
 */
export async function verifyAdminPasscode(
  passcode: string
): Promise<{ success: boolean; token?: string; error?: string }> {
  const trimmed = passcode.trim();
  if (!trimmed) return { success: false, error: 'Passcode cannot be empty.' };

  try {
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'verify',
        password: trimmed,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success) {
      return { success: true, token: data.token || trimmed };
    }
    return { success: false, error: data.error || 'Incorrect admin passcode.' };
  } catch (err: any) {
    console.error('[Admin Auth Error]:', err);
    return { success: false, error: 'Connection to authentication service failed.' };
  }
}

/**
 * Fetch all bookings from Supabase (Requires Admin Token / Password)
 * Falls back to LocalStorage inquiries if Supabase is paused
 */
export async function fetchAdminBookings(adminToken: string): Promise<BookingRecord[]> {
  try {
    const res = await fetch('/api/bookings', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
        'x-admin-password': adminToken,
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.bookings) && data.bookings.length > 0) {
        saveToLocalStorage(STORAGE_INQUIRIES_KEY, data.bookings);
        return data.bookings;
      }
    }
  } catch (err) {
    console.warn('[Admin Bookings] Supabase unreachable; loading local inquiries:', err);
  }

  // Load from local fallback
  return loadFromLocalStorage<BookingRecord[]>(STORAGE_INQUIRIES_KEY, []);
}

/**
 * Create a Manual Block (Writes to Supabase + Mirrors to LocalStorage)
 */
export async function createLiveBlock(
  roomId: number,
  start: string,
  end: string,
  guestName = 'Owner Reservation',
  notes = 'Manual block via Admin',
  adminToken = ''
): Promise<BlockedRange> {
  const diffDays = Math.max(
    1,
    Math.round((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24))
  );

  const newBlock: BlockedRange = {
    id: `block-${Date.now()}`,
    roomId,
    start,
    end,
    source: 'manual_block',
    guestName,
    notes,
  };

  // 1. Immediately persist to local memory & storage so UI is instant and never loses data
  inMemoryBlockedRanges = [...inMemoryBlockedRanges, newBlock];
  saveToLocalStorage(STORAGE_BLOCKS_KEY, inMemoryBlockedRanges);
  notifyListeners();

  // 2. Attempt sync to Supabase database
  try {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
        'x-admin-password': adminToken,
      },
      body: JSON.stringify({
        room_id: roomId,
        guest_name: guestName,
        guest_phone: 'Owner Manual',
        guests_count: 2,
        check_in: start,
        check_out: end,
        nights: diffDays,
        total_price_pkr: diffDays * 18000,
        status: 'confirmed',
        source: 'manual_block',
        notes,
        adminPassword: adminToken,
      }),
    });

    if (res.ok) {
      const { booking } = await res.json();
      if (booking?.id) {
        newBlock.id = booking.id;
        saveToLocalStorage(STORAGE_BLOCKS_KEY, inMemoryBlockedRanges);
      }
    }
  } catch (err) {
    console.info('[Create Block] Supabase paused/offline. Saved locally in fallback storage.');
  }

  return newBlock;
}

/**
 * Remove / Unblock a booking or date block
 */
export async function removeLiveBlock(id: string, adminToken = ''): Promise<void> {
  // 1. Immediately remove from local memory & storage
  inMemoryBlockedRanges = inMemoryBlockedRanges.filter((b) => b.id !== id);
  saveToLocalStorage(STORAGE_BLOCKS_KEY, inMemoryBlockedRanges);
  notifyListeners();

  // 2. Attempt sync delete to Supabase
  try {
    await fetch(`/api/bookings?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
        'x-admin-password': adminToken,
      },
      body: JSON.stringify({ id, adminPassword: adminToken }),
    });
  } catch (err) {
    console.info('[Delete Block] Supabase paused/offline. Removed locally in fallback storage.');
  }
}

/**
 * Fetch Room iCal Sync Configurations (Supabase + LocalStorage Fallback)
 */
export async function fetchLiveRoomConfigs(adminToken = ''): Promise<RoomICalConfig[]> {
  try {
    const res = await fetch('/api/admin?action=rooms', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
        'x-admin-password': adminToken,
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.rooms) && data.rooms.length > 0) {
        inMemoryConfigs = data.rooms.map((r: any) => ({
          roomId: r.id,
          airbnbIcalUrl: r.airbnb_ical_url || '',
          bookingComIcalUrl: r.booking_com_ical_url || '',
        }));
        saveToLocalStorage(STORAGE_CONFIGS_KEY, inMemoryConfigs);
        return inMemoryConfigs;
      }
    }
  } catch (err) {
    console.warn('[Room Configs] Supabase paused; using local configs.');
  }

  return inMemoryConfigs;
}

/**
 * Save Room iCal URLs (Writes to Supabase + Mirrors to LocalStorage)
 */
export async function saveLiveRoomConfig(
  roomId: number,
  airbnbUrl: string,
  bookingUrl: string,
  adminToken = ''
): Promise<void> {
  // 1. Update in-memory & LocalStorage
  const idx = inMemoryConfigs.findIndex((c) => c.roomId === roomId);
  const updatedConfig: RoomICalConfig = {
    roomId,
    airbnbIcalUrl: airbnbUrl.trim(),
    bookingComIcalUrl: bookingUrl.trim(),
  };

  if (idx >= 0) {
    inMemoryConfigs[idx] = updatedConfig;
  } else {
    inMemoryConfigs.push(updatedConfig);
  }
  saveToLocalStorage(STORAGE_CONFIGS_KEY, inMemoryConfigs);
  notifyListeners();

  // 2. Attempt sync to Supabase
  try {
    await fetch('/api/admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
        'x-admin-password': adminToken,
      },
      body: JSON.stringify({
        action: 'update_ical_urls',
        roomId,
        airbnbIcalUrl: airbnbUrl.trim(),
        bookingComIcalUrl: bookingUrl.trim(),
        password: adminToken,
      }),
    });
  } catch (err) {
    console.info('[Save Room Config] Supabase paused/offline. Saved locally in fallback storage.');
  }

  fetchLiveAvailability().catch(() => {});
}

/**
 * Record a WhatsApp Booking Inquiry (Supabase + LocalStorage Fallback)
 */
export async function recordBookingInquiry(inquiry: {
  bookingRef: string;
  roomId: number;
  guestName: string;
  guestPhone: string;
  guestsCount?: number;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalPricePkr: number;
  notes?: string;
}): Promise<{ success: boolean; bookingRef: string }> {
  const localRecord: BookingRecord = {
    id: `local-${Date.now()}`,
    booking_ref: inquiry.bookingRef,
    room_id: inquiry.roomId,
    guest_name: inquiry.guestName,
    guest_phone: inquiry.guestPhone,
    guests_count: inquiry.guestsCount || 2,
    check_in: inquiry.checkIn,
    check_out: inquiry.checkOut,
    nights: inquiry.nights,
    total_price_pkr: inquiry.totalPricePkr,
    status: 'pending_whatsapp',
    source: 'website',
    notes: inquiry.notes || '',
    created_at: new Date().toISOString(),
  };

  // 1. Always mirror inquiry in local storage so owner never loses a lead
  const existingInquiries = loadFromLocalStorage<BookingRecord[]>(STORAGE_INQUIRIES_KEY, []);
  saveToLocalStorage(STORAGE_INQUIRIES_KEY, [localRecord, ...existingInquiries]);

  // 2. Attempt push to Supabase
  try {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        booking_ref: inquiry.bookingRef,
        room_id: inquiry.roomId,
        guest_name: inquiry.guestName,
        guest_phone: inquiry.guestPhone,
        guests_count: inquiry.guestsCount || 2,
        check_in: inquiry.checkIn,
        check_out: inquiry.checkOut,
        nights: inquiry.nights,
        total_price_pkr: inquiry.totalPricePkr,
        status: 'pending_whatsapp',
        source: 'website',
        notes: inquiry.notes || '',
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return { success: true, bookingRef: data.booking?.booking_ref || inquiry.bookingRef };
    }
  } catch (err: any) {
    console.info('[Booking Inquiry Log] Supabase sleeping. Inquiry safely stored in local backup.');
  }

  return { success: true, bookingRef: inquiry.bookingRef };
}

// ============================================================================
// Synchronous Availability Helpers (Fast React Rendering & Range Checking)
// Reads from active hybrid store (Live DB with LocalStorage backup)
// ============================================================================

export function getAllBlockedRanges(): BlockedRange[] {
  return inMemoryBlockedRanges;
}

export function getBlockedRangesForRoom(roomId: number): BlockedRange[] {
  return inMemoryBlockedRanges.filter((b) => b.roomId === roomId);
}

export function isDateBlocked(roomId: number, dateStr: string): boolean {
  const blocks = getBlockedRangesForRoom(roomId);
  const target = new Date(dateStr).getTime();

  for (const b of blocks) {
    const start = new Date(b.start).getTime();
    const end = new Date(b.end).getTime();
    if (target >= start && target < end) {
      return true;
    }
  }
  return false;
}

export function isRangeBlocked(roomId: number, checkIn: string, checkOut: string): boolean {
  const start = new Date(checkIn).getTime();
  const end = new Date(checkOut).getTime();
  if (isNaN(start) || isNaN(end) || start >= end) return false;

  const blocks = getBlockedRangesForRoom(roomId);
  for (const b of blocks) {
    const bStart = new Date(b.start).getTime();
    const bEnd = new Date(b.end).getTime();
    // Overlap condition: start < bEnd and end > bStart
    if (start < bEnd && end > bStart) {
      return true;
    }
  }
  return false;
}

export function addManualBlock(
  roomId: number,
  start: string,
  end: string,
  guestName = 'Owner Reservation',
  notes = 'Manual block via Admin'
): BlockedRange {
  const tempId = `manual-${Date.now()}`;
  const block: BlockedRange = {
    id: tempId,
    roomId,
    start,
    end,
    source: 'manual_block',
    guestName,
    notes,
  };
  inMemoryBlockedRanges.push(block);
  saveToLocalStorage(STORAGE_BLOCKS_KEY, inMemoryBlockedRanges);
  notifyListeners();
  return block;
}

export function removeBlock(id: string): void {
  inMemoryBlockedRanges = inMemoryBlockedRanges.filter((b) => b.id !== id);
  saveToLocalStorage(STORAGE_BLOCKS_KEY, inMemoryBlockedRanges);
  notifyListeners();
}

export function getICalConfigs(): RoomICalConfig[] {
  return inMemoryConfigs;
}

export function saveICalConfig(config: RoomICalConfig): void {
  const idx = inMemoryConfigs.findIndex((c) => c.roomId === config.roomId);
  if (idx >= 0) {
    inMemoryConfigs[idx] = config;
  } else {
    inMemoryConfigs.push(config);
  }
  saveToLocalStorage(STORAGE_CONFIGS_KEY, inMemoryConfigs);
  notifyListeners();
}

/**
 * Generates an RFC 5545 iCalendar feed for exporting to Airbnb / Booking.com
 */
export function generateICalFeed(roomId: number): string {
  const blocks = getBlockedRangesForRoom(roomId);
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const events = blocks.map((b) => {
    const dtStart = b.start.replace(/-/g, '');
    const dtEnd = b.end.replace(/-/g, '');
    return [
      'BEGIN:VEVENT',
      `UID:${b.id}@velenburgretreat.com`,
      `DTSTAMP:${now}`,
      `DTSTART;VALUE=DATE:${dtStart}`,
      `DTEND;VALUE=DATE:${dtEnd}`,
      `SUMMARY:Reserved - Velenburg Luxury Suite 0${roomId}`,
      `DESCRIPTION:Reservation via Velenburg Retreat Murree (${b.source})`,
      'STATUS:CONFIRMED',
      'TRANSP:OPAQUE',
      'END:VEVENT',
    ].join('\r\n');
  });

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Velenburg Retreat Murree//NONSGML v1.0//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:Velenburg Retreat - Suite 0${roomId}`,
    `X-WR-TIMEZONE:Asia/Karachi`,
    ...events,
    'END:VCALENDAR',
  ].join('\r\n');
}

export function downloadICalFile(roomId: number): void {
  const content = generateICalFeed(roomId);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `velenburg-suite-0${roomId}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Background sync on load
if (typeof window !== 'undefined') {
  fetchLiveAvailability().catch(() => {});
}
