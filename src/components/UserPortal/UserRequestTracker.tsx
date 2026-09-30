'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  Calendar, 
  MapPin, 
  Leaf, 
  Layers, 
  AlertCircle 
} from 'lucide-react';

export const UserRequestTracker: React.FC = () => {
  const { listings } = useApp();

  return (
    <div className="w-full bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-sm text-slate-900">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-semibold uppercase tracking-wider mb-1">
            <Clock className="w-3.5 h-3.5 text-cyan-600" /> Live Dispatch Tracker
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Your Waste Collection Requests
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Real-time status of items dispatched to authorized circular economy collectors
          </p>
        </div>
      </div>

      {listings.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 text-xs">
          No recycling dispatch requests logged yet. Use the AI Waste Scanner above to scan and sell your first item!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {listings.map((item) => {
            const isPending = item.status === 'PENDING';
            const isAccepted = item.status === 'ACCEPTED';
            const isRejected = item.status === 'REJECTED';

            return (
              <div
                key={item.id}
                className={`rounded-2xl p-4 sm:p-5 border transition-all flex flex-col justify-between ${
                  isAccepted
                    ? 'bg-emerald-50/50 border-emerald-300 shadow-xs'
                    : isPending
                    ? 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                    : 'bg-rose-50/50 border-rose-200'
                }`}
              >
                <div>
                  {/* Top Transaction ID & Status Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                      {item.transactionId}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border flex items-center gap-1 ${
                        isAccepted
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : isPending
                          ? 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
                          : 'bg-rose-100 text-rose-800 border-rose-300'
                      }`}
                    >
                      {isAccepted && <CheckCircle2 className="w-3 h-3" />}
                      {isPending && <Clock className="w-3 h-3" />}
                      {isRejected && <XCircle className="w-3 h-3" />}
                      {item.status}
                    </span>
                  </div>

                  {/* Thumbnail & Product Info */}
                  <div className="flex items-start gap-3.5 mb-3">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-slate-200 shrink-0 shadow-xs"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                          {item.category}
                        </span>
                        <span className="text-slate-300 text-xs">•</span>
                        <span className="text-[10px] text-slate-500">
                          {item.estimatedWeightKg} kg
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate mb-1">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-600 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-600 mb-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <MapPin className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                    <span className="truncate">{item.senderLocation}</span>
                  </div>
                </div>

                {/* Accepted Details Ribbon */}
                {isAccepted && item.assignedDeliveryAgent && (
                  <div className="p-3 rounded-xl bg-emerald-100/70 border border-emerald-300 mt-2 text-xs">
                    <div className="flex items-center gap-2 text-emerald-900 font-bold mb-1">
                      <Truck className="w-4 h-4 text-emerald-700" /> Agent Assigned for Collection:
                    </div>
                    <p className="text-slate-900 font-semibold">
                      {item.assignedDeliveryAgent}
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 mt-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Estimated Window: {item.estimatedPickupTime || 'Today, 3:00 PM - 5:00 PM'}</span>
                    </div>
                  </div>
                )}

                {/* Rejection Note */}
                {isRejected && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-300 mt-2 text-xs text-rose-800">
                    <AlertCircle className="w-3.5 h-3.5 inline mr-1 text-rose-600" />
                    Reason: {item.rejectionReason || 'Item does not meet processing standards'}
                  </div>
                )}

                {/* Reward Value Footer */}
                <div className="pt-3 border-t border-slate-200 flex items-center justify-between mt-3 text-xs">
                  <span className="text-slate-600 flex items-center gap-1">
                    <Leaf className="w-3.5 h-3.5 text-emerald-600" /> Reward Value:
                  </span>
                  <span className="font-mono font-bold text-emerald-700">
                    +{item.calculatedCredits} Credits
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
