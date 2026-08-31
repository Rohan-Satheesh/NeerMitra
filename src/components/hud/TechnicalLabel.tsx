import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TechnicalLabelProps {
  lat?: number;
  lng?: number;
  showTime?: boolean;
  prefix?: string;
  suffix?: string;
  tag?: string;
  className?: string;
}

export default function TechnicalLabel({
  lat = 9.9312,
  lng = 76.2673,
  showTime = true,
  prefix = 'SYS // ONLINE',
  suffix,
  tag,
  className = ''
}: TechnicalLabelProps) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toISOString().substring(11, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatLat = (val: number) => {
    const dir = val >= 0 ? 'N' : 'S';
    return `${Math.abs(val).toFixed(4)}° ${dir}`;
  };

  const formatLng = (val: number) => {
    const dir = val >= 0 ? 'E' : 'W';
    return `${Math.abs(val).toFixed(4)}° ${dir}`;
  };

  return (
    <div className={cn(
      "inline-flex items-center space-x-2 text-[11px] font-mono text-slate-400 bg-[#07111F]/90 px-3 py-1 rounded border border-cyan-500/20 shadow-sm backdrop-blur-md",
      className
    )}>
      {tag && (
        <span className="bg-cyan-500/10 text-cyan-400 font-bold px-1.5 py-0.5 rounded text-[9px] uppercase border border-cyan-500/30">
          {tag}
        </span>
      )}
      {prefix && (
        <span className="text-cyan-400 font-semibold tracking-wider">
          {prefix}
        </span>
      )}
      <span className="text-slate-600">//</span>
      <span className="text-slate-200">
        LAT {formatLat(lat)}
      </span>
      <span className="text-slate-600">//</span>
      <span className="text-slate-200">
        LON {formatLng(lng)}
      </span>
      {showTime && (
        <>
          <span className="text-slate-600">//</span>
          <span className="text-emerald-400 font-medium">
            {time}
          </span>
        </>
      )}
      {suffix && (
        <>
          <span className="text-slate-600">//</span>
          <span className="text-slate-300">{suffix}</span>
        </>
      )}
    </div>
  );
}
