export type Role = 'DRIVER' | 'OWNER' | 'ADMIN';

export type ChargerType = 'SLOW_AC' | 'FAST_AC' | 'DC_FAST' | 'RAPID_DC' | 'SUPERCHARGER';

export type ConnectorType =
  | 'CCS_2'
  | 'TYPE_2'
  | 'BHARAT_AC001'
  | 'BHARAT_DC001'
  | 'CHADEMO'
  | 'GBT';

export type PropertyType =
  | 'HOME'
  | 'APARTMENT'
  | 'OFFICE'
  | 'HOTEL'
  | 'RESTAURANT'
  | 'SHOP'
  | 'SOCIETY'
  | 'PARKING_LOT'
  | 'PETROL_PUMP'
  | 'OTHER';

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'NEEDS_INFORMATION' | 'SUSPENDED';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface User {
  id: string;
  email: string;
  name: string;
  role?: Role;
  roles: Role[];
  avatar?: string;
  phone?: string;
  rating?: number;
  trustScore?: number;
  greenPoints?: number;
  upiId?: string;
  accountNumber?: string;
  ifscCode?: string;
  wallet?: Wallet;
}

export interface Charger {
  id: string;
  ownerId?: string;
  title: string;
  description?: string;
  brand?: string;
  model?: string;
  propertyType?: PropertyType;
  status?: ApprovalStatus;
  rejectionReason?: string;
  requestInfoMessage?: string;

  houseNumber?: string;
  street?: string;
  address?: string;
  area?: string;
  landmark?: string;
  city: string;
  state?: string;
  zipCode?: string;
  pinCode?: string;
  latitude: number;
  longitude: number;

  pricingType?: 'PER_KWH' | 'PER_HOUR' | 'FLAT_RATE';
  pricePerHour: number;
  pricePerKwh?: number;
  powerKw: number;
  chargerType: ChargerType;
  connectorType: ConnectorType;
  operates24_7?: boolean;
  isAvailable: boolean;

  amenities?: string[];
  photos?: string[];
  images?: string[];
  averageRating: number;
  totalReviews: number;
  owner?: {
    id: string;
    name: string;
    email?: string;
    avatar?: string;
    phone?: string;
    rating?: number;
    trustScore?: number;
  };
  host?: {
    id: string;
    name: string;
    email?: string;
    avatar?: string;
    phone?: string;
    rating?: number;
    trustScore?: number;
  };
  hostId?: string;
  distanceKm?: number;
  aiScore?: number;
  aiReason?: string;
}

export interface Booking {
  id: string;
  userId: string;
  chargerId: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  totalPrice: number;
  status: BookingStatus;
  qrCode?: string;
  checkInTime?: string;
  checkOutTime?: string;
  charger?: Charger;
  payment?: Payment;
  review?: Review;
  createdAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  paymentMethod: 'RAZORPAY' | 'UPI' | 'WALLET' | 'STRIPE';
  transactionId?: string;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  transactions?: Transaction[];
}

export interface Transaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'PAYMENT' | 'REFUND' | 'EARNING';
  amount: number;
  description: string;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  chargerId: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: {
    name: string;
    avatar?: string;
  };
}

export interface AIRecommendation {
  chargerId: string;
  aiScore: number;
  estimatedWaitMin: number;
  reason: string;
}

export interface EVRoutePlan {
  totalDistanceKm: number;
  estimatedTripMin: number;
  initialBattery: number;
  stopsNeeded: number;
  recommendedChargers: Charger[];
  arrivalBattery: number;
}
