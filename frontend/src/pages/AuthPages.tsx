import React, { useState } from 'react';
import { Zap, X, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { login, register, isLoading } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('DRIVER');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isRegister) {
        await register(name, email, password, role);
      } else {
        await login(email, password);
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Authentication failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-white">
            <Zap className="w-6 h-6 fill-white" />
          </div>
          <div>
            <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">
              {isRegister ? 'Join ChargeShare' : 'Welcome Back'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">P2P EV Charger Network</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isRegister && (
            <div>
              <label className="block font-semibold uppercase text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="Michael Scott"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-700 text-white"
              />
            </div>
          )}

          <div>
            <label className="block font-semibold uppercase text-slate-400 mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="driver@chargeshare.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-700 text-white"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase text-slate-400 mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-700 text-white"
            />
          </div>

          {isRegister && (
            <div>
              <label className="block font-semibold uppercase text-slate-400 mb-1">Account Role</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('DRIVER')}
                  className={`py-2 rounded-xl font-bold border ${
                    role === 'DRIVER' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  EV Driver
                </button>
                <button
                  type="button"
                  onClick={() => setRole('HOST')}
                  className={`py-2 rounded-xl font-bold border ${
                    role === 'HOST' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  Charger Host
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold text-sm shadow-lg transition-all"
          >
            {isLoading ? 'Processing...' : isRegister ? 'Create Account & Claim $50 Bonus' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="font-bold text-emerald-500 hover:underline"
          >
            {isRegister ? 'Sign In' : 'Create One'}
          </button>
        </div>
      </div>
    </div>
  );
};
