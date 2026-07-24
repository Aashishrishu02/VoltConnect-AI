import React, { useState } from 'react';
import { Leaf, DollarSign, Calculator, Zap, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Calculators: React.FC = () => {
  const { t } = useLanguage();
  const [monthlyKm, setMonthlyKm] = useState(1500);
  const [petrolPrice, setPetrolPrice] = useState(102); // ₹102/L
  const [evTariff, setEvTariff] = useState(9); // ₹9/kWh

  // EV Mileage assumption: 8 km / kWh
  // Petrol Mileage assumption: 15 km / L
  const petrolCostMonthly = Math.round((monthlyKm / 15) * petrolPrice);
  const evCostMonthly = Math.round((monthlyKm / 8) * evTariff);
  const monthlySavings = Math.max(0, petrolCostMonthly - evCostMonthly);
  const annualSavings = monthlySavings * 12;

  // CO2 savings: ~120g CO2 per km petrol vs ~35g CO2 grid EV in India -> 85g CO2 saved per km
  const monthlyCo2SavedKg = Math.round((monthlyKm * 0.085));
  const annualCo2SavedKg = monthlyCo2SavedKg * 12;
  const treesEquivalent = Math.round(annualCo2SavedKg / 20); // 1 tree absorbs ~20kg CO2/yr

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
      {/* Fuel Cost Savings Calculator */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-lg space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              {t('evCostCalculator')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Calculate your monthly savings vs Petrol</p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <div className="flex justify-between mb-1">
              <span className="font-semibold text-slate-400">Monthly Driving Distance</span>
              <span className="font-bold text-emerald-400">{monthlyKm} km / month</span>
            </div>
            <input
              type="range"
              min="300"
              max="5000"
              step="100"
              value={monthlyKm}
              onChange={(e) => setMonthlyKm(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Monthly Petrol Cost</span>
              <div className="text-lg font-extrabold text-rose-400 mt-1">₹{petrolCostMonthly.toLocaleString('en-IN')}</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Monthly EV Cost</span>
              <div className="text-lg font-extrabold text-emerald-400 mt-1">₹{evCostMonthly.toLocaleString('en-IN')}</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase">Annual Net Savings</span>
              <div className="text-2xl font-extrabold">₹{annualSavings.toLocaleString('en-IN')} / year</div>
            </div>
            <Zap className="w-8 h-8 fill-emerald-400" />
          </div>
        </div>
      </div>

      {/* Carbon Emission Offset Calculator */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-lg space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              {t('carbonSavings')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Environmental impact offset tracker</p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-300">
              <span className="text-[11px] font-semibold uppercase text-teal-400">Annual CO₂ Saved</span>
              <div className="text-2xl font-extrabold text-white mt-1">{annualCo2SavedKg} kg</div>
              <span className="text-[10px] text-teal-400 font-medium">CO₂ prevented from entering atmosphere</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
              <span className="text-[11px] font-semibold uppercase text-emerald-400">Tree Equivalent</span>
              <div className="text-2xl font-extrabold text-white mt-1">🌳 {treesEquivalent} Trees</div>
              <span className="text-[10px] text-emerald-400 font-medium">Equal to planting trees annually</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-xs">
            💡 Driving your Tata Nexon EV or MG ZS EV on <strong>ChargeMitra</strong> chargers offsets ~1.2 tons of greenhouse gases every year compared to a petrol car!
          </div>
        </div>
      </div>
    </div>
  );
};
