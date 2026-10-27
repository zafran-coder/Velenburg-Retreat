import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Layers, Check, ArrowRight, Palette, Sliders, ShieldCheck, Boxes, Star } from 'lucide-react';
import PageTransition, { Reveal, Stagger, StaggerItem, ImageMask, InViewLine } from '../components/Transitions';
import TiltCard from '../components/Interactive3DCard';
import { AuroraBackground, SectionHead, CountUp, MagneticButton } from '../components/ui';
import { luxuryAudio } from '../utils/audio';

const EASE = [0.16, 1, 0.3, 1] as const;

const stones = [
  { id: 'onyx', name: 'Crystal Onyx', origin: 'Iran', hex: '#A5F0F6' },
  { id: 'verde', name: 'Teal Verde Alpi', origin: 'Valle d’Aosta', hex: '#0F766E' },
  { id: 'basalt', name: 'Midnight Basalt', origin: 'Iceland', hex: '#0C1F1E' },
  { id: 'cyan-marble', name: 'Cyan Abyss Marble', origin: 'Carrara', hex: '#06B6D4' },
];

const timbers = [
  { id: 'ebonised', name: 'Ebonised Ash', tone: 'Graphite', hex: '#0C1F1E' },
  { id: 'teak', name: 'Burma Teak', tone: 'Deep Amber', hex: '#0E5C74' },
  { id: 'oak', name: 'Smoked Oak', tone: 'Slate Brown', hex: '#14312F' },
  { id: 'hinoki', name: 'Hinoki Cypress', tone: 'Pale Frost', hex: '#DDF6F7' },
];

const textiles = [
  { id: 'boucle', name: 'Glacier Bouclé', feel: 'Airy loft', hex: '#F4FEFE' },
  { id: 'teal-velvet', name: 'Teal Velvet', feel: 'Deep sheen', hex: '#0F766E' },
  { id: 'cyan-wool', name: 'Cyan Wool Weave', feel: 'Cool hand', hex: '#22D3EE' },
  { id: 'abyss-leather', name: 'Abyss Leather', feel: 'Firm patina', hex: '#0B3B38' },
];

const typologies = [
  { id: 'hotel', label: 'Hotel or Resort' },
  { id: 'penthouse', label: 'Private Residence' },
  { id: 'yacht', label: 'Yacht Interior' },
  { id: 'villa', label: 'Villa or Estate' },
];

const categories = [
  { id: 'lobby', label: 'Lobby or Lounge Seating' },
  { id: 'suite', label: 'Guest Suite Furniture' },
  { id: 'dining', label: 'Dining Table & Chairs' },
  { id: 'lighting', label: 'Feature Light Fitting' },
];

export default function Bespoke() {
  const [typology, setTypology] = useState('hotel');
  const [category, setCategory] = useState('lobby');
  const [stone, setStone] = useState(stones[0].id);
  const [timber, setTimber] = useState(timbers[0].id);
  const [textile, setTextile] = useState(textiles[0].id);
  const [sent, setSent] = useState(false);

  const pick = (setter: (v: string) => void, v: string) => {
    luxuryAudio.playChime(640, 0.07);
    setter(v);
  };

  const stoneObj = stones.find((s) => s.id === stone)!;
  const timberObj = timbers.find((t) => t.id === timber)!;
  const textileObj = textiles.find((t) => t.id === textile)!;

  return (
    <PageTransition>
      {/* HEADER */}
      <section className="relative pt-32 pb-8 overflow-hidden">
        <AuroraBackground />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
          <SectionHead
            eyebrow="Bespoke Commissions"
            title="Made to Your Drawings, Quoted Before We Begin"
            highlight={['Drawings,']}
            description="Custom dimensions, rare stone and made-to-measure joinery, produced by the same ateliers that deliver our hospitality work. Every commission is priced in writing before fabrication starts."
          />
        </div>
      </section>

      {/* FEATURE SPLIT */}
      <section className="px-5 sm:px-8 py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-6">
            <Reveal direction="right">
              <span className="type-eyebrow text-[9.5px] text-teal-deep">A Single Point of Responsibility</span>
              <div className="rule-accent w-14 mt-3 mb-4" />
              <h3 className="type-display text-[26px] sm:text-[33px] text-ink">
                From Quarry to Installation,{' '}
                <span className="text-gradient">One Accountable Team.</span>
              </h3>
              <p className="type-lead text-[13.5px] text-slate-cool/80 mt-4 measure">
                We hold no warehouse stock. Each commission begins with a stone selection at the
                quarry, timber chosen from a managed reserve, and textiles dyed in our own mill —
                then passes through a single project manager from first drawing to final handover.
              </p>
            </Reveal>

            <Stagger className="grid grid-cols-2 gap-4">
              {[
                { v: 8, suffix: ' Weeks', l: 'Typical Lead Time' },
                { v: 42, suffix: '', l: 'Hospitality Projects' },
              ].map((s) => (
                <StaggerItem key={s.l}>
                  <TiltCard depth={7}>
                    <div className="glass rounded-[20px] p-5">
                      <CountUp to={s.v} suffix={s.suffix} className="block type-num text-[1.8rem] text-gradient" />
                      <span className="text-[11.5px] text-slate-cool/70 block mt-1.5">{s.l}</span>
                    </div>
                  </TiltCard>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <div className="lg:col-span-7">
            <Reveal direction="left">
              <TiltCard depth={9}>
                <div className="relative h-[420px] rounded-[26px] overflow-hidden shadow-lux">
                  <ImageMask
                    src="https://images.pexels.com/photos/7722156/pexels-photo-7722156.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1400"
                    alt="Bespoke onyx interior"
                    className="w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-abyss/85 via-transparent to-transparent" />
                  <div className="absolute bottom-5 inset-x-5 glass-dark rounded-2xl p-4 text-white">
                    <span className="type-eyebrow text-cyan-glow text-[9.5px]">
                      Case Study · Private Villa, Bali
                    </span>
                    <p className="type-body text-[12.5px] text-crystal/75 mt-1.5">
                      A nine-tonne onyx block cut into a cantilevered bath and a backlit vanity wall,
                      delivered and installed in eleven weeks.
                    </p>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          </div>
        </div>
      </section>

      <InViewLine className="max-w-6xl mx-auto my-6" />

      {/* CONFIGURATOR */}
      <section className="px-5 sm:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <SectionHead
            eyebrow="Specification Tool"
            title="Outline Your Requirement in a Minute"
            highlight={['Requirement']}
            description="Select the project type, the piece and the materials you have in mind. We reply with a rendered proposal, a physical sample box and a fixed written quotation."
          />

          <Reveal direction="scale">
            <div className="relative overflow-hidden rounded-[28px] glass-strong shadow-lux p-6 sm:p-10">
              <div className="absolute -top-28 -right-24 w-96 h-96 rounded-full bg-cyan-glow/25 blur-[110px] animate-aurora" />

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  luxuryAudio.playChime(780, 0.22);
                  setSent(true);
                }}
                className="relative space-y-11"
              >
                {/* typology + category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { label: '01 · Project type', value: typology, set: setTypology, list: typologies },
                    { label: '02 · Piece required', value: category, set: setCategory, list: categories },
                  ].map((group) => (
                    <div key={group.label}>
                      <span className="type-eyebrow text-teal-deep text-[10px] block mb-3">{group.label}</span>
                      <div className="space-y-2">
                        {group.list.map((o) => {
                          const isActive = group.value === o.id;
                          return (
                            <motion.button
                              key={o.id}
                              type="button"
                              whileTap={{ scale: 0.98 }}
                              onClick={() => pick(group.set, o.id)}
                              className={`w-full text-left px-4 py-3 rounded-2xl border text-[12.5px] font-medium transition-all duration-300 flex items-center justify-between ${
                                isActive
                                  ? 'bg-gradient-to-r from-teal-deep to-cyan-core text-white border-transparent shadow-[0_12px_28px_-14px_rgba(6,182,212,0.9)]'
                                  : 'bg-white/70 text-slate-cool border-cyan-core/15 hover:border-cyan-core/45 hover:bg-white'
                              }`}
                            >
                              {o.label}
                              {isActive && <Check size={14} />}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* material matrix */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: '03 · Stone Selection', icon: Layers, list: stones, value: stone, set: setStone },
                    { label: '04 · Timber Selection', icon: Layers, list: timbers, value: timber, set: setTimber },
                    { label: '05 · Textile Selection', icon: Layers, list: textiles, value: textile, set: setTextile },
                  ].map((group) => (
                    <div key={group.label}>
                      <span className="type-eyebrow text-teal-deep text-[10px] block mb-3">{group.label}</span>
                      <div className="space-y-2">
                        {group.list.map((o) => {
                          const isActive = group.value === o.id;
                          return (
                            <button
                              key={o.id}
                              type="button"
                              onClick={() => pick(group.set, o.id)}
                              className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border transition-all duration-300 ${
                                isActive
                                  ? 'bg-white border-cyan-core/70 shadow-[0_10px_24px_-16px_rgba(6,182,212,0.9)]'
                                  : 'bg-white/60 border-cyan-core/12 hover:bg-white'
                              }`}
                            >
                              <span className="flex items-center gap-2.5 min-w-0">
                                <span
                                  className="h-5 w-5 rounded-lg border border-black/10 shrink-0"
                                  style={{ background: o.hex }}
                                />
                                <span className="text-[12px] font-medium text-ink truncate">{o.name}</span>
                              </span>
                              <span className="text-[9px] type-eyebrow text-slate-cool/55 shrink-0">
                                {'origin' in o ? o.origin : 'tone' in o ? o.tone : o.feel}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* live palette preview */}
                <div>
                  <span className="type-eyebrow text-teal-deep text-[10px] block mb-3">
                    06 · Your Selected Palette
                  </span>
                  <div className="relative overflow-hidden rounded-2xl bg-abyss p-5">
                    <div className="absolute -top-20 right-0 w-72 h-72 rounded-full blur-[90px] animate-aurora" style={{ background: stoneObj.hex, opacity: 0.35 }} />
                    <div className="relative grid grid-cols-3 gap-3">
                      {[stoneObj, timberObj, textileObj].map((m, i) => (
                        <motion.div
                          key={`${m.name}-${i}`}
                          layout
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.45, ease: EASE }}
                          className="rounded-xl border border-white/12 overflow-hidden"
                        >
                          <div className="h-16" style={{ background: `linear-gradient(140deg, ${m.hex}, #06110F)` }} />
                          <div className="p-3">
                            <span className="block text-[11.5px] font-medium text-white truncate">{m.name}</span>
                            <span className="block text-[9px] type-eyebrow text-crystal/50 mt-0.5">
                              {['Stone', 'Timber', 'Textile'][i]}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* contact fields */}
                <div className="pt-6 border-t border-cyan-core/12 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input required placeholder="Client or studio name" className="w-full bg-white rounded-xl border border-cyan-core/15 px-4 py-3 text-[12.5px] text-ink placeholder:text-slate-cool/40 focus:outline-none focus:border-cyan-core/70 transition-colors" />
                  <input required type="email" placeholder="Email address" className="w-full bg-white rounded-xl border border-cyan-core/15 px-4 py-3 text-[12.5px] text-ink placeholder:text-slate-cool/40 focus:outline-none focus:border-cyan-core/70 transition-colors" />
                  <input type="tel" placeholder="Telephone (optional)" className="w-full bg-white rounded-xl border border-cyan-core/15 px-4 py-3 text-[12.5px] text-ink placeholder:text-slate-cool/40 focus:outline-none focus:border-cyan-core/70 transition-colors" />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="flex items-center gap-2 text-[11.5px] text-slate-cool/70">
                    <ShieldCheck size={15} className="text-teal-core shrink-0" />
                    Enquiries handled in confidence. NDAs signed on request.
                  </span>
                  <MagneticButton>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-teal-deep via-cyan-deep to-cyan-core text-white text-[11px] type-eyebrow shadow-lux hover:brightness-110 transition-all group"
                    >
                      <Boxes size={14} />
                      Request Sample Box
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </MagneticButton>
                </div>

                {sent && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="p-5 rounded-2xl bg-teal-core/10 border border-teal-core/25 text-[12.5px] text-slate-cool flex items-start gap-3"
                  >
                    <Check size={16} className="text-teal-core mt-0.5 shrink-0" />
                    <span>
                      Thank you — your outline has been received, specifying{' '}
                      <strong>{stoneObj.name}</strong>, <strong>{timberObj.name}</strong> and{' '}
                      <strong>{textileObj.name}</strong>. A member of the bespoke team will reply
                      within two working hours, and your sample box will be dispatched within 48 hours.
                    </span>
                  </motion.div>
                )}
              </form>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CROSS LINKS */}
      <section className="px-5 sm:px-8 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              to: '/collections',
              icon: Palette,
              k: 'Standard Range',
              t: 'Browse the Collection',
              d: 'Pieces available to specify directly, with published lead times.',
            },
            {
              to: '/virtual-tour',
              icon: Star,
              k: 'Online Showroom',
              t: 'View Completed Work',
              d: 'See how these materials perform across three finished interiors.',
            },
            {
              to: '/contact',
              icon: Sliders,
              k: 'In Person',
              t: 'Book an Appointment',
              d: 'Meet the team in Dubai, Doha, Paris or Bali and handle the samples.',
            },
          ].map((c) => (
            <Reveal key={c.to} direction="up">
              <TiltCard depth={8}>
                <Link
                  to={c.to}
                  onClick={() => luxuryAudio.playChime(620, 0.08)}
                  className="group glass rounded-[22px] p-6 h-full block"
                >
                  <span className="grid place-items-center h-10 w-10 rounded-xl bg-gradient-to-br from-teal-core to-cyan-glow text-white mb-4 group-hover:rotate-12 transition-transform">
                    <c.icon size={16} />
                  </span>
                  <span className="type-eyebrow text-cyan-deep text-[9.5px]">{c.k}</span>
                  <h4 className="type-title text-base mt-1.5 text-ink">{c.t}</h4>
                  <p className="type-body text-[12px] text-slate-cool/70 mt-1.5">{c.d}</p>
                </Link>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>
    </PageTransition>
  );
}
