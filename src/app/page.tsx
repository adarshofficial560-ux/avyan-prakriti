'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Navbar } from '@/components/Navbar';
import { LandingHero } from '@/components/LandingHero';
import { RoleSelectModal } from '@/components/RoleSelectModal';
import { RedeemModal } from '@/components/RedeemModal';
import { UserPortalView } from '@/components/UserPortal/UserPortalView';
import { CollectorPortalView } from '@/components/CollectorPortal/CollectorPortalView';
import { AuthorityDashboard } from '@/components/AuthorityPortal/AuthorityDashboard';
import { 
  Home, 
  Camera, 
  MapPin, 
  ShieldCheck, 
  User, 
  Truck, 
  Building2,
  Gift
} from 'lucide-react';

export default function HomePage() {
  const { role, setRole, setIsRoleModalOpen, setIsRedeemModalOpen } = useApp();

  return (
    <main className="min-h-screen flex flex-col justify-between bg-[#F8FAFC] text-slate-900 overflow-x-hidden w-full max-w-full">
      
      {/* Role Selection / Sign-In Modal (Always waits for user response) */}
      <RoleSelectModal />

      {/* Rewards Redemption Modal */}
      <RedeemModal />

      {/* Sticky Global Navigation */}
      <Navbar />

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-8 pt-4 sm:pt-6 pb-20 overflow-x-hidden">
        
        {/* Top Hero Banner (Shown when user is on landing/neutral state) */}
        {!role && <LandingHero />}

        {/* Dynamic Multi-Role Portals */}
        {role === 'USER' && <UserPortalView />}
        {role === 'COLLECTOR' && <CollectorPortalView />}
        {role === 'AUTHORITY' && <AuthorityDashboard />}

      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur-lg border-t px-4 py-2 sm:hidden flex items-center justify-around bg-white/95 border-slate-200 text-slate-600 shadow-lg">
        <button
          type="button"
          onClick={() => setRole('USER')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition ${
            role === 'USER' ? 'text-emerald-600 font-bold' : ''
          }`}
        >
          <Home className="w-4 h-4" />
          <span>User</span>
        </button>

        <button
          type="button"
          onClick={() => setRole('COLLECTOR')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition ${
            role === 'COLLECTOR' ? 'text-cyan-600 font-bold' : ''
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Collector</span>
        </button>

        {/* Center Scanner / Portal Action Trigger */}
        <button
          type="button"
          onClick={() => setIsRoleModalOpen(true)}
          className="w-11 h-11 -mt-5 rounded-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white flex items-center justify-center shadow-md font-bold border-2 border-white active:scale-95 transition"
        >
          <Camera className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => setRole('AUTHORITY')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition ${
            role === 'AUTHORITY' ? 'text-purple-600 font-bold' : ''
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Authority</span>
        </button>

        <button
          type="button"
          onClick={() => setIsRedeemModalOpen(true)}
          className="flex flex-col items-center gap-0.5 text-[10px] font-semibold text-amber-600"
        >
          <Gift className="w-4 h-4" />
          <span>Rewards</span>
        </button>
      </div>

      {/* Global Footer */}
      <footer className="border-t py-6 px-4 text-center text-xs border-slate-200 bg-white text-slate-500 mb-20 sm:mb-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Avyan Prakriti. All Rights Reserved. Built for global urban circular ecosystems.</p>
          <div className="flex items-center gap-4">
            <span>ISO 14001 Compliant</span>
            <span>•</span>
            <span>Gemini AI 1.5 Flash</span>
            <span>•</span>
            <span>Zero Landfill Mission</span>
          </div>
        </div>
      </footer>

    </main>
  );
}
