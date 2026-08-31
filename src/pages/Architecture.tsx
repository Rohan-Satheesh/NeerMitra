import React, { useState } from 'react';
import { Layers, Database, Cpu, BrainCircuit, MonitorSmartphone, ArrowDown, ChevronRight, Server, ShieldCheck, Radio, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const layersList = [
  { 
    id: 'L1', 
    name: 'DATA INGESTION & SATELLITE TELEMETRY', 
    icon: Database, 
    items: ['MOSDAC INSAT-3DR (SST 1km)', 'INCOIS OCM-3 Chlorophyll', 'IMD WRF 3km Weather', 'DG Shipping AIS Transponders', 'Copernicus Global Hydrodynamics'], 
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10 border-cyan-500/30',
    details: 'Pulls real-time optical, infrared, and radar observations over automated asynchronous ETL microservices.'
  },
  { 
    id: 'L2', 
    name: 'SPATIAL-TEMPORAL FUSION & FEATURE STORE', 
    icon: Layers, 
    items: ['H3 Hexagonal Indexing (Res 8)', 'Bilinear Raster Interpolation', 'Geospatial Feature Store', 'NMEA Transponder Parser'], 
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10 border-blue-500/30',
    details: 'Unifies disparate spatial resolutions into normalized tensor cubes accessible by multi-agent reasoning workers.'
  },
  { 
    id: 'L3', 
    name: 'PHYSICS-INFORMED & PREDICTIVE MODELS', 
    icon: Cpu, 
    items: ['PFZ Confluence Classifiers', 'Wave Watch III Simulation', 'Hydrodynamic Vessel Drag', 'Fuel Burn Physics Model'], 
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10 border-emerald-500/30',
    details: 'Combines ocean physics equations with machine learning models to forecast fishing potential and vessel resistance.'
  },
  { 
    id: 'L4', 
    name: 'MULTI-AGENT SWARM & QUBO OPTIMIZER', 
    icon: BrainCircuit, 
    items: ['Planner Orchestrator (DAG)', '9 Specialist Agent Swarm', 'Quantum-Inspired QUBO Engine', 'Data Provenance Tracer'], 
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10 border-amber-500/30',
    details: 'Solves complex multi-objective routing under weather & emission constraints with full lineage explainability.'
  },
  { 
    id: 'L5', 
    name: 'TACTICAL INTERFACE & EDGE PRESENTATION', 
    icon: MonitorSmartphone, 
    items: ['Mission Control Web OS', 'Fisherman High-Contrast PWA', 'Voice Query Processing', 'Emergency SOS Broadcast'], 
    color: 'text-cyan-300',
    bgColor: 'bg-cyan-500/10 border-cyan-500/40',
    details: 'Delivers instantaneous command-and-control visualizations and offline-capable edge alerts to fishermen and commanders.'
  },
];

export default function Architecture() {
  const [selectedLayer, setSelectedLayer] = useState(layersList[0]);

  return (
    <div className="p-4 md:p-6 h-full overflow-y-auto font-sans select-none bg-[#070D18] scrollbar-thin">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-cyan-300 text-xs font-semibold mb-2">
          <span>ISRO × INCOIS Architectural Specification</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">
          NeerMitra 5-Layer System Blueprint
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          End-to-end pipeline connecting orbital satellite sensors to quantum-inspired fleet optimization and edge fisherman devices.
        </p>
      </div>

      {/* Main 5-Layer Stack */}
      <div className="max-w-4xl mx-auto space-y-3 pb-8">
        {layersList.map((layer, idx) => {
          const Icon = layer.icon;
          const isSelected = selectedLayer.id === layer.id;

          return (
            <React.Fragment key={layer.id}>
              <div 
                onClick={() => setSelectedLayer(layer)}
                className={cn(
                  "p-5 rounded-xl border transition-all cursor-pointer shadow-sm relative overflow-hidden bg-[#091120] border-slate-800",
                  isSelected ? "border-cyan-500/50 shadow-md" : "hover:border-slate-700"
                )}
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0">
                      <Icon className={cn("w-5 h-5", layer.color)} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={cn("text-xs font-bold font-mono", layer.color)}>[{layer.id}]</span>
                        <h2 className="text-sm font-bold text-white">{layer.name}</h2>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">{layer.details}</p>
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-400 font-semibold uppercase hidden md:inline">
                    {layer.items.length} Subsystems
                  </span>
                </div>

                {/* Subsystem Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mt-4 pt-3 border-t border-slate-800/80">
                  {layer.items.map((item, i) => (
                    <div key={i} className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 truncate">
                      • {item}
                    </div>
                  ))}
                </div>
              </div>

              {idx < layersList.length - 1 && (
                <div className="flex justify-center py-1">
                  <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shadow-sm">
                    <ArrowDown className="w-3 h-3 text-cyan-400" />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}


