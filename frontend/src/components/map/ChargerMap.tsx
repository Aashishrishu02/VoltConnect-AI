import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Charger } from '../../types';
import { Zap, Star } from 'lucide-react';

interface ChargerMapProps {
  chargers: Charger[];
  selectedCharger?: Charger | null;
  onSelectCharger: (charger: Charger) => void;
  center?: [number, number];
  zoom?: number;
}

// Helper component to dynamically pan map view when center/selectedCharger updates
function ChangeView({ center, zoom }: { center?: [number, number]; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom || 13, { animate: true });
    }
  }, [center, zoom, map]);
  return null;
}

const createCustomIcon = (charger: Charger, isSelected: boolean) => {
  const isFast = charger.chargerType === 'DC_FAST' || charger.chargerType === 'SUPERCHARGER';
  const bgColor = isSelected ? '#10b981' : isFast ? '#059669' : '#3b82f6';

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background: ${bgColor};
        color: white;
        padding: 6px 10px;
        border-radius: 20px;
        font-weight: 800;
        font-size: 12px;
        display: flex;
        align-items: center;
        gap: 4px;
        box-shadow: 0 4px 14px rgba(0,0,0,0.3);
        border: 2px solid white;
        transform: scale(${isSelected ? '1.2' : '1.0'});
        transition: transform 0.2s ease;
      ">
        ⚡ ₹${charger.pricePerHour}/h
      </div>
    `,
    iconSize: [85, 36],
    iconAnchor: [42, 18],
  });
};

export const ChargerMap: React.FC<ChargerMapProps> = ({
  chargers,
  selectedCharger,
  onSelectCharger,
  center = [20.5937, 78.9629], // India Center
  zoom = 5,
}) => {
  const mapCenter: [number, number] = selectedCharger
    ? [selectedCharger.latitude, selectedCharger.longitude]
    : chargers.length > 0
    ? [chargers[0].latitude, chargers[0].longitude]
    : center;

  const mapZoom = selectedCharger || chargers.length > 0 ? 13 : zoom;

  return (
    <div className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 relative">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        scrollWheelZoom={true}
        className="w-full h-full z-10"
      >
        <ChangeView center={mapCenter} zoom={mapZoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {chargers.map((c) => (
          <Marker
            key={c.id}
            position={[c.latitude, c.longitude]}
            icon={createCustomIcon(c, selectedCharger?.id === c.id)}
            eventHandlers={{
              click: () => onSelectCharger(c),
            }}
          >
            <Popup>
              <div className="p-2 min-w-[220px]">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                    {c.chargerType.replace('_', ' ')}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {c.averageRating}
                  </div>
                </div>

                <h4 className="font-bold text-sm text-white mb-1 line-clamp-1">{c.title}</h4>
                <p className="text-xs text-slate-400 mb-2">{c.address}, {c.city}</p>

                <div className="flex items-center justify-between text-xs border-t border-slate-700 pt-2 mt-2">
                  <div>
                    <span className="text-emerald-400 font-extrabold text-sm">₹{c.pricePerHour}</span>
                    <span className="text-slate-400"> / hour</span>
                  </div>
                  <button
                    onClick={() => onSelectCharger(c)}
                    className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-colors text-xs"
                  >
                    View Station
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
