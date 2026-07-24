import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, MapPin, Navigation, ShieldCheck, Award, Leaf, Cpu, BatteryCharging, Wrench, Sparkles, ArrowRight, Star, Heart, CheckCircle2 } from 'lucide-react';
import { Calculators } from '../components/common/Calculators';
import { GreenRewards } from '../components/common/GreenRewards';
import { useLanguage } from '../context/LanguageContext';

export const HomePage: React.FC<{ onOpenAuth: () => void }> = ({ onOpenAuth }) => {
  const { t } = useLanguage();
  const [searchCity, setSearchCity] = React.useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCity.trim()) {
      navigate(`/explore?city=${encodeURIComponent(searchCity.trim())}`);
    } else {
      navigate('/explore');
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Super App Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-teal-500/5 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold shadow-inner">
            <Sparkles className="w-4 h-4 fill-emerald-400 animate-pulse" />
            <span>VoltConnect AI — India's AI EV Mobility Super App</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none max-w-4xl mx-auto">
            Charge Anywhere in India. <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Monetize Your Home & Business EV Charger.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-medium">
            AI-powered P2P charging marketplace, smart route optimizer, virtual queue management, emergency highway assistance & green rewards for EV drivers across India.
          </p>

          {/* Interactive Search Bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto pt-2">
            <div className="flex flex-col sm:flex-row items-center gap-2 p-2 rounded-3xl bg-slate-800/90 border border-slate-700 shadow-2xl backdrop-blur-md">
              <div className="flex items-center gap-3 px-4 py-2 flex-1 w-full">
                <MapPin className="w-5 h-5 text-emerald-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Enter City or Station Name (e.g. Bengaluru, Mumbai, Gurugram)..."
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full bg-transparent text-sm text-white placeholder-slate-400 outline-none font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2 shrink-0"
              >
                <MapPin className="w-4 h-4" /> Find EV Chargers
              </button>
            </div>
          </form>

          {/* Quick CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/explore"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-extrabold text-sm shadow-xl shadow-emerald-500/25 flex items-center gap-2 transition-all hover:scale-105"
            >
              <MapPin className="w-5 h-5" /> Find Nearby Chargers
            </Link>

            <Link
              to="/route-planner"
              className="px-8 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-sm border border-slate-700 flex items-center gap-2 transition-all hover:scale-105"
            >
              <Navigation className="w-5 h-5 text-teal-400" /> AI Trip Planner
            </Link>

            <Link
              to="/become-host"
              className="px-8 py-4 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-extrabold text-sm border border-emerald-500/40 flex items-center gap-2 transition-all"
            >
              <Zap className="w-5 h-5" /> Become a Charger Host
            </Link>
          </div>

          {/* Stats Counters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10 border-t border-slate-800/80">
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800">
              <div className="text-2xl font-black text-emerald-400">12,500+</div>
              <span className="text-xs text-slate-400">Active EV Chargers</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800">
              <div className="text-2xl font-black text-teal-400">99.8%</div>
              <span className="text-xs text-slate-400">Network Uptime</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800">
              <div className="text-2xl font-black text-cyan-400">4.9 ★</div>
              <span className="text-xs text-slate-400">Verified Driver Rating</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800">
              <div className="text-2xl font-black text-emerald-400">₹85L+</div>
              <span className="text-xs text-slate-400">Host Earnings Paid</span>
            </div>
          </div>
        </div>
      </section>

      {/* VoltConnect AI Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold text-emerald-500 uppercase tracking-wider">SUPER APP MODULES</span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Built for India's Electric Mobility Revolution</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            From smart P2P charging to AI trip planners, roadside assistance & carbon rewards — VoltConnect AI solves EV range anxiety nationwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/60 shadow-lg space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Smart Charger Recommendation AI</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Battery-aware MCDA scoring engine analyzing vehicle SOC, distance, price, power kW & live traffic to pick your best charging station.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/60 shadow-lg space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-500 flex items-center justify-center">
              <BatteryCharging className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Smart Virtual Queue & Live Status</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Join virtual queue slots when chargers are busy. Live Socket.IO updates notify you when your station becomes free.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/60 shadow-lg space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-500 flex items-center justify-center">
              <Wrench className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">EV Highway Emergency Assistance</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Flatbed towing, mobile portable charger battery boost, mechanic dispatch & flat tyre assist available 24/7 across highways.
            </p>
          </div>
        </div>
      </section>

      {/* Green Rewards & Carbon Impact Module */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GreenRewards />
      </section>

      {/* Fuel Savings & Carbon Calculator */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Calculators />
      </section>
    </div>
  );
};
