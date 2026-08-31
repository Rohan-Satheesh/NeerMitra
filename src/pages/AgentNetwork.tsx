import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

const agents = [
  { id: 'planner', label: 'Planner / Orchestrator', icon: BrainCircuit, row: 1, col: 2 },
  { id: 'language', label: 'Language & Intent', icon: MessageSquare, row: 2, col: 2 },
  { id: 'marine_data', label: 'Marine Data Discovery', icon: Database, row: 3, col: 2 },
  { id: 'weather', label: 'Weather Intelligence', icon: CloudRain, row: 4, col: 1 },
  { id: 'ocean', label: 'Ocean Analytics', icon: Waves, row: 4, col: 3 },
  { id: 'risk', label: 'Risk Assessment', icon: ShieldAlert, row: 5, col: 1 },
  { id: 'geo', label: 'Geospatial Reasoning', icon: Map, row: 5, col: 3 },
  { id: 'fleet', label: 'Fleet Optimization', icon: Ship, row: 6, col: 2 },
  { id: 'viz', label: 'Visualization', icon: LineChart, row: 7, col: 2 },
  { id: 'explain', label: 'Explainability', icon: Info, row: 8, col: 2 },
];

export default function AgentNetwork() {
  const [activeAgent, setActiveAgent] = useState('planner');

  return (
    <div className="flex h-full w-full overflow-hidden p-6 gap-6">
      
      {/* Network Visualization */}
      <div className="flex-[2] bg-surface-elevated rounded-xl border border-border relative overflow-hidden flex items-center justify-center">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-ocean-grid opacity-20 pointer-events-none"></div>
        
        <div className="relative w-full max-w-3xl h-[800px] flex flex-col items-center justify-between py-12">
          
          {/* We simplify by just listing them vertically with branches */}
          {/* Level 1 */}
          <AgentNode agent={agents[0]} isActive={activeAgent === agents[0].id} onClick={() => setActiveAgent(agents[0].id)} />
          
          {/* Level 2 */}
          <div className="w-[2px] h-8 bg-primary/30"></div>
          <AgentNode agent={agents[1]} isActive={activeAgent === agents[1].id} onClick={() => setActiveAgent(agents[1].id)} />
          
          {/* Level 3 */}
          <div className="w-[2px] h-8 bg-primary/30"></div>
          <AgentNode agent={agents[2]} isActive={activeAgent === agents[2].id} onClick={() => setActiveAgent(agents[2].id)} />
          
          {/* Branch Level 4 */}
          <div className="w-64 h-[2px] bg-primary/30 mt-8 relative flex justify-between">
             <div className="w-[2px] h-8 bg-primary/30 absolute left-0 top-0"></div>
             <div className="w-[2px] h-8 bg-primary/30 absolute right-0 top-0"></div>
          </div>
          
          <div className="flex justify-between w-96 mt-4">
            <div className="flex flex-col items-center space-y-8">
              <AgentNode agent={agents[3]} isActive={activeAgent === agents[3].id} onClick={() => setActiveAgent(agents[3].id)} />
              <div className="w-[2px] h-8 bg-primary/30"></div>
              <AgentNode agent={agents[5]} isActive={activeAgent === agents[5].id} onClick={() => setActiveAgent(agents[5].id)} />
            </div>
            <div className="flex flex-col items-center space-y-8">
              <AgentNode agent={agents[4]} isActive={activeAgent === agents[4].id} onClick={() => setActiveAgent(agents[4].id)} />
              <div className="w-[2px] h-8 bg-primary/30"></div>
              <AgentNode agent={agents[6]} isActive={activeAgent === agents[6].id} onClick={() => setActiveAgent(agents[6].id)} />
            </div>
          </div>
          
          {/* Merge Branch Level 6 */}
          <div className="w-64 h-[2px] bg-primary/30 mt-4 relative flex justify-between">
             <div className="w-[2px] h-8 bg-primary/30 absolute left-0 bottom-0"></div>
             <div className="w-[2px] h-8 bg-primary/30 absolute right-0 bottom-0"></div>
          </div>
          
          <div className="w-[2px] h-8 bg-primary/30 mt-8"></div>
          <AgentNode agent={agents[7]} isActive={activeAgent === agents[7].id} onClick={() => setActiveAgent(agents[7].id)} />

          <div className="w-[2px] h-8 bg-primary/30"></div>
          <AgentNode agent={agents[8]} isActive={activeAgent === agents[8].id} onClick={() => setActiveAgent(agents[8].id)} />
          
          <div className="w-[2px] h-8 bg-primary/30"></div>
          <AgentNode agent={agents[9]} isActive={activeAgent === agents[9].id} onClick={() => setActiveAgent(agents[9].id)} />
        </div>
      </div>

      {/* Details Panel */}
      <div className="flex-1 bg-surface-elevated rounded-xl border border-border p-6 flex flex-col">
        {agents.map((agent) => (
          agent.id === activeAgent && (
            <motion.div 
              key={agent.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col h-full"
            >
              <div className="flex items-center space-x-4 border-b border-border pb-6 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center glow-cyan">
                  <agent.icon className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{agent.label}</h2>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-xs uppercase tracking-wider text-green-500 font-semibold">Active & Listening</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6 flex-1">
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2">Purpose</h3>
                  <p className="text-sm text-foreground bg-surface p-4 rounded-lg border border-border">
                    Responsible for coordinating sub-tasks, reasoning over marine data, and returning structured output to the main orchestrator or user.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2">Current Task</h3>
                  <div className="text-sm text-primary font-mono bg-primary/5 border border-primary/20 p-4 rounded-lg">
                    {'>'} Awaiting instruction...
                  </div>
                </div>

                <div>
                  <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2">Data Subscribed</h3>
                  <div className="flex flex-wrap gap-2">
                    {['SST (Satellite)', 'AIS Telemetry', 'IMD Weather APIs'].map(t => (
                      <span key={t} className="text-xs bg-surface border border-border px-3 py-1 rounded-full text-foreground">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        ))}
      </div>
    </div>
  );
}

function AgentNode({ agent, isActive, onClick }: { agent: any, isActive: boolean, onClick: () => void }) {
  return (
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "flex items-center space-x-3 px-6 py-3 rounded-full border transition-all duration-300 relative group z-10",
        isActive 
          ? "bg-primary text-primary-foreground border-primary shadow-[0_0_20px_rgba(14,165,233,0.5)]" 
          : "bg-surface text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
      )}
    >
      <agent.icon className="w-5 h-5" />
      <span className="text-sm font-semibold tracking-wide">{agent.label}</span>
      
      {/* Processing Animation Ring */}
      {isActive && (
        <span className="absolute inset-0 rounded-full border border-primary/50 animate-ping opacity-20"></span>
      )}
    </motion.button>
  )
}
