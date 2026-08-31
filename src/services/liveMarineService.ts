/**
 * Live Marine Telemetry Service for NeerMitra
 * Integrates real-time oceanographic & meteorological data from Open-Meteo Marine APIs
 * Covering Indian EEZ & Arabian Sea sectors (Kochi, Goa, Mumbai, Chennai)
 */

export interface LiveMarineData {
  locationName: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  sst: number; // Sea Surface Temp °C
  sstAnomaly: number;
  waveHeight: number; // Significant wave height in meters
  swellHeight: number; // Swell height in meters
  wavePeriod: number; // Wave period in seconds
  waveDirection: number; // Wave direction in degrees
  windSpeed: number; // Wind speed in km/h
  windDirection: number; // Wind direction in degrees
  windGusts: number; // Wind gusts in km/h
  riskScore: number; // 0-100 calculated safety index
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  statusSummary: string;
  isLive: boolean;
}

// Fallback baseline for Indian EEZ (Kochi Sector K-04)
const fallbackMarineData: LiveMarineData = {
  locationName: 'Arabian Sea (Off Kochi Sector K-04)',
  latitude: 9.9312,
  longitude: 75.8234,
  timestamp: new Date().toISOString(),
  sst: 28.4,
  sstAnomaly: 0.4,
  waveHeight: 1.4,
  swellHeight: 1.1,
  wavePeriod: 9.2,
  waveDirection: 250,
  windSpeed: 16.2,
  windDirection: 310,
  windGusts: 22.5,
  riskScore: 22,
  riskLevel: 'LOW',
  statusSummary: 'Optimal operational window with low sea swell',
  isLive: false
};

let cachedMarineData: LiveMarineData = { ...fallbackMarineData };
let lastFetchTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 1 minute cache

export async function fetchLiveMarineData(lat: number = 9.9312, lng: number = 75.8234): Promise<LiveMarineData> {
  const now = Date.now();
  if (now - lastFetchTime < CACHE_TTL_MS && cachedMarineData.isLive) {
    return cachedMarineData;
  }

  try {
    // 1. Fetch Real-time Marine Data (waves, swell)
    const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lng}&current=wave_height,wave_direction,wave_period,swell_wave_height,wind_wave_height`;
    // 2. Fetch Real-time Weather Data (wind, gusts, surface conditions)
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m,relative_humidity_2m`;

    const [marineRes, weatherRes] = await Promise.allSettled([
      fetch(marineUrl).then(r => r.json()),
      fetch(weatherUrl).then(r => r.json())
    ]);

    let waveHeight = fallbackMarineData.waveHeight;
    let swellHeight = fallbackMarineData.swellHeight;
    let wavePeriod = fallbackMarineData.wavePeriod;
    let waveDirection = fallbackMarineData.waveDirection;
    let windSpeed = fallbackMarineData.windSpeed;
    let windDirection = fallbackMarineData.windDirection;
    let windGusts = fallbackMarineData.windGusts;
    let sst = fallbackMarineData.sst;

    if (marineRes.status === 'fulfilled' && marineRes.value?.current) {
      const m = marineRes.value.current;
      if (typeof m.wave_height === 'number') waveHeight = Number(m.wave_height.toFixed(1));
      if (typeof m.swell_wave_height === 'number') swellHeight = Number(m.swell_wave_height.toFixed(1));
      if (typeof m.wave_period === 'number') wavePeriod = Number(m.wave_period.toFixed(1));
      if (typeof m.wave_direction === 'number') waveDirection = Math.round(m.wave_direction);
    }

    if (weatherRes.status === 'fulfilled' && weatherRes.value?.current) {
      const w = weatherRes.value.current;
      if (typeof w.wind_speed_10m === 'number') windSpeed = Number(w.wind_speed_10m.toFixed(1));
      if (typeof w.wind_direction_10m === 'number') windDirection = Math.round(w.wind_direction_10m);
      if (typeof w.wind_gusts_10m === 'number') windGusts = Number(w.wind_gusts_10m.toFixed(1));
      if (typeof w.temperature_2m === 'number') sst = Number((w.temperature_2m + 1.2).toFixed(1)); // Derived SST baseline
    }

    // Calculate real-time dynamic Maritime Risk Index (0 - 100)
    // Factors: Wave height (>2.0m is risky), Wind speed (>35 km/h is risky), Gusts
    let riskScore = 15;
    riskScore += Math.min(45, (waveHeight / 3.0) * 45);
    riskScore += Math.min(30, (windSpeed / 50.0) * 30);
    riskScore += Math.min(15, (windGusts / 60.0) * 15);
    riskScore = Math.round(Math.min(100, Math.max(5, riskScore)));

    let riskLevel: LiveMarineData['riskLevel'] = 'LOW';
    let statusSummary = 'Safe sea state inside Indian EEZ';
    if (riskScore >= 75 || waveHeight >= 3.0 || windSpeed >= 50) {
      riskLevel = 'CRITICAL';
      statusSummary = 'GALE / ROUGH SEAS — Coastal craft advisory in effect';
    } else if (riskScore >= 50 || waveHeight >= 2.2 || windSpeed >= 35) {
      riskLevel = 'HIGH';
      statusSummary = 'Elevated monsoonal swell — Exercise caution past 15 NM';
    } else if (riskScore >= 30 || waveHeight >= 1.7) {
      riskLevel = 'MEDIUM';
      statusSummary = 'Moderate chop — Standard navigation protocols';
    }

    cachedMarineData = {
      locationName: 'Arabian Sea (Sector 4 / Kochi Coastal)',
      latitude: lat,
      longitude: lng,
      timestamp: new Date().toISOString(),
      sst,
      sstAnomaly: Number((sst - 28.0).toFixed(1)),
      waveHeight,
      swellHeight,
      wavePeriod,
      waveDirection,
      windSpeed,
      windDirection,
      windGusts,
      riskScore,
      riskLevel,
      statusSummary,
      isLive: true
    };

    lastFetchTime = now;
    return cachedMarineData;
  } catch (err) {
    console.warn('Using cached/fallback marine data due to network error:', err);
    return cachedMarineData;
  }
}

export function getCachedMarineData(): LiveMarineData {
  return cachedMarineData;
}
