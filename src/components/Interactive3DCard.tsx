import { useState, type ReactNode } from 'react';

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
  glow = true,
  onClick,
}: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className={`relative w-full h-full rounded-[22px] transition-all duration-300 ease-out ${
        glow && hovered
          ? 'shadow-[0_20px_40px_-15px_rgba(197,160,89,0.3)] border-gold/60'
          : 'shadow-card border-gold/20'
      } ${className}`}
    >
      {children}
    </div>
  );
}
