import React from 'react';
import { Thermometer, Waves, Wind, Ship, ShieldAlert, Cpu } from 'lucide-react';

const kpis = [
  { label: 'Ocean Temp', value: '28.4°C', icon: Thermometer, color: 'text-primary' },
  { label: 'Wave Height', value: '1.8m', icon: Waves, color: 'text-cyan' },
  { label: 'Wind', value: '18 km/h', icon: Wind, color: 'text-muted-foreground' },
  { label: 'Active Vessels', value: '247', icon: Ship, color: 'text-green-500' },
  { label: 'Marine Risk', value: 'LOW', icon: ShieldAlert, color: 'text-green-500' },
  { label: 'AI Agents', value: '9 ACTIVE', icon: Cpu, color: 'text-primary' },
];

export default function KPIBar() {
  return (
    <div className="flex h-16 w-full border-b border-border bg-surface flex-shrink-0">
      {kpis.map((kpi, idx) => (
        <div key={idx} className={`flex-1 flex items-center justify-center space-x-3 px-4 ${idx !== kpis.length - 1 ? 'border-r border-border' : ''}`}>
          <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{kpi.label}</span>
            <span className="text-sm font-bold text-foreground">{kpi.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
