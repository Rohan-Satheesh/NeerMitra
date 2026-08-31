import React from 'react';
import { Database, Network, Search, Globe, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const sources = [
  { name: 'MOSDAC / ISRO', desc: 'Satellite Oceanography', color: 'bg-primary/20 text-primary border-primary/30' },
  { name: 'INCOIS', desc: 'Marine Advisories & PFZ', color: 'bg-green-500/20 text-green-500 border-green-500/30' },
  { name: 'IMD', desc: 'Weather & Cyclone Warnings', color: 'bg-warning/20 text-warning border-warning/30' },
  { name: 'Copernicus Marine', desc: 'Global Ocean Models', color: 'bg-cyan-500/20 text-cyan-500 border-cyan-500/30' },
  { name: 'NOAA', desc: 'SST & Climate Data', color: 'bg-blue-500/20 text-blue-500 border-blue-500/30' },
  { name: 'Global Fishing Watch', desc: 'Vessel Activity', color: 'bg-purple-500/20 text-purple-500 border-purple-500/30' },
  { name: 'AIS', desc: 'Live Ship Tracking', color: 'bg-pink-500/20 text-pink-500 border-pink-500/30' },
  { name: 'IMO / MRV', desc: 'Emissions Baselines', color: 'bg-orange-500/20 text-orange-500 border-orange-500/30' },
];

export default function DataSources() {
  return (
    <div className="p-6 h-full overflow-y-auto flex flex-col items-center">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-foreground">Data Sources Architecture</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">Integrating disparate marine intelligence streams into a unified agentic core.</p>
      </div>

      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between space-y-12 md:space-y-0">
        
        {/* Sources Column */}
        <div className="grid grid-cols-1 gap-4 w-full md:w-80">
          {sources.map((source, idx) => (
            <div key={idx} className={cn("p-4 rounded-xl border relative flex items-center justify-between group", source.color)}>
              <div>
                <h3 className="font-bold">{source.name}</h3>
                <p className="text-xs opacity-80">{source.desc}</p>
              </div>
              <Database className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" />
              {/* Connection line indicator */}
              <div className="hidden md:block absolute top-1/2 -right-12 w-12 h-px bg-current opacity-30"></div>
            </div>
          ))}
        </div>

        {/* Central Core */}
        <div className="relative flex flex-col items-center flex-1 px-12">
           <div className="w-48 h-48 rounded-full border border-primary bg-primary/5 flex flex-col items-center justify-center relative shadow-[0_0_50px_rgba(14,165,233,0.2)]">
              {/* Animated Rings */}
              <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping" style={{ animationDuration: '3s' }}></div>
              <div className="absolute -inset-4 rounded-full border border-primary/10 animate-spin-slow border-t-primary/40"></div>
              
              <Network className="w-12 h-12 text-primary mb-2" />
              <h2 className="font-bold text-center leading-tight">NeerMitra<br/>Data Core</h2>
           </div>
           
           <div className="h-24 w-px bg-primary/30 my-4 flex items-center justify-center">
             <ArrowRight className="w-4 h-4 text-primary rotate-90" />
           </div>

           <div className="w-full bg-surface-elevated border border-border p-6 rounded-xl text-center shadow-lg relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-primary to-warning"></div>
              <h3 className="text-xl font-bold mb-2">Agentic Orchestration Layer</h3>
              <p className="text-sm text-muted-foreground">Normalizes spatial, temporal, and categorical data for AI consumption.</p>
           </div>
        </div>

        {/* Output Column */}
        <div className="grid grid-cols-1 gap-6 w-full md:w-72">
           <div className="p-5 rounded-xl border border-border bg-surface flex items-start space-x-4">
             <div className="bg-primary/10 p-2 rounded-lg text-primary"><Search className="w-5 h-5" /></div>
             <div>
               <h4 className="font-bold text-sm">AI Models</h4>
               <p className="text-xs text-muted-foreground mt-1">Predictions & Insights</p>
             </div>
           </div>
           
           <div className="p-5 rounded-xl border border-border bg-surface flex items-start space-x-4">
             <div className="bg-green-500/10 p-2 rounded-lg text-green-500"><Network className="w-5 h-5" /></div>
             <div>
               <h4 className="font-bold text-sm">Optimization Engine</h4>
               <p className="text-xs text-muted-foreground mt-1">Quantum-Inspired Solutions</p>
             </div>
           </div>

           <div className="p-5 rounded-xl border border-border bg-surface flex items-start space-x-4">
             <div className="bg-warning/10 p-2 rounded-lg text-warning"><Globe className="w-5 h-5" /></div>
             <div>
               <h4 className="font-bold text-sm">Dashboards</h4>
               <p className="text-xs text-muted-foreground mt-1">Command & Control UI</p>
             </div>
           </div>
        </div>
      </div>
      
      <div className="mt-16 text-center max-w-2xl bg-surface border border-border rounded-lg p-4">
        <p className="text-xs text-muted-foreground">
          <span className="font-bold text-foreground">Note:</span> This prototype utilizes public datasets and physics-based simulated models to demonstrate the architecture where proprietary commercial fleet telemetry or real-time restricted satellite feeds are unavailable.
        </p>
      </div>
    </div>
  );
}
