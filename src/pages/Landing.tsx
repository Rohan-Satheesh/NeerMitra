import React from 'react';
import Particles from '../components/ui/Particles';

export default function Landing() {
  return (
    <div className="h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Interactive Ocean Particles */}
      <div className="absolute inset-0 z-0">
        <Particles
          particleColors={["#0ea5e9", "#06b6d4", "#22c55e", "#38bdf8", "#67e8f9"]}
          particleCount={250}
          particleSpread={12}
          speed={0.12}
          particleBaseSize={110}
          moveParticlesOnHover={true}
          particleHoverFactor={1.2}
          alphaParticles={true}
          disableRotation={false}
        />
      </div>

      {/* Background Effect */}
      <div className="absolute inset-0 bg-ocean-grid opacity-20 pointer-events-none z-[1]"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background pointer-events-none z-[1]"></div>
      
      <div className="relative z-10 text-center space-y-6 max-w-4xl px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-lg">
          NeerMitra
        </h1>
        <h2 className="text-xl md:text-3xl font-medium text-cyan glow-cyan">
          Intelligence for Safer Seas. Optimization for Greener Fleets.
        </h2>
        <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
          An agentic marine intelligence platform combining satellite data, ocean analytics, weather intelligence and intelligent optimization.
        </p>
        
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="/dashboard" className="px-8 py-3 rounded-md bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(14,165,233,0.3)]">
            Launch Command Center
          </a>
          <a href="/fleet" className="px-8 py-3 rounded-md border border-border bg-surface-elevated text-foreground font-semibold hover:bg-surface transition-colors glass-panel">
            Explore Fleet Optimization
          </a>
        </div>
      </div>
      
      {/* System Status Strip */}
      <div className="absolute bottom-0 left-0 right-0 h-16 border-t border-border bg-background/80 backdrop-blur-md flex items-center justify-center overflow-hidden">
        <div className="flex items-center space-x-12 px-6 animate-pulse">
          <div className="flex items-center space-x-2"><span className="w-2 h-2 rounded-full bg-green-500"></span><span className="text-xs font-mono text-muted-foreground tracking-widest">SATELLITE DATA ONLINE</span></div>
          <div className="flex items-center space-x-2"><span className="w-2 h-2 rounded-full bg-green-500"></span><span className="text-xs font-mono text-muted-foreground tracking-widest">OCEAN MODELS ONLINE</span></div>
          <div className="flex items-center space-x-2"><span className="w-2 h-2 rounded-full bg-primary"></span><span className="text-xs font-mono text-muted-foreground tracking-widest">AIS STREAM LIVE</span></div>
          <div className="flex items-center space-x-2"><span className="w-2 h-2 rounded-full bg-green-500"></span><span className="text-xs font-mono text-muted-foreground tracking-widest">AI AGENTS 9 ACTIVE</span></div>
        </div>
      </div>
    </div>
  );
}
