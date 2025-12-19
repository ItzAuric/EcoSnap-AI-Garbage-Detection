export enum WasteCategory {
  Recyclable = 'Recyclable',
  NonRecyclable = 'Non-Recyclable',
  Wet = 'Wet',
  Dry = 'Dry',
  Hazardous = 'Hazardous',
}

export interface WasteItem {
  id: string;
  name: string;
  category: WasteCategory;
  description: string;
  disposalTip: string;
}

export interface UserStats {
  points: number;
  streak: number;
  level: string;
  co2Saved: number; // in kg
  itemsRecycled: number;
}

export interface ScanResult {
  wasteType: string;
  category: WasteCategory;
  confidence: number;
  disposalTip: string;
  isHazardous: boolean;
}

export interface User {
  name: string;
  email: string;
  id: string;
}

export type Tab = 'home' | 'library' | 'scan' | 'analytics' | 'profile' | 'tracker';