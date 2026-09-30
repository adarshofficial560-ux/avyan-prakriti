'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { AIWasteScanner } from './AIWasteScanner';
import { UserRequestTracker } from './UserRequestTracker';
import { GreenOfficerReporter } from './GreenOfficerReporter';
import { 
  Recycle, 
  Leaf, 
  Coins, 
  ShieldCheck, 
  TrendingUp, 
  Award, 
  Sparkles, 
  TreeDeciduous, 
  Gift, 
  MapPin, 
  Camera, 
  Layers, 
  Clock, 
  CheckCircle2, 
  Navigation,
  FileText,
  Zap,
  SlidersHorizontal
} from 'lucide-react';

type UserTab = 'ALL' | 'SCANNER' | 'TRACKER' | 'OFFICER';

export const UserPortalView: React.FC = () => {
  const { userCredits, listings, reports, setIsRedeemModalOpen } = useApp();
  const [activeTab, setActiveTab] = useState<UserTab>('ALL');

  const totalRecycledCount = listings.length + 8;
  const estimatedCo2Saved = (userCredits * 0.42).toFixed(1);
  const pendingRequestsCount = listings.filter(l => l.status === 'PENDING').length;

  return (
    <div className="w-full max-w-full mx-auto space-y-6 sm:space-y-8 animate-fadeIn pb-16 text-slate-900 overflow-x-hidden">
      
      {/* 1. Top Responsive Profile & Command Banner */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-emerald-50 via-white to-teal-50 border border-emerald-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6">
        
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 p-0.5 shadow-md shrink-0">
            <img
              src="/user-avatar.png"
              alt="Adarsh kumar Avatar"
              className="w-full h-full object-cover rounded-[14px]"
            />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Adarsh kumar
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
                Level 4 Recycler
              </span>
            </div>
            <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>NIT ROURKELA, Odisha • Active Circular Eco-Node</span>
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsRedeemModalOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-105 text-white text-xs font-black flex items-center justify-center gap-2 shadow-sm shadow-amber-500/20 active:scale-95 transition"
          >
            <Gift className="w-4 h-4" />
            <span>Redeem Rewards ({userCredits.toLocaleString()} pts)</span>
          </button>
        </div>

      </div>

      {/* 2. Responsive 4-Metric Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1 */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
            <Coins className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <span className="text-[10px] sm:text-[11px] text-slate-500 uppercase font-semibold block">Green Balance</span>
            <span className="text-lg sm:text-xl font-black text-slate-900 font-mono">
              {userCredits.toLocaleString()} <span className="text-xs font-normal text-emerald-600">Credits</span>
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0">
            <TreeDeciduous className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <span className="text-[10px] sm:text-[11px] text-slate-500 uppercase font-semibold block">CO2 Offset</span>
            <span className="text-lg sm:text-xl font-black text-slate-900 font-mono">
              {estimatedCo2Saved} <span className="text-xs font-normal text-teal-600">kg saved</span>
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-700 flex items-center justify-center shrink-0">
            <Recycle className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <span className="text-[10px] sm:text-[11px] text-slate-500 uppercase font-semibold block">Recycled Assets</span>
            <span className="text-lg sm:text-xl font-black text-slate-900 font-mono">
              {totalRecycledCount} <span className="text-xs font-normal text-cyan-600">items</span>
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <span className="text-[10px] sm:text-[11px] text-slate-500 uppercase font-semibold block">Active Dispatches</span>
            <span className="text-lg sm:text-xl font-black text-slate-900 font-mono">
              {listings.length} <span className="text-xs font-normal text-purple-600">({pendingRequestsCount} Pending)</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. Section Filter Tabs (Responsive Scrollable Bar) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('ALL')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
            activeTab === 'ALL'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" /> All Tools
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('SCANNER')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
            activeTab === 'SCANNER'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Camera className="w-3.5 h-3.5" /> AI Waste Scanner
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('TRACKER')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
            activeTab === 'TRACKER'
              ? 'bg-cyan-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Clock className="w-3.5 h-3.5" /> Live Request Tracker ({listings.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('OFFICER')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
            activeTab === 'OFFICER'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" /> Green Officer Desk ({reports.length})
        </button>
      </div>

      {/* 4. Main Responsive Sections */}
      <div className="space-y-6 sm:space-y-8">
        
        {/* Section 1: AI Waste Vision Scanner */}
        {(activeTab === 'ALL' || activeTab === 'SCANNER') && (
          <div className="animate-fadeIn">
            <AIWasteScanner />
          </div>
        )}

        {/* Section 2: Dispatched Waste Requests Tracker */}
        {(activeTab === 'ALL' || activeTab === 'TRACKER') && (
          <div className="animate-fadeIn">
            <UserRequestTracker />
          </div>
        )}

        {/* Section 3: Citizen Green Officer Reporting */}
        {(activeTab === 'ALL' || activeTab === 'OFFICER') && (
          <div className="animate-fadeIn">
            <GreenOfficerReporter />
          </div>
        )}

      </div>

    </div>
  );
};
