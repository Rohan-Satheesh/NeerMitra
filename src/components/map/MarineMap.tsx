import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon, Circle, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import { mockGeofence } from '@/services/mockData';

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

// Custom Icons
const vesselIcon = new L.DivIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #0ea5e9; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px #0ea5e9;"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6]
});

const pfzIcon = new L.DivIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #22c55e; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 15px #22c55e; animation: pulse 2s infinite;"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

interface MarineMapProps {
  showSST?: boolean;
  showChlorophyll?: boolean;
  showVessels?: boolean;
  showPFZ?: boolean;
  showGeofence?: boolean;
  center?: [number, number];
  zoom?: number;
}

export default function MarineMap({
  showSST = false,
  showChlorophyll = false,
  showVessels = true,
  showPFZ = true,
  showGeofence = true,
  center = [15.0, 72.0],
  zoom = 5
}: MarineMapProps) {
  const [vessels, setVessels] = useState<any[]>([]);
  const [pfzs, setPfzs] = useState<any[]>([]);

  useEffect(() => {
    if (showVessels) {
      fetch('/api/vessels').then(res => res.json()).then(data => setVessels(data.vessels || [])).catch(() => {});
    }
    if (showPFZ) {
      fetch('/api/pfz').then(res => res.json()).then(data => setPfzs(data.pfz || [])).catch(() => {});
    }
  }, [showVessels, showPFZ]);

  return (
    <div className="w-full h-full relative rounded-lg overflow-hidden border border-border z-0">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        minZoom={3}
        maxBounds={[[-90, -180], [90, 180]]}
        maxBoundsViscosity={1.0}
        style={{ height: '100%', width: '100%', background: '#030712' }}
        zoomControl={false}
      >
        {/* Dark theme tiles without API key requirement */}
        <TileLayer
          attribution='&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Esri, DeLorme, NAVTEQ'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          noWrap={true}
          bounds={[[-90, -180], [90, 180]]}
        />

        {/* SST Simulation Layer - represented as a colored polygon/heatmap mock */}
        {showSST && (
          <Circle center={[12.0, 70.0]} radius={500000} pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.2, stroke: false }} />
        )}

        {/* Chlorophyll Simulation Layer */}
        {showChlorophyll && (
          <Circle center={[14.0, 74.0]} radius={300000} pathOptions={{ color: '#22c55e', fillColor: '#22c55e', fillOpacity: 0.2, stroke: false }} />
        )}

        {/* Geofence / EEZ boundary mock */}
        {showGeofence && (
          <Polygon positions={mockGeofence as [number, number][]} pathOptions={{ color: '#0ea5e9', weight: 2, dashArray: '5, 10', fillOpacity: 0.05 }} />
        )}

        {/* Vessels Layer */}
        {showVessels && vessels.map(vessel => (
          <Marker key={vessel.id} position={[vessel.lat, vessel.lng]} icon={vesselIcon}>
            <Popup className="marine-popup">
              <div className="text-sm">
                <strong className="block text-primary text-base border-b border-border pb-1 mb-1">{vessel.name}</strong>
                <p>Type: {vessel.type}</p>
                <p>Speed: {vessel.speed} kn</p>
                <p>Status: {vessel.status}</p>
                <p>Risk: <span className={vessel.risk === 'High' ? 'text-destructive' : vessel.risk === 'Medium' ? 'text-warning' : 'text-green-500'}>{vessel.risk}</span></p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* PFZ Layer */}
        {showPFZ && pfzs.map(pfz => (
          <Marker key={pfz.id} position={[pfz.lat, pfz.lng]} icon={pfzIcon}>
            <Popup className="marine-popup">
              <div className="text-sm">
                <strong className="block text-green-500 text-base border-b border-border pb-1 mb-1">High Potential Zone</strong>
                <p>Probability: {pfz.probability}%</p>
                <p>SST: {pfz.sst}°C</p>
                <p>Chlorophyll: {pfz.chl || pfz.chlorophyll}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Inject custom styles for popups and pulse animation */}
      <style>{`
        .leaflet-popup-content-wrapper {
          background: #071525;
          color: #f8fafc;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
        }
        .leaflet-popup-tip {
          background: #071525;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          border-left: 1px solid rgba(255, 255, 255, 0.08);
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(34, 197, 94, 0); }
          100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
      `}</style>
    </div>
  );
}
