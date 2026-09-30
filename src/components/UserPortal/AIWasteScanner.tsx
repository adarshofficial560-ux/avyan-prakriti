'use client';

import React, { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { analyzeWasteWithGemini } from '@/lib/gemini';
import { WasteAnalysisResult } from '@/types';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  Tag, 
  Layers, 
  Scale, 
  Leaf, 
  ArrowRight, 
  RefreshCw, 
  Image as ImageIcon,
  DollarSign,
  ShieldCheck,
  Zap,
  Info,
  Maximize2,
  TreeDeciduous,
  Coins
} from 'lucide-react';
import confetti from 'canvas-confetti';

const SAMPLE_PRESETS = [
  { name: 'Mechanical Keyboard', desc: 'RGB gaming mechanical keyboard with damaged USB cable', cat: 'IT Product' },
  { name: 'Old Refrigerator', desc: 'Frost-free double door refrigerator appliance with compressor', cat: 'Electronic Waste' },
  { name: 'Commuter Bicycle', desc: 'Vintage aluminum frame bicycle with flat tires', cat: 'Transport' },
  { name: 'Wooden Study Table', desc: 'Solid teak wood writing desk with drawers', cat: 'Furniture' },
  { name: 'Glass Culinary Bottles', desc: 'Clear glass food jars and beverage bottles', cat: 'Glass Product' },
  { name: 'Organic Fruit Peels', desc: 'Banana and apple kitchen biodegradable organic peels', cat: 'Biodegradable' }
];

export const AIWasteScanner: React.FC = () => {
  const { addListing, userCredits } = useApp();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [textDescription, setTextDescription] = useState<string>('');
  const [senderLocation, setSenderLocation] = useState<string>('NIT ROURKELA, Odisha');
  const [userName, setUserName] = useState<string>('Adarsh kumar');
  const [userPhone, setUserPhone] = useState<string>('+91 98765 43210');

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
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRunScan = async () => {
    // Pre-requisite Enforcement: User MUST provide either image OR text description
    if (!imagePreview && (!textDescription || textDescription.trim().length < 3)) {
      setErrorMsg('Pre-requisite required: Please upload an item photo OR enter a clear text description before running the AI scan.');
      return;
    }

    setErrorMsg(null);
    setIsScanning(true);
    setDispatchedTxn(null);

    try {
      const result = await analyzeWasteWithGemini(imagePreview || undefined, textDescription);
      setScanResult(result);
    } catch (err: any) {
      setErrorMsg('AI Vision analysis failed. Please try again or check connection.');
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
      userName,
      userPhone,
      title: scanResult.itemName,
      description: textDescription || `${scanResult.itemName} (${scanResult.category}) evaluated via Gemini AI`,
      category: scanResult.category,
      wasteTypeTag: scanResult.wasteTypeTag,
      imageUrl: imagePreview || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
      calculatedCredits: scanResult.calculatedCredits,
      estimatedWeightKg: scanResult.estimatedWeightKg,
      senderLocation
    });

    setDispatchedTxn(txnId);

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#00F29D', '#06B6D4', '#10B981']
      });
    } catch (e) {}
  };

  const resetForm = () => {
    setImagePreview(null);
    setTextDescription('');
    setScanResult(null);
    setDispatchedTxn(null);
    setErrorMsg(null);
  };

  return (
    <div className="w-full bg-white border border-slate-200 rounded-3xl p-4 sm:p-7 shadow-xs relative overflow-hidden text-slate-900">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold uppercase tracking-wider mb-1">
            <Zap className="w-3.5 h-3.5 text-emerald-600 animate-pulse" /> Gemini AI Vision Engine
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-900">
            Smart Waste Scanner
          </h2>
          <p className="text-xs text-slate-600">
            Auto-classify items, calculate Green Credits &amp; dispatch to licensed collectors
          </p>
        </div>

        {(imagePreview || textDescription || scanResult) && (
          <button
            type="button"
            onClick={resetForm}
            className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 flex items-center gap-1.5 transition border border-slate-300"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset
          </button>
        )}
      </div>

      {/* Pre-requisite Rule Banner */}
      <div className="mb-4 p-2.5 sm:p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-2 text-xs text-emerald-950">
        <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <div>
          <strong>Pre-requisite:</strong> Upload a clear image <span className="text-emerald-700 font-bold">OR</span> enter a text description to start scanning.
        </div>
      </div>

      {/* Mobile-First Camera Viewfinder & Input Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
        
        {/* Left: Interactive Camera Viewfinder Box (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-2.5">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className={`relative min-h-[220px] sm:min-h-[260px] rounded-3xl border-2 transition-all flex flex-col items-center justify-center p-3 text-center cursor-pointer overflow-hidden ${
              imagePreview
                ? 'border-emerald-500 bg-slate-950 shadow-md'
                : 'border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/30'
            }`}
          >
            {imagePreview ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={imagePreview}
                  alt="Scanned item"
                  className="max-h-[230px] w-full object-cover rounded-2xl"
                />

                {/* Corner Alignment Camera Brackets */}
                <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-emerald-400 rounded-tl-lg pointer-events-none" />
                <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-emerald-400 rounded-tr-lg pointer-events-none" />
                <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-emerald-400 rounded-bl-lg pointer-events-none" />
                <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-emerald-400 rounded-br-lg pointer-events-none" />

                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl backdrop-blur-xs">
                  <span className="px-3 py-1.5 rounded-xl bg-white text-xs font-bold text-slate-900 shadow-md flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-emerald-600" /> Change Image
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-500 p-2">
                <div className="relative w-16 h-16 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center shadow-xs">
                  <Camera className="w-8 h-8" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-ping" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-900">Open Camera / Upload Photo</p>
                  <p className="text-[11px] text-slate-500">Tap to capture recyclable product</p>
                </div>
                <span className="px-3 py-1 rounded-xl bg-white text-[11px] font-semibold text-slate-700 border border-slate-300 shadow-xs">
                  Capture Item
                </span>
              </div>
            )}

            {/* Scanning Radar Animation Overlay */}
            {isScanning && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center z-20">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30 animate-ping" />
                  <div className="w-12 h-12 rounded-full border-2 border-t-emerald-600 border-r-teal-500 border-b-transparent border-l-transparent animate-spin" />
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-xs font-bold text-emerald-800 mt-2 animate-pulse">
                  Gemini Vision Scanning...
                </p>
                <p className="text-[10px] text-slate-500">Analyzing material composition</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Description & Scan Actions (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-3">
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Item Details &amp; Physical Condition:
            </label>
            <textarea
              rows={2}
              value={textDescription}
              onChange={(e) => {
                setTextDescription(e.target.value);
                setErrorMsg(null);
              }}
              placeholder="e.g., Working mechanical keyboard with blue switches, or 20 clear glass jars, or double-door refrigerator..."
              className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition resize-none shadow-xs"
            />
          </div>

          {/* Quick Presets / Examples */}
          <div>
            <div className="text-[11px] font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Quick Test Samples:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    setTextDescription(preset.desc);
                    setErrorMsg(null);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-[11px] text-slate-700 hover:text-emerald-900 transition"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              {errorMsg}
            </div>
          )}

          {/* Scan Action Button */}
          <button
            type="button"
            onClick={handleRunScan}
            disabled={isScanning}
            className={`w-full py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${
              isScanning
                ? 'bg-slate-200 text-slate-500 cursor-wait'
                : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white hover:brightness-105 active:scale-[0.99]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            {isScanning ? 'Executing AI Waste Classification...' : 'Analyze with Gemini AI'}
          </button>
        </div>
      </div>

      {/* Corner Result Card UI (Inspired by Mobile Mockups) */}
      {scanResult && (
        <div className="mt-4 p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/70 border-2 border-emerald-300 shadow-md animate-fadeIn">
          
          {/* Top Result Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-4">
            <div>
              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-[10px] font-extrabold uppercase">
                  {scanResult.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 border border-cyan-300 text-cyan-900 text-[10px] font-semibold">
                  {scanResult.wasteTypeTag}
                </span>
              </div>
              <h3 className="text-base sm:text-xl font-black text-slate-900">
                {scanResult.itemName}
              </h3>
            </div>

            {/* Mobile Stat Pill Badges */}
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-xl bg-white border border-emerald-200 text-center shadow-xs">
                <span className="text-[9px] text-slate-500 block uppercase font-bold">Saved CO2</span>
                <span className="text-xs font-black text-teal-700 font-mono">
                  {(scanResult.estimatedWeightKg * 1.6).toFixed(1)} kg
                </span>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-center shadow-xs">
                <span className="text-[9px] text-emerald-100 block uppercase font-bold">Reward</span>
                <span className="text-xs font-black font-mono">
                  +{scanResult.calculatedCredits} pts
                </span>
              </div>
            </div>
          </div>

          {/* Breakdown & Circular Guidance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-xs">
            <div className="p-3 rounded-2xl bg-white border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">
                Material Composition:
              </span>
              <div className="flex flex-wrap gap-1">
                {scanResult.materialBreakdown.map((mat) => (
                  <span key={mat} className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-700">
                    {mat}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">
                Circular Disposal:
              </span>
              <p className="text-[11px] text-slate-700 leading-snug">
                {scanResult.recyclingGuidance}
              </p>
            </div>
          </div>

          {/* Dispatch CTA */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
            {dispatchedTxn ? (
              <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-emerald-100 border border-emerald-300 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0" />
                  <span className="font-bold text-emerald-950">
                    Dispatched! ID: <code className="font-mono text-emerald-900 bg-white px-1.5 py-0.2 rounded">{dispatchedTxn}</code>
                  </span>
                </div>
                <span className="text-[10px] text-emerald-800 font-bold">PENDING COLLECTOR</span>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <input
                  type="text"
                  value={senderLocation}
                  onChange={(e) => setSenderLocation(e.target.value)}
                  className="w-full sm:w-72 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  placeholder="Enter pickup address"
                />

                <button
                  type="button"
                  onClick={handleSellProduct}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition"
                >
                  <DollarSign className="w-4 h-4" />
                  Sell Product &amp; Dispatch Pickup
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
