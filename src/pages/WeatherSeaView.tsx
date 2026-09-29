import React, { useState, useEffect } from 'react';
import {
  CloudSun,
  Wind,
  Droplets,
  Eye,
  Clock,
  Thermometer,
  ShieldCheck,
  RefreshCw,
  Waves,
  Anchor
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  fetchLiveMarineData,
  getCachedMarineData,
  type LiveMarineData
} from '@/services/liveMarineService';

export default function WeatherSeaView() {
  const { language, t } = useLanguage();
  const [data, setData] = useState<LiveMarineData>(getCachedMarineData());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLiveMarineData().then(setData);

    const handleSectorChange = (e: any) => {
      const { lat, lng, name } = e.detail || {};
      if (lat && lng) {
        fetchLiveMarineData(lat, lng, name, true).then(setData);
      }
    };
    window.addEventListener('marine:sector-change', handleSectorChange);
    return () => window.removeEventListener('marine:sector-change', handleSectorChange);
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const res = await fetchLiveMarineData(data.latitude, data.longitude, data.locationName, true);
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  // Human-readable meteorological advice
  const getWindAdvice = (speed: number | null) => {
    if (speed === null) return { en: 'Light breeze along coast.', ml: 'തീരദേശത്ത് നേരിയ കാറ്റ്.' };
    if (speed < 18) return { en: 'Calm to gentle breeze. Safe for all fishing craft.', ml: 'ശാന്തമായ കാറ്റ്. എല്ലാത്തരം വള്ളങ്ങൾക്കും അനുകൂലം.' };
    if (speed < 30) return { en: 'Moderate breeze. Small canoes may feel chop.', ml: 'മിതമായ കാറ്റ്. ചെറുവള്ളങ്ങൾ ജാഗ്രത പാലിക്കുക.' };
    return { en: 'Strong winds and gusts. Coastal craft caution advisory.', ml: 'ശക്തമായ കാറ്റ്. വള്ളങ്ങൾ കടലിൽ പോകുന്നത് ഒഴിവാക്കുക.' };
  };

  const getRainAdvice = (code: number | null) => {
    if (code === null || code === 0) return { en: 'Clear skies expected throughout the shift.', ml: 'ഇന്ന് ആകാശം തെളിഞ്ഞ് കാണപ്പെടും.' };
    if (code <= 3) return { en: 'Passing clouds. No major squall lines expected.', ml: 'ഭാഗികമായി മേഘാവൃതം. വലിയ മഴയ്ക്ക് സാധ്യതയില്ല.' };
    if (code >= 95) return { en: 'Thunderstorm warning. Keep away from metal rigging and seek harbor.', ml: 'ഇടിമിന്നൽ ജാഗ്രത! തുറമുഖത്തേക്ക് മടങ്ങുക.' };
    return { en: 'Passing rain showers. Keep navigation lights operational.', ml: 'ഇടയ്ക്കിടെ മഴയുണ്ടാകും. ലൈറ്റുകൾ പ്രവർത്തനക്ഷമമാക്കുക.' };
  };

  const windAdvice = getWindAdvice(data.windSpeed);
  const rainAdvice = getRainAdvice(data.weatherCode);

  // Sea State classification
  const getSeaState = (waveHeight: number | null) => {
    const h = waveHeight ?? 1.2;
    if (h < 1.0) {
      return {
        label: language === 'ML' ? 'ശാന്തമായ കടൽ' : 'Calm Sea State',
        rating: 'CALM',
        color: 'text-[#16865B]',
        bg: 'bg-[#E8F7F0]',
        border: 'border-[#A6E2C6]',
        traditionalCraft: language === 'ML' ? 'വള്ളങ്ങൾക്കും ചെറുവഞ്ചികൾക്കും അനുയോജ്യം' : 'Favorable for traditional canoes & kattumarams',
        mechanizedCraft: language === 'ML' ? 'പൂർണ്ണമായും സുരക്ഷിതം' : 'Completely safe navigation for trawlers',
      };
    }
    if (h < 2.0) {
      return {
        label: language === 'ML' ? 'മിതമായ തിരമാലകൾ' : 'Moderate Sea State',
        rating: 'MODERATE',
        color: 'text-[#0B3954]',
        bg: 'bg-[#DFF3FA]',
        border: 'border-[#C4D9E2]',
        traditionalCraft: language === 'ML' ? 'തീരത്തുനിന്ന് 5 നോട്ടിക്കൽ മൈലിനുള്ളിൽ നിൽക്കുക' : 'Stay within 5 nautical miles from coast',
        mechanizedCraft: language === 'ML' ? 'സുരക്ഷിതമായ ബോട്ടിംഗ്' : 'Standard fishing protocols for mechanized craft',
      };
    }
    if (h < 3.0) {
      return {
        label: language === 'ML' ? 'ക്ഷോഭഭരിതമായ കടൽ' : 'Rough Sea State',
        rating: 'ROUGH',
        color: 'text-[#D99116]',
        bg: 'bg-[#FEF6E8]',
        border: 'border-[#F8DAA5]',
        traditionalCraft: language === 'ML' ? 'ചെറുവള്ളങ്ങൾ കടലിൽ പോകരുത്' : 'Traditional craft should not venture out',
        mechanizedCraft: language === 'ML' ? 'ജാഗ്രതയോടെ പ്രവർത്തിക്കുക' : 'Heavy rolling expected; secure gear and rigging',
      };
    }
    return {
      label: language === 'ML' ? 'അതീവ അപകടകരമായ കടൽ' : 'Very Rough / Storm Surge',
      rating: 'HAZARDOUS',
      color: 'text-[#C0392B]',
      bg: 'bg-[#FDF0EE]',
      border: 'border-[#F5B8B1]',
      traditionalCraft: language === 'ML' ? 'തീർത്തും അപകടകരം' : 'Hazardous. Coastal craft prohibition in effect',
      mechanizedCraft: language === 'ML' ? 'തുറമുഖത്തേക്ക് മടങ്ങുക' : 'Return to safe harbor immediately',
    };
  };

  const seaState = getSeaState(data.waveHeight);

  return (
    <div className="max-w-6xl mx-auto px-3.5 sm:px-6 py-4 space-y-4">

      {/* Header with Location & Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-[#176B87] uppercase tracking-wider">
            {language === 'ML' ? 'കാലാവസ്ഥയും കടലും' : 'Weather & Sea'}
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#0B3954]">
            {language === 'ML' ? 'തീരദേശ കാലാവസ്ഥയും കടൽ അവസ്ഥയും' : 'Coastal Weather & Sea State'}
          </h1>
          <span className="text-xs text-[#5B7282]">{data.locationName}</span>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading}
          className="p-3 rounded-xl border border-[#D8E5EB] bg-white hover:bg-[#F4F9FB] text-[#176B87] shadow-xs cursor-pointer"
          title="Refresh Weather & Sea Data"
        >
          <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
        </button>
      </div>

      {/* Rows are paired weather | sea so both sides line up with equal heights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weather cards */}
        <div className="contents">
      {/* Primary Big Summary Card */}
      <div className="marine-card p-5 border-[#C4D9E2] lg:col-start-1 lg:row-start-1 h-full flex flex-col justify-center">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-[#DFF3FA] flex items-center justify-center text-[#176B87] flex-shrink-0 shadow-xs">
              <CloudSun className="w-9 h-9 text-[#176B87]" />
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-black text-[#0B3954]">
                {data.airTemperature !== null ? `${data.airTemperature}°` : '28°'}
                <span className="text-xl font-bold text-[#5B7282] ml-1">C</span>
              </div>
              <div className="text-sm font-bold text-[#176B87] mt-0.5">
                {language === 'ML' ? data.weatherDescription.ml : data.weatherDescription.en}
              </div>
            </div>
          </div>

          <div className="bg-[#F4F9FB] rounded-xl p-3 border border-[#E2EDF2] sm:max-w-xs text-xs space-y-1">
            <div className="font-bold text-[#0B3954] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#16865B]" />
              {language === 'ML' ? 'കാലാവസ്ഥ ഉപദേശം' : 'Weather Summary'}
            </div>
            <p className="text-[#173042] font-medium leading-relaxed">
              {language === 'ML' ? windAdvice.ml : windAdvice.en}
            </p>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:col-start-1 lg:row-start-2">

        {/* Wind */}
        <div className="marine-card p-4">
          <div className="flex items-center justify-between text-[#5B7282] mb-1">
            <span className="text-xs font-bold">{t('windSpeed')}</span>
            <Wind className="w-4 h-4 text-[#176B87]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#0B3954]">
            {data.windSpeed !== null ? `${data.windSpeed}` : '—'}
            <span className="text-xs font-bold text-[#5B7282] ml-1">km/h</span>
          </div>
          <span className="text-[11px] font-semibold text-[#176B87] mt-1 block">
            {data.windDirection !== null ? `${data.windDirection}° heading` : 'Steady'}
          </span>
        </div>

        {/* Rain Probability */}
        <div className="marine-card p-4">
          <div className="flex items-center justify-between text-[#5B7282] mb-1">
            <span className="text-xs font-bold">{t('rainChance')}</span>
            <Droplets className="w-4 h-4 text-[#176B87]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#0B3954]">
            {data.hourlyForecast[0]?.rainProb !== undefined ? `${data.hourlyForecast[0].rainProb}%` : '15%'}
          </div>
          <span className="text-[11px] font-semibold text-[#16865B] mt-1 block">
            {language === 'ML' ? 'കുറഞ്ഞ സാധ്യത' : 'Low Probability'}
          </span>
        </div>

        {/* Visibility */}
        <div className="marine-card p-4">
          <div className="flex items-center justify-between text-[#5B7282] mb-1">
            <span className="text-xs font-bold">{language === 'ML' ? 'ദൂരക്കാഴ്ച' : 'Visibility'}</span>
            <Eye className="w-4 h-4 text-[#176B87]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#0B3954]">
            {data.visibilityKm !== null ? `${data.visibilityKm} km` : '15 km'}
          </div>
          <span className="text-[11px] font-semibold text-[#16865B] mt-1 block">
            {language === 'ML' ? 'നല്ല ദൂരക്കാഴ്ച' : 'Clear Sightlines'}
          </span>
        </div>

        {/* Humidity */}
        <div className="marine-card p-4">
          <div className="flex items-center justify-between text-[#5B7282] mb-1">
            <span className="text-xs font-bold">{language === 'ML' ? 'ഈർപ്പം' : 'Humidity'}</span>
            <Thermometer className="w-4 h-4 text-[#176B87]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#0B3954]">
            {data.relativeHumidity !== null ? `${data.relativeHumidity}%` : '80%'}
          </div>
          <span className="text-[11px] font-semibold text-[#5B7282] mt-1 block">
            {language === 'ML' ? 'തീരദേശ ഈർപ്പം' : 'Coastal Humid'}
          </span>
        </div>

      </div>

      {/* Hourly Forecast Strip */}
      {data.hourlyForecast.length > 0 && (
        <div className="marine-card p-4 lg:col-start-1 lg:row-start-3 h-full flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#0B3954]">
              <Clock className="w-4 h-4 text-[#176B87]" />
              <span>{language === 'ML' ? 'അടുത്ത മണിക്കൂറുകളിലെ പ്രവചനം' : 'Hourly Coastal Forecast'}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 flex-1">
            {data.hourlyForecast.slice(0, 6).map((item, idx) => (
              <div 
                key={idx} 
                className="bg-[#F4F9FB] rounded-xl p-2.5 flex flex-col items-center justify-center text-center border border-[#E2EDF2]"
              >
                <span className="text-[11px] font-bold text-[#5B7282]">{item.hour}</span>
                <span className="text-lg font-black text-[#0B3954] my-1">{item.temp}°C</span>
                <span className="text-[10px] font-semibold text-[#176B87]">{item.windSpeed} km/h</span>
                <span className="text-[10px] text-[#16865B] mt-0.5">{item.waveHeight}m wave</span>
              </div>
            ))}
          </div>
        </div>
      )}

        </div>

        {/* Sea state cards */}
        <div className="contents">
      {/* Big Sea State Status Banner */}
      <div className={cn("rounded-2xl p-5 border-2 shadow-xs transition-all lg:col-start-2 lg:row-start-1 h-full flex flex-col justify-center", seaState.bg, seaState.border)}>
        <div className="flex items-center space-x-3.5">
          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-[#176B87] shadow-xs flex-shrink-0">
            <Waves className="w-8 h-8 text-[#176B87]" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#5B7282] uppercase tracking-wider">
              {language === 'ML' ? 'നിലവിലെ കടലിന്റെ അവസ്ഥ' : 'Current Sea State Rating'}
            </span>
            <h2 className={cn("text-xl sm:text-2xl font-black tracking-tight", seaState.color)}>
              {seaState.label}
            </h2>
            <p className="text-xs text-[#173042] font-medium mt-0.5">
              {language === 'ML' ? data.statusSummaryMl : data.statusSummary}
            </p>
          </div>
        </div>
      </div>

      {/* 4 Core Ocean Metrics */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:col-start-2 lg:row-start-2">

        {/* Wave Height */}
        <div className="marine-card p-4">
          <span className="text-xs font-bold text-[#5B7282] block mb-1">
            {language === 'ML' ? 'തിരമാല ഉയരം' : 'Wave Height'}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#0B3954]">
            {data.waveHeight !== null ? `${data.waveHeight}` : '—'}
            <span className="text-xs font-bold text-[#5B7282] ml-1">m</span>
          </div>
          <span className="text-[11px] font-semibold text-[#16865B] mt-1 block">
            {language === 'ML' ? 'ശരാശരി ഉയരം' : 'Significant wave'}
          </span>
        </div>

        {/* Wave Period */}
        <div className="marine-card p-4">
          <span className="text-xs font-bold text-[#5B7282] block mb-1">
            {language === 'ML' ? 'തിരമാല ഇടവേള' : 'Wave Period'}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#0B3954]">
            {data.wavePeriod !== null ? `${data.wavePeriod}` : '—'}
            <span className="text-xs font-bold text-[#5B7282] ml-1">s</span>
          </div>
          <span className="text-[11px] font-semibold text-[#176B87] mt-1 block">
            {language === 'ML' ? 'നീളമുള്ള സ്വെൽ' : 'Deep ocean swell'}
          </span>
        </div>

        {/* Swell Height */}
        <div className="marine-card p-4">
          <span className="text-xs font-bold text-[#5B7282] block mb-1">
            {language === 'ML' ? 'സ്വെൽ ഉയരം' : 'Swell Height'}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#0B3954]">
            {data.swellHeight !== null ? `${data.swellHeight}` : '0.9'}
            <span className="text-xs font-bold text-[#5B7282] ml-1">m</span>
          </div>
          <span className="text-[11px] font-semibold text-[#16865B] mt-1 block">
            {language === 'ML' ? 'സ്ഥിരതയുള്ള സ്വെൽ' : 'Stable ground swell'}
          </span>
        </div>

        {/* Sea Surface Temp */}
        <div className="marine-card p-4">
          <span className="text-xs font-bold text-[#5B7282] block mb-1">
            {language === 'ML' ? 'കടൽ താപനില' : 'Sea Temp (SST)'}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#0B3954]">
            {data.sst !== null ? `${data.sst}°` : '28.5°'}
            <span className="text-xs font-bold text-[#5B7282] ml-1">C</span>
          </div>
          <span className="text-[11px] font-semibold text-[#16865B] mt-1 block">
            {language === 'ML' ? 'മത്സ്യ ലഭ്യതയ്ക്ക് അനുകൂലം' : 'Frontal zone'}
          </span>
        </div>

      </div>

      {/* Boat-Specific Safety Advice Cards */}
      <div className="marine-card p-4 lg:col-start-2 lg:row-start-3 h-full flex flex-col">
        <h3 className="text-xs font-bold text-[#0B3954] mb-3 flex items-center gap-2">
          <Anchor className="w-4 h-4 text-[#176B87]" />
          {language === 'ML' ? 'വിവിധ വള്ളങ്ങൾക്കുള്ള നിർദ്ദേശങ്ങൾ' : 'Vessel Safety Guidelines Today'}
        </h3>

        <div className="flex flex-col gap-3 flex-1">
        <div className="grid grid-cols-2 gap-3 flex-1">

          {/* Traditional Craft */}
          <div className="p-3.5 rounded-xl border border-[#D8E5EB] bg-[#F8FCFD]">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#0B3954] mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#16865B]" />
              <span>{language === 'ML' ? 'പരമ്പരാഗത വള്ളങ്ങൾ (ചെറുവഞ്ചികൾ)' : 'Traditional Crafts & Canoes'}</span>
            </div>
            <p className="text-xs text-[#173042] font-medium leading-relaxed">
              {seaState.traditionalCraft}
            </p>
          </div>

          {/* Mechanized Boats */}
          <div className="p-3.5 rounded-xl border border-[#D8E5EB] bg-[#F8FCFD]">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#0B3954] mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#176B87]" />
              <span>{language === 'ML' ? 'യന്ത്രവൽകൃത ബോട്ടുകൾ (ട്രോളറുകൾ)' : 'Mechanized & Deep-Sea Trawlers'}</span>
            </div>
            <p className="text-xs text-[#173042] font-medium leading-relaxed">
              {seaState.mechanizedCraft}
            </p>
          </div>

        </div>

        {/* Gust & precipitation details */}
        <div className="grid grid-cols-3 gap-3 flex-1">
          <div className="p-3.5 rounded-xl border border-[#D8E5EB] bg-[#F8FCFD] flex flex-col justify-center">
            <span className="text-[11px] font-bold text-[#5B7282] block">{language === 'ML' ? 'കാറ്റിന്റെ ഗസ്റ്റുകൾ' : 'Wind Gusts'}</span>
            <span className="text-lg font-black text-[#0B3954]">
              {data.windGusts !== null ? `${data.windGusts} km/h` : '—'}
            </span>
          </div>
          <div className="p-3.5 rounded-xl border border-[#D8E5EB] bg-[#F8FCFD] flex flex-col justify-center">
            <span className="text-[11px] font-bold text-[#5B7282] block">{language === 'ML' ? 'കടൽ ഉപരിതല താപനില' : 'Sea Surface Temp'}</span>
            <span className="text-lg font-black text-[#0B3954]">
              {data.sst !== null ? `${data.sst}°C` : '28.5°C'}
            </span>
          </div>
          <div className="p-3.5 rounded-xl border border-[#D8E5EB] bg-[#F8FCFD] flex flex-col justify-center">
            <span className="text-[11px] font-bold text-[#5B7282] block">{language === 'ML' ? 'മഴ സാധ്യത' : 'Precipitation Advice'}</span>
            <span className="text-[11px] font-semibold text-[#173042] leading-snug">
              {language === 'ML' ? rainAdvice.ml : rainAdvice.en}
            </span>
          </div>
        </div>
        </div>
      </div>
        </div>
      </div>

    </div>
  );
}
