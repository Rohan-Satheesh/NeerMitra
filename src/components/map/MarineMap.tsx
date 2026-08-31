import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, Circle } from 'react-leaflet';
import L from 'leaflet';
import { mockGeofence, mockVessels, mockPFZs, type Vessel, type PFZ } from '@/services/mockData';
import { liveVesselService } from '@/services/liveVesselService';
import ScanEffect from '@/components/hud/ScanEffect';
import ProvenanceModal from '@/components/hud/ProvenanceModal';
import { Ship, Navigation, Wind, Thermometer, Waves, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';

// Fix Leaflet's default icon path issues
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Custom Tactical Vessel Icon
const createVesselIcon = (vessel: Vessel, isSelected: boolean = false) => {
  const color = vessel.risk === 'High' ? '#f43f5e' : vessel.risk === 'Medium' ? '#f59e0b' : '#00D2FF';
  const heading = vessel.heading || 0;
  
  return new L.DivIcon({
    className: 'tactical-vessel-icon',
    html: `
      <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
        ${isSelected ? `<div style="position: absolute; inset: -4px; border: 1.5px dashed #00D2FF; border-radius: 50%; animation: spin 8s linear infinite;"></div>` : ''}
        <div style="
          width: 22px; 
          height: 22px; 
          background: #07111F; 
          border: 2px solid ${color}; 
          border-radius: 50%; 
          box-shadow: 0 0 12px ${color}80; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          transform: rotate(${heading}deg);
        ">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 19 21 12 17 5 21 12 2" fill="${color}" fill-opacity="0.3"></polygon>
          </svg>
        </div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
};

// Custom Tactical PFZ Hotspot Icon
const createPFZIcon = (pfz: PFZ, isSelected: boolean = false) => {
  return new L.DivIcon({
    className: 'tactical-pfz-icon',
    html: `
      <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; inset: 0; border-radius: 50%; background: radial-gradient(circle, rgba(16,185,129,0.4) 0%, rgba(16,185,129,0) 70%); animation: pulse-ring 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;"></div>
        <div style="
          width: 18px; 
          height: 18px; 
          background: #07111F; 
          border: 2px solid #10b981; 
          border-radius: 50%; 
          box-shadow: 0 0 15px rgba(16,185,129,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="width: 6px; height: 6px; background: #10b981; border-radius: 50%;"></div>
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });
};

interface MarineMapProps {
  showSST?: boolean;
  showChlorophyll?: boolean;
  showVessels?: boolean;
  showPFZ?: boolean;
  showGeofence?: boolean;
  isScanning?: boolean;
  onScanComplete?: () => void;
  center?: [number, number];
  zoom?: number;
  selectedVesselId?: string | null;
  onSelectVessel?: (vessel: Vessel) => void;
  onSelectPFZ?: (pfz: PFZ) => void;
}

export default function MarineMap({
  showSST = false,
  showChlorophyll = false,
  showVessels = true,
  showPFZ = true,
  showGeofence = true,
  isScanning = false,
  onScanComplete,
  center = [14.0, 73.0],
  zoom = 6,
  selectedVesselId,
  onSelectVessel,
  onSelectPFZ
}: MarineMapProps) {
  const [vessels, setVessels] = useState<Vessel[]>(mockVessels);
  const [pfzs, setPfzs] = useState<PFZ[]>(mockPFZs);
  const [whyModalOpen, setWhyModalOpen] = useState(false);
  const [selectedItemForWhy, setSelectedItemForWhy] = useState<string>('');

  useEffect(() => {
    if (!showVessels) return;

    // Subscribe to real-time dynamic AIS movement engine
    const unsubscribe = liveVesselService.subscribe((liveVessels) => {
      setVessels([...liveVessels]);
    });

    return () => unsubscribe();
  }, [showVessels]);


  useEffect(() => {
    if (showPFZ) {
      fetch('/api/pfz')
        .then(res => res.json())
        .then(data => {
          if (data.pfz && data.pfz.length > 0) {
            setPfzs(data.pfz);
          }
        })
        .catch(() => {
          setPfzs(mockPFZs);
        });
    }
  }, [showPFZ]);

  const handleOpenWhy = (title: string) => {
    setSelectedItemForWhy(title);
    setWhyModalOpen(true);
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#070D18] select-none">
      {/* Satellite Scan Animation Layer */}
      <ScanEffect isScanning={isScanning} onScanComplete={onScanComplete} />

      {/* Map Component */}
      <MapContainer 
        center={center} 
        zoom={zoom} 
        minZoom={3}
        maxBounds={[[-90, -180], [90, 180]]}
        maxBoundsViscosity={1.0}
        style={{ height: '100%', width: '100%', background: '#070D18' }}
        zoomControl={false}
      >
        {/* CARTO Dark Matter Basemap with Active API Key */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png?key=cb1_2m04_1_3f470e2298f7bf1f28a78ef9"
          maxZoom={19}
        />

        {/* SST Thermal Heat Contours */}
        {showSST && (
          <>
            <Circle 
              center={[14.5, 71.5]} 
              radius={240000} 
              pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.18, stroke: true, weight: 1, dashArray: '4, 4' }} 
            />
            <Circle 
              center={[10.5, 74.5]} 
              radius={180000} 
              pathOptions={{ color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.15, stroke: true, weight: 1, dashArray: '4, 4' }} 
            />
          </>
        )}

        {/* Chlorophyll Bloom Zones */}
        {showChlorophyll && (
          <>
            <Circle 
              center={[11.5, 74.1]} 
              radius={160000} 
              pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.22, stroke: true, weight: 1 }} 
            />
            <Circle 
              center={[9.8, 75.2]} 
              radius={140000} 
              pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.25, stroke: true, weight: 1 }} 
            />
          </>
        )}

        {/* EEZ Maritime Geofence Polygon */}
        {showGeofence && (
          <Polygon 
            positions={mockGeofence as [number, number][]} 
            pathOptions={{ 
              color: '#00D2FF', 
              weight: 2, 
              dashArray: '6, 8', 
              fillColor: '#00D2FF', 
              fillOpacity: 0.03 
            }} 
          />
        )}

        {/* Vessel Markers */}
        {showVessels && vessels.map((vessel) => {
          const isSelected = selectedVesselId === vessel.id;
          return (
            <Marker 
              key={vessel.id} 
              position={[vessel.lat, vessel.lng]} 
              icon={createVesselIcon(vessel, isSelected)}
              eventHandlers={{
                click: () => {
                  if (onSelectVessel) onSelectVessel(vessel);
                }
              }}
            >
              <Popup className="marine-popup">
                <div className="font-mono text-xs p-1 space-y-2 min-w-[220px]">
                  <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                    <div className="flex items-center space-x-1.5">
                      <Ship className="w-4 h-4 text-cyan-400" />
                      <span className="font-bold text-white text-sm">{vessel.name}</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 bg-slate-800 text-cyan-400 rounded border border-cyan-500/30 font-bold">
                      {vessel.id}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase">Type</span>
                      <span className="font-semibold text-white">{vessel.type}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase">Speed</span>
                      <span className="font-semibold text-cyan-400">{vessel.speed} kn</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase">Heading</span>
                      <span className="font-semibold text-white">{vessel.heading || 180}°</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase">Risk Index</span>
                      <span className={vessel.risk === 'High' ? 'text-rose-400 font-bold' : vessel.risk === 'Medium' ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                        {vessel.risk || 'Nominal'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex gap-2">
                    <button 
                      onClick={() => handleOpenWhy(`Vessel ${vessel.name} (${vessel.id}) Routing & Risk Model`)}
                      className="flex-1 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded text-[10px] font-bold transition-colors"
                    >
                      EXPLAIN WHY
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Potential Fishing Zones (PFZ) Markers */}
        {showPFZ && pfzs.map((pfz) => (
          <Marker 
            key={pfz.id} 
            position={[pfz.lat, pfz.lng]} 
            icon={createPFZIcon(pfz)}
            eventHandlers={{
              click: () => {
                if (onSelectPFZ) onSelectPFZ(pfz);
              }
            }}
          >
            <Popup className="marine-popup">
              <div className="font-mono text-xs p-1 space-y-2 min-w-[240px]">
                <div className="flex items-center justify-between border-b border-emerald-500/30 pb-2">
                  <div className="flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-emerald-400 text-sm">PFZ Sector {pfz.id}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-bold border border-emerald-500/30">
                    {pfz.probability}% PROB
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                  <div className="flex items-center space-x-1.5">
                    <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase">SST</span>
                      <span className="font-bold text-white">{pfz.sst}°C</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Waves className="w-3.5 h-3.5 text-emerald-400" />
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase">Chlorophyll</span>
                      <span className="font-bold text-emerald-400">{pfz.chlorophyll || 'High'}</span>
                    </div>
                  </div>
                </div>

                <div className="p-2 rounded bg-emerald-500/5 border border-emerald-500/20 text-[10px] text-emerald-300">
                  Thermal front & chlorophyll bloom confluence confirmed by INCOIS advisory.
                </div>

                <div className="pt-2 border-t border-white/5 flex gap-2">
                  <button 
                    onClick={() => handleOpenWhy(`PFZ Sector ${pfz.id} Confluence Prediction`)}
                    className="flex-1 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded text-[10px] font-bold transition-colors"
                  >
                    WHY THIS ZONE?
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Provenance Lineage Modal */}
      <ProvenanceModal
        isOpen={whyModalOpen}
        onClose={() => setWhyModalOpen(false)}
        recommendation={selectedItemForWhy || 'Marine Intelligence Recommendation'}
      />
    </div>
  );
}

