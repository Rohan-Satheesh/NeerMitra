import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface DataReadoutProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  delta?: string;
  status?: 'normal' | 'optimal' | 'warning' | 'alert';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function DataReadout({
  label,
  value,
  unit,
  trend,
  delta,
  status = 'normal',
  size = 'md',
  className = ''
}: DataReadoutProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'optimal':
        return 'text-emerald-400 border-slate-800 bg-[#091120]';
      case 'warning':
        return 'text-amber-400 border-slate-800 bg-[#091120]';
      case 'alert':
        return 'text-rose-400 border-slate-800 bg-[#091120]';
      case 'normal':
      default:
        return 'text-cyan-400 border-slate-800 bg-[#091120]';
    }
  };

  const statusStyle = getStatusColor();

  return (
    <div className={cn("p-3 rounded-xl border font-sans shadow-sm", statusStyle, className)}>
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-[11px] text-slate-400 uppercase font-semibold truncate tracking-wider">
          {label}
        </span>
        {trend && (
          <span className="flex items-center text-[10px] space-x-0.5">
            {trend === 'up' && <TrendingUp className="w-3 h-3 text-emerald-400" />}
            {trend === 'down' && <TrendingDown className="w-3 h-3 text-cyan-400" />}
            {trend === 'neutral' && <Minus className="w-3 h-3 text-slate-400" />}
            {delta && <span className="text-slate-300 ml-0.5 font-medium">{delta}</span>}
          </span>
        )}
      </div>

      <div className="flex items-baseline space-x-1.5">
        <span className={cn(
          "font-bold text-white font-mono",
          size === 'sm' && "text-base",
          size === 'md' && "text-xl",
          size === 'lg' && "text-2xl"
        )}>
          {value}
        </span>
        {unit && (
          <span className="text-[10px] text-slate-400 uppercase font-medium truncate">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
