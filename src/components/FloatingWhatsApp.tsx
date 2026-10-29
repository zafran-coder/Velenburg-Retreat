import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { RETREAT_CONFIG } from '../data/retreatConfig';

export default function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(false);

  const whatsappUrl = `https://wa.me/${RETREAT_CONFIG.contact.ownerWhatsApp}?text=Assalam-o-Alaikum%20Velenburg%20Retreat!%20🌲%0A%0AI%20am%20interested%20in%20reserving%20a%20luxury%20suite%20at%20Gharial%20Camp,%20Murree%20(PKR%2018,000%20/%20Night).%20Please%20share%20available%20dates.`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3 select-none">
      {/* Tooltip Dialog */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="hidden sm:block bg-charcoal text-alabaster rounded-2xl p-4 shadow-2xl border border-gold/30 max-w-xs mb-2 relative"
          >
            <button
              onClick={() => setShowTooltip(false)}
              className="absolute top-2 right-2 text-alabaster/60 hover:text-white"
            >
              <X size={14} />
            </button>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/25" />
              <p className="text-xs font-semibold text-gold-light uppercase tracking-wider">
                Velenburg Retreat Murree
              </p>
            </div>
            <p className="text-xs text-alabaster/85 leading-relaxed">
              Assalam-o-Alaikum! Looking to book one of our 4 luxury mountain suites? Chat directly with us on WhatsApp.
            </p>
            <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-alabaster/70">
              <span>{RETREAT_CONFIG.contact.displayPhone}</span>
              <span className="text-emerald-400 font-medium">Host Online</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        className="relative group flex items-center justify-center h-14 w-14 rounded-full bg-[#25D366] text-white shadow-[0_10px_25px_-5px_rgba(37,211,102,0.5)] hover:bg-[#20bd5a] hover:shadow-[0_12px_32px_-4px_rgba(37,211,102,0.65)] hover:scale-105 active:scale-95 transition-all focus:outline-none"
        aria-label="Chat with Velenburg Retreat on WhatsApp"
      >
        <MessageCircle size={28} className="fill-white text-white drop-shadow-sm" />

        {/* Small Notification Dot */}
        <span className="absolute top-0 right-0 h-3.5 w-3.5 rounded-full bg-gold border-2 border-charcoal shadow-sm" />
      </a>
    </div>
  );
}
