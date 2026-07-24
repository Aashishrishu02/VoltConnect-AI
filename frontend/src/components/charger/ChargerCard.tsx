import React from 'react';
import { Charger } from '../../types';
import { Zap, Star, MapPin, Sparkles } from 'lucide-react';

interface ChargerCardProps {
  charger: Charger;
  onSelect: (charger: Charger) => void;
  onBookNow: (charger: Charger) => void;
}

export const ChargerCard: React.FC<ChargerCardProps> = ({ charger, onSelect, onBookNow }) => {
  const isFast = charger.chargerType === 'DC_FAST' || charger.chargerType === 'SUPERCHARGER';

  return (
    <div
      onClick={() => onSelect(charger)}
      className="group cursor-pointer rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all duration-200 flex flex-col justify-between"
    >
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        <img
          src={charger.images?.[0] || charger.photos?.[0] || 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop'}
          alt={charger.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {charger.aiScore && (
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-md border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-1.5 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 fill-emerald-400" />
            <span>AI Score: {charger.aiScore}%</span>
          </div>
        )}

        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-extrabold uppercase text-white shadow-md ${
          isFast ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-blue-600'
        }`}>
          {charger.powerKw} kW
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
              {charger.connectorType.replace(/_/g, ' ')}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{charger.averageRating.toFixed(1)}</span>
              <span className="text-xs text-slate-400 font-normal">({charger.totalReviews})</span>
            </div>
          </div>

          <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-500 transition-colors">
            {charger.title}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="line-clamp-1">{charger.address}, {charger.city}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
          <div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white">
              ₹{charger.pricePerHour.toFixed(0)}
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400"> / hr</span>
            </div>
            {charger.distanceKm && (
              <span className="text-[11px] font-medium text-emerald-500">
                {charger.distanceKm} km away
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookNow(charger);
            }}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};
