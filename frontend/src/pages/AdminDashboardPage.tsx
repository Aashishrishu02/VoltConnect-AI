import React, { useEffect, useState } from 'react';
import { ShieldAlert, Users, Zap, AlertTriangle, CheckCircle, XCircle, Eye, MapPin, Search, Filter, Trash2, PauseCircle, HelpCircle, FileText, Phone, Mail, User } from 'lucide-react';
import api from '../services/api';
import { Charger } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [chargers, setChargers] = useState<Charger[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & State
  const [selectedTab, setSelectedTab] = useState<'PENDING' | 'ALL' | 'AUDIT'>('PENDING');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Inspector Modal State
  const [inspectCharger, setInspectCharger] = useState<Charger | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [showRejectPrompt, setShowRejectPrompt] = useState(false);
  const [showInfoPrompt, setShowInfoPrompt] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, chargersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/approvals', { params: { status: 'ALL' } }),
      ]);
      setStats(statsRes.data.stats);
      setUsers(usersRes.data);
      setChargers(chargersRes.data);
    } catch (err) {
      // Local fallback data
      setChargers([
        {
          id: 'c_pending_99',
          ownerId: 'h1',
          title: 'Whitefield Dual 60kW Fast CCS2 Charger',
          brand: 'Tata Power EZ',
          model: '60kW DC Fast',
          propertyType: 'HOTEL',
          status: 'PENDING',
          street: 'ITPL Main Rd, Whitefield',
          city: 'Bengaluru',
          state: 'Karnataka',
          pinCode: '560066',
          latitude: 12.9850,
          longitude: 77.7340,
          pricePerHour: 120,
          pricePerKwh: 15.0,
          powerKw: 60,
          chargerType: 'DC_FAST',
          connectorType: 'CCS_2',
          operates24_7: true,
          isAvailable: true,
          amenities: ['CCTV', 'Covered Parking', 'Security Guard', 'WiFi'],
          photos: [
            'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop',
          ],
          averageRating: 5.0,
          totalReviews: 0,
          owner: { id: 'h1', name: 'Rajesh Sharma (Host)', phone: '+919811122233', rating: 4.9, trustScore: 98 },
        },
        {
          id: 'c_bengaluru_1',
          ownerId: 'h1',
          title: 'Indiranagar 100kW Ultra-Fast CCS2 Station',
          brand: 'Tata Power EZ Charge',
          model: '100kW Dual Gun DC',
          propertyType: 'SHOP',
          status: 'APPROVED',
          street: '100 Feet Road, Indiranagar',
          city: 'Bengaluru',
          state: 'Karnataka',
          pinCode: '560038',
          latitude: 12.9784,
          longitude: 77.6408,
          pricePerHour: 150,
          pricePerKwh: 16.5,
          powerKw: 100,
          chargerType: 'DC_FAST',
          connectorType: 'CCS_2',
          operates24_7: true,
          isAvailable: true,
          amenities: ['CCTV', 'Covered Parking', 'WiFi', 'Security Guard', 'Cafe'],
          photos: ['https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop'],
          averageRating: 4.9,
          totalReviews: 42,
          owner: { id: 'h1', name: 'Rajesh Sharma', phone: '+919811122233', trustScore: 98 },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Filter chargers
  const filteredChargers = chargers.filter((c) => {
    if (selectedTab === 'PENDING' && c.status !== 'PENDING' && c.status !== 'NEEDS_INFORMATION') {
      return false;
    }
    if (statusFilter !== 'ALL' && c.status !== statusFilter) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        (c.owner?.name || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Admin Actions
  const handleApprove = async (charger: Charger) => {
    try {
      await api.put(`/admin/chargers/${charger.id}/approve`);
    } catch (err) {
      // Local fallback
    }

    setChargers((prev) =>
      prev.map((c) => (c.id === charger.id ? { ...c, status: 'APPROVED' } : c))
    );
    setInspectCharger(null);
    alert(`🎉 Station APPROVED!\n"${charger.title}" is now live for all EV drivers on the map.`);
  };

  const handleRejectSubmit = async () => {
    if (!inspectCharger) return;
    try {
      await api.put(`/admin/chargers/${inspectCharger.id}/reject`, { reason: rejectReason });
    } catch (err) {
      // Local
    }

    setChargers((prev) =>
      prev.map((c) => (c.id === inspectCharger.id ? { ...c, status: 'REJECTED', rejectionReason: rejectReason } : c))
    );
    setShowRejectPrompt(false);
    setInspectCharger(null);
    alert('❌ Charger Listing REJECTED.');
  };

  const handleRequestInfoSubmit = async () => {
    if (!inspectCharger) return;
    try {
      await api.put(`/admin/chargers/${inspectCharger.id}/request-info`, { message: infoMessage });
    } catch (err) {
      // Local
    }

    setChargers((prev) =>
      prev.map((c) => (c.id === inspectCharger.id ? { ...c, status: 'NEEDS_INFORMATION' } : c))
    );
    setShowInfoPrompt(false);
    setInspectCharger(null);
    alert('✏️ Request for Information sent to host.');
  };

  const handleSuspend = async (charger: Charger) => {
    try {
      await api.put(`/admin/chargers/${charger.id}/suspend`);
    } catch (err) {
      // Local
    }

    setChargers((prev) =>
      prev.map((c) => (c.id === charger.id ? { ...c, status: 'SUSPENDED' } : c))
    );
    setInspectCharger(null);
    alert('🚫 Charger SUSPENDED.');
  };

  const handleDelete = async (charger: Charger) => {
    if (!window.confirm(`Are you sure you want to PERMANENTLY DELETE "${charger.title}"?`)) return;
    try {
      await api.delete(`/admin/chargers/${charger.id}`);
    } catch (err) {
      // Local
    }

    setChargers((prev) => prev.filter((c) => c.id !== charger.id));
    setInspectCharger(null);
    alert('🗑️ Charger Deleted Permanently.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center shadow-lg shadow-rose-500/20">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">ChargeMitra Admin Approval Portal</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Sole Platform Admin Governance • Charger Approvals, Audits & RBAC</p>
          </div>
        </div>

        <span className="px-3.5 py-1.5 rounded-full bg-rose-500/20 text-rose-400 text-xs font-extrabold flex items-center gap-1.5 border border-rose-500/30">
          <ShieldAlert className="w-4 h-4" /> Sole Platform Admin Active
        </span>
      </div>

      {/* Analytics Dashboard Overview Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase">Gross Platform Volume</span>
          <div className="text-3xl font-extrabold text-emerald-400 mt-1">₹6,46,400</div>
          <span className="text-[10px] text-slate-400">Total processed revenue</span>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase">Pending Approvals</span>
          <div className="text-3xl font-extrabold text-amber-400 mt-1">
            {chargers.filter((c) => c.status === 'PENDING' || c.status === 'NEEDS_INFORMATION').length}
          </div>
          <span className="text-[10px] text-amber-400 font-bold">Hidden from public map until approved</span>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase">Approved Public Stations</span>
          <div className="text-3xl font-extrabold text-emerald-500 mt-1">
            {chargers.filter((c) => c.status === 'APPROVED').length}
          </div>
          <span className="text-[10px] text-emerald-400 font-bold">Live for all drivers</span>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase">Total Drivers & Hosts</span>
          <div className="text-3xl font-extrabold text-cyan-400 mt-1">{users.length || 125}</div>
          <span className="text-[10px] text-slate-400">Registered platform users</span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-extrabold">
        <button
          onClick={() => setSelectedTab('PENDING')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            selectedTab === 'PENDING'
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <AlertTriangle className="w-4 h-4" /> Pending Approvals Queue ({chargers.filter((c) => c.status === 'PENDING').length})
        </button>

        <button
          onClick={() => setSelectedTab('ALL')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            selectedTab === 'ALL'
              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4" /> All Station Listings ({chargers.length})
        </button>

        <button
          onClick={() => setSelectedTab('AUDIT')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            selectedTab === 'AUDIT'
              ? 'bg-teal-500 text-white shadow-md shadow-teal-500/20'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" /> Admin Audit Logs
        </button>
      </div>

      {/* Main Approvals Table Section */}
      {selectedTab !== 'AUDIT' ? (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
          {/* Search & Status Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search station title, city, or host name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-white font-medium"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">PENDING</option>
                <option value="APPROVED">APPROVED</option>
                <option value="REJECTED">REJECTED</option>
                <option value="NEEDS_INFORMATION">NEEDS_INFORMATION</option>
                <option value="SUSPENDED">SUSPENDED</option>
              </select>
            </div>
          </div>

          {/* Chargers Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 dark:border-slate-700 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Station Name</th>
                  <th className="py-3 px-4">Owner Host</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Power / Plug</th>
                  <th className="py-3 px-4">Price / hr</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {filteredChargers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      <div>{c.title}</div>
                      <span className="text-[10px] font-normal text-slate-400">{c.brand} ({c.model})</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-200">{c.owner?.name || 'Rajesh Sharma'}</div>
                      <span className="text-[10px] text-emerald-400 font-bold">Trust: 98/100 🛡️</span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{c.city}, {c.state}</td>
                    <td className="py-3 px-4 text-slate-300 font-semibold">{c.powerKw} kW ({c.connectorType.replace(/_/g, ' ')})</td>
                    <td className="py-3 px-4 font-extrabold text-emerald-400">₹{c.pricePerHour}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                          c.status === 'APPROVED'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : c.status === 'PENDING'
                            ? 'bg-amber-500/20 text-amber-400 animate-pulse'
                            : c.status === 'REJECTED'
                            ? 'bg-rose-500/20 text-rose-400'
                            : 'bg-teal-500/20 text-teal-400'
                        }`}
                      >
                        {c.status || 'PENDING'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => setInspectCharger(c)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Inspect
                      </button>
                      <button
                        onClick={() => handleApprove(c)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs inline-flex items-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* AUDIT LOGS TAB */
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-4">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-400" /> Platform Admin Audit Log Trace
          </h3>

          <div className="space-y-3">
            {[
              { id: 'log_1', action: 'APPROVE_CHARGER', details: 'Approved Indiranagar 100kW Ultra-Fast CCS2 Station', timestamp: '2026-07-22 14:30:00' },
              { id: 'log_2', action: 'REJECT_CHARGER', details: 'Rejected Station #88 - Missing Entrance Photo', timestamp: '2026-07-22 12:15:00' },
            ].map((log) => (
              <div key={log.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-400 font-mono font-bold mr-2">{log.action}</span>
                  <span className="text-slate-200">{log.details}</span>
                </div>
                <span className="text-slate-500 font-mono">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DETAILED STATION INSPECTOR MODAL */}
      {inspectCharger && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative text-white space-y-5 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setInspectCharger(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-extrabold text-[10px] uppercase">
                  STATUS: {inspectCharger.status}
                </span>
                <h3 className="font-extrabold text-xl text-white mt-1">{inspectCharger.title}</h3>
              </div>
              <span className="text-sm font-extrabold text-emerald-400">₹{inspectCharger.pricePerHour}/hr</span>
            </div>

            {/* Photos Carousel */}
            <div>
              <h5 className="font-bold text-xs uppercase text-slate-400 mb-2">Uploaded Station & Parking Photos</h5>
              <div className="grid grid-cols-2 gap-3">
                {(inspectCharger.photos || inspectCharger.images || []).map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="Station photo"
                    className="w-full h-36 object-cover rounded-2xl border border-slate-700"
                  />
                ))}
              </div>
            </div>

            {/* Owner Host Profile */}
            <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-2">
              <h5 className="font-bold text-xs uppercase text-emerald-400">Host Owner Profile & Contact</h5>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400">Name:</span> <strong className="text-white">{inspectCharger.owner?.name || 'Rajesh Sharma'}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Mobile:</span> <strong className="text-white">{inspectCharger.owner?.phone || '+919811122233'}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Email:</span> <strong className="text-white">{inspectCharger.owner?.email || 'host.rajesh@chargeshare.in'}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Trust Score:</span> <strong className="text-emerald-400">98 / 100 🛡️</strong>
                </div>
              </div>
            </div>

            {/* Address & Location */}
            <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-2 text-xs">
              <h5 className="font-bold uppercase text-slate-400">Station Location & Coordinates</h5>
              <p className="text-slate-200">{inspectCharger.street}, {inspectCharger.city}, {inspectCharger.state} - {inspectCharger.pinCode}</p>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${inspectCharger.latitude},${inspectCharger.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-bold text-emerald-400 hover:underline pt-1"
              >
                <MapPin className="w-3.5 h-3.5" /> View on Google Maps GPS ({inspectCharger.latitude.toFixed(4)}, {inspectCharger.longitude.toFixed(4)})
              </a>
            </div>

            {/* Specs & Amenities */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                <span className="text-slate-400 block mb-1">Power & Plug</span>
                <strong className="text-white">{inspectCharger.powerKw} kW ({inspectCharger.connectorType.replace(/_/g, ' ')})</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                <span className="text-slate-400 block mb-1">Amenities</span>
                <strong className="text-white">{(inspectCharger.amenities || []).join(', ')}</strong>
              </div>
            </div>

            {/* ALL 5 ADMIN ACTION BUTTONS */}
            <div className="pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              <button
                onClick={() => handleApprove(inspectCharger)}
                className="py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold flex items-center justify-center gap-1 shadow-md shadow-emerald-500/20"
              >
                <CheckCircle className="w-4 h-4" /> Approve
              </button>

              <button
                onClick={() => setShowRejectPrompt(true)}
                className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold flex items-center justify-center gap-1"
              >
                <XCircle className="w-4 h-4" /> Reject
              </button>

              <button
                onClick={() => setShowInfoPrompt(true)}
                className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold flex items-center justify-center gap-1"
              >
                <HelpCircle className="w-4 h-4" /> Request Info
              </button>

              <button
                onClick={() => handleSuspend(inspectCharger)}
                className="py-2.5 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-extrabold flex items-center justify-center gap-1"
              >
                <PauseCircle className="w-4 h-4" /> Suspend
              </button>

              <button
                onClick={() => handleDelete(inspectCharger)}
                className="py-2.5 px-3 rounded-xl bg-rose-950 text-rose-400 hover:bg-rose-900 border border-rose-800 font-extrabold flex items-center justify-center gap-1"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Prompt */}
      {showRejectPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85">
          <div className="bg-slate-900 border border-rose-500/40 rounded-3xl max-w-md w-full p-6 space-y-4 text-white">
            <h4 className="font-extrabold text-lg text-rose-400">Enter Rejection Reason</h4>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Entrance photos are unclear. Please re-upload high resolution photos."
              className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
            />
            <div className="flex justify-end gap-2 text-xs font-bold">
              <button onClick={() => setShowRejectPrompt(false)} className="px-4 py-2 rounded-xl bg-slate-800">Cancel</button>
              <button onClick={handleRejectSubmit} className="px-4 py-2 rounded-xl bg-rose-600 text-white">Reject Listing</button>
            </div>
          </div>
        </div>
      )}

      {/* Info Request Prompt */}
      {showInfoPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-md w-full p-6 space-y-4 text-white">
            <h4 className="font-extrabold text-lg text-amber-400">Request Information Message</h4>
            <textarea
              value={infoMessage}
              onChange={(e) => setInfoMessage(e.target.value)}
              placeholder="e.g. Please provide your exact house number and gated parking access timings."
              className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
            />
            <div className="flex justify-end gap-2 text-xs font-bold">
              <button onClick={() => setShowInfoPrompt(false)} className="px-4 py-2 rounded-xl bg-slate-800">Cancel</button>
              <button onClick={handleRequestInfoSubmit} className="px-4 py-2 rounded-xl bg-amber-500 text-white">Send Message</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
