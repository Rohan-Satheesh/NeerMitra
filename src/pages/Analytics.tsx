import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const fuelData = [
  { name: 'Mon', original: 400, optimized: 240 },
  { name: 'Tue', original: 300, optimized: 139 },
  { name: 'Wed', original: 200, optimized: 980 },
  { name: 'Thu', original: 278, optimized: 390 },
  { name: 'Fri', original: 189, optimized: 480 },
  { name: 'Sat', original: 239, optimized: 380 },
  { name: 'Sun', original: 349, optimized: 430 },
];

const pfzData = [
  { name: 'Zone A', accuracy: 85 },
  { name: 'Zone B', accuracy: 92 },
  { name: 'Zone C', accuracy: 78 },
  { name: 'Zone D', accuracy: 88 },
];

export default function Analytics() {
  return (
    <div className="p-6 h-full overflow-y-auto space-y-6">
      <div className="flex justify-between items-end border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Fleet & Ocean Analytics</h1>
          <p className="text-sm text-muted-foreground">Historical performance and model accuracy.</p>
        </div>
        <div className="flex space-x-2">
          <select className="bg-surface border border-border text-sm px-3 py-1.5 rounded focus:border-primary focus:outline-none">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Year to Date</option>
          </select>
          <button className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 px-3 py-1.5 rounded text-sm font-semibold transition-colors">
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Fuel Consumption Chart */}
        <div className="bg-surface-elevated border border-border rounded-xl p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">Fleet Fuel Consumption (Tons)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fuelData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOriginal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOptimized" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <Tooltip contentStyle={{ backgroundColor: '#071525', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Legend />
                <Area type="monotone" dataKey="original" stroke="#ef4444" fillOpacity={1} fill="url(#colorOriginal)" name="Original Routes" />
                <Area type="monotone" dataKey="optimized" stroke="#22c55e" fillOpacity={1} fill="url(#colorOptimized)" name="Optimized Routes" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PFZ Accuracy Chart */}
        <div className="bg-surface-elevated border border-border rounded-xl p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">PFZ Prediction Accuracy (%)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pfzData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.02)'}} contentStyle={{ backgroundColor: '#071525', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Bar dataKey="accuracy" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Accuracy" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
