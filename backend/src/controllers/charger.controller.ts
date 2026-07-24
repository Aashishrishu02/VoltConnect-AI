import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth';
import { emitChargerUpdate } from '../services/socket.service';

export async function searchChargers(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      city,
      lat,
      lng,
      radiusKm = 50,
      chargerType,
      connectorType,
      minPowerKw,
      maxPrice,
      minRating,
      isAvailable,
      includePending,
    } = req.query;

    const whereClause: any = {};

    // Drivers ONLY see APPROVED chargers!
    if (includePending !== 'true') {
      whereClause.status = 'APPROVED';
    }

    if (city) {
      whereClause.city = { contains: String(city), mode: 'insensitive' };
    }

    if (chargerType) {
      whereClause.chargerType = String(chargerType);
    }

    if (connectorType) {
      whereClause.connectorType = String(connectorType);
    }

    if (minPowerKw) {
      whereClause.powerKw = { gte: parseFloat(String(minPowerKw)) };
    }

    if (maxPrice) {
      whereClause.pricePerHour = { lte: parseFloat(String(maxPrice)) };
    }

    if (minRating) {
      whereClause.averageRating = { gte: parseFloat(String(minRating)) };
    }

    if (isAvailable !== undefined) {
      whereClause.isAvailable = isAvailable === 'true';
    }

    const chargers = await prisma.charger.findMany({
      where: whereClause,
      include: {
        owner: { select: { id: true, name: true, avatar: true, rating: true, trustScore: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (lat && lng) {
      const userLat = parseFloat(String(lat));
      const userLng = parseFloat(String(lng));
      const rKm = parseFloat(String(radiusKm));

      const filtered = chargers.map((c) => {
        const dLat = (c.latitude - userLat) * (Math.PI / 180);
        const dLng = (c.longitude - userLng) * (Math.PI / 180);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(userLat * (Math.PI / 180)) *
            Math.cos(c.latitude * (Math.PI / 180)) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
        const distanceKm = 6371 * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));

        return { ...c, distanceKm: Math.round(distanceKm * 10) / 10 };
      }).filter((c) => c.distanceKm <= rKm);

      return res.json(filtered.sort((a, b) => a.distanceKm - b.distanceKm));
    }

    res.json(chargers);
  } catch (err) {
    next(err);
  }
}

export async function getChargerById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const charger = await prisma.charger.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, email: true, phone: true, avatar: true, rating: true, trustScore: true } },
        availabilitySlots: true,
        reviews: {
          include: { user: { select: { name: true, avatar: true } } },
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!charger) {
      return res.status(404).json({ error: 'Charger not found.' });
    }

    res.json(charger);
  } catch (err) {
    next(err);
  }
}

export async function createCharger(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const ownerId = req.user?.userId;
    const {
      title,
      description,
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
      latitude,
      longitude,
      pricePerHour,
      pricePerKwh,
      pricingType,
      powerKw,
      chargerType,
      connectorType,
      operates24_7,
      amenities,
      photos,
    } = req.body;

    if (!title || !street || !city || !latitude || !longitude || !pricePerHour) {
      return res.status(400).json({ error: 'Title, street, city, coordinates, and price per hour are required.' });
    }

    // Create Charger with PENDING approval status
    const charger = await prisma.charger.create({
      data: {
        ownerId: ownerId!,
        title,
        description: description || 'P2P EV Charging station on ChargeMitra',
        brand: brand || 'Tata Power / Custom',
        model: model || 'Standard EV AC/DC',
        propertyType: propertyType || 'HOME',
        status: 'PENDING', // MUST be pending until Admin approves!
        houseNumber,
        street,
        area,
        landmark,
        city: city || 'Bengaluru',
        state: state || 'Karnataka',
        pinCode: pinCode || '560001',
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        pricingType: pricingType || 'PER_HOUR',
        pricePerHour: parseFloat(pricePerHour),
        pricePerKwh: pricePerKwh ? parseFloat(pricePerKwh) : 15.0,
        powerKw: powerKw ? parseFloat(powerKw) : 7.2,
        chargerType: chargerType || 'FAST_AC',
        connectorType: connectorType || 'CCS_2',
        operates24_7: operates24_7 !== undefined ? operates24_7 : true,
        amenities: amenities || ['CCTV', 'Covered Parking'],
        photos: photos || ['https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop'],
      },
      include: { owner: true },
    });

    // Automatically assign OWNER role to user's roles array if not already present
    const currentUser = await prisma.user.findUnique({ where: { id: ownerId } });
    if (currentUser && !currentUser.roles.includes('OWNER')) {
      await prisma.user.update({
        where: { id: ownerId },
        data: { roles: { push: 'OWNER' } },
      });
    }

    res.status(201).json({
      message: 'Charger submitted successfully! Status is PENDING admin approval.',
      charger,
    });
  } catch (err) {
    next(err);
  }
}

export async function approveCharger(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const charger = await prisma.charger.update({
      where: { id },
      data: { status: 'APPROVED' },
    });
    emitChargerUpdate(id, { status: 'APPROVED' });
    res.json({ message: 'Charger approved successfully!', charger });
  } catch (err) {
    next(err);
  }
}

export async function rejectCharger(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const charger = await prisma.charger.update({
      where: { id },
      data: { status: 'REJECTED', rejectionReason: reason || 'Listing details require revision' },
    });
    res.json({ message: 'Charger rejected.', charger });
  } catch (err) {
    next(err);
  }
}

export async function updateCharger(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const ownerId = req.user?.userId;
    const charger = await prisma.charger.updateMany({
      where: { id, ownerId },
      data: req.body,
    });
    res.json({ message: 'Charger updated successfully', charger });
  } catch (err) {
    next(err);
  }
}

export async function getOwnerChargers(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const ownerId = req.user?.userId;
    const chargers = await prisma.charger.findMany({
      where: { ownerId },
      include: {
        bookings: {
          include: { user: { select: { name: true, email: true } } },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        _count: { select: { bookings: true, reviews: true } },
      },
    });

    res.json(chargers);
  } catch (err) {
    next(err);
  }
}
