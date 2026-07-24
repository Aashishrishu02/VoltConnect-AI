import React, { useState } from 'react';
import { Charger } from '../../types';
import { Zap, Calendar, Clock, CreditCard, Tag, CheckCircle, AlertCircle, X } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface BookingModalProps {
  charger: Charger;
  onClose: () => void;
  onSuccess: (bookingData: any) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ charger, onClose, onSuccess }) => {
  const { user, updateUserWallet } = useAuth();
  const [durationHours, setDurationHours] = useState(2);
  const [startTime, setStartTime] = useState(() => {
    const d = new Date();
    d.setMinutes(0);
    d.setHours(d.getHours() + 1);
    return d.toISOString().slice(0, 16);
  });
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ discountPercent: number; discountAmount: number } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'WALLET' | 'STRIPE' | 'RAZORPAY'>('WALLET');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const rawTotal = durationHours * charger.pricePerHour;
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalPrice = Math.max(0.5, rawTotal - discount);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const res = await api.post('/payments/apply-coupon', { code: couponCode, amount: rawTotal });
      setAppliedCoupon(res.data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid promo code');
    }
  };

  const handleConfirmBooking = async () => {
    setLoading(true);
    setError('');

    try {
      const start = new Date(startTime);
      const end = new Date(start.getTime() + durationHours * 3600000);

      const res = await api.post('/bookings', {
        chargerId: charger.id,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        paymentMethod,
        couponCode: appliedCoupon ? couponCode : undefined,
      });

      if (paymentMethod === 'WALLET' && user?.wallet) {
        updateUserWallet(user.wallet.balance - finalPrice);
      }

      onSuccess(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to complete booking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Zap className="w-6 h-6 fill-emerald-400" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Reserve Charging Slot</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{charger.title}</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Start Time Picker */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1.5">
              Select Start Time
            </label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white"
            />
          </div>

          {/* Duration Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1.5">
              Charging Duration (Hours)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((hrs) => (
                <button
                  key={hrs}
                  onClick={() => setDurationHours(hrs)}
                  className={`py-2 rounded-xl text-sm font-bold border transition-all ${
                    durationHours === hrs
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500'
                  }`}
                >
                  {hrs} {hrs === 1 ? 'Hour' : 'Hours'}
                </button>
              ))}
            </div>
          </div>

          {/* Promo Coupon Code */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1.5">
              Promo Coupon (Try WELCOME20)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter coupon"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="flex-1 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white uppercase font-bold"
              />
              <button
                onClick={handleApplyCoupon}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-emerald-500 hover:text-white transition-colors"
              >
                Apply
              </button>
            </div>
            {appliedCoupon && (
              <p className="text-xs text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Coupon Applied! Saved ${appliedCoupon.discountAmount.toFixed(2)}
              </p>
            )}
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1.5">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'WALLET', label: `Wallet ($${user?.wallet?.balance?.toFixed(2) || '0'})` },
                { id: 'STRIPE', label: 'Stripe Card' },
                { id: 'RAZORPAY', label: 'Razorpay / UPI' },
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as any)}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                    paymentMethod === method.id
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 ring-1 ring-emerald-500'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {method.label}
                </button>
              ))}
            </div>
          </div>

          {/* Total Breakdown */}
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Rate ({durationHours} hrs × ${charger.pricePerHour}/hr)</span>
              <span>${rawTotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-400 font-medium">
                <span>Discount Promo</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
              <span>Total Payable</span>
              <span className="text-emerald-500 text-lg">${finalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Action CTA */}
          <button
            onClick={handleConfirmBooking}
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-sm shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                Pay ${finalPrice.toFixed(2)} & Reserve
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
