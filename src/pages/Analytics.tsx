import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Legend,
  LineChart,
  Line
} from 'recharts';
import { 
  Fuel, 
  Factory, 
  IndianRupee, 
  TrendingDown, 
  Download, 
  Calendar, 
  LineChart as ChartIcon,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import DataReadout from '@/components/hud/DataReadout';

const weeklyFuelData = [
  { day: 'Mon', original: 420, optimized: 340, savings: 80 },
  { day: 'Tue', original: 460, optimized: 362, savings: 98 },
  { day: 'Wed', original: 390, optimized: 308, savings: 82 },
  { day: 'Thu', original: 510, optimized: 402, savings: 108 },
  { day: 'Fri', original: 480, optimized: 382, savings: 98 },
  { day: 'Sat', original: 430, optimized: 345, savings: 85 },
  { day: 'Sun', original: 380, optimized: 305, savings: 75 },
];

const pfzAccuracyData = [
  { zone: 'Kochi (K-04)', accuracy: 91.4, baseline: 74.0 },
  { zone: 'Mangalore (M-02)', accuracy: 88.2, baseline: 71.5 },
  { zone: 'Goa (G-08)', accuracy: 94.6, baseline: 76.2 },
  { zone: 'Mumbai (B-12)', accuracy: 86.8, baseline: 69.0 },
  { zone: 'Chennai (C-03)', accuracy: 89.5, baseline: 72.8 },
];

const emissionTrends = [
  { month: 'Jan', co2Base: 12400, co2Opt: 9800 },
  { month: 'Feb', co2Base: 11800, co2Opt: 9250 },
  { month: 'Mar', co2Base: 13200, co2Opt: 10400 },
  { month: 'Apr', co2Base: 12900, co2Opt: 10100 },
  { month: 'May', co2Base: 14100, co2Opt: 11050 },
  { month: 'Jun', co2Base: 13600, co2Opt: 10600 },
];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('Last 7 Days');

  return (
    <div className="p-4 md:p-6 h-full overflow-y-auto space-y-5 font-sans select-none bg-[#070D18] scrollbar-thin">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 bg-[#091120] p-4 rounded-xl shadow-md border">
        <div>
          <div className="flex items-center space-x-2.5">
            <ChartIcon className="w-5 h-5 text-cyan-400" />
            <h1 className="text-base font-bold text-white">
              Fleet & Ocean Intelligence Analytics
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Historical fuel consumption, IMO MRV emissions verification & AI prediction accuracy.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs text-white px-3 py-1.5 rounded-lg focus:border-cyan-400 focus:outline-none"
          >
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Year to Date (2026)</option>
          </select>
          <button className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer">
            <Download className="w-3.5 h-3.5" />
            <span>Export MRV Report</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <DataReadout 
          label="Cumulative Fuel Saved" 
          value="626" 
          unit="Metric Tons" 
          trend="up" 
          delta="▼ 18.7%" 
          status="optimal" 
        />
        <DataReadout 
          label="CO₂ Emissions Avoided" 
          value="1,949" 
          unit="Tons CO₂e" 
          trend="up" 
          delta="▼ 21.3%" 
          status="optimal" 
        />
        <DataReadout 
          label="OpEx Cost Reduction" 
          value="₹62.6" 
          unit="Lakhs (INR)" 
          trend="up" 
          delta="14.2%" 
          status="optimal" 
        />
        <DataReadout 
          label="PFZ Prediction Accuracy" 
          value="90.2" 
          unit="Percent" 
          trend="up" 
          delta="+16.4% vs baseline" 
          status="optimal" 
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Fuel Consumption Comparison Chart */}
        <div className="bg-[#091120] border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
            <div>
              <h2 className="text-xs font-semibold text-white uppercase tracking-wider">
                Daily Fleet Fuel Consumption (Tons)
              </h2>
              <span className="text-[11px] text-slate-400">Baseline Routes vs NeerMitra Quantum-Optimized</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              -18.7% Overall
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyFuelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOrig" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOpt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D2FF" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00D2FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#091120', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px' }} 
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="original" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorOrig)" name="Baseline Trajectory" />
                <Area type="monotone" dataKey="optimized" stroke="#00D2FF" strokeWidth={2} fillOpacity={1} fill="url(#colorOpt)" name="NeerMitra Optimized" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PFZ Prediction Accuracy Chart */}
        <div className="bg-[#091120] border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
            <div>
              <h2 className="text-xs font-semibold text-white uppercase tracking-wider">
                PFZ Verification Accuracy (%)
              </h2>
              <span className="text-[11px] text-slate-400">Validated by Commercial Fishing Vessel Logs</span>
            </div>
            <span className="text-[10px] text-cyan-400 font-medium bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
              INCOIS Validated
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pfzAccuracyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="zone" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} domain={[50, 100]} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} 
                  contentStyle={{ backgroundColor: '#091120', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px' }} 
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="baseline" fill="#334155" radius={[4, 4, 0, 0]} name="Traditional Method" />
                <Bar dataKey="accuracy" fill="#10B981" radius={[4, 4, 0, 0]} name="NeerMitra AI Ensemble" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}


