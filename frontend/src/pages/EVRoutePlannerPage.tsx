import React, { useState } from 'react';
import { Navigation, BatteryCharging, Zap, MapPin, CheckCircle2 } from 'lucide-react';
import { EVRoutePlan } from '../types';
import api from '../services/api';

export const EVRoutePlannerPage: React.FC = () => {
  const [vehicleModel, setVehicleModel] = useState('Tata Nexon EV Max (437 km)');
  const [batteryPercent, setBatteryPercent] = useState(35);
  const [startCity, setStartCity] = useState('Bengaluru, Karnataka');
  const [destCity, setDestCity] = useState('Mysuru, Karnataka');
  const [loading, setLoading] = useState(false);
  const [routePlan, setRoutePlan] = useState<EVRoutePlan | null>(null);

  const handlePlanRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/ai/route-plan', {
        startLat: 12.9716,
        startLng: 77.5946,
        destLat: 12.2958,
        destLng: 76.6394,
        batteryPercent,
        maxRangeKm: 350,
      });

      setRoutePlan(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-bold uppercase">
          <Navigation className="w-4 h-4" /> 🇮🇳 India EV Highway Route Optimizer
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Smart Indian EV Route Planner</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Plan highway road trips across Indian expressways (e.g. Bengaluru-Mysuru, Mumbai-Pune Expressway, Delhi-Jaipur). Our AI calculates battery range & CCS2 fast charger stops.
        </p>
      </div>

      <form
        onSubmit={handlePlanRoute}
        className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-xl space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-2">
              Start Origin Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3 w-5 h-5 text-emerald-500" />
              <input
                type="text"
                value={startCity}
                onChange={(e) => setStartCity(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-2">
              Destination City
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3 w-5 h-5 text-cyan-400" />
              <input
                type="text"
                value={destCity}
                onChange={(e) => setDestCity(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-700/60">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-2">
              Indian EV Model Preset
            </label>
            <select
              value={vehicleModel}
              onChange={(e) => setVehicleModel(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white"
            >
              <option>Tata Nexon EV Max / Prime (437 km)</option>
              <option>Tata Punch EV / Tiago EV (315 km)</option>
              <option>MG ZS EV Long Range (461 km)</option>
              <option>Hyundai Ioniq 5 (631 km ARAI)</option>
              <option>BYD Atto 3 / Seal (521 km)</option>
              <option>Mahindra XUV400 EV (456 km)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                Initial Battery State of Charge (SOC)
              </label>
              <span className="text-sm font-extrabold text-emerald-500">{batteryPercent}%</span>
            </div>
            <div className="flex items-center gap-3">
              <BatteryCharging className="w-5 h-5 text-emerald-500" />
              <input
                type="range"
                min="10"
                max="100"
                value={batteryPercent}
                onChange={(e) => setBatteryPercent(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-extrabold text-sm shadow-xl shadow-teal-500/25 transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Navigation className="w-4 h-4" />
              Calculate AI Route & Charging Stops
            </>
          )}
        </button>
      </form>

      {routePlan && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white space-y-6 shadow-2xl animate-in fade-in duration-300">
          <h3 className="font-extrabold text-xl text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6" /> AI Highway Route Summary
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
            <div>
              <div className="text-2xl font-extrabold text-white">{routePlan.totalDistanceKm} km</div>
              <div className="text-xs text-slate-400">Total Distance</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-teal-400">{routePlan.estimatedTripMin} min</div>
              <div className="text-xs text-slate-400">Est. Trip Time</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-cyan-400">{routePlan.stopsNeeded} Stop(s)</div>
              <div className="text-xs text-slate-400">Charging Needed</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-emerald-400">{routePlan.arrivalBattery}%</div>
              <div className="text-xs text-slate-400">Arrival Battery SOC</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
