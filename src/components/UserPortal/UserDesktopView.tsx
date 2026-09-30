'use client';

import React from 'react';
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
  Navigation 
} from 'lucide-react';

export const UserDesktopView: React.FC = () => {
  const { userCredits, listings, isOfficerMode, setIsOfficerMode, setIsRedeemModalOpen } = useApp();

  const totalRecycledCount = listings.length + 8;
  const estimatedCo2Saved = ((userCredits * 0.42)).toFixed(1);

  return (
    <div className="w-full space-y-8 animate-fadeIn pb-16 text-slate-900">
      
      {/* Top Desktop Command & Profile Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-50 via-white to-teal-50 border border-emerald-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 p-0.5 shadow-md shrink-0">
            <img
              src="/user-avatar.png"
              alt="User Avatar"
              className="w-full h-full object-cover rounded-[14px]"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                Adarsh kumar (Eco Citizen)
              </h1>
              <span className="px-3 py-0.5 rounded-full text-xs font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                Level 4 Recycler
              </span>
            </div>
            <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" /> NIT ROURKELA, Odisha • Active Circular Eco-Node
            </p>
          </div>
        </div>

        {/* Desktop Quick Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsRedeemModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-105 text-white text-xs font-black flex items-center gap-2 shadow-md shadow-amber-500/20 active:scale-95 transition"
          >
            <Gift className="w-4 h-4" />
            <span>Redeem Rewards ({userCredits} pts)</span>
          </button>
        </div>

      </div>

      {/* 4-Metric Desktop Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 uppercase font-semibold block">Green Balance</span>
            <span className="text-xl font-black text-slate-900 font-mono">
              {userCredits.toLocaleString()} <span className="text-xs font-normal text-emerald-600">Credits</span>
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0">
            <TreeDeciduous className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 uppercase font-semibold block">CO2 Offset</span>
            <span className="text-xl font-black text-slate-900 font-mono">
              {estimatedCo2Saved} <span className="text-xs font-normal text-teal-600">kg saved</span>
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-700 flex items-center justify-center shrink-0">
            <Recycle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 uppercase font-semibold block">Recycled Assets</span>
            <span className="text-xl font-black text-slate-900 font-mono">
              {totalRecycledCount} <span className="text-xs font-normal text-cyan-600">items</span>
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 uppercase font-semibold block">Market Dispatches</span>
            <span className="text-xl font-black text-slate-900 font-mono">
              {listings.length} <span className="text-xs font-normal text-purple-600">Active</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Desktop Workbench: AI Waste Scanner */}
      <AIWasteScanner />

      {/* Green Officer Reporting Section */}
      <div className="grid grid-cols-1 gap-6">
        <GreenOfficerReporter />
      </div>

      {/* Dispatched Requests Tracker */}
      <UserRequestTracker />

    </div>
  );
};
