import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Phone,
  Clock,
  Calendar,
  Check,
  Sparkles,
  MessageCircle,
  Users,
  Compass,
  Navigation,
  ExternalLink,
  Info,
  Car,
  Star
} from 'lucide-react';
import confetti from 'canvas-confetti';
import PageTransition, { Reveal } from '../components/Transitions';
import { InstagramIcon } from '../components/InstagramIcon';
import { RETREAT_CONFIG, formatPKR } from '../data/retreatConfig';
import { ROOMS_DATA } from '../data/roomsData';
import { luxuryAudio } from '../utils/audio';
import AvailabilityCalendar from '../components/AvailabilityCalendar';
import { isRangeBlocked, recordBookingInquiry, subscribeToAvailability } from '../utils/availability';

export default function Contact() {
  // Booking Calculator State
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState(ROOMS_DATA[0].id);
  const [availTick, setAvailTick] = useState(0);

  useEffect(() => {
    return subscribeToAvailability(() => setAvailTick((t) => t + 1));
  }, []);
  const [checkIn, setCheckIn] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [checkOut, setCheckOut] = useState(() => {
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 3);
    return dayAfter.toISOString().split('T')[0];
  });
  const [guests, setGuests] = useState(2);
  const [specialNote, setSpecialNote] = useState('');
  const [dispatched, setDispatched] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  // Calculation
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn).getTime();
    const end = new Date(checkOut).getTime();
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [checkIn, checkOut]);

  const selectedRoom = useMemo(() => {
    return ROOMS_DATA.find((r) => r.id === selectedRoomId) || ROOMS_DATA[0];
  }, [selectedRoomId]);

  const isBlocked = useMemo(() => {
    return isRangeBlocked(selectedRoom.id, checkIn, checkOut);
  }, [selectedRoom.id, checkIn, checkOut, availTick]);

  const totalPrice = nights * RETREAT_CONFIG.rates.roomRatePKR;

  const handleDispatchWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();

    if (isBlocked) {
      alert('The selected stay dates overlap an existing Airbnb/Booking.com reservation. Please select available dates.');
      setShowCalendar(true);
      return;
    }

    const bookingRef = `VLN-${Date.now().toString(36).toUpperCase()}`;

    // Automatically record booking inquiry in Supabase database
    recordBookingInquiry({
      bookingRef,
      roomId: selectedRoom.id,
      guestName: guestName.trim() || 'Valued Guest',
      guestPhone: guestPhone.trim() || 'WhatsApp Contact',
      guestsCount: guests,
      checkIn,
      checkOut,
      nights,
      totalPricePkr: totalPrice,
      notes: specialNote.trim(),
    }).catch(() => {});

    luxuryAudio.playSuccessChime();

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#C5A059', '#FAF9F6', '#25D366'],
      });
    } catch (_) {}

    const message = [
      `Assalam-o-Alaikum Velenburg Retreat! 🌲`,
      ``,
      `I would like to reserve a stay at Gharial Camp, Murree:`,
      `• Guest Name: ${guestName || 'Valued Guest'}`,
      `• Contact Number: ${guestPhone || 'Provided in WhatsApp'}`,
      `• Selected Suite: ${selectedRoom.name} ("${selectedRoom.officialTagline}")`,
      `• Check-in Date: ${checkIn} (${RETREAT_CONFIG.policies.checkInTime})`,
      `• Check-out Date: ${checkOut} (${RETREAT_CONFIG.policies.checkOutTime})`,
      `• Duration: ${nights} Night${nights > 1 ? 's' : ''}`,
      `• Guests: ${guests} Guest${guests > 1 ? 's' : ''}`,
      `• Rate per Night: PKR ${RETREAT_CONFIG.rates.roomRatePKR.toLocaleString()}`,
      `• Total Estimate: PKR ${totalPrice.toLocaleString()}`,
      specialNote ? `• Note / Request: ${specialNote}` : '',
      ``,
      `Please confirm suite availability and share reservation advance details. Thank you!`,
    ]
      .filter(Boolean)
      .join('\n');

    const url = `https://wa.me/${RETREAT_CONFIG.contact.ownerWhatsApp}?text=${encodeURIComponent(
      message
    )}`;

    setDispatched(true);
    setTimeout(() => {
      window.open(url, '_blank');
    }, 400);
  };

  return (
    <PageTransition>
      {/* ================= HERO WITH REAL ESTATE OUTLOOK ================= */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 bg-[#0F172A] text-alabaster border-b border-slate-700/80 overflow-hidden">
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
              <Compass size={14} strokeWidth={1.75} className="text-[#B48A3E]" />
              <span>Gharial Camp, Murree · 7,200 Ft Elevation</span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight max-w-3xl mx-auto leading-[1.1] drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)]">
              Location & <br />
              <span className="text-[#DFBF77]">Direct Reservations</span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-6 text-base font-normal text-slate-100 max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
              Connect directly with our retreat hosts. Check availability, calculate your stay total at our uniform rate of <strong className="text-white font-semibold">PKR 18,000 / Night</strong>, and secure your dates via WhatsApp.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href={`tel:${RETREAT_CONFIG.contact.rawPhone}`}
                className="px-6 py-3 rounded-full border border-slate-300 bg-white/10 hover:bg-white text-white hover:text-slate-900 text-sm font-semibold transition-all backdrop-blur-md flex items-center gap-2 cursor-pointer"
              >
                <Phone size={15} strokeWidth={1.75} className="text-[#DFBF77]" />
                <span>Call Host: {RETREAT_CONFIG.contact.displayPhone}</span>
              </a>

              <a
                href={`https://wa.me/${RETREAT_CONFIG.contact.ownerWhatsApp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-sm transition-all shadow-sm hover:shadow-md flex items-center gap-2 cursor-pointer"
              >
                <MessageCircle size={16} strokeWidth={1.75} className="fill-white" />
                <span>WhatsApp: {RETREAT_CONFIG.contact.displayPhone}</span>
              </a>

              <a
                href={RETREAT_CONFIG.contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full border border-slate-300 bg-white/10 hover:bg-white text-white hover:text-slate-900 text-sm font-semibold transition-all backdrop-blur-md flex items-center gap-2 cursor-pointer"
              >
                <InstagramIcon size={14} className="text-[#DFBF77]" />
                <span>{RETREAT_CONFIG.contact.instagramHandle}</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= MAIN INTERACTIVE CALCULATOR & LOCATION ================= */}
      <section className="py-16 md:py-24 bg-alabaster">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left 7 Cols: Interactive Stay Calculator */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 border border-slate-200/80 shadow-md">
                <div className="flex items-center justify-between border-b border-slate-100 pb-6 mb-8">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B48A3E]">
                      Direct WhatsApp Reservation Engine
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold leading-[1.2] text-[#0F172A] tracking-tight mt-1">
                      Calculate & Reserve Your Stay
                    </h2>
                  </div>
                  <div className="hidden sm:block text-right">
                    <span className="text-xs text-slate-500 font-medium block">Fixed Rate</span>
                    <div className="text-base font-bold text-[#0F172A]">
                      PKR 18,000 / Night
                    </div>
                  </div>
                </div>

                <form onSubmit={handleDispatchWhatsApp} className="space-y-6">
                  {/* Guest Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-charcoal/70 font-semibold mb-2">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="e.g. Zeeshan Khan"
                        className="w-full px-4 py-3 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-gold transition-colors bg-alabaster/40"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-charcoal/70 font-semibold mb-2">
                        WhatsApp Contact Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder="e.g. 0300-1234567"
                        className="w-full px-4 py-3 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-gold transition-colors bg-alabaster/40"
                      />
                    </div>
                  </div>

                  {/* Suite Selector */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-charcoal/70 font-semibold mb-2">
                      Choose Your Luxury Suite
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {ROOMS_DATA.map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => {
                            luxuryAudio.playChime(600, 0.05);
                            setSelectedRoomId(r.id);
                          }}
                          className={`p-3.5 rounded-xl border text-left transition-all flex items-start justify-between ${
                            selectedRoomId === r.id
                              ? 'border-gold bg-gold/10 shadow-sm'
                              : 'border-charcoal/15 bg-white hover:border-charcoal/30'
                          }`}
                        >
                          <div>
                            <div className="font-semibold text-xs text-charcoal">{r.name}</div>
                            <div className="text-[11px] text-charcoal/60 italic mt-0.5">
                              "{r.officialTagline}"
                            </div>
                          </div>
                          <span className="text-[11px] font-mono text-gold font-bold">
                            PKR 18,000
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Live Calendar Toggle */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-charcoal/70 font-semibold flex items-center gap-1.5">
                      <Calendar size={13} className="text-gold" />
                      <span>Stay Dates</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowCalendar(!showCalendar)}
                      className="text-xs text-gold font-medium hover:underline flex items-center gap-1"
                    >
                      {showCalendar ? 'Hide Live Calendar' : 'View Airbnb/Booking.com Synced Calendar'}
                    </button>
                  </div>

                  {showCalendar && (
                    <div className="my-2">
                      <AvailabilityCalendar
                        roomId={selectedRoom.id}
                        checkIn={checkIn}
                        checkOut={checkOut}
                        onSelectDates={(inDate, outDate) => {
                          setCheckIn(inDate);
                          if (outDate) setCheckOut(outDate);
                        }}
                      />
                    </div>
                  )}

                  {/* Check-in, Check-out & Guests */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-charcoal/70 font-semibold mb-2 flex items-center gap-1.5">
                        <Calendar size={13} className="text-gold" />
                        <span>Check-In Date</span>
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
                        className="w-full px-3.5 py-3 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-gold bg-alabaster/40 cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-charcoal/70 font-semibold mb-2 flex items-center gap-1.5">
                        <Calendar size={13} className="text-gold" />
                        <span>Check-Out Date</span>
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
                        className="w-full px-3.5 py-3 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-gold bg-alabaster/40 cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-charcoal/70 font-semibold mb-2 flex items-center gap-1.5">
                        <Users size={13} className="text-gold" />
                        <span>Total Guests</span>
                      </label>
                      <select
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="w-full px-3.5 py-3 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-gold bg-alabaster/40"
                      >
                        <option value={1}>1 Guest</option>
                        <option value={2}>2 Guests (Recommended)</option>
                        <option value={3}>3 Guests (Family with child)</option>
                      </select>
                    </div>
                  </div>

                  {/* Special Note / Inquiries */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-charcoal/70 font-semibold mb-2">
                      Special Requests or Arrival Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={specialNote}
                      onChange={(e) => setSpecialNote(e.target.value)}
                      placeholder="e.g. Expected arrival time around 4:00 PM, traveling from Islamabad..."
                      className="w-full px-4 py-3 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-gold bg-alabaster/40"
                    />
                  </div>

                  {/* Summary & Price Display */}
                  <div className="p-6 rounded-2xl bg-[#0F172A] text-alabaster border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-[#DFBF77] font-semibold">
                        Stay Calculation ({nights} Night{nights > 1 ? 's' : ''})
                      </span>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-2xl font-bold text-white">
                          PKR {totalPrice.toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-400">
                          (PKR 18,000 / Night × {nights} nights)
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">
                        Includes: King suite, in-room kettle with Tapal Green Tea, Velenburg toiletries kit, heated blankets, and mountain terrace access.
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-sm transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer"
                    >
                      <MessageCircle size={16} strokeWidth={1.75} className="fill-white" />
                      <span>Confirm via WhatsApp</span>
                    </button>
                  </div>
                </form>

                {dispatched && (
                  <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                    <Check size={16} strokeWidth={1.75} className="text-emerald-600 flex-shrink-0" />
                    <span>WhatsApp opened with your pre-filled reservation details! Host will respond promptly.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right 5 Cols: Location, Driving Directions & Host Information */}
            <div className="lg:col-span-5 space-y-6">
              {/* Retreat Address Card */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B48A3E]">
                  Retreat Coordinates
                </span>
                <h3 className="text-xl font-semibold leading-snug text-[#0F172A] mt-1">
                  Velenburg Retreat
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Gharial Camp, Murree Tehsil, Rawalpindi District, Punjab, Pakistan
                </p>

                <div className="mt-6 space-y-4 pt-4 border-t border-slate-100 text-xs sm:text-sm text-slate-700">
                  <div className="flex items-start gap-3">
                    <MapPin size={16} strokeWidth={1.75} className="text-[#B48A3E] flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Elevation & Setting:</strong> 7,200 ft (2,195 m) above sea level in the tranquil Gharial pine ridge.
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Sparkles size={16} strokeWidth={1.75} className="text-[#B48A3E] flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Official Google Rating:</strong> <br />
                      <a
                        href={RETREAT_CONFIG.contact.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-amber-600 font-bold hover:underline mt-0.5"
                      >
                        <Star size={14} className="fill-amber-500 text-amber-500 shrink-0" />
                        <span>4.9 Stars (27 Google Reviews)</span>
                        <ExternalLink size={12} strokeWidth={1.75} className="text-slate-400" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock size={16} strokeWidth={1.75} className="text-[#B48A3E] flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Check-in: 2:00 PM | Check-out: 12:00 PM</strong>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone size={16} strokeWidth={1.75} className="text-[#B48A3E] flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Direct Phone & WhatsApp:</strong> <br />
                      <a href={`tel:${RETREAT_CONFIG.contact.rawPhone}`} className="text-[#0F172A] font-semibold hover:text-[#B48A3E]">
                        {RETREAT_CONFIG.contact.displayPhone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Driving Directions */}
              <div className="bg-[#0F172A] text-alabaster rounded-2xl p-6 sm:p-8 border border-slate-700/80 shadow-md">
                <div className="flex items-center gap-2 text-[#DFBF77] mb-3">
                  <Car size={18} strokeWidth={1.75} />
                  <span className="text-xs uppercase tracking-widest font-semibold">
                    Driving Directions
                  </span>
                </div>
                <h4 className="text-xl font-semibold leading-snug text-white">
                  From Islamabad / Rawalpindi
                </h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed font-normal">
                  Approx. <strong>1 hour 15 minutes</strong> (62 km) drive:
                </p>

                <ol className="mt-4 space-y-3 text-xs sm:text-sm text-slate-300 list-decimal list-inside font-normal">
                  <li>Take the <strong>Islamabad–Murree Expressway (N-75)</strong> to Lower Topa.</li>
                  <li>Follow the scenic Upper Topa bypass towards <strong>Gharial Camp</strong>.</li>
                  <li>Gharial Camp offers serene pine-shaded roads without Mall Road congestion.</li>
                  <li>Ample safe private parking is available on-site for guest vehicles.</li>
                </ol>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <a
                    href={RETREAT_CONFIG.contact.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs text-[#DFBF77] hover:underline font-semibold"
                  >
                    <Navigation size={14} strokeWidth={1.75} />
                    <span>Open Official Velenburg Listing on Google Maps</span>
                    <ExternalLink size={12} strokeWidth={1.75} />
                  </a>
                </div>
              </div>

              {/* Strict Policy Note */}
              <div className="bg-amber-50/70 border border-[#B48A3E]/30 rounded-2xl p-6 text-xs sm:text-sm text-slate-700 leading-relaxed shadow-xs">
                <div className="flex items-center gap-2 text-[#B48A3E] font-semibold mb-2">
                  <Info size={16} strokeWidth={1.75} />
                  <span>Transparent Guest Policy</span>
                </div>
                <p>
                  To maintain an undisturbed alpine sanctuary, Velenburg operates with a strict no-dinner restaurant policy. In-room electric kettle with complimentary Tapal Green Tea sachets and a shared self-use kitchen space are available.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
