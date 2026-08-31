import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import KPIBar from '../components/dashboard/KPIBar';
import MarineMap from '../components/map/MarineMap';
import AICopilot from '../components/copilot/AICopilot';
import { 
  Layers, 
  Thermometer, 
  Waves, 
  Wind, 
  Ship, 
  ShieldAlert, 
  Radar, 
  ChevronRight, 
  ChevronLeft,
  X,
  Compass,
  Activity,
  Radio
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Vessel, PFZ } from '@/services/mockData';

export default function CommandCenter() {
  const context = useOutletContext<{ isScanning?: boolean; setIsScanning?: (val: boolean) => void }>() || {};
  const [isScanning, setIsScanning] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(true);
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null);
  const [selectedPFZ, setSelectedPFZ] = useState<PFZ | null>(null);

  const [layers, setLayers] = useState({
    vessels: true,
    pfz: true,
    sst: true,
    chlorophyll: true,
    geofence: true,
  });

  const toggleLayer = (layer: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  const activeLayerCount = Object.values(layers).filter(Boolean).length;

  return (
    <div className="flex flex-col h-full overflow-hidden relative select-none font-sans bg-[#070D18]">
      
      {/* Top Operations KPI Stream Bar */}
      <KPIBar />

      {/* Main Operations Split: Dominant Map + Dockable AI Copilot */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Full-Screen Map Centerpiece */}
        <div className="flex-1 relative flex flex-col h-full bg-[#070D18] overflow-hidden">
          
          {/* Main Interactive Map */}
          <div className="flex-1 relative w-full h-full">
            <MarineMap 
              showSST={layers.sst}
              showChlorophyll={layers.chlorophyll}
              showVessels={layers.vessels}
              showPFZ={layers.pfz}
              showGeofence={layers.geofence}
              isScanning={isScanning || context.isScanning}
              onScanComplete={() => {
                setIsScanning(false);
                if (context.setIsScanning) context.setIsScanning(false);
              }}
              selectedVesselId={selectedVessel?.id}
              onSelectVessel={(v) => { setSelectedVessel(v); setSelectedPFZ(null); }}
              onSelectPFZ={(p) => { setSelectedPFZ(p); setSelectedVessel(null); }}
            />
          </div>

          {/* Clean Floating Map Layer Toolbar (Top Left) */}
          <div className="absolute top-3.5 left-3.5 z-10 flex flex-wrap items-center gap-1.5 p-1.5 bg-[#091120]/90 backdrop-blur-md rounded-xl border border-slate-800 shadow-lg text-xs">
            <div className="flex items-center space-x-1.5 px-2 py-1 text-slate-400 text-[11px] font-semibold border-r border-slate-800 pr-2.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Layers</span>
            </div>

            {[
              { id: 'vessels', label: 'Vessels', color: 'text-cyan-400', activeBg: 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300' },
              { id: 'pfz', label: 'PFZ Zones', color: 'text-emerald-400', activeBg: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' },
              { id: 'sst', label: 'SST Thermal', color: 'text-rose-400', activeBg: 'bg-rose-500/15 border-rose-500/40 text-rose-300' },
              { id: 'chlorophyll', label: 'Chlorophyll', color: 'text-teal-400', activeBg: 'bg-teal-500/15 border-teal-500/40 text-teal-300' },
              { id: 'geofence', label: 'EEZ Boundary', color: 'text-blue-400', activeBg: 'bg-blue-500/15 border-blue-500/40 text-blue-300' },
            ].map(item => {
              const active = layers[item.id as keyof typeof layers];
              return (
                <button
                  key={item.id}
                  onClick={() => toggleLayer(item.id as keyof typeof layers)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all border cursor-pointer flex items-center space-x-1.5",
                    active 
                      ? item.activeBg 
                      : "bg-slate-900/60 border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  )}
                >
                  <span className={cn("w-1.5 h-1.5 rounded-full", active ? "bg-current" : "bg-slate-600")} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Clean Floating Telemetry Badge (Bottom Left) */}
          <div className="absolute bottom-3.5 left-3.5 z-10 hidden md:flex items-center space-x-2 bg-[#091120]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800 text-xs shadow-md text-slate-300">
            <span className="font-mono text-cyan-400">14°00'N, 73°00'E</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">1.0 km Grid Resolution</span>
            <span className="text-slate-600">•</span>
            <span className="text-amber-400 font-medium">1 Weather Advisory Active</span>
          </div>

          {/* Selected Vessel Inspection Modal */}
          {selectedVessel && (
            <div className="absolute top-14 right-4 z-20 bg-[#091120]/95 backdrop-blur-md border border-cyan-500/40 rounded-xl p-4 shadow-2xl w-80 font-sans animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
                <div className="flex items-center space-x-2">
                  <Ship className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-bold text-white">{selectedVessel.name}</span>
                </div>
                <button 
                  onClick={() => setSelectedVessel(null)}
                  className="p-1 text-slate-400 hover:text-white rounded cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-slate-900/90 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Vessel ID</span>
                    <span className="font-bold text-cyan-400 font-mono">{selectedVessel.id}</span>
                  </div>
                  <div className="p-2 bg-slate-900/90 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Class</span>
                    <span className="font-semibold text-white">{selectedVessel.type}</span>
                  </div>
                  <div className="p-2 bg-slate-900/90 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Speed</span>
                    <span className="font-bold text-cyan-400 font-mono">{selectedVessel.speed} kn</span>
                  </div>
                  <div className="p-2 bg-slate-900/90 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Heading</span>
                    <span className="font-bold text-white font-mono">{selectedVessel.heading}°</span>
                  </div>
                </div>

                <div className="p-2.5 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase block mb-0.5">Weather-Routed Trajectory</span>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Optimized course avoids 2.8m monsoonal wave front. Estimated 14.2% fuel burn reduction.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Toggle Copilot Button (floating) */}
          <button
            onClick={() => setCopilotOpen(!copilotOpen)}
            className="absolute top-3.5 right-3.5 z-10 bg-[#091120]/90 backdrop-blur-md border border-slate-800 text-slate-300 hover:text-white p-2 rounded-lg shadow-md hover:border-cyan-500/40 transition-colors cursor-pointer"
            title={copilotOpen ? "Collapse Copilot" : "Expand Copilot"}
          >
            {copilotOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4 text-cyan-400" />}
          </button>
        </div>

        {/* AI Copilot Intelligence Console Panel */}
        {copilotOpen && (
          <aside className="w-[360px] lg:w-[380px] flex-shrink-0 z-10 h-full border-l border-slate-800 bg-[#070D18] transition-all duration-300">
            <AICopilot />
          </aside>
        )}
      </div>
    </div>
  );
}


