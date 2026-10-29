# Velenburg Retreat Murree — Antigravity Master Blueprint (Rules, Architecture & Flow)

> **Purpose of this Blueprint:** Drop this file directly into your cloned `aura-one-sage` repository (as `ANTIGRAVITY_MASTER_BLUEPRINT.md` or `RULES.md`) and instruct Antigravity: *"Read `ANTIGRAVITY_MASTER_BLUEPRINT.md` and execute the transformation of this codebase into the Velenburg Retreat Hotel Booking Web App with 0% deviation."*

## TAB 1: STRICT PROJECT RULES & CORRECTED INSTRUCTIONS (`RULES`)

### 1.1 Verified Ground Truth (Zero-Ambiguity Constraints)

* **Brand Name:** **Velenburg Retreat**
* **Location:** Gharial Camp / Upper Topa, Murree, Pakistan (Surrounded by pine forests & mountain valley views).
* **Room Inventory (All 4 Are Luxury Suites):** **Strictly 4 Luxury Rooms** (`Room 1`, `Room 2`, `Room 3`, `Room 4`).
  * *Uniform Luxury Category:* All 4 rooms are top-tier **Luxury Suites**—do NOT mark any room as "Standard", "Economy", or "Basic", and ignore any old notes mentioning 12 rooms or 3 floors.
* **Room Pricing:** **Strictly PKR 18,000 per room, per night** across all 4 luxury rooms.
  * *Formula:* `Total Amount (PKR) = Number of Nights × PKR 18,000 × Number of Rooms Selected`.
* **Mandatory Shared Photos Across ALL 4 Rooms (Kettle Tray & Mirror/Sitting Area):**
  * **Kettle & Toiletries Tray Image:** The photo showing the **Electric Kettle, Tapal Green Tea sachets, and Velenburg black-and-gold branded toiletries (Dental Kit, Vanity Kit, Comb, Soap, Shampoo, Shower Gel, Lotion)** MUST be displayed inside the photo gallery/carousel of **EVERY room (`Room 1`, `Room 2`, `Room 3`, and `Room 4`)**.
  * **Dressing Mirror & White-Door Sunroom Image:** The shared full-length mirror/sitting area photo must also be included in every room's gallery.
* **Food, Refreshments & Amenities Policy (STRICT — No Hotel Meals/Dinner):**
  * **NO Cooked Meals / NO Dinner / NO Arrival Refreshments:** The hotel does **NOT** provide restaurant dinner, lunch, breakfast service, or arrival refreshments (Champagne/Espresso/Tea on arrival).
  * **Action Required on Existing Codebase:** Completely **REMOVE** the *"Refreshment on Arrival"* selector from the `aura-one-sage` contact/reservation form, and do **NOT** write copy promising complimentary breakfast, dinner, or room-service meals.
  * **What IS Provided:** Highlight that every luxury suite includes a **Self-Service Electric Kettle, Complimentary Tapal Green Tea sachets, and Full Velenburg Branded Luxury Toiletries**, plus access to the scenic **Indoor Wooden-Ceiling Lounge & Open Mountain Terrace**.
* **Payment & Checkout Policy (NO Payment Gateway):**
  * **Do NOT** build online credit card forms, Stripe checkouts, or screenshot-upload verification portals on the website.
  * All bookings are completed via **Direct WhatsApp Integration**. The website calculates the exact stay cost and sends a pre-filled booking summary directly to the owner's WhatsApp.
* **Reference Websites to Blend:**
  1. **Base UI & Aesthetic ([Aura Interiors](https://aura-one-sage.vercel.app/)):** Keep the exact luxury layout, typography, smooth animations, glassmorphism cards, pill buttons, and interactive `+` hotspot pins from our existing codebase.
  2. **Hospitality & Conversion Elements ([Fiora Hotel Murree](https://fiorahotel.com/featured-in-national-media)):** Add a **Floating WhatsApp Chat Button** (bottom-right, persistent across all pages), a **Live Murree Weather & Location Top Bar**, and warm mountain-hospitality trust badges.
* **Airbnb & Booking.com Live Sync:**
  * Whenever any of the 4 rooms is booked on **Airbnb** or **Booking.com**, those dates must automatically show as **Booked / Unavailable** on this website's calendar using iCal (`.ics`) feed synchronization.

### 1.2 Visual Identity & Theme Adjustments

* **Color Palette Adaptation:**
  * **Primary Background:** Warm Alabaster / Off-White (`#FAF9F6` and `#FFFFFF`)
  * **Primary Brand Accent:** Velenburg Champagne Gold (`#C5A059` / `#B48A3E`) — matching the black-and-gold Velenburg Retreat toiletries branding in the room photos.
  * **Dark Contrast / Buttons / Footer:** Deep Mountain Charcoal (`#0F172A` / `#1E293B`)
  * **WhatsApp Accent:** Emerald Green (`#25D366`) for the floating WhatsApp widget and primary booking handoff button.
* **Demo Bug Fixes (Mandatory):**
  * Remove the *"Refreshment on Arrival"* options with broken emoji glyphs (`[?] Champagne`, `[?] Espresso`, etc.) completely.
  * Remove third-party room renders containing `CỬA ĐÔNG LUXURY` signage and replace all gallery/room visuals with the **real Velenburg Retreat photos**.

### 1.3 Verified Room & Photo Inventory (All 4 Rooms Include the Kettle & Mirror Photos)

| Suite Name | Nightly Rate | Shared Photos Included in Carousel | Suite-Specific Photos & Luxury Features |
| :--- | :--- | :--- | :--- |
| **Room 1 — Luxury Suite 01** | **PKR 18,000** | ✅ **Kettle & Velenburg Toiletries Tray Photo** + ✅ **Full-Length Mirror / Sunroom Photo** | 4 room photos + 2 shared photos: Dark tufted king headboard, geometric cage pendant lights, running horses & Paris street framed artwork, gold & sheer white drapes, wall-mounted Smart LED TV, self-service electric kettle, Tapal Green Tea & Velenburg toiletries kit. |
| **Room 2 — Luxury Suite 02** | **PKR 18,000** | ✅ **Kettle & Velenburg Toiletries Tray Photo** + ✅ **Full-Length Mirror / Sunroom Photo** | 5 room photos + 2 shared photos: Warm vertical wood-panel feature wall, tufted king bed, wooden-ceiling sunroom lounge with cream 3-seater sofa & red-brick niche, carved wooden chairs, Smart LED TV, self-service electric kettle, Tapal Green Tea & Velenburg toiletries kit. |
| **Room 3 — Luxury Suite 03** | **PKR 18,000** | ✅ **Kettle & Velenburg Toiletries Tray Photo** + ✅ **Full-Length Mirror / Sunroom Photo** | 4 room photos + 2 shared photos: Wood-panel & classic white wall molding, tufted king bed, sunlit wooden-ceiling lounge with cream sofa, backlit red-brick niche with black horse sculptures, Smart LED TV with Netflix remote, self-service electric kettle, Tapal Green Tea & Velenburg toiletries kit. |
| **Room 4 — Luxury Suite 04** | **PKR 18,000** | ✅ **Kettle & Velenburg Toiletries Tray Photo** + ✅ **Full-Length Mirror / Sunroom Photo** | 4 room photos + 2 shared photos: Classic white molded walls, crimson sunset lake artwork, twin bedside lamps + geometric pendants, wooden-ceiling sunroom sofa area opening to outdoor greenery, decorative brick niche, Smart LED TV, self-service electric kettle, Tapal Green Tea & Velenburg toiletries kit. |
| **Indoor Lounge, Kitchen & Open Mountain Terrace** | **Shared Guest Access** | 6 Kitchen / Lounge / Terrace Photos | Polished wooden-ceiling indoor lounge & group table, white woven cane sofas, stainless steel patio gas heaters, self-use kitchen space, and open-air rooftop terrace overlooking Murree's pine hills. *(Note: No hotel dinner/catering service is offered).* |

## TAB 2: SYSTEM ARCHITECTURE & CODEBASE MAPPING (`ARCHITECTURE`)

### 2.1 High-Level Architecture

```
[Customer Browser (React / Next.js / Vite UI)]
       │
       ├── 1. Fetches live room availability ──► GET /api/availability?roomId=1..4
       │                                              │
       │                                              ├─► Reads `Airbnb iCal (.ics)` via `node-ical`
       │                                              ├─► Reads `Booking.com iCal (.ics)` via `node-ical`
       │                                              └─► Reads `Supabase Confirmed Bookings`
       │
       ├── 2. Submits Booking Form ────────────► POST /api/bookings (Saves `pending_whatsapp` record)
       │                                              │
       └── 3. Redirects to WhatsApp (`wa.me`) ────────┴─► Sends pre-filled message to Owner's WhatsApp
```

### 2.2 Folder & File Structure (With Shared Kettle & Mirror Assets)

```
velenburg-retreat/
├── public/
│   └── images/
│       ├── shared/
│       │   ├── kettle-toiletries-tray.jpg  # MANDATORY: Shown in ALL 4 room carousels
│       │   └── mirror-sitting-area.jpg     # MANDATORY: Shown in ALL 4 room carousels
│       ├── room-1/                         # Room 1 specific photos (4 images)
│       ├── room-2/                         # Room 2 specific photos (5 images)
│       ├── room-3/                         # Room 3 specific photos (4 images)
│       ├── room-4/                         # Room 4 specific photos (4 images)
│       └── terrace-lounge/                 # Real photos of Kitchen, Lounge & Mountain Terrace (6 images)
├── src/
│   ├── data/
│   │   └── roomsData.js     # Config for Luxury Suites 1–4, PKR 18,000 price, shared + room photo arrays
│   ├── components/
│   │   ├── TopWeatherBar.jsx        # Live Murree weather + phone + check-in/out times
│   │   ├── Navbar.jsx               # Adapted from Aura header
│   │   ├── HeroBookingBar.jsx       # Quick Check-in / Check-out / Suite selector
│   │   ├── RoomCard.jsx             # Luxury card with image slider (includes kettle photo) & PKR 18,000 badge
│   │   ├── AnnotatedSuitePin.jsx    # Reused Aura '+' hotspot component for in-room products & features
│   │   ├── AvailabilityCalendar.jsx # Date picker with Airbnb/Booking.com booked dates disabled
│   │   ├── WhatsAppBookingModal.jsx # Calculates Nights × 18,000 PKR & opens WhatsApp
│   │   └── FloatingWhatsApp.jsx     # Fiora-inspired persistent bottom-right WhatsApp button
│   └── pages/ (or app/)
│       ├── api/
│       │   ├── availability.js      # Fetches & merges Airbnb + Booking.com iCal + DB bookings
│       │   └── ical/[roomId].js     # Exports website confirmed bookings as .ics for Airbnb/Booking.com
│       └── admin/
│           └── page.jsx             # Simple password-protected owner dashboard to block/unblock dates
```

### 2.3 Exact `src/data/roomsData.js` Structure (Guaranteeing Kettle Photo in Every Room)

```javascript
export const SHARED_ROOM_IMAGES = [
  '/images/shared/kettle-toiletries-tray.jpg', // Shown in EVERY room
  '/images/shared/mirror-sitting-area.jpg',    // Shown in EVERY room
];

export const COMMON_LUXURY_AMENITIES = [
  'Luxury Tufted King-Size Bed',
  'Electric Kettle & Complimentary Tapal Green Tea Sachets',
  'Velenburg Branded Toiletries (Dental Kit, Vanity Kit, Comb, Soap, Shampoo, Lotion)',
  'Wall-Mounted Smart LED TV with Netflix Remote',
  'Private Sunroom / Sitting Area & Full-Length Dressing Mirror',
  'Access to Wooden-Ceiling Mountain View Lounge & Open Terrace',
  'Free High-Speed Wi-Fi & On-Site Parking',
];

export const ROOMS_DATA = [
  {
    id: 1,
    slug: 'room-1',
    name: 'Room 1 — Luxury Suite 01',
    category: 'Luxury Mountain Suite',
    pricePerNightPkr: 18000,
    capacity: '2 Adults (+1 Child)',
    description:
      'An elegant luxury suite featuring classic white wall molding, dark tufted king bed, geometric cage pendant lighting, and a full in-room tea & Velenburg toiletries station.',
    images: [
      '/images/room-1/photo-1.jpg',
      '/images/room-1/photo-2.jpg',
      '/images/room-1/photo-3.jpg',
      '/images/shared/kettle-toiletries-tray.jpg',
      '/images/shared/mirror-sitting-area.jpg',
    ],
    amenities: COMMON_LUXURY_AMENITIES,
  },
  {
    id: 2,
    slug: 'room-2',
    name: 'Room 2 — Luxury Suite 02',
    category: 'Luxury Mountain Suite',
    pricePerNightPkr: 18000,
    capacity: '2 Adults (+1 Child)',
    description:
      'Crafted with a warm vertical wood-panel feature wall, tufted king bed, and a private wooden-ceiling sunroom lounge with a 3-seater cream sofa, electric kettle, and luxury toiletries.',
    images: [
      '/images/room-2/photo-1.jpg',
      '/images/room-2/photo-2.jpg',
      '/images/room-2/photo-3.jpg',
      '/images/room-2/photo-4.jpg',
      '/images/room-2/photo-5.jpg',
      '/images/shared/kettle-toiletries-tray.jpg',
      '/images/shared/mirror-sitting-area.jpg',
    ],
    amenities: COMMON_LUXURY_AMENITIES,
  },
  {
    id: 3,
    slug: 'room-3',
    name: 'Room 3 — Luxury Suite 03',
    category: 'Luxury Mountain Suite',
    pricePerNightPkr: 18000,
    capacity: '2 Adults (+1 Child)',
    description:
      'Combines rich wood paneling with classic architectural molding, a sunlit sofa lounge with a backlit brick art niche, Smart LED TV, electric kettle, and Velenburg toiletries tray.',
    images: [
      '/images/room-3/photo-1.jpg',
      '/images/room-3/photo-2.jpg',
      '/images/room-3/photo-3.jpg',
      '/images/room-3/photo-4.jpg',
      '/images/shared/kettle-toiletries-tray.jpg',
      '/images/shared/mirror-sitting-area.jpg',
    ],
    amenities: COMMON_LUXURY_AMENITIES,
  },
  {
    id: 4,
    slug: 'room-4',
    name: 'Room 4 — Luxury Suite 04',
    category: 'Luxury Mountain Suite',
    pricePerNightPkr: 18000,
    capacity: '2 Adults (+1 Child)',
    description:
      'A serene luxury retreat with warm bedside and pendant lighting, a bright wooden-ceiling sunroom sofa lounge opening toward the greenery, electric kettle, and full Velenburg amenities.',
    images: [
      '/images/room-4/photo-1.jpg',
      '/images/room-4/photo-2.jpg',
      '/images/room-4/photo-3.jpg',
      '/images/room-4/photo-4.jpg',
      '/images/shared/kettle-toiletries-tray.jpg',
      '/images/shared/mirror-sitting-area.jpg',
    ],
    amenities: COMMON_LUXURY_AMENITIES,
  },
];
```

### 2.4 Component Transformation Table (From `aura-one-sage` to `velenburg-retreat`)

| Existing `aura-one-sage` Section | New `velenburg-retreat` Section | Action Required |
| :--- | :--- | :--- |
| `EST. 1994 · HOSPITALITY & RESIDENTIAL INTERIORS` | `VELENBURG RETREAT · GHARIAL CAMP, MURREE` | Replace showroom cities with `Murree Live Weather`, `Check-in: 2:00 PM`, and direct WhatsApp click link. |
| Hero: *"The World's Finest Hotels"* | Hero: *"Peaceful Mountain Luxury in the Heart of Murree"* | Use terrace/mountain view hero background + embed the **Quick Availability Search Bar** (`Check-in`, `Check-out`, `Suite 1–4`, `Check Availability`). |
| Stats Bar (`42 Projects`, `19 Countries`) | Retreat Highlights Bar | `4 Luxury Suites` • `PKR 18,000 / Night` • `In-Room Kettle & Luxury Amenities` • `100% Pine Valley Views`. |
| Annotated Interior (`$8,400` sofa pins) | Interactive Suite Products & Amenities | Place `+` pins on Room & Kettle Tray photos: (1) Tufted King Bed, (2) Electric Kettle & Tapal Green Tea, (3) Velenburg Branded Toiletries Kit, (4) Smart LED TV & Sunroom Lounge. |
| The Collection (`Living`, `Bedroom`, etc.) | **Our 4 Luxury Suites (`Room 1` – `Room 4`)** | 4 detailed cards with multi-photo carousel (including the Kettle Tray & Mirror photos in every card), amenity tags, and `Book for PKR 18,000/Night` CTA. |
| Materials Provenance (`Onyx`, `Marble`) | **Mountain View Lounge & Open Terrace** | Showcase the 6 Kitchen & Lounge photos highlighting wooden ceilings, woven cane seating, patio heaters, and valley views (strictly no mention of cooked meals or dinner service). |
| `/bespoke` & `/contact` Forms | **Interactive Booking & Price Calculator** | Remove *"Refreshment on Arrival"* completely. Step 1: Pick Suite (1–4) → Step 2: Select Dates (Airbnb/Booking.com dates disabled) → Step 3: View Total (`Nights × PKR 18,000`) → Step 4: Send to WhatsApp. |

### 2.5 Database Schema (Supabase SQL)

```sql
-- 1. Rooms Table (Exactly 4 Uniform Luxury Suites)
CREATE TABLE rooms (
  id INT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  price_per_night_pkr INT NOT NULL DEFAULT 18000,
  airbnb_ical_url TEXT,
  booking_com_ical_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO rooms (id, name, slug, price_per_night_pkr) VALUES
  (1, 'Room 1 — Luxury Suite 01', 'room-1', 18000),
  (2, 'Room 2 — Luxury Suite 02', 'room-2', 18000),
  (3, 'Room 3 — Luxury Suite 03', 'room-3', 18000),
  (4, 'Room 4 — Luxury Suite 04', 'room-4', 18000);

-- 2. Bookings & Manual Blocks Table
CREATE TABLE bookings (
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
  source TEXT NOT NULL DEFAULT 'website',          -- 'website' | 'manual_block'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## TAB 3: COMPLETE BOOKING FLOW, WHATSAPP PAYLOAD & AIRBNB/BOOKING.COM SYNC (`FLOW`)

### 3.1 End-to-End Booking Lifecycle

1. **Calendar Load & Auto-Sync:**
   * When a user views a room or opens the booking calendar, the frontend fetches `/api/availability?roomId=1`.
   * The backend fetches the room's `airbnb_ical_url` and `booking_com_ical_url` (using `node-ical`), extracts every `VEVENT` (`DTSTART` to `DTEND`), and combines them with all rows in `bookings` where `status = 'confirmed'`.
   * The API returns an array of unavailable date ranges: `[{ start: '2026-11-05', end: '2026-11-08', source: 'airbnb' }]`.
   * The React DatePicker disables those dates so no customer can select dates already booked on Airbnb, Booking.com, or directly with the owner.
2. **Price Calculation:**
   * Customer selects available `Check-in` and `Check-out` dates.
   * Frontend computes `nights = differenceInCalendarDays(checkOut, checkIn)`.
   * Frontend computes `totalPrice = nights * 18000`.
   * UI displays: `PKR 18,000 × {nights} Night(s) = PKR {totalPrice.toLocaleString()}` along with a clear note: *"Includes luxury suite stay, in-room electric kettle, green tea & Velenburg toiletries kit, and terrace lounge access."*
3. **Direct WhatsApp Handoff:**
   * Customer enters `Full Name`, `Phone / WhatsApp Number`, and optional `Special Requests`, then clicks **"Book via WhatsApp"**.
   * Frontend optionally logs the inquiry in `bookings` (`status = 'pending_whatsapp'`) and immediately opens `https://wa.me/<OWNER_WHATSAPP_NUMBER>?text=<ENCODED_MESSAGE>`.
4. **Owner Confirmation (Zero Payment Gateway Friction):**
   * Owner receives the structured message on WhatsApp, shares Bank Transfer / EasyPaisa / JazzCash account details on WhatsApp, and once the guest pays, the owner toggles the booking status to **`confirmed`** in the simple `/admin` dashboard (or blocks the date on their Airbnb calendar app, which automatically syncs back to the website!).

### 3.2 Reference Implementation: Airbnb & Booking.com iCal Sync API (`/api/availability.js`)

```javascript
import ical from 'node-ical';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  const { roomId } = req.query;
  if (!roomId) return res.status(400).json({ error: 'roomId is required' });

  // 1. Fetch room iCal URLs
  const { data: room } = await supabase
    .from('rooms')
    .select('airbnb_ical_url, booking_com_ical_url')
    .eq('id', Number(roomId))
    .single();

  // 2. Fetch confirmed bookings from website DB
  const { data: dbBookings } = await supabase
    .from('bookings')
    .select('check_in, check_out, source')
    .eq('room_id', Number(roomId))
    .eq('status', 'confirmed');

  const blockedRanges = (dbBookings || []).map((b) => ({
    start: b.check_in,
    end: b.check_out,
    source: b.source,
  }));

  // 3. Parse live iCal feeds from Airbnb & Booking.com
  const icalUrls = [
    { url: room?.airbnb_ical_url, source: 'airbnb' },
    { url: room?.booking_com_ical_url, source: 'booking_com' },
  ].filter((item) => Boolean(item.url));

  for (const feed of icalUrls) {
    try {
      const events = await ical.async.fromURL(feed.url);
      for (const key in events) {
        const ev = events[key];
        if (ev.type === 'VEVENT' && ev.start && ev.end) {
          blockedRanges.push({
            start: new Date(ev.start).toISOString().split('T')[0],
            end: new Date(ev.end).toISOString().split('T')[0],
            source: feed.source,
          });
        }
      }
    } catch (err) {
      console.error(`Failed to parse iCal feed (${feed.source}):`, err.message);
    }
  }

  return res.status(200).json({ roomId: Number(roomId), pricePerNightPkr: 18000, blockedRanges });
}
```

### 3.3 Reference Implementation: WhatsApp Booking URL Generator (`src/utils/whatsapp.js`)

```javascript
export function buildWhatsAppBookingUrl({
  ownerPhone = '923000000000', // Replace with Client's actual WhatsApp number (no '+' sign)
  bookingRef,
  roomName,
  checkIn,
  checkOut,
  nights,
  guests,
  guestName,
  guestPhone,
  notes,
}) {
  const ratePerNight = 18000;
  const totalAmount = nights * ratePerNight;

  const message = [
    `Assalam-o-Alaikum *Velenburg Retreat*! 🌲`,
    `I would like to request a luxury suite reservation:`,
    ``,
    `• *Booking Ref:* ${bookingRef}`,
    `• *Selected Suite:* ${roomName}`,
    `• *Check-in:* ${checkIn} (2:00 PM)`,
    `• *Check-out:* ${checkOut} (12:00 PM)`,
    `• *Total Nights:* ${nights} Night(s)`,
    `• *Rate:* PKR 18,000 / Night`,
    `• *Total Amount:* *PKR ${totalAmount.toLocaleString()}*`,
    ``,
    `*Guest Details:*`,
    `• *Name:* ${guestName}`,
    `• *Phone:* ${guestPhone}`,
    `• *Guests:* ${guests}`,
    notes ? `• *Special Request:* ${notes}` : null,
    ``,
    `Please confirm availability for these dates and share your payment details (Bank Transfer / EasyPaisa / JazzCash) to confirm my booking.`,
  ]
    .filter(Boolean)
    .join('\n');

  return `https://wa.me/${ownerPhone}?text=${encodeURIComponent(message)}`;
}
```