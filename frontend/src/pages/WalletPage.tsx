import React, { useEffect, useState } from 'react';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, CreditCard, DollarSign, PlusCircle, History } from 'lucide-react';
import { Wallet, Transaction } from '../types';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const WalletPage: React.FC = () => {
  const { user, updateUserWallet } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [topUpAmount, setTopUpAmount] = useState('50');
  const [loading, setLoading] = useState(false);
  const [showTopUp, setShowTopUp] = useState(false);

  const fetchWallet = async () => {
    try {
      const res = await api.get('/wallet/me');
      setWallet(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/wallet/top-up', { amount: parseFloat(topUpAmount) });
      updateUserWallet(res.data.balance);
      setShowTopUp(false);
      fetchWallet();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Wallet Balance Hero Box */}
      <div className="p-8 rounded-3xl bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 text-white shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <WalletIcon className="w-4 h-4" /> ChargeShare Digital Wallet
          </div>
          <div className="text-4xl sm:text-5xl font-extrabold text-white">
            ₹{user?.wallet?.balance?.toFixed(0) || wallet?.balance?.toFixed(0) || '0'}
            <span className="text-sm text-slate-400 font-normal ml-2">INR</span>
          </div>
          <p className="text-xs text-slate-400 font-medium">Instant UPI, Razorpay & Wallet payment enabled</p>
        </div>

        <button
          onClick={() => setShowTopUp(true)}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-sm shadow-xl shadow-emerald-500/25 transition-all flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          Top Up Balance
        </button>
      </div>

      {/* Transaction History Log */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
          <History className="w-5 h-5 text-emerald-500" /> Transaction History
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
          {wallet?.transactions?.length === 0 ? (
            <p className="text-xs text-slate-500 py-4">No transactions recorded yet.</p>
          ) : (
            wallet?.transactions?.map((t) => (
              <div key={t.id} className="py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    t.type === 'DEPOSIT' || t.type === 'EARNING' || t.type === 'REFUND'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {t.type === 'DEPOSIT' || t.type === 'EARNING' || t.type === 'REFUND' ? (
                      <ArrowDownLeft className="w-5 h-5" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-slate-900 dark:text-white">{t.description}</h5>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      {new Date(t.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className={`font-extrabold text-sm ${
                  t.type === 'DEPOSIT' || t.type === 'EARNING' || t.type === 'REFUND'
                    ? 'text-emerald-500'
                    : 'text-rose-500'
                }`}>
                  {t.type === 'DEPOSIT' || t.type === 'EARNING' || t.type === 'REFUND' ? '+' : '-'}${t.amount.toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Top-up Modal */}
      {showTopUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-4">Top Up Wallet</h3>
            <form onSubmit={handleTopUp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Select Amount ($)</label>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {['25', '50', '100'].map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setTopUpAmount(amt)}
                      className={`py-2 rounded-xl text-xs font-bold border ${
                        topUpAmount === amt ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold shadow-lg transition-all"
              >
                Confirm Deposit of ${topUpAmount}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
