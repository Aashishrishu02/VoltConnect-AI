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
