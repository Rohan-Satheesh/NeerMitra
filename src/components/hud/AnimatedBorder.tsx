import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedBorderProps {
  children: React.ReactNode;
  active?: boolean;
  variant?: 'cyan' | 'amber' | 'green' | 'rose';
  className?: string;
}

export default function AnimatedBorder({
  children,
  active = true,
  variant = 'cyan',
  className = ''
}: AnimatedBorderProps) {
  const getGlowColor = () => {
    switch (variant) {
      case 'amber':
        return 'border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.2)]';
      case 'green':
        return 'border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]';
      case 'rose':
        return 'border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.2)]';
      case 'cyan':
      default:
        return 'border-cyan-500/50 shadow-[0_0_20px_rgba(0,210,255,0.2)]';
    }
  };

  return (
    <div className={cn(
      "relative rounded-xl transition-all duration-300",
      active ? getGlowColor() : "border border-cyan-500/10",
      className
    )}>
      {/* Corner crosshairs */}
      <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
      <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
      <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

      {children}
    </div>
  );
}
