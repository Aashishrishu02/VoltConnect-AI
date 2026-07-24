import React from 'react';
import { CreditCard as CardIcon, ShieldCheck } from 'lucide-react';

interface DigitalCreditCardProps {
  cardNumber: string;
  cardExpiry: string;
  cardName: string;
  cardCvv: string;
}

export const DigitalCreditCard: React.FC<DigitalCreditCardProps> = ({
  cardNumber,
  cardExpiry,
  cardName,
}) => {
  // Detect Card Brand
  const firstDigit = cardNumber.replace(/\s+/g, '').charAt(0);
  const cardBrand = firstDigit === '4' ? 'VISA' : firstDigit === '5' ? 'MASTERCARD' : firstDigit === '6' ? 'RUPAY' : 'CARD';

  const formattedNum = (cardNumber || '4532889944112026')
    .replace(/\D/g, '')
    .padEnd(16, '•')
    .replace(/(.{4})/g, '$1 ')
    .trim();

  return (
    <div className="w-full h-44 rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-800 to-emerald-950 p-5 text-white shadow-xl border border-slate-700/80 relative overflow-hidden flex flex-col justify-between select-none">
      {/* Background Glow Overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Row: Chip & Brand */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          {/* SIM Chip Icon */}
          <div className="w-10 h-7 rounded-md bg-gradient-to-tr from-amber-300 via-yellow-400 to-amber-200 border border-amber-400/60 shadow-inner flex items-center justify-center">
            <div className="w-6 h-4 border-t border-b border-amber-600/40" />
          </div>
          <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> 3D-Secure
          </span>
        </div>

        <span className="text-sm font-black tracking-widest text-emerald-400 uppercase">
          {cardBrand}
        </span>
      </div>

      {/* Middle Row: Card Number */}
      <div className="relative z-10 my-1">
        <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider block text-[9px] mb-0.5">Card Number</span>
        <div className="text-base sm:text-lg font-mono font-extrabold tracking-widest text-white drop-shadow">
          {formattedNum}
        </div>
      </div>

      {/* Bottom Row: Name & Expiry */}
      <div className="flex items-end justify-between relative z-10 text-xs">
        <div>
          <span className="text-[9px] font-mono text-slate-400 uppercase block">Cardholder</span>
          <span className="font-extrabold uppercase text-white truncate max-w-[180px] block">
            {cardName || 'YOUR NAME'}
          </span>
        </div>

        <div className="text-right">
          <span className="text-[9px] font-mono text-slate-400 uppercase block">Expires</span>
          <span className="font-mono font-extrabold text-white">
            {cardExpiry || 'MM/YY'}
          </span>
        </div>
      </div>
    </div>
  );
};
