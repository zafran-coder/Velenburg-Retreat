import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Mountain,
  Sun,
  Flame,
  Coffee,
  Wind,
  Trees,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  MessageCircle,
  Sparkles,
  Info,
  Calendar,
  X
} from 'lucide-react';
import PageTransition, { Reveal, Stagger, StaggerItem } from '../components/Transitions';
import { AuroraBackground } from '../components/ui';
import { InstagramIcon } from '../components/InstagramIcon';
import { RETREAT_CONFIG, formatPKR } from '../data/retreatConfig';
import { luxuryAudio } from '../utils/audio';

const EASE = [0.16, 1, 0.3, 1] as const;

interface LoungePhoto {
  url: string;
  title: string;
  subtitle: string;
  tag: string;
}

const loungePhotos: LoungePhoto[] = [
  {
    url: '/images/velenburg-exterior.jpg',
    title: 'Full Exterior Outlook & Mountain Estate',
    subtitle: 'Birdseye panoramic view of Velenburg Retreat nestled high in the pine ridges of Gharial Camp at 7,200 ft elevation.',
    tag: 'Estate Exterior',
  },
  {
    url: '/images/terrace-lounge/photo-1.jpg',
    title: 'Indoor Polished Timber Lounge',
    subtitle: 'Vaulted natural pine-paneled ceiling, white woven cane seating, and soft ambient warmth.',
    tag: 'Indoor Lounge',
  },
  {
    url: '/images/terrace-lounge/photo-2.jpg',
    title: 'Floor-to-Ceiling Valley Glass',
    subtitle: 'Panoramic mountain vistas overlooking the Gharial ridge with gas patio heaters for crisp mountain nights.',
    tag: 'Mountain Vista',
  },
  {
    url: '/images/terrace-lounge/photo-3.jpg',
    title: 'Open Terrace Threshold',
    subtitle: 'Direct transition from the heated timber interior onto the open-air stone terrace.',
    tag: 'Terrace Walkout',
  },
  {
    url: '/images/terrace-lounge/photo-4.jpg',
    title: 'Open-Air Ridge Terrace',
    subtitle: 'High-altitude stone patio bordered by towering Murree evergreens at 7,200 ft elevation.',
    tag: 'Open-Air Terrace',
  },
  {
    url: '/images/terrace-lounge/photo-5.jpg',
    title: 'Pine Forest Panorama',
    subtitle: 'Breathe in crisp cedar air and watch the mountain mist roll across the Kashmir highway foothills.',
    tag: 'Nature Sanctuary',
  },
  {
    url: '/images/terrace-lounge/photo-6.jpg',
    title: 'Evening Sunset Sanctuary',
    subtitle: 'Golden hour warmth settling over the outdoor dining and lounge viewing deck.',
    tag: 'Golden Hour Deck',
  },
];

const highlights = [
  {
    icon: Mountain,
    title: '7,200 Ft Ridge Elevation',
    desc: 'Unobstructed 180° panoramic vistas across the pine valleys of Murree and Gharial Camp.',
  },
  {
    icon: Flame,
    title: 'Gas Patio Warmth',
    desc: 'Standing radiant patio heaters provide continuous comfort during cool Murree evenings and winter frost.',
  },
  {
    icon: Coffee,
    title: 'Self-Use Guest Kitchen',
    desc: 'Complimentary access to guest refrigeration, microwave, hot water, and tea brewing facilities.',
  },
  {
    icon: Wind,
    title: 'Alpine Air & Pine Breeze',
    desc: 'Pure mountain oxygen filtered naturally through hundreds of surrounding Himalayan pines.',
  },
];

export default function Bespoke() {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [lightboxPhoto, setLightboxPhoto] = useState<LoungePhoto | null>(null);

  const whatsappInquiryUrl = `https://wa.me/${RETREAT_CONFIG.contact.ownerWhatsApp}?text=Assalam-o-Alaikum%20Velenburg%20Retreat!%20🌲%0AI%20am%20interested%20in%20visiting%20the%20Mountain%20View%20Lounge%20and%20booking%20a%20luxury%20suite.`;

  const nextSlide = () => {
    luxuryAudio.playChime(620, 0.05);
    setActivePhotoIdx((prev) => (prev + 1) % loungePhotos.length);
  };

  const prevSlide = () => {
    luxuryAudio.playChime(540, 0.05);
    setActivePhotoIdx((prev) => (prev - 1 + loungePhotos.length) % loungePhotos.length);
  };

  return (
    <PageTransition>
      {/* ================= HERO HEADER WITH REAL ESTATE OUTLOOK ================= */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 bg-[#0F172A] text-alabaster border-b border-slate-700/80 overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/images/velenburg-exterior.jpg"
            alt="Velenburg Retreat Mountain Ridge & Estate Exterior"
            className="w-full h-full object-cover object-center filter brightness-100 contrast-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/45" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-[#DFBF77] text-xs font-semibold tracking-[0.2em] uppercase mb-6 shadow-md">
              <Trees size={14} strokeWidth={1.75} className="text-[#B48A3E]" />
              <span>Shared Mountain Haven · Gharial Camp</span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight max-w-3xl mx-auto leading-[1.1] drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)]">
              Mountain View Lounge <br />
              <span className="text-[#DFBF77]">& Open Ridge Terrace</span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-6 text-base font-normal text-slate-100 max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
              Step into polished timber ceilings, comfortable woven cane seating, and an expansive open stone terrace overlooking the misty pine valleys of Murree at 7,200 ft elevation.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-sm transition-all shadow-sm hover:shadow-md flex items-center gap-2 cursor-pointer"
              >
                <MessageCircle size={16} strokeWidth={1.75} className="fill-white" />
                <span>Plan Your Stay via WhatsApp</span>
              </a>

              <Link
                to="/collections"
                className="px-6 py-3 rounded-full border border-slate-300 bg-white/10 hover:bg-white text-white hover:text-slate-900 hover:border-[#DFBF77] text-sm font-semibold transition-all backdrop-blur-md cursor-pointer"
              >
                View 4 Luxury Suites
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= FEATURED HERO CAROUSEL ================= */}
      <section className="py-16 md:py-24 bg-alabaster">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0F172A] rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl relative">
            {/* Main Stage Image */}
            <div className="relative aspect-[16/9] md:aspect-[21/10] overflow-hidden">
              <img
                src={loungePhotos[activePhotoIdx].url}
                alt={loungePhotos[activePhotoIdx].title}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30" />

              {/* Tag Badge */}
              <div className="absolute top-6 left-6 z-10 flex items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#0F172A]/85 text-[#DFBF77] border border-[#B48A3E]/30 backdrop-blur-md uppercase tracking-wider">
                  {loungePhotos[activePhotoIdx].tag}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium text-white/80 bg-black/40 backdrop-blur-md">
                  {activePhotoIdx + 1} of {loungePhotos.length}
                </span>
              </div>

              {/* Enlarge Button */}
              <button
                onClick={() => setLightboxPhoto(loungePhotos[activePhotoIdx])}
                className="absolute top-6 right-6 z-10 p-2.5 rounded-full bg-black/50 text-white hover:bg-[#B48A3E] border border-white/20 transition-colors backdrop-blur-md cursor-pointer"
                aria-label="Enlarge photo"
              >
                <Maximize2 size={16} strokeWidth={1.75} />
              </button>

              {/* Caption & Controls */}
              <div className="absolute bottom-6 inset-x-6 z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="max-w-xl">
                  <h3 className="text-xl font-semibold leading-snug text-white">
                    {loungePhotos[activePhotoIdx].title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-300 font-normal">
                    {loungePhotos[activePhotoIdx].subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end">
                  <button
                    onClick={prevSlide}
                    className="p-3 rounded-full bg-white/10 hover:bg-[#B48A3E] text-white transition-colors border border-white/20 backdrop-blur-md cursor-pointer"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} strokeWidth={1.75} />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="p-3 rounded-full bg-white/10 hover:bg-[#B48A3E] text-white transition-colors border border-white/20 backdrop-blur-md cursor-pointer"
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} strokeWidth={1.75} />
                  </button>
                </div>
              </div>
            </div>

            {/* Thumbnail Navigation Strip */}
            <div className="p-4 bg-[#0F172A] border-t border-white/10 flex items-center gap-2 overflow-x-auto">
              {loungePhotos.map((photo, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    luxuryAudio.playChime(580, 0.05);
                    setActivePhotoIdx(idx);
                  }}
                  className={`relative flex-shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    idx === activePhotoIdx
                      ? 'border-[#B48A3E] scale-105 shadow-md'
                      : 'border-white/20 opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={photo.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4 ARCHITECTURAL PILLARS ================= */}
      <section className="py-16 md:py-24 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B48A3E]">
              The Lounge Experience
            </span>
            <h2 className="text-3xl md:text-4xl font-bold leading-[1.2] text-[#0F172A] tracking-tight mt-2">
              Designed for Quiet Relaxation
            </h2>
            <p className="mt-4 text-base font-normal leading-relaxed text-slate-600">
              Read by the panoramic windows, enjoy fresh green tea with family, or step onto the stone terrace to gaze at star-filled mountain night skies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((h, i) => (
              <div
                key={i}
                className="bg-alabaster rounded-2xl p-6 border border-slate-200/80 hover:border-[#B48A3E] transition-all shadow-xs flex flex-col justify-between h-full"
              >
                <div>
                  <div className="h-12 w-12 rounded-xl bg-[#B48A3E]/15 border border-[#B48A3E]/30 grid place-items-center text-[#B48A3E] mb-5">
                    <h.icon size={22} strokeWidth={1.75} />
                  </div>
                  <h3 className="text-xl font-semibold leading-snug text-[#0F172A]">{h.title}</h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SELF-USE KITCHEN & TEA CULTURE ================= */}
      <section className="py-16 md:py-24 bg-[#0F172A] text-alabaster border-t border-slate-700/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#DFBF77]">
                Warm Hospitality & Self-Catering
              </span>
              <h2 className="text-3xl md:text-4xl font-bold leading-[1.2] text-white tracking-tight">
                Self-Use Kitchen & <br />
                <span className="text-[#DFBF77]">Complimentary In-Room Tea</span>
              </h2>
              <p className="text-base font-normal leading-relaxed text-slate-300">
                To preserve complete calm and privacy, Velenburg does not operate a commercial dining restaurant. Instead, we provide:
              </p>

              <ul className="space-y-3.5 text-sm text-slate-200">
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} strokeWidth={1.75} className="text-[#DFBF77] flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>In-Suite Electric Kettle:</strong> In every room with complimentary Tapal Green Tea sachets and mugs.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} strokeWidth={1.75} className="text-[#DFBF77] flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Shared Self-Use Kitchen:</strong> Equipped with refrigeration, microwave, clean sink, and prep space for snacks and baby food.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} strokeWidth={1.75} className="text-[#DFBF77] flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Local Dining Deliveries:</strong> Trusted Murree and Upper Topa restaurant menus with fast delivery directly to the retreat.
                  </span>
                </li>
              </ul>

              <div className="pt-2">
                <a
                  href={`https://wa.me/${RETREAT_CONFIG.contact.ownerWhatsApp}?text=Assalam-o-Alaikum%20Velenburg%20Retreat!%20I%20would%20like%20to%20ask%20about%20the%20terrace%20and%20kitchen%20facilities.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-sm transition-all shadow-sm hover:shadow-md cursor-pointer"
                >
                  <MessageCircle size={16} strokeWidth={1.75} className="fill-white" />
                  <span>Inquire via WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden border border-white/20 aspect-[4/5] shadow-lg">
                <img
                  src="/images/shared/kettle-toiletries-tray.jpg"
                  alt="In-room kettle and Tapal tea tray"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden border border-white/20 aspect-square shadow-lg">
                  <img
                    src="/images/terrace-lounge/photo-2.jpg"
                    alt="Floor-to-ceiling lounge window"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden border border-white/20 aspect-square shadow-lg">
                  <img
                    src="/images/terrace-lounge/photo-4.jpg"
                    alt="Open stone terrace"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= LIGHTBOX MODAL ================= */}
      <AnimatePresence>
        {lightboxPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
            onClick={() => setLightboxPhoto(null)}
          >
            <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center">
              <button
                onClick={() => setLightboxPhoto(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors"
              >
                <X size={22} />
              </button>
              <img
                src={lightboxPhoto.url}
                alt={lightboxPhoto.title}
                className="max-h-[75vh] w-auto object-contain rounded-2xl shadow-2xl border border-white/20"
              />
              <div className="mt-4 text-center text-alabaster">
                <h4 className="text-xl font-serif">{lightboxPhoto.title}</h4>
                <p className="text-xs text-alabaster/70 mt-1 max-w-xl mx-auto">
                  {lightboxPhoto.subtitle}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
