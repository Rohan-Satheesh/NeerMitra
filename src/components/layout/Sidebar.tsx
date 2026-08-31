import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Waves,
  Anchor,
  Ship,
  Network,
  AlertTriangle,
  BarChart3,
  Database,
  Layers,
  Settings,
  User,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Command Center', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Live Ocean', path: '/ocean', icon: Waves },
  { label: 'Fisherman Mode', path: '/fisherman', icon: Anchor },
  { label: 'Fleet Optimizer', path: '/fleet', icon: Ship },
  { label: 'Agent Network', path: '/agents', icon: Network },
  { label: 'Alerts', path: '/alerts', icon: AlertTriangle },
  { label: 'Analytics', path: '/analytics', icon: BarChart3 },
  { label: 'Data Sources', path: '/data-sources', icon: Database },
  { label: 'Architecture', path: '/architecture', icon: Layers },
];

export default function Sidebar() {
  return (
    <div className="w-64 border-r border-border bg-surface-elevated flex flex-col h-full flex-shrink-0">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <div className="text-xl font-bold tracking-widest text-primary glow-cyan">
          NEERMITRA
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary border border-primary/20" 
                  : "text-muted-foreground hover:text-foreground hover:bg-surface"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Area */}
      <div className="p-4 border-t border-border space-y-3">
        <div className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
          <Activity className="w-4 h-4 text-green-500" />
          <span>System Online</span>
        </div>
        <div className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </div>
        <div className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
          <User className="w-4 h-4" />
          <span>User Profile</span>
        </div>
      </div>
    </div>
  );
}
