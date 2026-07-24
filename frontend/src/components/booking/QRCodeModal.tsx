import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Booking } from '../../types';
import { CheckCircle2, Download, X, Play, SquareCheck } from 'lucide-react';
import api from '../../services/api';

interface QRCodeModalProps {
  booking: Booking;
  onClose: () => void;
  onRefresh: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ booking, onClose, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      await api.post(`/bookings/${booking.id}/check-in`, { qrCode: booking.qrCode });
      setMsg('Check-in successful! Charging session started.');
      onRefresh();
    } catch (err: any) {
      setMsg(err.response?.data?.error || 'Check-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    try {
      await api.post(`/bookings/${booking.id}/check-out`);
      setMsg('Check-out completed! Charging session ended.');
      onRefresh();
    } catch (err: any) {
      setMsg(err.response?.data?.error || 'Check-out failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      const response = await api.get(`/bookings/${booking.id}/invoice`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice-${booking.id.slice(0, 8)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to download invoice');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-1">Station Check-In Pass</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Scan QR code at charger terminal</p>

        {/* QR Code Container */}
        <div className="bg-white p-4 rounded-2xl inline-block shadow-inner mb-4 border border-slate-200">
          <QRCodeSVG value={booking.qrCode || `CS-BOOKING-${booking.id}`} size={180} />
        </div>

        <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mb-4">
          CODE: <span className="font-bold text-emerald-400">{booking.qrCode}</span>
        </p>

        {msg && (
          <div className="mb-4 p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
            {msg}
          </div>
        )}

        {/* Action Controls */}
        <div className="space-y-2">
          {booking.status === 'CONFIRMED' && (
            <button
              onClick={handleCheckIn}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              Simulate QR Scan (Start Session)
            </button>
          )}

          {booking.status === 'IN_PROGRESS' && (
            <button
              onClick={handleCheckOut}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <SquareCheck className="w-4 h-4" />
              End Charging & Check Out
            </button>
          )}

          <button
            onClick={handleDownloadInvoice}
            className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <Download className="w-4 h-4 text-emerald-500" />
            Download PDF Invoice
          </button>
        </div>
      </div>
    </div>
  );
};
