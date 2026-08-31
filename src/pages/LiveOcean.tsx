import React, { useState, useEffect } from 'react';
import MarineMap from '../components/map/MarineMap';
import { 
  Layers, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Waves, 
  Thermometer, 
  Wind, 
  CloudRain, 
  Compass, 
  Activity,
  Calendar,
  Gauge
} from 'lucide-react';
import { cn } from '@/lib/utils';
import TechnicalLabel from '@/components/hud/TechnicalLabel';

export default function LiveOcean() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeOffset, setTimeOffset] = useState(0); // in hours: -24 to +24
  const [selectedLayers, setSelectedLayers] = useState({
    sst: true,
    chlorophyll: true,
    currents: true,
    waves: true,
    wind: false,
    cyclones: true,
    salinity: false
  });

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeOffset(prev => (prev >= 24 ? -24 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const toggleLayer = (layer: keyof typeof selectedLayers) => {
    setSelectedLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  const getTimeLabel = () => {
    if (timeOffset === 0) return 'Live Telemetry (Real-time)';
    if (timeOffset > 0) return `+${timeOffset}h Physics Model Forecast`;
    return `${timeOffset}h Historical Hindcast`;
  };

  return (
    <div className="flex h-full overflow-hidden relative font-sans select-none bg-[#070D18]">
      
      {/* Ocean Map Centerpiece */}
      <div className="flex-1 relative h-full">
        <MarineMap 
          showSST={selectedLayers.sst} 
          showChlorophyll={selectedLayers.chlorophyll} 
          showVessels={true} 
          showPFZ={true} 
          showGeofence={true} 
        />
        
        {/* Floating Top Telemetry Bar */}
        <div className="absolute top-3.5 left-3.5 z-10 hidden md:flex items-center space-x-2 bg-[#091120]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800 text-xs shadow-md text-slate-300">
          <span className="font-mono text-cyan-400">11.5000° N, 74.1000° E</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">48h Ocean Dynamics</span>
          <span className="text-slate-600">•</span>
          <span className="text-emerald-400 font-medium">Copernicus + ISRO Ingest</span>
        </div>

        {/* Floating 48h Temporal Player Scrubber (Bottom) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xl bg-[#091120]/95 backdrop-blur-md border border-slate-800 p-4 rounded-xl shadow-2xl z-[1000] flex flex-col space-y-3">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold text-white">{getTimeLabel()}</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-mono">
              Timestep: 1h
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => setTimeOffset(prev => Math.max(-24, prev - 6))}
                className="p-1.5 rounded bg-slate-900 text-slate-400 hover:text-white border border-slate-700 hover:border-cyan-500/40 cursor-pointer"
                title="-6 hours"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </button>

              <button 
                onClick={() => setIsPlaying(!isPlaying)} 
                className="p-2 bg-cyan-500 text-slate-950 rounded-lg hover:bg-cyan-400 transition-all shadow-md cursor-pointer"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              </button>

              <button 
                onClick={() => setTimeOffset(prev => Math.min(24, prev + 6))}
                className="p-1.5 rounded bg-slate-900 text-slate-400 hover:text-white border border-slate-700 hover:border-cyan-500/40 cursor-pointer"
                title="+6 hours"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex justify-between text-[11px] text-slate-400 font-medium mb-1">
                <span>-24h (Historical)</span>
                <span className={cn("font-mono font-bold px-1.5 rounded", timeOffset === 0 ? "bg-cyan-500 text-slate-950" : "text-cyan-400")}>
                  {timeOffset >= 0 ? `+${timeOffset}h` : `${timeOffset}h`}
                </span>
                <span>+24h (Forecast)</span>
              </div>
              <input 
                type="range" 
                min="-24" 
                max="24" 
                value={timeOffset}
                onChange={(e) => setTimeOffset(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Layers Panel */}
      <aside className="w-72 bg-[#070D18] border-l border-slate-800 flex flex-col z-[1000] shadow-xl">
        <div className="p-3.5 border-b border-slate-800 bg-[#091120] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h2 className="font-semibold text-xs text-white">Ocean Parameters</h2>
          </div>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 font-medium">
            Live Stream
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3.5 space-y-4 scrollbar-thin">
          
          {/* Satellite Rasters */}
          <div>
            <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Thermometer className="w-3.5 h-3.5 text-rose-400" />
              <span>Satellite Observations</span>
            </h3>
            <div className="space-y-1.5">
              {[
                { id: 'sst', label: 'Sea Surface Temp (SST)', detail: 'INSAT-3DR 1km Resolution' },
                { id: 'chlorophyll', label: 'Chlorophyll-a Bloom', detail: 'Ocean Color Monitor (OCM-3)' },
              ].map(item => (
                <label key={item.id} className="flex items-start justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
                  <div>
                    <span className="text-xs font-medium text-slate-200 block">{item.label}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{item.detail}</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={selectedLayers[item.id as keyof typeof selectedLayers]}
                    onChange={() => toggleLayer(item.id as keyof typeof selectedLayers)}
                    className="mt-0.5 accent-cyan-400 cursor-pointer" 
                  />
                </label>
              ))}
            </div>
          </div>


          {/* Hydrodynamic Models */}
          <div>
            <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Waves className="w-3.5 h-3.5 text-blue-400" />
              <span>Hydrodynamics & Waves</span>
            </h3>
            <div className="space-y-1.5">
              {[
                { id: 'currents', label: 'Surface Current Vectors', detail: 'Speed: 0.8 m/s SE' },
                { id: 'waves', label: 'Significant Wave Height', detail: 'INCOIS Wave Watch III' },
                { id: 'salinity', label: 'Salinity Gradients', detail: '34.8 PSU nominal' }
              ].map(item => (
                <label key={item.id} className="flex items-start justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
                  <div>
                    <span className="text-xs font-medium text-slate-200 block">{item.label}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{item.detail}</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={selectedLayers[item.id as keyof typeof selectedLayers]}
                    onChange={() => toggleLayer(item.id as keyof typeof selectedLayers)}
                    className="mt-0.5 accent-cyan-400 cursor-pointer" 
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Atmospheric & Hazards */}
          <div>
            <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <CloudRain className="w-3.5 h-3.5 text-amber-400" />
              <span>Atmospheric & Weather</span>
            </h3>
            <div className="space-y-1.5">
              {[
                { id: 'wind', label: 'Surface Wind Vectors (10m)', detail: 'IMD WRF model stream' },
                { id: 'cyclones', label: 'Cyclone Track Trajectories', detail: 'Bay of Bengal & Arabian Sea' }
              ].map(item => (
                <label key={item.id} className="flex items-start justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
                  <div>
                    <span className="text-xs font-medium text-slate-200 block">{item.label}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{item.detail}</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={selectedLayers[item.id as keyof typeof selectedLayers]}
                    onChange={() => toggleLayer(item.id as keyof typeof selectedLayers)}
                    className="mt-0.5 accent-cyan-400 cursor-pointer" 
                  />
                </label>
              ))}
            </div>
          </div>
          
        </div>
      </aside>
    </div>
  );
}


