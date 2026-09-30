'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { WasteCategory, WasteListing } from '@/types';
import { 
  Truck, 
  Check, 
  X, 
  Maximize2, 
  MapPin, 
  Leaf, 
  Layers, 
  Filter, 
  Coins, 
  Calendar, 
  User, 
  Phone, 
  Sparkles, 
  AlertCircle,
  Gift
} from 'lucide-react';
import confetti from 'canvas-confetti';

const ALL_CATEGORIES: WasteCategory[] = [
  'IT Product',
  'Electronic Waste',
  'Transport',
  'Furniture',
  'Glass Product',
  'Biodegradable',
  'Others'
];

const DISPATCH_AGENTS = [
  'Vikram Singh (Eco Courier #42)',
  'Aarav Patel (Green Route #19)',
  'Elena Rostova (EV Hauler #08)',
  'Marcus Chen (Express Recycler #23)',
  'Sarah Jenkins (Logistics Lead #05)'
];

const REJECTION_REASONS = [
  'Item exceeds weight / volume capacity',
  'Contaminated / non-recyclable state',
  'Outside operational service perimeter',
  'Hazardous non-certified materials present'
];

export const CollectorPortalView: React.FC = () => {
  const { 
    listings, 
    acceptListing, 
    rejectListing, 
    collectorCredits, 
    collectorSpecializations, 
    setCollectorSpecializations,
    setIsRedeemModalOpen
  } = useApp();

  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [rejectingItem, setRejectingItem] = useState<WasteListing | null>(null);
  const [rejectReason, setRejectReason] = useState<string>(REJECTION_REASONS[0]);

  const [acceptingItem, setAcceptingItem] = useState<WasteListing | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<string>(DISPATCH_AGENTS[0]);
  const [timeWindow, setTimeWindow] = useState<string>('Today, 2:00 PM - 4:00 PM');

  const toggleSpecialization = (cat: WasteCategory) => {
    if (collectorSpecializations.includes(cat)) {
      if (collectorSpecializations.length > 1) {
        setCollectorSpecializations(collectorSpecializations.filter(c => c !== cat));
      }
    } else {
      setCollectorSpecializations([...collectorSpecializations, cat]);
    }
  };

  // Filter queue strictly according to collector specialization
  const incomingQueue = listings.filter(
    item => item.status === 'PENDING' && collectorSpecializations.includes(item.category)
  );

  const pastAccepted = listings.filter(
    item => item.status === 'ACCEPTED' && collectorSpecializations.includes(item.category)
  );

  const handleConfirmAccept = () => {
    if (!acceptingItem) return;
    acceptListing(acceptingItem.id, selectedAgent, timeWindow);
    setAcceptingItem(null);

    try {
      confetti({
        particleCount: 75,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#06B6D4', '#00F29D', '#10B981']
      });
    } catch (e) {}
  };

  const handleConfirmReject = () => {
    if (!rejectingItem) return;
    rejectListing(rejectingItem.id, rejectReason);
    setRejectingItem(null);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16 text-slate-900">
      
      {/* Collector Header & Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Collector Facility Badge */}
        <div className="md:col-span-2 p-5 rounded-3xl bg-gradient-to-br from-cyan-50 via-white to-teal-50 border border-cyan-200 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-100 border border-cyan-300 flex items-center justify-center text-cyan-800 shadow-sm">
              <Truck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-slate-900">EcoCollect Logistics Hub</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800 border border-cyan-300">
                  Verified Facility
                </span>
              </div>
              <p className="text-xs text-slate-600">License #CPH-COL-889 • Capacity: 12.5 MT/Day</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsRedeemModalOpen(true)}
            className="hidden sm:flex px-4 py-2 rounded-2xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-900 text-xs font-bold items-center gap-1.5 transition shadow-sm"
          >
            <Gift className="w-4 h-4 text-amber-700" /> Rewards
          </button>
        </div>

        {/* Metric: Collector Bonus Balance */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 uppercase font-semibold block">
              Collector Credits
            </span>
            <span className="text-xl font-black text-emerald-700 font-mono">
              {collectorCredits} <span className="text-xs font-normal text-slate-500">pts</span>
            </span>
          </div>
        </div>

        {/* Metric: Queue Count */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-700 border border-cyan-200 flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 uppercase font-semibold block">
              Matched In Queue
            </span>
            <span className="text-xl font-black text-slate-900 font-mono">
              {incomingQueue.length} <span className="text-xs font-normal text-cyan-600">requests</span>
            </span>
          </div>
        </div>
      </div>

      {/* Specialization Filter Multi-Select */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-2 text-cyan-800 font-bold text-xs uppercase tracking-wider">
          <Filter className="w-4 h-4 text-cyan-600" /> Designated Waste Handling Specializations:
        </div>
        <p className="text-xs text-slate-600 mb-4">
          Toggle waste categories your fleet and facility are currently equipped to haul and process:
        </p>

        <div className="flex flex-wrap gap-2">
          {ALL_CATEGORIES.map((cat) => {
            const isSelected = collectorSpecializations.includes(cat);
            return (
              <button
                key={cat}
                type="button"
                onClick={() => toggleSpecialization(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-cyan-600 text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5" />}
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Incoming User Requests Queue */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-semibold uppercase tracking-wider mb-1">
              <Truck className="w-3.5 h-3.5 text-cyan-600" /> Market Queue
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Incoming User Pickup Requests
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Review verified items, inspect photos, and assign dispatch drivers
            </p>
          </div>

          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-mono text-xs border border-slate-200">
            {incomingQueue.length} Pending
          </span>
        </div>

        {incomingQueue.length === 0 ? (
          <div className="p-10 rounded-2xl bg-slate-50 border border-slate-200 text-center text-slate-500 text-xs">
            No incoming collection requests matching your current active specialization filter. Try enabling more categories above!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {incomingQueue.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl bg-white border border-slate-200 p-4 flex flex-col justify-between hover:border-cyan-400 hover:shadow-sm transition group"
              >
                <div>
                  {/* Thumbnail with Lightbox trigger */}
                  <div className="relative w-full h-36 rounded-xl overflow-hidden mb-3.5 bg-slate-100 border border-slate-200">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setExpandedImage(item.imageUrl)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/90 backdrop-blur-md text-slate-700 hover:bg-white border border-slate-200 text-xs transition shadow-xs"
                      title="Expand photo lightbox"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-md bg-white/95 backdrop-blur-md text-emerald-800 text-[10px] font-bold font-mono border border-slate-200 shadow-xs">
                      +{item.calculatedCredits} pts
                    </span>
                  </div>

                  {/* Header info */}
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                    <span className="font-mono font-bold text-cyan-700">{item.transactionId}</span>
                    <span>{item.estimatedWeightKg} kg</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-1 line-clamp-1">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                    {item.description}
                  </p>

                  {/* Sender & Location */}
                  <div className="space-y-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-700 mb-4">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span className="font-semibold text-slate-900">{item.userName}</span>
                      <span className="text-slate-500">({item.userPhone})</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                      <span className="truncate">{item.senderLocation}</span>
                    </div>
                  </div>
                </div>

                {/* Actions: Tick / Cross */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setRejectingItem(item)}
                    className="py-2 rounded-xl bg-slate-100 hover:bg-rose-50 border border-slate-300 hover:border-rose-300 text-slate-700 hover:text-rose-800 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <X className="w-4 h-4 text-rose-600" /> Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => setAcceptingItem(item)}
                    className="py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:brightness-105 text-xs font-black flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition"
                  >
                    <Check className="w-4 h-4" /> Accept Pickup
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Accepted Hauls History */}
      {pastAccepted.length > 0 && (
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" /> Active Pickups in Transit
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pastAccepted.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                    <p className="text-[11px] text-emerald-800 font-semibold">
                      Assigned to: {item.assignedDeliveryAgent}
                    </p>
                    <p className="text-[10px] text-slate-500">{item.estimatedPickupTime}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold font-mono border border-emerald-300">
                  +{(item.calculatedCredits * 0.4 + 20).toFixed(0)} Collector Bonus
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {expandedImage && (
        <div 
          onClick={() => setExpandedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn"
        >
          <div className="relative max-w-4xl max-h-[85vh] rounded-3xl overflow-hidden border border-slate-700 shadow-2xl bg-white">
            <button
              type="button"
              onClick={() => setExpandedImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={expandedImage}
              alt="Expanded waste view"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}

      {/* Accept Pickup Assignment Modal */}
      {acceptingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 text-slate-900 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900 mb-1">
              Dispatch Pickup Vehicle
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Assign a licensed eco-courier and confirm the customer collection window.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assigned Delivery Agent:
                </label>
                <select
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                >
                  {DISPATCH_AGENTS.map((agent) => (
                    <option key={agent} value={agent}>{agent}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Estimated Pickup Time Slot:
                </label>
                <select
                  value={timeWindow}
                  onChange={(e) => setTimeWindow(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Today, 2:00 PM - 4:00 PM">Today, 2:00 PM - 4:00 PM</option>
                  <option value="Today, 4:30 PM - 6:30 PM">Today, 4:30 PM - 6:30 PM</option>
                  <option value="Tomorrow Morning, 9:00 AM - 11:30 AM">Tomorrow Morning, 9:00 AM - 11:30 AM</option>
                  <option value="Tomorrow Afternoon, 1:00 PM - 3:00 PM">Tomorrow Afternoon, 1:00 PM - 3:00 PM</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-xs">
                <span className="text-emerald-900 font-semibold block mb-1">Eco-Credit Distribution:</span>
                <div className="flex justify-between font-mono text-emerald-900 font-bold">
                  <span>User Earns: +{acceptingItem.calculatedCredits} pts</span>
                  <span>Collector Bonus: +{Math.round(acceptingItem.calculatedCredits * 0.4) + 20} pts</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setAcceptingItem(null)}
                className="px-4 py-2 rounded-xl text-xs text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAccept}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <Check className="w-4 h-4" /> Confirm &amp; Dispatch Fleet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-white border border-rose-200 rounded-3xl p-6 text-slate-900 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900 mb-1">
              Dismiss Collection Request
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Select reason for releasing item #{rejectingItem.transactionId} back to public exchange pool.
            </p>

            <div className="space-y-3 mb-6">
              {REJECTION_REASONS.map((reason) => (
                <label
                  key={reason}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-xs cursor-pointer transition ${
                    rejectReason === reason
                      ? 'bg-rose-50 border-rose-400 text-rose-900 font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="rejectReason"
                    checked={rejectReason === reason}
                    onChange={() => setRejectReason(reason)}
                    className="text-rose-600 focus:ring-0"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setRejectingItem(null)}
                className="px-4 py-2 rounded-xl text-xs text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <X className="w-4 h-4" /> Confirm Dismissal
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
