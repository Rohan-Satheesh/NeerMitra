import React from 'react';
import { Database, Network, Search, Globe, ArrowRight, Radio, Server, Activity, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import StatusIndicator from '@/components/hud/StatusIndicator';

interface DataSource {
  name: string;
  agency: string;
  type: string;
  status: 'CONNECTED' | 'DEMO_STREAM' | 'SYNCING';
  latency: string;
  lastUpdate: string;
  records: string;
  frequency: string;
  payload: string;
}

const dataSourcesList: DataSource[] = [
  {
    name: 'MOSDAC / ISRO',
    agency: 'Space Applications Centre (SAC)',
    type: 'Satellite Oceanography (INSAT-3DR, Oceansat-3)',
    status: 'CONNECTED',
    latency: '182ms',
    lastUpdate: '12:42:18 UTC',
    records: '18,420 Rasters',
    frequency: 'Every 30 mins',
    payload: 'SST NetCDF4, Chlorophyll OCM-3, AOD'
  },
  {
    name: 'INCOIS ADVISORY CORE',
    agency: 'Ministry of Earth Sciences (MoES)',
    type: 'PFZ Multi-Spectral Bulletins & Ocean State',
    status: 'CONNECTED',
    latency: '145ms',
    lastUpdate: '12:41:50 UTC',
    records: '1,240 Bulletins',
    frequency: 'Daily 06:00 & 18:00',
    payload: 'PFZ Shapefiles, OSF Swell Alert Feed'
  },
  {
    name: 'IMD WEATHER STREAM',
    agency: 'India Meteorological Department',
    type: 'WRF Numerical Weather Predictions',
    status: 'CONNECTED',
    latency: '110ms',
    lastUpdate: '12:42:05 UTC',
    records: '9,860 Grid Points',
    frequency: 'Hourly 3km Grid',
    payload: '10m Wind U/V Vectors, Storm Tracks, CAPE'
  },
  {
    name: 'COPERNICUS MARINE (CMEMS)',
    agency: 'European Space Agency (ESA)',
    type: 'Global Hydrodynamic Physics Models',
    status: 'CONNECTED',
    latency: '320ms',
    lastUpdate: '12:38:00 UTC',
    records: '4,500 Profiles',
    frequency: 'Every 6 hours',
    payload: 'Global Salinity, Surface Current Vectors'
  },
  {
    name: 'AIS REAL-TIME TRACKING',
    agency: 'DG Shipping / Coastal AIS Network',
    type: 'Terrestrial & Satellite AIS Transponder Stream',
    status: 'CONNECTED',
    latency: '85ms',
    lastUpdate: '12:42:22 UTC',
    records: '247 Vessels in EEZ',
    frequency: 'Sub-second stream',
    payload: 'MMSI, SOG, COG, Lat/Lon, Vessel Class'
  },
  {
    name: 'GLOBAL FISHING WATCH',
    agency: 'GFW Research Pipeline',
    type: 'Historical Fishing Density & AIS Inference',
    status: 'DEMO_STREAM',
    latency: '240ms',
    lastUpdate: '12:00:00 UTC',
    records: '1.2M Vessel Hours',
    frequency: 'Daily Batch',
    payload: 'Apparent Fishing Effort (AFE) Rasters'
  }
];

export default function DataSources() {
  return (
    <div className="p-4 md:p-6 h-full overflow-y-auto font-sans select-none bg-[#070D18] scrollbar-thin">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6 bg-[#091120] p-4 rounded-xl shadow-md border">
        <div>
          <div className="flex items-center space-x-2.5">
            <Database className="w-5 h-5 text-cyan-400" />
            <h1 className="text-base font-bold text-white">
              Telemetry Data Ingestion Matrix
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Live monitoring of governmental satellite, weather, and transponder streams normalized for AI ingestion.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-[11px] bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-500/30 font-medium flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>5 Connected • 1 Demo Stream</span>
          </span>
        </div>
      </div>

      {/* Grid of Data Source Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {dataSourcesList.map((source, idx) => (
          <div 
            key={idx} 
            className="bg-[#091120] border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between hover:border-slate-700 transition-colors"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 mb-3">
                <div>
                  <h3 className="text-xs font-bold text-white">{source.name}</h3>
                  <span className="text-[11px] text-cyan-400">{source.agency}</span>
                </div>
                <span className={cn(
                  "text-[10px] px-2 py-0.5 rounded font-medium border",
                  source.status === 'CONNECTED' 
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" 
                    : "bg-blue-500/10 text-blue-300 border-blue-500/30"
                )}>
                  {source.status === 'CONNECTED' ? '● Connected' : '○ Demo Stream'}
                </span>
              </div>

              {/* Detail Payload */}
              <div className="space-y-2 text-xs mb-3.5">
                <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-medium">Data Stream Type</span>
                  <span className="text-xs text-slate-200 font-semibold">{source.type}</span>
                </div>
                <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-medium">Normalized Payloads</span>
                  <span className="text-xs text-cyan-300 truncate block font-mono">{source.payload}</span>
                </div>
              </div>
            </div>

            {/* Metrics Footer */}
            <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-800/80 text-center text-xs">
              <div className="p-1.5 bg-slate-900/80 rounded-lg border border-slate-800">
                <span className="text-slate-400 uppercase block text-[9px]">Latency</span>
                <span className="font-bold text-cyan-400 font-mono">{source.latency}</span>
              </div>
              <div className="p-1.5 bg-slate-900/80 rounded-lg border border-slate-800">
                <span className="text-slate-400 uppercase block text-[9px]">Update</span>
                <span className="font-bold text-emerald-400 font-mono">{source.lastUpdate.substring(0, 8)}</span>
              </div>
              <div className="p-1.5 bg-slate-900/80 rounded-lg border border-slate-800">
                <span className="text-slate-400 uppercase block text-[9px]">Records</span>
                <span className="font-bold text-white truncate block font-mono">{source.records.split(' ')[0]}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Orchestration Pipeline Topology */}
      <div className="bg-[#091120] border border-slate-800 rounded-xl p-5 shadow-sm">
        <h2 className="text-xs font-semibold text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
          <Network className="w-4 h-4 text-cyan-400" />
          <span>Data Normalization & AI Pipeline</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] text-cyan-400 font-bold uppercase block mb-1">Stage 1: Ingestion & Decoding</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Receives HDF5, NetCDF, GeoTIFF rasters from MOSDAC/INCOIS and raw NMEA AIS sentences over secure webhooks.
            </p>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] text-cyan-400 font-bold uppercase block mb-1">Stage 2: Spatial-Temporal Fusion</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Interpolates uneven satellite passes onto a continuous 1km H3 mesh for uniform multi-layer overlay.
            </p>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] text-cyan-400 font-bold uppercase block mb-1">Stage 3: Agentic Dispatch</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Streams normalized features to Ocean Analytics, Weather, and Risk Assessment agent swarms in sub-200ms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


