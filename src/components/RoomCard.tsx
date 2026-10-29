import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, MessageCircle, Bed, Users, Sparkles, Check, Coffee, Eye } from 'lucide-react';
import { RoomSuite } from '../data/roomsData';
import { RETREAT_CONFIG } from '../data/retreatConfig';
import { buildWhatsAppBookingUrl } from '../utils/whatsapp';

interface RoomCardProps {
  room: RoomSuite;
  onSelectForBooking?: (room: RoomSuite) => void;
  onViewDetails?: (room: RoomSuite) => void;
}

export default function RoomCard({ room, onSelectForBooking, onViewDetails }: RoomCardProps) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails(room);
    } else if (onSelectForBooking) {
      onSelectForBooking(room);
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % room.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + room.images.length) % room.images.length);
  };

  const currentImage = room.images[currentImgIndex];
  const isKettleImage = currentImage.includes('kettle');
  const isMirrorImage = currentImage.includes('mirror');

  const handleBookNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelectForBooking) {
      onSelectForBooking(room);
      return;
    }

    // Direct WhatsApp booking trigger fallback
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

  return (
    <div
      onClick={handleCardClick}
      className="rounded-2xl overflow-hidden bg-white border border-slate-200/80 shadow-sm hover:border-[#B48A3E] hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full group cursor-pointer"
    >
      {/* ============ IMAGE CAROUSEL (Identical aspect-[4/3]) ============ */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0F172A]">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImgIndex}
            src={currentImage}
            alt={`${room.name} - Photo ${currentImgIndex + 1}`}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.4 }}
            transition={{ duration: 0.35 }}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </AnimatePresence>

        {/* Hover Cue to View Suite Details */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/35 z-10 pointer-events-none">
          <span className="px-4 py-2 rounded-full text-xs font-semibold text-white bg-black/70 border border-[#B48A3E]/40 shadow-lg flex items-center gap-2 backdrop-blur-md">
            <Eye size={15} strokeWidth={1.75} className="text-[#B48A3E]" />
            <span>View Suite Details & Photos</span>
          </span>
        </div>

        {/* Ambient Top & Bottom Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-4 inset-x-4 flex items-center justify-between gap-2 z-10 pointer-events-none">
          {/* Rate Badge */}
          <div className="bg-white/95 px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm backdrop-blur-md">
            <span className="text-xs font-bold text-[#0F172A] tracking-wide">
              PKR 18,000 / Night
            </span>
          </div>

          {/* Official Tagline Badge */}
          <div className="bg-[#0F172A]/90 backdrop-blur-md px-3 py-1 rounded-full border border-[#B48A3E]/40 text-xs font-semibold text-[#DFBF77] uppercase tracking-wider">
            {room.officialTagline}
          </div>
        </div>

        {/* Special In-Carousel Indicator Badges (Kettle & Mirror) */}
        {isKettleImage && (
          <div className="absolute top-14 left-4 z-10 bg-[#B48A3E] text-white px-3 py-1 rounded-lg text-xs font-semibold shadow-md flex items-center gap-1.5">
            <Coffee size={14} strokeWidth={1.75} />
            <span>In-Room Kettle, Tapal Green Tea & Toiletries</span>
          </div>
        )}

        {isMirrorImage && (
          <div className="absolute top-14 left-4 z-10 bg-[#0F172A]/90 backdrop-blur-md text-[#DFBF77] px-3 py-1 rounded-lg text-xs font-semibold shadow-md flex items-center gap-1.5 border border-[#B48A3E]/30">
            <Sparkles size={14} strokeWidth={1.75} className="text-[#B48A3E]" />
            <span>Dressing Mirror & Sunroom Area</span>
          </div>
        )}

        {/* Carousel Navigation Arrows */}
        <button
          onClick={prevImage}
          aria-label="Previous photo"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white/90 hover:bg-white text-[#0F172A] flex items-center justify-center backdrop-blur-sm shadow-md transition-all active:scale-90 opacity-90 group-hover:opacity-100"
        >
          <ChevronLeft size={18} strokeWidth={1.75} />
        </button>

        <button
          onClick={nextImage}
          aria-label="Next photo"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white/90 hover:bg-white text-[#0F172A] flex items-center justify-center backdrop-blur-sm shadow-md transition-all active:scale-90 opacity-90 group-hover:opacity-100"
        >
          <ChevronRight size={18} strokeWidth={1.75} />
        </button>

        {/* Carousel Dots */}
        <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5 z-10">
          {room.images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImgIndex(i);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentImgIndex ? 'w-5 bg-[#B48A3E]' : 'w-1.5 bg-white/60 hover:bg-white'
              }`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ============ CARD CONTENT (p-6, text-xl h3, text-base p) ============ */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Title & Tagline */}
          <div className="flex items-baseline justify-between gap-2 mb-1.5">
            <h3 className="text-xl font-semibold leading-snug text-[#0F172A] tracking-tight">
              {room.name}
            </h3>
          </div>

          <p className="italic text-sm text-[#B48A3E] font-medium mb-3 tracking-wide">
            "{room.officialTagline}" · <span className="not-italic text-xs text-slate-500 uppercase tracking-wider">{room.view}</span>
          </p>

          <p className="text-base font-normal leading-relaxed text-slate-600 mb-5">
            {room.description}
          </p>

          {/* Quick Specs */}
          <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700 py-3 border-y border-slate-100 mb-5">
            <span className="flex items-center gap-2">
              <Bed size={16} strokeWidth={1.75} className="text-[#B48A3E]" />
              <span className="font-medium">{room.bedType}</span>
            </span>
            <span className="flex items-center gap-2">
              <Users size={16} strokeWidth={1.75} className="text-[#B48A3E]" />
              <span className="font-medium">{room.capacity}</span>
            </span>
          </div>

          {/* Key In-Room Inclusions */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
              <Check size={16} strokeWidth={1.75} className="text-emerald-600 shrink-0" />
              <span>Electric Kettle & Tapal Green Tea sachets</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
              <Check size={16} strokeWidth={1.75} className="text-emerald-600 shrink-0" />
              <span>Velenburg black & gold luxury toiletries kit</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
              <Check size={16} strokeWidth={1.75} className="text-emerald-600 shrink-0" />
              <span>Smart LED TV with Netflix & sunroom sitting area</span>
            </div>
          </div>
        </div>

        {/* Bottom CTA Row (Strict Standard Buttons) */}
        <div className="pt-5 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-xs text-slate-500 font-medium block">Uniform Rate</span>
            <span className="text-lg font-bold text-[#0F172A]">PKR 18,000 / Night</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onViewDetails) onViewDetails(room);
                else handleCardClick();
              }}
              className="border border-slate-300 bg-white text-slate-900 hover:border-[#B48A3E] px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Eye size={15} strokeWidth={1.75} />
              <span>Details</span>
            </button>

            <button
              type="button"
              onClick={handleBookNow}
              className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow-md inline-flex items-center gap-2 cursor-pointer"
            >
              <MessageCircle size={15} strokeWidth={1.75} className="fill-white" />
              <span>Book Suite</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
