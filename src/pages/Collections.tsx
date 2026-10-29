import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BedDouble,
  Coffee,
  Sparkles,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MessageCircle,
  Flame,
  Wifi,
  Tv,
  Eye,
  Info,
  Clock,
  MapPin,
  X,
  Share2
} from 'lucide-react';
import PageTransition, { Reveal, Stagger, StaggerItem } from '../components/Transitions';
import TiltCard from '../components/Interactive3DCard';
import { AuroraBackground, SectionHead } from '../components/ui';
import WhatsAppBookingModal from '../components/WhatsAppBookingModal';
import RoomDetailModal from '../components/RoomDetailModal';
import { ROOMS_DATA, RoomData } from '../data/roomsData';
import { RETREAT_CONFIG, formatPKR } from '../data/retreatConfig';
import { luxuryAudio } from '../utils/audio';

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Collections() {
  const [searchParams, setSearchParams] = useSearchParams();
  const roomParam = searchParams.get('room');

  const [selectedSlug, setSelectedSlug] = useState<string>(roomParam || 'all');
  const [inspectRoom, setInspectRoom] = useState<RoomData | null>(null);
  const [activePhotoIndices, setActivePhotoIndices] = useState<Record<string, number>>({});
  const [modalRoom, setModalRoom] = useState<RoomData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (roomParam) {
      setSelectedSlug(roomParam);
      const found = ROOMS_DATA.find((r) => r.slug === roomParam);
      if (found) {
        setInspectRoom(found);
      }
    } else {
      setSelectedSlug('all');
    }
  }, [roomParam]);

  const displayedRooms = useMemo(() => {
    if (selectedSlug === 'all') return ROOMS_DATA;
    return ROOMS_DATA.filter((r) => r.slug === selectedSlug);
  }, [selectedSlug]);

  const handleSelectTab = (slug: string) => {
    luxuryAudio.playChime(580, 0.08);
    setSelectedSlug(slug);
    if (slug === 'all') {
      searchParams.delete('room');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ room: slug });
    }
  };

  const nextPhoto = (roomId: number | string, total: number, e: React.MouseEvent) => {
    e.stopPropagation();
    luxuryAudio.playChime(640, 0.05);
    const key = String(roomId);
    setActivePhotoIndices((prev) => ({
      ...prev,
      [key]: ((prev[key] || 0) + 1) % total,
    }));
  };

  const prevPhoto = (roomId: number | string, total: number, e: React.MouseEvent) => {
    e.stopPropagation();
    luxuryAudio.playChime(560, 0.05);
    const key = String(roomId);
    setActivePhotoIndices((prev) => ({
      ...prev,
      [key]: ((prev[key] || 0) - 1 + total) % total,
    }));
  };

  const handleOpenBooking = (room: RoomData) => {
    luxuryAudio.playSuccessChime();
    setModalRoom(room);
    setIsModalOpen(true);
  };

  return (
    <PageTransition>
      {/* ================= HERO HEADER WITH REAL ESTATE OUTLOOK ================= */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden bg-[#0F172A] text-alabaster border-b border-slate-700/80">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/images/velenburg-exterior.jpg"
            alt="Velenburg Retreat Murree Real Exterior Outlook"
            className="w-full h-full object-cover object-center filter brightness-100 contrast-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/45" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-[#DFBF77] text-xs font-semibold tracking-[0.2em] uppercase mb-6 shadow-md">
              <Sparkles size={14} strokeWidth={1.75} className="text-[#B48A3E]" />
              <span>Gharial Camp, Murree · 7,200 Ft Elevation</span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight max-w-3xl mx-auto leading-[1.1] drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)]">
              Our 4 Luxury Suites. <br />
              <span className="text-[#DFBF77]">Thoughtfully Designed for Pure Rest.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-6 text-base font-normal text-slate-100 max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
              Every room at Velenburg is an all-inclusive Luxury Suite at <strong className="text-white font-semibold">PKR 18,000 / Night</strong>.
              Enjoy warm timber accents, ensuite private bath, in-room electric kettle with Tapal Green Tea, branded toiletries, and panoramic views of Murree pine hills.
            </p>
          </Reveal>

          {/* Quick Filter Tabs */}
          <Reveal delay={0.3}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => handleSelectTab('all')}
                className={`px-5 py-2.5 rounded-full text-xs tracking-wider uppercase transition-all duration-300 font-semibold cursor-pointer ${
                  selectedSlug === 'all'
                    ? 'bg-[#B48A3E] text-white shadow-md'
                    : 'bg-white/10 text-white/90 hover:bg-white/20 border border-white/15'
                }`}
              >
                All 4 Luxury Suites
              </button>
              {ROOMS_DATA.map((r) => (
                <button
                  key={r.id}
                  onClick={() => handleSelectTab(r.slug)}
                  className={`px-5 py-2.5 rounded-full text-xs tracking-wider uppercase transition-all duration-300 font-semibold cursor-pointer ${
                    selectedSlug === r.slug
                      ? 'bg-[#B48A3E] text-white shadow-md'
                      : 'bg-white/10 text-white/90 hover:bg-white/20 border border-white/15'
                  }`}
                >
                  {r.name}
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= SUITES SHOWCASE GRID ================= */}
      <section className="relative py-16 md:py-24 bg-alabaster">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-slate-200/80 pb-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B48A3E]">
                Authentic Photography & Inventory
              </span>
              <h2 className="text-3xl md:text-4xl font-bold leading-[1.2] text-[#0F172A] tracking-tight mt-2">
                {selectedSlug === 'all' ? 'All Four Luxury Suites' : displayedRooms[0]?.name}
              </h2>
            </div>
            <div className="text-xs text-slate-700 bg-white border border-slate-200/80 px-4 py-2 rounded-xl flex items-center gap-2 shadow-xs">
              <ShieldCheck size={16} strokeWidth={1.75} className="text-[#B48A3E]" />
              <span>Transparent Rate: <strong>PKR 18,000 / Night</strong> for every suite</span>
            </div>
          </div>

          <div className="space-y-16">
            {displayedRooms.map((room, idx) => {
              const currentPhotoIdx = activePhotoIndices[room.id] || 0;
              const currentPhoto = room.photos[currentPhotoIdx];

              return (
                <article
                  key={room.id}
                  id={room.slug}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-md overflow-hidden hover:border-[#B48A3E] transition-all duration-300"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                    {/* Visual Media Column (7 Cols) */}
                    <div
                      onClick={() => setInspectRoom(room)}
                      className="lg:col-span-7 relative bg-[#0F172A] group min-h-[420px] md:min-h-[480px] flex flex-col justify-between overflow-hidden cursor-pointer"
                    >
                      {/* Active Image */}
                      <div className="absolute inset-0">
                        <img
                          src={currentPhoto.url}
                          alt={currentPhoto.caption}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                      </div>

                      {/* Hover Overlay Cue */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/35 z-10 pointer-events-none">
                        <span className="px-4 py-2 rounded-full text-xs font-semibold text-white bg-black/70 border border-[#B48A3E]/40 shadow-lg flex items-center gap-2 backdrop-blur-md">
                          <Eye size={15} strokeWidth={1.75} className="text-[#B48A3E]" />
                          <span>View Full Suite Details & All Photos</span>
                        </span>
                      </div>

                      {/* Top Badges */}
                      <div className="relative z-10 p-6 flex items-center justify-between">
                        <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#0F172A]/85 text-[#DFBF77] border border-[#B48A3E]/40 backdrop-blur-md">
                          Suite 0{idx + 1}
                        </span>
                        {currentPhoto.isShared && (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#B48A3E] text-white shadow-md backdrop-blur-md">
                            Shared Signature Amenity
                          </span>
                        )}
                      </div>

                      {/* Carousel Controls */}
                      <div className="relative z-10 p-6 flex flex-col gap-4">
                        <p className="text-xs text-white/90 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-lg w-fit border border-white/10">
                          {currentPhoto.caption}
                        </p>

                        <div className="flex items-center justify-between">
                          {/* Photo Thumbnails */}
                          <div className="flex items-center gap-1.5 overflow-x-auto max-w-[70%] py-1">
                            {room.photos.map((p, pIdx) => (
                              <button
                                key={pIdx}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActivePhotoIndices((prev) => ({ ...prev, [room.id]: pIdx }));
                                }}
                                className={`h-11 w-11 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                                  pIdx === currentPhotoIdx
                                    ? 'border-[#B48A3E] scale-105 shadow-md'
                                    : 'border-white/30 opacity-60 hover:opacity-100'
                                }`}
                              >
                                <img src={p.url} alt="" className="w-full h-full object-cover" />
                              </button>
                            ))}
                          </div>

                          {/* Navigation Chevrons */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => prevPhoto(room.id, room.photos.length, e)}
                              className="p-2.5 rounded-full bg-black/70 text-white hover:bg-[#B48A3E] border border-white/20 transition-colors backdrop-blur-md cursor-pointer"
                              aria-label="Previous photo"
                            >
                              <ChevronLeft size={18} strokeWidth={1.75} />
                            </button>
                            <button
                              onClick={(e) => nextPhoto(room.id, room.photos.length, e)}
                              className="p-2.5 rounded-full bg-black/70 text-white hover:bg-[#B48A3E] border border-white/20 transition-colors backdrop-blur-md cursor-pointer"
                              aria-label="Next photo"
                            >
                              <ChevronRight size={18} strokeWidth={1.75} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Suite Information Column (5 Cols) */}
                    <div className="lg:col-span-5 p-6 sm:p-8 md:p-10 flex flex-col justify-between">
                      <div>
                        {/* Eyebrow & Tagline */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B48A3E]">
                            {room.view}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            {room.size} · Up to {room.occupancy}
                          </span>
                        </div>

                        <h3 className="text-xl font-semibold leading-snug text-[#0F172A] tracking-tight mt-2">
                          {room.name}
                        </h3>

                        {/* Official Instagram Tagline */}
                        <div className="mt-3 p-3.5 rounded-xl bg-amber-50/60 border-l-4 border-[#B48A3E]">
                          <p className="text-sm italic text-slate-800 leading-snug">
                            "{room.officialTagline}"
                          </p>
                        </div>

                        <p className="mt-4 text-base font-normal leading-relaxed text-slate-600">
                          {room.description}
                        </p>

                        {/* Key Specs Grid */}
                        <div className="grid grid-cols-2 gap-3.5 my-6 pt-4 border-t border-slate-100 text-xs sm:text-sm text-slate-700">
                          <div className="flex items-center gap-2">
                            <BedDouble size={16} strokeWidth={1.75} className="text-[#B48A3E]" />
                            <span className="font-medium">{room.bed}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Coffee size={16} strokeWidth={1.75} className="text-[#B48A3E]" />
                            <span className="font-medium">Electric Kettle & Tea</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Flame size={16} strokeWidth={1.75} className="text-[#B48A3E]" />
                            <span className="font-medium">Heated Duvets & Blanket</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Sparkles size={16} strokeWidth={1.75} className="text-[#B48A3E]" />
                            <span className="font-medium">Velenburg Toiletries</span>
                          </div>
                        </div>

                        {/* In-Suite Amenities Checklist */}
                        <div className="mb-6">
                          <h4 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">
                            Included in this Suite:
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700">
                            {room.amenities.slice(0, 6).map((amenity, aIdx) => (
                              <div key={aIdx} className="flex items-center gap-2">
                                <CheckCircle2 size={15} strokeWidth={1.75} className="text-[#B48A3E] flex-shrink-0" />
                                <span>{amenity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Footer Pricing & CTA (Strict Standard Buttons) */}
                      <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                            All-Inclusive Nightly Rate
                          </div>
                          <div className="text-xl font-bold text-[#0F172A] mt-0.5">
                            PKR 18,000 / Night
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => setInspectRoom(room)}
                            className="border border-slate-300 bg-white text-slate-900 hover:border-[#B48A3E] px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Eye size={15} strokeWidth={1.75} />
                            <span>Details</span>
                          </button>

                          <button
                            onClick={() => handleOpenBooking(room)}
                            className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 py-2.5 rounded-full font-semibold text-xs sm:text-sm uppercase tracking-wider shadow-sm hover:shadow-md inline-flex items-center gap-2 cursor-pointer transition-all"
                          >
                            <MessageCircle size={15} strokeWidth={1.75} className="fill-white" />
                            <span>Book Suite</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= SUITE COMPARISON & EQUALITY ================= */}
      <section className="py-16 md:py-24 bg-[#0F172A] text-alabaster border-t border-slate-700/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#DFBF77]">
              The Velenburg Standard
            </span>
            <h2 className="text-3xl md:text-4xl font-bold leading-[1.2] text-white tracking-tight mt-2">
              Why Every Suite is Valued Equally
            </h2>
            <p className="mt-4 text-base font-normal leading-relaxed text-slate-300">
              Unlike hotels that create inferior baseline rooms, Velenburg provides identical luxury finishes, personal amenities, and sweeping mountain panoramas across all four suites.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ROOMS_DATA.map((r, i) => (
              <div
                key={r.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#B48A3E]/60 transition-all flex flex-col justify-between h-full"
              >
                <div>
                  <span className="text-xs text-[#DFBF77] font-mono">0{i + 1} / 04</span>
                  <h3 className="text-xl font-semibold leading-snug text-white mt-2">{r.name}</h3>
                  <p className="text-xs italic text-slate-300 mt-1">"{r.officialTagline}"</p>
                  <div className="mt-4 pt-4 border-t border-white/10 space-y-2 text-xs text-slate-300">
                    <p>• {r.size} living area</p>
                    <p>• {r.bed}</p>
                    <p>• {r.view}</p>
                    <p>• In-room kettle & Tapal tea</p>
                    <p>• Velenburg signature toiletries</p>
                    <p>• Full-length dressing mirror</p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-sm font-bold text-[#DFBF77]">
                    PKR 18,000 / Night
                  </span>
                  <button
                    onClick={() => handleOpenBooking(r)}
                    className="text-xs text-[#DFBF77] hover:underline font-semibold cursor-pointer"
                  >
                    Reserve →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TRANSPARENT POLICIES ================= */}
      <section className="py-16 md:py-24 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-alabaster rounded-2xl border border-slate-200/80 p-8 md:p-10 shadow-xs">
            <div className="flex items-center gap-3 text-[#B48A3E] mb-6">
              <Info size={22} strokeWidth={1.75} />
              <h3 className="text-xl font-semibold text-[#0F172A]">
                Essential Retreat Policies & In-Suite Tea Station
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-700 leading-relaxed">
              <div className="space-y-1.5">
                <div className="font-semibold text-[#0F172A] flex items-center gap-1.5">
                  <Clock size={16} strokeWidth={1.75} className="text-[#B48A3E]" />
                  <span>Timings</span>
                </div>
                <p>Check-in: <strong>{RETREAT_CONFIG.policies.checkInTime}</strong></p>
                <p>Check-out: <strong>{RETREAT_CONFIG.policies.checkOutTime}</strong></p>
                <p>Quiet Hours: <strong>{RETREAT_CONFIG.policies.quietHours}</strong></p>
              </div>

              <div className="space-y-1.5">
                <div className="font-semibold text-[#0F172A] flex items-center gap-1.5">
                  <Coffee size={16} strokeWidth={1.75} className="text-[#B48A3E]" />
                  <span>Tea & Kitchen Policy</span>
                </div>
                <p>Every suite has an electric kettle and complimentary Tapal Green Tea sachets.</p>
                <p>We do not operate a commercial restaurant; guests have shared access to our self-use kitchen space and local Murree dining delivery options.</p>
              </div>

              <div className="space-y-1.5">
                <div className="font-semibold text-[#0F172A] flex items-center gap-1.5">
                  <MessageCircle size={16} strokeWidth={1.75} className="text-[#B48A3E]" />
                  <span>Direct Reservations</span>
                </div>
                <p>Direct bookings receive priority suite allocation, prompt host assistance, and instant reservation lock via WhatsApp.</p>
                <p>Call or WhatsApp: <strong>{RETREAT_CONFIG.contact.displayPhone}</strong></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FULL SUITE INSPECTION MODAL ================= */}
      <RoomDetailModal
        isOpen={Boolean(inspectRoom)}
        room={inspectRoom}
        onClose={() => setInspectRoom(null)}
        onBookNow={(room) => {
          setInspectRoom(null);
          handleOpenBooking(room);
        }}
      />

      {/* WhatsApp Booking Calculation Modal */}
      {modalRoom && (
        <WhatsAppBookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialRoom={modalRoom}
        />
      )}
    </PageTransition>
  );
}
