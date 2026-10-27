import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, ArrowRight, X, Shield, Ruler, Check, Boxes, Sparkles } from 'lucide-react';
import PageTransition, { Reveal } from '../components/Transitions';
import TiltCard from '../components/Interactive3DCard';
import { AuroraBackground, SectionHead, Marquee } from '../components/ui';
import { luxuryAudio } from '../utils/audio';

const EASE = [0.16, 1, 0.3, 1] as const;

interface Item {
  id: string;
  name: string;
  category: 'living' | 'dining' | 'sleep' | 'lighting';
  price: string;
  desc: string;
  dims: string;
  finishes: { name: string; hex: string; img: string }[];
  specs: string[];
}

const items: Item[] = [
  {
    id: 'solstice',
    name: 'Solstice Curve Sectional',
    category: 'living',
    price: '$8,400',
    desc: 'A sweeping organic silhouette engineered for seven-star lobby lounges and private penthouses.',
    dims: 'W 280 × D 110 × H 72 cm',
    finishes: [
      { name: 'Glacier Bouclé', hex: '#F4FEFE', img: 'https://images.pexels.com/photos/7174113/pexels-photo-7174113.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=900' },
      { name: 'Teal Velvet', hex: '#0F766E', img: 'https://images.pexels.com/photos/7195580/pexels-photo-7195580.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=900' },
      { name: 'Cyan Weave', hex: '#06B6D4', img: 'https://images.pexels.com/photos/6312356/pexels-photo-6312356.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=900' },
    ],
    specs: ['FSC-certified solid beech core', 'High-resilience organic latex', 'Removable tailored upholstery'],
  },
  {
    id: 'monolith',
    name: 'Basalt Monolith Table',
    category: 'dining',
    price: '$9,200',
    desc: 'Diamond-wire cut from a single volcanic block, honed to a silk matte finish that resists etching.',
    dims: 'L 260 × W 105 × H 75 cm',
    finishes: [
      { name: 'Midnight Basalt', hex: '#0C1F1E', img: 'https://images.pexels.com/photos/14598479/pexels-photo-14598479.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=900' },
      { name: 'Crystal Onyx', hex: '#A5F0F6', img: 'https://images.pexels.com/photos/4705853/pexels-photo-4705853.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=900' },
    ],
    specs: ['Single monolithic block', 'Nano-ceramic honed sealant', 'Seats 8–10 guests'],
  },
  {
    id: 'sanctuary',
    name: 'Crystal Sanctuary Bed',
    category: 'sleep',
    price: '$6,800',
    desc: 'Cantilevered platform floating above a recessed base, with a backlit onyx headboard panel.',
    dims: 'King · W 220 × L 235 × H 95 cm',
    finishes: [
      { name: 'Frost Linen', hex: '#E8FBFC', img: 'https://images.pexels.com/photos/6585757/pexels-photo-6585757.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=900' },
      { name: 'Deep Teal Suede', hex: '#0B3B38', img: 'https://images.pexels.com/photos/7535062/pexels-photo-7535062.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=900' },
    ],
    specs: ['Backlit onyx headboard', 'Concealed wireless charging', 'Orthopaedic slatted base'],
  },
  {
    id: 'halo',
    name: 'Cyan Halo Chandelier',
    category: 'lighting',
    price: '$4,500',
    desc: 'Orbiting rings of hand-blown fluted crystal suspended from a cyan-anodised titanium frame.',
    dims: 'Ø 110 cm × drop 140 cm',
    finishes: [
      { name: 'Murano Crystal', hex: '#A5F0F6', img: 'https://images.pexels.com/photos/14011664/pexels-photo-14011664.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=900' },
      { name: 'Smoked Glass', hex: '#0E5C74', img: 'https://images.pexels.com/photos/35326200/pexels-photo-35326200.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=900' },
    ],
    specs: ['2700K dimmable · CRI 98+', 'Hand-blown Venetian glass', 'Custom drop rods'],
  },
  {
    id: 'abyss',
    name: 'Abyss Swivel Chair',
    category: 'living',
    price: '$3,850',
    desc: 'An enveloping cocoon with a concealed 360° silent bearing — built for long, quiet conversations.',
    dims: 'W 92 × D 90 × H 78 cm',
    finishes: [
      { name: 'Deep Teal Velvet', hex: '#0F766E', img: 'https://images.pexels.com/photos/6312356/pexels-photo-6312356.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=900' },
      { name: 'Frost Bouclé', hex: '#F4FEFE', img: 'https://images.pexels.com/photos/7195580/pexels-photo-7195580.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=900' },
      { name: 'Cyan Wool', hex: '#22D3EE', img: 'https://images.pexels.com/photos/20285351/pexels-photo-20285351.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=900' },
    ],
    specs: ['Silent ball-bearing swivel', 'Full-grain Italian hide', 'Cast solid base ring'],
  },
  {
    id: 'kanso',
    name: 'Kanso Dining Chair',
    category: 'dining',
    price: '$1,650',
    desc: 'Kyoto joinery inspiration: nail-free, feather-light and engineered to last a century.',
    dims: 'W 56 × D 54 × H 76 cm',
    finishes: [
      { name: 'Ebonised Ash', hex: '#0C1F1E', img: 'https://images.pexels.com/photos/6297086/pexels-photo-6297086.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=900' },
      { name: 'Pale Oak', hex: '#DDF6F7', img: 'https://images.pexels.com/photos/7166550/pexels-photo-7166550.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=900' },
    ],
    specs: ['Mortise & tenon joinery', 'Stain-resistant finish', 'Stackable up to 4'],
  },
  {
    id: 'lumina',
    name: 'Lumina Fluted Credenza',
    category: 'living',
    price: '$6,200',
    desc: 'Fluted doors concealing velvet-lined drawers, cable raceways and an onyx inset top.',
    dims: 'W 210 × D 48 × H 68 cm',
    finishes: [
      { name: 'Onyx & Ash', hex: '#A5F0F6', img: 'https://images.pexels.com/photos/7535062/pexels-photo-7535062.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=900' },
      { name: 'Smoked Walnut', hex: '#14312F', img: 'https://images.pexels.com/photos/6758786/pexels-photo-6758786.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=900' },
    ],
    specs: ['Soft-damp push-to-open', 'Honed onyx inset', 'Acoustic slat panel'],
  },
  {
    id: 'strata',
    name: 'Strata Linear Sconce',
    category: 'lighting',
    price: '$3,200',
    desc: 'Precision-milled profile with an alabaster diffuser casting a soft vertical cyan glow.',
    dims: 'L 160 × W 8 × H 12 cm',
    finishes: [
      { name: 'Alabaster', hex: '#E8FBFC', img: 'https://images.pexels.com/photos/28656087/pexels-photo-28656087.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=900' },
      { name: 'Titanium', hex: '#0E5C74', img: 'https://images.pexels.com/photos/19587867/pexels-photo-19587867.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=900' },
    ],
    specs: ['Dual direct/indirect beam', 'Wireless dimming control', '99% stone translucency'],
  },
];

const filters = [
  { id: 'all', label: 'All Pieces' },
  { id: 'living', label: 'Living' },
  { id: 'dining', label: 'Dining' },
  { id: 'sleep', label: 'Bedroom' },
  { id: 'lighting', label: 'Lighting' },
];

export default function Collections() {
  const [params, setParams] = useSearchParams();
  const [cat, setCat] = useState(params.get('category') || 'all');
  const [inspect, setInspect] = useState<Item | null>(null);
  const [finishIdx, setFinishIdx] = useState<Record<string, number>>({});

  const list = useMemo(() => (cat === 'all' ? items : items.filter((i) => i.category === cat)), [cat]);

  const pick = (id: string) => {
    luxuryAudio.playChime(580, 0.09);
    setCat(id);
    setParams(id === 'all' ? {} : { category: id });
  };

  return (
    <PageTransition>
      {/* HEADER */}
      <section className="relative pt-32 pb-6 overflow-hidden">
        <AuroraBackground />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
          <SectionHead
            eyebrow="The 2026 Collection"
            title="Built to Hospitality Standard"
            highlight={['Hospitality']}
            description="Each piece is engineered for the wear of a working hotel, then finished with the detail expected in a private home. Select any item for dimensions, materials and pricing."
          />
        </div>
      </section>

      {/* FILTER DOCK */}
      <div className="sticky top-[76px] z-30 px-5 sm:px-8 mb-10">
        <Reveal direction="scale" className="max-w-2xl mx-auto">
          <div className="glass-strong rounded-full p-2 shadow-lux flex items-center justify-center gap-1 flex-wrap">
            {filters.map((f) => {
              const isActive = cat === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => pick(f.id)}
                  className={`relative px-4 py-2 rounded-full text-[10px] type-eyebrow transition-colors duration-300 ${
                    isActive ? 'text-white' : 'text-slate-cool/75 hover:text-teal-deep'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="filterPill"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-deep via-cyan-deep to-cyan-core shadow-[0_10px_22px_-10px_rgba(6,182,212,0.9)]"
                    />
                  )}
                  <span className="relative">{f.label}</span>
                </button>
              );
            })}
          </div>
        </Reveal>
      </div>

      {/* GRID */}
      <section className="px-5 sm:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {list.map((item, i) => {
                const fi = finishIdx[item.id] || 0;
                const finish = item.finishes[fi];
                return (
                  <motion.div
                    layout
                    key={item.id}
                    initial={{ opacity: 0, y: 24, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -12, scale: 0.97 }}
                    transition={{ duration: 0.5, ease: EASE, delay: i * 0.05 }}
                  >
                    <TiltCard depth={9}>
                      <div
                        onClick={() => {
                          luxuryAudio.playChime(660, 0.1);
                          setInspect(item);
                        }}
                        className="group cursor-pointer glass rounded-[22px] p-4 h-full flex flex-col"
                      >
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-ice mb-5">
                          <AnimatePresence>
                            <motion.img
                              key={finish.img}
                              src={finish.img}
                              alt={item.name}
                              loading="lazy"
                              initial={{ opacity: 0, scale: 1.06 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.7, ease: EASE }}
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.1s]"
                            />
                          </AnimatePresence>

                          <span className="absolute top-3 left-3 glass-dark px-2.5 py-1 rounded-full text-[9px] type-eyebrow text-cyan-glow capitalize">
                            {item.category}
                          </span>

                          <div className="absolute inset-0 bg-abyss/35 opacity-0 group-hover:opacity-100 transition-opacity duration-500 grid place-items-center">
                            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full glass-dark text-white text-[10px] type-eyebrow">
                              <Eye size={12} /> Inspect
                            </span>
                          </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="type-title text-[17px] text-ink group-hover:text-teal-deep transition-colors">
                              {item.name}
                            </h3>
                            <span className="text-[15px] font-medium tracking-tight text-ink shrink-0">
                              {item.price}
                            </span>
                          </div>
                          <p className="type-body text-[12px] text-slate-cool/70 mt-1.5 line-clamp-2">
                            {item.desc}
                          </p>

                          <div className="mt-4 pt-3 border-t border-cyan-core/12 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {item.finishes.map((f, idx) => (
                                <button
                                  key={f.name}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    luxuryAudio.playChime(700, 0.06);
                                    setFinishIdx((p) => ({ ...p, [item.id]: idx }));
                                  }}
                                  title={f.name}
                                  className={`h-5 w-5 rounded-full border transition-all duration-300 ${
                                    fi === idx
                                      ? 'ring-2 ring-cyan-core ring-offset-2 ring-offset-white scale-110'
                                      : 'border-black/10 hover:scale-110'
                                  }`}
                                  style={{ background: f.hex }}
                                />
                              ))}
                            </div>
                            <span className="inline-flex items-center gap-1 text-[9.5px] type-eyebrow text-teal-deep group-hover:gap-2 transition-all">
                              Details <ArrowRight size={12} />
                            </span>
                          </div>
                        </div>
                      </div>
                    </TiltCard>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <Marquee
        items={[
          'CONTRACT-GRADE CONSTRUCTION',
          'TEN-YEAR STRUCTURAL WARRANTY',
          'INSURED WORLDWIDE FREIGHT',
          'FSC-CERTIFIED TIMBER',
          'FINISH SAMPLES ON REQUEST',
        ]}
      />

      {/* BESPOKE CTA */}
      <section className="px-5 sm:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <Reveal direction="scale">
            <div className="relative overflow-hidden rounded-[28px] bg-abyss p-8 sm:p-12">
              <div className="absolute -top-24 -right-16 w-96 h-96 rounded-full bg-cyan-core/25 blur-[110px] animate-aurora" />
              <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-white">
                  <span className="type-eyebrow text-[9.5px] text-cyan-glow">Bespoke Commissions</span>
                  <div className="rule-accent w-14 mt-3" />
                  <h3 className="type-display text-[26px] sm:text-[34px] mt-4 max-w-lg">
                    Require a Different Scale, Stone or Finish?
                  </h3>
                  <p className="type-lead text-[13px] text-crystal/65 mt-3.5 max-w-md">
                    We produce one-off pieces for hotel operators, interior architects and private
                    clients — quoted at a fixed price before any work begins.
                  </p>
                </div>
                <Link
                  to="/bespoke"
                  onClick={() => luxuryAudio.playChime(620, 0.1)}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-ink text-[11px] type-eyebrow hover:bg-cyan-glow transition-colors shrink-0 group"
                >
                  <Sparkles size={13} className="text-teal-deep" />
                  Discuss a Commission
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* INSPECT MODAL */}
      <AnimatePresence>
        {inspect && (
          <div className="fixed inset-0 z-50 grid place-items-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInspect(null)}
              className="absolute inset-0 bg-abyss/75 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, y: 26, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[26px] bg-abyss text-white border border-cyan-glow/20 shadow-2xl"
            >
              <button
                onClick={() => setInspect(null)}
                className="absolute top-4 right-4 z-20 h-9 w-9 grid place-items-center rounded-full glass-dark text-white hover:bg-white hover:text-ink transition-colors"
              >
                <X size={16} />
              </button>

              <div className="p-5 sm:p-8 space-y-6">
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden">
                  <img
                    src={inspect.finishes[finishIdx[inspect.id] || 0].img}
                    alt={inspect.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-abyss/80 to-transparent" />
                  <span className="absolute bottom-4 left-4 glass-dark px-3 py-1.5 rounded-full text-[10px] type-eyebrow text-cyan-glow flex items-center gap-2">
                    <Boxes size={12} /> {inspect.finishes[finishIdx[inspect.id] || 0].name}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-5">
                  <div>
                    <span className="type-eyebrow text-cyan-glow text-[9.5px] capitalize">
                      {inspect.category} · 2026 Collection
                    </span>
                    <h2 className="type-title text-[26px] sm:text-[32px] mt-2.5">{inspect.name}</h2>
                  </div>
                  <div className="sm:text-right shrink-0">
                    <span className="type-eyebrow text-[8.5px] text-crystal/45 block">
                      Price Before Tax
                    </span>
                    <span className="type-num text-[26px] block mt-1">{inspect.price}</span>
                  </div>
                </div>

                <p className="type-body text-[13px] text-crystal/70">{inspect.desc}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                    <Ruler size={17} className="text-cyan-glow mt-0.5 shrink-0" />
                    <div>
                      <span className="type-eyebrow text-[9px] text-crystal/50 block">Dimensions</span>
                      <span className="text-[12px]">{inspect.dims}</span>
                    </div>
                    {/* dimension block */}
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                    <Shield size={17} className="text-teal-glow mt-0.5 shrink-0" />
                    <div>
                      <span className="type-eyebrow text-[9px] text-crystal/50 block">Warranty</span>
                      <span className="text-[12px]">Ten years, structural and frame</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="type-eyebrow text-[9.5px] text-crystal/50">Construction Detail</span>
                  {inspect.specs.map((s) => (
                    <div key={s} className="flex items-center gap-2.5 text-[12px] text-crystal/85">
                      <Check size={14} className="text-cyan-glow shrink-0" /> {s}
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/contact"
                    onClick={() => setInspect(null)}
                    className="flex-1 text-center py-3.5 rounded-full bg-white text-ink text-[10.5px] type-eyebrow hover:bg-cyan-glow transition-colors"
                  >
                    Request a Viewing
                  </Link>
                  <Link
                    to="/virtual-tour"
                    onClick={() => setInspect(null)}
                    className="text-center py-3.5 px-6 rounded-full bg-white/10 border border-white/15 text-white text-[10.5px] type-eyebrow hover:bg-white/20 transition-colors"
                  >
                    See It In Situ
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
