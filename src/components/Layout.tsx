import { Outlet, Link, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ShieldCheck, Mountain, MessageCircle, MapPin, CheckCircle2 } from 'lucide-react';
import Navbar from './Navbar';
import { navItems } from '../data/navigation';
import FloatingWhatsApp from './FloatingWhatsApp';
import { InstagramIcon } from './InstagramIcon';
import { ScrollProgress } from './ui';
import { luxuryAudio } from '../utils/audio';
import { RETREAT_CONFIG } from '../data/retreatConfig';

export default function Layout() {
  const { pathname } = useLocation();

  const click = () => {
    luxuryAudio.playChime(620, 0.09);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappUrl = `https://wa.me/${RETREAT_CONFIG.contact.ownerWhatsApp}?text=Assalam-o-Alaikum%20Velenburg%20Retreat!%20🌲%0AI%20would%20like%20to%20inquire%20about%20suite%20availability%20at%20Gharial%20Camp,%20Murree.`;

  return (
    <div className="relative min-h-screen flex flex-col bg-alabaster text-charcoal font-sans selection:bg-gold/25 selection:text-charcoal">
      <ScrollProgress />
      {/* Unified Fixed Luxury Header (includes Top Weather Bar & Floating Navbar) */}
      <Navbar />

      <main className="flex-grow flex flex-col">
        <AnimatePresence mode="wait">
          <Outlet key={pathname} />
        </AnimatePresence>
      </main>

      {/* Floating WhatsApp Action Button (Persistent on all pages) */}
      <FloatingWhatsApp />

      {/* ================= FOOTER ================= */}
      <footer className="relative mt-20 bg-charcoal text-alabaster overflow-hidden border-t border-gold/30">
        {/* Animated Gold Hairline */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-60" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
            {/* Col 1: Brand Info */}
            <div className="lg:col-span-5">
              <Link to="/" onClick={click} className="flex items-center gap-3 group w-fit">
                <span className="grid place-items-center h-10 w-10 rounded-xl bg-gradient-to-br from-charcoal via-slate-800 to-charcoal border border-gold/40 shadow-sm group-hover:rotate-12 transition-transform duration-500">
                  <Mountain size={18} className="text-gold-light" />
                </span>
                <div>
                  <span className="text-xl font-bold tracking-[0.2em] text-white">
                    VELENBURG
                  </span>
                  <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#DFBF77]">
                    RETREAT · GHARIAL, MURREE
                  </span>
                </div>
              </Link>

              <p className="type-body mt-4 text-xs text-alabaster/70 max-w-sm leading-relaxed">
                {RETREAT_CONFIG.heroBioTagline}
              </p>
              <p className="text-xs text-alabaster/55 mt-2">
                Four exclusive luxury mountain suites surrounded by pine forests, valley views, and pure tranquility at 7,200 ft elevation.
              </p>

              {/* Social & Contact Pills */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href={RETREAT_CONFIG.contact.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-gold/30 px-3.5 py-1.5 text-xs text-alabaster hover:text-gold-light hover:border-gold transition-colors bg-white/5"
                >
                  <InstagramIcon size={14} className="text-gold" />
                  <span>{RETREAT_CONFIG.contact.instagramHandle}</span>
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 px-3.5 py-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors bg-white/5"
                >
                  <MessageCircle size={14} className="fill-emerald-400 text-emerald-400" />
                  <span>{RETREAT_CONFIG.contact.displayPhone}</span>
                </a>
              </div>
            </div>

            {/* Col 2: Navigation Links */}
            <div className="lg:col-span-3">
              <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#DFBF77] mb-4">Explore Retreat</h4>
              <ul className="space-y-2.5 text-xs text-alabaster/70">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={click}
                      className="group inline-flex items-center gap-1.5 hover:text-gold-light transition-colors"
                    >
                      <span className="h-px w-0 bg-gold group-hover:w-3 transition-all duration-300" />
                      {item.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <a
                    href={RETREAT_CONFIG.contact.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 hover:text-gold-light transition-colors text-gold/90 font-medium"
                  >
                    <span className="h-px w-0 bg-gold group-hover:w-3 transition-all duration-300" />
                    Instagram Stories (@velenburg)
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Policy & Highlights */}
            <div className="lg:col-span-4">
              <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#DFBF77] mb-4">Stay & Amenities Policy</h4>
              <div className="p-4 rounded-2xl bg-white/5 border border-gold/20 text-xs text-alabaster/75 space-y-2.5">
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-gold shrink-0 mt-0.5" />
                  <span><strong>Rate:</strong> PKR 18,000 / Night across all 4 luxury suites.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-gold shrink-0 mt-0.5" />
                  <span><strong>Included In-Suite:</strong> Electric kettle, Tapal Green Tea sachets & Velenburg branded luxury toiletries tray.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-gold shrink-0 mt-0.5" />
                  <span><strong>Dining Note:</strong> Self-use kitchen and lounge available. No hotel dinner, lunch, or arrival refreshments.</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-alabaster/60">
                <MapPin size={13} className="text-gold" />
                <span>{RETREAT_CONFIG.location.displayAddress}</span>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Strip */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-alabaster/50">
            <span>© {new Date().getFullYear()} Velenburg Retreat. All rights reserved. Gharial Camp, Upper Topa, Murree.</span>
            <div className="flex items-center gap-5">
              <span className="flex items-center gap-1.5 text-alabaster/70">
                <ShieldCheck size={13} className="text-gold" /> Direct WhatsApp Booking (No Card Gateway)
              </span>
              <Link to="/admin" onClick={click} className="hover:text-gold-light transition-colors text-alabaster/40 hover:text-alabaster/80">
                Owner Portal (iCal)
              </Link>
              <a
                href={RETREAT_CONFIG.contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold-light transition-colors"
              >
                @velenburg
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
