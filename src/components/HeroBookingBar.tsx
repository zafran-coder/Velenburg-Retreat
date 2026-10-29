import { useState, useMemo, useRef, useEffect } from 'react';
import { Calendar, Users, Bed, MessageCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ROOMS_DATA } from '../data/roomsData';
import { RETREAT_CONFIG } from '../data/retreatConfig';
import { buildWhatsAppBookingUrl, calculateStayPrice } from '../utils/whatsapp';
import { isRangeBlocked, recordBookingInquiry, subscribeToAvailability } from '../utils/availability';

interface HeroBookingBarProps {
  onSuiteSelect?: (suiteId: number) => void;
}

export default function HeroBookingBar({ onSuiteSelect }: HeroBookingBarProps) {
  // Tomorrow & 3 days from now as defaults
  const today = new Date();
  const defaultCheckIn = new Date(today);
  defaultCheckIn.setDate(today.getDate() + 1);
  const defaultCheckOut = new Date(today);
  defaultCheckOut.setDate(today.getDate() + 3);

  const formatDate = (d: Date) => d.toISOString().split('T')[0];

  const [selectedSuiteId, setSelectedSuiteId] = useState<number>(1);
  const [checkIn, setCheckIn] = useState<string>(formatDate(defaultCheckIn));
  const [checkOut, setCheckOut] = useState<string>(formatDate(defaultCheckOut));
  const [guests, setGuests] = useState<number>(2);
  const [availTick, setAvailTick] = useState(0);

  useEffect(() => {
    return subscribeToAvailability(() => setAvailTick((t) => t + 1));
  }, []);

  const checkInRef = useRef<HTMLInputElement>(null);
  const checkOutRef = useRef<HTMLInputElement>(null);

  const selectedSuite = useMemo(() => {
    return ROOMS_DATA.find((r) => r.id === selectedSuiteId) || ROOMS_DATA[0];
  }, [selectedSuiteId]);

  const nights = useMemo(() => {
    try {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffMs = end.getTime() - start.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    } catch {
      return 1;
    }
  }, [checkIn, checkOut]);

  const totalPrice = useMemo(() => {
    return calculateStayPrice(nights, 1);
  }, [nights]);

  const isBlocked = useMemo(() => {
    return isRangeBlocked(selectedSuite.id, checkIn, checkOut);
  }, [selectedSuite.id, checkIn, checkOut, availTick]);

  const handleCheckInChange = (newVal: string) => {
    setCheckIn(newVal);
    // If checkout is on or before new checkin, auto advance checkout by 1 day
    if (newVal >= checkOut) {
      try {
        const parts = newVal.split('-').map(Number);
        const nextDay = new Date(parts[0], parts[1] - 1, parts[2] + 1);
        setCheckOut(formatDate(nextDay));
      } catch {
        // fallback
      }
    }
  };

  const handleBookingClick = () => {
    if (isBlocked) return;

    recordBookingInquiry({
      bookingRef: `VLN-${Date.now().toString(36).toUpperCase()}`,
      roomId: selectedSuite.id,
      guestName: 'Direct Guest',
      guestPhone: 'Direct Inquiry',
      guestsCount: guests,
      checkIn,
      checkOut,
      nights,
      totalPricePkr: totalPrice,
      notes: 'Dates selected via Velenburg Retreat Hero Bar',
    }).catch(() => {});

    const url = buildWhatsAppBookingUrl({
      ownerPhone: RETREAT_CONFIG.contact.ownerWhatsApp,
      roomId: selectedSuite.id,
      roomName: `${selectedSuite.name} ("${selectedSuite.officialTagline}")`,
      checkIn,
      checkOut,
      nights,
      guests: `${guests} Guests`,
      guestName: 'Guest',
      guestPhone: 'Direct Inquiry',
      notes: 'Dates selected via Velenburg Retreat Availability Bar',
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Human-readable date presentation
  const getReadableDate = (dateStr: string) => {
    try {
      const parts = dateStr.split('-').map(Number);
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      id="booking-bar"
      className="relative mx-auto max-w-5xl w-full bg-white/95 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200/80 scroll-mt-28"
    >
      {/* Top Header Tag */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-200/80">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B48A3E]">
            Reserve Your Stay · Direct Host WhatsApp
          </span>
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Fixed Rate: <strong className="font-semibold text-base text-[#0F172A]">PKR 18,000 / Night</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        {/* 1. Suite Selector */}
        <div className="flex flex-col justify-between gap-1.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-[#B48A3E]/60 transition-colors">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#0F172A] flex items-center gap-1.5">
            <Bed size={14} className="text-[#B48A3E]" />
            1. Select Suite
          </label>
          <select
            value={selectedSuiteId}
            onChange={(e) => {
              const id = Number(e.target.value);
              setSelectedSuiteId(id);
              if (onSuiteSelect) onSuiteSelect(id);
            }}
            className="w-full bg-transparent text-sm font-semibold text-[#0F172A] focus:outline-none cursor-pointer py-1"
          >
            {ROOMS_DATA.map((room) => (
              <option key={room.id} value={room.id}>
                {room.shortName} — {room.officialTagline}
              </option>
            ))}
          </select>
          <span className="text-xs text-[#B48A3E] font-medium">
            PKR 18,000 / Night · 4 Uniform Suites
          </span>
        </div>

        {/* 2. Check-in Date */}
        <div
          onClick={() => {
            try {
              checkInRef.current?.showPicker?.();
              checkInRef.current?.focus();
            } catch {
              checkInRef.current?.focus();
            }
          }}
          className="flex flex-col justify-between gap-1.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-[#B48A3E]/60 transition-colors cursor-pointer group"
        >
          <label className="text-xs font-semibold uppercase tracking-wider text-[#0F172A] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-[#B48A3E] group-hover:scale-110 transition-transform" />
              2. Check-in Date
            </span>
            <span className="text-xs text-[#B48A3E] font-semibold">Change</span>
          </label>
          <div className="flex items-center gap-2 py-1">
            <input
              ref={checkInRef}
              type="date"
              value={checkIn}
              min={formatDate(today)}
              onChange={(e) => handleCheckInChange(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-[#0F172A] focus:outline-none cursor-pointer"
            />
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {getReadableDate(checkIn)} · From 2:00 PM
          </span>
        </div>

        {/* 3. Check-out Date */}
        <div
          onClick={() => {
            try {
              checkOutRef.current?.showPicker?.();
              checkOutRef.current?.focus();
            } catch {
              checkOutRef.current?.focus();
            }
          }}
          className="flex flex-col justify-between gap-1.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-[#B48A3E]/60 transition-colors cursor-pointer group"
        >
          <label className="text-xs font-semibold uppercase tracking-wider text-[#0F172A] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-[#B48A3E] group-hover:scale-110 transition-transform" />
              3. Check-out Date
            </span>
            <span className="text-xs text-[#B48A3E] font-semibold">Change</span>
          </label>
          <div className="flex items-center gap-2 py-1">
            <input
              ref={checkOutRef}
              type="date"
              value={checkOut}
              min={checkIn}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-[#0F172A] focus:outline-none cursor-pointer"
            />
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {getReadableDate(checkOut)} · Before 12:00 PM
          </span>
        </div>

        {/* 4. Guests & Instant Action */}
        <div className="flex flex-col justify-between gap-1.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-[#B48A3E]/60 transition-colors">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#0F172A] flex items-center gap-1.5">
            <Users size={14} className="text-[#B48A3E]" />
            4. Guest Count
          </label>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full bg-transparent text-sm font-semibold text-[#0F172A] focus:outline-none cursor-pointer py-1"
          >
            <option value={1}>1 Guest (King Bed)</option>
            <option value={2}>2 Guests (King Bed)</option>
            <option value={3}>3 Guests (2 Adults + 1 Child)</option>
            <option value={4}>4 Guests (Family Stay)</option>
          </select>
          <span className="text-xs text-slate-500 font-medium">Includes Sunroom Lounge</span>
        </div>
      </div>

      {/* Pricing Bar & CTA */}
      <div className="mt-5 pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="text-sm font-medium text-slate-600">Total Calculated:</span>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#0F172A]">
              PKR {totalPrice.toLocaleString()}
            </span>
            <span className="text-xs text-[#B48A3E] font-semibold bg-[#B48A3E]/15 px-2.5 py-0.5 rounded-md border border-[#B48A3E]/30">
              {nights} Night{nights > 1 ? 's' : ''} Stay
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1.5 flex items-center justify-center sm:justify-start gap-1">
            <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
            <span>Includes in-suite electric kettle, Tapal Green Tea sachets & Velenburg toiletries kit</span>
          </p>
        </div>

        {/* Action Button */}
        {isBlocked ? (
          <button
            type="button"
            disabled
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-slate-300 text-slate-500 px-6 py-3.5 text-xs uppercase tracking-wider font-semibold cursor-not-allowed shadow-inner"
          >
            <span>Dates Reserved (Airbnb/OTA)</span>
          </button>
        ) : (
          <div className="w-full sm:w-auto flex flex-col items-center sm:items-end gap-1">
            <button
              type="button"
              onClick={handleBookingClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white px-7 py-3.5 text-sm font-semibold shadow-md hover:shadow-lg transition-all group cursor-pointer"
            >
              <MessageCircle size={18} className="fill-white" />
              <span>Book via WhatsApp with Selected Dates</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <span className="text-xs text-slate-500 font-medium">
              Inquires: {selectedSuite.shortName} · {nights} Night{nights > 1 ? 's' : ''} ({getReadableDate(checkIn)} → {getReadableDate(checkOut)})
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
