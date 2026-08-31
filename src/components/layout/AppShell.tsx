import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import CommandPalette from '@/components/hud/CommandPalette';

export default function AppShell() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleTriggerScan = () => {
    setIsScanning(true);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#050B14] relative text-slate-100">
      {/* Living Ocean Grid Background */}
      <div className="absolute inset-0 bg-ocean-grid opacity-30 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-bathymetric pointer-events-none z-0" />

      {/* Operations Sidebar Rail */}
      <Sidebar />

      {/* Main Operations Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative z-10">
        <TopBar 
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onTriggerScan={handleTriggerScan}
          isScanning={isScanning}
        />
        
        <main className="flex-1 overflow-auto relative bg-[#050B14]/70">
          <Outlet context={{ isScanning, setIsScanning }} />
        </main>
      </div>

      {/* Global Command Palette */}
      <CommandPalette 
        isOpen={commandPaletteOpen} 
        onClose={() => setCommandPaletteOpen(false)} 
      />
    </div>
  );
}

