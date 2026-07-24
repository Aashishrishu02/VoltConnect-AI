import React, { useState, useEffect } from 'react';
import { AlertTriangle, PhoneCall, Navigation, X } from 'lucide-react';
import api from '../../services/api';
import { Charger } from '../../types';

export const SOSModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [nearestChargers, setNearestChargers] = useState<Charger[]>([]);

  // Add Escape key listener to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleFindSOSChargers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/chargers/search', {
        params: { isAvailable: 'true', maxPrice: 300 },
      });
      setNearestChargers(res.data.slice(0, 2));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Outer Backdrop - Clicking outside closes modal
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* Inner Card Container - Stop propagation so clicking inside won't trigger backdrop close */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border border-rose-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-white space-y-5"
      >
        {/* Top Right Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Close (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* SOS Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/40 animate-pulse">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-extrabold text-xl text-rose-400">Emergency SOS Assistance</h3>
            <p className="text-xs text-slate-400">Low battery emergency nearby charger locator</p>
          </div>
        </div>

        {nearestChargers.length === 0 ? (
          <div className="space-y-4">
            <p className="text-xs text-slate-300">
              Low battery alert? Click below to immediately scan for 24/7 high-speed emergency chargers in your current radius with host phone contact.
            </p>
            <button
              onClick={handleFindSOSChargers}
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm shadow-xl shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Scanning Nearby Stations...' : 'Find Nearest Emergency Fast Charger'}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase text-emerald-400">Nearest Active 24/7 Stations Found</h4>

            {nearestChargers.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-bold text-sm text-white">{c.title}</h5>
                    <p className="text-xs text-slate-400">{c.address}, {c.city}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    {c.powerKw} kW DC Fast
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-700/60">
                  <a
                    href={`tel:${c.host?.phone || '+919876543210'}`}
                    className="flex-1 py-2 rounded-xl bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-emerald-600 transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" /> Call Host
                  </a>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${c.latitude},${c.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 rounded-xl bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-teal-600 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" /> Navigate
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer & Dismiss Action */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
          <span className="text-[11px] text-slate-400">24x7 Helpline: 1800-123-CHARGE</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
