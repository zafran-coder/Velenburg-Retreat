import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Calendar, Bed, Users, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { RoomSuite, ROOMS_DATA } from '../data/roomsData';
import { RETREAT_CONFIG } from '../data/retreatConfig';
import { buildWhatsAppBookingUrl, calculateStayPrice, generateBookingRef } from '../utils/whatsapp';
import AvailabilityCalendar from './AvailabilityCalendar';
import { isRangeBlocked, recordBookingInquiry, subscribeToAvailability } from '../utils/availability';

interface WhatsAppBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRoom?: RoomSuite | null;
  defaultRoom?: RoomSuite | null;
}

export default function WhatsAppBookingModal({
  isOpen,
  onClose,
  initialRoom,
  defaultRoom,
}: WhatsAppBookingModalProps) {
  const [mounted, setMounted] = useState(false);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [availTick, setAvailTick] = useState(0);

  useEffect(() => {
    setMounted(true);
    return subscribeToAvailability(() => setAvailTick((t) => t + 1));
  }, []);
  const dayAfter = new Date(tomorrow);
  dayAfter.setDate(dayAfter.getDate() + 2);

  const formatDate = (d: Date) => d.toISOString().split('T')[0];

  const activeInitial = initialRoom || defaultRoom;
  const [selectedRoomId, setSelectedRoomId] = useState<number>(activeInitial?.id || 1);
  const [checkIn, setCheckIn] = useState<string>(formatDate(tomorrow));
  const [checkOut, setCheckOut] = useState<string>(formatDate(dayAfter));
  const [guests, setGuests] = useState<number>(2);
  const [guestName, setGuestName] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const currentRoom = ROOMS_DATA.find((r) => r.id === selectedRoomId) || ROOMS_DATA[0];

  const nights = (() => {
    try {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffMs = end.getTime() - start.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    } catch {
      return 1;
    }
  })();

  const totalPrice = calculateStayPrice(nights, 1);
  const bookingRef = generateBookingRef();

  const [showCalendar, setShowCalendar] = useState<boolean>(false);

  const isBlocked = isRangeBlocked(selectedRoomId, checkIn, checkOut);

  const handleConfirmWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();

    if (isBlocked) {
      alert('The selected dates overlap an existing Airbnb/Booking.com reservation. Please choose different dates.');
      setShowCalendar(true);
      return;
    }

    // Automatically record booking inquiry in Supabase database
    recordBookingInquiry({
      bookingRef,
      roomId: currentRoom.id,
      guestName: guestName.trim() || 'Valued Guest',
      guestPhone: guestPhone.trim() || 'WhatsApp Contact',
      guestsCount: guests,
      checkIn,
      checkOut,
      nights,
      totalPricePkr: totalPrice,
      notes: notes.trim(),
    }).catch(() => {});

    const url = buildWhatsAppBookingUrl({
      ownerPhone: RETREAT_CONFIG.contact.ownerWhatsApp,
      bookingRef,
      roomId: currentRoom.id,
      roomName: `${currentRoom.name} ("${currentRoom.officialTagline}")`,
      checkIn,
      checkOut,
      nights,
      guests: `${guests} Guests`,
      guestName: guestName.trim() || 'Valued Guest',
      guestPhone: guestPhone.trim() || 'WhatsApp Contact',
      notes: notes.trim(),
    });

    window.open(url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2.5 sm:p-4 md:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-charcoal/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden z-10 flex flex-col max-h-[calc(100dvh-1.5rem)] sm:max-h-[min(90vh,780px)] my-auto"
          >
            {/* Header */}
            <div className="bg-charcoal text-alabaster p-5 sm:p-6 relative border-b border-gold/25 shrink-0">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 sm:top-5 sm:right-5 text-alabaster/60 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>

              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#DFBF77] block mb-1">
                Direct WhatsApp Reservation
              </span>
              <h3 className="text-xl font-semibold leading-snug text-white">
                Reserve Your Luxury Mountain Suite
              </h3>
              <p className="text-xs text-alabaster/75 mt-1">
                Gharial Camp, Murree · Fixed Rate <strong>PKR 18,000 / Night</strong>
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleConfirmWhatsApp} className="p-5 sm:p-7 space-y-4 sm:space-y-5 overflow-y-auto flex-1 min-h-0">
              {/* Suite Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-charcoal flex items-center gap-1.5">
                  <Bed size={13} className="text-gold-dark" />
                  Select Luxury Suite
                </label>
                <select
                  value={selectedRoomId}
                  onChange={(e) => setSelectedRoomId(Number(e.target.value))}
                  className="w-full bg-alabaster rounded-xl border border-gold/25 px-4 py-3 text-xs sm:text-sm font-semibold text-charcoal focus:outline-none focus:border-gold transition-colors"
                >
                  {ROOMS_DATA.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} — "{r.officialTagline}" (PKR 18,000 / Night)
                    </option>
                  ))}
                </select>
              </div>

              {/* Live Calendar Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-charcoal flex items-center gap-1.5">
                  <Calendar size={13} className="text-gold-dark" />
                  Select Stay Dates
                </span>
                <button
                  type="button"
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="text-xs text-gold-dark hover:text-gold font-medium hover:underline flex items-center gap-1"
                >
                  {showCalendar ? 'Hide Live Calendar' : 'View Airbnb/Booking.com Synced Calendar'}
                </button>
              </div>

              {showCalendar && (
                <div className="my-2">
                  <AvailabilityCalendar
                    roomId={selectedRoomId}
                    checkIn={checkIn}
                    checkOut={checkOut}
                    onSelectDates={(inDate, outDate) => {
                      setCheckIn(inDate);
                      if (outDate) setCheckOut(outDate);
                    }}
                  />
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal flex items-center gap-1.5">
                    <Calendar size={13} className="text-gold-dark" />
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    required
                    value={checkIn}
                    onClick={(e) => {
                      try {
                        e.currentTarget.showPicker?.();
                      } catch (_) {}
                    }}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-alabaster rounded-xl border border-gold/25 px-4 py-2.5 text-xs sm:text-sm text-charcoal focus:outline-none focus:border-gold cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500 block">Check-in: 2:00 PM</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal flex items-center gap-1.5">
                    <Calendar size={13} className="text-gold-dark" />
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    required
                    value={checkOut}
                    min={checkIn}
                    onClick={(e) => {
                      try {
                        e.currentTarget.showPicker?.();
                      } catch (_) {}
                    }}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-alabaster rounded-xl border border-gold/25 px-4 py-2.5 text-xs sm:text-sm text-charcoal focus:outline-none focus:border-gold cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500 block">Check-out: 12:00 PM</span>
                </div>
              </div>

              {/* Guest Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal block">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Guest Name"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full bg-alabaster rounded-xl border border-gold/25 px-4 py-2.5 text-xs sm:text-sm text-charcoal placeholder:text-slate-400 focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal block">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    placeholder="03XX-XXXXXXX"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full bg-alabaster rounded-xl border border-gold/25 px-4 py-2.5 text-xs sm:text-sm text-charcoal placeholder:text-slate-400 focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              {/* Guest count & Special notes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-xs font-semibold text-charcoal flex items-center gap-1.5">
                    <Users size={13} className="text-gold-dark" />
                    Guests
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full bg-alabaster rounded-xl border border-gold/25 px-3 py-2 text-xs text-charcoal focus:outline-none focus:border-gold"
                  >
                    <option value={1}>1 Guest</option>
                    <option value={2}>2 Guests</option>
                    <option value={3}>3 Guests</option>
                  </select>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-charcoal block">Special Requests (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. late check-in, extra linen"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-alabaster rounded-xl border border-gold/25 px-3 py-2 text-xs text-charcoal placeholder:text-slate-400 focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              {/* Pricing Calculation Summary */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-gold/30 space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-700">
                    Stay Calculation (PKR 18,000 × {nights} Night{nights > 1 ? 's' : ''}):
                  </span>
                  <span className="font-bold text-charcoal text-base">
                    PKR {totalPrice.toLocaleString()}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed flex items-start gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    Includes suite stay, in-room electric kettle, complimentary Tapal Green Tea sachets, Velenburg black-and-gold toiletries kit & mountain terrace access.
                  </span>
                </p>
                <p className="text-[10px] text-slate-500 italic">
                  Note: Self-use kitchen available. Hotel does not provide restaurant lunch/dinner or cooked room service.
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  No card details required · Direct WhatsApp
                </span>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white px-7 py-3 text-sm font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <MessageCircle size={16} className="fill-white" />
                  <span>Send to Owner on WhatsApp</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
