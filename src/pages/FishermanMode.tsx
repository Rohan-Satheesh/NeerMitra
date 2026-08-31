import React, { useState, useEffect } from 'react';
import MarineMap from '../components/map/MarineMap';
import { ShieldAlert, Wind, Waves, Thermometer, AlertTriangle, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FishermanMode() {
  const [pfzs, setPfzs] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/pfz').then(res => res.json()).then(data => setPfzs(data.pfz || [])).catch(() => {});
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden relative">
      {/* Left Panel - Dashboard & PFZs */}
      <div className="w-full md:w-[400px] bg-surface-elevated border-r border-border flex flex-col h-full overflow-y-auto z-10 flex-shrink-0">
        
        {/* Marine Safety Banner */}
        <div className="p-6 border-b border-border bg-surface">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Marine Safety Status</h2>
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 rounded-full border-4 border-green-500 flex items-center justify-center bg-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
              <span className="text-xl font-bold text-green-500">24</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-500">LOW RISK</p>
              <p className="text-sm text-muted-foreground">Safe for coastal and deep sea operations.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Wind className="w-4 h-4 text-primary" />
              <div>
                <p className="text-[10px] uppercase text-muted-foreground">Wind</p>
                <p className="text-sm font-semibold">12 km/h</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Waves className="w-4 h-4 text-cyan" />
              <div>
                <p className="text-[10px] uppercase text-muted-foreground">Wave Height</p>
                <p className="text-sm font-semibold">1.2 m</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Thermometer className="w-4 h-4 text-warning" />
              <div>
                <p className="text-[10px] uppercase text-muted-foreground">Temperature</p>
                <p className="text-sm font-semibold">28°C</p>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts Section */}
        <div className="p-6 border-b border-border">
          <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-warning"></div>
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-warning mb-1 uppercase tracking-wider">High Wave Alert</h3>
                <p className="text-sm text-foreground mb-3">Wave conditions are expected to increase in the selected region (15N, 71E) after 14:00 hrs.</p>
                <div className="flex space-x-3">
                  <button className="text-xs font-semibold bg-warning text-warning-foreground px-3 py-1.5 rounded hover:bg-warning/90 transition-colors">View Safe Route</button>
                  <button className="text-xs font-semibold border border-warning/50 text-warning px-3 py-1.5 rounded hover:bg-warning/20 transition-colors">Dismiss</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PFZ Cards */}
        <div className="p-6 flex-1">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Potential Fishing Zones</h2>
          
          <div className="space-y-4">
            {pfzs.map((pfz) => (
              <div key={pfz.id} className="bg-surface border border-border rounded-lg p-4 hover:border-primary/50 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-sm font-bold text-green-500">HIGH POTENTIAL ZONE</h3>
                  <span className="text-xs font-mono bg-primary/20 text-primary px-2 py-0.5 rounded">{pfz.probability}%</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                  <div>
                    <span className="text-xs text-muted-foreground block">Distance</span>
                    <span className="font-semibold text-foreground">{pfz.distance} km</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Productivity</span>
                    <span className="font-semibold text-foreground">HIGH</span>
                  </div>
                </div>

                <div className="space-y-1 mb-4">
                  <p className="text-xs text-muted-foreground"><span className="text-green-500 font-bold mr-2">✓</span> SST favorable ({pfz.sst}°C)</p>
                  <p className="text-xs text-muted-foreground"><span className="text-green-500 font-bold mr-2">✓</span> Chlorophyll ({pfz.chl})</p>
                  <p className="text-xs text-muted-foreground"><span className="text-green-500 font-bold mr-2">✓</span> Wave conditions safe</p>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 flex items-center justify-center space-x-1 bg-primary text-primary-foreground text-xs font-semibold py-2 rounded transition-colors hover:bg-primary/90">
                    <Navigation className="w-3 h-3" />
                    <span>Navigate</span>
                  </button>
                  <button className="flex-1 bg-surface-elevated border border-border text-foreground text-xs font-semibold py-2 rounded transition-colors hover:bg-muted">
                    Why?
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Main Map Area */}
      <div className="flex-1 relative">
        <MarineMap showVessels={false} showGeofence={true} showPFZ={true} showSST={true} />
      </div>
    </div>
  );
}
