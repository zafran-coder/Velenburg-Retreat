import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Sparkles, Eye } from 'lucide-react';

export interface Hotspot {
  id: string;
  title: string;
  description: string;
  x: number; // percentage from left
  y: number; // percentage from top
}

interface AnnotatedSuiteProps {
  imageSrc: string;
  imageAlt: string;
  hotspots: Hotspot[];
  title?: string;
  subtitle?: string;
  onInspectSuite?: () => void;
}

export default function AnnotatedSuitePin({
  imageSrc,
  imageAlt,
  hotspots,
  title = 'Interactive Suite Features',
  subtitle = 'Tap the hotspot pins (+) to explore in-room luxury details & amenities',
  onInspectSuite,
}: AnnotatedSuiteProps) {
  const [activePin, setActivePin] = useState<string | null>(null);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 shadow-md bg-charcoal group">
      {/* Header Bar */}
      <div className="absolute top-4 inset-x-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="glass px-4 py-1.5 rounded-full border border-gold/30 backdrop-blur-md">
          <span className="text-xs text-charcoal font-semibold tracking-[0.2em] uppercase flex items-center gap-1.5">
            <Sparkles size={11} className="text-gold" />
            {title}
          </span>
        </div>
        <div className="hidden sm:block text-xs text-slate-200 bg-charcoal/70 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
          {subtitle}
        </div>
      </div>

      {/* Main Image */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        />

        {/* Ambient Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-charcoal/20 pointer-events-none" />

        {/* Hotspot Pins */}
        {hotspots.map((spot) => {
          const isActive = activePin === spot.id;

          return (
            <div
              key={spot.id}
              className="absolute z-20"
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
            >
              {/* Hotspot Button */}
              <button
                onClick={() => setActivePin(isActive ? null : spot.id)}
                className={`relative h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2 transition-all duration-300 shadow-xl ${
                  isActive
                    ? 'bg-gold text-charcoal scale-110 ring-4 ring-gold/40'
                    : 'bg-white/90 text-charcoal hover:bg-gold hover:text-white'
                }`}
                aria-label={spot.title}
              >
                {/* Subtle Luxury Ring */}
                {!isActive && (
                  <span className="absolute inset-0 rounded-full bg-gold/15 ring-1 ring-gold/40" />
                )}
                {isActive ? <X size={15} /> : <Plus size={16} className="font-bold" />}
              </button>

              {/* Popover Card */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    transition={{ duration: 0.25 }}
                    className="absolute z-30 bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 sm:w-72 bg-white text-charcoal rounded-2xl p-4 shadow-2xl border border-gold/40 pointer-events-auto"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-charcoal tracking-tight">
                        {spot.title}
                      </h4>
                      <button
                        onClick={() => setActivePin(null)}
                        className="text-slate-400 hover:text-charcoal p-0.5"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {spot.description}
                    </p>
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-gold-dark font-medium">
                      <span>Velenburg Luxury Spec</span>
                      <span className="text-slate-400">Included</span>
                    </div>

                    {/* Popover Arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-3 h-3 bg-white border-r border-b border-gold/40 rotate-45" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Bottom Caption Strip */}
      <div className="px-5 py-3.5 bg-charcoal text-alabaster/90 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-white/10">
        <span className="text-gold-light font-medium flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-gold inline-block" />
          Uniform luxury fittings across all 4 suites
        </span>

        <div className="flex items-center gap-3">
          <span className="text-alabaster/60 text-[11px] hidden md:inline">
            Self-service electric kettle & toiletries in every room · No hotel meals/dinner
          </span>

          {onInspectSuite && (
            <button
              type="button"
              onClick={onInspectSuite}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#B48A3E] hover:bg-[#C9A257] text-[#0F172A] text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
            >
              <Eye size={13} />
              <span>View Full Suite Details</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
