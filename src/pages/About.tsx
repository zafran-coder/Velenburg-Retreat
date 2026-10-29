import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Compass,
  ShieldCheck,
  Trees,
  Mountain,
  HeartHandshake,
  Coffee,
  Sparkles,
  Flame,
  CheckCircle2,
  MessageCircle
} from 'lucide-react';
import PageTransition, { Reveal, Stagger, StaggerItem } from '../components/Transitions';
import { AuroraBackground } from '../components/ui';
import { InstagramIcon } from '../components/InstagramIcon';
import { RETREAT_CONFIG, formatPKR } from '../data/retreatConfig';
import { luxuryAudio } from '../utils/audio';

const EASE = [0.16, 1, 0.3, 1] as const;

const milestones = [
  {
    year: 'The Vision',
    title: 'Peaceful Mountain Haven at 7,200 Ft',
    text: 'A deliberate choice to establish four private luxury suites away from Murree Mall Road congestion, located high in the quiet pine hills of Gharial Camp.',
  },
  {
    year: 'Architecture',
    title: 'Vintage Charm. Modern Comfort.',
    text: 'Crafting natural timber ceilings, vertical wood slat accent walls, and sunroom sitting nooks that harmonize with the mountain landscape.',
  },
  {
    year: 'Philosophy',
    title: 'Four Identical Luxury Suites',
    text: 'Eliminating artificial room tiers. Every suite receives identical luxury amenities, king bedding, ensuite bath, and a uniform PKR 18,000 / Night rate.',
  },
  {
    year: 'Hospitality',
    title: 'Warm & Peaceful Mountain Stays',
    text: 'Offering quiet mountain evenings with in-suite tea stations, cozy heated duvets, and an expansive open terrace overlooking pine valleys.',
  },
];

const values = [
  {
    icon: Trees,
    title: 'Pine Forest Conservation',
    desc: 'Surrounded by protected Himalayan pines, providing guests with fresh cedar-infused alpine air at 7,200 feet.',
  },
  {
    icon: ShieldCheck,
    title: 'Transparent Pricing',
    desc: 'PKR 18,000 / Night across all 4 suites. Zero hidden booking fees, no sudden peak-season markups.',
  },
  {
    icon: Coffee,
    title: 'In-Room Tea Station',
    desc: 'In-suite electric kettle, complimentary Tapal Green Tea sachets, and shared self-use kitchen space for guest ease.',
  },
  {
    icon: Flame,
    title: 'Year-Round Comfort',
    desc: 'High-power room heating, electric blankets, and standing gas patio heaters on the terrace during cold Murree nights.',
  },
];

export default function About() {
  const whatsappUrl = `https://wa.me/${RETREAT_CONFIG.contact.ownerWhatsApp}?text=Assalam-o-Alaikum%20Velenburg%20Retreat!%20I%20would%20like%20to%20learn%20more%20about%20the%20retreat%20and%20suite%20availability%20(PKR%2018,000%20/%20Night).`;

  return (
    <PageTransition>
      {/* ================= HERO WITH REAL ESTATE OUTLOOK ================= */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 bg-[#0F172A] text-alabaster border-b border-slate-700/80 overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/images/velenburg-exterior.jpg"
            alt="The Mountain Estate at Velenburg Retreat Murree"
            className="w-full h-full object-cover object-center filter brightness-100 contrast-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/45" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-[#DFBF77] text-xs font-semibold tracking-[0.2em] uppercase mb-6 shadow-md">
              <Mountain size={14} strokeWidth={1.75} className="text-[#B48A3E]" />
              <span>The Story of Velenburg Retreat</span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight max-w-3xl mx-auto leading-[1.1] drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)]">
              Vintage Charm. <br />
              <span className="text-[#DFBF77]">Modern Comfort.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-6 text-base font-normal text-slate-100 max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
              Located in the quiet pine hills of Gharial Camp, Upper Topa (7,200 ft elevation). Velenburg Retreat was established as an intimate four-suite mountain haven for families and couples seeking peace, privacy, and pine valley views.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/collections"
                className="px-6 py-3 rounded-full bg-[#0F172A] hover:bg-slate-800 text-white font-semibold text-sm transition-all shadow-sm hover:shadow-md flex items-center gap-2 cursor-pointer border border-white/20"
              >
                <span>Explore the 4 Suites</span>
                <ArrowRight size={15} strokeWidth={1.75} />
              </Link>

              <a
                href={RETREAT_CONFIG.contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full border border-slate-300 bg-white/10 hover:bg-white text-white hover:text-slate-900 hover:border-[#DFBF77] text-sm font-semibold transition-all backdrop-blur-md flex items-center gap-2 cursor-pointer"
              >
                <InstagramIcon size={14} className="text-[#DFBF77]" />
                <span>Follow {RETREAT_CONFIG.contact.instagramHandle}</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= STORY & IMAGE SPREAD ================= */}
      <section className="py-16 md:py-24 bg-alabaster">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B48A3E]">
                Gharial Camp · 7,200 Ft Elevation
              </span>
              <h2 className="text-3xl md:text-4xl font-bold leading-[1.2] text-[#0F172A] tracking-tight">
                A Peaceful Mountain Haven Above Murree's Crowds
              </h2>

              <p className="text-base font-normal leading-relaxed text-slate-600">
                Most travelers know Murree through the crowded noise of Mall Road. But those who know where to seek tranquility ascend to Gharial Camp — a scenic high-altitude ridge wrapped in towering Himalayan pines and fresh alpine air.
              </p>

              <p className="text-base font-normal leading-relaxed text-slate-600">
                Here, mornings begin with the scent of mountain mist on pine needles, and afternoons invite quiet relaxation in private sunrooms. By evening, our open terrace offers an unpolluted vista of star-studded Himalayan skies.
              </p>

              <div className="pt-2">
                <div className="p-5 rounded-2xl bg-amber-50/70 border-l-4 border-[#B48A3E] text-sm text-slate-700 leading-relaxed shadow-xs">
                  <strong className="text-[#0F172A] block mb-1">The Velenburg Standard:</strong>
                  Every suite is furnished with an in-room electric kettle, complimentary Tapal Green Tea sachets, and our signature black-and-gold Velenburg branded toiletries kit.
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden border border-slate-200/80 shadow-md aspect-[3/4]">
                <img
                  src="/images/room-2/photo-1.jpg"
                  alt="Vertical wood feature wall"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden border border-slate-200/80 shadow-md aspect-square">
                  <img
                    src="/images/shared/kettle-toiletries-tray.jpg"
                    alt="In-suite kettle and toiletries kit"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden border border-slate-200/80 shadow-md aspect-square">
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

      {/* ================= 4 PILLARS TIMELINE ================= */}
      <section className="py-16 md:py-24 bg-[#0F172A] text-alabaster border-t border-slate-700/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#DFBF77]">
              Our Guiding Principles
            </span>
            <h2 className="text-3xl md:text-4xl font-bold leading-[1.2] text-white tracking-tight mt-2">
              The Foundations of Velenburg
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((m, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#B48A3E]/60 transition-all flex flex-col justify-between h-full"
              >
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#DFBF77] font-semibold">
                    {m.year}
                  </span>
                  <h3 className="text-xl font-semibold leading-snug text-white mt-3">{m.title}</h3>
                  <p className="text-sm text-slate-300 mt-3 leading-relaxed font-normal">
                    {m.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 4 VALUES CARDS ================= */}
      <section className="py-16 md:py-24 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div
                key={i}
                className="bg-alabaster rounded-2xl p-6 border border-slate-200/80 hover:border-[#B48A3E] transition-all shadow-xs flex flex-col justify-between h-full"
              >
                <div>
                  <div className="h-12 w-12 rounded-xl bg-[#B48A3E]/15 border border-[#B48A3E]/30 grid place-items-center text-[#B48A3E] mb-4">
                    <v.icon size={22} strokeWidth={1.75} />
                  </div>
                  <h3 className="text-xl font-semibold leading-snug text-[#0F172A]">{v.title}</h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA BANNER ================= */}
      <section className="py-16 md:py-24 bg-[#0F172A] text-alabaster border-t border-slate-700/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#DFBF77]">
            Begin Your Murree Stay
          </span>
          <h2 className="text-3xl md:text-4xl font-bold leading-[1.2] text-white tracking-tight mt-2">
            Reserve Your Stay at Velenburg
          </h2>
          <p className="mt-4 text-base font-normal leading-relaxed text-slate-300 max-w-xl mx-auto">
            Each of our four suites is available at <strong className="text-white font-semibold">PKR 18,000 / Night</strong>. Message us directly on WhatsApp to confirm your preferred dates.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-sm transition-all shadow-sm hover:shadow-md flex items-center gap-2 cursor-pointer"
            >
              <MessageCircle size={16} strokeWidth={1.75} className="fill-white" />
              <span>Connect on WhatsApp</span>
            </a>

            <Link
              to="/contact"
              className="px-6 py-3 rounded-full border border-slate-300 bg-white/10 hover:bg-white text-white hover:text-slate-900 text-sm font-semibold transition-all cursor-pointer"
            >
              View Location & Directions
            </Link>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
