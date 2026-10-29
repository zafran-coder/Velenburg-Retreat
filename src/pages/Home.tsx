import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BedDouble, Coffee, Mountain, Sparkles, MessageCircle, MapPin, Trees, CheckCircle2, Calendar, ArrowDown } from 'lucide-react';
import PageTransition, { Reveal, Stagger, StaggerItem, TextReveal } from '../components/Transitions';
import TiltCard from '../components/Interactive3DCard';
import HeroBookingBar from '../components/HeroBookingBar';
import RoomCard from '../components/RoomCard';
import AnnotatedSuitePin from '../components/AnnotatedSuitePin';
import InstagramHighlights from '../components/InstagramHighlights';
import WhatsAppBookingModal from '../components/WhatsAppBookingModal';
import RoomDetailModal from '../components/RoomDetailModal';
import TravelerGuide from '../components/TravelerGuide';
import { AuroraBackground, SectionHead, MagneticButton, CountUp } from '../components/ui';
import { ROOMS_DATA, RoomSuite, TERRACE_LOUNGE_IMAGES } from '../data/roomsData';
import { RETREAT_CONFIG } from '../data/retreatConfig';
import { luxuryAudio } from '../utils/audio';

const click = () => luxuryAudio.playChime(640, 0.09);

const retreatHighlights = [
  { value: 4, suffix: ' Suites', label: 'Uniform Luxury Mountain Suites' },
  { value: 18000, suffix: ' PKR', label: 'Fixed Price Per Night (All Suites)' },
  { value: 7200, suffix: ' ft', label: 'Elevation at Gharial Camp' },
  { value: 100, suffix: '%', label: 'Pine Forest & Valley Views' },
];

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomSuite | null>(null);
  const [detailRoom, setDetailRoom] = useState<RoomSuite | null>(null);

  const handleOpenBooking = (room?: RoomSuite) => {
    setSelectedRoom(room || null);
    setModalOpen(true);
  };

  const handleOpenDetails = (room: RoomSuite) => {
    luxuryAudio.playChime(660, 0.08);
    setDetailRoom(room);
  };

  const scrollToBooking = () => {
    luxuryAudio.playChime(640, 0.09);
    const bookingEl = document.getElementById('hero-booking-bar');
    if (bookingEl) {
      bookingEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      handleOpenBooking();
    }
  };

  const whatsappDirectUrl = `https://wa.me/${RETREAT_CONFIG.contact.ownerWhatsApp}?text=Assalam-o-Alaikum%20Velenburg%20Retreat!%20🌲%0A%0AI%20would%20like%20to%20inquire%20about%20suite%20availability%20at%20Gharial%20Camp,%20Murree%20(PKR%2018,000%20/%20Night).`;

  return (
    <PageTransition>
      {/* ══════════ HERO SECTION WITH REAL ESTATE OUTLOOK ══════════ */}
      <section className="relative pt-32 sm:pt-40 pb-24 sm:pb-32 overflow-hidden bg-charcoal text-alabaster min-h-[92vh] flex items-center">
        {/* Real Exterior Outlook Background with Bright Natural Sunlight */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/velenburg-exterior.jpg"
            alt="Velenburg Retreat Murree Real Exterior Outlook"
            className="w-full h-full object-cover object-center filter brightness-100 contrast-[1.02]"
          />
          {/* Gentle, light scrim: subtle top navbar shade, crystal clear midground for the villa, gentle bottom taper */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/15 to-black/45" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Editorial Floating Hero Panel - Crystal clear frosted glass */}
          <div className="text-center max-w-4xl mx-auto backdrop-blur-md bg-black/25 border border-white/20 rounded-2xl p-6 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            {/* Top Location & Bio Badge with Google Maps Rating */}
            <Reveal direction="down">
              <a
                href={RETREAT_CONFIG.contact.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="View Velenburg Retreat on Google Maps (4.9 Rating from 27 Reviews)"
                className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-black/45 hover:bg-black/65 backdrop-blur-md border border-white/20 shadow-md text-white text-xs font-semibold uppercase tracking-[0.2em] transition-all cursor-pointer group"
              >
                <span className="flex items-center gap-1.5 text-[#DFBF77]">
                  <MapPin size={14} strokeWidth={1.75} className="group-hover:scale-110 transition-transform" />
                  <span>{RETREAT_CONFIG.locationBadge}</span>
                </span>
                <span className="text-white/40">•</span>
                <span className="text-amber-300 font-bold flex items-center gap-1 normal-case tracking-normal">
                  <span>★ 4.9</span>
                  <span className="text-white/80 font-normal text-xs">(27 Google Reviews)</span>
                </span>
              </a>
            </Reveal>

            {/* Main Headline (Strict h1 Typography Standard) */}
            <h1 className="mt-5 sm:mt-7 text-4xl md:text-6xl font-bold text-white leading-[1.1] tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
              Peaceful Mountain Luxury in <br className="hidden sm:inline" />
              <span className="text-[#DFBF77]">The Heart of Murree.</span>
            </h1>

            {/* Subtext with Strict 16px Body Copy Standard & Natural Hospitality Language */}
            <Reveal delay={0.3} direction="blur">
              <p className="mt-4 sm:mt-6 text-base font-normal text-slate-100 max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
                Located in the quiet pine hills of Gharial Camp, Upper Topa (7,200 ft elevation). Enjoy <strong>4 private luxury suites</strong> at <strong>PKR 18,000 / Night</strong> with private sunrooms, in-room electric kettle, Tapal Green Tea, branded toiletries, and panoramic valley views.
              </p>
            </Reveal>

            {/* Hero Quick Action Buttons (Strict Standard Buttons) */}
            <Reveal delay={0.45}>
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5">
                <MagneticButton className="w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={scrollToBooking}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-md hover:shadow-lg cursor-pointer"
                  >
                    <Calendar size={16} strokeWidth={1.75} className="text-white shrink-0" />
                    <span>Select Dates & Book on WhatsApp</span>
                    <ArrowDown size={15} strokeWidth={1.75} className="shrink-0" />
                  </button>
                </MagneticButton>

                <MagneticButton className="w-full sm:w-auto">
                  <Link
                    to="/collections"
                    onClick={click}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-slate-300 bg-white/10 hover:bg-white text-white hover:text-slate-900 hover:border-[#DFBF77] text-sm font-semibold transition-all backdrop-blur-md cursor-pointer"
                  >
                    <span>Explore 4 Luxury Suites</span>
                    <ArrowRight size={15} strokeWidth={1.75} className="shrink-0" />
                  </Link>
                </MagneticButton>
              </div>
            </Reveal>

            {/* Trust Policy Strip */}
            <Reveal delay={0.6}>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-medium text-white">
                <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/10">
                  <CheckCircle2 size={16} strokeWidth={1.75} className="text-emerald-400 shrink-0" /> PKR 18,000 / Night
                </span>
                <span className="hidden xs:inline text-white/30">•</span>
                <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/10">
                  <CheckCircle2 size={16} strokeWidth={1.75} className="text-emerald-400 shrink-0" /> In-Room Kettle & Toiletries Kit
                </span>
                <span className="hidden xs:inline text-white/30">•</span>
                <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/10">
                  <CheckCircle2 size={16} strokeWidth={1.75} className="text-emerald-400 shrink-0" /> Direct WhatsApp Booking (+92 315 5167829)
                </span>
              </div>
            </Reveal>
          </div>

          {/* QUICK AVAILABILITY SEARCH BAR */}
          <div id="hero-booking-bar" className="mt-12">
            <HeroBookingBar onSuiteSelect={(id) => {
              const r = ROOMS_DATA.find((x) => x.id === id);
              if (r) setSelectedRoom(r);
            }} />
          </div>
        </div>
      </section>

      {/* ══════════ RETREAT STATS / HIGHLIGHTS BAR ══════════ */}
      <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-alabaster">
        <div className="max-w-7xl mx-auto">
          <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {retreatHighlights.map((s) => (
              <StaggerItem key={s.label}>
                <TiltCard depth={6}>
                  <div className="rounded-2xl border border-slate-200/80 bg-white p-6 h-full text-center shadow-xs hover:border-[#B48A3E] transition-colors flex flex-col justify-between">
                    <CountUp
                      to={s.value}
                      suffix={s.suffix}
                      className="block text-3xl md:text-4xl font-bold text-[#0F172A]"
                    />
                    <span className="block mt-2 text-xs text-slate-600 font-medium">
                      {s.label}
                    </span>
                  </div>
                </TiltCard>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ══════════ THE 4 LUXURY SUITES SHOWCASE GRID ══════════ */}
      <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto">
          <SectionHead
            eyebrow="Accommodations"
            title="Our 4 Luxury Suites"
            highlight={['Luxury', 'Suites']}
            description="Every room at Velenburg is an all-inclusive Luxury Suite at PKR 18,000 / Night. Each suite includes a tufted king bed, private sunroom sitting area, in-room electric kettle with Tapal Green Tea, and signature toiletries kit."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {ROOMS_DATA.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onViewDetails={handleOpenDetails}
                onSelectForBooking={() => handleOpenBooking(room)}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/collections"
              onClick={click}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#0F172A] hover:bg-slate-800 text-white text-sm font-semibold transition-all shadow-sm hover:shadow-md cursor-pointer"
            >
              <span>View All 4 Suites & Full Floorplans</span>
              <ArrowRight size={16} strokeWidth={1.75} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════ ANNOTATED SUITE INTERIOR (+ PINS) ══════════ */}
      <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-alabaster">
        <div className="max-w-7xl mx-auto">
          <SectionHead
            eyebrow="Interactive Experience"
            title="In-Room Luxury & Amenities"
            highlight={['Amenities']}
            description="Inspect the authentic features included in each suite. Tap the interactive hotspot pins (+) to view our tufted king beds, electric kettle tea station, and Velenburg branded toiletries."
          />

          <div className="mt-10">
            <AnnotatedSuitePin
              imageSrc="/images/room-2/photo-1.jpg"
              imageAlt="Room 2 Luxury Suite Interior"
              hotspots={ROOMS_DATA[1].hotspots || []}
              title="Suite 02 — Vertical Wood Feature Wall & Sunroom"
              subtitle="All 4 rooms feature tufted king beds, in-room kettle tray, and toiletries"
              onInspectSuite={() => handleOpenDetails(ROOMS_DATA[1])}
            />
          </div>
        </div>
      </section>

      {/* ══════════ MOUNTAIN VIEW LOUNGE & OPEN TERRACE ══════════ */}
      <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-[#0F172A] text-alabaster overflow-hidden">
        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#DFBF77]">
                Shared Guest Access
              </span>
              <h2 className="text-3xl md:text-4xl font-bold leading-[1.2] text-white tracking-tight mt-2">
                Mountain View Lounge & Open Terrace
              </h2>
              <p className="text-base font-normal leading-relaxed text-slate-300 mt-3 max-w-2xl">
                Relax in our polished wooden-ceiling indoor lounge with woven cane seating and gas patio heaters, or step onto the open stone terrace overlooking the pine valleys of Murree. A clean self-use guest kitchen space is available for drinks and snacks (no cooked meals or dinner service).
              </p>
            </div>

            <Link
              to="/bespoke"
              onClick={click}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white text-slate-900 hover:border-[#B48A3E] px-6 py-3 text-sm font-semibold transition-all shadow-sm self-start md:self-auto cursor-pointer"
            >
              <span>Explore Lounge Gallery</span>
              <ArrowRight size={15} strokeWidth={1.75} />
            </Link>
          </div>

          {/* Real Photo Grid of Terrace & Lounge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TERRACE_LOUNGE_IMAGES.slice(0, 6).map((item, index) => (
              <div
                key={index}
                className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-gold/25 shadow-card hover:border-gold/60 hover:shadow-2xl transition-all duration-300"
              >
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent opacity-80" />
                </div>
                <div className="absolute bottom-0 inset-x-0 p-5">
                  <span className="text-[10px] uppercase font-bold text-gold-light tracking-wider block mb-1">
                    Retreat Amenity
                  </span>
                  <h4 className="text-base font-bold text-white group-hover:text-gold-light transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-alabaster/70 mt-1 leading-snug line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ OFFICIAL INSTAGRAM HIGHLIGHTS (@velenburg) ══════════ */}
      <InstagramHighlights />

      {/* ══════════ TRAVELER GUIDE, SEASONS & FAQS ══════════ */}
      <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-alabaster">
        <div className="max-w-7xl mx-auto">
          <TravelerGuide />
        </div>
      </section>

      {/* ══════════ DIRECT WHATSAPP VIP RESERVATION CARD ══════════ */}
      <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-alabaster">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden bg-[#0F172A] text-alabaster border border-slate-700/80 shadow-2xl p-6 sm:p-10 md:p-14">
            {/* Ambient Lighting Orbs */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#B48A3E]/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

            <div className="relative z-10">
              {/* Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-6 border-b border-white/10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-[#B48A3E]/40 text-[#DFBF77] text-xs font-semibold uppercase tracking-[0.2em]">
                  <Sparkles size={14} strokeWidth={1.75} className="text-[#B48A3E]" />
                  <span>Direct Host Reservations · Gharial Camp</span>
                </div>

                <div className="inline-flex items-center gap-2 text-xs font-medium text-white bg-black/40 px-3.5 py-1.5 rounded-full border border-white/15">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">Uniform Rate:</span>
                  <span className="font-bold text-white text-sm">PKR 18,000 / Night</span>
                </div>
              </div>

              {/* Main Headline & Description */}
              <div className="max-w-3xl">
                <h2 className="text-3xl md:text-4xl font-bold leading-[1.2] text-white tracking-tight">
                  Reserve Your Luxury Mountain Suite Directly on WhatsApp
                </h2>

                <p className="mt-4 text-base font-normal leading-relaxed text-slate-300 max-w-2xl">
                  No credit card forms, booking markups, or third-party fees. Check live suite availability, calculate your stay total at our uniform rate of <strong>PKR 18,000 / Night</strong>, and message retreat owner Mirza directly on WhatsApp for instant confirmation.
                </p>
              </div>

              {/* 4 In-Suite Amenities & Policy Micro-Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-8 pt-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                  <div className="h-9 w-9 rounded-xl bg-[#B48A3E]/15 border border-[#B48A3E]/30 flex items-center justify-center shrink-0 text-[#DFBF77]">
                    <CheckCircle2 size={16} strokeWidth={1.75} />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[#DFBF77] font-semibold block">Rate Guarantee</span>
                    <p className="text-sm text-white font-semibold mt-0.5">PKR 18,000 / Night</p>
                    <span className="text-xs text-slate-400 block font-normal">All 4 luxury suites</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                  <div className="h-9 w-9 rounded-xl bg-[#B48A3E]/15 border border-[#B48A3E]/30 flex items-center justify-center shrink-0 text-[#DFBF77]">
                    <Coffee size={16} strokeWidth={1.75} />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[#DFBF77] font-semibold block">In-Room Tea Station</span>
                    <p className="text-sm text-white font-semibold mt-0.5">Electric Kettle & Tea</p>
                    <span className="text-xs text-slate-400 block font-normal">Complimentary Tapal sachets</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                  <div className="h-9 w-9 rounded-xl bg-[#B48A3E]/15 border border-[#B48A3E]/30 flex items-center justify-center shrink-0 text-[#DFBF77]">
                    <Sparkles size={16} strokeWidth={1.75} />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[#DFBF77] font-semibold block">Luxury Amenities</span>
                    <p className="text-sm text-white font-semibold mt-0.5">Velenburg Toiletries Kit</p>
                    <span className="text-xs text-slate-400 block font-normal">Signature black & gold kit</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                  <div className="h-9 w-9 rounded-xl bg-[#B48A3E]/15 border border-[#B48A3E]/30 flex items-center justify-center shrink-0 text-[#DFBF77]">
                    <Mountain size={16} strokeWidth={1.75} />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[#DFBF77] font-semibold block">7,200 Ft Ridge</span>
                    <p className="text-sm text-white font-semibold mt-0.5">Mountain Lounge Access</p>
                    <span className="text-xs text-slate-400 block font-normal">Open terrace & patio heaters</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Row (Strict Standard Buttons) */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleOpenBooking()}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-semibold transition-all shadow-sm hover:shadow-md cursor-pointer"
                  >
                    <MessageCircle size={16} strokeWidth={1.75} className="fill-white" />
                    <span>Reserve Suite via WhatsApp</span>
                    <ArrowRight size={15} strokeWidth={1.75} />
                  </button>

                  <a
                    href={`tel:${RETREAT_CONFIG.contact.displayPhone.replace(/\s+/g, '')}`}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-slate-300 bg-white/10 hover:bg-white text-white hover:text-slate-900 text-sm font-semibold transition-all cursor-pointer"
                  >
                    <span>Direct Call: {RETREAT_CONFIG.contact.displayPhone}</span>
                  </a>
                </div>

                {/* Policies & Google Rating Pill */}
                <div className="flex flex-wrap items-center sm:justify-end gap-2 text-xs text-slate-300">
                  <span className="flex items-center gap-1.5 text-amber-300 font-semibold bg-black/40 px-3 py-1 rounded-full border border-white/10">
                    ★ 4.9 (27 Google Reviews)
                  </span>
                  <span>•</span>
                  <span>Check-in: 2:00 PM | Check-out: 12:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROOM DETAIL INSPECTION MODAL */}
      <RoomDetailModal
        isOpen={Boolean(detailRoom)}
        room={detailRoom}
        onClose={() => setDetailRoom(null)}
        onBookNow={(room) => {
          setDetailRoom(null);
          handleOpenBooking(room);
        }}
      />

      {/* WHATSAPP BOOKING MODAL */}
      <WhatsAppBookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialRoom={selectedRoom}
      />
    </PageTransition>
  );
}
