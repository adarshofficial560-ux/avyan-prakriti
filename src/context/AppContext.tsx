'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  WasteListing,
  WasteCategory,
  GreenOfficerReport,
  RewardCard,
  SensorMarker,
  AuditLogEntry
} from '@/types';
import {
  INITIAL_LISTINGS,
  INITIAL_REWARDS,
  INITIAL_REPORTS,
  INITIAL_SENSORS,
  INITIAL_AUDIT_LOGS
} from '@/lib/mockData';

interface AppContextType {
  role: UserRole | null;
  setRole: (role: UserRole | null) => void;
  userCredits: number;
  setUserCredits: React.Dispatch<React.SetStateAction<number>>;
  collectorCredits: number;
  setCollectorCredits: React.Dispatch<React.SetStateAction<number>>;
  
  // Collector filters
  collectorSpecializations: WasteCategory[];
  setCollectorSpecializations: React.Dispatch<React.SetStateAction<WasteCategory[]>>;

  // Waste Listings
  listings: WasteListing[];
  addListing: (listing: Omit<WasteListing, 'id' | 'createdAt' | 'status'>) => void;
  acceptListing: (listingId: string, deliveryAgent: string, timeWindow: string) => void;
  rejectListing: (listingId: string, reason?: string) => void;

  // Green Officer Reports
  reports: GreenOfficerReport[];
  addReport: (report: Omit<GreenOfficerReport, 'id' | 'timestamp' | 'status'>) => void;
  resolveReport: (reportId: string) => void;

  // Rewards
  rewards: RewardCard[];
  redeemReward: (rewardId: string) => { success: boolean; message: string; voucher?: string };

  // Smart City Sensors & Coordinates (Authority)
  sensors: SensorMarker[];
  resolveSensorAlert: (sensorId: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  authorityCoords: [number, number];
  setAuthorityCoords: (coords: [number, number]) => void;

  // Audit Logs
  auditLogs: AuditLogEntry[];

  // Modals & UI States
  isRoleModalOpen: boolean;
  setIsRoleModalOpen: (open: boolean) => void;
  isRedeemModalOpen: boolean;
  setIsRedeemModalOpen: (open: boolean) => void;
  isOfficerMode: boolean;
  setIsOfficerMode: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always start with no role pre-selected, waiting for user response on the Sign-In view
  const [role, setRoleState] = useState<UserRole | null>(null);
  const [userCredits, setUserCredits] = useState<number>(340);
  const [collectorCredits, setCollectorCredits] = useState<number>(680);
  const [collectorSpecializations, setCollectorSpecializations] = useState<WasteCategory[]>([
    'IT Product',
    'Electronic Waste',
    'Transport',
    'Furniture',
    'Glass Product',
    'Biodegradable',
    'Others'
  ]);
  const [listings, setListings] = useState<WasteListing[]>(INITIAL_LISTINGS);
  const [reports, setReports] = useState<GreenOfficerReport[]>(INITIAL_REPORTS);
  const [rewards] = useState<RewardCard[]>(INITIAL_REWARDS);
  const [sensors, setSensors] = useState<SensorMarker[]>(INITIAL_SENSORS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  
  // Default accurate location: NIT Rourkela, Odisha
  const [selectedCity, setSelectedCity] = useState<string>('NIT Rourkela, Odisha');
  const [authorityCoords, setAuthorityCoords] = useState<[number, number]>([22.2531, 84.9011]);
  
  const [isRoleModalOpen, setIsRoleModalOpen] = useState<boolean>(true);
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState<boolean>(false);
  const [isOfficerMode, setIsOfficerMode] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Synchronize state from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedListings = localStorage.getItem('ap_waste_listings');
        if (savedListings) {
          const parsed = JSON.parse(savedListings);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setListings(parsed);
          }
        }

        const savedUserCredits = localStorage.getItem('ap_user_credits');
        if (savedUserCredits) setUserCredits(parseInt(savedUserCredits, 10));

        const savedCollectorCredits = localStorage.getItem('ap_collector_credits');
        if (savedCollectorCredits) setCollectorCredits(parseInt(savedCollectorCredits, 10));

        const savedReports = localStorage.getItem('ap_reports');
        if (savedReports) {
          const parsed = JSON.parse(savedReports);
          if (Array.isArray(parsed)) setReports(parsed);
        }

        const savedAuditLogs = localStorage.getItem('ap_audit_logs');
        if (savedAuditLogs) {
          const parsed = JSON.parse(savedAuditLogs);
          if (Array.isArray(parsed)) setAuditLogs(parsed);
        }
      } catch (e) {
        console.error('Error loading stored state:', e);
      }

      // Remove any dark mode class from HTML root (pure light theme platform)
      document.documentElement.classList.remove('dark');
      setIsMounted(true);
    }
  }, []);

  const setRole = (newRole: UserRole | null) => {
    setRoleState(newRole);
    if (!newRole) {
      setIsRoleModalOpen(true);
    }
  };

  // Sync state changes to localStorage
  useEffect(() => {
    if (isMounted && typeof window !== 'undefined') {
      localStorage.setItem('ap_waste_listings', JSON.stringify(listings));
    }
  }, [listings, isMounted]);

  useEffect(() => {
    if (isMounted && typeof window !== 'undefined') {
      localStorage.setItem('ap_user_credits', userCredits.toString());
    }
  }, [userCredits, isMounted]);

  useEffect(() => {
    if (isMounted && typeof window !== 'undefined') {
      localStorage.setItem('ap_collector_credits', collectorCredits.toString());
    }
  }, [collectorCredits, isMounted]);

  useEffect(() => {
    if (isMounted && typeof window !== 'undefined') {
      localStorage.setItem('ap_reports', JSON.stringify(reports));
    }
  }, [reports, isMounted]);

  useEffect(() => {
    if (isMounted && typeof window !== 'undefined') {
      localStorage.setItem('ap_audit_logs', JSON.stringify(auditLogs));
    }
  }, [auditLogs, isMounted]);

  const addListing = (item: Omit<WasteListing, 'id' | 'createdAt' | 'status'>) => {
    const newListing: WasteListing = {
      ...item,
      id: `req-${Date.now()}`,
      status: 'PENDING',
      createdAt: Date.now()
    };
    setListings(prev => {
      const updated = [newListing, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('ap_waste_listings', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const acceptListing = (listingId: string, deliveryAgent: string, timeWindow: string) => {
    setListings(prev =>
      prev.map(item => {
        if (item.id === listingId) {
          // Increment User credits
          setUserCredits(c => c + item.calculatedCredits);
          // Increment Collector credits (bonus credits)
          setCollectorCredits(c => c + Math.round(item.calculatedCredits * 0.4) + 20);
          return {
            ...item,
            status: 'ACCEPTED',
            assignedDeliveryAgent: deliveryAgent,
            estimatedPickupTime: timeWindow
          };
        }
        return item;
      })
    );
  };

  const rejectListing = (listingId: string, reason?: string) => {
    setListings(prev =>
      prev.map(item => {
        if (item.id === listingId) {
          return {
            ...item,
            status: 'REJECTED',
            rejectionReason: reason || 'Item does not meet processing standards'
          };
        }
        return item;
      })
    );
  };

  const addReport = (rep: Omit<GreenOfficerReport, 'id' | 'timestamp' | 'status'>) => {
    const newRep: GreenOfficerReport = {
      ...rep,
      id: `rep-${Date.now()}`,
      status: 'REPORTED',
      timestamp: Date.now()
    };
    setReports(prev => [newRep, ...prev]);
    setUserCredits(c => c + 10);

    const newAudit: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      action: `New citizen sanitation report: ${rep.cleanlinessState} state`,
      target: rep.locationName,
      city: rep.city,
      performedBy: rep.officerName,
      timestamp: 'Just now',
      status: 'Reported'
    };
    setAuditLogs(prev => [newAudit, ...prev]);
  };

  const resolveReport = (reportId: string) => {
    setReports(prev =>
      prev.map(r => {
        if (r.id === reportId) {
          return { ...r, status: 'RESOLVED', resolvedAt: Date.now() };
        }
        return r;
      })
    );

    const targetReport = reports.find(r => r.id === reportId);
    if (targetReport) {
      const newAudit: AuditLogEntry = {
        id: `aud-${Date.now()}`,
        action: `Sanitation issue marked resolved by municipal team`,
        target: targetReport.locationName,
        city: targetReport.city,
        performedBy: 'Municipal Environmental Ops',
        timestamp: 'Just now',
        status: 'Resolved'
      };
      setAuditLogs(prev => [newAudit, ...prev]);
    }
  };

  const resolveSensorAlert = (sensorId: string) => {
    setSensors(prev =>
      prev.map(s => {
        if (s.id === sensorId) {
          return {
            ...s,
            status: 'Connected',
            alertsCount: 0,
            fillLevel: s.fillLevel ? Math.min(s.fillLevel, 25) : 10,
            cleanlinessScore: 95,
            lastUpdated: 'Just now'
          };
        }
        return s;
      })
    );

    const s = sensors.find(item => item.id === sensorId);
    if (s) {
      const newAudit: AuditLogEntry = {
        id: `aud-${Date.now()}`,
        action: `Sensor telemetry recalibrated & compaction serviced`,
        target: `${s.name} (${s.code})`,
        city: selectedCity,
        performedBy: 'Urban Sensor Grid Network',
        timestamp: 'Just now',
        status: 'Resolved'
      };
      setAuditLogs(prev => [newAudit, ...prev]);
    }
  };

  const redeemReward = (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward) return { success: false, message: 'Reward not found.' };
    
    if (userCredits < reward.creditsRequired) {
      return {
        success: false,
        message: `Insufficient Green Credits. You need ${reward.creditsRequired - userCredits} more credits.`
      };
    }

    setUserCredits(prev => prev - reward.creditsRequired);
    return {
      success: true,
      message: `Successfully redeemed ${reward.title}! Voucher Code: ${reward.voucherCode}`,
      voucher: reward.voucherCode
    };
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        userCredits,
        setUserCredits,
        collectorCredits,
        setCollectorCredits,
        collectorSpecializations,
        setCollectorSpecializations,
        listings,
        addListing,
        acceptListing,
        rejectListing,
        reports,
        addReport,
        resolveReport,
        rewards,
        redeemReward,
        sensors,
        resolveSensorAlert,
        selectedCity,
        setSelectedCity,
        authorityCoords,
        setAuthorityCoords,
        auditLogs,
        isRoleModalOpen,
        setIsRoleModalOpen,
        isRedeemModalOpen,
        setIsRedeemModalOpen,
        isOfficerMode,
        setIsOfficerMode
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
