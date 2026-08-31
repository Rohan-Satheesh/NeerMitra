import React, { useState, useEffect } from 'react';
import { Thermometer, Waves, Wind, Ship, ShieldAlert, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fetchLiveMarineData, getCachedMarineData, type LiveMarineData } from '@/services/liveMarineService';

export default function KPIBar() {
  const [data, setData] = useState<LiveMarineData>(getCachedMarineData());

  useEffect(() => {
    // Initial fetch
    fetchLiveMarineData().then(setData);

    // Refresh every 60 seconds
    const interval = setInterval(() => {
      fetchLiveMarineData().then(setData);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const kpis = [
    { 
      label: 'SST Thermal', 
      value: `${data.sst}°C`, 
      detail: `${data.sstAnomaly >= 0 ? '+' : ''}${data.sstAnomaly}° anomaly`, 
      icon: Thermometer, 
      color: 'text-rose-400' 
    },
    { 
      label: 'Wave Height', 
      value: `${data.waveHeight}m`, 
      detail: `${data.wavePeriod}s period`, 
      icon: Waves, 
      color: 'text-blue-400' 
    },
    { 
      label: 'Surface Wind', 
      value: `${data.windSpeed} km/h`, 
      detail: `${data.windDirection}° heading`, 
      icon: Wind, 
      color: 'text-emerald-400' 
    },
    { 
      label: 'AIS Active', 
      value: '247', 
      detail: 'In EEZ zone', 
      icon: Ship, 
      color: 'text-cyan-400' 
    },
    { 
      label: 'Maritime Risk', 
      value: `${data.riskLevel} RISK`, 
      detail: `Score ${data.riskScore}/100`, 
      icon: ShieldAlert, 
      color: data.riskLevel === 'LOW' ? 'text-emerald-400' : data.riskLevel === 'MEDIUM' ? 'text-amber-400' : 'text-rose-400' 
    },
    { 
      label: 'AI Agents', 
      value: '9 Active', 
      detail: data.isLive ? 'Real-time sync' : 'Nominal', 
      icon: Cpu, 
      color: 'text-cyan-300' 
    },
  ];

  return (
    <div className="h-12 w-full border-b border-slate-800/80 bg-[#070D18]/90 backdrop-blur-md flex items-center px-4 flex-shrink-0 select-none overflow-x-auto scrollbar-none gap-2">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <div 
            key={idx} 
            className="flex-1 min-w-[150px] flex items-center space-x-2 px-2.5 py-1 rounded-md hover:bg-slate-800/40 transition-colors"
          >
            <div className="w-6 h-6 rounded bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0">
              <Icon className={cn("w-3.5 h-3.5", kpi.color)} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-slate-400 font-medium truncate leading-tight">
                {kpi.label}
              </span>
              <div className="flex items-baseline space-x-1.5 leading-tight">
                <span className="text-xs font-bold text-white font-mono">
                  {kpi.value}
                </span>
                <span className="text-[10px] text-slate-400 truncate">
                  {kpi.detail}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}



