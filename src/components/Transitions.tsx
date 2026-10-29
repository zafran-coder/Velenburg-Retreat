import { motion, useInView, type Variants } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

const EASE = [0.16, 1, 0.3, 1] as const;

/* ============ PAGE TRANSITION ============ */
export default function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.45, ease: EASE }}
      className="w-full flex-grow flex flex-col"
    >
      {children}
    </motion.div>
  );
}

/* ============ SCROLL REVEAL ============ */
type Dir = 'up' | 'down' | 'left' | 'right' | 'scale' | 'blur' | 'none';

const offsets: Record<Dir, { x?: number; y?: number; scale?: number; filter?: string }> = {
  up: { y: 34 },
  down: { y: -34 },
  left: { x: 40 },
  right: { x: -40 },
  scale: { scale: 0.93 },
  blur: { y: 20, filter: 'blur(10px)' },
  none: {},
};

export function Reveal({
  children,
  delay = 0,
  duration = 0.85,
  direction = 'up',
  className = '',
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: Dir;
  className?: string;
  once?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, ...offsets[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once, margin: '0px' }}
      transition={{ duration, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ============ STAGGER CONTAINER ============ */
export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
};

export function Stagger({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={staggerChild} className={className}>
      {children}
    </motion.div>
  );
}

/* ============ WORD BY WORD TEXT REVEAL ============ */
export function TextReveal({
  text,
  className = '',
  highlight = [],
  highlightClass = 'text-gradient',
  delay = 0,
}: {
  text: string;
  className?: string;
  highlight?: string[];
  highlightClass?: string;
  delay?: number;
}) {
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((word, i) => {
        const clean = word.replace(/[.,—“”"]/g, '');
        const isHighlight = highlight.includes(clean);
        return (
          <span
            key={`${word}-${i}`}
            className={`inline ${isHighlight ? highlightClass : ''}`}
          >
            {word}{i < words.length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </span>
  );
}

/* ============ IMAGE MASK CURTAIN REVEAL ============ */
export function ImageMask({
  src,
  alt,
  className = '',
  imgClassName = '',
  zoom = 1.06,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  zoom?: number;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        initial={{ clipPath: 'inset(100% 0% 0% 0%)', scale: 1.08 }}
        whileInView={{ clipPath: 'inset(0% 0% 0% 0%)', scale: 1 }}
        viewport={{ once: true, margin: '0px' }}
        transition={{ duration: 1.15, ease: EASE }}
        className="w-full h-full"
      >
        <motion.img
          src={src}
          alt={alt}
          loading="lazy"
          whileHover={{ scale: zoom }}
          transition={{ duration: 1.1, ease: EASE }}
          className={`w-full h-full object-cover will-change-transform ${imgClassName}`}
        />
      </motion.div>
      {/* light sweep on reveal */}
      <motion.div
        initial={{ x: '-120%', opacity: 0 }}
        whileInView={{ x: '120%', opacity: [0, 0.5, 0] }}
        viewport={{ once: true, margin: '0px' }}
        transition={{ duration: 1.4, delay: 0.35, ease: EASE }}
        className="pointer-events-none absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/60 to-transparent"
      />
    </div>
  );
}

/* ============ IN-VIEW PROGRESS LINE ============ */
export function InViewLine({ className = '', delay = 0 }: { className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <div ref={ref} className={`h-px w-full bg-gold/20 overflow-hidden ${className}`}>
      <motion.div
        initial={{ x: '-100%' }}
        animate={inView ? { x: '0%' } : { x: '-100%' }}
        transition={{ duration: 1.1, delay, ease: EASE }}
        className="h-full w-full bg-gradient-to-r from-transparent via-gold to-transparent"
      />
    </div>
  );
}
