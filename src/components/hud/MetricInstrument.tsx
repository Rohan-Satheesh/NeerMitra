import React from 'react';
import { cn } from '@/lib/utils';
import { Compass, Waves, Thermometer, Wind, Gauge } from 'lucide-react';

interface MetricInstrumentProps {
  type: 'sst' | 'wave' | 'wind' | 'heading' | 'efficiency' | 'custom';
  title: string;
  value: string | number;
  unit: string;
  statusText?: string;
  statusColor?: 'safe' | 'warning' | 'danger' | 'info';
  percentage?: number; // 0 to 100
  secondaryText?: string;
  className?: string;
}

export default function MetricInstrument({
  type,
  title,
  value,
  unit,
  statusText,
  statusColor = 'safe',
  percentage,
  secondaryText,
  className = ''
}: MetricInstrumentProps) {
  const getIcon = () => {
    switch (type) {
      case 'sst':
        return <Thermometer className="w-4 h-4 text-cyan-400" />;
      case 'wave':
        return <Waves className="w-4 h-4 text-blue-400" />;
      case 'wind':
        return <Wind className="w-4 h-4 text-emerald-400" />;
      case 'heading':
        return <Compass className="w-4 h-4 text-amber-400" />;
      case 'efficiency':
      default:
        return <Gauge className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getStatusColorClass = () => {
    switch (statusColor) {
      case 'warning':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'danger':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'info':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'safe':
      default:
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    }
  };

  return (
    <div className={cn(
      "p-3 rounded-lg border border-cyan-500/20 bg-[#07111F]/90 backdrop-blur-md tech-corner flex flex-col font-mono shadow-md",
      className
    )}>
      <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
        <div className="flex items-center space-x-1.5">
          {getIcon()}
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-300 truncate">
            {title}
          </span>
        </div>
        {statusText && (
          <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded uppercase border", getStatusColorClass())}>
            {statusText}
          </span>
        )}
      </div>

      <div className="flex items-baseline justify-between mt-0.5">
        <div className="flex items-baseline space-x-1">
          <span className="text-xl font-extrabold text-white tracking-tight">
            {value}
          </span>
          <span className="text-[11px] text-cyan-400 font-semibold">
            {unit}
          </span>
        </div>
        {secondaryText && (
          <span className="text-[10px] text-slate-400">
            {secondaryText}
          </span>
        )}
      </div>

      {percentage !== undefined && (
        <div className="w-full bg-slate-800/80 rounded-full h-1 mt-2.5 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1 rounded-full transition-all duration-500" 
            style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
          />
        </div>
      )}
    </div>
  );
}
