export type UserRole = 'USER' | 'COLLECTOR' | 'AUTHORITY';

export type WasteCategory =
  | 'IT Product'
  | 'Electronic Waste'
  | 'Transport'
  | 'Furniture'
  | 'Glass Product'
  | 'Biodegradable'
  | 'Others';

export type WasteTypeTag =
  | 'Dry Waste'
  | 'Wet Waste'
  | 'E-Waste / Hazardous'
  | 'Recyclable Bulk';

export type ItemStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';

export interface WasteAnalysisResult {
  category: WasteCategory;
  wasteTypeTag: string;
  itemName: string;
  materialBreakdown: string[];
  confidenceScore: number;
  estimatedWeightKg: number;
  recyclingGuidance: string;
  calculatedCredits: number;
  environmentalImpact: string;
}

export interface WasteListing {
  id: string;
  transactionId: string;
  userId: string;
  userName: string;
  userPhone: string;
  title: string;
  description: string;
  category: WasteCategory;
  wasteTypeTag: string;
  imageUrl: string;
  calculatedCredits: number;
  estimatedWeightKg: number;
  senderLocation: string;
  status: ItemStatus;
  createdAt: number;
  assignedDeliveryAgent?: string;
  estimatedPickupTime?: string;
  collectorId?: string;
  rejectionReason?: string;
}

export type FacilityType = 'Restroom' | 'Water Source' | 'Dustbin' | 'Hazard Point';
export type CrowdLevel = 'Low' | 'Moderate' | 'High';
export type CleanlinessState = 'Spotless' | 'Acceptable' | 'Needs Attention' | 'Critical';
export type ReportStatus = 'REPORTED' | 'IN_PROGRESS' | 'RESOLVED';

export interface GreenOfficerReport {
  id: string;
  officerName: string;
  locationName: string;
  city: string;
  lat: number;
  lng: number;
  facilityType: FacilityType;
  photoUrl?: string;
  rating: number; // 1 to 5
  crowdLevel: CrowdLevel;
  cleanlinessState: CleanlinessState;
  missingDustbins: boolean;
  notes: string;
  status: ReportStatus;
  timestamp: number;
  resolvedAt?: number;
}

export interface RewardCard {
  id: string;
  provider: 'Amazon' | 'Flipkart' | 'Google Play' | 'Starbucks Eco';
  title: string;
  creditsRequired: number;
  voucherCode: string;
  discountAmount: string;
  imageUrl: string;
  description: string;
}

export interface SensorMarker {
  id: string;
  code: string;
  name: string;
  type: 'Toilet' | 'Water' | 'Bin' | 'Sensor Pole';
  lat: number;
  lng: number;
  status: 'Connected' | 'Warning' | 'Disconnected';
  fillLevel?: number; // percentage
  cleanlinessScore: number; // 0-100
  crowdLevel: CrowdLevel;
  lastUpdated: string;
  alertsCount: number;
  details?: {
    airQuality?: string;
    temperature?: string;
    waterPurity?: string;
    batteryLevel?: string;
  };
}

export interface AuditLogEntry {
  id: string;
  action: string;
  target: string;
  city: string;
  performedBy: string;
  timestamp: string;
  status: 'Reported' | 'In Process' | 'Resolved' | 'Under Review';
}
