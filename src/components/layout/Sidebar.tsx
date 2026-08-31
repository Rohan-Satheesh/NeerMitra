import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Compass,
  Waves,
  Ship,
  Cpu,
  AlertTriangle,
  LineChart,
  Database,
  Layers,
  Anchor,
  Radio,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import StatusIndicator from '@/components/hud/StatusIndicator';

const navItems = [
  { label: 'Command Center', path: '/dashboard', icon: Compass },
  { label: 'Live Ocean', path: '/ocean', icon: Waves },
  { label: 'Fleet Optimizer', path: '/fleet', icon: Ship },
  { label: 'Agent Network', path: '/agents', icon: Cpu },
  { label: 'Alerts Feed', path: '/alerts', icon: AlertTriangle, badge: '1', badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
  { label: 'Analytics', path: '/analytics', icon: LineChart },
  { label: 'Data Sources', path: '/data-sources', icon: Database },
  { label: 'Architecture', path: '/architecture', icon: Layers },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isFishermanActive = location.pathname === '/fisherman';

  return (
    <aside className="w-60 border-r border-slate-800/80 bg-[#070D18] flex flex-col h-full flex-shrink-0 z-20 select-none shadow-xl font-sans">
      
      {/* Brand Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-slate-800/80 bg-[#091120]">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_12px_rgba(0,210,255,0.25)]">
            <Radio className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-wide text-white leading-tight">
              NEERMITRA
            </div>
            <span className="text-[10px] text-cyan-400/90 font-medium block">
              Marine Intelligence OS
            </span>
          </div>
        </div>
      </div>

      {/* Main Operations Navigation */}
      <div className="px-3 pt-3 pb-1">
        <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider px-2">
          Operations
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto py-1 space-y-1 px-2.5 scrollbar-thin">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "group relative flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150",
                isActive
                  ? "bg-cyan-500/15 text-white font-semibold shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              )}
            >
              {/* Active left indicator */}
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-cyan-400 rounded-r shadow-[0_0_8px_#00D2FF]" />
              )}

              <div className="flex items-center space-x-2.5 min-w-0">
                <Icon className={cn("w-4 h-4 flex-shrink-0 transition-colors", isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-slate-200")} />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span className={cn(
                  "text-[10px] px-1.5 py-0.2 rounded-full font-bold border",
                  item.badgeColor || (isActive ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30" : "bg-slate-800 text-slate-400 border-slate-700")
                )}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}

        {/* Fisherman Mode Special Switcher */}
        <div className="pt-3 mt-2 border-t border-slate-800/80">
          <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider px-2 block mb-1.5">
            Modes
          </span>
          <button
            onClick={() => navigate('/fisherman')}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all border cursor-pointer",
              isFishermanActive
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm"
                : "bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/20"
            )}
          >
            <div className="flex items-center space-x-2.5">
              <Anchor className="w-4 h-4 text-emerald-400" />
              <span>Fisherman Mode</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/20 rounded font-bold">
              Outdoor
            </span>
          </button>
        </div>
      </nav>

      {/* System Status Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-[#091120] flex items-center justify-between text-xs text-slate-400">
        <StatusIndicator status="online" label="System Nominal" size="sm" />
        <span className="text-slate-500 font-mono text-[11px]">v2.4.0</span>
      </div>
    </aside>
  );
}


