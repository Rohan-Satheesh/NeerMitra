import React from 'react';
import { AlertTriangle, Info, Bell, Wind, Waves, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const mockAlerts = [
  { id: 1, type: 'Cyclone', severity: 'Critical', message: 'Cyclone warning for coastal regions. Evacuation advised.', time: '10 mins ago', location: '15.3N, 70.2E', icon: Wind, color: 'text-destructive', bg: 'bg-destructive/10' },
  { id: 2, type: 'High Waves', severity: 'High', message: 'Wave height exceeding 3 meters expected.', time: '1 hour ago', location: 'Indian Ocean Transit Route', icon: Waves, color: 'text-warning', bg: 'bg-warning/10' },
  { id: 3, type: 'Lightning', severity: 'Medium', message: 'Thunderstorms and lightning detected.', time: '3 hours ago', location: '12.8N, 73.5E', icon: Zap, color: 'text-primary', bg: 'bg-primary/10' },
  { id: 4, type: 'Geofence', severity: 'Low', message: 'Vessel V002 approaching EEZ boundary.', time: '5 hours ago', location: 'Western EEZ Boundary', icon: Info, color: 'text-green-500', bg: 'bg-green-500/10' },
];

export default function Alerts() {
  return (
    <div className="p-6 max-w-5xl mx-auto h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-8 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center space-x-2">
            <Bell className="w-6 h-6 text-primary" />
            <span>Alert Center</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Centralized marine warnings and notifications.</p>
        </div>
        <div className="flex space-x-2">
          <button className="text-sm px-3 py-1.5 bg-surface border border-border rounded text-muted-foreground hover:text-foreground">Filter</button>
          <button className="text-sm px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded hover:bg-primary/20">Mark all read</button>
        </div>
      </div>

      <div className="space-y-4">
        {mockAlerts.map(alert => (
          <div key={alert.id} className={cn("flex items-start space-x-4 p-4 rounded-xl border", alert.severity === 'Critical' ? 'border-destructive/30 bg-destructive/5' : 'border-border bg-surface')}>
            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1", alert.bg)}>
              <alert.icon className={cn("w-5 h-5", alert.color)} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-foreground flex items-center space-x-2">
                    <span>{alert.type}</span>
                    <span className={cn("text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border", 
                      alert.severity === 'Critical' ? 'border-destructive text-destructive bg-destructive/10' :
                      alert.severity === 'High' ? 'border-warning text-warning bg-warning/10' :
                      alert.severity === 'Medium' ? 'border-primary text-primary bg-primary/10' :
                      'border-green-500 text-green-500 bg-green-500/10'
                    )}>
                      {alert.severity}
                    </span>
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                </div>
                <span className="text-xs text-muted-foreground font-mono">{alert.time}</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs font-mono bg-background border border-border px-2 py-1 rounded text-muted-foreground">Loc: {alert.location}</span>
                <div className="flex space-x-2">
                  <button className="text-xs font-semibold px-3 py-1.5 rounded bg-background border border-border hover:bg-muted transition-colors">Action</button>
                  <button className="text-xs font-semibold px-3 py-1.5 rounded bg-background border border-border hover:bg-muted transition-colors">Dismiss</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
