import React, { useState } from 'react';
import { Award, Leaf, Gift, CheckCircle2, Zap, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const GreenRewards: React.FC = () => {
  const { user } = useAuth();
  const [points, setPoints] = useState(user?.greenPoints || 250);
  const [redeemedCode, setRedeemedCode] = useState<string | null>(null);

  const handleRedeem = (cost: number, code: string) => {
    if (points < cost) {
      alert('Insufficient Green Points to redeem this reward!');
      return;
    }
    setPoints((prev: number) => prev - cost);
    setRedeemedCode(code);
    alert(`🎉 Congratulations! Code ${code} redeemed successfully!`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
      {/* Green Rewards Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">VoltConnect Green Rewards</h3>
              <p className="text-xs text-slate-400">Earn points for charging & hosting</p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-extrabold text-amber-400">🏆 {points} Pts</div>
            <span className="text-[10px] text-slate-400">Available to Redeem</span>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700/60 flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-white">₹100 Off Charging Coupon</div>
              <p className="text-[11px] text-slate-400">Redeem 100 Green Points</p>
            </div>
            <button
              onClick={() => handleRedeem(100, 'GREEN100')}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs transition-colors"
            >
              Redeem
            </button>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700/60 flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-white">Free 1-Hour Fast Charging Session</div>
              <p className="text-[11px] text-slate-400">Redeem 200 Green Points</p>
            </div>
            <button
              onClick={() => handleRedeem(200, 'FREECHARGING')}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs transition-colors"
            >
              Redeem
            </button>
          </div>
        </div>

        {redeemedCode && (
          <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono font-bold text-xs flex items-center justify-between">
            <span>Redeemed Coupon Code: <strong>{redeemedCode}</strong></span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Carbon Savings & Trees Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-white">Carbon Savings & Impact</h3>
            <p className="text-xs text-slate-400">Environmental footprint offset tracker</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-300">
            <span className="text-[10px] font-bold uppercase text-teal-400">CO₂ Offsetting</span>
            <div className="text-2xl font-extrabold text-white mt-1">1,275 kg</div>
            <span className="text-[10px] text-teal-400">GHG emissions prevented</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
            <span className="text-[10px] font-bold uppercase text-emerald-400">Tree Equivalent</span>
            <div className="text-2xl font-extrabold text-white mt-1">🌳 64 Trees</div>
            <span className="text-[10px] text-emerald-400">Annual absorption equal</span>
          </div>
        </div>
      </div>
    </div>
  );
};
