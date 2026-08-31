import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, 
  MessageSquare, 
  Database, 
  CloudRain, 
  Waves, 
  ShieldAlert, 
  Map, 
  Ship, 
  LineChart, 
  Info,
  Cpu,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import DataStream, { type LogEntry } from '@/components/hud/DataStream';

interface AgentInfo {
  id: string;
  label: string;
  role: string;
  icon: React.ElementType;
  status: 'IDLE' | 'PROCESSING' | 'COMPLETE' | 'QUEUED';
  inputs: string[];
  outputs: string[];
  latency: string;
  throughput: string;
  memory: string;
  description: string;
  subscribers: string[];
}

const agentsList: AgentInfo[] = [
  { 
    id: 'planner', 
    label: 'Planner / Orchestrator', 
    role: 'Core Coordination Swarm Lead',
    icon: BrainCircuit, 
    status: 'PROCESSING',
    inputs: ['User Query', 'Marine Telemetry Streams', 'Vessel States'],
    outputs: ['Multi-Agent Execution DAG', 'Task Delegations'],
    latency: '112ms',
    throughput: '240 req/min',
    memory: '34 MB',
    description: 'Dynamic graph scheduler responsible for breaking complex maritime intents into specialized agent sub-tasks.',
    subscribers: ['Language & Intent', 'Marine Data Discovery', 'Risk Assessment']
  },
  { 
    id: 'language', 
    label: 'Language & Intent', 
    role: 'Natural Language Understanding',
    icon: MessageSquare, 
    status: 'COMPLETE',
    inputs: ['Natural Language Prompts', 'Voice Audio Transcription'],
    outputs: ['Structured Intent Vector', 'Temporal & Spatial Anchors'],
    latency: '85ms',
    throughput: '180 req/min',
    memory: '28 MB',
    description: 'Translates colloquial fisherman queries and fleet commander directives into formal spatial-temporal constraints.',
    subscribers: ['Planner / Orchestrator']
  },
  { 
    id: 'marine_data', 
    label: 'Marine Data Discovery', 
    role: 'Multi-Source Telemetry Ingestion',
    icon: Database, 
    status: 'PROCESSING',
    inputs: ['MOSDAC INSAT-3DR', 'INCOIS Advisories', 'AIS Feeds'],
    outputs: ['Normalized GeoJSON Feature Collections', 'Raster Grids'],
    latency: '182ms',
    throughput: '512 req/min',
    memory: '64 MB',
    description: 'Fetches, sanitizes, and indexes distributed satellite and coastal sensor feeds into unified tensors.',
    subscribers: ['Ocean Analytics', 'Weather Intelligence', 'Geospatial Reasoning']
  },
  { 
    id: 'weather', 
    label: 'Weather Intelligence', 
    role: 'Meteorological Risk Inference',
    icon: CloudRain, 
    status: 'COMPLETE',
    inputs: ['IMD WRF 3km', 'ECMWF Wind Vectors', 'Convective Storm Cells'],
    outputs: ['Squall Line Alerts', 'Wave Shear Predictions'],
    latency: '145ms',
    throughput: '320 req/min',
    memory: '42 MB',
    description: 'Evaluates tropical storm tracks, sudden squalls, and monsoonal fronts for vessel transit safety.',
    subscribers: ['Risk Assessment', 'Fleet Optimization']
  },
  { 
    id: 'ocean', 
    label: 'Ocean Analytics', 
    role: 'Hydrodynamics & PFZ Engine',
    icon: Waves, 
    status: 'PROCESSING',
    inputs: ['SST Gradients (INSAT)', 'Chlorophyll-a (OCM-3)', 'Swell Models'],
    outputs: ['PFZ Probability Maps', 'Eddy Boundary Detections'],
    latency: '210ms',
    throughput: '290 req/min',
    memory: '58 MB',
    description: 'Pinpoints thermal fronts and chlorophyll confluence zones to predict rich pelagic feeding areas.',
    subscribers: ['Risk Assessment', 'Fleet Optimization']
  },
  { 
    id: 'risk', 
    label: 'Risk Assessment', 
    role: 'Maritime Boundary & Hazard Engine',
    icon: ShieldAlert, 
    status: 'COMPLETE',
    inputs: ['EEZ Geofence Vectors', 'Weather Warnings', 'AIS Density'],
    outputs: ['Safety Score [0-100]', 'Perimeter Breach Alerts'],
    latency: '94ms',
    throughput: '410 req/min',
    memory: '30 MB',
    description: 'Continuous physics-informed risk classifier evaluating nautical hazards, depth limits, and border limits.',
    subscribers: ['Fleet Optimization', 'Visualization']
  },
  { 
    id: 'geo', 
    label: 'Geospatial Reasoning', 
    role: 'Spatial Indexing & Spatial Joins',
    icon: Map, 
    status: 'COMPLETE',
    inputs: ['H3 Hexagonal Indices', 'Bathymetry Grids', 'Harbor Boundaries'],
    outputs: ['Great Circle Polylines', 'Polygon Intersections'],
    latency: '76ms',
    throughput: '620 req/min',
    memory: '36 MB',
    description: 'Fast H3 spatial indexing and topological queries for real-time proximity calculations.',
    subscribers: ['Fleet Optimization', 'Visualization']
  },
  { 
    id: 'fleet', 
    label: 'Fleet Optimization', 
    role: 'QUBO / Quantum-Inspired Routing',
    icon: Ship, 
    status: 'PROCESSING',
    inputs: ['Vessel Specifics', 'Port Windows', 'Hydrodynamic Drag Models'],
    outputs: ['Pareto Route Solutions', 'Throttle Schedules'],
    latency: '340ms',
    throughput: '120 req/min',
    memory: '82 MB',
    description: 'Solves quadratic unconstrained binary optimization problems to balance fuel savings against voyage time.',
    subscribers: ['Visualization', 'Explainability']
  },
  { 
    id: 'viz', 
    label: 'Visualization', 
    role: 'Shader & Canvas Rendering Core',
    icon: LineChart, 
    status: 'COMPLETE',
    inputs: ['Pareto Arrays', 'Raster Heatmaps', 'Particle Trajectories'],
    outputs: ['WebGPU / Leaflet Layer Payloads', 'HUD Telemetry Arrays'],
    latency: '45ms',
    throughput: '800 req/min',
    memory: '48 MB',
    description: 'Prepares rich graphical primitives for smooth 60fps mission control rendering.',
    subscribers: ['Web Interface']
  },
  { 
    id: 'explain', 
    label: 'Explainability', 
    role: 'Data Provenance & Lineage Tracer',
    icon: Info, 
    status: 'COMPLETE',
    inputs: ['Agent Execution DAG', 'Source Weights', 'Model Confidence'],
    outputs: ['Human-Readable Why? Reports', 'Attribution Trees'],
    latency: '62ms',
    throughput: '210 req/min',
    memory: '24 MB',
    description: 'Synthesizes mathematical model weights and satellite provenance into clear plain-language rationale.',
    subscribers: ['User Interface']
  },
];

export default function AgentNetwork() {
  const [activeAgentId, setActiveAgentId] = useState('planner');
  const [simulatedLogs, setSimulatedLogs] = useState<LogEntry[]>([
    { id: '1', time: '12:42:18', source: 'PLANNER', message: 'Swarm initialized. 10 specialized agent workers registered.', level: 'info' },
    { id: '2', time: '12:42:19', source: 'MOSDAC_INGEST', message: 'INSAT-3DR thermal raster (Sector 4) decoded.', level: 'info' },
    { id: '3', time: '12:42:20', source: 'OCEAN_ANALYTICS', message: 'Thermal front confluence detected in Kochi Sector K-04.', level: 'success' },
    { id: '4', time: '12:42:21', source: 'RISK_ENGINE', message: 'Safety validation passed. Swell threshold <1.8m confirmed.', level: 'success' },
    { id: '5', time: '12:42:22', source: 'QUBO_OPTIMIZER', message: 'Pareto-optimal throttle schedule computed for Sagar Kanya.', level: 'info' }
  ]);

  const activeAgent = agentsList.find(a => a.id === activeAgentId) || agentsList[0];

  useEffect(() => {
    const logInterval = setInterval(() => {
      const randomAgents = ['OCEAN_ANALYTICS', 'WEATHER_INTEL', 'RISK_ENGINE', 'QUBO_OPTIMIZER', 'PLANNER'];
      const randomMsg = [
        'Stream frame processed: latency 112ms.',
        'SST boundary re-checked against INCOIS baseline.',
        'Evaluated 4,096 Hamiltonian states.',
        'EEZ perimeter boundary verified clear.',
        'Generated confidence interval 89.2% Nominal.'
      ];
      const now = new Date();
      const timeStr = now.toISOString().substring(11, 19);

      const newLog: LogEntry = {
        id: String(Date.now()),
        time: timeStr,
        source: randomAgents[Math.floor(Math.random() * randomAgents.length)],
        message: randomMsg[Math.floor(Math.random() * randomMsg.length)],
        level: Math.random() > 0.3 ? 'info' : 'success'
      };

      setSimulatedLogs(prev => [...prev.slice(-12), newLog]);
    }, 3500);

    return () => clearInterval(logInterval);
  }, []);

  return (
    <div className="flex h-full w-full overflow-hidden p-4 gap-4 font-sans select-none bg-[#070D18]">
      
      {/* Interactive 10-Agent Swarm Visualization Graph (Left) */}
      <div className="flex-[2] bg-[#091120] rounded-xl border border-slate-800 relative overflow-hidden flex flex-col shadow-xl">
        
        {/* Header HUD */}
        <div className="p-3.5 border-b border-slate-800 bg-[#070D18] flex items-center justify-between z-10">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Agent Intelligence Topology (10 Active Nodes)
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] text-emerald-400 font-medium">Swarm Online</span>
          </div>
        </div>

        {/* Graph Canvas */}
        <div className="flex-1 relative flex items-center justify-center p-6 overflow-y-auto scrollbar-none">
          <div className="absolute inset-0 bg-ocean-grid opacity-15 pointer-events-none" />

          {/* Connected Topology Layout */}
          <div className="relative w-full max-w-2xl py-6 flex flex-col items-center justify-between space-y-6 z-10">
            
            {/* Level 1: Orchestrator */}
            <AgentNodeButton 
              agent={agentsList[0]} 
              isActive={activeAgentId === agentsList[0].id} 
              onClick={() => setActiveAgentId(agentsList[0].id)} 
            />

            {/* Connecting Conduits */}
            <div className="w-0.5 h-6 bg-cyan-500/40" />

            {/* Level 2: Intent & Telemetry Ingestion */}
            <div className="flex items-center justify-center space-x-6 w-full">
              <AgentNodeButton 
                agent={agentsList[1]} 
                isActive={activeAgentId === agentsList[1].id} 
                onClick={() => setActiveAgentId(agentsList[1].id)} 
              />
              <AgentNodeButton 
                agent={agentsList[2]} 
                isActive={activeAgentId === agentsList[2].id} 
                onClick={() => setActiveAgentId(agentsList[2].id)} 
              />
            </div>

            <div className="w-72 h-0.5 bg-slate-700 relative flex justify-between">
              <div className="w-0.5 h-6 bg-slate-700 absolute left-0 top-0" />
              <div className="w-0.5 h-6 bg-slate-700 absolute right-0 top-0" />
            </div>

            {/* Level 3: Ocean & Weather Reasoning Matrix */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 w-full">
              <AgentNodeButton agent={agentsList[3]} isActive={activeAgentId === agentsList[3].id} onClick={() => setActiveAgentId(agentsList[3].id)} />
              <AgentNodeButton agent={agentsList[4]} isActive={activeAgentId === agentsList[4].id} onClick={() => setActiveAgentId(agentsList[4].id)} />
              <AgentNodeButton agent={agentsList[5]} isActive={activeAgentId === agentsList[5].id} onClick={() => setActiveAgentId(agentsList[5].id)} />
              <AgentNodeButton agent={agentsList[6]} isActive={activeAgentId === agentsList[6].id} onClick={() => setActiveAgentId(agentsList[6].id)} />
            </div>

            <div className="w-72 h-0.5 bg-slate-700 relative flex justify-between">
              <div className="w-0.5 h-6 bg-slate-700 absolute left-0 bottom-0" />
              <div className="w-0.5 h-6 bg-slate-700 absolute right-0 bottom-0" />
            </div>

            {/* Level 4: Fleet Optimization & Explainability */}
            <div className="flex items-center justify-center space-x-5 w-full">
              <AgentNodeButton agent={agentsList[7]} isActive={activeAgentId === agentsList[7].id} onClick={() => setActiveAgentId(agentsList[7].id)} />
              <AgentNodeButton agent={agentsList[8]} isActive={activeAgentId === agentsList[8].id} onClick={() => setActiveAgentId(agentsList[8].id)} />
              <AgentNodeButton agent={agentsList[9]} isActive={activeAgentId === agentsList[9].id} onClick={() => setActiveAgentId(agentsList[9].id)} />
            </div>
          </div>
        </div>

        {/* Bottom Stream Bar */}
        <div className="p-3 border-t border-slate-800 bg-[#070D18]">
          <DataStream logs={simulatedLogs} maxHeight="max-h-24" title="Live Multi-Agent Trace" />
        </div>
      </div>

      {/* Agent Telemetry Inspector Panel (Right) */}
      <div className="flex-1 bg-[#091120] rounded-xl border border-slate-800 p-5 flex flex-col shadow-xl overflow-y-auto scrollbar-thin">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <activeAgent.icon className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">{activeAgent.label}</h2>
              <span className="text-[11px] text-slate-400 font-medium">{activeAgent.role}</span>
            </div>
          </div>

          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-medium px-2 py-0.5 rounded border border-emerald-500/30">
            {activeAgent.status}
          </span>
        </div>

        {/* Live Metrics Quad */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
          <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">Latency</span>
            <span className="font-bold text-cyan-400 font-mono text-sm">{activeAgent.latency}</span>
          </div>
          <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">Throughput</span>
            <span className="font-bold text-white font-mono text-sm">{activeAgent.throughput}</span>
          </div>
          <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">Memory</span>
            <span className="font-bold text-emerald-400 font-mono text-sm">{activeAgent.memory}</span>
          </div>
        </div>

        <div className="space-y-3.5 text-xs flex-1">
          <div>
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">
              Role & Responsibility
            </span>
            <p className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg text-slate-300 leading-relaxed text-xs">
              {activeAgent.description}
            </p>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">
              Input Data Contracts
            </span>
            <div className="space-y-1">
              {activeAgent.inputs.map((inp, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-xs p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>{inp}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">
              Output Artifacts
            </span>
            <div className="space-y-1">
              {activeAgent.outputs.map((out, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-xs p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>{out}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 mt-3">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-between text-cyan-300 text-xs">
            <span className="font-semibold text-[11px]">Subscribed by:</span>
            <span className="text-slate-200 font-medium text-xs">{activeAgent.subscribers.join(', ')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AgentNodeButton({ agent, isActive, onClick }: { agent: AgentInfo, isActive: boolean, onClick: () => void }) {
  const Icon = agent.icon;

  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center space-x-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all duration-150 relative group cursor-pointer",
        isActive 
          ? "bg-cyan-500/20 text-white border-cyan-400 shadow-md font-semibold" 
          : "bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white"
      )}
    >
      <Icon className={cn("w-3.5 h-3.5", isActive ? "text-cyan-300" : "text-cyan-400")} />
      <span className="truncate max-w-[130px]">{agent.label}</span>
      
      {isActive && (
        <span className="absolute -top-1 -right-1 flex h-2 w-2">
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
        </span>
      )}
    </button>
  );
}


