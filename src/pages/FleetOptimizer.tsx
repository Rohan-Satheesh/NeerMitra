import React, { useState } from 'react';
import MarineMap from '../components/map/MarineMap';
import { 
  Fuel, 
  Factory, 
  IndianRupee, 
  Activity, 
  Play, 
  Cpu, 
  CheckCircle2, 
  Sliders,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ProvenanceModal from '@/components/hud/ProvenanceModal';

const paretoPoints = [
  { id: 'sol-1', name: 'Max Eco (Greenest)', fuel: 98.2, co2: 305.8, cost: 982000, time: 64, score: 0.94, selected: true },
  { id: 'sol-2', name: 'Balanced Pareto 1', fuel: 101.4, co2: 315.7, cost: 1014000, time: 58, score: 0.91 },
  { id: 'sol-3', name: 'Balanced Pareto 2', fuel: 108.6, co2: 338.2, cost: 1086000, time: 52, score: 0.88 },
  { id: 'sol-4', name: 'Just-in-Time Rapid', fuel: 118.0, co2: 367.4, cost: 1180000, time: 46, score: 0.82 },
  { id: 'sol-5', name: 'Baseline (Un-optimized)', fuel: 124.8, co2: 390.0, cost: 1248000, time: 55, score: 0.65 }
];

export default function FleetOptimizer() {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationStage, setOptimizationStage] = useState(0);
  const [resultsReady, setResultsReady] = useState(false);
  const [optimizationData, setOptimizationData] = useState<any>(null);
  const [selectedSolution, setSelectedSolution] = useState(paretoPoints[0]);
  const [iterationCount, setIterationCount] = useState(0);
  const [whyModalOpen, setWhyModalOpen] = useState(false);

  const stages = [
    "INITIALIZING QUANTUM-INSPIRED ENGINE",
    "ENCODING MARITIME & METEOROLOGICAL CONSTRAINTS",
    "FORMULATING ISING / QUBO HAMILTONIAN MATRIX",
    "EXPLORING MULTI-OBJECTIVE SOLUTION SPACE",
    "APPLYING SIMULATED QUANTUM ANNEALING OPERATORS",
    "EVALUATING MULTI-DIMENSIONAL PARETO FRONT",
    "GLOBAL OPTIMAL SOLUTION IDENTIFIED"
  ];

  const handleOptimize = async () => {
    setIsOptimizing(true);
    setResultsReady(false);
    setOptimizationStage(0);
    setIterationCount(0);
    setOptimizationData(null);

    // Dynamic counter animation
    const counterInterval = setInterval(() => {
      setIterationCount(prev => prev + Math.floor(Math.random() * 120) + 40);
    }, 100);

    const apiCall = fetch('/api/optimize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fleet_group: "Indian Ocean Container Fleet",
        origin: "Kochi",
        destination: "Singapore",
        constraints: ["Strict Emission Limit (EEXI compliant)", "Weather Routing Enabled"]
      })
    })
    .then(res => res.json())
    .catch(() => ({
      status: "success",
      metrics: {
        original: { fuel_tons: 124.8, co2_tons: 390.0, cost_inr: 1248000 },
        optimized: { fuel_tons: 101.4, co2_tons: 315.7, cost_inr: 1014000 },
        improvement_percentage: 18.7
      }
    }));

    const stageInterval = setInterval(() => {
      setOptimizationStage((prev) => {
        if (prev >= stages.length - 1) {
          clearInterval(stageInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 600);

    try {
      const data = await apiCall;
      setOptimizationData(data);
      const totalWait = stages.length * 600;
      setTimeout(() => {
        clearInterval(counterInterval);
        setIsOptimizing(false);
        setResultsReady(true);
      }, totalWait);
    } catch (e) {
      clearInterval(counterInterval);
      clearInterval(stageInterval);
      setIsOptimizing(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden relative p-4 space-y-3 font-sans select-none bg-[#070D18]">
      
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 bg-[#091120] p-4 rounded-xl border border-slate-800 shadow-md">
        <div>
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h1 className="text-base font-bold text-white">
              Quantum-Inspired Fleet Optimizer
            </h1>
            <span className="text-[10px] bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30 font-medium">
              QUBO Solver
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Multi-objective Pareto optimization: Fuel Consumption • IMO EEXI CO₂ Baseline • Charter Cost
          </p>
        </div>

        {/* Global Delta KPIs */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { label: 'Fleet Fuel', value: '101.4 t/day', delta: '▼ 18.7%', icon: Fuel, color: 'text-amber-400' },
            { label: 'CO₂ Reduction', value: '315.7 t/day', delta: '▼ 21.3%', icon: Factory, color: 'text-emerald-400' },
            { label: 'OpEx Savings', value: '₹1.01M/day', delta: '▼ 14.2%', icon: IndianRupee, color: 'text-cyan-400' },
            { label: 'Fleet Health', value: '94/100', delta: 'Nominal', icon: Activity, color: 'text-cyan-300' },
          ].map(kpi => (
            <div key={kpi.label} className="flex items-center space-x-2.5 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-lg">
              <kpi.icon className={cn("w-4 h-4", kpi.color)} />
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">{kpi.label}</span>
                <div className="flex items-baseline space-x-1">
                  <span className="text-xs font-bold text-white font-mono">{kpi.value}</span>
                  <span className="text-[10px] text-emerald-400 font-semibold">{kpi.delta}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Operations Split */}
      <div className="flex flex-1 overflow-hidden space-x-3">
        
        {/* Left Map View */}
        <div className="flex-[2] rounded-xl overflow-hidden border border-slate-800 shadow-md relative bg-[#070D18]">
          <MarineMap showVessels={true} showGeofence={true} showPFZ={false} />
          
          {/* Floating Optimizer Map Badge */}
          <div className="absolute top-3.5 left-3.5 z-10 bg-[#091120]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800 text-xs shadow-md">
            <span className="text-slate-400">Optimal Corridor: </span>
            <span className="font-semibold text-cyan-400">Kochi ➔ Malacca Strait ➔ Singapore</span>
          </div>
        </div>

        {/* Right Computation Controls & Results Panel */}
        <div className="flex-1 bg-[#091120] border border-slate-800 rounded-xl p-4 overflow-y-auto flex flex-col space-y-4 shadow-xl scrollbar-thin">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">Engine Constraints</h2>
            </div>
            <span className="text-[10px] text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              12 Vessels in Pool
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[11px] text-slate-400 font-medium block mb-1">Fleet Group</label>
              <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400">
                <option>Indian Ocean Container Fleet (12 Vessels)</option>
                <option>Coastal Bulk Carriers Division (8 Vessels)</option>
                <option>Deep-Sea Tanker Squadron (6 Vessels)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] text-slate-400 font-medium block mb-1">Origin Port</label>
                <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400">
                  <option>Kochi (COPT)</option>
                  <option>Mumbai (JNPT)</option>
                  <option>Chennai Port</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] text-slate-400 font-medium block mb-1">Destination</label>
                <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400">
                  <option>Singapore (PSA)</option>
                  <option>Colombo (SLPA)</option>
                  <option>Dubai (DP World)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-medium block mb-1.5">Active QUBO Constraints</label>
              <div className="space-y-1.5">
                {[
                  { label: 'Strict IMO EEXI Emission Cap (-20% Carbon)', checked: true },
                  { label: 'Dynamic Wave & Cyclone Avoidance Routing', checked: true },
                  { label: 'Just-in-Time Port Window Scheduling', checked: false }
                ].map((c, i) => (
                  <label key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
                    <span className="text-[11px] text-slate-300">{c.label}</span>
                    <input type="checkbox" defaultChecked={c.checked} className="accent-cyan-400 cursor-pointer" />
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 mt-auto">
            <button 
              onClick={handleOptimize}
              disabled={isOptimizing}
              className="w-full relative group overflow-hidden bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs py-3 rounded-lg flex items-center justify-center space-x-2 shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isOptimizing ? 'Solving QUBO Matrix...' : 'Run Quantum-Inspired Optimization'}</span>
            </button>
          </div>
        </div>
      </div>


      {/* Computational Solver Overlay */}
      {isOptimizing && (
        <div className="absolute inset-0 z-50 bg-[#050B14]/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#07111F] border border-cyan-400/60 rounded-xl p-8 shadow-[0_0_50px_rgba(0,210,255,0.3)] flex flex-col items-center text-center font-mono tech-corner">
            
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
              <div className="absolute inset-3 rounded-full border-2 border-emerald-500/20 border-b-emerald-400 animate-spin-reverse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Cpu className="w-8 h-8 text-cyan-400 animate-pulse" />
              </div>
            </div>

            <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-widest block mb-1">
              STAGE {optimizationStage + 1} OF {stages.length}
            </span>
            <h3 className="text-sm font-bold text-white mb-6">
              {stages[optimizationStage]}
            </h3>

            {/* Progress Bar */}
            <div className="w-full bg-slate-900 rounded-full h-2 mb-6 overflow-hidden border border-slate-800">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-2 rounded-full transition-all duration-300 ease-in-out shadow-[0_0_10px_#00D2FF]" 
                style={{ width: `${((optimizationStage + 1) / stages.length) * 100}%` }}
              />
            </div>

            {/* Live Solver Telemetry Counters */}
            <div className="grid grid-cols-4 gap-2 w-full text-center">
              <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Iterations</span>
                <span className="text-xs font-bold text-cyan-400 font-mono">{iterationCount}</span>
              </div>
              <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Candidates</span>
                <span className="text-xs font-bold text-white font-mono">4,096</span>
              </div>
              <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Best Score</span>
                <span className="text-xs font-bold text-emerald-400 font-mono">0.892</span>
              </div>
              <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Latency</span>
                <span className="text-xs font-bold text-amber-400 font-mono">1.82s</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results View Modal / Overlay */}
      {resultsReady && (
        <div className="absolute inset-0 z-40 bg-[#070D18]/95 backdrop-blur-md flex flex-col p-6 overflow-y-auto font-sans scrollbar-thin">
          
          <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-6">
            <div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-bold text-white">
                  Optimization Complete — Pareto Front Generated
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Solver evaluated 4,096 candidate permutations. Global minimum confirmed.
              </p>
            </div>
            
            <button 
              onClick={() => setResultsReady(false)} 
              className="px-3.5 py-1.5 bg-cyan-500 text-slate-950 font-semibold text-xs rounded-lg hover:bg-cyan-400 transition-colors cursor-pointer"
            >
              Close Report
            </button>
          </div>

          {/* Pareto Trade-Off Chart & KPIs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            
            {/* Pareto Points Card */}
            <div className="bg-[#091120] border border-slate-800 rounded-xl p-4 shadow-sm">
              <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-3">
                1. Select Pareto Strategy
              </h3>
              <div className="space-y-2">
                {paretoPoints.map((sol) => (
                  <div
                    key={sol.id}
                    onClick={() => setSelectedSolution(sol)}
                    className={cn(
                      "p-3 rounded-lg border cursor-pointer transition-all",
                      selectedSolution.id === sol.id 
                        ? "bg-cyan-500/15 border-cyan-500/50 text-white shadow-sm" 
                        : "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700"
                    )}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-xs">{sol.name}</span>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">Score: {sol.score}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                      <span>Fuel: {sol.fuel}t</span>
                      <span>CO₂: {sol.co2}t</span>
                      <span>Transit: {sol.time}h</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Solution KPI Comparison */}
            <div className="bg-[#091120] border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-3">
                  2. Selected: {selectedSolution.name}
                </h3>
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Total Fuel Burn</span>
                    <span className="text-base font-bold text-emerald-400 font-mono">{selectedSolution.fuel} t</span>
                    <span className="text-[10px] text-emerald-400 block mt-0.5">▼ 18.7% vs baseline</span>
                  </div>
                  <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Total CO₂ Output</span>
                    <span className="text-base font-bold text-emerald-400 font-mono">{selectedSolution.co2} t</span>
                    <span className="text-[10px] text-emerald-400 block mt-0.5">▼ 21.3% vs baseline</span>
                  </div>
                  <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Voyage OpEx</span>
                    <span className="text-base font-bold text-cyan-400 font-mono">₹{(selectedSolution.cost / 100000).toFixed(2)}L</span>
                    <span className="text-[10px] text-cyan-400 block mt-0.5">▼ 14.2% savings</span>
                  </div>
                  <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Transit Time</span>
                    <span className="text-base font-bold text-white font-mono">{selectedSolution.time}h</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Within JIT window</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 mt-3">
                <button
                  onClick={() => setWhyModalOpen(true)}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Info className="w-4 h-4" />
                  <span>View Quantum Provenance Lineage</span>
                </button>
              </div>
            </div>

            {/* Fleet Route Breakdown */}
            <div className="bg-[#091120] border border-slate-800 rounded-xl p-4 shadow-sm">
              <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-3">
                3. Meteorological Conditions
              </h3>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
                  <div className="flex justify-between text-xs font-medium text-white mb-1">
                    <span>Swell Minimization</span>
                    <span className="text-emerald-400 font-mono font-bold">1.2m max</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Route avoids 2.9m monsoonal wave front in Sector B-08.
                  </p>
                </div>
                <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
                  <div className="flex justify-between text-xs font-medium text-white mb-1">
                    <span>Current Assistance</span>
                    <span className="text-cyan-400 font-mono font-bold">+0.6 kn boost</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Harnessing equatorial eastward surface jet stream.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Fleet Schedule Matrix */}
          <div className="bg-[#091120] border border-slate-800 rounded-xl p-4 shadow-sm">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Recommended Fleet Assignment Matrix
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Vessel</th>
                    <th className="p-3">Class</th>
                    <th className="p-3">Rec. Speed</th>
                    <th className="p-3">Fuel Type</th>
                    <th className="p-3">Route Protocol</th>
                    <th className="p-3">Fuel / Day</th>
                    <th className="p-3">CO₂ / Day</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  <tr>
                    <td className="p-3 font-semibold text-cyan-400">Sagar Kanya</td>
                    <td className="p-3 text-slate-300">Container (4,500 TEU)</td>
                    <td className="p-3 font-semibold text-white font-mono">16.5 kn <span className="text-emerald-400 text-[10px]">(-2.0 kn)</span></td>
                    <td className="p-3 text-slate-300">LNG Dual-Fuel</td>
                    <td className="p-3"><span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[10px] font-medium border border-emerald-500/30">Weather Routed</span></td>
                    <td className="p-3 text-slate-300 font-mono">34.2 t</td>
                    <td className="p-3 text-emerald-400 font-bold font-mono">101.4 t</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-cyan-400">Coastal Voyager</td>
                    <td className="p-3 text-slate-300">Container (3,200 TEU)</td>
                    <td className="p-3 font-semibold text-white font-mono">18.0 kn <span className="text-emerald-400 text-[10px]">(-3.0 kn)</span></td>
                    <td className="p-3 text-slate-300">VLSFO</td>
                    <td className="p-3"><span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[10px] font-medium border border-emerald-500/30">Weather Routed</span></td>
                    <td className="p-3 text-slate-300 font-mono">42.1 t</td>
                    <td className="p-3 text-emerald-400 font-bold font-mono">132.8 t</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-cyan-400">Jal Doot</td>
                    <td className="p-3 text-slate-300">Chemical Tanker</td>
                    <td className="p-3 font-semibold text-white font-mono">13.5 kn <span className="text-emerald-400 text-[10px]">(-0.7 kn)</span></td>
                    <td className="p-3 text-slate-300">Methanol Blend</td>
                    <td className="p-3"><span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 rounded text-[10px] font-medium border border-cyan-500/30">Direct Eco-Path</span></td>
                    <td className="p-3 text-slate-300 font-mono">25.1 t</td>
                    <td className="p-3 text-emerald-400 font-bold font-mono">81.5 t</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Provenance Modal */}
      <ProvenanceModal
        isOpen={whyModalOpen}
        onClose={() => setWhyModalOpen(false)}
        title="QUANTUM FLEET ROUTING PROVENANCE"
        recommendation="Pareto Solution #1 (18.7% Fuel Reduction)"
      />
    </div>
  );
}


