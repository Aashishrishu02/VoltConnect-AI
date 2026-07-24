import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, Upload, MapPin, Zap, Building, CreditCard } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface OwnerWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const OwnerWizardModal: React.FC<OwnerWizardModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Personal Details
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '+919876543210');
  const [email, setEmail] = useState(user?.email || '');

  // Step 2: Property Type
  const [propertyType, setPropertyType] = useState('HOME');

  // Step 3: Address
  const [houseNumber, setHouseNumber] = useState('100');
  const [street, setStreet] = useState('100 Feet Road');
  const [area, setArea] = useState('Indiranagar');
  const [landmark, setLandmark] = useState('Near Metro Station');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [pinCode, setPinCode] = useState('560038');
  const [lat, setLat] = useState(12.9784);
  const [lng, setLng] = useState(77.6408);

  // Step 4: Charger Details
  const [title, setTitle] = useState('Indiranagar Fast CCS2 Station');
  const [brand, setBrand] = useState('Tata Power EZ Charge');
  const [model, setModel] = useState('60kW Dual Gun DC');
  const [connectorType, setConnectorType] = useState('CCS_2');
  const [chargerType, setChargerType] = useState('DC_FAST');
  const [powerKw, setPowerKw] = useState('60');

  // Step 5: Upload Photos
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&auto=format&fit=crop',
  ]);

  // Step 6: Availability
  const [operates24_7, setOperates24_7] = useState(true);

  // Step 7: Pricing
  const [pricingType, setPricingType] = useState('PER_HOUR');
  const [pricePerHour, setPricePerHour] = useState('120');
  const [pricePerKwh, setPricePerKwh] = useState('16');

  // Step 8: Amenities
  const [amenities, setAmenities] = useState<string[]>([
    'CCTV',
    'Covered Parking',
    'Security Guard',
    'Washroom',
    'WiFi',
  ]);

  // Step 9: Bank Details / UPI
  const [upiId, setUpiId] = useState('host.rajesh@upi');
  const [accountNumber, setAccountNumber] = useState('998877665544');
  const [ifscCode, setIfscCode] = useState('SBIN0001234');

  if (!isOpen) return null;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentStep((prev) => Math.min(10, prev + 1));
  };

  const handleBack = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const toggleAmenity = (item: string) => {
    setAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        alert('📍 Current GPS location captured!');
      });
    }
  };

  const handleSubmitWizard = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);

    const payload = {
      title,
      description: `${propertyType} charger host listing in ${city}.`,
      brand,
      model,
      propertyType,
      houseNumber,
      street,
      area,
      landmark,
      city,
      state,
      pinCode,
      latitude: lat,
      longitude: lng,
      pricingType,
      pricePerHour: parseFloat(pricePerHour),
      pricePerKwh: parseFloat(pricePerKwh),
      powerKw: parseFloat(powerKw),
      chargerType,
      connectorType,
      operates24_7,
      amenities,
      photos,
      upiId,
      accountNumber,
      ifscCode,
    };

    try {
      await api.post('/chargers', payload);
    } catch (err) {
      console.warn('Backend server offline. Registered local state owner listing.');
    }

    // Automatically assign OWNER role to user account in local state
    if (user && !user.roles.includes('OWNER')) {
      user.roles.push('OWNER');
      localStorage.setItem('chargeshare_user', JSON.stringify(user));
    }

    setLoading(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full p-6 shadow-2xl my-auto relative flex flex-col max-h-[85vh] overflow-hidden text-white">
        {/* Fixed Pinned Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Step {currentStep} of 10
            </span>
            <h3 className="font-extrabold text-xl text-white">Become a Charger Host</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full my-3 overflow-hidden shrink-0">
          <div
            className="bg-emerald-500 h-full transition-all duration-300"
            style={{ width: `${(currentStep / 10) * 100}%` }}
          />
        </div>

        {/* Scrollable Wizard Content Body */}
        <div className="flex-1 overflow-y-auto py-2 pr-1 space-y-4 text-xs">
          {/* STEP 1: Personal Details */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-white">Step 1: Personal & Contact Details</h4>
              <div>
                <label className="block font-semibold text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Mobile Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Property Type */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-white">Step 2: Select Property Type</h4>
              <div className="grid grid-cols-3 gap-3">
                {[
                  'HOME',
                  'APARTMENT',
                  'OFFICE',
                  'HOTEL',
                  'RESTAURANT',
                  'SHOP',
                  'SOCIETY',
                  'PARKING_LOT',
                  'PETROL_PUMP',
                ].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setPropertyType(type)}
                    className={`p-3 rounded-2xl font-bold border transition-all text-center ${
                      propertyType === type
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-md'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <Building className="w-5 h-5 mx-auto mb-1" />
                    {type.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Address & GPS */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-sm text-white">Step 3: Station Address</h4>
                <button
                  type="button"
                  onClick={handleCurrentLocation}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center gap-1 hover:bg-emerald-500/30"
                >
                  <MapPin className="w-3.5 h-3.5" /> Use Current Location
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="House / Plot No"
                  value={houseNumber}
                  onChange={(e) => setHouseNumber(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
                <input
                  type="text"
                  placeholder="Street / Road"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Area / Sector"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
                <input
                  type="text"
                  placeholder="Landmark"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
                <input
                  type="text"
                  placeholder="PIN Code"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Charger Specifications */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-white">Step 4: Charger Specs & Connectors</h4>
              <div>
                <label className="block font-semibold text-slate-400 mb-1">Station Name</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Connector Plug</label>
                  <select
                    value={connectorType}
                    onChange={(e) => setConnectorType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  >
                    <option value="CCS_2">CCS Combo 2</option>
                    <option value="TYPE_2">Type 2 Mennekes</option>
                    <option value="BHARAT_AC001">Bharat AC001</option>
                    <option value="BHARAT_DC001">Bharat DC001</option>
                    <option value="CHADEMO">CHAdeMO</option>
                    <option value="GBT">GB/T</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Power Output (kW)</label>
                  <select
                    value={powerKw}
                    onChange={(e) => setPowerKw(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  >
                    <option value="3.3">3.3 kW (Slow AC)</option>
                    <option value="7.2">7.2 kW (Fast AC)</option>
                    <option value="11">11 kW (Fast AC)</option>
                    <option value="22">22 kW (Fast AC)</option>
                    <option value="30">30 kW (DC Fast)</option>
                    <option value="60">60 kW (DC Fast)</option>
                    <option value="120">120 kW (Supercharger)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Upload Photos */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-white">Step 5: Charger & Parking Photos</h4>
              <div className="border-2 border-dashed border-slate-700 p-6 rounded-2xl text-center space-y-2">
                <Upload className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="font-bold text-slate-200">Drag & Drop Charger, Parking, and Entrance Photos</p>
                <p className="text-[11px] text-slate-400">Supported JPG, PNG up to 5MB</p>
              </div>
            </div>
          )}

          {/* STEP 6: Availability */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-white">Step 6: Operating Availability</h4>
              <label className="flex items-center gap-3 p-4 rounded-2xl bg-slate-800 border border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={operates24_7}
                  onChange={(e) => setOperates24_7(e.target.checked)}
                  className="accent-emerald-500 w-5 h-5"
                />
                <div>
                  <div className="font-bold text-white text-sm">Operates 24/7 Gated Access</div>
                  <p className="text-slate-400">Station remains open 24 hours every day for drivers</p>
                </div>
              </label>
            </div>
          )}

          {/* STEP 7: Pricing */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-white">Step 7: Set Pricing Rates</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Price per Hour (₹)</label>
                  <input
                    type="number"
                    value={pricePerHour}
                    onChange={(e) => setPricePerHour(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Price per kWh (₹)</label>
                  <input
                    type="number"
                    value={pricePerKwh}
                    onChange={(e) => setPricePerKwh(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 8: Amenities */}
          {currentStep === 8 && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-white">Step 8: Station Amenities</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'CCTV',
                  'Covered Parking',
                  'Security Guard',
                  'Washroom',
                  'Drinking Water',
                  'Waiting Area',
                  'WiFi',
                  'Cafe',
                ].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleAmenity(item)}
                    className={`p-2.5 rounded-xl font-bold border transition-all text-left flex items-center justify-between ${
                      amenities.includes(item)
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    <span>{item}</span>
                    {amenities.includes(item) && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 9: Bank Details & UPI */}
          {currentStep === 9 && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-white">Step 9: Payout UPI & Bank Details</h4>
              <div>
                <label className="block font-semibold text-slate-400 mb-1">Razorpay UPI ID</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="name@upi"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Bank Account Number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
                <input
                  type="text"
                  placeholder="IFSC Code"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>
            </div>
          )}

          {/* STEP 10: Final Review & Submit */}
          {currentStep === 10 && (
            <div className="space-y-4 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h4 className="font-extrabold text-lg text-white">Ready for Admin Verification</h4>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                Submitting this will add the <strong>OWNER</strong> role to your account. Your station listing status will be set to <strong>PENDING</strong> for Admin review before appearing publicly on the map.
              </p>
            </div>
          )}
        </div>

        {/* Wizard Footer Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 shrink-0">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs flex items-center gap-1 hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : <div />}

          {currentStep < 10 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs flex items-center gap-1 shadow-lg shadow-emerald-500/20 transition-colors"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitWizard}
              disabled={loading}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-xs shadow-xl transition-all"
            >
              {loading ? 'Submitting...' : 'Submit for Verification'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
