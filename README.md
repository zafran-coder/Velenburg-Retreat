# 🌲 Velenburg Retreat Murree — Luxury Booking & Availability Engine

A bespoke hospitality web application for **Velenburg Retreat** (Gharial Camp, Murree, Pakistan), blending alpine aesthetic luxury with a zero-friction direct reservation workflow.

---

## ✨ Features

- **Direct WhatsApp Handoff:** Frictionless checkout calculating stay totals (`PKR 18,000/night`) with pre-filled WhatsApp booking summaries (zero payment gateway fees or card forms).
- **Two-Way iCal OTA Sync:** Live calendar integration with Airbnb and Booking.com feeds using server-side RFC 5545 parsing (`node-ical`).
- **Resilient Hybrid Backend:** Powered by Supabase cloud database with automatic `LocalStorage` failover ensuring 100% uptime even during free-tier project pauses.
- **Secure Owner Dashboard (`/admin`):** Server-side protected admin panel for suite date blocking, customer inquiry tracking, and iCal feed management.
- **Alpine Mountain Atmosphere:** Live Murree weather indicator, responsive suite showcase, interactive amenities, and luxury soundscapes.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion, Lucide Icons, Canvas Confetti
- **Backend & Serverless:** Vercel Serverless Functions (`/api`), Node-iCal
- **Database:** Supabase (PostgreSQL) with Row-Level Security (RLS)
- **Deployment:** Vercel

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/zafran-coder/Velenburg-Retreat.git
cd Velenburg-Retreat
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Copy `.env.example` to `.env.local` and add your Supabase credentials:
```bash
cp .env.example .env.local
```

Fill in:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ADMIN_PASSWORD=your_admin_password
```

### 4. Database Setup
Run the SQL queries in `supabase/schema.sql` inside your Supabase project's SQL Editor to create the `rooms` and `bookings` tables.

### 5. Run development server
```bash
npm run dev
```

### 6. Build for production
```bash
npm run build
```

---

## 🔒 Security

- All administrative actions (blocking dates, unblocking, updating OTA feeds) require server-side authentication verification.
- Sensitive environment variables are excluded from the client-side JavaScript bundle and protected via `.gitignore`.
- Row-Level Security (RLS) policies guard database access.

---

## 📄 License
Private repository for Velenburg Retreat Murree. All rights reserved.
