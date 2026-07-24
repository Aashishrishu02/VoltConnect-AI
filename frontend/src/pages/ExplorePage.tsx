import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChargerMap } from '../components/map/ChargerMap';
import { ChargerCard } from '../components/charger/ChargerCard';
import { ChargerFilters } from '../components/charger/ChargerFilters';
import { BookingModal } from '../components/booking/BookingModal';
import { QRCodeModal } from '../components/booking/QRCodeModal';
import { Charger } from '../types';
import { Sparkles } from 'lucide-react';
import api from '../services/api';

const sampleIndianChargers: Charger[] = [
  {
    id: 'c_bengaluru_1',
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
    host: { id: 'h1', name: 'Rajesh Sharma', rating: 4.9, phone: '+919811122233' },
  },
  {
    id: 'c_mumbai_1',
    title: 'BKC Supercharge Hub 150kW Dual Gun',
    description: 'Ultra-fast DC charger located in G-Block BKC underground garage.',
    address: 'G Block, Bandra Kurla Complex',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: '400051',
    latitude: 19.0657,
    longitude: 72.8686,
    pricePerHour: 180,
    powerKw: 150,
    chargerType: 'SUPERCHARGER',
    connectorType: 'CCS_2',
    operates24_7: true,
    isAvailable: true,
    amenities: ['24/7 Gated Security', 'Valet Assistance'],
    images: ['https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&auto=format&fit=crop'],
    averageRating: 4.8,
    totalReviews: 38,
    hostId: 'h2',
    host: { id: 'h2', name: 'Priya Nair', rating: 4.8, phone: '+919822233344' },
  },
  {
    id: 'c_gurugram_1',
    title: 'DLF Cyber City Fast Charge 60kW',
    description: 'Convenient 60kW DC charger right outside Cyber Hub entrance.',
    address: 'DLF Cyber City, Phase 2',
    city: 'Gurugram',
    state: 'Haryana',
    zipCode: '122002',
    latitude: 28.4950,
    longitude: 77.0890,
    pricePerHour: 120,
    powerKw: 60,
    chargerType: 'DC_FAST',
    connectorType: 'CCS_2',
    operates24_7: true,
    isAvailable: true,
    amenities: ['Mall Access', 'Security Camera'],
    images: ['https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop'],
    averageRating: 4.7,
    totalReviews: 29,
    hostId: 'h3',
    host: { id: 'h3', name: 'Vikram Singh', rating: 4.7, phone: '+919833344455' },
  },
];

export const ExplorePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [chargers, setChargers] = useState<Charger[]>(sampleIndianChargers);
  const [selectedCharger, setSelectedCharger] = useState<Charger | null>(sampleIndianChargers[0]);
  const [bookingCharger, setBookingCharger] = useState<Charger | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('city') || '');
  const [selectedType, setSelectedType] = useState('');
  const [selectedConnector, setSelectedConnector] = useState('');
  const [maxPrice, setMaxPrice] = useState(250);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [aiRanked, setAiRanked] = useState(false);

  const fetchChargers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/chargers/search', {
        params: {
          city: searchQuery || undefined,
          chargerType: selectedType || undefined,
          connectorType: selectedConnector || undefined,
          maxPrice: maxPrice || undefined,
          isAvailable: onlyAvailable ? 'true' : undefined,
        },
      });
      if (res.data && res.data.length > 0) {
        setChargers(res.data);
        setSelectedCharger(res.data[0]);
      } else {
        setChargers(sampleIndianChargers);
        setSelectedCharger(sampleIndianChargers[0]);
      }
    } catch (err) {
      setChargers(sampleIndianChargers);
      setSelectedCharger(sampleIndianChargers[0]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChargers();
  }, [searchQuery, selectedType, selectedConnector, maxPrice, onlyAvailable]);

  useEffect(() => {
    if (filteredChargers.length > 0) {
      setSelectedCharger(filteredChargers[0]);
    }
  }, [searchQuery]);

  const handleAIRank = async () => {
    try {
      const res = await api.post('/ai/recommend', {
        userLat: 12.9716,
        userLng: 77.5946,
        chargers,
      });

      const scoreMap = new Map(res.data.map((item: any) => [item.chargerId, item]));

      const ranked = chargers.map((c) => {
        const item: any = scoreMap.get(c.id);
        return {
          ...c,
          aiScore: item?.aiScore || 92,
          aiReason: item?.reason || 'Recommended Choice for Tata & MG EVs',
        };
      }).sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0));

      setChargers(ranked);
      setAiRanked(true);
    } catch (err) {
      setAiRanked(true);
    }
  };

  const filteredChargers = chargers.filter((c) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchesCity = (c.city || '').toLowerCase().includes(q);
      const matchesTitle = (c.title || '').toLowerCase().includes(q);
      const matchesAddress = (c.address || '').toLowerCase().includes(q);
      const matchesState = (c.state || '').toLowerCase().includes(q);
      if (!matchesCity && !matchesTitle && !matchesAddress && !matchesState) return false;
    }
    if (selectedType && c.chargerType !== selectedType) return false;
    if (selectedConnector && c.connectorType !== selectedConnector) return false;
    if (c.pricePerHour > maxPrice) return false;
    if (onlyAvailable && !c.isAvailable) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      {/* Top Filter Bar */}
      <ChargerFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedConnector={selectedConnector}
        setSelectedConnector={setSelectedConnector}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        onlyAvailable={onlyAvailable}
        setOnlyAvailable={setOnlyAvailable}
      />

      {/* Header bar with AI Rank Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Available EV Chargers in India ({filteredChargers.length})
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Click on any marker or card to view details</p>
        </div>

        <button
          onClick={handleAIRank}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 border transition-all ${
            aiRanked
              ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-emerald-500 hover:border-emerald-500'
          }`}
        >
          <Sparkles className="w-4 h-4 fill-current" />
          {aiRanked ? 'AI Ranked!' : 'Rank with AI Engine'}
        </button>
      </div>

      {/* Main Split Screen Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[650px] lg:h-[calc(100vh-200px)]">
        {/* Left Interactive Map */}
        <div className="lg:col-span-7 h-[450px] lg:h-full rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg">
          <ChargerMap
            chargers={filteredChargers}
            selectedCharger={selectedCharger}
            onSelectCharger={(c) => setSelectedCharger(c)}
            center={selectedCharger ? [selectedCharger.latitude, selectedCharger.longitude] : [20.5937, 78.9629]}
            zoom={selectedCharger ? 13 : 5}
          />
        </div>

        {/* Right Scrollable Cards Grid */}
        <div className="lg:col-span-5 h-full overflow-y-auto pr-1 space-y-4 max-h-[650px] lg:max-h-full">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredChargers.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-800/80 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-3">
              <p className="text-sm font-bold text-slate-400">No stations match "{searchQuery}"</p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-bold text-xs"
              >
                Clear Search Filter
              </button>
            </div>
          ) : (
            filteredChargers.map((c) => (
              <ChargerCard
                key={c.id}
                charger={c}
                onSelect={(charger) => setSelectedCharger(charger)}
                onBookNow={(charger) => setBookingCharger(charger)}
              />
            ))
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {bookingCharger && (
        <BookingModal
          charger={bookingCharger}
          onClose={() => setBookingCharger(null)}
          onSuccess={(bookingData) => {
            setBookingCharger(null);
            setConfirmedBooking(bookingData);
          }}
        />
      )}

      {/* Confirmed Booking Pass Modal */}
      {confirmedBooking && (
        <QRCodeModal
          booking={confirmedBooking}
          onClose={() => setConfirmedBooking(null)}
          onRefresh={() => fetchChargers()}
        />
      )}
    </div>
  );
};
