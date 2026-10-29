import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X, Volume2, VolumeX, ArrowRight, MessageCircle, BedDouble, Trees, Mountain } from 'lucide-react';
import { luxuryAudio } from '../utils/audio';
import { RETREAT_CONFIG } from '../data/retreatConfig';
import { ROOMS_DATA } from '../data/roomsData';
import { navItems } from '../data/navigation';
import TopWeatherBar from './TopWeatherBar';

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [muted, setMuted] = useState(true);
  const [hovered, setHovered] = useState<string | null>(null);
  const [panelFor, setPanelFor] = useState<string | null>(null);
  const closeTimer = useRef<number | null>(null);
  const { pathname } = useLocation();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 20);
    setHidden(y > prev && y > 240 && !panelFor && !open);
  });

  useEffect(() => {
    setPanelFor(null);
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

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

  const whatsappDirectUrl = `https://wa.me/${RETREAT_CONFIG.contact.ownerWhatsApp}?text=Assalam-o-Alaikum%20Velenburg%20Retreat!%20I%20would%20like%20to%20reserve%20a%20luxury%20suite%20at%20Gharial%20Camp,%20Murree%20(PKR%2018,000%20/%20Night).`;

  return (
    <>
      <motion.header
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: hidden ? -140 : 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="fixed top-0 inset-x-0 z-50 pointer-events-none"
        onMouseLeave={scheduleClose}
      >
        {/* Top Live Mountain Weather & Contact Bar (hides smoothly on scroll) */}
        <AnimatePresence>
          {!scrolled && (
            <motion.div
              initial={{ y: 0, opacity: 1, height: 'auto' }}
              animate={{ y: 0, opacity: 1, height: 'auto' }}
              exit={{ y: -40, opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="pointer-events-auto"
            >
              <TopWeatherBar />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Luxury Pill Navbar (never cut off, perfectly positioned) */}
        <div className={`px-2.5 sm:px-6 pointer-events-none transition-all duration-300 ${scrolled ? 'pt-2.5 sm:pt-3.5' : 'pt-2 sm:pt-2.5'}`}>
          <motion.div
            layout
            transition={{ duration: 0.4, ease: EASE }}
            className={`nav-shell inner-light pointer-events-auto relative mx-auto flex items-center justify-between gap-2 sm:gap-4 overflow-hidden transition-all duration-500 ${
              scrolled
                ? 'max-w-6xl rounded-full py-2 pl-3.5 sm:pl-5 pr-2 glass-strong shadow-card'
                : 'max-w-7xl rounded-full py-2 sm:py-2.5 pl-4 sm:pl-6 pr-2 sm:pr-2.5 glass shadow-sm'
            }`}
          >
            {/* LOGO: Velenburg Retreat */}
            <Link to="/" onClick={chime} className="relative z-10 flex items-center gap-2 sm:gap-3 shrink-0 group">
              <motion.span
                whileHover={{ rotate: 12, scale: 1.05 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="grid place-items-center h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-gradient-to-br from-charcoal via-slate-800 to-charcoal border border-gold/40 shadow-sm"
              >
                <Mountain size={14} className="text-gold-light sm:hidden" />
                <Mountain size={16} className="text-gold-light hidden sm:block" />
              </motion.span>
              <span className="flex flex-col leading-none">
                <span className="text-[13px] sm:text-[15px] font-bold tracking-[0.16em] sm:tracking-[0.2em] text-charcoal group-hover:text-gold-dark transition-colors">
                  VELENBURG
                </span>
                <span className="type-eyebrow text-[6.5px] sm:text-[7.5px] text-slate-500 mt-0.5 tracking-[0.22em] sm:tracking-[0.25em]">
                  RETREAT · MURREE
                </span>
              </span>
            </Link>

            {/* DESKTOP NAV */}
            <nav className="relative z-10 hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = item.path === '/' ? pathname === '/' : pathname.startsWith(item.path);
                const isHover = hovered === item.name;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={chime}
                    onMouseEnter={() => openPanel(item.name, Boolean(item.panel))}
                    className={`relative px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-colors duration-300 ${
                      isActive ? 'text-white' : isHover ? 'text-gold-dark' : 'text-charcoal/80'
                    }`}
                  >
                    {isHover && !isActive && (
                      <motion.span
                        layoutId="navHoverPill"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        className="absolute inset-0 rounded-full bg-gold/10 border border-gold/25"
                      />
                    )}
                    {isActive && (
                      <motion.span
                        layoutId="navActivePill"
                        transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                        className="absolute inset-0 rounded-full bg-charcoal text-white shadow-md border border-gold/40"
                      />
                    )}
                    <span className="relative flex items-center gap-1.5">
                      {item.name}
                      {item.panel && (
                        <motion.span
                          animate={{ rotate: panelFor === item.name ? 180 : 0 }}
                          transition={{ duration: 0.3, ease: EASE }}
                          className={`block h-1 w-1 rounded-full ${isActive ? 'bg-gold-light' : 'bg-gold'}`}
                        />
                      )}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* ACTIONS */}
            <div className="relative z-10 flex items-center gap-2.5 shrink-0">
              {/* Sound chime button */}
              <button
                onClick={() => setMuted(luxuryAudio.toggleMute())}
                aria-label="Toggle mountain sound"
                className="h-9 w-9 grid place-items-center rounded-full border border-gold/30 bg-white/80 text-charcoal hover:text-gold-dark hover:border-gold hover:scale-105 active:scale-95 transition-all shadow-sm"
              >
                {muted ? <VolumeX size={14} /> : <Volume2 size={14} className="text-gold-dark" />}
              </button>

              {/* Book via WhatsApp Button */}
              <a
                href={whatsappDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={chime}
                className="relative hidden sm:inline-flex items-center gap-2 overflow-hidden rounded-full px-5 py-2.5 text-[10px] uppercase tracking-wider font-bold text-white bg-charcoal hover:bg-gold-dark transition-all border border-gold/40 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 group cursor-pointer"
              >
                <MessageCircle size={13} className="fill-[#25D366] text-[#25D366]" />
                <span className="relative z-10">Book via WhatsApp</span>
                <ArrowRight size={12} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              </a>

              {/* Mobile Menu Button */}
              <button
                onClick={() => {
                  luxuryAudio.playChime(520, 0.09);
                  setOpen((o) => !o);
                }}
                aria-label="Open menu"
                className="lg:hidden h-9 w-9 grid place-items-center rounded-full border border-gold/30 bg-white/85 text-charcoal"
              >
                {open ? <X size={17} /> : <Menu size={17} />}
              </button>
            </div>
          </motion.div>
        </div>

        {/* MEGA PANEL DROPDOWN */}
        <AnimatePresence>
          {activePanel && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.99 }}
              transition={{ duration: 0.35, ease: EASE }}
              onMouseEnter={() => {
                if (closeTimer.current) window.clearTimeout(closeTimer.current);
              }}
              onMouseLeave={scheduleClose}
              className="pointer-events-auto px-3 sm:px-6 pt-2 hidden lg:block"
            >
              <div className="inner-light relative mx-auto max-w-6xl rounded-3xl glass-strong shadow-2xl border border-gold/30 overflow-hidden">
                <div className="relative grid grid-cols-12 gap-8 p-7">
                  {/* Left Column */}
                  <div className="col-span-4 pr-6 border-r border-gold/20">
                    <span className="type-eyebrow text-[9.5px] text-gold-dark">Velenburg Retreat</span>
                    <h3 className="type-title text-xl text-charcoal mt-2">{activePanel.heading}</h3>
                    <p className="type-body text-xs text-slate-600 mt-2.5 leading-relaxed">
                      {activePanel.blurb}
                    </p>
                    <div className="mt-5 p-3 rounded-xl bg-alabaster border border-gold/25 text-[11px] text-slate-700">
                      <span className="font-semibold text-charcoal block mb-0.5">Note on Meals:</span>
                      Self-use kitchen & electric kettle provided in rooms. No hotel catering or cooked dinner service.
                    </div>
                  </div>

                  {/* Middle Column: Links */}
                  <div className="col-span-5 space-y-1.5">
                    {activePanel.links.map((l, i) => (
                      <Link
                        key={l.label}
                        to={l.to}
                        onClick={chime}
                        className="group flex items-center justify-between gap-4 rounded-xl px-4 py-3 hover:bg-gold/10 transition-colors"
                      >
                        <div>
                          <span className="block text-sm font-semibold text-charcoal group-hover:text-gold-dark transition-colors">
                            {l.label}
                          </span>
                          <span className="block text-xs text-slate-500 mt-0.5">{l.note}</span>
                        </div>
                        <ArrowRight size={14} className="text-gold opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0" />
                      </Link>
                    ))}
                  </div>

                  {/* Right Column: Image Preview */}
                  <div className="col-span-3 relative rounded-2xl overflow-hidden min-h-[190px] border border-gold/20">
                    <img src={activePanel.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-transparent to-transparent" />
                    <span className="absolute bottom-3 inset-x-3 text-[11px] text-alabaster/90 leading-snug">
                      {activePanel.caption}
                    </span>
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gold/20 bg-alabaster/70 px-7 py-3 flex items-center justify-between text-xs text-slate-600">
                  <span>Uniform rate across all 4 luxury suites: <strong>PKR 18,000 / Night</strong></span>
                  <a
                    href={whatsappDirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-semibold text-gold-dark hover:text-charcoal transition-colors"
                  >
                    Direct WhatsApp: {RETREAT_CONFIG.contact.displayPhone}
                    <ArrowRight size={13} />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* MOBILE MENU FULL-SCREEN DRAWER */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, clipPath: 'circle(0% at 92% 5%)' }}
            animate={{ opacity: 1, clipPath: 'circle(145% at 92% 5%)' }}
            exit={{ opacity: 0, clipPath: 'circle(0% at 92% 5%)' }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed inset-0 z-[60] lg:hidden bg-[#FAF9F6]/98 backdrop-blur-3xl px-5 sm:px-6 pt-5 pb-8 flex flex-col justify-between overflow-y-auto"
          >
            {/* Top Bar with Brand & Direct Close Button */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gold/20">
                <div className="flex items-center gap-2.5">
                  <span className="grid place-items-center h-8 w-8 rounded-xl bg-charcoal border border-gold/40 shadow-xs">
                    <Mountain size={14} className="text-gold-light" />
                  </span>
                  <div>
                    <span className="block text-sm font-bold tracking-[0.18em] text-charcoal">VELENBURG</span>
                    <span className="block text-[8px] uppercase tracking-[0.25em] text-slate-500">Gharial Camp, Murree</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    luxuryAudio.playChime(500, 0.08);
                    setOpen(false);
                  }}
                  aria-label="Close menu"
                  className="h-10 w-10 rounded-full bg-charcoal/5 hover:bg-gold/20 text-charcoal flex items-center justify-center transition-colors cursor-pointer border border-charcoal/10"
                >
                  <X size={19} />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="space-y-1 mt-3">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => {
                      chime();
                      setOpen(false);
                    }}
                    className="flex items-center justify-between py-3 px-3 rounded-2xl hover:bg-gold/10 transition-colors border-b border-charcoal/5 group"
                  >
                    <span className="text-base sm:text-lg font-semibold text-charcoal group-hover:text-gold-dark transition-colors">
                      {item.name}
                    </span>
                    <ArrowRight size={16} className="text-gold group-hover:translate-x-1 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Bottom Actions & Policy */}
            <div className="pt-6 border-t border-gold/20 space-y-3 mt-6">
              <div className="p-3.5 rounded-2xl bg-white border border-gold/25 shadow-xs text-xs text-slate-600 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-charcoal">4 Uniform Luxury Suites</span>
                  <span className="text-gold-dark font-bold">PKR 18,000 / Night</span>
                </div>
                <span className="block text-[11px] text-slate-500">
                  Check-in: {RETREAT_CONFIG.timings.checkIn} | Check-out: {RETREAT_CONFIG.timings.checkOut}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={`tel:${RETREAT_CONFIG.contact.displayPhone.replace(/\s+/g, '')}`}
                  className="flex items-center justify-center gap-2 py-3 rounded-full border border-charcoal/20 bg-white text-charcoal font-semibold text-xs tracking-wider uppercase shadow-xs hover:bg-gold/10 transition-colors"
                >
                  <span>Call Host</span>
                </a>

                <a
                  href={RETREAT_CONFIG.contact.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 rounded-full border border-gold/30 bg-white text-gold-dark font-semibold text-xs tracking-wider uppercase shadow-xs hover:bg-gold/10 transition-colors"
                >
                  <span>@velenburg</span>
                </a>
              </div>

              <a
                href={whatsappDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
              >
                <MessageCircle size={16} className="fill-white" />
                <span>Book via WhatsApp ({RETREAT_CONFIG.contact.displayPhone})</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
