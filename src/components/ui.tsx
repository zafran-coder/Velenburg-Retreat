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
      className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[60] bg-gradient-to-r from-teal-core via-cyan-core to-cyan-glow shadow-[0_0_14px_rgba(34,211,238,0.8)]"
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
          isDark ? 'bg-teal-core/25' : 'bg-teal-glow/25'
        }`}
      />
      <div
        className={`absolute top-1/3 -right-40 w-[560px] h-[560px] rounded-full blur-[140px] animate-aurora ${
          isDark ? 'bg-cyan-deep/30' : 'bg-cyan-glow/25'
        }`}
        style={{ animationDelay: '-6s' }}
      />
      <div
        className={`absolute -bottom-52 left-1/4 w-[500px] h-[500px] rounded-full blur-[135px] animate-aurora ${
          isDark ? 'bg-cyan-glow/15' : 'bg-crystal-light/50'
        }`}
        style={{ animationDelay: '-12s' }}
      />
      {/* drifting architectural grid */}
      <div className={`absolute inset-0 grid-lines ${isDark ? 'opacity-40' : 'opacity-70'}`} />
      {/* soft vignette */}
      <div
        className={`absolute inset-0 ${
          isDark
            ? 'bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(4,9,10,0.85)_100%)]'
            : 'bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(244,254,254,0.9)_100%)]'
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
  const inView = useInView(ref, { once: true, margin: '-40px' });
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
  strength = 12,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18 });
  const sy = useSpring(y, { stiffness: 220, damping: 18 });

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        x.set(((e.clientX - rect.left) / rect.width - 0.5) * strength * 2);
        y.set(((e.clientY - rect.top) / rect.height - 0.5) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}

/* ================= MARQUEE TICKER ================= */
export function Marquee({ items, dark = false }: { items: string[]; dark?: boolean }) {
  const loop = [...items, ...items];
  return (
    <div
      className={`relative overflow-hidden border-y ${
        dark ? 'border-cyan-glow/15 bg-abyss' : 'border-cyan-core/15 bg-white/70'
      } py-4`}
    >
      <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap">
        {loop.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className={`flex items-center gap-10 text-[11px] type-eyebrow ${
              dark ? 'text-crystal/70' : 'text-teal-deep/80'
            }`}
          >
            {item}
            <span className={`h-1 w-1 rounded-full ${dark ? 'bg-cyan-glow' : 'bg-cyan-core'}`} />
          </span>
        ))}
      </div>
      <div
        className={`pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r ${
          dark ? 'from-abyss to-transparent' : 'from-white to-transparent'
        }`}
      />
      <div
        className={`pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l ${
          dark ? 'from-abyss to-transparent' : 'from-white to-transparent'
        }`}
      />
    </div>
  );
}

/* ================= SECTION HEADING (consistent typography) ================= */
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
    <div className={`${centered ? 'text-center mx-auto max-w-3xl' : 'max-w-2xl'} mb-14`}>
      <Reveal direction="down">
        <span
          className={`inline-flex items-center gap-2.5 type-eyebrow text-[9.5px] ${
            dark ? 'text-cyan-glow' : 'text-teal-deep'
          }`}
        >
          <span className={`h-1 w-1 rounded-full ${dark ? 'bg-cyan-glow' : 'bg-cyan-core'}`} />
          {eyebrow}
        </span>
        <div className={`rule-accent w-16 mt-3 ${centered ? 'mx-auto' : ''}`} />
      </Reveal>

      <h2
        className={`type-display mt-5 text-[27px] sm:text-4xl md:text-[44px] ${
          dark ? 'text-white' : 'text-ink'
        }`}
      >
        <TextRevealInline text={title} highlight={highlight} dark={dark} />
      </h2>

      {description && (
        <Reveal delay={0.15}>
          <p
            className={`type-lead mt-5 text-[13.5px] md:text-[15px] ${centered ? 'mx-auto' : ''} measure-wide ${
              dark ? 'text-crystal/70' : 'text-slate-cool/80'
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
          <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
            <motion.span
              initial={{ y: '108%', opacity: 0 }}
              whileInView={{ y: '0%', opacity: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.75, delay: i * 0.05, ease: EASE }}
              className={`inline-block ${isHi ? (dark ? 'text-gradient-light' : 'text-gradient') : ''}`}
            >
              {word}
            </motion.span>
            <span className="inline-block">&nbsp;</span>
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
