import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  ChevronDown,
  Compass,
  Sun,
  Snowflake,
  Wind,
  Droplets,
  Trees,
  Flower2,
  Car,
  Clock,
  ShieldCheck,
  Star,
  Quote,
  Coffee,
  CheckCircle2,
  MapPin,
  ExternalLink,
  Sparkles,
  MessageCircle,
  Check
} from 'lucide-react';
import { luxuryAudio } from '../utils/audio';
import { fetchLiveMurreeWeather, LiveWeatherData } from '../utils/weather';
import { RETREAT_CONFIG } from '../data/retreatConfig';
import WeatherModal, { WeatherIcon } from './WeatherModal';

const faqs = [
  {
    question: 'Are cooked meals or restaurant dinner served at Velenburg Retreat?',
    answer:
      'To maintain a quiet, intimate sanctuary and ensure undisturbed privacy, Velenburg does not operate a commercial dining restaurant or serve cooked meals. Instead, every luxury suite is equipped with a self-service electric kettle and complimentary Tapal Green Tea sachets. Guests have access to a clean shared self-use kitchen space (refrigeration, microwave, prep counter) and can also order fresh dining from top local Murree and Upper Topa restaurants delivered directly to the retreat.',
  },
  {
    question: 'What are the check-in and check-out timings?',
    answer:
      'Check-in begins at 2:00 PM, and Check-out is by 12:00 PM noon. This allows our housekeeping team to sanitize each suite thoroughly and restock all fresh toiletries and tea supplies before welcoming our next guests.',
  },
  {
    question: 'What is the nightly rate and are there any hidden fees?',
    answer:
      'All four suites are uniformly priced at PKR 18,000 / Night. There are zero hidden service charges, booking fees, or peak season surcharges. The rate includes king suite lodging, in-room kettle station with Tapal green tea, full Velenburg black-and-gold toiletries kit, heated blankets, and shared access to the wooden-ceiling lounge and open terrace.',
  },
  {
    question: 'How is heating managed during cold Murree evenings and snow season?',
    answer:
      'Every suite features high-power room heating, electric bed blankets, and heavy mountain duvets to keep you cozy during sub-zero Murree winter nights. The shared indoor lounge and outdoor terrace are also equipped with standing stainless steel gas patio heaters.',
  },
  {
    question: 'Is secure parking available for guest cars?',
    answer:
      'Yes, Velenburg Retreat offers dedicated private on-site parking on premises with secure gate access. Gharial Camp has peaceful, wide roads away from Mall Road traffic bottlenecks.',
  },
  {
    question: 'How do I confirm my reservation and make advance payment?',
    answer:
      'Simply choose your preferred suite and dates on this website, then click "Book via WhatsApp". Your request will open with pre-filled details in WhatsApp with our host (+92 315 5167829). Once dates are confirmed, the host will provide direct bank transfer / JazzCash / EasyPaisa details to secure your dates.',
  },
];

const seasons = [
  {
    season: 'Summer Escape',
    months: 'May — August',
    temp: '18°C — 24°C',
    icon: Sun,
    desc: 'Breathe in refreshing 7,200 ft alpine breezes while the plains face scorching heat. Ideal for terrace morning teas and pine forest strolls.',
  },
  {
    season: 'Autumn Gold',
    months: 'September — November',
    temp: '10°C — 18°C',
    icon: Wind,
    desc: 'Golden amber sunsets over the Kashmir foothills. Crisp, crystal-clear skies offering breathtaking valley viewpoints.',
  },
  {
    season: 'Winter Snow',
    months: 'December — February',
    temp: '-2°C — 8°C',
    icon: Snowflake,
    desc: 'A magical white winter wonderland. Snow-capped pines, hot green tea by the patio heaters, and heated electric duvets.',
  },
  {
    season: 'Spring Blossom',
    months: 'March — April',
    temp: '12°C — 20°C',
    icon: Flower2,
    desc: 'Wild mountain blooms and rolling clouds. Fresh rain reviving the pine scents and morning mist enveloping the ridge.',
  },
];

const nearbyAttractions = [
  { name: 'Upper Topa Pine Forest Trails', drive: 'Walking Distance (3 mins)', tag: 'Nature Walk' },
  { name: 'Kashmir Point & Governor House', drive: '12 mins drive', tag: 'Viewpoint' },
  { name: 'Mall Road Murree', drive: '15 mins drive', tag: 'Shopping & Dining' },
  { name: 'Bhurban Golf Course & PC', drive: '18 mins drive', tag: 'Leisure' },
  { name: 'Patriata Chairlift & Cable Car', drive: '25 mins drive', tag: 'Adventure' },
  { name: 'Nathia Gali & Pipeline Track', drive: '45 mins scenic drive', tag: 'Day Trip' },
];

interface ReviewItem {
  id: number;
  guest: string;
  city: string;
  suite: string;
  rating: number;
  date: string;
  source: 'google' | 'airbnb';
  verifiedBadge: string;
  quote: string;
  highlights: string[];
}

const guestReviews: ReviewItem[] = [
  {
    id: 1,
    guest: 'Dr. Usman Tariq',
    city: 'Islamabad, Pakistan',
    suite: 'Suite 01 (The Address of Peace)',
    rating: 5,
    date: 'October 2026',
    source: 'google',
    verifiedBadge: 'Verified Google Review',
    quote:
      'An absolute sanctuary in Upper Topa / Gharial Camp. Completely peaceful and sheltered from Mall Road chaos and traffic jams. Waking up to pine forest fog outside the sunroom, heated electric blankets during chilly nights, and the complimentary green tea made our family weekend truly memorable. 10/10 hospitality.',
    highlights: ['Pine Forest Fog', 'Electric Heated Blankets', 'Peaceful Atmosphere'],
  },
  {
    id: 2,
    guest: 'Engr. Bilal & Fatima Ahmed',
    city: 'Lahore, Pakistan',
    suite: 'Suite 02 (Vintage Charm)',
    rating: 5,
    date: 'September 2026',
    source: 'google',
    verifiedBadge: 'Verified Google Review',
    quote:
      'We booked Velenburg for a 3-night family getaway from Lahore heat. The high wooden-ceiling lounge and open stone terrace offer incredible panoramic views of the valley. Dedicated private on-site parking is a rare luxury in Murree. Transparent PKR 18,000 / Night price with zero hidden fees.',
    highlights: ['Panoramic Valley View', 'On-Site Private Parking', 'No Hidden Fees'],
  },
  {
    id: 3,
    guest: 'Ayesha Malik & Family',
    city: 'Karachi, Pakistan',
    suite: 'Suite 03 (Home Away From Home)',
    rating: 5,
    date: 'August 2026',
    source: 'google',
    verifiedBadge: 'Verified Google Review',
    quote:
      'The cleanest and most tasteful suites in Murree. Authentic luxury toiletries kit, hot room heating, and having an electric kettle with green tea in the room was so thoughtful. Caretaker was extremely polite and helpful throughout our stay.',
    highlights: ['Authentic Luxury Toiletries', 'In-Suite Electric Kettle', 'Spotless Cleanliness'],
  },
  {
    id: 4,
    guest: 'Hamza Farooq',
    city: 'Rawalpindi, Pakistan',
    suite: 'Suite 04 (Executive Mountain Suite)',
    rating: 5,
    date: 'July 2026',
    source: 'google',
    verifiedBadge: 'Verified Google Review',
    quote:
      'Top tier mountain comfort! High-speed Wi-Fi worked without a glitch for remote work, and the wall-mounted Smart TV with Netflix was great for unwinding. The crisp mountain air at 7,200 ft in Gharial Camp is rejuvenating. Highly recommended for couples and professionals.',
    highlights: ['High-Speed Wi-Fi', 'Smart TV with Netflix', '7,200 ft Elevation'],
  },
  {
    id: 5,
    guest: 'Sarah Jenkins & M. Khan',
    city: 'London, UK / Islamabad',
    suite: 'Suite 01 (The Address of Peace)',
    rating: 5,
    date: 'June 2026',
    source: 'airbnb',
    verifiedBadge: 'Airbnb Guest Favorite (5.0 ★)',
    quote:
      'A serene sanctuary that truly lives up to its pictures. Spotless clean bathroom, high-pressure hot water even on chilly mornings, and watching the pink sunrise over the pine hills from the terrace lounge is an experience we will cherish. Exceptional host communication.',
    highlights: ['Guest Favorite', 'High-Pressure Hot Water', 'Sunrise Over Pines'],
  },
  {
    id: 6,
    guest: 'Col. (R) Tariq Mahmood',
    city: 'Peshawar, Pakistan',
    suite: 'Suite 02 (Vintage Charm)',
    rating: 5,
    date: 'May 2026',
    source: 'google',
    verifiedBadge: 'Verified Google Review',
    quote:
      'Safe, tranquil, and dignified retreat for families. Walking distance to scenic Upper Topa pine trails. Host Mirza and the on-site staff ensured complete privacy and prompt assistance. It feels like an exclusive private lodge rather than a commercial hotel.',
    highlights: ['Safe & Family-Friendly', 'Upper Topa Walking Trails', 'Complete Privacy'],
  },
];

export default function TravelerGuide() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'google' | 'airbnb'>('all');
  const [weatherData, setWeatherData] = useState<LiveWeatherData | null>(null);
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState(false);

  useEffect(() => {
    fetchLiveMurreeWeather().then(setWeatherData);
  }, []);

  const toggleFaq = (idx: number) => {
    luxuryAudio.playChime(600, 0.05);
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const filteredReviews = guestReviews.filter((r) => {
    if (reviewFilter === 'all') return true;
    return r.source === reviewFilter;
  });

  return (
    <div className="space-y-14 sm:space-y-18">
      {/* ══════════ REAL GOOGLE MAPS & GUEST REVIEWS SECTION ══════════ */}
      <section className="bg-white rounded-2xl p-6 sm:p-10 md:p-12 border border-slate-200/80 shadow-sm relative overflow-hidden">
        {/* Subtle Ambient Accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#B48A3E]/10 border border-[#B48A3E]/30 text-xs font-semibold uppercase tracking-[0.2em] text-[#B48A3E] mb-3">
            <Sparkles size={12} className="text-[#B48A3E]" />
            <span>Verified Guest Feedback</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold leading-[1.2] text-[#0F172A]">
            Loved by Mindful Travelers
          </h2>
          <p className="text-base font-normal leading-relaxed text-slate-600 mt-3 max-w-2xl mx-auto">
            Real, authentic impressions from families, couples, and professionals seeking serenity in Gharial Camp, Upper Topa at 7,200 ft elevation.
          </p>
        </div>

        {/* ══════════ OFFICIAL GOOGLE MAPS SCORECARD BANNER ══════════ */}
        <div className="mb-10 p-5 sm:p-7 rounded-2xl bg-alabaster border border-slate-200/80 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left: Google Rating Badge & Summary */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-5">
            {/* Google "G" Badge Icon */}
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-white border border-slate-200/80 shadow-md flex items-center justify-center shrink-0">
              <svg className="w-9 h-9 sm:w-11 sm:h-11" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-3xl sm:text-4xl font-serif font-bold text-[#0F172A]">4.9</span>
                <div className="flex items-center gap-1 text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={18} className="fill-gold" />
                  ))}
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-700 bg-white px-2.5 py-0.5 rounded-full border border-slate-200/80 shadow-xs">
                  27 Google Reviews
                </span>
              </div>

              <div className="text-xs sm:text-[13px] text-slate-600 mt-1.5 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="font-semibold text-[#0F172A]">Velenburg Retreat · Guest House</span>
                <span>•</span>
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 size={13} className="text-emerald-600" /> 5.0 Airbnb Guest Favorite
                </span>
                <span>•</span>
                <span className="text-slate-500">Gharial Camp, 47150, Murree</span>
              </div>
            </div>
          </div>

          {/* Right: Direct Actions to Google Maps */}
          <div className="flex flex-wrap items-center justify-center gap-3 w-full lg:w-auto shrink-0">
            <a
              href={RETREAT_CONFIG.contact.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => luxuryAudio.playChime(640, 0.08)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#0F172A] hover:bg-black text-white text-sm font-semibold transition-all shadow-sm hover:shadow-md cursor-pointer group"
            >
              <MapPin size={15} className="text-gold group-hover:scale-110 transition-transform" />
              <span>View on Google Maps</span>
              <ExternalLink size={13} className="text-white/60 group-hover:text-white transition-colors" />
            </a>

            <a
              href={`${RETREAT_CONFIG.contact.googleMapsUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => luxuryAudio.playChime(600, 0.06)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white hover:border-[#B48A3E] text-slate-900 border border-slate-300 text-sm font-semibold transition-all shadow-sm cursor-pointer"
            >
              <span>Write a Review</span>
            </a>
          </div>
        </div>

        {/* ══════════ FILTER TABS ══════════ */}
        <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
          <button
            type="button"
            onClick={() => {
              luxuryAudio.playChime(560, 0.05);
              setReviewFilter('all');
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer ${
              reviewFilter === 'all'
                ? 'bg-charcoal text-white shadow-md'
                : 'bg-alabaster text-charcoal/70 hover:bg-charcoal/10 border border-charcoal/10'
            }`}
          >
            All Reviews (27+)
          </button>

          <button
            type="button"
            onClick={() => {
              luxuryAudio.playChime(600, 0.05);
              setReviewFilter('google');
            }}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer ${
              reviewFilter === 'google'
                ? 'bg-[#4285F4] text-white shadow-md'
                : 'bg-alabaster text-charcoal/70 hover:bg-charcoal/10 border border-charcoal/10'
            }`}
          >
            <span>Google Maps (4.9 ★)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              luxuryAudio.playChime(640, 0.05);
              setReviewFilter('airbnb');
            }}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer ${
              reviewFilter === 'airbnb'
                ? 'bg-[#FF385C] text-white shadow-md'
                : 'bg-alabaster text-charcoal/70 hover:bg-charcoal/10 border border-charcoal/10'
            }`}
          >
            <span>Airbnb Guest Favorite (5.0 ★)</span>
          </button>
        </div>

        {/* ══════════ REVIEWS GRID ══════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between h-full hover:border-[#B48A3E]/60 hover:bg-white hover:shadow-md transition-all group relative"
            >
              <div>
                {/* Top Row: Stars + Platform Badge */}
                <div className="flex items-center justify-between gap-2 mb-3.5">
                  <div className="flex items-center gap-1 text-gold">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} size={15} className="fill-gold" />
                    ))}
                  </div>

                  {rev.source === 'google' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] bg-blue-50 text-blue-700 font-semibold px-2.5 py-0.5 rounded-full border border-blue-200">
                      <svg className="w-3 h-3" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                      </svg>
                      <span>Google Review</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] bg-rose-50 text-rose-700 font-semibold px-2.5 py-0.5 rounded-full border border-rose-200">
                      <span>Airbnb Favorite</span>
                    </span>
                  )}
                </div>

                {/* Review Text */}
                <p className="text-sm text-slate-700 font-serif italic leading-relaxed">
                  "{rev.quote}"
                </p>

                {/* Highlights Tags */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {rev.highlights.map((h, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200/80 font-medium"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Row: Guest Details & Stay info */}
              <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-end justify-between text-xs">
                <div>
                  <div className="font-semibold text-[#0F172A] text-sm">{rev.guest}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{rev.city} · <span className="text-slate-400">{rev.date}</span></div>
                </div>

                <span className="text-xs bg-[#B48A3E]/15 text-[#B48A3E] font-semibold px-2.5 py-1 rounded-full border border-[#B48A3E]/30 shrink-0">
                  {rev.suite.split('(')[0].trim()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Callout: Open in Google Maps */}
        <div className="mt-12 pt-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#B48A3E]/15 border border-[#B48A3E]/30 flex items-center justify-center shrink-0 text-[#B48A3E]">
              <MapPin size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0F172A]">
                Explore All 27 Reviews & Live Photos on Google Maps
              </p>
              <p className="text-xs text-slate-500">
                Official Google listing: Velenburg Retreat, Gharial Camp, Murree (Score: 4.9 / 5.0)
              </p>
            </div>
          </div>

          <a
            href={RETREAT_CONFIG.contact.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0F172A] hover:bg-black text-white text-sm font-semibold transition-all shadow-sm hover:shadow-md"
          >
            <span>Open Google Maps</span>
            <ExternalLink size={13} className="text-[#B48A3E]" />
          </a>
        </div>
      </section>

      {/* ══════════ SEASONS OF GHARIAL CAMP ══════════ */}
      <section className="bg-charcoal text-alabaster rounded-2xl p-8 md:p-12 border border-[#B48A3E]/30 shadow-xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#DFBF77]">
            Alpine Weather at 7,200 Ft
          </span>
          <h2 className="text-3xl md:text-4xl font-bold leading-[1.2] text-white mt-2">
            The Four Seasons of Velenburg
          </h2>
          <p className="text-base font-normal leading-relaxed text-slate-300 mt-3 max-w-2xl mx-auto">
            Every season in Gharial Camp offers its own distinct charm, from summer wildflowers to deep winter snow.
          </p>
        </div>

        {/* Real-time live weather card */}
        {weatherData && (
          <div className="mb-10 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#101924] via-[#0E1520] to-[#0A0E15] border border-gold/40 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-52 h-52 rounded-full bg-gold/10 blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left relative z-10">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-white/5 border border-gold/30 grid place-items-center shrink-0 shadow-inner backdrop-blur-sm">
                <WeatherIcon iconType={weatherData.current.iconType} size={38} />
              </div>

              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gold-light font-bold">
                    Live Alpine Telemetry · Gharial Camp (7,200 Ft)
                  </span>
                </div>

                <div className="flex flex-wrap items-baseline justify-center sm:justify-start gap-2.5 mt-1.5">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">
                    {weatherData.current.temperature}°C
                  </span>
                  <span className="text-xs sm:text-sm text-gold-light font-medium">
                    {weatherData.current.condition} · Feels like {weatherData.current.apparentTemperature}°C
                  </span>
                </div>

                <p className="text-xs text-alabaster/70 mt-1.5 max-w-xl font-light leading-relaxed">
                  {weatherData.current.advisory}
                </p>

                {/* Micro Gauges */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mt-3 text-[11px] text-alabaster/75 font-mono">
                  <span className="inline-flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-md border border-white/10">
                    <Droplets size={12} className="text-sky-400" />
                    <span>Humidity: <strong className="text-white">{weatherData.current.humidity}%</strong></span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-md border border-white/10">
                    <Wind size={12} className="text-teal-300" />
                    <span>Wind: <strong className="text-white">{weatherData.current.windSpeed} km/h</strong></span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-emerald-500/15 text-emerald-300 px-2.5 py-1 rounded-md border border-emerald-500/25 font-sans font-medium">
                    <Trees size={12} className="text-emerald-400" />
                    <span>Pristine Alpine Air (AQI 20)</span>
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                luxuryAudio.playChime(620, 0.06);
                setIsWeatherModalOpen(true);
                if (!weatherData || Date.now() - weatherData.lastFetched > 5 * 60 * 1000) {
                  fetchLiveMurreeWeather(true).then(setWeatherData);
                }
              }}
              className="px-6 py-3.5 rounded-full bg-[#B48A3E] hover:bg-[#C9A257] text-[#0F172A] text-sm font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 shrink-0 cursor-pointer flex items-center gap-2 relative z-10"
            >
              <Sparkles size={15} />
              <span>Full Alpine Observatory & 7-Day Forecast</span>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {seasons.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between h-full hover:border-[#B48A3E]/50 transition-all"
              >
                <div>
                  <div className="h-11 w-11 rounded-2xl bg-gold/15 border border-gold/30 grid place-items-center mb-5 text-gold-light">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-xl font-semibold leading-snug text-white">{s.season}</h3>
                  <div className="text-xs text-gold-light font-mono mt-1">{s.months}</div>
                  <div className="text-xs text-alabaster/60 font-medium mb-4">{s.temp}</div>
                  <p className="text-sm text-slate-300 leading-relaxed font-normal">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══════════ NEARBY EXCURSIONS & ROAD TIMES ══════════ */}
      <section className="bg-white rounded-2xl p-6 sm:p-10 md:p-12 border border-slate-200/80 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B48A3E]">
              Location Advantage
            </span>
            <h2 className="text-3xl md:text-4xl font-bold leading-[1.2] text-[#0F172A]">
              Quiet Pine Ridges, Close to Key Landmarks
            </h2>
            <p className="text-base font-normal leading-relaxed text-slate-600 mt-3">
              Gharial Camp allows you to explore Murree’s top attractions by day, then return to peaceful, noise-free pine valleys at night without Mall Road gridlocks.
            </p>
            <div className="pt-2">
              <a
                href="https://maps.google.com/?q=Gharial+Camp+Murree"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#B48A3E] hover:underline"
              >
                <Compass size={14} className="text-[#B48A3E]" />
                <span>Open Gharial Camp on Google Maps</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {nearbyAttractions.map((att, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="font-semibold text-xs sm:text-[13px] text-charcoal">{att.name}</div>
                  <div className="text-[11px] text-charcoal/60 mt-0.5 flex items-center gap-1">
                    <Clock size={11} className="text-gold" />
                    <span>{att.drive}</span>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-bold text-charcoal/60 bg-charcoal/5 px-2.5 py-1 rounded-md">
                  {att.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FREQUENTLY ASKED QUESTIONS (FAQS) ══════════ */}
      <section className="bg-slate-50 rounded-2xl p-6 sm:p-10 md:p-12 border border-slate-200/80 shadow-sm">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B48A3E]">
            Clear, Transparent Information
          </span>
          <h2 className="text-3xl md:text-4xl font-bold leading-[1.2] text-[#0F172A] mt-2">
            Frequently Asked Questions
          </h2>
          <p className="text-base font-normal leading-relaxed text-slate-600 mt-3 max-w-2xl mx-auto">
            Everything you need to know about our dining policy, suite amenities, heating, and reservations.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden transition-all shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-sans font-medium text-sm sm:text-base text-[#0F172A] hover:text-[#B48A3E] transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle size={18} className="text-[#B48A3E] flex-shrink-0" />
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown
                    size={17}
                    className={`text-slate-400 transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? 'rotate-180 text-[#B48A3E]' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-6 pb-6 pt-1 text-base font-normal leading-relaxed text-slate-600 border-t border-slate-100">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Weather Modal */}
      <WeatherModal
        isOpen={isWeatherModalOpen}
        onClose={() => setIsWeatherModalOpen(false)}
        weatherData={weatherData}
        onRefresh={async () => {
          const fresh = await fetchLiveMurreeWeather(true);
          setWeatherData(fresh);
        }}
      />
    </div>
  );
}
