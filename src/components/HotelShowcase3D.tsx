import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play, ArrowUpRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { luxuryAudio } from '../utils/audio';

const EASE = [0.16, 1, 0.3, 1] as const;

interface Suite {
  id: string;
  hotel: string;
  place: string;
  category: string;
  rating: string;
  image: string;
  detail: string;
  link: string;
}

const suites: Suite[] = [
  {
    id: 'marina-atrium',
    hotel: 'Marina Atrium',
    place: 'Dubai, UAE',
    category: 'Reception Hall',
    rating: '2024',
    image:
      'https://images.pexels.com/photos/29000086/pexels-photo-29000086.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1600',
    detail:
      'A double-height arrival hall furnished with modular lounge seating and a nine-metre planted centrepiece.',
    link: '/virtual-tour',
  },
  {
    id: 'west-bay-foyer',
    hotel: 'West Bay Foyer',
    place: 'Doha, Qatar',
    category: 'Arrival & Stair',
    rating: '2023',
    image:
      'https://images.pexels.com/photos/14011664/pexels-photo-14011664.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1600',
    detail:
      'Book-matched marble stair with a suspended crystal fixture of 4,200 hand-blown elements.',
    link: '/collections?category=lighting',
  },
  {
    id: 'vendome-stair',
    hotel: 'Vendôme Stair Hall',
    place: 'Paris, France',
    category: 'Heritage Restoration',
    rating: '2022',
    image:
      'https://images.pexels.com/photos/3926482/pexels-photo-3926482.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1600',
    detail:
      'A restored nineteenth-century stone flight with new brass inlay and concealed handrail lighting.',
    link: '/bespoke',
  },
  {
    id: 'orchard-reception',
    hotel: 'Orchard Reception',
    place: 'Singapore',
    category: 'Concierge Desk',
    rating: '2025',
    image:
      'https://images.pexels.com/photos/14036253/pexels-photo-14036253.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1600',
    detail:
      'A fluted glass desk island with integrated cable management and a planted sculptural surround.',
    link: '/collections?category=living',
  },
  {
    id: 'sky-corridor',
    hotel: 'Sky Corridor',
    place: 'Abu Dhabi, UAE',
    category: 'Circulation',
    rating: '2024',
    image:
      'https://images.pexels.com/photos/26729563/pexels-photo-26729563.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1600',
    detail:
      'Continuous timber ribbon panelling with cove lighting, guiding guests toward the private lift lobby.',
    link: '/virtual-tour',
  },
  {
    id: 'uluwatu-estate',
    hotel: 'Uluwatu Estate',
    place: 'Bali, Indonesia',
    category: 'Terrace & Pool',
    rating: '2025',
    image:
      'https://images.pexels.com/photos/35113998/pexels-photo-35113998.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1600',
    detail:
      'Weather-rated outdoor seating and basalt paving across three cantilevered pool terraces.',
    link: '/virtual-tour',
  },
  {
    id: 'lagoon-villa',
    hotel: 'Lagoon Villa',
    place: 'Maldives',
    category: 'Guest Suite',
    rating: '2023',
    image:
      'https://images.pexels.com/photos/9845436/pexels-photo-9845436.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1600',
    detail:
      'An over-water suite with marine-grade joinery, glass floor panels and salt-resistant textiles.',
    link: '/collections?category=sleep',
  },
  {
    id: 'brera-salon',
    hotel: 'Brera Salon',
    place: 'Milan, Italy',
    category: 'Lounge',
    rating: '2021',
    image:
      'https://images.pexels.com/photos/14036246/pexels-photo-14036246.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1600',
    detail:
      'A gallery-lit lounge pairing a private art collection with low-profile conversation seating.',
    link: '/about',
  },
];

export default function HotelShowcase3D() {
  const [active, setActive] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const dragX = useRef(0);

  const total = suites.length;

  // Autoplay with progress ring
  useEffect(() => {
    if (!isPlaying) return;
    setProgress(0);
    const start = Date.now();
    const dur = 5200;
    const tick = () => {
      const p = Math.min(1, (Date.now() - start) / dur);
      setProgress(p);
      if (p >= 1) {
        setActive((a) => (a + 1) % total);
      }
    };
    const id = setInterval(tick, 40);
    return () => clearInterval(id);
  }, [isPlaying, active, total]);

  const go = (dir: number) => {
    luxuryAudio.playChime(dir > 0 ? 620 : 540, 0.09);
    setActive((a) => (a + dir + total) % total);
  };

  // Shortest-path offset for smooth coverflow wrapping
  const offsetOf = (index: number) => {
    let diff = index - active;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  return (
    <div className="relative w-full select-none">
      {/* ===== 3D STAGE ===== */}
      <div className="relative h-[440px] sm:h-[520px] md:h-[600px] perspective-2000 flex items-center justify-center">
        {/* floor glow */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[70%] h-40 bg-cyan-glow/20 blur-[90px] rounded-full pointer-events-none" />

        {suites.map((suite, i) => {
          const offset = offsetOf(i);
          const abs = Math.abs(offset);
          const isActive = offset === 0;
          const hidden = abs > 3;

          return (
            <motion.div
              key={suite.id}
              className="absolute preserve-3d"
              initial={false}
              animate={{
                x: `${offset * 46}%`,
                z: -abs * 190,
                rotateY: offset * -26,
                scale: isActive ? 1 : 0.86 - abs * 0.03,
                opacity: hidden ? 0 : 1 - abs * 0.22,
                filter: isActive ? 'brightness(1)' : 'brightness(0.62) saturate(0.85)',
              }}
              transition={{ duration: 0.95, ease: EASE }}
              style={{
                zIndex: 20 - abs,
                pointerEvents: isActive ? 'auto' : 'none',
                transformStyle: 'preserve-3d',
              }}
              drag={isActive ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.16}
              onDragStart={(_, info) => {
                dragX.current = info.point.x;
              }}
              onDragEnd={(_, info) => {
                const delta = info.offset.x;
                if (Math.abs(delta) > 70) go(delta < 0 ? 1 : -1);
              }}
              onClick={() => {
                if (!isActive) {
                  luxuryAudio.playChime(600, 0.08);
                  setActive(i);
                }
              }}
            >
              {/* CARD */}
              <div
                className={`relative w-[78vw] sm:w-[440px] md:w-[560px] aspect-[16/10] rounded-3xl overflow-hidden ${
                  isActive ? 'ring-glow shadow-lux' : 'shadow-2xl'
                } bg-abyss cursor-pointer`}
              >
                {/* image with ken-burns */}
                <motion.img
                  src={suite.image}
                  alt={suite.hotel}
                  loading={abs < 2 ? 'eager' : 'lazy'}
                  animate={{ scale: isActive ? 1.06 : 1.0 }}
                  transition={{ duration: 6, ease: 'linear' }}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* cinematic gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-abyss/90 via-abyss/15 to-abyss/35" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,rgba(34,211,238,0.22),transparent_55%)]" />

                {/* scan line shimmer on active */}
                {isActive && (
                  <motion.div
                    initial={{ y: '-100%' }}
                    animate={{ y: '220%' }}
                    transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.6 }}
                    className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-cyan-glow/12 to-transparent pointer-events-none"
                  />
                )}

                {/* TOP META */}
                <div className="absolute top-0 inset-x-0 p-4 sm:p-5 flex items-start justify-between">
                  <span className="glass-dark px-3 py-1.5 rounded-full text-[10px] type-eyebrow text-cyan-glow">
                    {suite.category}
                  </span>
                  <span className="glass-dark px-3 py-1.5 rounded-full text-[10px] type-label text-white flex items-center gap-1.5">
                    <Star size={10} className="text-cyan-glow fill-cyan-glow" />
                    {suite.place} · {suite.rating}
                  </span>
                </div>

                {/* BOTTOM INFO */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 22 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 14 }}
                      transition={{ duration: 0.6, ease: EASE, delay: 0.12 }}
                      className="absolute bottom-0 inset-x-0 p-5 sm:p-7 text-white"
                    >
                      <h3 className="type-title text-xl sm:text-2xl md:text-[28px] text-white">{suite.hotel}</h3>
                      <p className="type-body text-[12px] sm:text-[12.5px] text-crystal/75 mt-2 max-w-md">
                        {suite.detail}
                      </p>
                      <Link
                        to={suite.link}
                        onClick={() => luxuryAudio.playChime(680, 0.1)}
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-ink hover:bg-cyan-glow transition-colors text-[10px] type-eyebrow group"
                      >
                        View Project
                        <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* REFLECTION */}
              <div className="relative mt-2 h-24 overflow-hidden opacity-25 hidden sm:block" aria-hidden>
                <img
                  src={suite.image}
                  alt=""
                  className="w-full h-[420px] object-cover scale-y-[-1] blur-[1px] rounded-3xl"
                  style={{ maskImage: 'linear-gradient(to top, transparent 10%, black 85%)', WebkitMaskImage: 'linear-gradient(to top, transparent 10%, black 85%)' }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ===== CONTROL DOCK ===== */}
      <div className="mt-2 flex flex-col items-center gap-5">
        {/* arrows + play */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => go(-1)}
            aria-label="Previous suite"
            className="glass h-11 w-11 rounded-full flex items-center justify-center text-teal-deep hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-sm"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            onClick={() => {
              luxuryAudio.playChime(500, 0.1);
              setIsPlaying((p) => !p);
            }}
            aria-label="Toggle autoplay"
            className="relative h-11 w-11 rounded-full flex items-center justify-center bg-ink text-cyan-glow hover:bg-teal-deep hover:text-white transition-colors shadow-lg"
          >
            {isPlaying ? <Pause size={15} /> : <Play size={15} />}
            {/* autoplay progress ring */}
            {isPlaying && (
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 44 44">
                <circle
                  cx="22"
                  cy="22"
                  r="21"
                  fill="none"
                  stroke="rgba(34,211,238,0.9)"
                  strokeWidth="2"
                  strokeDasharray={2 * Math.PI * 21}
                  strokeDashoffset={2 * Math.PI * 21 * (1 - progress)}
                />
              </svg>
            )}
          </button>

          <button
            onClick={() => go(1)}
            aria-label="Next suite"
            className="glass h-11 w-11 rounded-full flex items-center justify-center text-teal-deep hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-sm"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* dot indicators */}
        <div className="flex items-center gap-2 flex-wrap justify-center px-6">
          {suites.map((s, i) => {
            const isActive = i === active;
            return (
              <button
                key={s.id}
                onClick={() => {
                  luxuryAudio.playChime(580, 0.07);
                  setActive(i);
                }}
                aria-label={s.hotel}
                className="group relative py-2"
              >
                <span
                  className={`block rounded-full transition-all duration-500 ${
                    isActive
                      ? 'w-9 h-1.5 bg-gradient-to-r from-teal-core to-cyan-glow'
                      : 'w-1.5 h-1.5 bg-teal-deep/30 group-hover:bg-teal-core/70'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
