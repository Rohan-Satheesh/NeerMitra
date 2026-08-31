export interface Vessel {
  id: string;
  name: string;
  type: 'Container' | 'Bulk Carrier' | 'Tanker' | 'Fishing';
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  status: 'Underway' | 'Moored' | 'Fishing';
  risk: 'Low' | 'Medium' | 'High';
}

export interface PFZ {
  id: string;
  lat: number;
  lng: number;
  probability: number;
  sst: number;
  chlorophyll: string;
}

export const mockVessels: Vessel[] = [
  { id: 'V001', name: 'Sagar Kanya', type: 'Container', lat: 15.3, lng: 70.2, speed: 18.5, heading: 145, status: 'Underway', risk: 'Low' },
  { id: 'V002', name: 'Jal Doot', type: 'Tanker', lat: 12.8, lng: 73.5, speed: 14.2, heading: 90, status: 'Underway', risk: 'Medium' },
  { id: 'V003', name: 'Matsya 1', type: 'Fishing', lat: 9.5, lng: 75.8, speed: 4.5, heading: 210, status: 'Fishing', risk: 'High' },
  { id: 'V004', name: 'Oceanic Blue', type: 'Bulk Carrier', lat: 19.0, lng: 69.5, speed: 12.1, heading: 180, status: 'Underway', risk: 'Low' },
  { id: 'V005', name: 'Coastal Voyager', type: 'Container', lat: 8.1, lng: 77.2, speed: 21.0, heading: 110, status: 'Underway', risk: 'Low' },
  { id: 'V006', name: 'Matsya 2', type: 'Fishing', lat: 10.2, lng: 76.1, speed: 0, heading: 45, status: 'Moored', risk: 'Low' },
];

export const mockPFZs: PFZ[] = [
  { id: 'P001', lat: 9.8, lng: 75.2, probability: 87, sst: 28.4, chlorophyll: 'High' },
  { id: 'P002', lat: 11.5, lng: 74.1, probability: 92, sst: 27.9, chlorophyll: 'Very High' },
  { id: 'P003', lat: 14.2, lng: 72.8, probability: 76, sst: 29.1, chlorophyll: 'Medium' },
];

export const mockGeofence = [
  [10.0, 75.0],
  [12.0, 73.0],
  [15.0, 71.0],
  [15.5, 72.5],
  [12.5, 74.5],
  [10.5, 76.0]
];
