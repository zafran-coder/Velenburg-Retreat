import { Outlet, Link, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import { ArrowUpRight, ShieldCheck, Sparkles, Gem, Globe, Compass } from 'lucide-react';
import Navbar, { navItems } from './Navbar';
import { ScrollProgress } from './ui';
import { luxuryAudio } from '../utils/audio';

const salons = [
  { city: 'Dubai', note: 'Sheikh Zayed Road · Daily 10:00–23:00' },
  { city: 'Doha', note: 'West Bay Lagoon · Daily 10:00–22:00' },
  { city: 'Paris', note: 'Place Vendôme · Mon–Sat 10:00–19:30' },
  { city: 'Bali', note: 'Uluwatu · Daily 09:00–21:00' },
];

export default function Layout() {
  const { pathname } = useLocation();
  const click = () => {
    luxuryAudio.playChime(620, 0.09);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-frost text-ink">
      <ScrollProgress />
      <Navbar />

      <main className="flex-grow flex flex-col">
        <AnimatePresence mode="wait">
          <Outlet key={pathname} />
        </AnimatePresence>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="relative mt-24 bg-abyss text-crystal overflow-hidden">
        {/* animated top hairline */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-glow to-transparent opacity-70" />
        {/* glow orbs */}
        <div className="pointer-events-none absolute -top-32 right-0 w-[520px] h-[520px] rounded-full bg-teal-core/20 blur-[130px] animate-aurora" />
        <div
          className="pointer-events-none absolute bottom-0 -left-24 w-[480px] h-[480px] rounded-full bg-cyan-deep/25 blur-[130px] animate-aurora"
          style={{ animationDelay: '-8s' }}
        />
        <div className="absolute inset-0 grid-lines opacity-25" />

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-10">
          {/* CTA ROW */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-14 border-b border-cyan-glow/10">
            <div className="lg:col-span-5">
              <Link to="/" onClick={click} className="flex items-center gap-3 group w-fit">
                <span className="grid place-items-center h-10 w-10 rounded-xl bg-gradient-to-br from-teal-core via-cyan-core to-cyan-glow shadow-[0_10px_30px_-10px_rgba(34,211,238,0.9)] group-hover:rotate-90 transition-transform duration-700">
                  <Gem size={18} className="text-white" />
                </span>
                <span className="text-2xl font-semibold tracking-[0.3em] text-white">AURA</span>
              </Link>
              <p className="type-body mt-5 text-[13.5px] text-crystal/60 max-w-sm">
                A furniture and interiors studio working with hotels, developers and private clients.
                Established in 1994, with ateliers in Italy and Japan and an installation team that
                travels worldwide.
              </p>
              <div className="mt-7 flex items-center gap-3">
                {[Globe, Compass, Sparkles].map((Icon, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    whileHover={{ y: -4, scale: 1.06 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                    className="h-10 w-10 grid place-items-center rounded-full border border-cyan-glow/20 text-crystal/70 hover:text-white hover:border-cyan-glow/60 hover:bg-cyan-core/10 transition-colors"
                  >
                    <Icon size={15} />
                  </motion.a>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3">
              <h4 className="type-eyebrow text-[9.5px] text-cyan-glow mb-5">Site</h4>
              <ul className="space-y-3 text-[13px] text-crystal/70">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={click}
                      className="group inline-flex items-center gap-1.5 hover:text-white transition-colors"
                    >
                      <span className="h-px w-0 bg-cyan-glow group-hover:w-4 transition-all duration-300" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-4">
              <h4 className="type-eyebrow text-[9.5px] text-cyan-glow mb-5">Showrooms</h4>
              <div className="grid grid-cols-2 gap-4 text-[12px]">
                {salons.map((s) => (
                  <div key={s.city} className="group">
                    <span className="block text-white font-medium group-hover:text-cyan-glow transition-colors">
                      {s.city}
                    </span>
                    <span className="block text-crystal/50 text-[11px] mt-0.5">{s.note}</span>
                  </div>
                ))}
              </div>
              <Link
                to="/contact"
                onClick={click}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white text-ink px-5 py-2.5 text-[10px] type-eyebrow hover:bg-cyan-glow transition-colors group"
              >
                Book an Appointment
                <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* BOTTOM ROW */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-crystal/45">
            <span>© 2026 AURA Interiors Ltd. All rights reserved.</span>
            <div className="flex flex-wrap items-center justify-center gap-5">
              <span className="flex items-center gap-1.5 text-crystal/65">
                <ShieldCheck size={13} className="text-teal-glow" /> FSC-certified timber
              </span>
              <span className="flex items-center gap-1.5 text-crystal/65">
                <Sparkles size={13} className="text-cyan-glow" /> Ten-year structural warranty
              </span>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
