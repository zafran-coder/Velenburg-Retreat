import { useState, useRef, type ReactNode, type MouseEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface Props {
  children: ReactNode;
  className?: string;
  depth?: number;
  sheen?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export default function TiltCard({
  children,
  className = '',
  depth = 12,
  sheen = true,
  glow = true,
  onClick,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const spring = { damping: 22, stiffness: 200, mass: 0.5 };
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [depth, -depth]), spring);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-depth, depth]), spring);
  const scale = useSpring(hovered ? 1.015 : 1, spring);

  const sheenX = useTransform(mx, [-0.5, 0.5], ['15%', '85%']);
  const sheenY = useTransform(my, [-0.5, 0.5], ['15%', '85%']);
  const sheenBg = useTransform(
    [sheenX, sheenY],
    ([px, py]) =>
      `radial-gradient(420px circle at ${px} ${py}, rgba(34,211,238,0.20), rgba(45,212,191,0.08) 40%, transparent 68%)`
  );

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        mx.set(0);
        my.set(0);
      }}
      onClick={onClick}
      className={`perspective-1200 ${className}`}
    >
      <motion.div
        style={{ rotateX, rotateY, scale, transformStyle: 'preserve-3d' }}
        className={`relative w-full h-full rounded-[22px] will-change-transform ${
          glow && hovered ? 'shadow-[0_28px_60px_-24px_rgba(8,145,178,0.45)]' : ''
        } transition-shadow duration-500`}
      >
        {children}
        {sheen && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-30 rounded-[22px]"
            style={{ background: sheenBg, opacity: hovered ? 1 : 0 }}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.35 }}
          />
        )}
      </motion.div>
    </div>
  );
}
