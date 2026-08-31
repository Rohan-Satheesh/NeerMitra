import React, { useState } from 'react';
import KPIBar from '../components/dashboard/KPIBar';
import MarineMap from '../components/map/MarineMap';
import AICopilot from '../components/copilot/AICopilot';
import { Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CommandCenter() {
  const [layers, setLayers] = useState({
    sst: false,
    chlorophyll: false,
    vessels: true,
    pfz: true,
    geofence: true,
  });

  const toggleLayer = (layer: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      <KPIBar />
      <div className="flex flex-1 overflow-hidden">
        {/* Main Map Area */}
        <div className="flex-1 relative p-4 flex flex-col">
          {/* Map Controls Floating Overlay */}
          <div className="absolute top-8 left-8 z-10 glass-panel rounded-lg p-3 shadow-lg border border-border w-48 flex flex-col space-y-3">
            <div className="flex items-center space-x-2 text-sm font-semibold text-foreground border-b border-border pb-2 mb-1">
              <Layers className="w-4 h-4 text-primary" />
              <span>Map Layers</span>
            </div>
            {Object.entries(layers).map(([key, active]) => (
              <label key={key} className="flex items-center space-x-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={active}
                  onChange={() => toggleLayer(key as keyof typeof layers)}
                />
                <div className={cn(
                  "w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors",
                  active ? "bg-primary border-primary" : "border-muted-foreground group-hover:border-primary"
                )}>
                  {active && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
                <span className="text-xs uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
                  {key}
                </span>
              </label>
            ))}
          </div>

          {/* Map Container */}
          <div className="flex-1 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(3,7,18,0.5)] border border-border/50 relative">
            <MarineMap 
              showSST={layers.sst}
              showChlorophyll={layers.chlorophyll}
              showVessels={layers.vessels}
              showPFZ={layers.pfz}
              showGeofence={layers.geofence}
            />
          </div>
        </div>

        {/* AI Copilot Panel */}
        <div className="w-[350px] flex-shrink-0 z-10">
          <AICopilot />
        </div>
      </div>
    </div>
  );
}
