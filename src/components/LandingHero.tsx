'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { ThreeLeafHero } from './ThreeLeafHero';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  User, 
  Recycle, 
  Leaf, 
  Cpu, 
  Activity 
} from 'lucide-react';

export const LandingHero: React.FC = () => {
  const { setRole } = useApp();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-teal-50 border border-emerald-200 p-6 sm:p-12 mb-8 shadow-sm text-slate-900">
      
      {/* Background Lighting Gradients */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-cyan-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left Column: Platform Headline & Entrypoints (7 cols) */}
        <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700 animate-pulse" />
            AI-Driven Circular Economy &amp; Urban Sanitation Matrix
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 leading-tight tracking-tight">
            Avyan Prakriti
            <span className="block mt-1 text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 bg-clip-text text-transparent">
              Sustainable Waste &amp; Smart Eco-System Management
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Harness Google Gemini AI Vision to classify e-waste, furniture, and recyclables in seconds. Earn verifiable Green Credits, dispatch to specialized collectors, and monitor city GIS sanitation nodes in real-time.
          </p>

          {/* Quick Role Triggers */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
            <button
              type="button"
              onClick={() => setRole('USER')}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <User className="w-4 h-4" /> Enter User Portal
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setRole('COLLECTOR')}
              className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 border border-cyan-300 text-cyan-800 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs hover:scale-[1.02] transition-all"
            >
              <Truck className="w-4 h-4 text-cyan-600" /> Collector Portal
            </button>

            <button
              type="button"
              onClick={() => setRole('AUTHORITY')}
              className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 border border-purple-300 text-purple-800 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs hover:scale-[1.02] transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-purple-600" /> Authority GIS
            </button>
          </div>

          {/* Micro Feature Badges */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-3 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-emerald-600" /> Gemini Vision AI
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-teal-600" /> Carbon Offset Credits
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-600" /> Live GIS IoT Grid
            </span>
          </div>

        </div>

        {/* Right Column: High-Fidelity 3D Leaf Model Canvas (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[320px] h-[280px] sm:h-[320px] rounded-3xl bg-white border border-emerald-200 p-2 flex items-center justify-center shadow-md overflow-hidden group">
            <div className="absolute inset-0 bg-radial from-emerald-100/40 to-transparent pointer-events-none" />
            <ThreeLeafHero className="w-full h-full" />
            
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-emerald-300 text-[10px] font-mono tracking-wider shadow">
              Interactive 3D Leaf • Rotate &amp; Hover
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
