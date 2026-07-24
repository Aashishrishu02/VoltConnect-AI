import React from 'react';
import { Search } from 'lucide-react';

interface ChargerFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedType: string;
  setSelectedType: (val: string) => void;
  selectedConnector: string;
  setSelectedConnector: (val: string) => void;
  maxPrice: number;
  setMaxPrice: (val: number) => void;
  onlyAvailable: boolean;
  setOnlyAvailable: (val: boolean) => void;
}

export const ChargerFilters: React.FC<ChargerFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  selectedConnector,
  setSelectedConnector,
  maxPrice,
  setMaxPrice,
  onlyAvailable,
  setOnlyAvailable,
}) => {
  return (
    <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 shadow-sm mb-6 space-y-4">
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Indian cities (e.g. Bengaluru, Mumbai, Gurugram, Hyderabad, Pune, Delhi)..."
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
        />
      </div>

      {/* Filter Options Row */}
      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-700/50 text-xs">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">All Charger Types</option>
          <option value="LEVEL_2">Level 2 AC (7kW - 22kW)</option>
          <option value="DC_FAST">DC Fast Charger (30kW - 120kW)</option>
          <option value="SUPERCHARGER">Supercharger (150kW+)</option>
        </select>

        <select
          value={selectedConnector}
          onChange={(e) => setSelectedConnector(e.target.value)}
          className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">All Plug Plugs</option>
          <option value="CCS_2">CCS Combo 2 (Tata / MG / BYD)</option>
          <option value="TYPE_2_MENNEKES">Type 2 Mennekes (AC)</option>
          <option value="TESLA_NACS">Tesla NACS</option>
        </select>

        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Max: ₹{maxPrice}/h</span>
          <input
            type="range"
            min="40"
            max="300"
            step="10"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-24 accent-emerald-500 cursor-pointer"
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer bg-slate-100 dark:bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-medium text-slate-700 dark:text-slate-200">
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={(e) => setOnlyAvailable(e.target.checked)}
            className="accent-emerald-500 rounded cursor-pointer"
          />
          Live Available Only
        </label>
      </div>
    </div>
  );
};
