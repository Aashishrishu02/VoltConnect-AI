import React from 'react';
import { Charger } from '../../types';
import { X, MapPin, Zap, Star, ShieldCheck, Navigation, Phone, Clock, Coffee, Wifi, Shield, CheckCircle2, ChevronRight } from 'lucide-react';

interface ChargerDetailsModalProps {
  charger: Charger;
  nearbyChargers?: Charger[];
  onClose: () => void;
  onBookNow: (charger: Charger) => void;
  onSelectNearby?: (charger: Charger) => void;
}

export const ChargerDetailsModal: React.FC<ChargerDetailsModalProps> = ({
  charger,
  nearbyChargers = [],
  onClose,
  onBookNow,
  onSelectNearby,
}) => {
  const isFast = charger.chargerType === 'DC_FAST' || charger.chargerType === 'SUPERCHARGER';
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${charger.latitude},${charger.longitude}`;

  const hostName = charger.host?.name || charger.owner?.name || 'Verified Host';
  const hostPhone = charger.host?.phone || '+919811122233';

  // Filter nearby stations in same city
  const otherNearby = nearbyChargers.filter((c) => c.id !== charger.id).slice(0, 3);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full my-8 overflow-hidden shadow-2xl relative text-slate-900 dark:text-white space-y-0">
        
        {/* Top Header Controls */}
        <div className="relative h-64 w-full bg-slate-950">
          <img
            src={charger.images?.[0] || charger.photos?.[0] || 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop'}
            alt={charger.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/80 text-white backdrop-blur-md border border-slate-700 flex items-center justify-center hover:bg-slate-800 transition-colors shadow-lg"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase text-white ${
                  isFast ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-blue-600'
                }`}>
                  ⚡ {charger.powerKw} kW {charger.chargerType.replace('_', ' ')}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800/90 text-emerald-400 border border-emerald-500/30">
                  {charger.connectorType.replace('_', ' ')}
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-white leading-snug line-clamp-1">{charger.title}</h2>
              <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                {charger.address}, {charger.city}, {charger.state}
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-2xl font-black text-emerald-400">₹{charger.pricePerHour}</span>
              <span className="text-[10px] text-slate-300 block">/ hour</span>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Host & Directions Header Bar */}
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 font-extrabold flex items-center justify-center text-base uppercase">
                {hostName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{hostName}</h4>
                  <ShieldCheck className="w-4 h-4 text-emerald-500 fill-emerald-500/20" />
                  <span className="text-[10px] font-bold text-emerald-500 uppercase">Verified Host</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Contact: {hostPhone}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href={`tel:${hostPhone}`}
                className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-500 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5" /> Call Host
              </a>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md hover:bg-emerald-600 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" /> Get Directions
              </a>
            </div>
          </div>

          {/* Description & Overview */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Station Description</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {charger.description || 'P2P EV Fast Charger station hosted on VoltConnect AI network with 24/7 gated security and ultra-fast charging capabilities.'}
            </p>
          </div>

          {/* Amenities Badges */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Station Amenities</h4>
            <div className="flex flex-wrap gap-2">
              {(charger.amenities && charger.amenities.length > 0 ? charger.amenities : ['WiFi', 'CCTV Security', '24/7 Access', 'Covered Parking', 'Restroom']).map((am) => (
                <span
                  key={am}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {am}
                </span>
              ))}
            </div>
          </div>

          {/* Nearby Registered Host Chargers */}
          {otherNearby.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Other Nearby Host Chargers in {charger.city}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {otherNearby.map((nb) => (
                  <div
                    key={nb.id}
                    onClick={() => onSelectNearby?.(nb)}
                    className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <h5 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">{nb.title}</h5>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">⚡ {nb.powerKw} kW • ₹{nb.pricePerHour}/h</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-emerald-500" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom CTA Action Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Price Rate</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-emerald-500">₹{charger.pricePerHour}</span>
              <span className="text-xs text-slate-400">/ hr</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onBookNow(charger);
            }}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-extrabold text-xs shadow-xl shadow-emerald-500/25 flex items-center gap-2 transition-all"
          >
            <Zap className="w-4 h-4 fill-white" />
            Reserve Charging Slot Now
          </button>
        </div>

      </div>
    </div>
  );
};
