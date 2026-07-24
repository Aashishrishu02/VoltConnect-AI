import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, MapPin, Navigation, Wallet, Sun, Moon, User as UserIcon, LogOut, ShieldAlert, PlusCircle, LayoutDashboard, Globe, AlertTriangle, ChevronDown, Home, Car, Wrench, Bot, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { SOSModal } from '../common/SOSModal';
import { EVAssistanceModal } from '../common/EVAssistanceModal';

export const Navbar: React.FC<{ onOpenAuth: () => void }> = ({ onOpenAuth }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, brightness, setBrightness } = useTheme();
  const { lang, setLang } = useLanguage();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [brightnessMenuOpen, setBrightnessMenuOpen] = useState(false);
  const [sosOpen, setSosOpen] = useState(false);
  const [assistanceOpen, setAssistanceOpen] = useState(false);

  // Active UI Mode: DRIVER | OWNER | ADMIN
  const [activeMode, setActiveMode] = useState<'DRIVER' | 'OWNER' | 'ADMIN'>('DRIVER');

  const userRoles = user?.roles || ['DRIVER'];
  const isOwner = userRoles.includes('OWNER');
  const isAdmin = userRoles.includes('ADMIN');

  const handleSwitchMode = (mode: 'DRIVER' | 'OWNER' | 'ADMIN') => {
    setActiveMode(mode);
    setRoleMenuOpen(false);
    if (mode === 'DRIVER') navigate('/explore');
    else if (mode === 'OWNER') navigate('/host-dashboard');
    else if (mode === 'ADMIN') navigate('/admin-dashboard');
  };

  const handleBecomeHostClick = () => {
    if (!user) {
      onOpenAuth();
    } else {
      navigate('/become-host');
    }
  };

  return (
    <>
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform shrink-0">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base sm:text-xl tracking-tight bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent whitespace-nowrap">
                VoltConnect AI
              </span>
              <span className="text-[9px] font-extrabold tracking-wider uppercase text-slate-500 dark:text-slate-400 -mt-0.5 hidden md:block whitespace-nowrap">
                Smart EV Mobility Network
              </span>
            </div>
          </Link>

          {/* Role Switcher Pill */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-extrabold text-slate-900 dark:text-white hover:border-emerald-500 transition-all"
              >
                {activeMode === 'DRIVER' && <span className="flex items-center gap-1 text-emerald-400">🚗 Driver Mode</span>}
                {activeMode === 'OWNER' && <span className="flex items-center gap-1 text-teal-400">🏠 Owner Mode</span>}
                {activeMode === 'ADMIN' && <span className="flex items-center gap-1 text-rose-400">🛡️ Admin Mode</span>}
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {roleMenuOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl py-1 z-50 animate-in fade-in duration-150">
                  <button
                    onClick={() => handleSwitchMode('DRIVER')}
                    className={`w-full text-left px-4 py-2 text-xs font-bold flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 ${
                      activeMode === 'DRIVER' ? 'text-emerald-400' : 'text-slate-300'
                    }`}
                  >
                    <Car className="w-4 h-4" /> Driver Mode
                  </button>

                  {isOwner ? (
                    <button
                      onClick={() => handleSwitchMode('OWNER')}
                      className={`w-full text-left px-4 py-2 text-xs font-bold flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 ${
                        activeMode === 'OWNER' ? 'text-teal-400' : 'text-slate-300'
                      }`}
                    >
                      <Home className="w-4 h-4" /> Owner Mode
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setRoleMenuOpen(false);
                        handleBecomeHostClick();
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-teal-400 hover:bg-teal-500/10 flex items-center gap-2 border-t border-slate-700/50"
                    >
                      <PlusCircle className="w-4 h-4" /> Become a Charger Host
                    </button>
                  )}

                  {isAdmin && (
                    <button
                      onClick={() => handleSwitchMode('ADMIN')}
                      className={`w-full text-left px-4 py-2 text-xs font-bold flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 border-t border-slate-700/50 ${
                        activeMode === 'ADMIN' ? 'text-rose-400' : 'text-slate-300'
                      }`}
                    >
                      <ShieldAlert className="w-4 h-4" /> Admin Console
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Mode Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/60 p-1.5 rounded-full border border-slate-200 dark:border-slate-700/60 text-xs font-semibold">
            {activeMode === 'DRIVER' && (
              <>
                <Link
                  to="/explore"
                  className="px-3.5 py-2 rounded-full hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all flex items-center gap-1.5"
                >
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  Find Chargers
                </Link>
                <Link
                  to="/route-planner"
                  className="px-3.5 py-2 rounded-full hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all flex items-center gap-1.5"
                >
                  <Navigation className="w-4 h-4 text-teal-400" />
                  AI Trip Planner
                </Link>
                <Link
                  to="/ai-chat"
                  className="px-3.5 py-2 rounded-full hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all flex items-center gap-1.5"
                >
                  <Bot className="w-4 h-4 text-cyan-400" />
                  AI Assistant
                </Link>
              </>
            )}

            {activeMode === 'OWNER' && (
              <>
                <Link
                  to="/host-dashboard"
                  className="px-3.5 py-2 rounded-full hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all flex items-center gap-1.5"
                >
                  <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                  Host Dashboard
                </Link>
                <Link
                  to="/become-host"
                  className="px-3.5 py-2 rounded-full hover:bg-white dark:hover:bg-slate-700 text-teal-400 transition-all flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  Add New Charger
                </Link>
              </>
            )}

            {activeMode === 'ADMIN' && (
              <Link
                to="/admin-dashboard"
                className="px-3.5 py-2 rounded-full hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all flex items-center gap-1.5"
              >
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                Admin Console
              </Link>
            )}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* EV Assistance Button */}
            <button
              onClick={() => setAssistanceOpen(true)}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 text-xs font-bold transition-all"
            >
              <Wrench className="w-3.5 h-3.5" /> Assistance
            </button>

            {/* Become Host CTA */}
            {(!user || !isOwner) && (
              <button
                onClick={handleBecomeHostClick}
                className="hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-extrabold text-xs shadow-md shadow-teal-500/20 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                Become a Host
              </button>
            )}

            {/* Emergency SOS */}
            <button
              onClick={() => setSosOpen(true)}
              className="px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-500 hover:bg-rose-500/20 text-xs font-extrabold flex items-center gap-1 transition-all"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">SOS</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'EN' ? 'HI' : 'EN')}
              className="px-2.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-emerald-500 transition-all flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-500" />
              <span>{lang === 'EN' ? 'हिंदी' : 'EN'}</span>
            </button>

            {/* Theme & Brightness Controls */}
            <div className="relative">
              <button
                onClick={() => setBrightnessMenuOpen(!brightnessMenuOpen)}
                className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Theme & Brightness Settings"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
              </button>

              {brightnessMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl space-y-3 z-50 text-xs animate-in fade-in duration-150">
                  <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                    <span>Display Theme</span>
                    <button
                      type="button"
                      onClick={toggleTheme}
                      className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-700 text-emerald-500 font-extrabold"
                    >
                      {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
                    </button>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      <span>Screen Brightness</span>
                      <span className="text-emerald-500 font-extrabold">{brightness}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sun className="w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="range"
                        min="50"
                        max="100"
                        value={brightness}
                        onChange={(e) => setBrightness(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer h-1.5"
                      />
                      <Sun className="w-4 h-4 text-amber-400 fill-amber-400" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {user ? (
              <div className="relative">
                <div className="flex items-center gap-2">
                  <Link
                    to="/wallet"
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-extrabold text-xs hover:bg-emerald-500/20 transition-all"
                  >
                    <Wallet className="w-3.5 h-3.5" />
                    <span>₹{user.wallet?.balance?.toFixed(0) || '0'}</span>
                  </Link>

                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 p-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:ring-2 hover:ring-emerald-500 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-xs uppercase">
                      {user.name.charAt(0)}
                    </div>
                  </button>
                </div>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl py-2 z-50 animate-in fade-in duration-150">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700/60">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {userRoles.map((r) => (
                          <span key={r} className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-emerald-500/20 text-emerald-400 uppercase">
                            ✓ {r}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/my-bookings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                      >
                        <Calendar className="w-4 h-4 text-emerald-500" />
                        My Reserved Slots & QR Passes
                      </Link>

                      <Link
                        to="/wallet"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                      >
                        <Wallet className="w-4 h-4 text-emerald-500" />
                        Wallet (₹{user.wallet?.balance?.toFixed(0) || '0'})
                      </Link>

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          handleBecomeHostClick();
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                      >
                        <PlusCircle className="w-4 h-4" />
                        List Charger
                      </button>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-700/60 pt-1">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
              >
                <UserIcon className="w-3.5 h-3.5" />
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>

    <SOSModal isOpen={sosOpen} onClose={() => setSosOpen(false)} />
    <EVAssistanceModal isOpen={assistanceOpen} onClose={() => setAssistanceOpen(false)} />
    </>
  );
};
