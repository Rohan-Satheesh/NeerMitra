import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LogEntry {
  id: string;
  time: string;
  source: string;
  message: string;
  level: 'info' | 'success' | 'warn' | 'error';
}

const defaultLogs: LogEntry[] = [
  { id: '1', time: '12:42:18', source: 'ORCHESTRATOR', message: 'Planner agent initialized. Ingesting telemetry streams.', level: 'info' },
  { id: '2', time: '12:42:19', source: 'MOSDAC', message: 'INSAT-3DR SST raster batch ingested. Resolution: 1km.', level: 'info' },
  { id: '3', time: '12:42:20', source: 'OCEAN_ANALYTICS', message: 'Chlorophyll frontal zones detected in Sector K-04.', level: 'success' },
  { id: '4', time: '12:42:21', source: 'IMD_WEATHER', message: 'Wind shear stable at 14 kn NW. Cyclone threat: LOW.', level: 'info' },
  { id: '5', time: '12:42:22', source: 'RISK_ENGINE', message: 'Navigational risk evaluated. Kochi Sector score: 24/100 (Safe).', level: 'success' },
  { id: '6', time: '12:42:23', source: 'FLEET_OPTIMIZER', message: 'QUBO Hamiltonian formulated for 12 vessels. EEXI compliant.', level: 'info' },
  { id: '7', time: '12:42:24', source: 'EXPLAINABILITY', message: 'Provenance tree generated. Lineage mapped to INCOIS advisory.', level: 'success' }
];

interface DataStreamProps {
  logs?: LogEntry[];
  autoScroll?: boolean;
  maxHeight?: string;
  className?: string;
  title?: string;
}

export default function DataStream({
  logs = defaultLogs,
  autoScroll = true,
  maxHeight = 'max-h-60',
  className = '',
  title = 'AGENT REASONING STREAM'
}: DataStreamProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const getLevelStyle = (level: LogEntry['level']) => {
    switch (level) {
      case 'success':
        return 'text-emerald-400';
      case 'warn':
        return 'text-amber-400';
      case 'error':
        return 'text-rose-400';
      case 'info':
      default:
        return 'text-cyan-400';
    }
  };

  return (
    <div className={cn("rounded-lg border border-cyan-500/20 bg-[#050B14]/90 p-3 font-mono text-xs tech-corner flex flex-col shadow-lg backdrop-blur-md", className)}>
      <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2 text-slate-400">
        <div className="flex items-center space-x-2">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-200">{title}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span className="text-[9px] text-emerald-400 font-semibold uppercase">LIVE FEED</span>
        </div>
      </div>

      <div ref={containerRef} className={cn("overflow-y-auto space-y-1.5 pr-1 scrollbar-thin", maxHeight)}>
        {logs.map((log) => (
          <div key={log.id} className="flex items-start space-x-2 text-[11px] leading-relaxed">
            <span className="text-slate-500 font-normal flex-shrink-0">{log.time}</span>
            <span className={cn("font-bold flex-shrink-0 px-1 py-0.2 rounded bg-[#07111F] text-[9px] border border-white/5", getLevelStyle(log.level))}>
              [{log.source}]
            </span>
            <span className="text-slate-300 flex-1">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
