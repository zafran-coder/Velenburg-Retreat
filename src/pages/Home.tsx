import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Boxes, Layers, Play, Star } from 'lucide-react';
import PageTransition, {
  Reveal,
  Stagger,
  StaggerItem,
  ImageMask,
  InViewLine,
  TextReveal,
} from '../components/Transitions';
import HotelShowcase3D from '../components/HotelShowcase3D';
import HotspotScene from '../components/HotspotScene';
import TiltCard from '../components/Interactive3DCard';
import {
  AuroraBackground,
  Marquee,
  CountUp,
  MagneticButton,
  SectionHead,
  Parallax,
} from '../components/ui';
import { luxuryAudio } from '../utils/audio';

const click = () => luxuryAudio.playChime(640, 0.09);

const collections = [
  {
    title: 'Living & Lounge',
    sub: 'Seating, Credenzas & Occasional Tables',
    tag: '18 Pieces',
    image:
      'https://images.pexels.com/photos/14011664/pexels-photo-14011664.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200',
    link: '/collections?category=living',
  },
  {
    title: 'Bedroom',
    sub: 'Platform Beds & Headboard Walls',
    tag: '9 Pieces',
    image:
      'https://images.pexels.com/photos/6585757/pexels-photo-6585757.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200',
    link: '/collections?category=sleep',
  },
  {
    title: 'Outdoor & Terrace',
    sub: 'Weather-Rated Seating & Stone',
    tag: '11 Pieces',
    image:
      'https://images.pexels.com/photos/35113998/pexels-photo-35113998.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200',
    link: '/virtual-tour',
  },
  {
    title: 'Dining',
    sub: 'Monolithic Tables & Dining Chairs',
    tag: '12 Pieces',
    image:
      'https://images.pexels.com/photos/14598479/pexels-photo-14598479.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200',
    link: '/collections?category=dining',
  },
];

const materials = [
  {
    name: 'Backlit Onyx',
    origin: 'Quarried in Iran',
    hex: '#A5F0F6',
    note: 'Translucent panels laminated to glass for illuminated walls and reception fronts.',
  },
  {
    name: 'Verde Alpi Marble',
    origin: "Valle d'Aosta, Italy",
    hex: '#0F766E',
    note: 'A deep green serpentinite with white veining, honed to a low-sheen finish.',
  },
  {
    name: 'Murano Crystal',
    origin: 'Venice, Italy',
    hex: '#06B6D4',
    note: 'Hand-blown fluted cylinders, tinted in-house and tested for optical clarity.',
  },
  {
    name: 'Volcanic Basalt',
    origin: 'Southern Iceland',
    hex: '#0C1F1E',
    note: 'Dense, non-porous stone cut on a diamond wire for seamless monolithic tops.',
  },
];

const process = [
  {
    step: 'Consultation',
    text: 'We review your drawings, site conditions and budget, then agree a specification and a fixed programme.',
  },
  {
    step: 'Specification',
    text: 'You receive a 3D preview of the room, a physical sample box and a written schedule of finishes.',
  },
  {
    step: 'Fabrication',
    text: 'Work begins across our stone, glass and joinery ateliers, with photographic progress reports each fortnight.',
  },
  {
    step: 'Installation',
    text: 'Our own team handles freight, assembly and final adjustment on site, anywhere in the world.',
  },
];

const stats = [
  { value: 42, suffix: '', label: 'Hospitality Projects Completed' },
  { value: 19, suffix: '', label: 'Countries Delivered To' },
  { value: 32, suffix: '', label: 'Years in Practice' },
  { value: 10, suffix: '', label: 'Year Structural Warranty' },
];

export default function Home() {
  return (
    <PageTransition>
      {/* ══════════ HERO ══════════ */}
      <section className="relative pt-36 sm:pt-40 pb-10 overflow-hidden">
        <AuroraBackground />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Reveal direction="down">
              <span className="type-eyebrow text-[9.5px] text-teal-deep inline-flex items-center gap-2.5">
                <span className="h-1 w-1 rounded-full bg-cyan-core" />
                Furniture &amp; Interiors · Established 1994
              </span>
              {/* eyebrow rule */}
              <div className="rule-accent w-16 mt-3 mx-auto" />
            </Reveal>

            <h1 className="type-display mt-7 text-[2.35rem] leading-[1.06] sm:text-[3.4rem] md:text-[4.1rem] text-ink">
              <TextReveal text="Interiors Made to the Standard of" />{' '}
              <span className="inline-block overflow-hidden align-bottom">
                <motion.span
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 0.9, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block text-gradient"
                >
                  The World&rsquo;s Finest Hotels.
                </motion.span>
              </span>
            </h1>

            <Reveal delay={0.6} direction="blur">
              <p className="type-lead mt-7 text-[14px] sm:text-[16px] text-slate-cool/80 measure-wide mx-auto">
                For three decades we have furnished landmark hotels and private residences in
                nineteen countries. Every piece we make can be inspected in our online showroom,
                sampled in your hand, and seen in person before you commit.
              </p>
            </Reveal>

            <Reveal delay={0.72}>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <MagneticButton>
                  <Link
                    to="/virtual-tour"
                    onClick={click}
                    className="relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-white bg-ink hover:bg-teal-deep transition-colors text-[10.5px] type-eyebrow shimmer overflow-hidden shadow-lux group"
                  >
                    <Play size={13} className="text-cyan-glow group-hover:scale-125 transition-transform" />
                    View the Showroom
                  </Link>
                </MagneticButton>

                <MagneticButton>
                  <Link
                    to="/collections"
                    onClick={click}
                    className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full glass text-teal-deep hover:bg-white transition-colors text-[10.5px] type-eyebrow border border-cyan-core/25 group"
                  >
                    Browse the Collection
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </MagneticButton>
              </div>
            </Reveal>

            <Reveal delay={0.85}>
              <p className="mt-6 text-[11px] text-slate-cool/55">
                No account required · Sample boxes dispatched within 48 hours
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.25} direction="scale" className="mt-10">
            <HotelShowcase3D />
          </Reveal>
        </div>
      </section>

      <Marquee
        items={[
          'HOSPITALITY-GRADE CONSTRUCTION',
          'QUARRY-TRACED STONE',
          'IN-HOUSE GLASS ATELIER',
          'TEN-YEAR STRUCTURAL WARRANTY',
          'WORLDWIDE INSTALLATION',
        ]}
      />

      {/* ══════════ CREDENTIALS ══════════ */}
      <section className="relative py-16 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <StaggerItem key={s.label}>
                <TiltCard depth={7}>
                  <div className="glass rounded-[22px] p-6 h-full text-center">
                    <CountUp
                      to={s.value}
                      suffix={s.suffix}
                      className="block type-num text-[2.1rem] sm:text-[2.5rem] text-gradient"
                    />
                    <span className="block mt-2 text-[11.5px] text-slate-cool/70 leading-snug">
                      {s.label}
                    </span>
                  </div>
                </TiltCard>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ══════════ ANNOTATED ROOM ══════════ */}
      <section className="relative py-16 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHead
            eyebrow="Annotated Interior"
            title="Every Element, Fully Documented"
            highlight={['Documented']}
            description="Select a marker to read the material specification, dimensions and price of each piece in this composed suite."
          />
          <Reveal direction="scale">
            <HotspotScene />
          </Reveal>
        </div>
      </section>

      {/* ══════════ COLLECTIONS ══════════ */}
      <section className="relative py-20 px-5 sm:px-8 bg-gradient-to-b from-transparent via-ice/70 to-transparent">
        <div className="max-w-7xl mx-auto">
          <SectionHead
            eyebrow="The Collection"
            title="Four Ranges, One Design Language"
            highlight={['Language']}
            description="Each range shares the same proportions, joinery details and finish library, so pieces can be combined across an entire property."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {collections.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.1} direction="up">
                <Parallax distance={i % 2 === 0 ? 26 : -26}>
                  <TiltCard depth={10}>
                    <Link
                      to={c.link}
                      onClick={click}
                      className="group relative block aspect-[3/4] rounded-[22px] overflow-hidden bg-abyss"
                    >
                      <img
                        src={c.image}
                        alt={c.title}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-[1.2s] ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/25 to-cyan-deep/10" />

                      <span className="absolute top-4 left-4 glass-dark px-2.5 py-1 rounded-full text-[9px] type-eyebrow text-cyan-glow">
                        {c.tag}
                      </span>

                      <div className="absolute bottom-0 inset-x-0 p-5">
                        <h3 className="type-title text-[19px] text-white">{c.title}</h3>
                        <span className="block text-[11.5px] text-crystal/70 mt-1.5 leading-snug">
                          {c.sub}
                        </span>
                        <div className="mt-3 h-px w-full bg-white/15 overflow-hidden">
                          <span className="block h-full w-0 bg-gradient-to-r from-teal-glow to-cyan-glow group-hover:w-full transition-all duration-700" />
                        </div>
                      </div>

                      <span className="absolute top-4 right-4 h-9 w-9 grid place-items-center rounded-full bg-white/15 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 group-hover:rotate-45 transition-all duration-500">
                        <ArrowUpRight size={15} />
                      </span>
                    </Link>
                  </TiltCard>
                </Parallax>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ MATERIALS ══════════ */}
      <section className="relative py-24 px-5 sm:px-8 bg-abyss overflow-hidden">
        <AuroraBackground variant="dark" />
        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <SectionHead
              eyebrow="Materials"
              title="Specified by Origin, Not by Catalogue"
              highlight={['Origin,']}
              description="We name the quarry, the mill and the maker behind every surface. Full provenance documentation accompanies each order."
              align="left"
              dark
            />
            <Reveal delay={0.2}>
              <Link
                to="/bespoke"
                onClick={click}
                className="inline-flex items-center gap-2.5 rounded-full bg-white text-ink px-6 py-3 text-[10.5px] type-eyebrow hover:bg-cyan-glow transition-colors group"
              >
                <Layers size={14} className="text-teal-deep" />
                Request a Sample Box
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Stagger className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {materials.map((m) => (
                <StaggerItem key={m.name}>
                  <TiltCard depth={8}>
                    <div className="glass-dark rounded-[22px] p-5 text-white h-full">
                      <div className="flex items-start justify-between mb-4">
                        <span
                          className="h-9 w-9 rounded-xl border border-white/20 shadow-inner shrink-0"
                          style={{ background: `linear-gradient(140deg, ${m.hex}, #06110F)` }}
                        />
                        <span className="text-[9.5px] type-eyebrow text-cyan-glow/80 text-right">
                          {m.origin}
                        </span>
                      </div>
                      <h4 className="type-title text-[15.5px]">{m.name}</h4>
                      <p className="type-body text-[11.5px] text-crystal/60 mt-1.5">{m.note}</p>
                    </div>
                  </TiltCard>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* ══════════ PROCESS ══════════ */}
      <section className="relative py-20 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHead
            eyebrow="How We Work"
            title="A Clear Process, From Drawing to Installation"
            highlight={['Installation']}
            description="Most commissions complete within eight to fourteen weeks. You will have one named contact throughout."
          />
          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {process.map((p, i) => (
              <StaggerItem key={p.step}>
                <TiltCard depth={8}>
                  <div className="glass rounded-[22px] p-7 h-full relative">
                    <span className="type-num text-[2.4rem] text-cyan-core/25 leading-none">
                      0{i + 1}
                    </span>
                    <h4 className="type-title text-[16.5px] text-ink mt-3">{p.step}</h4>
                    <p className="type-body text-[12px] text-slate-cool/75 mt-2.5">{p.text}</p>
                  </div>
                </TiltCard>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ══════════ SHOWROOM PROMO ══════════ */}
      <section className="relative py-16 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <Reveal direction="scale">
            <div className="relative rounded-[28px] overflow-hidden shadow-lux bg-teal-abyss">
              <ImageMask
                src="https://images.pexels.com/photos/14036253/pexels-photo-14036253.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1600"
                alt="Reception hall interior"
                className="h-[440px] md:h-[540px]"
                imgClassName="scale-105"
              />

              {/* layered teal-to-cyan wash instead of flat black */}
              <div className="absolute inset-0 bg-gradient-to-r from-teal-abyss via-teal-abyss/85 to-teal-abyss/10" />
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-abyss/80 via-transparent to-transparent mix-blend-multiply" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_50%,rgba(13,148,136,0.55),transparent_60%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_18%,rgba(34,211,238,0.28),transparent_55%)]" />

              {/* drifting light orbs + grid for depth */}
              <div className="pointer-events-none absolute -bottom-28 left-10 w-[420px] h-[420px] rounded-full bg-teal-glow/25 blur-[120px] animate-aurora" />
              <div
                className="pointer-events-none absolute -top-24 left-1/3 w-[340px] h-[340px] rounded-full bg-cyan-core/25 blur-[110px] animate-aurora"
                style={{ animationDelay: '-7s' }}
              />
              <div className="absolute inset-0 grid-lines opacity-30" />

              <div className="absolute inset-0 flex items-center">
                <div className="px-7 sm:px-12 max-w-xl text-white">
                  <span className="type-eyebrow text-[9.5px] text-cyan-glow inline-flex items-center gap-2">
                    <Boxes size={12} /> The Online Showroom
                  </span>
                  <div className="rule-accent w-14 mt-3" />
                  <h2 className="type-display mt-5 text-[27px] sm:text-4xl md:text-[42px] text-white">
                    <TextReveal text="See the Room Before" />{' '}
                    <span className="text-gradient-light">You Commission It.</span>
                  </h2>
                  <p className="type-lead mt-4 text-[13.5px] text-crystal/75 measure">
                    Three fully staged interiors, viewable in your browser. Adjust the lighting from
                    morning to evening and judge how each finish reads at every hour of the day.
                  </p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <Link
                      to="/virtual-tour"
                      onClick={click}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-ink text-[10.5px] type-eyebrow hover:bg-cyan-glow transition-colors group"
                    >
                      Enter the Showroom
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      to="/about"
                      onClick={click}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md text-white text-[10.5px] type-eyebrow border border-cyan-glow/25 hover:bg-white/20 hover:border-cyan-glow/50 transition-colors"
                    >
                      <Star size={13} className="text-cyan-glow" /> About the Studio
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <InViewLine className="max-w-6xl mx-auto" />

      {/* ══════════ CLOSING ══════════ */}
      <section className="relative py-24 px-5 sm:px-8 overflow-hidden">
        <AuroraBackground />
        <div className="relative max-w-3xl mx-auto text-center">
          <Reveal direction="scale">
            <span className="type-eyebrow text-[9.5px] text-teal-deep">Next Step</span>
            <div className="rule-accent w-16 mt-3 mx-auto" />
            <h2 className="type-display mt-6 text-[28px] sm:text-4xl md:text-5xl text-ink">
              <TextReveal text="Begin With a Conversation," />{' '}
              <span className="text-gradient">Not a Catalogue.</span>
            </h2>
            <p className="type-lead mt-6 text-[14px] text-slate-cool/80 measure mx-auto">
              Tell us about the space, the timeline and the budget. We will respond within two working
              hours with an honest view on whether we are the right studio for the project.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <MagneticButton>
                <Link
                  to="/contact"
                  onClick={click}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-teal-deep via-cyan-deep to-cyan-core text-white text-[10.5px] type-eyebrow shadow-lux hover:brightness-110 transition-all group"
                >
                  Book an Appointment
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link
                  to="/bespoke"
                  onClick={click}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full glass text-teal-deep text-[10.5px] type-eyebrow border border-cyan-core/25 hover:bg-white transition-colors"
                >
                  Discuss a Commission
                </Link>
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>
    </PageTransition>
  );
}
