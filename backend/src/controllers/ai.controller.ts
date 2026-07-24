import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';

export async function processAIChatQuery(req: Request, res: Response, next: NextFunction) {
  try {
    const { message, userLat = 12.9716, userLng = 77.5946, vehicleModel = 'Tata Nexon EV Max' } = req.body;
    const lower = (message || '').toLowerCase();

    let reply = '';
    let suggestedChargers: any[] = [];

    if (lower.includes('cheap') || lower.includes('lowest price') || lower.includes('cost')) {
      const cheapest = await prisma.charger.findMany({
        where: { status: 'APPROVED', isAvailable: true },
        orderBy: { pricePerHour: 'asc' },
        take: 2,
      });

      suggestedChargers = cheapest;
      reply = `⚡ I found the cheapest EV chargers near your location in India starting at ₹120/hr! Top recommendation: ${cheapest[0]?.title || 'Indiranagar Fast CCS2 Station'}.`;
    } else if (lower.includes('fast') || lower.includes('speed') || lower.includes('supercharger')) {
      const fastest = await prisma.charger.findMany({
        where: { status: 'APPROVED', isAvailable: true },
        orderBy: { powerKw: 'desc' },
        take: 2,
      });

      suggestedChargers = fastest;
      reply = `🚀 High-Speed DC Fast Chargers detected! Top recommendation: ${fastest[0]?.title || 'BKC Supercharge Hub 150kW'} delivering up to 150 kW DC fast charging.`;
    } else if (lower.includes('plan') || lower.includes('trip') || lower.includes('route') || lower.includes('delhi') || lower.includes('jaipur')) {
      reply = `🛣️ AI Trip Route Plan Generated for ${vehicleModel}!\n- Route: Delhi to Jaipur Highway (280 km)\n- Required Stop: Neemrana 60kW DC Fast Charger (Stop 1 at 120 km)\n- Estimated Charging Duration: 25 minutes\n- Arrival Battery SOC: 42%`;
    } else if (lower.includes('compatible') || lower.includes('nexon') || lower.includes('plug')) {
      reply = `✅ Compatibility Confirmed for ${vehicleModel}!\nYour EV uses standard CCS2 / Type 2 Mennekes plugs which are 100% compatible with 98% of VoltConnect AI network chargers across India.`;
    } else {
      reply = `🤖 Hello! I am VoltConnect AI, your smart EV Mobility Assistant.\nI can help you find cheap or fast chargers, estimate charging costs in ₹, plan highway trips (e.g. Delhi to Jaipur, Bengaluru to Mysuru), or check vehicle compatibility!`;
    }

    res.json({
      reply,
      suggestedChargers,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
}

export async function getSmartRecommendations(req: Request, res: Response, next: NextFunction) {
  try {
    const { userLat = 12.9716, userLng = 77.5946, batterySoc = 35, vehicleModel = 'Tata Nexon EV' } = req.body;

    const chargers = await prisma.charger.findMany({
      where: { status: 'APPROVED', isAvailable: true },
      take: 10,
    });

    const scored = chargers.map((c) => {
      // Score algorithm (0-100)
      const distScore = Math.max(0, 40 - c.latitude * 0.1);
      const speedScore = Math.min(30, (c.powerKw / 150) * 30);
      const ratingScore = (c.averageRating / 5) * 30;
      const totalScore = Math.min(99, Math.round(distScore + speedScore + ratingScore));

      return {
        chargerId: c.id,
        aiScore: totalScore,
        estimatedWaitMin: c.liveStatus === 'CHARGING' ? 14 : 0,
        reason: `Ideal ${c.powerKw}kW ${c.connectorType.replace('_', ' ')} match for ${vehicleModel} at ₹${c.pricePerHour}/hr`,
        charger: c,
      };
    }).sort((a, b) => b.aiScore - a.aiScore);

    res.json(scored);
  } catch (err) {
    next(err);
  }
}

export async function planEVRoute(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      startCity = 'Bengaluru',
      destCity = 'Mysuru',
      vehicleModel = 'Tata Nexon EV Max (437 km)',
      batteryPercent = 35,
      maxRangeKm = 350,
    } = req.body;

    // Calculate intelligent highway trip metrics
    const routeDatabase: Record<string, { distanceKm: number; defaultStops: any[] }> = {
      bengaluru_mysuru: {
        distanceKm: 145,
        defaultStops: [
          {
            stopIndex: 1,
            name: 'Mandya Expressway 100kW DC Fast Charging Hub',
            location: 'Mandya Highway Toll Plaza, NH 275',
            distFromOriginKm: 85,
            powerKw: 100,
            connectorType: 'CCS_2',
            chargeMin: 20,
            startBatteryPercent: Math.max(12, Math.round(batteryPercent - (85 / maxRangeKm) * 100)),
            endBatteryPercent: 80,
            priceEst: '₹180',
          },
        ],
      },
      delhi_jaipur: {
        distanceKm: 280,
        defaultStops: [
          {
            stopIndex: 1,
            name: 'Neemrana 60kW DC Fast Charge Oasis',
            location: 'Neemrana Food Court, NH 48',
            distFromOriginKm: 125,
            powerKw: 60,
            connectorType: 'CCS_2',
            chargeMin: 28,
            startBatteryPercent: Math.max(15, Math.round(batteryPercent - (125 / maxRangeKm) * 100)),
            endBatteryPercent: 85,
            priceEst: '₹240',
          },
        ],
      },
      mumbai_pune: {
        distanceKm: 150,
        defaultStops: [
          {
            stopIndex: 1,
            name: 'Lonavala Expressway Supercharge Hub 150kW',
            location: 'Khalapur Toll Plaza, Mumbai-Pune Expressway',
            distFromOriginKm: 70,
            powerKw: 150,
            connectorType: 'CCS_2',
            chargeMin: 15,
            startBatteryPercent: Math.max(18, Math.round(batteryPercent - (70 / maxRangeKm) * 100)),
            endBatteryPercent: 85,
            priceEst: '₹210',
          },
        ],
      },
    };

    const key = `${startCity.toLowerCase().split(',')[0].trim()}_${destCity.toLowerCase().split(',')[0].trim()}`;
    const routeData = routeDatabase[key] || {
      distanceKm: 220,
      defaultStops: [
        {
          stopIndex: 1,
          name: `${startCity.split(',')[0]} Expressway Fast Charger 100kW`,
          location: `Midway Plaza, Highway NH-44`,
          distFromOriginKm: 110,
          powerKw: 100,
          connectorType: 'CCS_2',
          chargeMin: 22,
          startBatteryPercent: Math.max(15, Math.round(batteryPercent - (110 / maxRangeKm) * 100)),
          endBatteryPercent: 80,
          priceEst: '₹190',
        },
      ],
    };

    const totalDistanceKm = routeData.distanceKm;
    const drivingTimeMin = Math.round((totalDistanceKm / 75) * 60);
    const chargingTimeMin = routeData.defaultStops.reduce((sum, s) => sum + s.chargeMin, 0);
    const estimatedTripMin = drivingTimeMin + chargingTimeMin;

    const stopsNeeded = batteryPercent < 45 || totalDistanceKm > maxRangeKm * 0.5 ? routeData.defaultStops.length : 0;
    const recommendedStops = stopsNeeded > 0 ? routeData.defaultStops : [];

    const arrivalBattery = Math.min(
      95,
      Math.max(22, Math.round(batteryPercent - (totalDistanceKm / maxRangeKm) * 100 + (stopsNeeded > 0 ? 55 : 0)))
    );

    res.json({
      startCity,
      destCity,
      vehicleModel,
      totalDistanceKm,
      estimatedTripMin,
      drivingTimeMin,
      chargingTimeMin,
      stopsNeeded,
      arrivalBattery,
      recommendedStops,
    });
  } catch (err) {
    next(err);
  }
}
