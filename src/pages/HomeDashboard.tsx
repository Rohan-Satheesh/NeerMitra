import React, { useState, useEffect } from 'react';
import {
  Clock,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  fetchLiveMarineData,
  getCachedMarineData,
  type LiveMarineData
} from '@/services/liveMarineService';
import { AdvisoryChat } from '@/components/chat/AdvisoryChat';

export default function HomeDashboard() {
  const { language } = useLanguage();

  const [data, setData] = useState<LiveMarineData>(getCachedMarineData());
  const [loading, setLoading] = useState(false);
  const [chatActive, setChatActive] = useState(false);

  const loadData = async (force: boolean = false) => {
    setLoading(true);
    try {
      const res = await fetchLiveMarineData(data.latitude, data.longitude, data.locationName, force);
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Listen for coordinate changes from topbar or map
    const handleSectorChange = (e: any) => {
      const { lat, lng, name } = e.detail || {};
      if (lat && lng) {
        fetchLiveMarineData(lat, lng, name, true).then(setData);
      }
    };

    window.addEventListener('marine:sector-change', handleSectorChange);
    return () => window.removeEventListener('marine:sector-change', handleSectorChange);
  }, []);

  // Today's greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (language === 'ML') {
      if (hour < 12) return 'സുപ്രഭാതം!';
      if (hour < 17) return 'ശുഭദിനം!';
      return 'ശുഭസായാഹ്നം!';
    }
    if (hour < 12) return 'Good Morning!';
    if (hour < 17) return 'Good Afternoon!';
    return 'Good Evening!';
  };

  const formattedDate = new Date().toLocaleDateString(language === 'ML' ? 'ml-IN' : 'en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="max-w-4xl mx-auto px-3.5 sm:px-6 pt-4 space-y-4">

      {/* 1. Hero Friendly Greeting Banner — collapses once the chat is in use, scrolls away naturally with the page */}
      <section
        className={cn(
          "marine-card border-[#C4D9E2] dark:border-[#2f4a6e] transition-[padding] duration-500 ease-in-out",
          chatActive ? "p-2.5 sm:p-3" : "p-4 sm:p-5"
        )}
      >
        <div className="flex flex-row items-center justify-between gap-3">
          <div className="min-w-0">
            <div
              className={cn(
                "flex items-center space-x-2 text-[#176B87] dark:text-[#8cc1e9] font-bold transition-all duration-500 overflow-hidden",
                chatActive ? "max-h-0 opacity-0" : "max-h-6 opacity-100 text-xs mb-0"
              )}
            >
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{formattedDate}</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:flex items-center gap-1 truncate">
                <MapPin className="w-3 h-3 text-[#176B87] dark:text-[#8cc1e9] shrink-0" />
                {data.locationName}
              </span>
            </div>
            <h1
              className={cn(
                "font-black text-[#0B3954] dark:text-[#e8f2fb] tracking-tight transition-all duration-500 truncate",
                chatActive ? "text-sm sm:text-base mt-0" : "text-xl sm:text-2xl mt-0.5"
              )}
            >
              {getGreeting()} {language === 'ML' ? 'സുഹൃത്തേ' : 'Friend'}
            </h1>
            <p
              className={cn(
                "text-sm text-[#5B7282] dark:text-[#e8f2fb]/70 transition-all duration-500 overflow-hidden",
                chatActive ? "max-h-0 opacity-0 mt-0" : "max-h-10 opacity-100 mt-0.5"
              )}
            >
              {language === 'ML'
                ? 'ഇന്നത്തെ കടൽ, കാലാവസ്ഥ, മീൻപിടുത്ത സാധ്യതകൾ ഒറ്റനോട്ടത്തിൽ'
                : "Today's marine weather, sea conditions, and fishing zones at a glance"}
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={() => loadData(true)}
              disabled={loading}
              className={cn(
                "rounded-xl border border-[#D8E5EB] bg-white hover:bg-[#F4F9FB] text-[#176B87] dark:bg-[#0d1420] dark:hover:bg-[#16233b] dark:border-[#2f4a6e] dark:text-[#8cc1e9] transition-all duration-500 cursor-pointer shadow-xs",
                chatActive ? "p-2" : "p-3"
              )}
              title="Refresh Live Data"
            >
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            </button>
          </div>
        </div>
      </section>

      {/* 2. Advisory Chat — expands with the conversation; reports activity so the banner above can collapse */}
      <AdvisoryChat onActivityChange={setChatActive} />

    </div>
  );
}
