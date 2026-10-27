import { Link } from 'react-router-dom';
import { ArrowRight, Compass, ShieldCheck, HeartHandshake, Leaf, Star, Sparkles } from 'lucide-react';
import PageTransition, { Reveal, Stagger, StaggerItem, ImageMask, TextReveal, InViewLine } from '../components/Transitions';
import TiltCard from '../components/Interactive3DCard';
import { AuroraBackground, SectionHead, CountUp, Marquee, Parallax } from '../components/ui';
import { luxuryAudio } from '../utils/audio';

const timeline = [
  {
    year: '1994',
    title: 'First Commission',
    text: 'A four-person joinery workshop in Lombardy completes its first hotel reception ceiling.',
  },
  {
    year: '2006',
    title: 'Glass Atelier Opens',
    text: 'Glassblowing is brought in-house, allowing us to control tint, clarity and lead times directly.',
  },
  {
    year: '2016',
    title: 'Three Flagship Projects',
    text: 'Appointed to three landmark properties in Dubai and Doha within a single calendar year.',
  },
  {
    year: '2026',
    title: 'The Online Showroom',
    text: 'Every commission now includes a browser-based preview of the room before fabrication begins.',
  },
];

const ateliers = [
  {
    name: 'Stone Workshop',
    place: 'Carrara, Italy',
    image: 'https://images.pexels.com/photos/14011664/pexels-photo-14011664.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=900',
    text: 'Diamond-wire cutting, book-matching and the lamination of translucent onyx to glass.',
  },
  {
    name: 'Glass Atelier',
    place: 'Murano, Italy',
    image: 'https://images.pexels.com/photos/35326200/pexels-photo-35326200.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=900',
    text: 'Hand-blown fluted cylinders, in-house tinting and optical clarity testing on every batch.',
  },
  {
    name: 'Joinery & Textile Mill',
    place: 'Kyoto and Como',
    image: 'https://images.pexels.com/photos/26729563/pexels-photo-26729563.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=900',
    text: 'Traditional nail-free joinery, paired with weaving and dyeing carried out to our own recipes.',
  },
];

const values = [
  {
    icon: Leaf,
    t: 'Documented Sourcing',
    d: 'FSC-certified timber and quarry-traced stone. Provenance paperwork is issued with every order.',
  },
  {
    icon: ShieldCheck,
    t: 'Contract-Grade Construction',
    d: 'Built for the wear cycles of a working hotel, then detailed for the comfort of a private home.',
  },
  {
    icon: HeartHandshake,
    t: 'Restoration for Life',
    d: 'Any piece, at any age, can return to our workshop and be restored by the people who made it.',
  },
];

export default function About() {
  const click = () => luxuryAudio.playChime(620, 0.09);

  return (
    <PageTransition>
      {/* HEADER */}
      <section className="relative pt-32 pb-10 overflow-hidden">
        <AuroraBackground />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-3xl">
            <Reveal direction="down">
              <span className="type-eyebrow text-[9.5px] text-teal-deep inline-flex items-center gap-2.5">
                <Star size={11} className="text-cyan-core" /> Thirty-two years · Nineteen countries
              </span>
              <div className="rule-accent w-16 mt-3" />
            </Reveal>
            <h1 className="type-display mt-7 text-[2.2rem] sm:text-[3.1rem] md:text-[3.7rem] text-ink">
              <TextReveal text="A Studio Built Around" />{' '}
              <span className="text-gradient">Material and Proportion.</span>
            </h1>
            <Reveal delay={0.3}>
              <p className="type-lead mt-6 text-[14px] sm:text-[15.5px] text-slate-cool/80 measure-wide">
                AURA began in 1994 as a four-person joinery workshop. Today we operate three
                ateliers and an installation team, and we have completed forty-two hospitality
                projects across nineteen countries. The discipline that work demands now informs
                everything we make for private clients.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* HERO IMAGE */}
      <section className="px-5 sm:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <Reveal direction="scale">
            <div className="relative rounded-[28px] overflow-hidden shadow-lux h-[52vh] md:h-[68vh]">
              <ImageMask
                src="https://images.pexels.com/photos/3926482/pexels-photo-3926482.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=1800"
                alt="Grand hotel staircase"
                className="w-full h-full"
                zoom={1.05}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-abyss/90 via-transparent to-transparent" />
              <div className="absolute bottom-6 inset-x-6 sm:inset-x-9 flex flex-col sm:flex-row sm:items-end justify-between gap-5 text-white">
                <div>
                  <span className="type-eyebrow text-cyan-glow text-[9.5px]">
                    Vendôme Stair Hall · Paris, 2022
                  </span>
                  <h2 className="type-title text-[20px] sm:text-[30px] mt-2.5 measure">
                    A Restoration Completed Without Closing the Building.
                  </h2>
                </div>
                <Link
                  to="/virtual-tour"
                  onClick={click}
                  className="inline-flex items-center gap-2 self-start sm:self-auto px-6 py-3 rounded-full glass-dark text-white text-[10px] type-eyebrow border border-white/15 hover:bg-white hover:text-ink transition-colors group shrink-0"
                >
                  View Project
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Marquee
        items={[
          'DUBAI · DOHA · PARIS · BALI',
          'FORTY-TWO HOSPITALITY PROJECTS',
          'IN-HOUSE GLASS ATELIER',
          'QUARRY-TRACED STONE',
          'OWN INSTALLATION TEAM',
        ]}
      />

      {/* STATS */}
      <section className="px-5 sm:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { v: 42, s: '', l: 'Hospitality Projects Completed' },
              { v: 19, s: '', l: 'Countries Delivered To' },
              { v: 32, s: '', l: 'Years in Practice' },
              { v: 100, s: '%', l: 'Materials With Documented Origin' },
            ].map((st) => (
              <StaggerItem key={st.l}>
                <TiltCard depth={7}>
                  <div className="glass rounded-[22px] p-6 text-center h-full">
                    <CountUp to={st.v} suffix={st.s} className="block type-num text-[2.1rem] sm:text-[2.5rem] text-gradient" />
                    <span className="text-[11.5px] text-slate-cool/70 mt-2 block leading-snug">{st.l}</span>
                  </div>
                </TiltCard>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* PHILOSOPHY SPLIT */}
      <section className="px-5 sm:px-8 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <Reveal direction="right">
            <SectionHead
              eyebrow="Our Approach"
              title="Materials Chosen for How They Age"
              highlight={['Age']}
              align="left"
              description="We avoid finishes that look best on the day of installation. Stone that softens, timber that warms and leather that patinates will still read correctly in twenty years."
            />
            <div className="space-y-3">
              {values.map((v) => (
                <div key={v.t} className="flex items-start gap-4 glass rounded-2xl p-4">
                  <span className="grid place-items-center h-10 w-10 rounded-xl bg-gradient-to-br from-teal-core to-cyan-glow text-white shrink-0">
                    <v.icon size={17} />
                  </span>
                  <div>
                    <h4 className="type-title text-[15px] text-ink">{v.t}</h4>
                    <p className="type-body text-[12.5px] text-slate-cool/75 mt-1">{v.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal direction="left">
            <Parallax distance={30}>
              <div className="grid grid-cols-2 gap-4">
                <ImageMask
                  src="https://images.pexels.com/photos/29000086/pexels-photo-29000086.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=700"
                  alt="Hotel lobby"
                  className="rounded-[22px] overflow-hidden h-[280px] shadow-lux"
                />
                <ImageMask
                  src="https://images.pexels.com/photos/14036246/pexels-photo-14036246.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=700"
                  alt="Hotel foyer"
                  className="rounded-[22px] overflow-hidden h-[340px] mt-8 shadow-lux"
                />
              </div>
            </Parallax>
          </Reveal>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="relative py-20 px-5 sm:px-8 bg-abyss overflow-hidden">
        <AuroraBackground variant="dark" />
        <div className="relative max-w-7xl mx-auto">
          <SectionHead
            eyebrow="History"
            title="Three Decades of Practice"
            highlight={['Practice']}
            description="A short record of the decisions that shaped how the studio works today."
            dark
          />

          <div className="relative">
            <div className="absolute left-0 right-0 top-[46px] h-px bg-gradient-to-r from-transparent via-cyan-glow/40 to-transparent hidden md:block" />
            <Stagger className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {timeline.map((t) => (
                <StaggerItem key={t.year}>
                  <TiltCard depth={8}>
                    <div className="glass-dark rounded-[22px] p-6 text-white h-full relative">
                      <span className="type-eyebrow text-cyan-glow text-[10px]">{t.year}</span>
                      <h4 className="type-title text-lg mt-3">{t.title}</h4>
                      <p className="type-body text-[12.5px] text-crystal/65 mt-2">{t.text}</p>
                      <span className="absolute -top-[42px] left-6 h-2 w-2 rounded-full bg-cyan-glow shadow-[0_0_12px_rgba(34,211,238,0.9)] hidden md:block" />
                    </div>
                  </TiltCard>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* ATELIERS */}
      <section className="px-5 sm:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <SectionHead
            eyebrow="Our Workshops"
            title="Three Ateliers, One Standard"
            highlight={['Standard']}
            description="Almost nothing is outsourced. Each commission passes through our own stone, glass and joinery workshops before it is packed."
          />
          <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {ateliers.map((a) => (
              <StaggerItem key={a.name}>
                <TiltCard depth={9}>
                  <div className="group glass rounded-[22px] overflow-hidden h-full flex flex-col">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={a.image}
                        alt={a.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.2s]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-abyss/70 to-transparent" />
                      <span className="absolute bottom-3 left-3 glass-dark px-2.5 py-1 rounded-full text-[9px] type-eyebrow text-cyan-glow">
                        {a.place}
                      </span>
                    </div>
                    <div className="p-6">
                      <h4 className="type-title text-[17px] text-ink">{a.name}</h4>
                      <p className="type-body text-[12.5px] text-slate-cool/75 mt-2">{a.text}</p>
                    </div>
                  </div>
                </TiltCard>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <InViewLine className="max-w-6xl mx-auto" />

      {/* CTA */}
      <section className="px-5 sm:px-8 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal direction="scale">
            <Sparkles size={22} className="mx-auto text-cyan-core" />
            <h2 className="type-display mt-5 text-[28px] sm:text-[40px] text-ink">
              <TextReveal text="We Would Be Glad to Meet You." />
            </h2>
            <p className="type-lead mt-5 text-[13.5px] text-slate-cool/80 measure mx-auto">
              Each showroom holds the complete stone and textile library under adjustable lighting.
              Appointments are private, unhurried, and carry no obligation.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/contact"
                onClick={click}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-teal-deep to-cyan-core text-white text-[11px] type-eyebrow shadow-lux hover:brightness-110 transition-all group"
              >
                Book an Appointment
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/bespoke"
                onClick={click}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full glass text-teal-deep text-[10.5px] type-eyebrow border border-cyan-core/25 hover:bg-white transition-colors"
              >
                <Compass size={13} /> Discuss a Commission
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </PageTransition>
  );
}
