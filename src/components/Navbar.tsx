import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X, Volume2, VolumeX, ArrowRight, ArrowUpRight, Gem, Clock } from 'lucide-react';
import { luxuryAudio } from '../utils/audio';

const EASE = [0.16, 1, 0.3, 1] as const;

type Panel = {
  heading: string;
  blurb: string;
  links: { label: string; to: string; note: string }[];
  image: string;
  caption: string;
};

export const navItems: {
  name: string;
  path: string;
  panel?: Panel;
}[] = [
  { name: 'Home', path: '/' },
  {
    name: 'Collections',
    path: '/collections',
    panel: {
      heading: 'The 2026 Collection',
      blurb:
        'Seating, tables, beds and lighting specified to hospitality standard, then finished for private residences.',
      links: [
        { label: 'Living & Lounge', to: '/collections?category=living', note: 'Sectionals, Swivel Chairs & Credenzas' },
        { label: 'Dining', to: '/collections?category=dining', note: 'Monolithic Tables & Dining Chairs' },
        { label: 'Bedroom', to: '/collections?category=sleep', note: 'Platform Beds & Headboard Walls' },
        { label: 'Lighting', to: '/collections?category=lighting', note: 'Chandeliers, Sconces & Linear Profiles' },
      ],
      image:
        'https://images.pexels.com/photos/20285351/pexels-photo-20285351.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800',
      caption: 'Eight Signature Pieces · Finishes Available to Sample',
    },
  },
  {
    name: 'Virtual Tour',
    path: '/virtual-tour',
    panel: {
      heading: 'Walk Through Completed Projects',
      blurb:
        'Three fully staged interiors you can explore in the browser, with adjustable lighting for every hour of the day.',
      links: [
        { label: 'Marina Atrium', to: '/virtual-tour', note: 'Dubai · 620 m² Reception Hall' },
        { label: 'Lagoon Villa', to: '/virtual-tour', note: 'Maldives · 410 m² Water Suite' },
        { label: 'Clifftop Estate', to: '/virtual-tour', note: 'Bali · 540 m² Terraced Residence' },
      ],
      image:
        'https://images.pexels.com/photos/29000086/pexels-photo-29000086.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800',
      caption: 'Runs In-Browser · No Download Required',
    },
  },
  {
    name: 'Bespoke',
    path: '/bespoke',
    panel: {
      heading: 'Commissions & Specification',
      blurb:
        'Custom scale, rare stone and made-to-measure joinery, delivered with a fixed quotation and a physical sample box.',
      links: [
        { label: 'Start a Commission', to: '/bespoke', note: 'Configure Project Type & Materials' },
        { label: 'Material Library', to: '/bespoke', note: 'Stone, Timber & Textile References' },
        { label: 'Trade & Specification', to: '/contact', note: 'For Architects & Procurement Teams' },
      ],
      image:
        'https://images.pexels.com/photos/14011664/pexels-photo-14011664.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800',
      caption: 'Sample Box Dispatched Within 48 Hours',
    },
  },
  { name: 'Studio', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [muted, setMuted] = useState(true);
  const [hovered, setHovered] = useState<string | null>(null);
  const [panelFor, setPanelFor] = useState<string | null>(null);
  const [clock, setClock] = useState('');
  const closeTimer = useRef<number | null>(null);
  const { pathname } = useLocation();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > prev && y > 260 && !panelFor && !open);
  });

  useEffect(() => {
    const tick = () =>
      setClock(
        new Intl.DateTimeFormat('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Dubai',
        }).format(new Date())
      );
    tick();
    const id = setInterval(tick, 20000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setPanelFor(null);
    setOpen(false);
  }, [pathname]);

  const openPanel = (name: string, has: boolean) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setHovered(name);
    setPanelFor(has ? name : null);
  };

  const scheduleClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      setPanelFor(null);
      setHovered(null);
    }, 160);
  };

  const chime = () => luxuryAudio.playChime(620, 0.09);
  const activePanel = navItems.find((i) => i.name === panelFor)?.panel;

  return (
    <>
      <motion.header
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: hidden ? -130 : 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="fixed top-0 inset-x-0 z-50 pointer-events-none"
        onMouseLeave={scheduleClose}
      >
        {/* ============ TIER 1 · UTILITY RAIL (collapses on scroll) ============ */}
        <AnimatePresence initial={false}>
          {!scrolled && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 36, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="pointer-events-auto overflow-hidden bg-ink text-crystal/75"
            >
              <div className="max-w-7xl mx-auto h-9 px-5 sm:px-8 flex items-center justify-between text-[10.5px]">
                <span className="type-eyebrow text-[9.5px] text-cyan-glow/90 hidden sm:block">
                  Est. 1994 · Hospitality &amp; Residential Interiors
                </span>
                <div className="flex items-center gap-5">
                  <span className="hidden md:flex items-center gap-1.5">
                    <Clock size={11} className="text-teal-glow" />
                    Dubai {clock} · Showroom Open
                  </span>
                  <span className="hidden lg:block text-crystal/45">Dubai · Doha · Paris · Bali</span>
                  <Link to="/contact" className="hover:text-white transition-colors underline-offset-4 hover:underline">
                    Trade Enquiries
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ============ TIER 2 · PRIMARY ANIMATED CONTAINER ============ */}
        <div className="px-3 sm:px-5 pt-3">
          <motion.div
            layout
            transition={{ duration: 0.5, ease: EASE }}
            className={`nav-shell inner-light pointer-events-auto relative mx-auto flex items-center justify-between gap-4 overflow-hidden transition-all duration-500 ${
              scrolled
                ? 'max-w-6xl rounded-full py-2 pl-5 pr-2 glass-strong shadow-lux'
                : 'max-w-7xl rounded-full py-2.5 pl-6 pr-2.5 glass shadow-[0_18px_50px_-30px_rgba(8,74,87,0.5)]'
            }`}
          >
            {/* travelling light sweep */}
            <motion.span
              aria-hidden
              className="absolute inset-y-0 w-1/3 pointer-events-none"
              animate={{ x: ['-120%', '320%'] }}
              transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2.5 }}
              style={{
                background:
                  'linear-gradient(100deg, transparent, rgba(34,211,238,0.14) 45%, rgba(255,255,255,0.25) 55%, transparent)',
              }}
            />

            {/* LOGO */}
            <Link to="/" onClick={chime} className="relative z-10 flex items-center gap-2.5 shrink-0 group">
              <motion.span
                whileHover={{ rotate: 90, scale: 1.06 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="grid place-items-center h-8 w-8 rounded-[10px] bg-gradient-to-br from-teal-deep via-cyan-core to-cyan-glow shadow-[0_8px_20px_-8px_rgba(6,182,212,0.95)]"
              >
                <Gem size={14} className="text-white" />
              </motion.span>
              <span className="flex flex-col leading-none">
                <span className="text-[16px] font-medium tracking-[0.3em] text-ink group-hover:text-teal-deep transition-colors">
                  AURA
                </span>
                <span className="type-eyebrow text-[7.5px] text-slate-cool/45 mt-1 tracking-[0.28em] hidden sm:block">
                  Interiors
                </span>
              </span>
            </Link>

            {/* DESKTOP NAV */}
            <nav className="relative z-10 hidden lg:flex items-center gap-0.5">
              {navItems.map((item) => {
                const isActive =
                  item.path === '/' ? pathname === '/' : pathname.startsWith(item.path);
                const isHover = hovered === item.name;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={chime}
                    onMouseEnter={() => openPanel(item.name, Boolean(item.panel))}
                    className={`relative px-3.5 py-2 rounded-full text-[11.5px] type-label transition-colors duration-300 ${
                      isActive ? 'text-white' : isHover ? 'text-teal-deep' : 'text-slate-cool/85'
                    }`}
                  >
                    {isHover && !isActive && (
                      <motion.span
                        layoutId="navHoverPill"
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                        className="absolute inset-0 rounded-full bg-cyan-core/10 border border-cyan-core/15"
                      />
                    )}
                    {isActive && (
                      <motion.span
                        layoutId="navActivePill"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-deep via-cyan-deep to-cyan-core shadow-[0_10px_24px_-12px_rgba(6,182,212,0.95)]"
                      />
                    )}
                    <span className="relative flex items-center gap-1.5">
                      {item.name}
                      {item.panel && (
                        <motion.span
                          animate={{ rotate: panelFor === item.name ? 180 : 0 }}
                          transition={{ duration: 0.35, ease: EASE }}
                          className={`block h-[3px] w-[3px] rounded-full ${
                            isActive ? 'bg-white/80' : 'bg-cyan-core/70'
                          }`}
                        />
                      )}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* ACTIONS */}
            <div className="relative z-10 flex items-center gap-2 shrink-0">
              <button
                onClick={() => setMuted(luxuryAudio.toggleMute())}
                aria-label="Toggle ambient sound"
                className="h-9 w-9 grid place-items-center rounded-full border border-cyan-core/20 bg-white/70 text-slate-cool hover:text-teal-deep hover:border-cyan-core/55 hover:scale-105 active:scale-95 transition-all"
              >
                {muted ? <VolumeX size={14} /> : <Volume2 size={14} className="text-cyan-core" />}
              </button>

              <Link
                to="/contact"
                onClick={chime}
                className="relative hidden sm:inline-flex items-center gap-2 overflow-hidden rounded-full px-5 py-2.5 text-[10.5px] type-eyebrow text-white bg-ink hover:bg-teal-deep transition-colors group shimmer"
              >
                <span className="relative z-10">Book an Appointment</span>
                <ArrowRight size={12} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              </Link>

              <button
                onClick={() => {
                  luxuryAudio.playChime(520, 0.09);
                  setOpen((o) => !o);
                }}
                aria-label="Open menu"
                className="lg:hidden h-9 w-9 grid place-items-center rounded-full border border-cyan-core/25 bg-white/75 text-ink"
              >
                {open ? <X size={17} /> : <Menu size={17} />}
              </button>
            </div>
          </motion.div>
        </div>

        {/* ============ TIER 3 · ANIMATED MEGA PANEL ============ */}
        <AnimatePresence>
          {activePanel && (
            <motion.div
              initial={{ opacity: 0, y: -14, scale: 0.985, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, scale: 0.99, filter: 'blur(6px)' }}
              transition={{ duration: 0.42, ease: EASE }}
              onMouseEnter={() => {
                if (closeTimer.current) window.clearTimeout(closeTimer.current);
              }}
              onMouseLeave={scheduleClose}
              className="pointer-events-auto px-3 sm:px-5 pt-2.5 hidden lg:block"
            >
              <div className="inner-light relative mx-auto max-w-6xl rounded-[26px] glass-strong shadow-lux overflow-hidden">
                <div className="absolute -top-24 right-24 w-80 h-80 rounded-full bg-cyan-glow/20 blur-[100px] pointer-events-none animate-aurora" />

                <div className="relative grid grid-cols-12 gap-8 p-7">
                  {/* copy column */}
                  <div className="col-span-4 pr-6 border-r border-cyan-core/12">
                    <span className="type-eyebrow text-[9.5px] text-teal-deep">Overview</span>
                    {/* section intro */}
                    <div className="rule-accent w-14 mt-2.5 mb-4" />
                    <h3 className="type-title text-[19px] text-ink">{activePanel.heading}</h3>
                    <p className="type-body text-[12.5px] text-slate-cool/75 mt-3">{activePanel.blurb}</p>
                  </div>

                  {/* links column */}
                  <div className="col-span-5 space-y-1">
                    {activePanel.links.map((l, i) => (
                      <motion.div
                        key={l.label}
                        initial={{ opacity: 0, x: -14 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.06 + i * 0.055, duration: 0.45, ease: EASE }}
                      >
                        <Link
                          to={l.to}
                          onClick={chime}
                          className="group flex items-center justify-between gap-4 rounded-2xl px-4 py-3 hover:bg-white transition-colors"
                        >
                          <span>
                            <span className="block text-[13.5px] type-label text-ink group-hover:text-teal-deep transition-colors">
                              {l.label}
                            </span>
                            <span className="block text-[11px] text-slate-cool/60 mt-0.5">{l.note}</span>
                          </span>
                          <ArrowUpRight
                            size={15}
                            className="text-cyan-core opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0"
                          />
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  {/* image column */}
                  <motion.div
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="col-span-3 relative rounded-2xl overflow-hidden min-h-[180px]"
                  >
                    <img src={activePanel.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-abyss/90 via-abyss/10 to-transparent" />
                    <span className="absolute bottom-3 inset-x-3 text-[10.5px] text-crystal/85 leading-snug">
                      {activePanel.caption}
                    </span>
                  </motion.div>
                </div>

                {/* footer strip */}
                <div className="relative border-t border-cyan-core/12 bg-white/45 px-7 py-3 flex items-center justify-between text-[11px]">
                  <span className="text-slate-cool/65">
                    Every piece is available to view in person before you commit.
                  </span>
                  <Link
                    to="/contact"
                    onClick={chime}
                    className="inline-flex items-center gap-1.5 type-eyebrow text-[9.5px] text-teal-deep hover:text-cyan-deep transition-colors group"
                  >
                    Arrange a Viewing
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ============ MOBILE MENU ============ */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, clipPath: 'circle(0% at 92% 5%)' }}
            animate={{ opacity: 1, clipPath: 'circle(145% at 92% 5%)' }}
            exit={{ opacity: 0, clipPath: 'circle(0% at 92% 5%)' }}
            transition={{ duration: 0.65, ease: EASE }}
            className="fixed inset-0 z-40 lg:hidden bg-frost/97 backdrop-blur-2xl px-6 pt-28 pb-10 flex flex-col overflow-y-auto"
          >
            <span className="type-eyebrow text-[9.5px] text-teal-deep">Menu</span>
            <div className="rule-accent w-16 mt-2.5 mb-5" />

            <div className="flex-1 space-y-1">
              {navItems.map((item, i) => {
                const isActive = item.path === '/' ? pathname === '/' : pathname.startsWith(item.path);
                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -22 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.06, duration: 0.55, ease: EASE }}
                  >
                    <Link
                      to={item.path}
                      onClick={chime}
                      className="flex items-center justify-between py-3.5 border-b border-cyan-core/12"
                    >
                      <span>
                        <span
                          className={`block text-[22px] type-sub ${
                            isActive ? 'text-gradient' : 'text-ink'
                          }`}
                        >
                          {item.name}
                        </span>
                        {item.panel && (
                          <span className="block text-[11px] text-slate-cool/55 mt-0.5">
                            {item.panel.heading}
                          </span>
                        )}
                      </span>
                      <ArrowRight size={17} className="text-cyan-core shrink-0" />
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, ease: EASE }}
              className="pt-8 space-y-4"
            >
              <div className="flex items-center justify-between text-[10.5px] text-slate-cool/65">
                <span className="flex items-center gap-1.5">
                  <Clock size={11} className="text-teal-core" /> Dubai {clock}
                </span>
                <span>Dubai · Doha · Paris · Bali</span>
              </div>
              <Link
                to="/contact"
                onClick={chime}
                className="block text-center py-3.5 rounded-full bg-gradient-to-r from-teal-deep to-cyan-core text-white text-[10.5px] type-eyebrow shadow-lux"
              >
                Book an Appointment
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
