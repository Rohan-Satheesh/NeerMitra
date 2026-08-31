import React, { useState, useEffect } from 'react';
import MarineMap from '../components/map/MarineMap';
import { 
  ShieldCheck, 
  MapPin, 
  Compass, 
  Navigation, 
  Mic, 
  Volume2, 
  AlertTriangle, 
  PhoneCall, 
  Fish, 
  Waves, 
  Wind, 
  Thermometer, 
  CloudSun, 
  Sparkles,
  ArrowRight,
  Radio,
  Wifi,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ProvenanceModal from '@/components/hud/ProvenanceModal';

import { fetchLiveMarineData, getCachedMarineData, type LiveMarineData } from '@/services/liveMarineService';

const pfzFishermanList = [
  {
    id: 'PFZ-01',
    name: 'Sector K-04 (Off Kochi Coast)',
    distance: '14.2 km (7.7 NM)',
    direction: 'WEST-SOUTHWEST (245°)',
    species: 'Indian Mackerel, Sardine & Tuna',
    sst: '28.4°C (Thermal Boundary)',
    depth: '42 meters',
    fuelEstimate: '18 Liters Diesel',
    confidence: '92% HIGH YIELD',
    highlight: true
  },
  {
    id: 'PFZ-02',
    name: 'Sector M-02 (Off Munambam)',
    distance: '26.8 km (14.5 NM)',
    direction: 'NORTH-WEST (315°)',
    species: 'Ribbon Fish & Squid Schools',
    sst: '28.1°C',
    depth: '58 meters',
    fuelEstimate: '32 Liters Diesel',
    confidence: '84% MEDIUM YIELD',
    highlight: false
  },
  {
    id: 'PFZ-03',
    name: 'Sector A-09 (Alappuzha Shoals)',
    distance: '38.5 km (20.8 NM)',
    direction: 'SOUTH (180°)',
    species: 'Anchovy & Trevally Aggregation',
    sst: '28.7°C',
    depth: '35 meters',
    fuelEstimate: '44 Liters Diesel',
    confidence: '78% MODERATE',
    highlight: false
  }
];

export default function FishermanMode() {
  const [isListening, setIsListening] = useState(false);
  const [voiceQueryText, setVoiceQueryText] = useState('');
  const [voiceResponse, setVoiceResponse] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<'EN' | 'ML' | 'TA' | 'HI'>('EN');
  const [whyModalOpen, setWhyModalOpen] = useState(false);
  const [selectedPFZ, setSelectedPFZ] = useState(pfzFishermanList[0]);
  const [marineData, setMarineData] = useState<LiveMarineData>(getCachedMarineData());

  useEffect(() => {
    fetchLiveMarineData().then(setMarineData);
  }, []);

  const voicePrompts = {
    EN: [
      "Where is the nearest safe fishing zone?",
      "Is it safe to cross the 15 nautical mile line today?",
      "What is the wave height forecast for the next 6 hours?"
    ],
    ML: [
      "ഏറ്റവും അടുത്തുള്ള മീൻപിടുത്ത മേഖല എവിടെയാണ്? (Nearest PFZ)",
      "ഇന്ന് കടലിൽ പോകുന്നത് സുരക്ഷിതമാണോ? (Is sea safe?)",
      "അടുത്ത 6 മണിക്കൂറിലെ തിരമാല എത്രയാണ്? (Wave forecast)"
    ],
    TA: [
      "அருகிலுள்ள மீன்பிடி மண்டலம் எங்கே உள்ளது? (Nearest PFZ)",
      "இன்று கடலுக்கு செல்வது பாதுகாப்பானதா? (Is sea safe?)",
      "அடுத்த 6 மணிநேர அலை உயரம் என்ன? (Wave forecast)"
    ],
    HI: [
      "सबसे निकटतम मछली पकड़ने का क्षेत्र कहाँ है? (Nearest PFZ)",
      "क्या आज समुद्र में जाना सुरक्षित है? (Is sea safe?)",
      "अगले 6 घंटे में लहरों की ऊंचाई क्या होगी? (Wave forecast)"
    ]
  };

  const handleSimulateVoice = (promptText: string) => {
    setVoiceQueryText(promptText);
    setIsListening(true);
    setVoiceResponse(null);

    setTimeout(() => {
      setIsListening(false);
      setVoiceResponse(`PFZ Sector K-04 is 14.2 km West-Southwest. Live wave height is ${marineData.waveHeight}m (${marineData.riskLevel === 'LOW' ? 'Safe' : 'Moderate'}). Wind speed: ${marineData.windSpeed} km/h. Tuna and mackerel schools active at 42m depth.`);
    }, 1200);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full overflow-hidden relative font-sans select-none bg-[#070D18]">
      
      {/* Left Column: Tactile Fisherman Controls & PFZ Cards */}
      <div className="w-full lg:w-[440px] bg-[#091120] border-r border-slate-800 flex flex-col h-full overflow-y-auto z-10 flex-shrink-0 p-4 space-y-3.5 shadow-2xl scrollbar-thin">
        
        {/* Top Banner & Language Switcher */}
        <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <Fish className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xs font-bold text-white uppercase tracking-wide">
                Fisherman Mode
              </h1>
              <span className="text-[10px] text-emerald-400 font-medium flex items-center space-x-1">
                <Wifi className="w-3 h-3" />
                <span>{marineData.isLive ? 'Live Satellite Sync' : 'Offline Cached Data'}</span>
              </span>
            </div>
          </div>

          {/* Language Switch */}
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {(['EN', 'ML', 'TA', 'HI'] as const).map(lang => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={cn(
                  "px-2 py-0.5 text-[10px] font-bold rounded transition-all cursor-pointer",
                  selectedLanguage === lang 
                    ? "bg-cyan-500 text-slate-950 shadow-sm" 
                    : "text-slate-400 hover:text-white"
                )}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Big High-Contrast Safety Risk Gauge */}
        <div className={cn(
          "border rounded-xl p-3.5 shadow-sm flex items-center justify-between transition-colors",
          marineData.riskLevel === 'LOW' 
            ? "bg-emerald-500/10 border-emerald-500/30" 
            : marineData.riskLevel === 'MEDIUM' 
              ? "bg-amber-500/10 border-amber-500/30" 
              : "bg-rose-500/10 border-rose-500/30"
        )}>
          <div className="flex items-center space-x-3">
            <div className={cn(
              "w-11 h-11 rounded-xl text-slate-950 flex flex-col items-center justify-center font-bold shadow-sm flex-shrink-0",
              marineData.riskLevel === 'LOW' ? "bg-emerald-500" : marineData.riskLevel === 'MEDIUM' ? "bg-amber-500" : "bg-rose-500 text-white"
            )}>
              <span className="text-base leading-none font-mono">{marineData.riskScore}</span>
              <span className="text-[8px] uppercase">/ 100</span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className={cn(
                  "w-4 h-4",
                  marineData.riskLevel === 'LOW' ? "text-emerald-400" : marineData.riskLevel === 'MEDIUM' ? "text-amber-400" : "text-rose-400"
                )} />
                <span className="text-xs font-bold text-white uppercase tracking-wide">
                  {marineData.riskLevel} RISK • {marineData.riskLevel === 'LOW' ? 'SAFE TO SAIL' : 'EXERCISE CAUTION'}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5 truncate">
                {marineData.statusSummary}
              </p>
            </div>
          </div>

          <div className="text-right text-xs flex-shrink-0 pl-2">
            <span className="text-slate-400 text-[10px] uppercase block">Wave Height</span>
            <span className="text-sm font-bold text-cyan-400 font-mono">{marineData.waveHeight}m</span>
          </div>
        </div>


        {/* 3 Tactile Action Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <button 
            onClick={() => handleSimulateVoice(voicePrompts[selectedLanguage][0])}
            className="p-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex flex-col items-center justify-center space-y-1 shadow-sm transition-all cursor-pointer"
          >
            <Fish className="w-4 h-4" />
            <span className="text-[11px]">Find Fish</span>
          </button>

          <button 
            onClick={() => handleSimulateVoice(voicePrompts[selectedLanguage][1])}
            className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 font-bold text-xs flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer"
          >
            <Mic className="w-4 h-4 text-cyan-400" />
            <span className="text-[11px] text-white">Ask AI 🎙</span>
          </button>

          <a 
            href="tel:112"
            className="p-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex flex-col items-center justify-center space-y-1 shadow-sm transition-all cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span className="text-[11px]">SOS 112</span>
          </a>
        </div>

        {/* Voice Assistant Simulation Box */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2.5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <div className="flex items-center space-x-1.5">
              <Mic className="w-3.5 h-3.5 text-cyan-400" />
              <h2 className="text-[11px] font-bold text-white uppercase tracking-wider">
                Voice Assistant ({selectedLanguage})
              </h2>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Tap prompt to speak</span>
          </div>

          <div className="space-y-1.5">
            {voicePrompts[selectedLanguage].map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSimulateVoice(prompt)}
                className="w-full text-left text-xs bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 p-2 rounded-lg text-slate-200 transition-colors cursor-pointer"
              >
                "{prompt}"
              </button>
            ))}
          </div>

          {isListening && (
            <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-400 text-cyan-300 text-xs flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span>Analyzing ocean conditions & PFZ coordinates...</span>
            </div>
          )}

          {voiceResponse && (
            <div className="p-3 rounded-lg bg-slate-950 border border-emerald-500/40 text-emerald-300 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white text-[11px]">NeerMitra Voice Response:</span>
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="text-slate-200 text-xs leading-relaxed">
                "{voiceResponse}"
              </p>
            </div>
          )}
        </div>

        {/* High Yield Potential Fishing Zones List */}
        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <div className="flex items-center space-x-1.5">
              <Fish className="w-3.5 h-3.5 text-cyan-400" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Today's PFZ Zones (INCOIS)
              </h2>
            </div>
            <span className="text-[10px] text-cyan-400 font-mono">06:00 UTC Pass</span>
          </div>

          <div className="space-y-2">
            {pfzFishermanList.map(pfz => (
              <div 
                key={pfz.id}
                onClick={() => setSelectedPFZ(pfz)}
                className={cn(
                  "p-3 rounded-xl border transition-all shadow-sm cursor-pointer",
                  selectedPFZ.id === pfz.id 
                    ? "bg-cyan-500/10 border-cyan-500/50 shadow-sm" 
                    : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
                )}
              >
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5 mb-2">
                  <span className="font-semibold text-xs text-white">{pfz.name}</span>
                  <span className="text-[10px] font-bold text-emerald-400 px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/30">
                    {pfz.confidence}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-xs mb-2.5 text-slate-300">
                  <div>Dist: <span className="font-semibold text-white font-mono">{pfz.distance}</span></div>
                  <div>Bearing: <span className="font-semibold text-cyan-400 font-mono">{pfz.direction.split(' ')[0]}</span></div>
                  <div>Species: <span className="font-medium text-slate-200">{pfz.species.split(',')[0]}</span></div>
                  <div>Fuel Est: <span className="font-semibold text-amber-300 font-mono">{pfz.fuelEstimate}</span></div>
                </div>

                <div className="flex items-center space-x-2">
                  <button className="flex-1 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center space-x-1 cursor-pointer">
                    <Navigation className="w-3 h-3" />
                    <span>Navigate</span>
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setWhyModalOpen(true);
                    }}
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-semibold text-xs rounded-lg transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <HelpCircle className="w-3 h-3" />
                    <span>Why?</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Full-Screen Live Marine Map */}
      <div className="flex-1 relative h-full">
        <MarineMap showVessels={false} showGeofence={true} showPFZ={true} showSST={true} />
        
        {/* Floating Top GPS Compass HUD */}
        <div className="absolute top-3.5 left-3.5 z-10 bg-[#091120]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800 text-xs shadow-md hidden sm:flex items-center space-x-2">
          <span className="text-slate-400">Target Destination:</span>
          <span className="font-semibold text-cyan-400">{selectedPFZ.name} ({selectedPFZ.direction.split(' ')[0]})</span>
        </div>
      </div>

      {/* Explainability Provenance Modal */}
      <ProvenanceModal
        isOpen={whyModalOpen}
        onClose={() => setWhyModalOpen(false)}
        title="PFZ Prediction Provenance"
        recommendation={selectedPFZ.name}
      />
    </div>
  );
}


