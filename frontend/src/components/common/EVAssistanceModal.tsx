import React, { useState } from 'react';
import { Wrench, Car, AlertTriangle, PhoneCall, CheckCircle2, X } from 'lucide-react';

export const EVAssistanceModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [selectedService, setSelectedService] = useState('TOWING');
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState(false);

  if (!isOpen) return null;

  const handleRequestService = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRequested(true);
    }, 1200);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-white space-y-5 my-auto flex flex-col max-h-[85vh] overflow-hidden"
      >
        {/* Pinned Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">VoltConnect Highway Assistance</h3>
              <p className="text-xs text-slate-400">On-demand towing, battery boost & mechanic assist</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close Assistance"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto py-1 space-y-4 text-xs">
          {!requested ? (
            <div className="space-y-4">
              <label className="block font-bold text-slate-300">Select Emergency Roadside Service:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'TOWING', label: '🚛 Flatbed Towing' },
                  { id: 'PORTABLE_CHARGER', label: '⚡ Mobile Battery Boost' },
                  { id: 'FLAT_TYRE', label: '🛞 Flat Tyre Assist' },
                  { id: 'MECHANIC', label: '🛠️ On-Site Mechanic' },
                ].map((srv) => (
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() => setSelectedService(srv.id)}
                    className={`p-3.5 rounded-2xl font-bold border transition-all text-left flex items-center justify-between ${
                      selectedService === srv.id
                        ? 'bg-cyan-500 text-white border-cyan-500 shadow-md'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <span>{srv.label}</span>
                    {selectedService === srv.id && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleRequestService}
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-slate-950 font-extrabold text-xs shadow-lg transition-all"
              >
                {loading ? 'Dispatching Nearest Partner...' : 'Dispatch Emergency Highway Unit'}
              </button>
            </div>
          ) : (
            <div className="space-y-4 text-center py-4 text-xs">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-extrabold text-base text-emerald-400">Assistance Partner Dispatched!</h4>
              <p className="text-slate-300">
                Verified service vehicle is en route to your GPS location (ETA: 18 minutes).
              </p>
              <a
                href="tel:+911800123VOLT"
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-2xl bg-emerald-500 text-white font-extrabold text-xs shadow-md"
              >
                <PhoneCall className="w-4 h-4" /> Call Response Team (1800-123-VOLT)
              </a>
            </div>
          )}
        </div>

        {/* Footer Close Controls */}
        <div className="pt-3 border-t border-slate-800 shrink-0 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
