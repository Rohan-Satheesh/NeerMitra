import React, { useState } from 'react';
import MarineMap from '../components/map/MarineMap';
import { Fuel, Factory, IndianRupee, Activity, Play, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FleetOptimizer() {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationStage, setOptimizationStage] = useState(0);
  const [resultsReady, setResultsReady] = useState(false);
  const [optimizationData, setOptimizationData] = useState<any>(null);

  const stages = [
    "INITIALIZING OPTIMIZER",
    "ENCODING VARIABLES",
    "FORMULATING QUBO",
    "EXPLORING SOLUTION SPACE",
    "APPLYING QUANTUM-INSPIRED OPERATORS",
    "EVALUATING PARETO SOLUTIONS",
    "OPTIMAL SOLUTION FOUND"
  ];

  const handleOptimize = async () => {
    setIsOptimizing(true);
    setResultsReady(false);
    setOptimizationStage(0);
    setOptimizationData(null);

    // Start optimization API call in background
    const apiCall = fetch('/api/optimize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fleet_group: "Indian Ocean Container Fleet",
        origin: "Kochi",
        destination: "Singapore",
        constraints: ["Strict Emission Limit (EEXI compliant)", "Weather Routing Enabled"]
      })
    }).then(res => res.json());

    const interval = setInterval(() => {
      setOptimizationStage((prev) => {
        if (prev >= stages.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 800);

    try {
      const data = await apiCall;
      setOptimizationData(data);
      // Wait for animation to finish
      const waitTime = Math.max(0, (stages.length * 800) - 800);
      setTimeout(() => {
        setIsOptimizing(false);
        setResultsReady(true);
      }, waitTime);
    } catch (e) {
      console.error(e);
      clearInterval(interval);
      setIsOptimizing(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden relative p-4 space-y-4">
      {/* Header & KPIs */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Green Fleet Command</h1>
          <p className="text-sm text-muted-foreground font-mono">AI-powered vessel and route optimization</p>
        </div>
        <div className="flex space-x-4">
          {[
            { label: 'Fleet Fuel', value: '124.8 t/day', icon: Fuel, color: 'text-warning' },
            { label: 'CO₂ Emissions', value: '390 t/day', icon: Factory, color: 'text-destructive' },
            { label: 'Cost', value: '₹1.2M/day', icon: IndianRupee, color: 'text-muted-foreground' },
            { label: 'Efficiency Score', value: '72/100', icon: Activity, color: 'text-primary' },
          ].map(kpi => (
            <div key={kpi.label} className="flex items-center space-x-3 bg-surface border border-border px-4 py-2 rounded-lg">
              <kpi.icon className={cn("w-5 h-5", kpi.color)} />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-muted-foreground tracking-wider font-semibold">{kpi.label}</span>
                <span className="text-sm font-bold text-foreground">{kpi.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden space-x-4">
        {/* Map Area */}
        <div className="flex-[2] rounded-xl overflow-hidden border border-border shadow-[0_0_20px_rgba(3,7,18,0.5)]">
          <MarineMap showVessels={true} showGeofence={false} showPFZ={false} />
        </div>

        {/* Controls Panel */}
        <div className="flex-1 bg-surface-elevated border border-border rounded-xl p-6 overflow-y-auto flex flex-col space-y-6">
          <div className="flex items-center space-x-2 border-b border-border pb-3">
            <Settings2 className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Optimization Parameters</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs uppercase text-muted-foreground font-semibold tracking-wider">Fleet Group</label>
              <select className="mt-1 w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary">
                <option>Indian Ocean Container Fleet</option>
                <option>Coastal Bulk Carriers</option>
                <option>Tanker Division Alpha</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase text-muted-foreground font-semibold tracking-wider">Origin</label>
                <select className="mt-1 w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary">
                  <option>Kochi</option>
                  <option>Mumbai</option>
                  <option>Chennai</option>
                </select>
              </div>
              <div>
                <label className="text-xs uppercase text-muted-foreground font-semibold tracking-wider">Destination</label>
                <select className="mt-1 w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary">
                  <option>Singapore</option>
                  <option>Colombo</option>
                  <option>Dubai</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs uppercase text-muted-foreground font-semibold tracking-wider mb-2 block">Constraints</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm cursor-pointer">
                  <input type="checkbox" className="rounded border-border text-primary focus:ring-primary bg-background" defaultChecked />
                  <span>Strict Emission Limit (EEXI compliant)</span>
                </label>
                <label className="flex items-center space-x-2 text-sm cursor-pointer">
                  <input type="checkbox" className="rounded border-border text-primary focus:ring-primary bg-background" defaultChecked />
                  <span>Weather Routing Enabled</span>
                </label>
                <label className="flex items-center space-x-2 text-sm cursor-pointer">
                  <input type="checkbox" className="rounded border-border text-primary focus:ring-primary bg-background" />
                  <span>Priority Schedule (Just-in-Time)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-auto">
            <button 
              onClick={handleOptimize}
              className="w-full relative group overflow-hidden bg-primary text-primary-foreground font-bold text-sm py-4 rounded-lg flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(14,165,233,0.4)] hover:bg-primary/90 transition-all"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>RUN QUANTUM-INSPIRED OPTIMIZATION</span>
            </button>
          </div>
        </div>
      </div>

      {/* Optimization Overlay */}
      {isOptimizing && (
        <div className="absolute inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center">
          <div className="w-[500px] bg-surface-elevated border border-border rounded-xl p-8 shadow-2xl flex flex-col items-center">
            <div className="w-24 h-24 rounded-full border-4 border-muted border-t-primary animate-spin mb-6 shadow-[0_0_15px_rgba(14,165,233,0.5)]"></div>
            <h3 className="text-xl font-mono text-cyan glow-cyan mb-8 text-center">{stages[optimizationStage]}</h3>
            <div className="w-full bg-surface rounded-full h-2 mb-4 overflow-hidden border border-border">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out" 
                style={{ width: `${(optimizationStage / (stages.length - 1)) * 100}%` }}
              ></div>
            </div>
            <p className="text-muted-foreground text-xs font-mono uppercase">Processing telemetry & physics models...</p>
          </div>
        </div>
      )}

      {/* Results Modal / Overlay */}
      {resultsReady && (
        <div className="absolute inset-0 z-40 bg-background/95 flex flex-col p-8 overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">Optimization Results</h2>
            <button onClick={() => setResultsReady(false)} className="text-muted-foreground hover:text-white">Close</button>
          </div>
          
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-surface-elevated border border-border rounded-xl p-6">
              <h3 className="text-muted-foreground font-semibold uppercase text-xs tracking-widest mb-4">Before Optimization</h3>
              <div className="space-y-2 font-mono">
                <p>Fuel: <span className="text-destructive">{optimizationData?.metrics.original.fuel_tons || 124.8} tons</span></p>
                <p>CO₂: <span className="text-destructive">{optimizationData?.metrics.original.co2_tons || 390} tons</span></p>
                <p>Cost: <span className="text-destructive">₹{optimizationData?.metrics.original.cost_inr.toLocaleString() || '1.24M'}</span></p>
              </div>
            </div>
            <div className="bg-surface-elevated border border-primary/50 shadow-[0_0_20px_rgba(14,165,233,0.2)] rounded-xl p-6">
              <h3 className="text-primary font-semibold uppercase text-xs tracking-widest mb-4">After Optimization</h3>
              <div className="space-y-2 font-mono">
                <p>Fuel: <span className="text-green-500">{optimizationData?.metrics.optimized.fuel_tons || 101.4} tons</span></p>
                <p>CO₂: <span className="text-green-500">{optimizationData?.metrics.optimized.co2_tons || 317} tons</span></p>
                <p>Cost: <span className="text-green-500">₹{optimizationData?.metrics.optimized.cost_inr.toLocaleString() || '1.01M'}</span></p>
              </div>
            </div>
            <div className="bg-surface-elevated border border-border rounded-xl p-6 flex flex-col justify-center items-center">
              <h3 className="text-muted-foreground font-semibold uppercase text-xs tracking-widest mb-4">Improvements</h3>
              <p className="text-3xl font-bold text-green-500 mb-1">{optimizationData?.metrics.improvement_percentage || 18.7}% <span className="text-sm font-normal text-muted-foreground">less fuel</span></p>
              <p className="text-3xl font-bold text-green-500">{optimizationData?.metrics.improvement_percentage || 18.7}% <span className="text-sm font-normal text-muted-foreground">less CO₂</span></p>
            </div>
          </div>

          <div className="bg-surface-elevated border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Recommended Fleet Mix</h3>
            <table className="w-full text-left text-sm">
              <thead className="bg-surface text-muted-foreground font-mono text-xs uppercase">
                <tr>
                  <th className="p-3 rounded-tl-lg">Vessel</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Rec. Speed</th>
                  <th className="p-3">Fuel</th>
                  <th className="p-3">Route Status</th>
                  <th className="p-3">Fuel/Day</th>
                  <th className="p-3 rounded-tr-lg">CO₂/Day</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="p-3 font-semibold text-primary">Sagar Kanya</td>
                  <td className="p-3">Container</td>
                  <td className="p-3">16.5 kn <span className="text-green-500 text-xs">(-2.0)</span></td>
                  <td className="p-3">LNG</td>
                  <td className="p-3 text-green-500">Weather Routed</td>
                  <td className="p-3">34.2 t</td>
                  <td className="p-3">101.4 t</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="p-3 font-semibold text-primary">Coastal Voyager</td>
                  <td className="p-3">Container</td>
                  <td className="p-3">18.0 kn <span className="text-green-500 text-xs">(-3.0)</span></td>
                  <td className="p-3">VLSFO</td>
                  <td className="p-3 text-green-500">Weather Routed</td>
                  <td className="p-3">42.1 t</td>
                  <td className="p-3">132.8 t</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-primary">Jal Doot</td>
                  <td className="p-3">Tanker</td>
                  <td className="p-3">13.5 kn <span className="text-green-500 text-xs">(-0.7)</span></td>
                  <td className="p-3">Methanol</td>
                  <td className="p-3 text-muted-foreground">Direct</td>
                  <td className="p-3">25.1 t</td>
                  <td className="p-3">82.8 t</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
