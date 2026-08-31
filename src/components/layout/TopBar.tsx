import React, { useState } from 'react';
import { 
  Search, 
  Radar, 
  Bell, 
  AlertOctagon
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopBarProps {
  onOpenCommandPalette?: () => void;
  onTriggerScan?: () => void;
  isScanning?: boolean;
}

export default function TopBar({
  onOpenCommandPalette,
  onTriggerScan,
  isScanning = false
}: TopBarProps) {
  const [demoMode, setDemoMode] = useState(true);

  return (
    <header className="h-14 border-b border-slate-800/80 bg-[#070D18]/90 backdrop-blur-md flex items-center justify-between px-5 sticky top-0 z-20 flex-shrink-0 select-none">
      
      {/* Left: Quick Search */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center space-x-2.5 w-64 md:w-72 px-3 py-1.5 bg-slate-900/80 border border-slate-700/60 hover:border-cyan-500/50 rounded-lg text-slate-400 hover:text-slate-200 transition-all text-xs text-left shadow-sm"
        >
          <Search className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
          <span className="flex-1 truncate text-xs">Search vessels, PFZ zones, alerts...</span>
          <kbd className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700 font-mono">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Middle: Clean Telemetry Badge */}
      <div className="hidden md:flex items-center space-x-2 text-xs px-3 py-1 rounded-full bg-slate-900/60 border border-slate-800 text-slate-300 shadow-sm font-sans">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-mono text-cyan-400 font-medium">12.9716° N, 74.8560° E</span>
        <span className="text-slate-600">•</span>
        <span className="text-slate-400 font-mono">12:42 UTC</span>
        <span className="text-slate-600">•</span>
        <span className="text-emerald-400 text-[11px] font-semibold">247 AIS In Range</span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-2.5">
        
        {/* Satellite Radar Scan Button */}
        <button
          onClick={onTriggerScan}
          disabled={isScanning}
          className={cn(
            "flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border shadow-sm",
            isScanning
              ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/60 animate-pulse"
              : "bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700/80 hover:border-cyan-500/40"
          )}
        >
          <Radar className={cn("w-3.5 h-3.5 text-cyan-400", isScanning && "animate-spin")} />
          <span className="hidden sm:inline">{isScanning ? "Scanning..." : "Satellite Scan"}</span>
        </button>

        {/* Mode Toggle */}
        <div className="hidden lg:flex items-center space-x-2 px-2.5 py-1 bg-slate-900/80 border border-slate-800 rounded-lg text-xs">
          <span className="text-[11px] text-slate-400 font-medium">
            {demoMode ? "Demo Mode" : "Live Stream"}
          </span>
          <button 
            onClick={() => setDemoMode(!demoMode)}
            className={cn(
              "relative inline-flex h-4 w-7 items-center rounded-full transition-colors cursor-pointer",
              demoMode ? "bg-cyan-600" : "bg-emerald-500"
            )}
          >
            <span className={cn(
              "inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform",
              demoMode ? "translate-x-3.5" : "translate-x-0.5"
            )} />
          </button>
        </div>

        {/* Alerts Bell */}
        <a 
          href="/alerts"
          className="relative p-2 bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 rounded-lg text-slate-300 hover:text-white transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute 1.5 top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
        </a>

        {/* Emergency SOS Button */}
        <a
          href="tel:112"
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg text-rose-300 text-xs font-semibold transition-colors"
        >
          <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
          <span className="hidden sm:inline">SOS 112</span>
        </a>
      </div>
    </header>
  );
}


