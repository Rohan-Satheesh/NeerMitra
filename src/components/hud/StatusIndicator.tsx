import React from 'react';
import { cn } from '@/lib/utils';

export type StatusType = 'online' | 'optimizing' | 'warning' | 'critical' | 'demo' | 'synced' | 'offline';

interface StatusIndicatorProps {
  status: StatusType;
  label?: string;
  subLabel?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  pulse?: boolean;
}

export default function StatusIndicator({
  status,
  label,
  subLabel,
  size = 'md',
  className = '',
  pulse = true
}: StatusIndicatorProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'online':
      case 'synced':
        return { dot: 'bg-emerald-400', ring: 'bg-emerald-500/30', text: 'text-emerald-400', border: 'border-emerald-500/30' };
      case 'optimizing':
        return { dot: 'bg-cyan-400', ring: 'bg-cyan-500/30', text: 'text-cyan-400', border: 'border-cyan-500/30' };
      case 'warning':
        return { dot: 'bg-amber-400', ring: 'bg-amber-500/30', text: 'text-amber-400', border: 'border-amber-500/30' };
      case 'critical':
        return { dot: 'bg-rose-500', ring: 'bg-rose-500/40', text: 'text-rose-400', border: 'border-rose-500/40' };
      case 'demo':
        return { dot: 'bg-blue-400', ring: 'bg-blue-500/30', text: 'text-blue-400', border: 'border-blue-500/30' };
      case 'offline':
      default:
        return { dot: 'bg-slate-500', ring: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/20' };
    }
  };

  const colors = getStatusColor();
  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : size === 'lg' ? 'w-2.5 h-2.5' : 'w-2 h-2';
  const pulseSize = size === 'sm' ? 'w-3 h-3 -left-[3px] -top-[3px]' : size === 'lg' ? 'w-5 h-5 -left-[5px] -top-[5px]' : 'w-4 h-4 -left-[4px] -top-[4px]';

  return (
    <div className={cn("inline-flex items-center space-x-2 font-mono select-none", className)}>
      <div className="relative flex items-center justify-center">
        {pulse && status !== 'offline' && (
          <span className={cn("absolute rounded-full animate-ping opacity-75", colors.ring, pulseSize)} />
        )}
        <span className={cn("relative rounded-full block shadow-sm", colors.dot, dotSize)} />
      </div>

      {label && (
        <div className="flex flex-col">
          <span className={cn("text-[11px] font-bold tracking-widest uppercase leading-none", colors.text)}>
            {label}
          </span>
          {subLabel && (
            <span className="text-[9px] text-slate-400 uppercase tracking-wider font-normal mt-0.5">
              {subLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
