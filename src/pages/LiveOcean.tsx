import React, { useState } from 'react';
import MarineMap from '../components/map/MarineMap';
import { Layers, Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LiveOcean() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeIndex, setTimeIndex] = useState(0);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex h-full overflow-hidden relative">
      
      {/* Map Area */}
      <div className="flex-1 relative">
        <MarineMap showSST={true} showChlorophyll={true} showVessels={true} showPFZ={false} showGeofence={false} />
        
        {/* Floating Time Slider */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-surface-elevated/90 backdrop-blur-md border border-border p-4 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.8)] z-[1000] flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors"><SkipBack className="w-5 h-5" /></button>
            <button onClick={togglePlay} className="p-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors shadow-lg">
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            </button>
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors"><SkipForward className="w-5 h-5" /></button>
          </div>
          
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between text-xs font-mono text-muted-foreground mb-2">
              <span>-24h</span>
              <span className="text-primary font-bold">Now</span>
              <span>+24h Forecast</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={timeIndex}
              onChange={(e) => setTimeIndex(Number(e.target.value))}
              className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer accent-primary" 
            />
          </div>
        </div>
      </div>

      {/* Sidebar Layers Panel */}
      <div className="w-80 bg-surface-elevated border-l border-border flex flex-col z-[1000]">
        <div className="p-4 border-b border-border flex items-center space-x-2">
          <Layers className="w-5 h-5 text-primary" />
          <h2 className="font-bold text-lg">Ocean Intelligence</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Satellite</h3>
            <div className="space-y-2">
              {['Sea Surface Temp (SST)', 'Chlorophyll-a', 'Cloud Cover', 'Lightning Strikes'].map(l => (
                <label key={l} className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" className="rounded border-border text-primary focus:ring-primary bg-background" defaultChecked={l.includes('Temp') || l.includes('Chlorophyll')} />
                  <span className="text-sm">{l}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Ocean Dynamics</h3>
            <div className="space-y-2">
              {['Surface Currents', 'Wave Height', 'Salinity'].map(l => (
                <label key={l} className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" className="rounded border-border text-primary focus:ring-primary bg-background" />
                  <span className="text-sm">{l}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Weather</h3>
            <div className="space-y-2">
              {['Wind Vectors', 'Cyclone Tracks', 'Precipitation'].map(l => (
                <label key={l} className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" className="rounded border-border text-primary focus:ring-primary bg-background" />
                  <span className="text-sm">{l}</span>
                </label>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
