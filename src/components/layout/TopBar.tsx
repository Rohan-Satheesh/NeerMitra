import React from 'react';
import { Bell, Globe, Search, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TopBar() {
  const [demoMode, setDemoMode] = React.useState(true);

  return (
    <div className="h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10 flex-shrink-0">
      
      {/* Left side Context or Search */}
      <div className="flex items-center flex-1">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search coordinates, vessels, alerts..."
            className="w-full bg-surface-elevated border border-border rounded-md pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:border-primary transition-colors text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Right side tools */}
      <div className="flex items-center space-x-4">
        
        {/* Demo Mode Toggle */}
        <div className="flex items-center space-x-2 mr-4">
          <span className={cn("text-xs font-medium uppercase tracking-wider", demoMode ? "text-primary" : "text-muted-foreground")}>
            Demo Data
          </span>
          <button 
            onClick={() => setDemoMode(!demoMode)}
            className={cn(
              "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
              demoMode ? "bg-primary" : "bg-muted"
            )}
          >
            <span className={cn(
              "inline-block h-3 w-3 transform rounded-full bg-white transition-transform",
              demoMode ? "translate-x-5" : "translate-x-1"
            )} />
          </button>
        </div>

        {/* Language Selector */}
        <button className="flex items-center space-x-1.5 text-muted-foreground hover:text-foreground transition-colors">
          <Globe className="w-4 h-4" />
          <span className="text-sm font-medium">EN</span>
        </button>

        {/* Notifications */}
        <button className="relative text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warning opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-warning"></span>
          </span>
        </button>

        {/* Profile Avatar */}
        <div className="w-8 h-8 rounded-full bg-surface-elevated border border-border flex items-center justify-center overflow-hidden ml-2 cursor-pointer">
          <img src={`https://api.dicebear.com/7.x/initials/svg?seed=INCOIS&backgroundColor=0ea5e9&textColor=ffffff`} alt="Avatar" />
        </div>
      </div>
    </div>
  );
}
