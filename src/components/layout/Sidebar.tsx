import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  CloudSun,
  Fish,
  ShieldAlert,
  Ship,
  Database,
  Radio,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Sidebar() {
  const { t } = useLanguage();

  const primaryItems = [
    { label: t('navHome') || 'Home', path: '/', icon: Home },
    { label: `${t('navWeather')} & ${t('navSea')}`, path: '/weather', icon: CloudSun },
    { label: t('navZones'), path: '/zones', icon: Fish },
    { label: 'Fleet Optimizer', path: '/fleet', icon: Ship },
    { label: t('navSafety'), path: '/safety', icon: ShieldAlert, alert: true },
  ];

  const secondaryItems = [
    { label: 'Data Sources', path: '/data-sources', icon: Database, subtitle: 'Satellite & Ocean Data Feeds' },
  ];

  return (
    <aside 
      aria-label="Desktop Sidebar Navigation"
      className="hidden md:flex flex-col w-64 border-r border-[#D8E5EB] bg-white h-full flex-shrink-0 z-20 select-none shadow-xs"
    >
      {/* Primary Navigation */}
      <div className="px-3 pt-4 pb-2">
        <span className="text-[11px] text-[#5B7282] font-bold uppercase tracking-wider px-3">
          Daily Operations
        </span>
      </div>

      <nav className="flex-1 flex flex-col overflow-y-auto px-3 space-y-1 scrollbar-thin">
        {primaryItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all min-h-[44px]",
                isActive
                  ? "bg-[#DFF3FA] text-[#0B3954] shadow-xs"
                  : "text-[#173042] hover:bg-[#F4F9FB] hover:text-[#0B3954]"
              )}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-[#176B87] rounded-r" />
                  )}
                  <div className="flex items-center space-x-3">
                    <Icon className={cn("w-4 h-4", isActive ? "text-[#176B87]" : item.alert ? "text-[#C0392B]" : "text-[#5B7282]")} />
                    <span className="text-sm font-semibold">{item.label}</span>
                  </div>
                  {item.alert && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#FDF0EE] text-[#C0392B] font-bold">
                      SOS
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}

      </nav>

      {/* Bottom cards: Data Sources + Coast Guard Quick Help (same card style) */}
      <div className="p-3 border-t border-[#E2EDF2] bg-[#F8FCFD] space-y-2">
        {secondaryItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center space-x-2.5 p-2.5 rounded-xl bg-white border transition-all group",
                isActive ? "border-[#176B87]" : "border-[#D8E5EB] hover:border-[#176B87]"
              )}
            >
              <div className="w-8 h-8 rounded-lg bg-[#DFF3FA] flex items-center justify-center text-[#176B87]">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#0B3954]">{item.label}</span>
                <span className="text-[10px] text-[#5B7282]">{item.subtitle}</span>
              </div>
            </NavLink>
          );
        })}
        <a
          href="tel:1554"
          className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-white border border-[#D8E5EB] hover:border-[#176B87] transition-all group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#FDF0EE] flex items-center justify-center text-[#C0392B]">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#0B3954]">Coast Guard 1554</span>
            <span className="text-[10px] text-[#5B7282]">Toll-Free Marine Search & Rescue</span>
          </div>
        </a>
      </div>
    </aside>
  );
}
