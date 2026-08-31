import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  Info, 
  Bell, 
  Wind, 
  Waves, 
  Zap, 
  Radio, 
  ShieldAlert, 
  Compass, 
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertOctagon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import TechnicalLabel from '@/components/hud/TechnicalLabel';

interface MarineAlert {
  id: string;
  type: string;
  hazard: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  region: string;
  coordinates: string;
  distance: string;
  time: string;
  message: string;
  affectedVessels: string[];
  icon: React.ElementType;
}

const mockAlertsList: MarineAlert[] = [
  { 
    id: 'ALT-01', 
    type: 'METEOROLOGICAL HAZARD',
    hazard: 'CYCLONE FORMATION ALERT', 
    severity: 'CRITICAL', 
    region: 'South-East Arabian Sea',
    coordinates: '13.8°N, 71.4°E',
    distance: '184 km NW of Kochi',
    time: '8 mins ago', 
    message: 'Deep depression intensifying into cyclonic storm. Maximum sustained surface winds 55-65 km/h gusting to 75 km/h. Sea condition very rough.',
    affectedVessels: ['V001 (Sagar Kanya)', 'V003 (Matsya 1)'],
    icon: Wind, 
  },
  { 
    id: 'ALT-02', 
    type: 'HYDRODYNAMIC SWELL',
    hazard: 'HIGH WAVE SWELL WARNING', 
    severity: 'HIGH', 
    region: 'Malabar Coastal Corridor',
    coordinates: '11.2°N, 74.8°E',
    distance: '62 km W of Kozhikode',
    time: '34 mins ago', 
    message: 'Significant wave height forecast 2.8m - 3.2m with periods of 14 seconds. Coastal fishing boats advised not to venture past 10 nautical miles.',
    affectedVessels: ['V006 (Matsya 2)'],
    icon: Waves, 
  },
  { 
    id: 'ALT-03', 
    type: 'ATMOSPHERIC DISCHARGE',
    hazard: 'SEVERE THUNDERSTORM & LIGHTNING', 
    severity: 'MEDIUM', 
    region: 'Konkan Coast Sector',
    coordinates: '15.4°N, 72.8°E',
    distance: '95 km W of Goa',
    time: '2 hours ago', 
    message: 'Intense convective cells detected with frequent cloud-to-surface lightning strikes. Radar reflectivity >45 dBZ.',
    affectedVessels: ['V002 (Coastal Voyager)'],
    icon: Zap, 
  },
  { 
    id: 'ALT-04', 
    type: 'GEOSPATIAL PERIMETER',
    hazard: 'EEZ BOUNDARY PROXIMITY ADVISORY', 
    severity: 'LOW', 
    region: 'Western Maritime Border',
    coordinates: '10.5°N, 72.2°E',
    distance: '12 km within EEZ perimeter',
    time: '4 hours ago', 
    message: 'Vessel V002 maintaining nominal trajectory 12.0 kn, heading 120°. Safe operating distance from international boundary line.',
    affectedVessels: ['V002 (Coastal Voyager)'],
    icon: Info, 
  },
];

export default function Alerts() {
  const navigate = useNavigate();
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [alerts, setAlerts] = useState<MarineAlert[]>(mockAlertsList);

  const filteredAlerts = filterSeverity === 'ALL' 
    ? alerts 
    : alerts.filter(a => a.severity === filterSeverity);

  const getSeverityStyle = (severity: MarineAlert['severity']) => {
    switch (severity) {
      case 'CRITICAL':
        return {
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.3)]',
          border: 'border-rose-500/40 bg-rose-500/5',
          iconColor: 'text-rose-400',
          dot: 'bg-rose-500'
        };
      case 'HIGH':
        return {
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.3)]',
          border: 'border-amber-500/30 bg-amber-500/5',
          iconColor: 'text-amber-400',
          dot: 'bg-amber-400'
        };
      case 'MEDIUM':
        return {
          badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          border: 'border-cyan-500/20 bg-cyan-500/5',
          iconColor: 'text-cyan-400',
          dot: 'bg-cyan-400'
        };
      case 'LOW':
      default:
        return {
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          border: 'border-emerald-500/20 bg-emerald-500/5',
          iconColor: 'text-emerald-400',
          dot: 'bg-emerald-400'
        };
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto h-full overflow-y-auto font-sans select-none scrollbar-thin">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6 bg-[#091120] p-4 rounded-xl shadow-md border">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white">
                Maritime Operations Alert Feed
              </h1>
              <span className="text-xs text-slate-400">
                Coordinated with IMD & INCOIS Early Warning Network
              </span>
            </div>
          </div>
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center space-x-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800 text-xs">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(sev => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={cn(
                "px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer",
                filterSeverity === sev 
                  ? "bg-cyan-500 text-slate-950 shadow-sm" 
                  : "text-slate-400 hover:text-white"
              )}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {filteredAlerts.map(alert => {
          const style = getSeverityStyle(alert.severity);
          const Icon = alert.icon;

          return (
            <div 
              key={alert.id} 
              className={cn(
                "rounded-xl border p-4 transition-all duration-200 shadow-sm relative overflow-hidden bg-slate-900/60 border-slate-800"
              )}
            >
              {/* Top Accent for Critical */}
              {alert.severity === 'CRITICAL' && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-rose-500" />
              )}

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-800/80 pb-3 mb-3">
                <div className="flex items-center space-x-3">
                  <div className={cn("w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0")}>
                    <Icon className={cn("w-4 h-4", style.iconColor)} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={cn("text-[10px] px-2 py-0.2 rounded font-bold border", style.badge)}>
                        {alert.severity}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {alert.type}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-xs text-cyan-400 font-mono font-semibold">{alert.id}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-white mt-0.5">
                      {alert.hazard}
                    </h3>
                  </div>
                </div>

                <span className="text-xs text-slate-400 font-medium">
                  {alert.time}
                </span>
              </div>

              {/* Message Body */}
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                {alert.message}
              </p>

              {/* Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 text-xs mb-3">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Geographic Sector</span>
                  <span className="font-semibold text-white text-xs">{alert.region}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Coordinates & Proximity</span>
                  <span className="font-medium text-cyan-400 text-xs font-mono">{alert.coordinates} ({alert.distance})</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Affected Vessels</span>
                  <span className="font-medium text-amber-300 text-xs">{alert.affectedVessels.join(', ')}</span>
                </div>
              </div>

              {/* Actions Strip */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Protocol Active</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="px-3 py-1.5 bg-cyan-500 text-slate-950 font-semibold text-xs rounded-lg hover:bg-cyan-400 transition-colors flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>View on Live Map</span>
                  </button>
                  <button 
                    onClick={() => navigate('/fleet')}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Re-Route Fleet
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


