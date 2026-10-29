import { motion } from 'framer-motion';
import { ArrowUpRight, BedDouble, Mountain, Star } from 'lucide-react';
import { RETREAT_CONFIG } from '../data/retreatConfig';
import { InstagramIcon } from './InstagramIcon';

export default function InstagramHighlights() {
  const icons = [BedDouble, Mountain, Star];

  return (
    <section className="relative py-16 md:py-24 bg-alabaster border-y border-gold/15 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-[#B48A3E] font-semibold text-xs tracking-[0.2em] uppercase mb-2">
              <InstagramIcon size={14} className="text-[#B48A3E]" />
              <span>Official Instagram · {RETREAT_CONFIG.contact.instagramHandle}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold leading-[1.2] text-[#0F172A]">
              Stories from Gharial Camp, Murree
            </h2>
            <p className="text-base font-normal leading-relaxed text-slate-600 mt-3 max-w-2xl">
              Follow our official profile for daily mountain fog views, suite walkthroughs, and genuine guest testimonials.
            </p>
          </div>

          <a
            href={RETREAT_CONFIG.contact.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center gap-2 self-start md:self-auto group cursor-pointer"
          >
            <span>Follow {RETREAT_CONFIG.contact.instagramHandle}</span>
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* The 3 Instagram Highlights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {RETREAT_CONFIG.instagramHighlights.map((highlight, index) => {
            const IconComponent = icons[index % icons.length];

            return (
              <a
                key={highlight.title}
                href={RETREAT_CONFIG.contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-2xl overflow-hidden bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-[#B48A3E]/60 transition-all duration-300 flex flex-col justify-between h-full cursor-pointer"
              >
                {/* Image Cover */}
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={highlight.image}
                    alt={highlight.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />

                  {/* Highlight Story Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-charcoal/80 backdrop-blur-md px-3 py-1 rounded-full border border-gold/30 text-white text-[11px] font-medium">
                    <IconComponent size={12} className="text-gold-light" />
                    <span>Highlight</span>
                  </div>

                  {/* Tag badge */}
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 rounded-md text-[10px] font-semibold text-charcoal uppercase tracking-wider">
                    {highlight.tag}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold leading-snug text-[#0F172A] group-hover:text-[#B48A3E] transition-colors flex items-center justify-between">
                      <span>{highlight.title}</span>
                      <InstagramIcon size={16} className="text-slate-300 group-hover:text-[#B48A3E] transition-colors" />
                    </h3>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed font-normal">
                      {highlight.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#B48A3E] font-medium">
                    <span>View on Instagram</span>
                    <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
