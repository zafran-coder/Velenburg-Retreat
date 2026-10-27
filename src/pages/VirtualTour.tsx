import { useState } from 'react';
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
  Star,
} from 'lucide-react';
import PageTransition, { Reveal, Stagger, StaggerItem } from '../components/Transitions';
import TiltCard from '../components/Interactive3DCard';
import { AuroraBackground, SectionHead, Marquee } from '../components/ui';
import { luxuryAudio } from '../utils/audio';

const EASE = [0.16, 1, 0.3, 1] as const;

type Mode = 'golden' | 'daylight' | 'midnight';

interface Room {
  id: string;
  name: string;
  place: string;
  stars: string;
  area: string;
  scenes: Record<Mode, string>;
  features: string[];
  pieces: { name: string; tag: string; price: string }[];
}

const rooms: Room[] = [
  {
    id: 'royal-atrium',
    name: 'The Royal Atrium',
    place: 'Dubai',
    stars: '7★',
    area: '620 m²',
    scenes: {
      golden: 'https://images.pexels.com/photos/29000086/pexels-photo-29000086.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920',
      daylight: 'https://images.pexels.com/photos/14036253/pexels-photo-14036253.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920',
      midnight: 'https://images.pexels.com/photos/12387992/pexels-photo-12387992.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920',
    },
    features: [
      'Double-height backlit onyx wall',
      'Sculpted floral monoliths',
      'Acoustic wool ceiling baffles',
    ],
    pieces: [
      { name: 'Solstice Curve Sectional', tag: 'Living', price: '$8,400' },
      { name: 'Cyan Halo Chandelier', tag: 'Lighting', price: '$4,500' },
      { name: 'Basalt Monolith Table', tag: 'Stone', price: '$3,600' },
    ],
  },
  {
    id: 'lagoon-villa',
    name: 'Lagoon Crystal Villa',
    place: 'Maldives',
    stars: '7★',
    area: '410 m²',
    scenes: {
      golden: 'https://images.pexels.com/photos/24807133/pexels-photo-24807133.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920',
      daylight: 'https://images.pexels.com/photos/9845436/pexels-photo-9845436.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920',
      midnight: 'https://images.pexels.com/photos/6585757/pexels-photo-6585757.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920',
    },
    features: ['Glass floor panels', 'Teal infinity edge', 'Teak & linen tactile palette'],
    pieces: [
      { name: 'Crystal Sanctuary Bed', tag: 'Sleep', price: '$6,800' },
      { name: 'Abyss Swivel Chair', tag: 'Lounge', price: '$3,850' },
      { name: 'Strata Linear Sconce', tag: 'Lighting', price: '$3,200' },
    ],
  },
  {
    id: 'clifftop-estate',
    name: 'Clifftop Infinity Estate',
    place: 'Bali',
    stars: '7★',
    area: '540 m²',
    scenes: {
      golden: 'https://images.pexels.com/photos/34790496/pexels-photo-34790496.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920',
      daylight: 'https://images.pexels.com/photos/35113998/pexels-photo-35113998.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920',
      midnight: 'https://images.pexels.com/photos/26729563/pexels-photo-26729563.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920',
    },
    features: ['Cantilevered pool terraces', 'Volcanic basalt flooring', 'Open-air pavilion lounges'],
    pieces: [
      { name: 'Kanso Dining Chair', tag: 'Dining', price: '$1,650' },
      { name: 'Lumina Fluted Credenza', tag: 'Living', price: '$6,200' },
      { name: 'Cyan Halo Chandelier', tag: 'Lighting', price: '$4,500' },
    ],
  },
];

const modes: { id: Mode; label: string; icon: typeof Sun; tint: string }[] = [
  { id: 'golden', label: 'Golden Hour', icon: Sun, tint: 'bg-amber-500' },
  { id: 'daylight', label: 'Daylight', icon: Sparkles, tint: 'bg-cyan-glow' },
  { id: 'midnight', label: 'Midnight', icon: Moon, tint: 'bg-cyan-deep' },
];

export default function VirtualTour() {
  const [room, setRoom] = useState(0);
  const [mode, setMode] = useState<Mode>('golden');
  const [showInfo, setShowInfo] = useState(true);

  const current = rooms[room];

  return (
    <PageTransition>
      <section className="relative pt-32 pb-8 overflow-hidden">
        <AuroraBackground />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
          <SectionHead
            eyebrow="The Online Showroom"
            title="Three Interiors, Staged and Ready to View"
            highlight={['Staged']}
            description="Explore completed projects in the browser. Adjust the lighting from morning to evening, read the specification, and enquire about any piece on display."
          />
        </div>
      </section>

      {/* STAGE */}
      <section className="px-4 sm:px-8 pb-14">
        <div className="max-w-7xl mx-auto">
          <Reveal direction="scale">
            <div className="relative rounded-[28px] overflow-hidden shadow-lux border border-cyan-core/20 bg-abyss min-h-[560px] md:min-h-[660px] flex flex-col justify-between p-5 sm:p-7">
              {/* scene crossfade */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${current.id}-${mode}`}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.99 }}
                  transition={{ duration: 0.9, ease: EASE }}
                  className="absolute inset-0"
                >
                  <img src={current.scenes[mode]} alt={current.name} className="w-full h-full object-cover" />
                  <div
                    className={`absolute inset-0 transition-colors duration-700 ${
                      mode === 'golden'
                        ? 'bg-amber-900/20'
                        : mode === 'daylight'
                        ? 'bg-cyan-900/10'
                        : 'bg-abyss/55'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/25 to-abyss/45" />
                </motion.div>
              </AnimatePresence>

              {/* TOP HUD */}
              <div className="relative z-20 flex flex-wrap items-start justify-between gap-3">
                <div className="glass-dark rounded-full pl-3 pr-4 py-2 flex items-center gap-3 text-white">
                  <span className="h-2.5 w-2.5 rounded-full bg-teal-glow animate-pulse" />
                  <div className="leading-tight">
                    <span className="block text-[13px] font-medium tracking-tight">{current.name}</span>
                    <span className="block text-[10px] text-crystal/60">
                      {current.place} · {current.stars} · {current.area}
                    </span>
                  </div>
                </div>

                <div className="glass-dark rounded-full p-1.5 flex items-center gap-1">
                  {modes.map((m) => {
                    const Icon = m.icon;
                    const isActive = mode === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => {
                          luxuryAudio.playChime(720, 0.07);
                          setMode(m.id);
                        }}
                        className={`relative px-3 py-1.5 rounded-full text-[10px] type-eyebrow flex items-center gap-1.5 transition-colors ${
                          isActive ? 'text-ink' : 'text-crystal/70 hover:text-white'
                        }`}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="modePill"
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                            className={`absolute inset-0 rounded-full ${m.tint}`}
                          />
                        )}
                        <Icon size={12} className="relative" />
                        <span className="relative hidden sm:inline">{m.label}</span>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setShowInfo((s) => !s)}
                  className={`h-10 w-10 grid place-items-center rounded-full border transition-all ${
                    showInfo
                      ? 'bg-white text-ink border-white'
                      : 'glass-dark text-white border-white/20 hover:bg-white/15'
                  }`}
                  aria-label="Toggle details"
                >
                  <Info size={15} />
                </button>
              </div>

              {/* INFO DRAWER */}
              <AnimatePresence>
                {showInfo && (
                  <motion.div
                    initial={{ opacity: 0, x: 26 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 26 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="relative z-20 self-end w-full sm:w-[330px] glass-dark rounded-[22px] p-6 text-white my-auto shadow-2xl"
                  >
                    <span className="type-eyebrow text-cyan-glow text-[9.5px]">Project Notes</span>
                    <h4 className="type-title text-[18px] mt-2.5">{current.name}</h4>
                    <div className="mt-4 space-y-2">
                      {current.features.map((f) => (
                        <div key={f} className="flex items-start gap-2 text-[12px] text-crystal/80">
                          <CheckCircle size={13} className="text-teal-glow mt-0.5 shrink-0" />
                          {f}
                        </div>
                      ))}
                    </div>
                    <Link
                      to="/contact"
                      className="mt-5 block text-center py-2.5 rounded-full bg-white text-ink text-[10px] type-eyebrow hover:bg-cyan-glow transition-colors"
                    >
                      Enquire About This Project
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* BOTTOM HUD */}
              <div className="relative z-20 space-y-4">
                <div className="glass-dark rounded-[20px] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white">
                  <span className="inline-flex items-center gap-2 text-[9.5px] type-eyebrow text-crystal/70">
                    <Layers size={14} className="text-cyan-glow" /> Specified in this room
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {current.pieces.map((p) => (
                      <Link
                        key={p.name}
                        to="/collections"
                        className="group inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white px-3 py-1.5 text-[11px] transition-colors"
                      >
                        <span>{p.name}</span>
                        <span className="text-[10px] text-cyan-glow group-hover:text-ink">{p.price}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2">
                  {rooms.map((r, i) => {
                    const isActive = i === room;
                    return (
                      <button
                        key={r.id}
                        onClick={() => {
                          luxuryAudio.playChime(600, 0.09);
                          setRoom(i);
                        }}
                        className={`px-5 py-2 rounded-full text-[10px] type-eyebrow border transition-all ${
                          isActive
                            ? 'bg-white text-ink border-white shadow-lg'
                            : 'glass-dark text-crystal/75 border-white/15 hover:bg-white/15'
                        }`}
                      >
                        {r.place}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Marquee
        items={[
          'COMPLETED PROJECTS',
          'ADJUSTABLE LIGHTING CONDITIONS',
          'VERIFIED DIMENSIONS',
          'FULL SPECIFICATION AVAILABLE',
          'APPOINTMENTS IN FOUR CITIES',
        ]}
      />

      {/* HOW IT WORKS */}
      <section className="px-5 sm:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <SectionHead
            eyebrow="Using the Showroom"
            title="Three Steps to a Confident Decision"
            highlight={['Confident']}
            description="The showroom is designed to answer the questions a photograph cannot."
          />
          <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: Move3d,
                t: 'Study the Room',
                d: 'Move through each interior to understand sightlines, circulation and the true proportion of every piece.',
              },
              {
                icon: Sun,
                t: 'Test the Lighting',
                d: 'Compare morning, midday and evening conditions to see exactly how each finish reads at every hour.',
              },
              {
                icon: Star,
                t: 'Confirm the Finish',
                d: 'Send your selection to the studio and receive physical samples in the post within 48 hours.',
              },
            ].map((s, i) => (
              <StaggerItem key={s.t}>
                <TiltCard depth={8}>
                  <div className="glass rounded-[22px] p-7 h-full">
                    <span className="grid place-items-center h-11 w-11 rounded-2xl bg-gradient-to-br from-teal-core to-cyan-glow text-white mb-5">
                      <s.icon size={18} />
                    </span>
                    <span className="type-eyebrow text-cyan-deep text-[10px]">Step 0{i + 1}</span>
                    <h4 className="type-title text-lg mt-2 text-ink">{s.t}</h4>
                    <p className="type-body text-[12.5px] text-slate-cool/75 mt-2">{s.d}</p>
                  </div>
                </TiltCard>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 sm:px-8 pb-10">
        <div className="max-w-6xl mx-auto">
          <Reveal direction="scale">
            <div className="relative overflow-hidden rounded-[28px] glass-strong p-8 sm:p-12">
              <div className="absolute -bottom-24 -left-16 w-96 h-96 rounded-full bg-teal-glow/25 blur-[110px] animate-aurora" />
              <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <span className="inline-flex items-center gap-2 text-[9.5px] type-eyebrow text-teal-deep">
                    <Compass size={13} className="text-cyan-core" /> Visit in Person
                  </span>
                  <div className="rule-accent w-14 mt-3" />
                  <h3 className="type-display text-[26px] sm:text-[34px] mt-4 text-ink max-w-lg">
                    Some Decisions Deserve a Room, Not a Screen.
                  </h3>
                  <p className="type-lead text-[13px] text-slate-cool/75 mt-3.5 max-w-md">
                    Our four showrooms hold the full stone and textile library, with lighting you can
                    adjust yourself. Appointments are private and last around ninety minutes.
                  </p>
                </div>
                <Link
                  to="/contact"
                  onClick={() => luxuryAudio.playChime(660, 0.1)}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-teal-deep to-cyan-core text-white text-[11px] type-eyebrow shadow-lux hover:brightness-110 transition-all shrink-0 group"
                >
                  Book an Appointment
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </PageTransition>
  );
}
