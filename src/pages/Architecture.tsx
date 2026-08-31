import React from 'react';
import { Layers, Database, Cpu, BrainCircuit, MonitorSmartphone, ArrowDown } from 'lucide-react';

const layers = [
  { id: 'L1', name: 'DATA INGESTION', icon: Database, items: ['Satellite Data (SST, Chl)', 'Weather Forecasts', 'AIS Telemetry', 'Marine Advisories'], color: 'text-cyan' },
  { id: 'L2', name: 'DATA PROCESSING', icon: Layers, items: ['ETL Pipelines', 'Geospatial Engine', 'Feature Store', 'Data Cleaning'], color: 'text-primary' },
  { id: 'L3', name: 'INTELLIGENCE', icon: Cpu, items: ['ML/DL Models', 'PFZ Prediction', 'Fuel Prediction', 'Quantum-Inspired Opt.'], color: 'text-green-500' },
  { id: 'L4', name: 'AGENTIC ORCHESTRATION', icon: BrainCircuit, items: ['Planner Agent', 'Marine Specialist Agents', 'Risk Assessor', 'Explainability Engine'], color: 'text-warning' },
  { id: 'L5', name: 'PRESENTATION', icon: MonitorSmartphone, items: ['Web Command Center', 'Fisherman PWA / Mobile', 'Voice Interfaces', 'SMS Alerts'], color: 'text-foreground' },
];

export default function Architecture() {
  return (
    <div className="p-6 h-full overflow-y-auto flex flex-col items-center">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-foreground">System Architecture</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">A 5-layer architecture designed for scalable marine intelligence, integrating raw satellite telemetry down to edge-delivered insights.</p>
      </div>

      <div className="w-full max-w-4xl space-y-4 relative pb-12">
        {/* Connecting Line */}
        <div className="absolute left-1/2 top-0 bottom-12 w-px bg-primary/30 -translate-x-1/2 z-0"></div>

        {layers.map((layer, idx) => (
          <div key={layer.id} className="relative z-10 flex flex-col items-center">
            <div className="bg-surface-elevated border border-border rounded-xl p-6 w-full shadow-lg relative overflow-hidden group hover:border-primary/50 transition-colors">
              <div className="absolute top-0 left-0 w-2 h-full bg-border group-hover:bg-primary transition-colors"></div>
              
              <div className="flex items-start space-x-6">
                <div className="flex flex-col items-center justify-center w-24 h-24 rounded-lg bg-surface border border-border flex-shrink-0">
                  <layer.icon className={`w-8 h-8 ${layer.color} mb-2`} />
                  <span className={`font-mono font-bold text-xl ${layer.color}`}>{layer.id}</span>
                </div>
                
                <div className="flex-1 py-2">
                  <h2 className="text-lg font-bold tracking-widest uppercase mb-4 text-foreground">{layer.name}</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {layer.items.map((item, i) => (
                      <div key={i} className="flex items-center space-x-2 text-sm text-muted-foreground bg-background px-3 py-2 rounded border border-border">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {idx !== layers.length - 1 && (
              <div className="py-4">
                <div className="w-8 h-8 rounded-full bg-surface border border-primary/50 flex items-center justify-center shadow-[0_0_15px_rgba(14,165,233,0.3)]">
                  <ArrowDown className="w-4 h-4 text-primary" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
