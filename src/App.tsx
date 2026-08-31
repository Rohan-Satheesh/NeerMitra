import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppShell from './components/layout/AppShell';

// Lazy loading pages for better performance (can just use normal imports for now)
import Landing from './pages/Landing';
import CommandCenter from './pages/CommandCenter';
import LiveOcean from './pages/LiveOcean';
import FishermanMode from './pages/FishermanMode';
import FleetOptimizer from './pages/FleetOptimizer';
import AgentNetwork from './pages/AgentNetwork';
import Alerts from './pages/Alerts';
import Analytics from './pages/Analytics';
import DataSources from './pages/DataSources';
import Architecture from './pages/Architecture';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        
        {/* App routes wrapped in shell */}
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<CommandCenter />} />
          <Route path="/ocean" element={<LiveOcean />} />
          <Route path="/fisherman" element={<FishermanMode />} />
          <Route path="/fleet" element={<FleetOptimizer />} />
          <Route path="/agents" element={<AgentNetwork />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/data-sources" element={<DataSources />} />
          <Route path="/architecture" element={<Architecture />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
