import { type Vessel, mockVessels } from './mockData';

type VesselListener = (vessels: Vessel[]) => void;

class LiveVesselService {
  private vessels: Vessel[] = [...mockVessels];
  private listeners: Set<VesselListener> = new Set();
  private intervalId: any = null;

  constructor() {
    this.startSimulation();
  }

  public getVessels(): Vessel[] {
    return this.vessels;
  }

  public subscribe(listener: VesselListener): () => void {
    this.listeners.add(listener);
    listener(this.vessels);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private startSimulation() {
    if (this.intervalId) return;

    // Advance vessels every 3 seconds
    this.intervalId = setInterval(() => {
      this.vessels = this.vessels.map(vessel => {
        if (vessel.status === 'Moored') return vessel;

        // Calculate delta based on speed and heading
        const speedKnots = vessel.speed || 10;
        const rad = (vessel.heading * Math.PI) / 180;
        
        // 1 knot ~ 0.0003 degrees per minute
        const delta = (speedKnots * 0.00008); 
        const dLat = Math.cos(rad) * delta;
        const dLng = Math.sin(rad) * delta;

        let newLat = vessel.lat + dLat;
        let newLng = vessel.lng + dLng;
        let newHeading = vessel.heading;

        // Boundary checks to keep vessels in the Arabian Sea & Indian EEZ
        if (newLat > 22.0 || newLat < 6.0) {
          newHeading = (newHeading + 180) % 360;
        }
        if (newLng > 78.0 || newLng < 66.0) {
          newHeading = (newHeading + 180) % 360;
        }

        // Slight speed fluctuations
        const speedNoise = (Math.random() - 0.5) * 0.4;
        const newSpeed = Number(Math.max(2.0, Math.min(24.0, vessel.speed + speedNoise)).toFixed(1));

        return {
          ...vessel,
          lat: Number(newLat.toFixed(4)),
          lng: Number(newLng.toFixed(4)),
          speed: newSpeed,
          heading: Math.round(newHeading)
        };
      });

      // Notify all subscribers
      this.listeners.forEach(listener => listener(this.vessels));
    }, 3000);
  }

  public stopSimulation() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export const liveVesselService = new LiveVesselService();
