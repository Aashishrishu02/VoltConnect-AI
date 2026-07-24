import React from 'react';
import { Zap, ShieldCheck, Heart, Github, Twitter, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                <Zap className="w-5 h-5 fill-white" />
              </div>
              <span className="font-extrabold text-lg text-slate-900 dark:text-white">ChargeShare</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              The premier AI-powered Peer-to-Peer EV charger sharing network empowering drivers and home charger hosts worldwide.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider mb-4">Drivers</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><a href="/explore" className="hover:text-emerald-500 transition-colors">Search Chargers</a></li>
              <li><a href="/route-planner" className="hover:text-emerald-500 transition-colors">AI Route Planner</a></li>
              <li><a href="/wallet" className="hover:text-emerald-500 transition-colors">ChargeShare Wallet</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider mb-4">Hosts</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><a href="/host-dashboard" className="hover:text-emerald-500 transition-colors">List Your Charger</a></li>
              <li><a href="/host-dashboard" className="hover:text-emerald-500 transition-colors">Host Earnings</a></li>
              <li><a href="/host-dashboard" className="hover:text-emerald-500 transition-colors">Dynamic Pricing Engine</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider mb-4">Security & AI</h4>
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2 text-emerald-500 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                End-to-End SSL & Fraud Protection
              </div>
              <p className="text-xs">Powered by Python FastAPI Scikit-Learn ML Microservice.</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© 2026 ChargeShare Network Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for clean mobility</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
