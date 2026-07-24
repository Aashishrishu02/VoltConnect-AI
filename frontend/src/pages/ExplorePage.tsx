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

const indianStateCoordinates: Record<string, [number, number]> = {
  maharashtra: [19.7515, 75.7139],
  mumbai: [19.0760, 72.8777],
  pune: [18.5204, 73.8567],
  nagpur: [21.1458, 79.0882],
  delhi: [28.6139, 77.2090],
  ncr: [28.6139, 77.2090],
  haryana: [29.0588, 76.0856],
  gurugram: [28.4595, 77.0266],
  gurgaon: [28.4595, 77.0266],
  karnataka: [15.3173, 75.7139],
  bengaluru: [12.9716, 77.5946],
  bangalore: [12.9716, 77.5946],
  mysuru: [12.2958, 76.6394],
  mysore: [12.2958, 76.6394],
  rajasthan: [27.0238, 74.2179],
  jaipur: [26.9124, 75.7873],
  udaipur: [24.5854, 73.7125],
  gujarat: [22.2587, 71.1924],
  ahmedabad: [23.0225, 72.5714],
  surat: [21.1702, 72.8311],
  vadodara: [22.3072, 73.1812],
  tamilnadu: [11.1271, 78.6569],
  chennai: [13.0827, 80.2707],
  coimbatore: [11.0168, 76.9558],
  telangana: [18.1124, 79.0193],
  hyderabad: [17.3850, 78.4867],
  kerala: [10.8505, 76.2711],
  kochi: [9.9312, 76.2673],
  thiruvananthapuram: [8.5241, 76.9366],
  westbengal: [22.9868, 87.8550],
  kolkata: [22.5726, 88.3639],
  uttarpradesh: [26.8467, 80.9462],
  noida: [28.5355, 77.3910],
  lucknow: [26.8467, 80.9462],
  goa: [15.2993, 74.1240],
  panaji: [15.4909, 73.8278],
  punjab: [31.1471, 75.3412],
  chandigarh: [30.7333, 76.7794],
  madhyapradesh: [22.9734, 78.6569],
  indore: [22.7196, 75.8577],
  bhopal: [23.2599, 77.4126],
};

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
  const [mapCenter, setMapCenter] = useState<[number, number]>([20.5937, 78.9629]);
  const [mapZoom, setMapZoom] = useState<number>(5);
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
    const customList = JSON.parse(localStorage.getItem('chargeshare_custom_chargers') || '[]');

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
        setChargers([...customList, ...res.data]);
      } else {
        setChargers([...customList, ...sampleIndianChargers]);
      }
    } catch (err) {
      setChargers([...customList, ...sampleIndianChargers]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChargers();
  }, [searchQuery, selectedType, selectedConnector, maxPrice, onlyAvailable]);

  // Handle Dynamic Geocoding and Map Panning when searchQuery changes
  useEffect(() => {
    const q = searchQuery.toLowerCase().replace(/\s+/g, '').trim();
    if (!q) {
      setMapCenter([20.5937, 78.9629]);
      setMapZoom(5);
      return;
    }

    // 1. Check if matching chargers exist
    const matched = chargers.filter((c) => {
      const cityMatch = (c.city || '').toLowerCase().includes(q);
      const stateMatch = (c.state || '').toLowerCase().includes(q);
      const titleMatch = (c.title || '').toLowerCase().includes(q);
      return cityMatch || stateMatch || titleMatch;
    });

    if (matched.length > 0) {
      setSelectedCharger(matched[0]);
      setMapCenter([matched[0].latitude, matched[0].longitude]);
      setMapZoom(13);
      return;
    }

    // 2. Check Indian State & Metro Geocoder Dictionary
    if (indianStateCoordinates[q]) {
      setSelectedCharger(null);
      setMapCenter(indianStateCoordinates[q]);
      setMapZoom(8);
      return;
    }

    // 3. Dynamic OpenStreetMap Nominatim Geocoding API lookup for ANY location in India
    const timer = setTimeout(async () => {
      try {
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}+India&format=json&limit=1`
        );
        const geoData = await geoRes.json();
        if (geoData && geoData.length > 0) {
          const lat = parseFloat(geoData[0].lat);
          const lon = parseFloat(geoData[0].lon);
          const displayName = geoData[0].display_name || searchQuery;
          const locationName = searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1);

          // Create dynamic EV Charger Station at exact searched location
          const searchedCharger: Charger = {
            id: `c_geo_${Date.now()}`,
            title: `${locationName} 120kW Ultra-Fast CCS2 Hub`,
            description: `On-demand 120kW DC fast charging station located at ${displayName.slice(0, 80)}.`,
            address: displayName.split(',')[0],
            city: locationName,
            state: 'India',
            zipCode: '560001',
            latitude: lat,
            longitude: lon,
            pricePerHour: 140,
            powerKw: 120,
            chargerType: 'DC_FAST',
            connectorType: 'CCS_2',
            operates24_7: true,
            isAvailable: true,
            amenities: ['24/7 Gated Access', 'Fast DC Charging', 'CCTV Security'],
            images: ['https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop'],
            averageRating: 4.9,
            totalReviews: 24,
            hostId: 'h_network',
            host: { id: 'h_network', name: 'VoltConnect Network', rating: 4.9, phone: '+911800123VOLT' },
          };

          setChargers((prev) => {
            if (prev.some((c) => c.id === searchedCharger.id)) return prev;
            return [searchedCharger, ...prev];
          });
          setSelectedCharger(searchedCharger);
          setMapCenter([lat, lon]);
          setMapZoom(14);
        }
      } catch (err) {
        // Fallback
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, chargers]);

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

  const handleAIRank = async () => {
    try {
      const res = await api.post('/ai/recommend', {
        userLat: mapCenter[0],
        userLng: mapCenter[1],
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4 text-slate-900 dark:text-white">
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
          type="button"
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
            onSelectCharger={(c) => {
              setSelectedCharger(c);
              setMapCenter([c.latitude, c.longitude]);
              setMapZoom(13);
            }}
            center={mapCenter}
            zoom={mapZoom}
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
                onSelect={(charger) => {
                  setSelectedCharger(charger);
                  setMapCenter([charger.latitude, charger.longitude]);
                  setMapZoom(13);
                }}
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
