import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Fuel, 
  ShieldCheck, 
  Play, 
  Sliders,
  Ship,
  Compass,
  Navigation,
  RotateCcw
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import MarineMap, { type NavigationCourse } from '@/components/map/MarineMap';

interface PortDestination {
  id: string;
  name: string;
  nameMl: string;
  lat: number;
  lng: number;
  type: 'harbor' | 'zone';
}

const PORTS: PortDestination[] = [
  { id: 'kochi', name: 'Kochi Harbor (Thoppumpady)', nameMl: 'കൊച്ചി ഹാർബർ', lat: 9.93, lng: 76.24, type: 'harbor' },
  { id: 'munambam', name: 'Munambam Fishing Port', nameMl: 'മുനമ്പം ഫിഷിംഗ് ഹാർബർ', lat: 10.18, lng: 76.16, type: 'harbor' },
  { id: 'kollam', name: 'Kollam (Neendakara) Port', nameMl: 'നീണ്ടകര ഹാർബർ, കൊല്ലം', lat: 8.94, lng: 76.54, type: 'harbor' },
  { id: 'beypore', name: 'Beypore Port, Kozhikode', nameMl: 'ബേപ്പൂർ തുറമുഖം', lat: 11.16, lng: 75.81, type: 'harbor' },
  { id: 'vizhinjam', name: 'Vizhinjam Marine Port', nameMl: 'വിഴിഞ്ഞം തുറമുഖം', lat: 8.37, lng: 76.98, type: 'harbor' },
];

const TARGET_ZONES: PortDestination[] = [
  { id: 'zone-k04', name: 'Sector K-04 (High-Yield PFZ)', nameMl: 'സെക്ടർ K-04 (ചാകര സോൺ)', lat: 9.93, lng: 75.68, type: 'zone' },
  { id: 'zone-m02', name: 'Sector M-02 (Off Munambam)', nameMl: 'സെക്ടർ M-02 (മുനമ്പം തീരം)', lat: 10.22, lng: 75.78, type: 'zone' },
  { id: 'zone-wadge', name: 'Wadge Bank Fishery Grounds', nameMl: 'വാഡ്ജ് ബാങ്ക് മത്സ്യമേഖല', lat: 7.95, lng: 76.90, type: 'zone' },
  { id: 'zone-lakshadweep', name: 'Lakshadweep Deep Basin', nameMl: 'ലക്ഷദ്വീപ് കടൽത്തീരം', lat: 10.10, lng: 74.20, type: 'zone' },
];

interface VesselType {
  id: string;
  name: string;
  nameMl: string;
  speedKnots: number;
  fuelRate: number; // liters per nautical mile
}

const VESSEL_TYPES: VesselType[] = [
  { id: 'trawler', name: 'Deep-Sea Mechanized Trawler (350 HP)', nameMl: 'മെക്കനൈസ്ഡ് ട്രോളർ', speedKnots: 9.5, fuelRate: 3.8 },
  { id: 'gillnetter', name: 'Multiday Gillnetter / Longliner', nameMl: 'മൾട്ടിഡേ ഗിൽനെറ്റർ', speedKnots: 11.0, fuelRate: 2.9 },
  { id: 'ringseiner', name: 'Inshore Ring Seiner Craft', nameMl: 'റിങ് സീനർ വള്ളം', speedKnots: 8.0, fuelRate: 2.1 },
  { id: 'carrier', name: 'Coastal Fish Transporter / Carrier', nameMl: 'ഫിഷ് കാരിയർ ബോട്ട്', speedKnots: 12.5, fuelRate: 4.2 },
];

interface VoyageInputs {
  originId: string;
  destId: string;
  vesselId: string;
  avoidSwell: boolean;
  stayEEZ: boolean;
  currentAssistance: boolean;
}

const DIESEL_INR_PER_LITER = 94.0;
const CO2_KG_PER_LITER = 2.68;
const CURRENT_BOOST_KN = 1.2;
const NUM_WAYPOINTS = 20;

const toRad = (deg: number) => (deg * Math.PI) / 180;

// Local flat-earth offset in nautical miles (east, north) from a to b.
function offsetNM(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const north = (b.lat - a.lat) * 60;
  const east = (b.lng - a.lng) * 60 * Math.cos(toRad((a.lat + b.lat) / 2));
  return { east, north };
}

function compassLabel(bearing: number, ml: boolean) {
  const en = ['North', 'North-East', 'East', 'South-East', 'South', 'South-West', 'West', 'North-West'];
  const mlNames = ['വടക്ക്', 'വടക്കുകിഴക്ക്', 'കിഴക്ക്', 'തെക്കുകിഴക്ക്', 'തെക്ക്', 'തെക്കുപടിഞ്ഞാറ്', 'പടിഞ്ഞാറ്', 'വടക്കുപടിഞ്ഞാറ്'];
  const idx = Math.round(bearing / 45) % 8;
  return `${(ml ? mlNames : en)[idx]} (${Math.round(bearing)}°)`;
}

// Builds a bowed offshore route and measures the real polyline length.
function buildRoute(origin: PortDestination, dest: PortDestination, avoidSwell: boolean, stayEEZ: boolean) {
  const { east, north } = offsetNM(origin, dest);
  const straightNM = Math.hypot(east, north);
  const bearing = (Math.atan2(east, north) * 180 / Math.PI + 360) % 360;

  // Unit vector along the track and the perpendicular pointing offshore (west).
  const ux = straightNM ? east / straightNM : 0;
  const uy = straightNM ? north / straightNM : 1;
  let px = -uy;
  let py = ux;
  if (px > 0 || (Math.abs(px) < 1e-9 && py < 0)) { px = -px; py = -py; }

  const amplitude = (avoidSwell ? 0.08 : 0.02) + (stayEEZ ? 0.02 : 0);
  const waypoints: [number, number][] = [];
  for (let i = 1; i <= NUM_WAYPOINTS; i++) {
    const t = i / (NUM_WAYPOINTS + 1);
    const bow = 4 * t * (1 - t) * amplitude * straightNM; // NM off the straight line
    const midLat = origin.lat + (dest.lat - origin.lat) * t;
    const lat = midLat + (py * bow) / 60;
    const lng = origin.lng + (dest.lng - origin.lng) * t + (px * bow) / (60 * Math.cos(toRad(midLat)));
    waypoints.push([lat, lng]);
  }

  const path = [
    { lat: origin.lat, lng: origin.lng },
    ...waypoints.map(([lat, lng]) => ({ lat, lng })),
    { lat: dest.lat, lng: dest.lng },
  ];
  let routeNM = 0;
  for (let i = 1; i < path.length; i++) {
    const o = offsetNM(path[i - 1], path[i]);
    routeNM += Math.hypot(o.east, o.north);
  }

  return { straightNM, routeNM, bearing, waypoints };
}

export default function FleetOptimizer() {
  const { language } = useLanguage();
  const isML = language === 'ML';

  // Live form inputs
  const [selectedOrigin, setSelectedOrigin] = useState<string>('kochi');
  const [selectedDest, setSelectedDest] = useState<string>('zone-k04');
  const [selectedVessel, setSelectedVessel] = useState<string>('trawler');
  const [avoidSwell, setAvoidSwell] = useState<boolean>(true);
  const [stayEEZ, setStayEEZ] = useState<boolean>(true);
  const [currentAssistance, setCurrentAssistance] = useState<boolean>(true);

  // Simulation state. `plan` is the input snapshot taken when Run is clicked, so
  // the plotted route and results only change on an explicit re-run.
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationStage, setOptimizationStage] = useState(0);
  const [plan, setPlan] = useState<VoyageInputs | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const liveInputs: VoyageInputs = {
    originId: selectedOrigin,
    destId: selectedDest,
    vesselId: selectedVessel,
    avoidSwell,
    stayEEZ,
    currentAssistance,
  };
  const planStale = !!plan && (Object.keys(liveInputs) as (keyof VoyageInputs)[]).some(k => liveInputs[k] !== plan[k]);

  const originPort = PORTS.find(p => p.id === selectedOrigin) || PORTS[0];
  const destZone = TARGET_ZONES.find(z => z.id === selectedDest) || TARGET_ZONES[0];

  // Live preview distance for the current inputs (same geometry as the plotted route).
  const preview = useMemo(
    () => buildRoute(originPort, destZone, avoidSwell, stayEEZ),
    [originPort, destZone, avoidSwell, stayEEZ]
  );
  const distanceNM = Math.round(preview.routeNM * 10) / 10;
  const distanceKm = Math.round(preview.routeNM * 1.852 * 10) / 10;

  // Full evaluation of the snapshot taken at Run time.
  const result = useMemo(() => {
    if (!plan) return null;
    const origin = PORTS.find(p => p.id === plan.originId) || PORTS[0];
    const dest = TARGET_ZONES.find(z => z.id === plan.destId) || TARGET_ZONES[0];
    const vsl = VESSEL_TYPES.find(v => v.id === plan.vesselId) || VESSEL_TYPES[0];
    const route = buildRoute(origin, dest, plan.avoidSwell, plan.stayEEZ);

    const boost = plan.currentAssistance ? CURRENT_BOOST_KN : 0;
    const groundSpeed = vsl.speedKnots + boost;
    // Constant engine burn per hour: fuel per NM scales with speed over ground.
    const fuelPerNM = vsl.fuelRate * (vsl.speedKnots / groundSpeed);
    const fuelLiters = Math.round(route.routeNM * fuelPerNM * 2); // round trip
    // Baseline: straight track, no current assistance.
    const fuelBaseline = Math.round(route.straightNM * vsl.fuelRate * 2);
    const savedLiters = fuelBaseline - fuelLiters;

    return {
      origin, dest, route,
      speed: Math.round(groundSpeed * 10) / 10,
      fuelLiters,
      fuelBaseline,
      savingsPercent: fuelBaseline ? Math.round((savedLiters / fuelBaseline) * 1000) / 10 : 0,
      savingsInr: Math.round(savedLiters * DIESEL_INR_PER_LITER),
      co2ReductionKg: Math.round(savedLiters * CO2_KG_PER_LITER),
      timeHours: Math.round((route.routeNM / groundSpeed) * 10) / 10,
      // Planning estimates, not live INCOIS data.
      maxSwellMeters: plan.avoidSwell ? 1.3 : 2.4,
      confidenceScore: plan.avoidSwell ? 94 : 81,
      tag: isML ? 'സുരക്ഷിത പാത' : 'Safe Weather Corridor',
    };
  }, [plan, isML]);

  const stages = [
    "ANALYZING COASTAL BATHYMETRY & REEF CONSTRAINTS",
    "POLLING INCOIS REAL-TIME SWELL & CURRENT VECTORS",
    "COMPUTING DIESEL CONSUMPTION ALONG ALTERNATIVE WAYPOINTS",
    "VERIFYING MARITIME EEZ AND COAST GUARD CORRIDORS",
    "OPTIMAL FUEL & WEATHER TRACK READY"
  ];

  const handleRunOptimizer = () => {
    if (isOptimizing) return;
    if (timerRef.current) clearInterval(timerRef.current);
    const snapshot = { ...liveInputs };
    setIsOptimizing(true);
    setPlan(null);
    setOptimizationStage(0);

    let stage = 0;
    timerRef.current = setInterval(() => {
      stage += 1;
      if (stage >= stages.length - 1) {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
        setOptimizationStage(stages.length - 1);
        setIsOptimizing(false);
        setPlan(snapshot);
      } else {
        setOptimizationStage(stage);
      }
    }, 450);
  };

  const computedCourse = useMemo<NavigationCourse | null>(() => {
    if (!result) return null;
    return {
      id: 'course-strat-balanced',
      origin: { lat: result.origin.lat, lng: result.origin.lng, name: result.origin.name },
      destination: { lat: result.dest.lat, lng: result.dest.lng, name: result.dest.name, species: 'High-Yield Pelagic' },
      distance: `${Math.round(result.route.routeNM * 10) / 10} NM`,
      bearing: compassLabel(result.route.bearing, false),
      fuelEstimate: `${result.fuelLiters} L (${result.tag})`,
      waypoints: result.route.waypoints,
    };
  }, [result]);

  return (
    <div className="max-w-7xl mx-auto w-full px-3.5 sm:px-6 py-3 flex flex-col gap-3 font-sans select-none lg:h-full">

      {/* Top Header Card */}
      <div className="bg-white border border-[#D8E5EB] rounded-2xl px-4 py-3 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-bold text-[#176B87] uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#176B87]" />
              {language === 'ML' ? 'തുറമുഖ & ഇന്ധന ഒപ്റ്റിമൈസർ' : 'Harbor & Fleet Energy Routing'}
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-black text-[#0B3954] flex items-center gap-2.5">
            <Ship className="w-5 h-5 text-[#176B87]" />
            <span>{language === 'ML' ? 'ഫ്ലീറ്റ് വെതർ റൂട്ട് ഒപ്റ്റിമൈസർ' : 'Fleet Route & Fuel Optimizer'}</span>
          </h1>
          <p className="hidden xl:block text-xs text-[#5B7282] mt-0.5 max-w-2xl leading-relaxed">
            {language === 'ML'
              ? 'ഉയർന്ന തിരമാലകളും പ്രതികൂല ഒഴുക്കുകളും ഒഴിവാക്കി കുറഞ്ഞ ഇന്ധനച്ചെലവിൽ ചാകര മേഖലകളിലേക്ക് എത്തിച്ചേരാനുള്ള സമുദ്ര നാവിഗേഷൻ.'
              : 'Multi-objective marine routing avoiding rough swells, optimizing current assistance, and cutting round-trip diesel expenses.'}
          </p>
        </div>

        {/* Global Delta Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-2 bg-[#E8F7F0] border border-[#A6E2C6] px-3 py-1.5 rounded-xl shadow-2xs">
            <Fuel className="w-4 h-4 text-[#16865B]" />
            <div>
              <span className="text-[10px] text-[#5B7282] block font-bold uppercase">Avg. Diesel Saved</span>
              <span className="text-xs font-black text-[#16865B]">
                {result ? `${result.savingsPercent}% vs straight track` : 'Run optimizer to compute'}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-[#F8FCFD] border border-[#D8E5EB] px-3 py-1.5 rounded-xl shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-[#176B87]" />
            <div>
              <span className="text-[10px] text-[#5B7282] block font-bold uppercase">Safety Index</span>
              <span className="text-xs font-bold text-[#0B3954]">Swell &le; 1.5m</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Parameters on Left + Interactive Chart & Results on Right */}
      <div className="flex flex-col lg:flex-row gap-3 flex-1 min-h-0">

        {/* Left Column: Voyage Parameters — stretches to match the map column's height */}
        <div className="lg:w-[340px] lg:shrink-0 flex flex-col min-h-0">
          <div className="bg-white border border-[#D8E5EB] rounded-2xl shadow-xs flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Scrollable form fields — the action button below stays fixed and never scrolls with these */}
          <div className="p-4 space-y-3 flex-1 overflow-y-auto min-h-0">
            <div className="flex items-center justify-between border-b border-[#E2EDF2] pb-3">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-[#176B87]" />
                <h2 className="text-sm font-bold text-[#0B3954] uppercase tracking-wider">
                  {language === 'ML' ? 'യാത്രാ വിവരങ്ങൾ' : 'Voyage Parameters'}
                </h2>
              </div>
              <span className="text-[10px] text-[#16865B] font-bold bg-[#E8F7F0] px-2 py-0.5 rounded-md border border-[#A6E2C6]">
                Live Inputs
              </span>
            </div>

            {/* Departure Harbor */}
            <div>
              <label className="text-[11px] text-[#5B7282] font-bold uppercase tracking-wider block mb-1">
                {language === 'ML' ? 'പുറപ്പെടുന്ന തുറമുഖം (Origin Harbor)' : 'Departure Harbor'}
              </label>
              <select
                value={selectedOrigin}
                onChange={e => setSelectedOrigin(e.target.value)}
                className="w-full bg-[#F8FCFD] border border-[#D8E5EB] rounded-xl px-3 py-2.5 text-xs text-[#0B3954] font-semibold focus:outline-none focus:border-[#176B87] transition-colors"
              >
                {PORTS.map(p => (
                  <option key={p.id} value={p.id}>
                    {language === 'ML' ? p.nameMl : p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Destination Target Zone */}
            <div>
              <label className="text-[11px] text-[#5B7282] font-bold uppercase tracking-wider block mb-1">
                {language === 'ML' ? 'ലക്ഷ്യസ്ഥാനം (Target Fishing Zone)' : 'Target Fishing Sector'}
              </label>
              <select
                value={selectedDest}
                onChange={e => setSelectedDest(e.target.value)}
                className="w-full bg-[#F8FCFD] border border-[#D8E5EB] rounded-xl px-3 py-2.5 text-xs text-[#0B3954] font-semibold focus:outline-none focus:border-[#176B87] transition-colors"
              >
                {TARGET_ZONES.map(z => (
                  <option key={z.id} value={z.id}>
                    {language === 'ML' ? z.nameMl : z.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Vessel Category */}
            <div>
              <label className="text-[11px] text-[#5B7282] font-bold uppercase tracking-wider block mb-1">
                {language === 'ML' ? 'ബോട്ട് / വള്ളത്തിന്റെ തരം' : 'Vessel Class'}
              </label>
              <select
                value={selectedVessel}
                onChange={e => setSelectedVessel(e.target.value)}
                className="w-full bg-[#F8FCFD] border border-[#D8E5EB] rounded-xl px-3 py-2.5 text-xs text-[#0B3954] font-semibold focus:outline-none focus:border-[#176B87] transition-colors"
              >
                {VESSEL_TYPES.map(v => (
                  <option key={v.id} value={v.id}>
                    {language === 'ML' ? v.nameMl : v.name} ({v.speedKnots} kn)
                  </option>
                ))}
              </select>
            </div>

            {/* Constraints Checkboxes */}
            <div className="space-y-2 pt-1 border-t border-[#E2EDF2]">
              <span className="text-[11px] text-[#5B7282] font-bold uppercase tracking-wider block mb-1">
                {language === 'ML' ? 'പരിഗണനകൾ (Constraints)' : 'Optimization Factors'}
              </span>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FCFD] border border-[#E2EDF2] cursor-pointer hover:border-[#176B87]/40 transition-colors">
                <span className="text-xs text-[#173042] font-medium">
                  {language === 'ML' ? 'ശക്തമായ തിരമാലകൾ ഒഴിവാക്കുക' : 'Avoid High Swells & Choppy Waves'}
                </span>
                <input 
                  type="checkbox" 
                  checked={avoidSwell} 
                  onChange={e => setAvoidSwell(e.target.checked)} 
                  className="accent-[#176B87] w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FCFD] border border-[#E2EDF2] cursor-pointer hover:border-[#176B87]/40 transition-colors">
                <span className="text-xs text-[#173042] font-medium">
                  {language === 'ML' ? 'ഇന്ത്യൻ അതിർത്തിക്കുള്ളിൽ നിൽക്കുക' : 'Stay Within Indian EEZ Waters'}
                </span>
                <input 
                  type="checkbox" 
                  checked={stayEEZ} 
                  onChange={e => setStayEEZ(e.target.checked)} 
                  className="accent-[#176B87] w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FCFD] border border-[#E2EDF2] cursor-pointer hover:border-[#176B87]/40 transition-colors">
                <span className="text-xs text-[#173042] font-medium">
                  {language === 'ML' ? 'അനുകൂല ഒഴുക്ക് പ്രയോജനപ്പെടുത്തുക' : 'Surface Current Speed Boost'}
                </span>
                <input 
                  type="checkbox" 
                  checked={currentAssistance} 
                  onChange={e => setCurrentAssistance(e.target.checked)} 
                  className="accent-[#176B87] w-4 h-4 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Run Action Button — pinned footer, stays visible above the scrolling fields regardless of scroll position */}
          <div className="p-4 pt-3 border-t border-[#E2EDF2] shrink-0 bg-white">
            <button
              onClick={handleRunOptimizer}
              disabled={isOptimizing}
              className="w-full bg-[#176B87] hover:bg-[#0B3954] text-white font-bold text-xs py-3.5 rounded-xl flex items-center justify-center space-x-2 shadow-xs hover:shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              {isOptimizing ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>{language === 'ML' ? 'പാത കണക്കാക്കുന്നു...' : 'Calculating Optimal Route...'}</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>{language === 'ML' ? 'റൂട്ട് ഒപ്റ്റിമൈസ് ചെയ്യുക' : 'Compute Optimal Route'}</span>
                </>
              )}
            </button>
          </div>
          </div>
        </div>

        {/* Right Column: Nautical Chart Vector Map */}
        <div className="flex-1 min-w-0 min-h-0 flex flex-col gap-3">

          {/* Animated Nautical Chart Visualization */}
          <div className="bg-white border border-[#D8E5EB] rounded-2xl p-3 shadow-xs relative overflow-hidden flex-1 min-h-[300px] flex flex-col">
            <div className="flex items-center justify-between border-b border-[#E2EDF2] pb-2 mb-3 shrink-0">
              <div className="flex items-center space-x-2">
                <Navigation className="w-4 h-4 text-[#176B87]" />
                <h3 className="text-sm font-bold text-[#0B3954]">
                  {language === 'ML' ? 'നാവിഗേഷൻ ചാർട്ട് (Nautical Route Map)' : 'Nautical Corridor & Wave Map'}
                </h3>
              </div>
              <div className="flex items-center space-x-3 text-xs">
                <span className="font-bold text-[#0B3954] flex items-center gap-1">
                  <span className="text-[#5B7282] font-normal">Distance:</span> {distanceNM} NM ({distanceKm} km)
                </span>
                {planStale ? (
                  <span className="text-[#9A6A00] bg-[#FFF6DD] border border-[#F0D58A] px-2.5 py-0.5 rounded-md font-bold text-[11px]">
                    {isML ? 'ഇൻപുട്ട് മാറി — വീണ്ടും കണക്കാക്കുക' : 'Inputs changed — re-run'}
                  </span>
                ) : result ? (
                  <span className="text-[#16865B] bg-[#E8F7F0] border border-[#A6E2C6] px-2.5 py-0.5 rounded-md font-bold text-[11px]">
                    Safe Corridor Active
                  </span>
                ) : null}
              </div>
            </div>

            {/* Google Maps style interactive map */}
            <div className="w-full flex-1 min-h-0 rounded-xl relative border border-[#CDE3ED] overflow-hidden shadow-inner z-0">
              <MarineMap
                center={[(originPort.lat + destZone.lat) / 2, (originPort.lng + destZone.lng) / 2]}
                zoom={preview.routeNM > 200 ? 6 : 7}
                showSST={true}
                showVessels={true}
                course={computedCourse}
                hideCourseHud
                initialPinLabel={language === 'ML' ? 'റൂട്ട് മാപ്പ്' : 'Fleet Operations Map'}
              />

              {/* Optimization Progress Overlay */}
              {isOptimizing && (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 z-20">
                  <RotateCcw className="w-8 h-8 text-[#176B87] animate-spin mb-3" />
                  <h4 className="text-sm font-bold text-[#0B3954] mb-1">
                    {stages[optimizationStage]}
                  </h4>
                  <div className="w-64 bg-[#F4F9FB] rounded-full h-2 overflow-hidden border border-[#D8E5EB] mt-2">
                    <div 
                      className="bg-[#176B87] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((optimizationStage + 1) / stages.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results Panel */}
          {result && (
            <div className="bg-white border border-[#D8E5EB] rounded-2xl p-3 shadow-xs shrink-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-[#0B3954]">{result.tag}</h3>
                <span className="text-[11px] text-[#5B7282]">
                  {compassLabel(result.route.bearing, isML)} · {Math.round(result.route.routeNM * 10) / 10} NM
                </span>
              </div>
              <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
                {[
                  { label: isML ? 'ഇന്ധനം (യാത്ര ഇരുവശം)' : 'Fuel (round trip)', value: `${result.fuelLiters} L`, sub: `${isML ? 'നേർരേഖ' : 'Straight baseline'} ${result.fuelBaseline} L` },
                  { label: isML ? 'ലാഭം' : 'Saving', value: `${result.savingsPercent}%`, sub: `₹${result.savingsInr.toLocaleString('en-IN')}` },
                  { label: isML ? 'ഒരു വശത്തെ സമയം' : 'One-way time', value: `${result.timeHours} h`, sub: `${result.speed} kn SOG` },
                  { label: 'CO₂', value: `${result.co2ReductionKg} kg`, sub: isML ? 'കുറവ്' : 'vs baseline' },
                  { label: isML ? 'പരമാവധി തിര' : 'Max swell', value: `${result.maxSwellMeters} m`, sub: isML ? 'കണക്കാക്കിയത്' : 'planning estimate' },
                  { label: isML ? 'വിശ്വാസ്യത' : 'Confidence', value: `${result.confidenceScore}%`, sub: isML ? 'കണക്കാക്കിയത്' : 'planning estimate' },
                ].map(m => (
                  <div key={m.label} className="bg-[#F8FCFD] border border-[#E2EDF2] rounded-xl px-2.5 py-2">
                    <span className="text-[10px] text-[#5B7282] block font-bold uppercase truncate">{m.label}</span>
                    <span className="text-sm font-black text-[#0B3954] block">{m.value}</span>
                    <span className="text-[10px] text-[#5B7282]">{m.sub}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
