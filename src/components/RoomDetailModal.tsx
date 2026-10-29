import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronLeft,
  ChevronRight,
  BedDouble,
  Coffee,
  Sparkles,
  Flame,
  Tv,
  Wifi,
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  Clock,
  MapPin,
  Calendar,
  Eye,
  Loader2
} from 'lucide-react';
import { RoomSuite } from '../data/roomsData';
import { RETREAT_CONFIG, formatPKR } from '../data/retreatConfig';
import { buildWhatsAppBookingUrl } from '../utils/whatsapp';
import { luxuryAudio } from '../utils/audio';

interface RoomDetailModalProps {
  room: RoomSuite | null;
  isOpen: boolean;
  onClose: () => void;
  onBookNow?: (room: RoomSuite) => void;
}

export default function RoomDetailModal({
  room,
  isOpen,
  onClose,
  onBookNow,
}: RoomDetailModalProps) {
  const [mounted, setMounted] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock background body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Reset photo index & loading when room changes
  useEffect(() => {
    setActivePhotoIndex(0);
    setIsImageLoading(true);
  }, [room]);

  // Handle ESC key and arrow keys to navigate photos
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || !room) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        const total = room.photos?.length || room.images?.length || 1;
        setIsImageLoading(true);
        setActivePhotoIndex((prev) => (prev + 1) % total);
      } else if (e.key === 'ArrowLeft') {
        const total = room.photos?.length || room.images?.length || 1;
        setIsImageLoading(true);
        setActivePhotoIndex((prev) => (prev - 1 + total) % total);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, room, onClose]);

  if (!isOpen || !room) return null;

  const photoList = room.photos && room.photos.length > 0
    ? room.photos
    : (room.images || []).map((img, i) => ({
        url: img,
        caption: `${room.name} — Photo ${i + 1}`,
      }));

  const currentPhoto = photoList[activePhotoIndex] || photoList[0];
  const isKettle = currentPhoto.url.includes('kettle');
  const isMirror = currentPhoto.url.includes('mirror');

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    luxuryAudio.playChime(560, 0.05);
    setIsImageLoading(true);
    setActivePhotoIndex((prev) => (prev - 1 + photoList.length) % photoList.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    luxuryAudio.playChime(640, 0.05);
    setIsImageLoading(true);
    setActivePhotoIndex((prev) => (prev + 1) % photoList.length);
  };

  const handleWhatsAppBooking = () => {
    luxuryAudio.playSuccessChime();
    if (onBookNow) {
      onBookNow(room);
      return;
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 2);

    const url = buildWhatsAppBookingUrl({
      ownerPhone: RETREAT_CONFIG.contact.ownerWhatsApp,
      roomId: room.id,
      roomName: `${room.name} ("${room.officialTagline}")`,
      checkIn: tomorrow.toISOString().split('T')[0],
      checkOut: dayAfter.toISOString().split('T')[0],
      nights: 2,
      guests: '2 Guests',
      guestName: 'Guest',
      guestPhone: 'Direct Booking Request',
      notes: 'Includes in-room electric kettle & toiletries kit',
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && room && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container: High-end Side-by-Side Responsive Suite Explorer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl lg:max-w-6xl bg-white rounded-2xl sm:rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.6)] border border-gold/40 overflow-hidden z-10 flex flex-col h-[calc(100dvh-1rem)] sm:h-[calc(100dvh-2rem)] md:h-[min(88vh,720px)] my-auto"
          >
            {/* Modal Header Bar (Pinned Top) */}
            <div className="bg-charcoal text-alabaster px-4 py-3 sm:px-6 sm:py-3.5 border-b border-white/10 flex items-center justify-between gap-3 shrink-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-[#B48A3E]/30 text-xs font-semibold text-[#DFBF77] uppercase tracking-[0.2em] w-fit">
                  <Sparkles size={11} className="text-[#DFBF77]" />
                  <span>Suite 0{room.id}</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold leading-snug text-white">
                    {room.name}
                  </h2>
                  <p className="text-xs italic text-[#DFBF77]">
                    "{room.officialTagline}" · <span className="not-italic text-slate-300">{room.view}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Uniform Rate</span>
                  <span className="text-base font-bold text-[#DFBF77]">PKR 18,000 <span className="text-xs font-normal text-slate-400">/ Night</span></span>
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close suite details"
                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white/10 hover:bg-[#B48A3E] hover:text-[#0F172A] text-white flex items-center justify-center transition-colors border border-white/15 cursor-pointer shrink-0"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Split Layout: Left = Photo Gallery Stage, Right = Immediate Suite Details */}
            <div className="flex-1 min-h-0 overflow-y-auto md:overflow-hidden grid grid-cols-1 md:grid-cols-12">
              {/* ══════════ LEFT COLUMN: INTERACTIVE PHOTO STAGE ══════════ */}
              <div className="md:col-span-6 lg:col-span-6 flex flex-col justify-between p-3.5 sm:p-4 lg:p-5 bg-slate-950 text-white border-b md:border-b-0 md:border-r border-charcoal/20 min-h-0">
                {/* Main Photo Display */}
                <div className="relative rounded-2xl overflow-hidden bg-charcoal flex-1 min-h-[190px] sm:min-h-[220px] shadow-inner group">
                  {/* Subtle Loading Shimmer Placeholder so it NEVER looks empty */}
                  {isImageLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-0">
                      <Loader2 size={24} className="text-gold animate-spin mb-2" />
                      <span className="text-xs text-gold-light/80 font-medium">Loading Authentic Suite Photo...</span>
                    </div>
                  )}

                  <img
                    key={currentPhoto.url}
                    src={currentPhoto.url}
                    alt={currentPhoto.caption}
                    loading="eager"
                    onLoad={() => setIsImageLoading(false)}
                    className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.02] ${
                      isImageLoading ? 'opacity-0' : 'opacity-100'
                    }`}
                  />

                  {/* Ambient Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-transparent to-black/40 pointer-events-none" />

                  {/* Top Badges: Rate & Photo Counter */}
                  <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none z-10">
                    <span className="text-[9.5px] sm:text-xs font-mono bg-black/65 backdrop-blur-md text-white/90 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-white/20">
                      {activePhotoIndex + 1} / {photoList.length} Photos
                    </span>

                    <span className="text-[9.5px] sm:text-xs font-bold text-charcoal bg-gold/95 backdrop-blur-md px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-md">
                      PKR 18,000 / Night
                    </span>
                  </div>

                  {/* Special Indicators for In-Suite Inclusions */}
                  {isKettle && (
                    <div className="absolute top-10 left-2.5 z-10 bg-gold/95 backdrop-blur-md text-charcoal px-2.5 py-1 rounded-lg text-[10.5px] font-bold shadow-lg flex items-center gap-1.5">
                      <Coffee size={12} />
                      <span>In-Suite Kettle & Toiletries Tray</span>
                    </div>
                  )}

                  {isMirror && (
                    <div className="absolute top-10 left-2.5 z-10 bg-charcoal/90 backdrop-blur-md text-gold-light px-2.5 py-1 rounded-lg text-[10.5px] font-bold shadow-lg flex items-center gap-1.5 border border-gold/30">
                      <Sparkles size={12} className="text-gold" />
                      <span>Dressing Mirror & Sunroom Area</span>
                    </div>
                  )}

                  {/* Navigation Chevrons */}
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-charcoal/80 hover:bg-gold hover:text-charcoal text-white flex items-center justify-center backdrop-blur-md transition-all shadow-lg active:scale-90"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-charcoal/80 hover:bg-gold hover:text-charcoal text-white flex items-center justify-center backdrop-blur-md transition-all shadow-lg active:scale-90"
                    aria-label="Next photo"
                  >
                    <ChevronRight size={16} />
                  </button>

                  {/* Bottom Photo Caption */}
                  <div className="absolute bottom-2.5 inset-x-2.5 z-10 pointer-events-none">
                    <p className="inline-block text-[11px] sm:text-xs text-white/95 bg-black/75 backdrop-blur-md px-3 py-1 rounded-lg border border-white/15 leading-tight">
                      {currentPhoto.caption}
                    </p>
                  </div>
                </div>

                {/* Thumbnail Strip */}
                <div className="flex items-center gap-2 overflow-x-auto pt-2.5 pb-1 shrink-0">
                  {photoList.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        luxuryAudio.playChime(580, 0.05);
                        setIsImageLoading(true);
                        setActivePhotoIndex(idx);
                      }}
                      className={`relative shrink-0 w-14 h-10 sm:w-16 sm:h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        idx === activePhotoIndex
                          ? 'border-gold scale-105 shadow-md ring-2 ring-gold/40'
                          : 'border-white/20 opacity-60 hover:opacity-100 hover:border-white/50'
                      }`}
                    >
                      <img src={p.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                <div className="mt-2 text-[9.5px] sm:text-[10px] text-slate-400 text-center flex items-center justify-center gap-1 shrink-0">
                  <ShieldCheck size={12} className="text-gold" />
                  <span>Verified 100% genuine photography from Velenburg Retreat, Gharial Murree</span>
                </div>
              </div>

              {/* ══════════ RIGHT COLUMN: SUITE DETAILS ══════════ */}
              <div className="md:col-span-6 lg:col-span-6 flex flex-col min-h-0 bg-white">
                {/* Scrollable details body */}
                <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-4">
                  {/* Quick Specs Grid (Bed, Dimensions, View, Capacity) */}
                  <div>
                    <span className="text-xs uppercase font-semibold text-[#B48A3E] tracking-[0.2em] block mb-2">
                      Suite Architecture & Specifications
                    </span>
                    <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                      <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2">
                        <BedDouble size={15} className="text-[#B48A3E] shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Bed Type</span>
                          <p className="text-xs font-semibold text-[#0F172A]">{room.bedType || room.bed}</p>
                        </div>
                      </div>

                      <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2">
                        <Sparkles size={15} className="text-[#B48A3E] shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Floor Area</span>
                          <p className="text-xs font-semibold text-[#0F172A]">{room.size || '380 sq ft'}</p>
                        </div>
                      </div>

                      <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2">
                        <MapPin size={15} className="text-[#B48A3E] shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Elevation & View</span>
                          <p className="text-xs font-semibold text-[#0F172A]">{room.view}</p>
                        </div>
                      </div>

                      <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2">
                        <Clock size={15} className="text-[#B48A3E] shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Max Guests</span>
                          <p className="text-xs font-semibold text-[#0F172A]">{room.capacity || room.occupancy}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* In-Suite Amenities Checklist */}
                  <div>
                    <span className="text-xs uppercase font-semibold text-[#B48A3E] tracking-[0.2em] block mb-2">
                      Included In-Room Luxury Amenities
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-xs text-slate-700">
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                        <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                        <span>Electric Kettle & Tapal Tea sachets</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                        <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                        <span>Velenburg branded luxury toiletries</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                        <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                        <span>Wall-Mounted Smart TV with Netflix</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                        <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                        <span>Heated duvets & electric blanket</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                        <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                        <span>Dressing mirror & sunroom access</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                        <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                        <span>Free Wi-Fi & on-site parking</span>
                      </div>
                    </div>
                  </div>

                  {/* Suite Atmosphere & Features */}
                  <div>
                    <span className="text-xs uppercase font-semibold text-[#B48A3E] tracking-[0.2em] block mb-1">
                      Suite Atmosphere & Features
                    </span>
                    <p className="text-sm text-slate-600 font-normal leading-relaxed">
                      {room.description}
                    </p>
                  </div>

                  {/* Important Dining & Tea Note */}
                  <div className="p-3.5 rounded-xl bg-amber-50/70 border border-[#B48A3E]/30 text-xs text-slate-700 leading-relaxed">
                    <div className="flex items-center gap-1.5 font-bold text-[#B48A3E] uppercase tracking-wider mb-1 text-[10px]">
                      <Coffee size={13} />
                      <span>In-Suite Tea & Kitchen Note</span>
                    </div>
                    <p>
                      Every suite has its own electric kettle with complimentary Tapal Green Tea sachets. Shared guest kitchen access is available for quick prep; no cooked hotel dinner or room catering service.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ══════════ DEDICATED PINNED ACTION FOOTER BAR (ALWAYS 100% VISIBLE ACROSS FULL MODAL) ══════════ */}
            <div className="shrink-0 p-3.5 sm:px-6 sm:py-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between gap-3 shadow-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Uniform Suite Nightly Rate
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg sm:text-2xl font-serif font-bold text-[#0F172A]">
                    {formatPKR(room.pricePKR || room.pricePerNightPkr || 18000)}
                  </span>
                  <span className="text-xs text-slate-500 font-normal">/ Night</span>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border border-slate-300 hover:border-[#B48A3E] text-slate-900 bg-white text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppBooking}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2 sm:px-6 sm:py-2.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <MessageCircle size={16} className="fill-white shrink-0" />
                  <span>Book on WhatsApp</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
