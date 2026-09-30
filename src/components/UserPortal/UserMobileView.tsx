'use client';

import React, { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { analyzeWasteWithGemini } from '@/lib/gemini';
import { WasteAnalysisResult } from '@/types';
import { 
  Home, 
  MapPin, 
  Camera, 
  Sparkles, 
  RotateCcw, 
  ArrowLeft, 
  Check, 
  Clock, 
  Gift, 
  Share2, 
  ShieldCheck, 
  Leaf, 
  TreeDeciduous, 
  Recycle, 
  Coins, 
  User, 
  ChevronRight, 
  Layers, 
  Info,
  DollarSign,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

const MOBILE_MATERIALS = [
  { name: 'Plastic', icon: '🧴', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  { name: 'Metal', icon: '🥫', color: 'bg-cyan-50 text-cyan-800 border-cyan-200' },
  { name: 'Glass', icon: '🍾', color: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
  { name: 'Paper', icon: '📦', color: 'bg-amber-50 text-amber-800 border-amber-200' },
];

export const UserMobileView: React.FC = () => {
  const { 
    userCredits, 
    setUserCredits, 
    listings, 
    addListing, 
    reports, 
    addReport, 
    setIsRedeemModalOpen,
    setIsRoleModalOpen
  } = useApp();

  const [activeMobileScreen, setActiveMobileScreen] = useState<'HOME' | 'SCAN' | 'STATION' | 'STATS' | 'PROFILE'>('HOME');

  // Scanner States
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [textDescription, setTextDescription] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<WasteAnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [dispatchedTxn, setDispatchedTxn] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg(null);
    setScanResult(null);
    setDispatchedTxn(null);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRunScan = async () => {
    if (!imagePreview && (!textDescription || textDescription.trim().length < 3)) {
      setErrorMsg('Please capture/upload an item photo OR enter a description.');
      return;
    }
    setErrorMsg(null);
    setIsScanning(true);
    setDispatchedTxn(null);
    try {
      const result = await analyzeWasteWithGemini(imagePreview || undefined, textDescription);
      setScanResult(result);
    } catch (err: any) {
      setErrorMsg('AI scan failed. Please retry.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleSellProduct = () => {
    if (!scanResult) return;
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const txnId = `TXN-${randomSuffix}`;

    addListing({
      transactionId: txnId,
      userId: 'usr-current',
      userName: 'Adarsh kumar',
      userPhone: '+91 98765 43210',
      title: scanResult.itemName,
      description: textDescription || `${scanResult.itemName} (${scanResult.category}) evaluated via Gemini AI`,
      category: scanResult.category,
      wasteTypeTag: scanResult.wasteTypeTag,
      imageUrl: imagePreview || 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=600&q=80',
      calculatedCredits: scanResult.calculatedCredits,
      estimatedWeightKg: scanResult.estimatedWeightKg,
      senderLocation: 'NIT ROURKELA, Odisha'
    });

    setDispatchedTxn(txnId);
    try {
      confetti({
        particleCount: 60,
        spread: 55,
        origin: { y: 0.6 },
        colors: ['#00F29D', '#06B6D4', '#10B981']
      });
    } catch (e) {}
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white min-h-screen text-slate-900 flex flex-col justify-between pb-24 font-sans antialiased select-none">
      
      {/* Hidden File Upload Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* ================= SCREEN 1: HOME ================= */}
      {activeMobileScreen === 'HOME' && (
        <div className="p-4 space-y-4 animate-fadeIn">
          
          {/* Top User Greeting Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/user-avatar.png"
                alt="Profile"
                className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500 shadow-sm"
              />
              <div>
                <h2 className="font-extrabold text-base text-slate-900 leading-tight">Hi, Adarsh kumar</h2>
                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-600" /> NIT ROURKELA, Odisha
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsRedeemModalOpen(true)}
                className="p-2 rounded-full bg-amber-50 text-amber-800 border border-amber-200"
              >
                <Gift className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsRoleModalOpen(true)}
                className="p-2 rounded-full bg-slate-100 text-slate-700 border border-slate-200"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Green Metric Capsule Card (Inspired by Screenshot) */}
          <div className="rounded-3xl p-5 bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 text-white shadow-lg shadow-emerald-900/15">
            <div className="grid grid-cols-3 gap-2 text-center divide-x divide-white/15">
              <div className="px-1">
                <div className="w-7 h-7 mx-auto mb-1 rounded-full bg-white/20 flex items-center justify-center">
                  <Coins className="w-3.5 h-3.5 text-amber-300" />
                </div>
                <div className="text-sm font-black font-mono">{userCredits.toLocaleString()}</div>
                <div className="text-[10px] text-emerald-200 uppercase font-semibold">POINTS</div>
              </div>

              <div className="px-1">
                <div className="w-7 h-7 mx-auto mb-1 rounded-full bg-white/20 flex items-center justify-center">
                  <TreeDeciduous className="w-3.5 h-3.5 text-teal-300" />
                </div>
                <div className="text-sm font-black font-mono">{(userCredits * 0.42).toFixed(1)}kg</div>
                <div className="text-[10px] text-teal-200 uppercase font-semibold">SAVED CO2</div>
              </div>

              <div className="px-1">
                <div className="w-7 h-7 mx-auto mb-1 rounded-full bg-white/20 flex items-center justify-center">
                  <Recycle className="w-3.5 h-3.5 text-emerald-300" />
                </div>
                <div className="text-sm font-black font-mono">{listings.length + 14}</div>
                <div className="text-[10px] text-emerald-200 uppercase font-semibold">RECYCLED</div>
              </div>
            </div>
          </div>

          {/* Quick Materials Grid */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="font-extrabold text-sm text-slate-900">Materials</h3>
              <span className="text-[11px] font-bold text-emerald-700 cursor-pointer">Show all</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {MOBILE_MATERIALS.map((mat) => (
                <div
                  key={mat.name}
                  onClick={() => {
                    setTextDescription(`${mat.name} bottle / container`);
                    setActiveMobileScreen('SCAN');
                  }}
                  className={`p-2.5 rounded-2xl border text-center cursor-pointer active:scale-95 transition ${mat.color}`}
                >
                  <div className="text-xl mb-1">{mat.icon}</div>
                  <div className="text-[11px] font-extrabold">{mat.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Nearby Bin Station Cards (Exact to Reference UI) */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="font-extrabold text-sm text-slate-900">Nearby bin station</h3>
              <span 
                onClick={() => setActiveMobileScreen('STATION')}
                className="text-[11px] font-bold text-emerald-700 cursor-pointer"
              >
                Show all
              </span>
            </div>

            <div className="space-y-2.5">
              {/* Station Card 1 */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl bg-emerald-100 border border-emerald-200 flex flex-col items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-emerald-700" />
                  <span className="text-[9px] font-bold text-emerald-900">150m</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] text-slate-500 font-semibold">150m | 5min</div>
                  <h4 className="text-xs font-black text-slate-900 truncate">Central station gate B</h4>
                  <p className="text-[10px] text-emerald-700 font-bold mt-0.5">40% of space available</p>
                  <div className="text-[9px] text-slate-500">@ Plastic • @ Paper • @ Glass</div>
                </div>
              </div>

              {/* Station Card 2 */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl bg-cyan-100 border border-cyan-200 flex flex-col items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-cyan-700" />
                  <span className="text-[9px] font-bold text-cyan-900">320m</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] text-slate-500 font-semibold">320m | 8min</div>
                  <h4 className="text-xs font-black text-slate-900 truncate">Norreport City Boulevard</h4>
                  <p className="text-[10px] text-teal-700 font-bold mt-0.5">65% of space available</p>
                  <div className="text-[9px] text-slate-500">@ E-Waste • @ Batteries</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick CTA to Open Scanner */}
          <button
            type="button"
            onClick={() => setActiveMobileScreen('SCAN')}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 active:scale-95 transition"
          >
            <Camera className="w-4 h-4" /> Open Smart AI Camera Scanner
          </button>
        </div>
      )}

      {/* ================= SCREEN 2: SCANNER ================= */}
      {activeMobileScreen === 'SCAN' && (
        <div className="p-4 space-y-4 animate-fadeIn">
          
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActiveMobileScreen('HOME')}
              className="p-2 rounded-full bg-slate-100 text-slate-700"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h2 className="font-extrabold text-sm uppercase tracking-wider text-slate-900">SCAN &amp; CLASSIFY</h2>
            <button
              type="button"
              onClick={() => {
                setImagePreview(null);
                setScanResult(null);
                setDispatchedTxn(null);
                setTextDescription('');
              }}
              className="p-2 rounded-full bg-slate-100 text-slate-700"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Camera Viewfinder Box (Matching Screenshot with corner brackets) */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative w-full h-72 rounded-3xl bg-slate-900 border-2 border-emerald-500 overflow-hidden flex items-center justify-center cursor-pointer shadow-lg"
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Captured"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center text-white p-4">
                <div className="w-16 h-16 mx-auto mb-2 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Camera className="w-8 h-8 text-emerald-400" />
                </div>
                <p className="text-xs font-bold">Tap to capture or upload</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Focus product inside the brackets</p>
              </div>
            )}

            {/* Corner Alignment Brackets */}
            <div className="absolute top-4 left-4 w-7 h-7 border-t-2 border-l-2 border-white rounded-tl-lg pointer-events-none" />
            <div className="absolute top-4 right-4 w-7 h-7 border-t-2 border-r-2 border-white rounded-tr-lg pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-7 h-7 border-b-2 border-l-2 border-white rounded-bl-lg pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-7 h-7 border-b-2 border-r-2 border-white rounded-br-lg pointer-events-none" />

            {/* Laser Line */}
            {isScanning && (
              <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-0.5 bg-emerald-400 shadow-[0_0_12px_#00F29D] animate-pulse" />
            )}
          </div>

          {/* Text Description Requirement Bar */}
          <div>
            <textarea
              rows={2}
              value={textDescription}
              onChange={(e) => {
                setTextDescription(e.target.value);
                setErrorMsg(null);
              }}
              placeholder="Or type item details (e.g., Glass culinary bottle, keyboard, bicycle)..."
              className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-xs"
            />
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              {errorMsg}
            </div>
          )}

          {/* Action Trigger Button */}
          <button
            type="button"
            onClick={handleRunScan}
            disabled={isScanning}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition"
          >
            <Sparkles className="w-4 h-4" />
            {isScanning ? 'Scanning with Gemini AI...' : 'Run Gemini AI Analysis'}
          </button>

          {/* Corner Result Sheet (Matching Mobile UI Screenshot) */}
          {scanResult && (
            <div className="p-4 rounded-3xl bg-slate-900 text-white shadow-xl animate-fadeIn space-y-3">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                    {scanResult.category}
                  </span>
                  <h3 className="font-black text-base text-white">{scanResult.itemName}</h3>
                </div>
                <span className="text-[10px] font-bold bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                  {scanResult.wasteTypeTag}
                </span>
              </div>

              {/* 3 Result Pills */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700">
                  <div className="text-[9px] text-slate-400 uppercase font-semibold">Material</div>
                  <div className="text-xs font-bold text-white truncate">{scanResult.materialBreakdown[0] || 'Mixed'}</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700">
                  <div className="text-[9px] text-slate-400 uppercase font-semibold">Points</div>
                  <div className="text-xs font-black text-emerald-400 font-mono">+{scanResult.calculatedCredits}p</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700">
                  <div className="text-[9px] text-slate-400 uppercase font-semibold">Saved CO2</div>
                  <div className="text-xs font-black text-teal-300 font-mono">{(scanResult.estimatedWeightKg * 1.4).toFixed(1)}kg</div>
                </div>
              </div>

              {/* Big Sell Action Button */}
              {dispatchedTxn ? (
                <div className="p-3 rounded-2xl bg-emerald-950 border border-emerald-500 text-center text-xs text-emerald-300 font-bold">
                  ✓ Dispatched to Collector Queue ({dispatchedTxn})
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSellProduct}
                  className="w-full py-3 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 active:scale-95 transition"
                >
                  <DollarSign className="w-4 h-4" /> Add to recycle bag / Sell Product
                </button>
              )}
            </div>
          )}

        </div>
      )}

      {/* ================= SCREEN 3: STATS & HISTORY ================= */}
      {activeMobileScreen === 'STATS' && (
        <div className="p-4 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-base text-slate-900">Recycling History &amp; Rewards</h2>
            <span className="text-xs font-bold text-emerald-700 font-mono">{userCredits} pts</span>
          </div>

          {/* History Metrics Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 font-semibold block">Recycled Packages</span>
              <span className="text-xl font-black text-slate-900 font-mono">62%</span>
              <p className="text-[10px] text-slate-500 mt-0.5">Of your trash was recycled</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 font-semibold block">Saved Carbon</span>
              <span className="text-xl font-black text-emerald-700 font-mono">493 g</span>
              <p className="text-[10px] text-slate-500 mt-0.5">Recorded this month</p>
            </div>
          </div>

          {/* Weekly Bars Simulation (From Reference Image) */}
          <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Weekly Segregation Rhythm</span>
              <span className="text-emerald-700">● Recycled  ○ Waste</span>
            </div>
            <div className="flex items-end justify-between h-28 pt-4 px-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => {
                const heightPercent = [45, 80, 60, 95, 70, 85, 90][idx];
                return (
                  <div key={idx} className="flex flex-col items-center gap-1.5">
                    <div className="w-5 bg-slate-200 rounded-full h-20 relative overflow-hidden flex items-end">
                      <div
                        className="w-full bg-emerald-600 rounded-full"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">{day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Listings Track */}
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 mb-2">Recent Dispatches</h3>
            <div className="space-y-2">
              {listings.slice(0, 3).map((item) => (
                <div key={item.id} className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img src={item.imageUrl} alt={item.title} className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 truncate max-w-[160px]">{item.title}</h4>
                      <span className="text-[10px] text-emerald-700 font-bold">+{item.calculatedCredits} pts</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= SCREEN 4: STATIONS & OFFICER ================= */}
      {activeMobileScreen === 'STATION' && (
        <div className="p-4 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActiveMobileScreen('HOME')}
              className="p-2 rounded-full bg-slate-100 text-slate-700"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h2 className="font-extrabold text-sm text-slate-900">Nearby Stations &amp; Audits</h2>
            <div className="w-8" />
          </div>

          {/* List of Stations */}
          <div className="space-y-3">
            {reports.map((rep) => (
              <div key={rep.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900">{rep.locationName}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {rep.facilityType}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">"{rep.notes}"</p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200">
                  <span>Audited by: {rep.officerName}</span>
                  <span className="text-emerald-700 font-bold">{rep.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= SCREEN 5: PROFILE ================= */}
      {activeMobileScreen === 'PROFILE' && (
        <div className="p-4 space-y-4 animate-fadeIn">
          <div className="text-center p-5 rounded-3xl bg-slate-50 border border-slate-200">
            <img
              src="/user-avatar.png"
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-2 border-emerald-500 shadow-md"
            />
            <h3 className="font-black text-lg text-slate-900">Adarsh kumar</h3>
            <p className="text-xs text-slate-500">Citizen Recycler • NIT ROURKELA, Odisha</p>
            <div className="inline-block mt-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-mono text-xs font-bold">
              {userCredits} Green Credits
            </div>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setIsRedeemModalOpen(true)}
              className="w-full p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between text-xs font-bold hover:bg-slate-50"
            >
              <div className="flex items-center gap-2 text-slate-800">
                <Gift className="w-4 h-4 text-amber-600" />
                <span>Rewards Bazaar</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => setIsRoleModalOpen(true)}
              className="w-full p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between text-xs font-bold hover:bg-slate-50"
            >
              <div className="flex items-center gap-2 text-slate-800">
                <RotateCcw className="w-4 h-4 text-purple-600" />
                <span>Switch Portal / Role</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      )}

      {/* ================= FIXED BOTTOM NATIVE PHONE BAR ================= */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-6 py-2.5 flex items-center justify-between shadow-lg">
        
        <button
          type="button"
          onClick={() => setActiveMobileScreen('HOME')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition ${
            activeMobileScreen === 'HOME' ? 'text-emerald-700 font-extrabold' : 'text-slate-400'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMobileScreen('STATION')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition ${
            activeMobileScreen === 'STATION' ? 'text-emerald-700 font-extrabold' : 'text-slate-400'
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span>Station</span>
        </button>

        {/* Center Highlighted Scan Trigger */}
        <button
          type="button"
          onClick={() => setActiveMobileScreen('SCAN')}
          className="w-12 h-12 -mt-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 border-2 border-white active:scale-95 transition"
        >
          <Camera className="w-6 h-6" />
        </button>

        <button
          type="button"
          onClick={() => setActiveMobileScreen('STATS')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition ${
            activeMobileScreen === 'STATS' ? 'text-emerald-700 font-extrabold' : 'text-slate-400'
          }`}
        >
          <Leaf className="w-5 h-5" />
          <span>Learn</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMobileScreen('PROFILE')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition ${
            activeMobileScreen === 'PROFILE' ? 'text-emerald-700 font-extrabold' : 'text-slate-400'
          }`}
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </button>

      </div>

    </div>
  );
};
