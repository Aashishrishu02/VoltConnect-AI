import { env } from '../config/env';
import { logger } from '../utils/logger';

export class AIClientService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = env.AI_SERVICE_URL;
  }

  async getRecommendations(data: {
    userLat: number;
    userLng: number;
    maxDistanceKm?: number;
    minPowerKw?: number;
    connectorType?: string;
    chargers: any[];
  }) {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (err: any) {
      logger.warn(`AI Microservice unreachable. Falling back to local heuristic ranking: ${err.message}`);
    }

    // Heuristic fallback ranking
    return data.chargers.map((c) => {
      const latDiff = c.latitude - data.userLat;
      const lngDiff = c.longitude - data.userLng;
      const dist = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111; // Approx km
      const matchScore = Math.max(10, Math.min(99, Math.round(100 - dist * 5 + (c.averageRating || 5) * 5)));
      return {
        chargerId: c.id,
        aiScore: matchScore,
        estimatedWaitMin: Math.floor(Math.random() * 10),
        reason: dist < 5 ? 'Nearest high-speed charger' : 'Top rated in area',
      };
    }).sort((a, b) => b.aiScore - a.aiScore);
  }

  async getDynamicPricing(data: {
    chargerId: string;
    basePrice: number;
    hour: number;
    dayOfWeek: number;
    occupancyRate: number;
  }) {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/pricing/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (err: any) {
      logger.warn(`AI Microservice pricing call failed. Standard pricing fallback: ${err.message}`);
    }

    // Fallback: Peak hours (16-20) get 1.25x multiplier
    const isPeak = data.hour >= 16 && data.hour <= 20;
    const multiplier = isPeak ? 1.25 : 1.0;
    return {
      chargerId: data.chargerId,
      recommendedPrice: Math.round(data.basePrice * multiplier * 100) / 100,
      multiplier,
      isPeakHour: isPeak,
      reason: isPeak ? 'Peak grid demand pricing applied' : 'Standard off-peak rate',
    };
  }

  async planEVRoute(data: {
    startLat: number;
    startLng: number;
    destLat: number;
    destLng: number;
    batteryPercent: number;
    maxRangeKm?: number;
    availableChargers: any[];
  }) {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/route/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (err: any) {
      logger.warn(`AI Microservice route call failed. Using local route planner: ${err.message}`);
    }

    // Fallback EV route stop selector
    const totalDistKm = Math.round(Math.sqrt(
      Math.pow(data.destLat - data.startLat, 2) + Math.pow(data.destLng - data.startLng, 2)
    ) * 111);
    
    const estRemainingRange = (data.batteryPercent / 100) * (data.maxRangeKm || 350);
    const stopsNeeded = totalDistKm > estRemainingRange ? 1 : 0;
    const recommendedStops = stopsNeeded > 0 ? data.availableChargers.slice(0, 1) : [];

    return {
      totalDistanceKm: totalDistKm,
      estimatedTripMin: Math.round((totalDistKm / 80) * 60),
      initialBattery: data.batteryPercent,
      stopsNeeded,
      recommendedChargers: recommendedStops,
      arrivalBattery: Math.max(15, Math.round(data.batteryPercent - (totalDistKm / 3.5))),
    };
  }

  async detectFraud(data: {
    userId: string;
    chargerId: string;
    bookingFrequencyLastHour: number;
    paymentMethod: string;
    amount: number;
  }) {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/fraud/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (err: any) {
      logger.warn(`AI Fraud call fallback: ${err.message}`);
    }

    const isHighRisk = data.bookingFrequencyLastHour > 5 || data.amount > 500;
    return {
      isFraudulent: isHighRisk,
      riskScore: isHighRisk ? 85 : 12,
      riskLevel: isHighRisk ? 'HIGH' : 'LOW',
      reasons: isHighRisk ? ['High booking frequency detected within short window'] : ['Normal pattern'],
    };
  }
}

export const aiClient = new AIClientService();
