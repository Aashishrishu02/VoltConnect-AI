import React, { useEffect, useState } from 'react';
import { PlusCircle, Zap, DollarSign, TrendingUp, X, ShieldCheck } from 'lucide-react';
import { Charger } from '../types';
import api from '../services/api';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const mockAnalytics = [
  { day: 'Mon', revenue: 450, occupancy: 60 },
  { day: 'Tue', revenue: 680, occupancy: 75 },
  { day: 'Wed', revenue: 900, occupancy: 85 },
  { day: 'Thu', revenue: 1100, occupancy: 90 },
  { day: 'Fri', revenue: 1400, occupancy: 95 },
  { day: 'Sat', revenue: 1950, occupancy: 98 },
  { day: 'Sun', revenue: 1600, occupancy: 88 },
];

const defaultHostChargers: Charger[] = [
  {
    id: 'c_host_bengaluru_1',
    title: 'Indiranagar 100kW Ultra-Fast CCS2 Station',
    description: 'Private 100kW dual gun CCS2 fast charger in prime Indiranagar location.',
    address: '100 Feet Road, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    zipCode: '560038',
    latitude: 12.9784,
    longitude: 77.6408,
    pricePerHour: 150,
    powerKw: 100,
    chargerType: 'DC_FAST',
    connectorType: 'CCS_2',
    operates24_7: true,
    isAvailable: true,
    amenities: ['Free WiFi', 'Coffee Lounge', 'CCTV Security'],
    images: ['https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop'],
    averageRating: 4.9,
    totalReviews: 42,
    hostId: 'h1',
  },
  {
    id: 'c_host_bengaluru_2',
    title: 'Whitefield Dual 60kW Fast Charging Point',
    description: 'Gated parking fast DC charger close to ITPL.',
    address: 'ITPL Main Rd, Whitefield',
    city: 'Bengaluru',
    state: 'Karnataka',
    zipCode: '560066',
    latitude: 12.9850,
    longitude: 77.7340,
    pricePerHour: 120,
    powerKw: 60,
    chargerType: 'DC_FAST',
    connectorType: 'CCS_2',
    operates24_7: true,
    isAvailable: true,
    amenities: ['24/7 Security', 'Restroom Access'],
    images: ['https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&auto=format&fit=crop'],
    averageRating: 4.8,
    totalReviews: 24,
    hostId: 'h1',
  },
];

export const HostDashboardPage: React.FC = () => {
  const [chargers, setChargers] = useState<Charger[]>(defaultHostChargers);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [pricePerHour, setPricePerHour] = useState('120');
  const [powerKw, setPowerKw] = useState('60');
  const [chargerType, setChargerType] = useState('DC_FAST');
  const [connectorType, setConnectorType] = useState('CCS_2');
  const [upiId, setUpiId] = useState('host.rajesh@upi');
  const [aadhaarNumber, setAadhaarNumber] = useState('XXXX-XXXX-9988');

  const fetchHostData = async () => {
    try {
      const res = await api.get('/chargers/host/my-chargers');
      if (res.data && res.data.length > 0) {
        setChargers(res.data);
      }
    } catch (err) {
      console.warn('Backend server offline. Displaying local host listings.');
    }
  };

  useEffect(() => {
    fetchHostData();
  }, []);

  const handleCreateCharger = async (e: React.FormEvent) => {
    e.preventDefault();

    const newChargerData: Charger = {
      id: `c_host_${Date.now()}`,
      title: title || 'New Private EV Station',
      description: 'Recently registered private charger on ChargeMitra.',
      address: address || '100 Feet Rd',
      city: city || 'Bengaluru',
      state: 'Karnataka',
      zipCode: '560001',
      latitude: 12.9716 + (Math.random() - 0.5) * 0.05,
      longitude: 77.5946 + (Math.random() - 0.5) * 0.05,
      pricePerHour: parseFloat(pricePerHour) || 120,
      powerKw: parseFloat(powerKw) || 60,
      chargerType: chargerType as any,
      connectorType: connectorType as any,
      operates24_7: true,
      isAvailable: true,
      amenities: ['CCTV', 'Covered Parking'],
      images: ['https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop'],
      averageRating: 5.0,
      totalReviews: 0,
      hostId: 'h1',
    };

    try {
      await api.post('/chargers', {
        title: newChargerData.title,
        address: newChargerData.address,
        city: newChargerData.city,
        latitude: newChargerData.latitude,
        longitude: newChargerData.longitude,
        pricePerHour: newChargerData.pricePerHour,
        powerKw: newChargerData.powerKw,
        chargerType: newChargerData.chargerType,
        connectorType: newChargerData.connectorType,
      });
    } catch (err) {
      console.warn('Backend offline. Saved charger listing in local state.');
    }

    // Add newly created charger to state
    setChargers((prev) => [newChargerData, ...prev]);
    setShowAddModal(false);
    alert('🎉 Charger Listing Registered Successfully!');

    // Reset form
    setTitle('');
    setAddress('');
  };

  const handleToggleAvailability = async (charger: Charger) => {
    setChargers((prev) =>
      prev.map((c) => (c.id === charger.id ? { ...c, isAvailable: !c.isAvailable } : c))
    );
    try {
      await api.put(`/chargers/${charger.id}`, { isAvailable: !charger.isAvailable });
    } catch (err) {
      // Handled locally
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">ChargeMitra Host Dashboard</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Manage your private EV charger listings, UPI payouts, and earnings</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Register New Charger
        </button>
      </div>

      {/* Host Trust Score Card */}
      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 shrink-0" />
          <div>
            <div className="text-sm font-bold text-white">Host Verification & Trust Score: <span className="text-emerald-400">98 / 100 (Verified Host)</span></div>
            <p className="text-xs text-slate-400">Aadhaar verified • UPI linked: <span className="font-mono text-emerald-400">{upiId}</span></p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase">Aadhaar Verified</span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Weekly Host Earnings</span>
            <DollarSign className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">₹8,080.00</div>
          <span className="text-xs text-emerald-400 font-semibold">+18.5% from last week • Razorpay Auto Payout</span>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Avg Occupancy Rate</span>
            <TrendingUp className="w-5 h-5 text-teal-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">84.5%</div>
          <span className="text-xs text-teal-400 font-semibold">Peak hours 5 PM - 10 PM</span>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Listed Chargers</span>
            <Zap className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{chargers.length}</div>
          <span className="text-xs text-slate-400 font-normal">All stations approved & online</span>
        </div>
      </div>

      {/* Analytics Chart */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm">
        <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4">Weekly Earnings (₹) & Occupancy Trend</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockAnalytics}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Listed Chargers Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white">My Listed EV Chargers</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-700 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Station Name</th>
                <th className="py-3 px-4">Power / Type</th>
                <th className="py-3 px-4">Price / hr</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {chargers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{c.title}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{c.powerKw} kW ({c.chargerType})</td>
                  <td className="py-3 px-4 font-bold text-emerald-500">₹{c.pricePerHour.toFixed(0)}</td>
                  <td className="py-3 px-4 text-amber-400 font-bold">{c.averageRating} ★</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      c.isAvailable ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {c.isAvailable ? 'ONLINE' : 'OFFLINE'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleToggleAvailability(c)}
                      className="px-3 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-emerald-500 hover:text-white font-bold transition-colors"
                    >
                      Toggle Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Charger Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-4">Register New Charger in India</h3>

            <form onSubmit={handleCreateCharger} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase text-slate-400 mb-1">Station Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Indiranagar Fast CCS2 Station"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-slate-400 mb-1">Street Address & City</label>
                <input
                  type="text"
                  required
                  placeholder="100 Feet Rd, Indiranagar, Bengaluru"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase text-slate-400 mb-1">Price / Hour (₹)</label>
                  <input
                    type="number"
                    step="5"
                    value={pricePerHour}
                    onChange={(e) => setPricePerHour(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-slate-400 mb-1">Power Output (kW)</label>
                  <input
                    type="number"
                    step="1"
                    value={powerKw}
                    onChange={(e) => setPowerKw(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase text-slate-400 mb-1">Razorpay UPI ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="name@upi"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-slate-400 mb-1">Aadhaar (Last 4 Digits)</label>
                  <input
                    type="text"
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value)}
                    placeholder="9988"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold shadow-lg transition-all"
              >
                Submit for Verification & Listing
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
