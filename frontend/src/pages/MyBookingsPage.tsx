import React, { useEffect, useState } from 'react';
import { Booking } from '../types';
import { QRCodeModal } from '../components/booking/QRCodeModal';
import { Zap, Calendar, Clock, QrCode, Download, CheckCircle2, Play, SquareCheck, RefreshCw } from 'lucide-react';
import api from '../services/api';

const sampleUserBookings: Booking[] = [
  {
    id: 'bk_sample_101',
    chargerId: 'c_bengaluru_1',
    userId: 'usr_driver',
    startTime: new Date(Date.now() + 3600000).toISOString(),
    endTime: new Date(Date.now() + 10800000).toISOString(),
    totalHours: 2,
    totalPrice: 300,
    status: 'CONFIRMED',
    qrCode: 'CS-IN-994821',
    paymentMethod: 'WALLET',
    createdAt: new Date().toISOString(),
    charger: {
      id: 'c_bengaluru_1',
      title: 'Indiranagar 100kW Ultra-Fast CCS2 Station',
      address: '100 Feet Road, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      powerKw: 100,
      connectorType: 'CCS_2',
      pricePerHour: 150,
      host: { name: 'Rajesh Sharma', phone: '+919811122233' },
    } as any,
  },
  {
    id: 'bk_sample_102',
    chargerId: 'c_mumbai_1',
    userId: 'usr_driver',
    startTime: new Date(Date.now() - 7200000).toISOString(),
    endTime: new Date(Date.now() - 3600000).toISOString(),
    totalHours: 1,
    totalPrice: 180,
    status: 'COMPLETED',
    qrCode: 'CS-IN-883910',
    paymentMethod: 'RAZORPAY',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    charger: {
      id: 'c_mumbai_1',
      title: 'BKC Supercharge Hub 150kW Dual Gun',
      address: 'G Block, Bandra Kurla Complex',
      city: 'Mumbai',
      state: 'Maharashtra',
      powerKw: 150,
      connectorType: 'CCS_2',
      pricePerHour: 180,
    } as any,
  },
];

export const MyBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>(sampleUserBookings);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings/my-bookings');
      if (res.data && res.data.length > 0) {
        setBookings(res.data);
      }
    } catch (err) {
      // Local fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = statusFilter === 'ALL'
    ? bookings
    : bookings.filter((b) => b.status === statusFilter);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-slate-900 dark:text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-extrabold uppercase">
            <Zap className="w-4 h-4 fill-emerald-500" /> ChargeMitra Driver Passbook
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">My Reserved Slots & Charging Passes</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">View active reservations, QR check-in passes, and download tax invoices.</p>
        </div>

        <button
          onClick={fetchBookings}
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-emerald-500 transition-all flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 text-emerald-500 ${loading ? 'animate-spin' : ''}`} /> Refresh Status
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-extrabold">
        {[
          { id: 'ALL', label: `All Bookings (${bookings.length})` },
          { id: 'CONFIRMED', label: `Active Reserved (${bookings.filter((b) => b.status === 'CONFIRMED').length})` },
          { id: 'IN_PROGRESS', label: `Charging Now (${bookings.filter((b) => b.status === 'IN_PROGRESS').length})` },
          { id: 'COMPLETED', label: `Completed (${bookings.filter((b) => b.status === 'COMPLETED').length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id as any)}
            className={`px-4 py-2 rounded-xl transition-all ${
              statusFilter === tab.id
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((b) => (
          <div
            key={b.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all hover:border-emerald-500/50"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6 fill-emerald-400" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    {b.charger?.title || 'EV Charging Station Slot'}
                  </h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      b.status === 'CONFIRMED'
                        ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                        : b.status === 'IN_PROGRESS'
                        ? 'bg-cyan-500/20 text-cyan-400 animate-pulse border border-cyan-500/30'
                        : b.status === 'COMPLETED'
                        ? 'bg-slate-500/20 text-slate-400'
                        : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    ● {b.status}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  📍 {b.charger?.address || b.charger?.city || 'Location Address'}, {b.charger?.city || 'India'}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1 font-mono text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-emerald-500" /> {new Date(b.startTime).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-teal-400" /> {new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({b.totalHours} hrs)
                  </span>
                  <span className="font-extrabold text-emerald-500">
                    ₹{b.totalPrice} ({b.paymentMethod})
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setSelectedBooking(b)}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <QrCode className="w-4 h-4" /> View QR Pass & Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Selected QR Pass Modal */}
      {selectedBooking && (
        <QRCodeModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onRefresh={fetchBookings}
        />
      )}
    </div>
  );
};
