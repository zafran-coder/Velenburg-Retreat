import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Calendar, Check, ArrowRight, Sparkles, Gem } from 'lucide-react';
import confetti from 'canvas-confetti';
import PageTransition, { Reveal, Stagger, StaggerItem } from '../components/Transitions';
import TiltCard from '../components/Interactive3DCard';
import { AuroraBackground, SectionHead, MagneticButton } from '../components/ui';
import { luxuryAudio } from '../utils/audio';

const EASE = [0.16, 1, 0.3, 1] as const;

const salons = [
  {
    city: 'Dubai',
    name: 'Marina Atrium Salon',
    address: 'Sheikh Zayed Road, Dubai, UAE',
    phone: '+971 4 552 8890',
    hours: 'Daily 10:00 – 23:00',
    tz: 'Asia/Dubai',
    image: 'https://images.pexels.com/photos/29000086/pexels-photo-29000086.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800',
  },
  {
    city: 'Doha',
    name: 'West Bay Crystal Hall',
    address: 'West Bay Lagoon, Doha, Qatar',
    phone: '+974 4429 7712',
    hours: 'Daily 10:00 – 22:00',
    tz: 'Asia/Qatar',
    image: 'https://images.pexels.com/photos/14011664/pexels-photo-14011664.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800',
  },
  {
    city: 'Paris',
    name: 'Vendôme Atelier',
    address: '14 Place Vendôme, 75001 Paris',
    phone: '+33 1 42 68 55 10',
    hours: 'Mon – Sat 10:00 – 19:30',
    tz: 'Europe/Paris',
    image: 'https://images.pexels.com/photos/3926482/pexels-photo-3926482.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800',
  },
  {
    city: 'Bali',
    name: 'Uluwatu Clifftop Villa',
    address: 'Jl. Labuansait, Uluwatu, Bali',
    phone: '+62 361 847 2210',
    hours: 'Daily 09:00 – 21:00',
    tz: 'Asia/Makassar',
    image: 'https://images.pexels.com/photos/35113998/pexels-photo-35113998.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800',
  },
];

const slots = [
  'Morning · 10:30 – 12:00',
  'Midday · 13:00 – 14:30',
  'Afternoon · 15:30 – 17:00',
  'Evening · 18:00 – 19:30',
];

const refreshments = [
  'Champagne',
  'Japanese green tea',
  'Espresso',
  'Still or sparkling water',
];

export default function Contact() {
  const [salon, setSalon] = useState(salons[0].city);
  const [slot, setSlot] = useState(slots[2]);
  const [drink, setDrink] = useState(refreshments[0]);
  const [done, setDone] = useState(false);
  const [times, setTimes] = useState<Record<string, string>>({});

  useEffect(() => {
    const tick = () => {
      const t: Record<string, string> = {};
      salons.forEach((s) => {
        t[s.city] = new Intl.DateTimeFormat('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: s.tz,
        }).format(new Date());
      });
      setTimes(t);
    };
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    luxuryAudio.playChime(790, 0.24);
    setDone(true);
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0F766E', '#06B6D4', '#22D3EE', '#A5F0F6', '#F4FEFE'],
      });
    } catch {
      /* noop */
    }
  };

  const activeSalon = salons.find((s) => s.city === salon)!;

  return (
    <PageTransition>
      {/* HEADER */}
      <section className="relative pt-32 pb-8 overflow-hidden">
        <AuroraBackground />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
          <SectionHead
            eyebrow="Appointments"
            title="Book a Private Showroom Viewing"
            highlight={['Private']}
            description="We host one client at a time. Choose a location and a time that suits you, and your consultant will prepare the relevant samples in advance."
          />
        </div>
      </section>

      {/* SALON SELECTOR */}
      <section className="px-5 sm:px-8 pb-10">
        <div className="max-w-7xl mx-auto">
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {salons.map((s) => {
              const isActive = salon === s.city;
              return (
                <StaggerItem key={s.city}>
                  <TiltCard depth={8}>
                    <div
                      onClick={() => {
                        luxuryAudio.playChime(640, 0.08);
                        setSalon(s.city);
                      }}
                      className={`cursor-pointer rounded-[22px] overflow-hidden glass h-full flex flex-col transition-all duration-500 ${
                        isActive ? 'ring-2 ring-cyan-core shadow-lux' : 'border-cyan-core/15 hover:shadow-lux'
                      }`}
                    >
                      <div className="relative h-40 overflow-hidden">
                        <img src={s.image} alt={s.city} loading="lazy" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-abyss/80 to-transparent" />
                        <span className="absolute top-3 right-3 glass-dark px-2.5 py-1 rounded-full text-[9px] text-white flex items-center gap-1.5">
                          <Clock size={10} className="text-cyan-glow" /> {times[s.city] || '--:--'}
                        </span>
                        {isActive && (
                          <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-cyan-glow text-ink text-[9px] type-eyebrow">
                            Selected
                          </span>
                        )}
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="type-title text-[16px] text-ink">{s.name}</h3>
                          <p className="type-body text-[11.5px] text-slate-cool/70 mt-1">{s.address}</p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-cyan-core/12 space-y-1.5 text-[11px] text-slate-cool/80">
                          <span className="flex items-center gap-2">
                            <Phone size={11} className="text-cyan-core" /> {s.phone}
                          </span>
                          <span className="flex items-center gap-2">
                            <Clock size={11} className="text-teal-core" /> {s.hours}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* FORM */}
      <section className="px-5 sm:px-8 py-10">
        <div className="max-w-4xl mx-auto">
          <Reveal direction="scale">
            <div className="relative overflow-hidden rounded-[28px] glass-strong shadow-lux p-6 sm:p-10">
              <div className="absolute -top-28 -left-24 w-96 h-96 rounded-full bg-teal-glow/25 blur-[110px] animate-aurora" />

              <div className="relative flex items-center gap-3 mb-2">
                <span className="grid place-items-center h-10 w-10 rounded-xl bg-gradient-to-br from-teal-core to-cyan-glow text-white">
                  <Gem size={17} />
                </span>
                <div>
                  <h3 className="type-title text-[19px] text-ink">Appointment Request</h3>
                  <p className="text-[11.5px] text-slate-cool/70 mt-0.5">
                    <strong className="text-teal-deep type-label">{activeSalon.name}</strong> ·{' '}
                    {activeSalon.hours}
                  </p>
                </div>
              </div>

              <form onSubmit={submit} className="relative mt-8 space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Full Name', type: 'text', ph: 'Alexandra Sterling' },
                    { label: 'Email Address', type: 'email', ph: 'you@residence.com' },
                  ].map((f) => (
                    <div key={f.label} className="space-y-1.5">
                      <label className="type-eyebrow text-[10px] text-teal-deep block">{f.label}</label>
                      <input
                        required
                        type={f.type}
                        placeholder={f.ph}
                        className="w-full bg-white rounded-xl border border-cyan-core/15 px-4 py-3.5 text-[12.5px] text-ink placeholder:text-slate-cool/40 focus:outline-none focus:border-cyan-core/70 focus:shadow-[0_0_0_4px_rgba(34,211,238,0.12)] transition-all"
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="type-eyebrow text-[10px] text-teal-deep block flex items-center gap-1.5">
                      <Calendar size={12} className="text-cyan-core" /> Preferred Date
                    </label>
                    <input
                      required
                      type="date"
                      defaultValue="2026-04-18"
                      className="w-full bg-white rounded-xl border border-cyan-core/15 px-4 py-3.5 text-[12.5px] text-ink focus:outline-none focus:border-cyan-core/70 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="type-eyebrow text-[10px] text-teal-deep block">Telephone Number</label>
                    <input
                      type="tel"
                      placeholder="+971 50 000 0000"
                      className="w-full bg-white rounded-xl border border-cyan-core/15 px-4 py-3.5 text-[12.5px] text-ink placeholder:text-slate-cool/40 focus:outline-none focus:border-cyan-core/70 transition-all"
                    />
                  </div>
                </div>

                {/* slots */}
                <div>
                  <span className="type-eyebrow text-[10px] text-teal-deep block mb-3">Preferred Time</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {slots.map((s) => {
                      const isActive = slot === s;
                      return (
                        <motion.button
                          type="button"
                          key={s}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            luxuryAudio.playChime(640, 0.07);
                            setSlot(s);
                          }}
                          className={`text-left px-4 py-3 rounded-2xl border text-[12.5px] font-medium transition-all duration-300 ${
                            isActive
                              ? 'bg-gradient-to-r from-teal-deep to-cyan-core text-white border-transparent shadow-[0_12px_26px_-14px_rgba(6,182,212,0.9)]'
                              : 'bg-white/70 text-slate-cool border-cyan-core/15 hover:bg-white hover:border-cyan-core/45'
                          }`}
                        >
                          {s}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* refreshments */}
                <div>
                  <span className="type-eyebrow text-[10px] text-teal-deep block mb-3">Refreshment on Arrival</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {refreshments.map((r) => {
                      const isActive = drink === r;
                      return (
                        <button
                          type="button"
                          key={r}
                          onClick={() => {
                            luxuryAudio.playChime(700, 0.06);
                            setDrink(r);
                          }}
                          className={`px-3 py-3 rounded-2xl border text-[11.5px] font-medium transition-all duration-300 ${
                            isActive
                              ? 'bg-white border-cyan-core/70 text-ink shadow-[0_10px_22px_-16px_rgba(6,182,212,0.9)]'
                              : 'bg-white/60 border-cyan-core/12 text-slate-cool hover:bg-white'
                          }`}
                        >
                          ✦ {r}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="type-eyebrow text-[10px] text-teal-deep block">
                    Anything We Should Prepare
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Specific pieces, drawings you would like reviewed, or finishes you want to compare"
                    className="w-full bg-white rounded-xl border border-cyan-core/15 px-4 py-3.5 text-[12.5px] text-ink placeholder:text-slate-cool/40 focus:outline-none focus:border-cyan-core/70 transition-all resize-none"
                  />
                </div>

                <div className="pt-4 border-t border-cyan-core/12 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-[11.5px] text-slate-cool/70">
                    You will receive written confirmation within two working hours.
                  </span>
                  <MagneticButton>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-teal-deep via-cyan-deep to-cyan-core text-white text-[11px] type-eyebrow shadow-lux hover:brightness-110 transition-all group"
                    >
                      Confirm reservation
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </MagneticButton>
                </div>

                <AnimatePresence>
                  {done && (
                    <motion.div
                      initial={{ opacity: 0, y: 14, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.5, ease: EASE }}
                      className="p-5 rounded-2xl bg-teal-core/10 border border-teal-core/25"
                    >
                      <div className="flex items-center gap-2 text-teal-deep type-label text-[13.5px]">
                        <Check size={17} /> Request received
                      </div>
                      <p className="type-body text-[12.5px] text-slate-cool mt-2">
                        Thank you. Your appointment at the <strong>{activeSalon.name}</strong> is
                        provisionally held for the <strong>{slot.toLowerCase()}</strong> slot, with{' '}
                        <strong>{drink.toLowerCase()}</strong> on arrival. A consultant will confirm
                        by email shortly.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </Reveal>
        </div>
      </section>

      {/* DIRECT CONTACTS */}
      <section className="px-5 sm:px-8 pb-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: MapPin,
              t: 'General Enquiries',
              a: 'studio@aura-interiors.com',
              b: 'Replies within two working hours',
            },
            {
              icon: Mail,
              t: 'Trade & Specification',
              a: 'projects@aura-interiors.com',
              b: 'For architects and procurement teams',
            },
            {
              icon: Sparkles,
              t: 'Delivery & Installation',
              a: 'logistics@aura-interiors.com',
              b: 'Insured freight and on-site assembly',
            },
          ].map((c) => (
            <Reveal key={c.t} direction="up">
              <TiltCard depth={8}>
                <div className="glass rounded-[22px] p-6 h-full flex items-start gap-4">
                  <span className="grid place-items-center h-10 w-10 rounded-xl bg-gradient-to-br from-teal-core to-cyan-glow text-white shrink-0">
                    <c.icon size={16} />
                  </span>
                  <div>
                    <h4 className="type-title text-[15px] text-ink">{c.t}</h4>
                    <p className="text-[12px] text-slate-cool/80 mt-1">{c.a}</p>
                    <p className="text-[11.5px] text-slate-cool/60">{c.b}</p>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>
    </PageTransition>
  );
}
