'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Leaf, 
  Coins, 
  Gift, 
  ShieldCheck, 
  UserCheck, 
  Layers, 
  Clock,
  Sparkles,
  ChevronDown,
  RefreshCw,
  Bell
} from 'lucide-react';
import { ThreeLeafHero } from './ThreeLeafHero';

export const Navbar: React.FC = () => {
  const { 
    role, 
    userCredits, 
    collectorCredits, 
    listings, 
    isOfficerMode, 
    setIsOfficerMode,
    setIsRedeemModalOpen,
    setIsRoleModalOpen
  } = useApp();

  const [displayCredits, setDisplayCredits] = useState(userCredits);

  // Animated credit counter transition
  useEffect(() => {
    const target = role === 'COLLECTOR' ? collectorCredits : userCredits;
    const step = (target - displayCredits) / 10;
    if (Math.abs(target - displayCredits) > 1) {
      const timer = setTimeout(() => {
        setDisplayCredits(prev => Math.round(prev + step));
      }, 30);
      return () => clearTimeout(timer);
    } else {
      setDisplayCredits(target);
    }
  }, [userCredits, collectorCredits, role, displayCredits]);

  const pendingCount = listings.filter(l => l.status === 'PENDING').length;
  const acceptedCount = listings.filter(l => l.status === 'ACCEPTED').length;

  return (
    <header className="sticky top-0 z-40 w-full max-w-full backdrop-blur-xl border-b bg-white/95 border-slate-200 text-slate-900 shadow-xs px-3 sm:px-8 py-2.5 sm:py-3 overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Logo & 3D Leaf Avatar */}
        <div 
          onClick={() => setIsRoleModalOpen(true)}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group select-none shrink-0"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl border bg-emerald-50 border-emerald-300 shadow-xs flex items-center justify-center relative shadow-emerald-100 group-hover:scale-105 transition-transform overflow-hidden shrink-0">
            <ThreeLeafHero compact className="w-full h-full" />
          </div>
          <div>
            <span className="font-black text-base sm:text-xl tracking-tight bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 bg-clip-text text-transparent">
              Avyan Prakriti
            </span>
            <p className="text-[10px] hidden sm:block text-slate-500">
              Sustainable Waste &amp; Eco-System Matrix
            </p>
          </div>
        </div>

        {/* Center / Right Control Panel */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          
          {/* Green Credit Counter Widget (Hidden for Authority Portal) */}
          {role !== 'AUTHORITY' && (
            <div className="flex items-center gap-1.5 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-2xl border bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 shadow-2xs">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center bg-emerald-200 text-emerald-800 shrink-0">
                <Coins className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] sm:text-[9px] uppercase tracking-wider font-bold leading-none text-slate-500 hidden sm:block">
                  {role === 'COLLECTOR' ? 'Collector Balance' : 'Green Credits'}
                </span>
                <span className="text-xs sm:text-base font-extrabold font-mono leading-tight text-emerald-700">
                  {displayCredits.toLocaleString()} <span className="text-[9px] sm:text-[10px] font-normal text-emerald-600">pts</span>
                </span>
              </div>
            </div>
          )}

          {/* Pending Tracker Badge (for User) */}
          {role === 'USER' && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs bg-slate-100 border-slate-200 text-slate-700">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Pending:</span>
              <span className="px-1.5 py-0.2 rounded-md bg-amber-500/20 text-amber-700 font-bold font-mono">
                {pendingCount}
              </span>
              {acceptedCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-700 font-bold font-mono">
                  {acceptedCount} In Transit
                </span>
              )}
            </div>
          )}

          {/* Authority Grid Active Badge */}
          {role === 'AUTHORITY' && (
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-semibold bg-purple-50 border-purple-200 text-purple-900">
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
              <span>Municipal Telemetry Active</span>
            </div>
          )}

          {/* Redeem Rewards CTA (Desktop / Tablet) */}
          {role !== 'AUTHORITY' && (
            <button
              type="button"
              onClick={() => setIsRedeemModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-semibold text-xs transition shadow-xs bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-800"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Redeem</span>
            </button>
          )}

          {/* Portal Switcher Dropdown Trigger */}
          <button
            type="button"
            onClick={() => setIsRoleModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 sm:py-1.5 rounded-2xl border text-xs font-semibold transition bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800"
          >
            <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full animate-pulse ${
              role === 'USER' ? 'bg-emerald-500' : role === 'COLLECTOR' ? 'bg-cyan-500' : 'bg-purple-500'
            }`} />
            <span className="hidden sm:inline capitalize">{role || 'Select'}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </div>
      </div>
    </header>
  );
};
