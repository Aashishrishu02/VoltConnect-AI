import React, { createContext, useContext, useState } from 'react';

type Language = 'EN' | 'HI';

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  EN: {
    brandName: 'ChargeMitra',
    tagline: 'India\'s P2P EV Charger Network',
    findChargers: 'Find EV Chargers',
    listCharger: 'List Your Charger',
    aiRoutePlanner: 'AI Route Planner',
    hostDashboard: 'Host Dashboard',
    adminConsole: 'Admin Console',
    myWallet: 'ChargeMitra Wallet',
    heroTitle: 'Charge Anywhere in India',
    heroSubtitle: 'Monetize your private home or business charger. Connect with thousands of EV drivers.',
    searchPlaceholder: 'Search city (e.g. Bengaluru, Mumbai, Delhi, Hyderabad, Pune)...',
    searchBtn: 'Search Chargers',
    sosBtn: 'Emergency SOS',
    carbonSavings: 'Carbon Savings Calculator',
    evCostCalculator: 'EV vs Petrol Cost Calculator',
    activeChargers: 'Active EV Chargers',
    uptime: 'Network Uptime',
    hostEarnings: 'Host Earnings Paid',
    recommended: 'AI Recommended Match',
    bookNow: 'Book Now',
    payRazorpay: 'Pay via Razorpay / UPI',
    walletBalance: 'Wallet Balance',
  },
  HI: {
    brandName: 'चार्जमित्र',
    tagline: 'भारत का P2P EV चार्जर नेटवर्क',
    findChargers: 'EV चार्जर खोजें',
    listCharger: 'अपना चार्जर जोड़ें',
    aiRoutePlanner: 'AI रूट प्लानर',
    hostDashboard: 'होस्ट डैशबोर्ड',
    adminConsole: 'एडमिन पैनल',
    myWallet: 'चार्जमित्र वॉलेट',
    heroTitle: 'भारत में कहीं भी चार्ज करें',
    heroSubtitle: 'अपने निजी चार्जर को किराए पर देकर कमाई करें। हजारों EV ड्राइवरों से जुड़ें।',
    searchPlaceholder: 'शहर खोजें (जैसे बेंगलुरु, मुंबई, दिल्ली, हैदराबाद, पुणे)...',
    searchBtn: 'चार्जर खोजें',
    sosBtn: 'आपातकालीन SOS',
    carbonSavings: 'कार्बन बचत कैलकुलेटर',
    evCostCalculator: 'EV बनाम पेट्रोल बचत',
    activeChargers: 'सक्रिय EV चार्जर',
    uptime: 'नेटवर्क अपटाइम',
    hostEarnings: 'कुल होस्ट कमाई',
    recommended: 'AI सुझाया गया चार्जर',
    bookNow: 'अभी बुक करें',
    payRazorpay: 'Razorpay / UPI द्वारा भुगतान करें',
    walletBalance: 'वॉलेट बैलेंस',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('EN');

  const t = (key: string): string => {
    return translations[lang][key] || translations['EN'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
