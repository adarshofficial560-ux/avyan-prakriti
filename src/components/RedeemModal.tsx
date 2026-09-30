'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { RewardCard } from '@/types';
import { 
  X, 
  Gift, 
  Coins, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const RedeemModal: React.FC = () => {
  const { 
    isRedeemModalOpen, 
    setIsRedeemModalOpen, 
    rewards, 
    userCredits, 
    redeemReward
  } = useApp();

  const [redeemedCode, setRedeemedCode] = useState<{ [key: string]: string }>({});
  const [feedback, setFeedback] = useState<{ msg: string; error?: boolean } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isRedeemModalOpen) return null;

  const handleClaim = (reward: RewardCard) => {
    const res = redeemReward(reward.id);
    if (res.success && res.voucher) {
      setRedeemedCode(prev => ({ ...prev, [reward.id]: res.voucher! }));
      setFeedback({ msg: res.message, error: false });
      
      // Trigger festive eco confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00F29D', '#06B6D4', '#F59E0B', '#10B981']
        });
      } catch (e) {}
    } else {
      setFeedback({ msg: res.message, error: true });
    }
  };

  const copyVoucher = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-3xl p-6 sm:p-8 border shadow-2xl max-h-[90vh] overflow-y-auto transition-colors bg-white border-amber-200 text-slate-900">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            setIsRedeemModalOpen(false);
            setFeedback(null);
          }}
          className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center transition bg-slate-100 text-slate-500 hover:text-slate-900"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center shadow-xs">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Green Credit Rewards Bazaar
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                Instant Exchange
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600">
              Exchange your verified recycling credits for vouchers from top global brands
            </p>
          </div>
        </div>

        {/* User Current Balance Ribbon */}
        <div className="my-4 p-3.5 rounded-2xl border flex items-center justify-between bg-emerald-50/60 border-emerald-200">
          <span className="text-xs font-medium flex items-center gap-1.5 text-slate-700">
            <Coins className="w-4 h-4 text-emerald-600" /> Available Green Balance:
          </span>
          <span className="text-lg font-black text-emerald-700 font-mono">
            {userCredits} <span className="text-xs font-normal opacity-70">Credits</span>
          </span>
        </div>

        {/* Status Feedback */}
        {feedback && (
          <div className={`p-3 rounded-xl mb-4 text-xs flex items-center gap-2 border ${
            feedback.error 
              ? 'bg-rose-50 border-rose-300 text-rose-800' 
              : 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
          }`}>
            {feedback.error ? <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" /> : <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />}
            {feedback.msg}
          </div>
        )}

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {rewards.map((reward) => {
            const hasClaimed = !!redeemedCode[reward.id];
            const canAfford = userCredits >= reward.creditsRequired;

            return (
              <div
                key={reward.id}
                className={`rounded-2xl p-4 border transition-all flex flex-col justify-between ${
                  hasClaimed
                    ? 'bg-emerald-50 border-emerald-300'
                    : 'bg-slate-50 border-slate-200 hover:border-amber-300 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <img
                      src={reward.imageUrl}
                      alt={reward.title}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-xs"
                    />
                    <div className="text-right">
                      <span className="inline-block px-2.5 py-1 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold font-mono">
                        {reward.creditsRequired} Credits
                      </span>
                      <p className="text-[11px] font-bold text-emerald-700 mt-1">
                        {reward.discountAmount}
                      </p>
                    </div>
                  </div>

                  <h3 className="font-bold text-sm mb-1 text-slate-900">{reward.title}</h3>
                  <p className="text-xs leading-relaxed mb-4 text-slate-600">
                    {reward.description}
                  </p>
                </div>

                {hasClaimed ? (
                  <div className="p-3 rounded-xl border bg-white border-emerald-300">
                    <div className="text-[10px] uppercase tracking-wider font-semibold mb-1 text-slate-500">
                      Your Voucher Code:
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <code className="text-xs font-mono font-bold text-emerald-700 select-all">
                        {redeemedCode[reward.id]}
                      </code>
                      <button
                        type="button"
                        onClick={() => copyVoucher(reward.id, redeemedCode[reward.id])}
                        className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 text-[11px] font-medium flex items-center gap-1 transition"
                      >
                        {copiedId === reward.id ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copiedId === reward.id ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleClaim(reward)}
                    disabled={!canAfford}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                      canAfford
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:brightness-105 shadow-xs active:scale-95'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200'
                    }`}
                  >
                    <Gift className="w-3.5 h-3.5" />
                    {canAfford ? 'Redeem Voucher' : `Needs ${reward.creditsRequired - userCredits} More Credits`}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-6 pt-4 border-t text-center text-[11px] border-slate-200 text-slate-400">
          * Vouchers are instantly generated via verified green smart contract ledger. No expiration date.
        </div>
      </div>
    </div>
  );
};
