import React from 'react';
import { cn } from '@/lib/utils';

interface LiveBadgeProps {
  label: string;
  variant?: 'cyan' | 'green' | 'amber' | 'red' | 'blue';
  icon?: React.ReactNode;
  pulsing?: boolean;
  className?: string;
}

export default function LiveBadge({
  label,
  variant = 'cyan',
  icon,
  pulsing = true,
  className = ''
}: LiveBadgeProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'green':
        return {
          bg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
          dot: 'bg-emerald-400',
          glow: 'shadow-[0_0_10px_rgba(16,185,129,0.2)]'
        };
      case 'amber':
        return {
          bg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
          dot: 'bg-amber-400',
          glow: 'shadow-[0_0_10px_rgba(245,158,11,0.2)]'
        };
      case 'red':
        return {
          bg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
          dot: 'bg-rose-400',
          glow: 'shadow-[0_0_10px_rgba(244,63,94,0.2)]'
        };
      case 'blue':
        return {
          bg: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
          dot: 'bg-blue-400',
          glow: 'shadow-[0_0_10px_rgba(59,130,246,0.2)]'
        };
      case 'cyan':
      default:
        return {
          bg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
          dot: 'bg-cyan-400',
          glow: 'shadow-[0_0_10px_rgba(0,210,255,0.2)]'
        };
    }
  };

  const style = getVariantStyles();

  return (
    <span className={cn(
      "inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider border backdrop-blur-md",
      style.bg,
      style.glow,
      className
    )}>
      {pulsing ? (
        <span className="relative flex h-2 w-2">
          <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", style.dot)} />
          <span className={cn("relative inline-flex rounded-full h-2 w-2", style.dot)} />
        </span>
      ) : (
        <span className={cn("inline-block h-1.5 w-1.5 rounded-full", style.dot)} />
      )}
      {icon && <span className="mr-0.5">{icon}</span>}
      <span>{label}</span>
    </span>
  );
}
