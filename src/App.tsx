import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';

import HomeDashboard from './pages/HomeDashboard';
import WeatherSeaView from './pages/WeatherSeaView';
import FishermanMode from './pages/FishermanMode';
import { SafetyView } from './pages/SafetyView';
import FleetOptimizer from './pages/FleetOptimizer';
import DataSources from './pages/DataSources';
import CommandCenter from './pages/CommandCenter';
import Landing from './pages/Landing';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Operational Marine App routes wrapped in sunlight-readable AppShell */}
        <Route element={<AppShell />}>
          <Route path="/" element={<HomeDashboard />} />
          <Route path="/weather" element={<WeatherSeaView />} />
          {/* Sea State was merged into Weather — keep old links working */}
          <Route path="/sea" element={<Navigate to="/weather" replace />} />
          <Route path="/zones" element={<FishermanMode />} />
          <Route path="/fisherman" element={<FishermanMode />} />
          {/* Advisory Q&A was merged into Home — keep old links working */}
          <Route path="/assistant" element={<Navigate to="/" replace />} />
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          <Route path="/safety" element={<SafetyView />} />
          <Route path="/fleet" element={<FleetOptimizer />} />
          <Route path="/data-sources" element={<DataSources />} />
          <Route path="/command-center" element={<CommandCenter />} />
        </Route>

        {/* Technical Showcase Presentation */}
        <Route path="/landing" element={<Landing />} />

        {/* Catch-all redirect to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
