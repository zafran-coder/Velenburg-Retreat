import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, ArrowUpRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { luxuryAudio } from '../utils/audio';

interface Hotspot {
  id: string;
  x: number;
  y: number;
  title: string;
  category: string;
  material: string;
  price: string;
  link: string;
}

const hotspots: Hotspot[] = [
  {
    id: 'sofa',
    x: 46,
    y: 62,
    title: 'Solstice Curved Sectional',
    category: 'Seating',
    material: 'Wool bouclé upholstery over a solid oak frame',
    price: 'From $8,400',
    link: '/collections?category=living',
  },
  {
    id: 'table',
    x: 65,
    y: 76,
    title: 'Monolith Low Table',
    category: 'Stone',
    material: 'Honed basalt, cut from a single block',
    price: 'From $3,600',
    link: '/collections?category=living',
  },
  {
    id: 'chandelier',
    x: 30,
    y: 20,
    title: 'Halo Pendant Cluster',
    category: 'Lighting',
    material: 'Hand-blown Murano glass on an anodised frame',
    price: 'From $4,200',
    link: '/collections?category=lighting',
  },
  {
    id: 'chair',
    x: 84,
    y: 58,
    title: 'Meridian Swivel Chair',
    category: 'Seating',
    material: 'Mohair velvet with a silent 360° bearing base',
    price: 'From $2,850',
    link: '/collections?category=living',
  },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export default function HotspotScene() {
  const [active, setActive] = useState<Hotspot | null>(hotspots[0]);

  return (
    <div className="relative rounded-[28px] overflow-hidden shadow-lux border border-cyan-core/20 bg-abyss">
      <div className="relative aspect-[16/10] md:aspect-[21/9] min-h-[420px] w-full">
        <motion.img
          initial={{ scale: 1.08 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: EASE }}
          src="https://images.pexels.com/photos/20285351/pexels-photo-20285351.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920"
          alt="7-star living suite"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-abyss/92 via-abyss/10 to-abyss/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.18),transparent_55%)]" />

        {/* header badges */}
        <div className="absolute top-5 inset-x-5 flex items-center justify-between z-20">
          <span className="glass-dark px-3.5 py-1.5 rounded-full text-[9.5px] type-eyebrow text-cyan-glow flex items-center gap-2">
            <Sparkles size={12} /> Composed Suite · Four Pieces
          </span>
          <span className="hidden sm:inline glass-dark px-3 py-1.5 rounded-full text-[10.5px] text-crystal/75">
            Select a Marker for Full Specification
          </span>
        </div>

        {/* markers */}
        {hotspots.map((spot) => {
          const isActive = active?.id === spot.id;
          return (
            <div
              key={spot.id}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
            >
              <motion.button
                onClick={() => {
                  luxuryAudio.playChime(isActive ? 480 : 660, 0.08);
                  setActive(isActive ? null : spot);
                }}
                whileHover={{ scale: 1.18 }}
                whileTap={{ scale: 0.92 }}
                className={`relative h-10 w-10 rounded-full grid place-items-center transition-colors duration-300 ${
                  isActive
                    ? 'bg-cyan-glow text-ink shadow-[0_0_0_6px_rgba(34,211,238,0.25)]'
                    : 'bg-white/90 text-teal-deep'
                }`}
                aria-label={spot.title}
              >
                <span className="absolute -inset-1.5 rounded-full border border-cyan-glow/60 animate-ping opacity-50" />
                {isActive ? <X size={15} /> : <Plus size={15} />}
              </motion.button>
            </div>
          );
        })}

        {/* detail card */}
        <AnimatePresence>
          {active && (
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="absolute bottom-5 inset-x-5 sm:right-auto sm:w-[370px] z-30"
            >
              <div className="glass-dark rounded-[22px] p-6 text-white shadow-2xl">
                <span className="type-eyebrow text-cyan-glow text-[9.5px]">{active.category}</span>
                <h4 className="type-title text-[19px] mt-2.5">{active.title}</h4>
                <p className="type-body text-[12px] text-crystal/70 mt-2">{active.material}</p>
                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="type-eyebrow text-crystal/45 text-[8.5px] block">Indicative Price</span>
                    <span className="type-num text-[17px] mt-1 block">{active.price}</span>
                  </div>
                  <Link
                    to={active.link}
                    onClick={() => luxuryAudio.playChime(700, 0.1)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-ink hover:bg-cyan-glow transition-colors text-[10px] type-eyebrow group"
                  >
                    Full Details
                    <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
