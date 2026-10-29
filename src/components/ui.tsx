import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Reveal as RevealBase } from './Transitions';
import {
  motion,
  useScroll,
  useSpring,
  useMotionValue,
  useTransform,
  useInView,
  animate,
} from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;

/* ================= TOP SCROLL PROGRESS BAR ================= */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[60] bg-gradient-to-r from-gold via-gold-light to-gold shadow-[0_0_14px_rgba(197,160,89,0.8)]"
    />
  );
}

/* ================= ANIMATED AURORA / GRID BACKGROUND ================= */
export function AuroraBackground({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const isDark = variant === 'dark';
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* animated aurora orbs */}
      <div
        className={`absolute -top-40 -left-32 w-[520px] h-[520px] rounded-full blur-[130px] animate-aurora ${
          isDark ? 'bg-gold/15' : 'bg-gold/10'
        }`}
      />
      <div
        className={`absolute top-1/3 -right-40 w-[560px] h-[560px] rounded-full blur-[140px] animate-aurora ${
          isDark ? 'bg-charcoal/40' : 'bg-gold-light/15'
        }`}
        style={{ animationDelay: '-6s' }}
      />
      <div
        className={`absolute -bottom-52 left-1/4 w-[500px] h-[500px] rounded-full blur-[135px] animate-aurora ${
          isDark ? 'bg-gold/10' : 'bg-amber-50/40'
        }`}
        style={{ animationDelay: '-12s' }}
      />
      {/* drifting architectural grid */}
      <div className={`absolute inset-0 grid-lines ${isDark ? 'opacity-30' : 'opacity-60'}`} />
      {/* soft vignette */}
      <div
        className={`absolute inset-0 ${
          isDark
            ? 'bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(15,23,42,0.85)_100%)]'
            : 'bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(250,249,246,0.9)_100%)]'
        }`}
      />
    </div>
  );
}

/* ================= COUNT UP STAT ================= */
export function CountUp({
  to,
  suffix = '',
  prefix = '',
  duration = 1.8,
  decimals = 0,
  className = '',
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px' });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [inView, to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* ================= MAGNETIC BUTTON ================= */
export function MagneticButton({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  return (
    <div className={`inline-block ${className}`}>
      {children}
    </div>
  );
}

/* ================= MARQUEE TICKER ================= */
export function Marquee({ items, dark = false }: { items: string[]; dark?: boolean }) {
  const loop = [...items, ...items];
  return (
    <div
      className={`relative overflow-hidden border-y ${
        dark ? 'border-gold/20 bg-charcoal' : 'border-gold/20 bg-white/70'
      } py-4`}
    >
      <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap">
        {loop.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className={`flex items-center gap-10 text-[11px] type-eyebrow ${
              dark ? 'text-alabaster/70' : 'text-charcoal/80'
            }`}
          >
            {item}
            <span className={`h-1 w-1 rounded-full ${dark ? 'bg-gold-light' : 'bg-gold'}`} />
          </span>
        ))}
      </div>
      <div
        className={`pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r ${
          dark ? 'from-charcoal to-transparent' : 'from-white to-transparent'
        }`}
      />
      <div
        className={`pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l ${
          dark ? 'from-charcoal to-transparent' : 'from-white to-transparent'
        }`}
      />
    </div>
  );
}

/* ================= SECTION HEADING (Strict Standardized Typography) ================= */
export function SectionHead({
  eyebrow,
  title,
  highlight = [],
  description,
  align = 'center',
  dark = false,
}: {
  eyebrow: string;
  title: string;
  highlight?: string[];
  description?: string;
  align?: 'center' | 'left';
  dark?: boolean;
}) {
  const centered = align === 'center';
  return (
    <div className={`${centered ? 'text-center mx-auto max-w-3xl' : 'max-w-2xl'} mb-12 md:mb-16`}>
      <Reveal direction="down">
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#B48A3E]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#B48A3E]" />
          {eyebrow}
        </span>
      </Reveal>

      <h2
        className={`mt-3 text-3xl md:text-4xl font-bold leading-[1.2] tracking-tight ${
          dark ? 'text-white' : 'text-[#0F172A]'
        }`}
      >
        <TextRevealInline text={title} highlight={highlight} dark={dark} />
      </h2>

      {description && (
        <Reveal delay={0.15}>
          <p
            className={`mt-4 text-base font-normal leading-relaxed ${centered ? 'mx-auto' : ''} max-w-2xl ${
              dark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}

function TextRevealInline({
  text,
  highlight,
  dark,
}: {
  text: string;
  highlight: string[];
  dark: boolean;
}) {
  return (
    <span>
      {text.split(' ').map((word, i) => {
        const clean = word.replace(/[.,]/g, '');
        const isHi = highlight.includes(clean);
        return (
          <span
            key={`${word}-${i}`}
            className={`inline ${isHi ? (dark ? 'text-gradient-light' : 'text-gradient') : ''}`}
          >
            {word}{' '}
          </span>
        );
      })}
    </span>
  );
}

/* Re-export Reveal for convenience */
export const Reveal = RevealBase;

/* ================= PARALLAX WRAPPER ================= */
export function Parallax({
  children,
  distance = 60,
  className = '',
}: {
  children: ReactNode;
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  const smooth = useSpring(y, { stiffness: 90, damping: 24 });
  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y: smooth }}>{children}</motion.div>
    </div>
  );
}
