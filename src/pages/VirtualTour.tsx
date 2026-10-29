import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Compass,
  Sun,
  Moon,
  Sparkles,
  Layers,
  ArrowRight,
  CheckCircle,
  Info,
  Move3d,
  BedDouble,
  Coffee,
  Maximize2,
  Flame,
  MessageCircle,
  ShieldCheck,
  Trees,
  Plus,
  X
} from 'lucide-react';
import PageTransition, { Reveal, Stagger, StaggerItem } from '../components/Transitions';
import WhatsAppBookingModal from '../components/WhatsAppBookingModal';
import { ROOMS_DATA, RoomSuite } from '../data/roomsData';
import { RETREAT_CONFIG, formatPKR } from '../data/retreatConfig';
import { luxuryAudio } from '../utils/audio';

const EASE = [0.16, 1, 0.3, 1] as const;

type AmbienceMode = 'daylight' | 'golden' | 'night';

const ambienceModes: { id: AmbienceMode; label: string; icon: any; filter: string; desc: string }[] = [
  {
    id: 'daylight',
    label: 'Morning Alpine Sun',
    icon: Sun,
    filter: 'brightness(1.05) saturate(1.05)',
    desc: 'Crisp morning daylight reflecting off Himalayan pine needles at 7,200 ft.',
  },
  {
    id: 'golden',
    label: 'Golden Hour Dusk',
    icon: Sparkles,
    filter: 'sepia(0.2) contrast(1.05) brightness(0.98)',
    desc: 'Rich amber sunset filtering through the suite sunrooms and open terrace.',
  },
  {
    id: 'night',
    label: 'Cozy Mountain Night',
    icon: Moon,
    filter: 'contrast(1.1) brightness(0.85) hue-rotate(-5deg)',
    desc: 'Intimate evening warmth with electric duvets and quiet pine breezes.',
  },
];

export default function VirtualTour() {
  const [selectedSuiteId, setSelectedSuiteId] = useState<number>(ROOMS_DATA[0].id);
  const [ambience, setAmbience] = useState<AmbienceMode>('golden');
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [activePinId, setActivePinId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const selectedSuite = useMemo(() => {
    return ROOMS_DATA.find((r) => r.id === selectedSuiteId) || ROOMS_DATA[0];
  }, [selectedSuiteId]);

  const activeAmbience = ambienceModes.find((a) => a.id === ambience)!;

  const currentPhoto = selectedSuite.photos[activePhotoIdx] || selectedSuite.photos[0];

  const handleSelectSuite = (id: number) => {
    luxuryAudio.playChime(600, 0.06);
    setSelectedSuiteId(id);
    setActivePhotoIdx(0);
    setActivePinId(null);
  };

  const handleSelectAmbience = (mode: AmbienceMode) => {
    luxuryAudio.playChime(680, 0.05);
    setAmbience(mode);
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
              <Move3d size={14} strokeWidth={1.75} className="text-[#B48A3E]" />
              <span>Interactive Tour · Gharial Camp, Murree</span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight max-w-3xl mx-auto leading-[1.1] drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)]">
              Interactive Suite Explorer <br />
              <span className="text-[#DFBF77]">& Mountain Views</span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-6 text-base font-normal text-slate-100 max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
              Explore our four luxury suites and scenic mountain lounge with authentic photography, room highlights, and time-of-day atmospheric filters.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ================= EXPLORER STAGE ================= */}
      <section className="py-16 md:py-24 bg-alabaster">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Controls Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            {/* Suite Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {ROOMS_DATA.map((r, i) => (
                <button
                  key={r.id}
                  onClick={() => handleSelectSuite(r.id)}
                  className={`px-4 py-2.5 rounded-full text-xs tracking-wider uppercase transition-all duration-300 font-semibold cursor-pointer ${
                    selectedSuiteId === r.id
                      ? 'bg-[#0F172A] text-white border border-[#B48A3E] shadow-sm'
                      : 'bg-alabaster text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  Suite 0{i + 1}
                </button>
              ))}
            </div>

            {/* Time of Day Ambience Switcher */}
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold mr-1">
                Atmosphere:
              </span>
              {ambienceModes.map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => handleSelectAmbience(m.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      ambience === m.id
                        ? 'bg-[#B48A3E] text-white font-semibold shadow-xs'
                        : 'bg-alabaster text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <Icon size={14} strokeWidth={1.75} />
                    <span className="hidden sm:inline">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Stage Viewport */}
          <div className="relative rounded-2xl overflow-hidden bg-[#0F172A] border border-slate-700/80 shadow-2xl min-h-[500px] md:min-h-[620px] flex flex-col justify-between">
            {/* Background Image with Ambience Filter */}
            <div
              className="absolute inset-0 transition-all duration-700 ease-out"
              style={{ filter: activeAmbience.filter }}
            >
              <img
                src={currentPhoto.url}
                alt={currentPhoto.caption}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40" />
            </div>

            {/* Interactive Hotspot Pins Layer (Only shown when first photo is active) */}
            {activePhotoIdx === 0 && selectedSuite.hotspots && (
              <div className="absolute inset-0 pointer-events-none">
                {selectedSuite.hotspots.map((h) => {
                  const isPinActive = activePinId === h.id;
                  return (
                    <div
                      key={h.id}
                      style={{ left: `${h.x}%`, top: `${h.y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-20"
                    >
                      <button
                        type="button"
                        onClick={() => setActivePinId(isPinActive ? null : h.id)}
                        className={`h-8 w-8 rounded-full flex items-center justify-center transition-all shadow-xl cursor-pointer ${
                          isPinActive
                            ? 'bg-[#B48A3E] text-white scale-110 ring-4 ring-[#B48A3E]/40'
                            : 'bg-[#0F172A]/90 text-[#DFBF77] border border-[#B48A3E]/50 hover:scale-110 hover:bg-[#B48A3E] hover:text-white'
                        }`}
                        aria-label={h.title}
                      >
                        {isPinActive ? <X size={15} strokeWidth={1.75} /> : <Plus size={16} strokeWidth={1.75} />}
                      </button>

                      {/* Popover Card */}
                      <AnimatePresence>
                        {isPinActive && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.95 }}
                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-3.5 rounded-xl bg-[#0F172A]/95 text-alabaster border border-[#B48A3E]/40 shadow-2xl backdrop-blur-xl z-30 pointer-events-auto"
                          >
                            <span className="text-[10px] uppercase tracking-wider text-[#DFBF77] font-semibold block mb-1">
                              {h.tag || 'In-Suite Feature'}
                            </span>
                            <h5 className="text-xs font-bold text-white">{h.title}</h5>
                            <p className="text-xs text-slate-300 mt-1 leading-snug">
                              {h.description || h.desc}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Top Stage Header */}
            <div className="relative z-10 p-6 md:p-8 flex items-start justify-between">
              <div className="bg-[#0F172A]/85 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#DFBF77]">
                  {selectedSuite.name}
                </span>
                <p className="text-xs italic text-slate-300 mt-0.5">
                  "{selectedSuite.officialTagline}"
                </p>
              </div>

              <div className="text-right bg-[#0F172A]/85 backdrop-blur-md px-4 py-2.5 rounded-xl border border-[#B48A3E]/30">
                <span className="text-xs uppercase tracking-wider text-slate-400 block">
                  Uniform Suite Rate
                </span>
                <span className="text-base font-bold text-[#DFBF77]">
                  PKR 18,000 / Night
                </span>
              </div>
            </div>

            {/* Bottom Controls & Photo Selector */}
            <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-lg bg-[#0F172A]/85 backdrop-blur-md p-4 rounded-xl border border-white/10">
                <div className="text-xs text-[#DFBF77] uppercase tracking-wider font-semibold">
                  {currentPhoto.caption}
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  {activeAmbience.desc} Click any <strong className="text-[#DFBF77]">+</strong> pin to reveal in-suite features.
                </p>
              </div>

              {/* Photo Thumbnails Switcher */}
              <div className="flex items-center gap-2 bg-[#0F172A]/85 backdrop-blur-md p-2 rounded-xl border border-white/10 overflow-x-auto">
                {selectedSuite.photos.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      luxuryAudio.playChime(640, 0.05);
                      setActivePhotoIdx(idx);
                    }}
                    className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                      idx === activePhotoIdx
                        ? 'border-[#B48A3E] scale-105 shadow-md'
                        : 'border-white/20 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={p.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Reserve CTA Bar */}
          <div className="mt-8 bg-white p-6 md:p-8 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-semibold leading-snug text-[#0F172A]">
                Ready to Experience {selectedSuite.name}?
              </h3>
              <p className="text-base font-normal leading-relaxed text-slate-600 mt-1">
                Includes tufted king bed, private bath, in-room kettle with Tapal Green Tea, branded toiletries, and mountain terrace access.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/collections"
                className="border border-slate-300 bg-white text-slate-900 hover:border-[#B48A3E] px-6 py-3 rounded-full text-sm font-semibold transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                Compare Suites
              </Link>

              <button
                onClick={() => setModalOpen(true)}
                className="px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-sm transition-all shadow-sm hover:shadow-md inline-flex items-center gap-2 cursor-pointer"
              >
                <MessageCircle size={16} strokeWidth={1.75} className="fill-white" />
                <span>Reserve via WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Booking Modal */}
      <WhatsAppBookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialRoom={selectedSuite}
      />
    </PageTransition>
  );
}
