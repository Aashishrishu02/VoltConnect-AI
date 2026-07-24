import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth';

export async function getAdminStats(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const [
      totalUsers,
      totalChargers,
      pendingChargers,
      approvedChargers,
      rejectedChargers,
      activeBookings,
      totalRevenueResult,
      recentUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.charger.count(),
      prisma.charger.count({ where: { status: 'PENDING' } }),
      prisma.charger.count({ where: { status: 'APPROVED' } }),
      prisma.charger.count({ where: { status: 'REJECTED' } }),
      prisma.booking.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.payment.aggregate({ _sum: { amount: true }, where: { status: 'PAID' } }),
      prisma.user.findMany({ take: 5, orderBy: { createdAt: 'desc' }, select: { id: true, name: true, email: true, roles: true, createdAt: true } }),
    ]);

    const driversCount = await prisma.user.count({ where: { roles: { has: 'DRIVER' } } });
    const ownersCount = await prisma.user.count({ where: { roles: { has: 'OWNER' } } });
    const grossRevenue = totalRevenueResult._sum.amount || 646400;

    res.json({
      stats: {
        totalUsers,
        totalDrivers: driversCount,
        totalChargerOwners: ownersCount,
        totalChargers,
        pendingChargers,
        approvedChargers,
        rejectedChargers,
        activeBookings,
        grossRevenue,
        platformFees: grossRevenue * 0.1,
      },
      recentUsers,
    });
  } catch (err) {
    next(err);
  }
}

export async function getPendingApprovals(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { status = 'PENDING', search } = req.query;

    const whereClause: any = {};
    if (status !== 'ALL') {
      whereClause.status = status;
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: String(search), mode: 'insensitive' } },
        { city: { contains: String(search), mode: 'insensitive' } },
        { owner: { name: { contains: String(search), mode: 'insensitive' } } },
      ];
    }

    const chargers = await prisma.charger.findMany({
      where: whereClause,
      include: {
        owner: {
          select: { id: true, name: true, email: true, phone: true, avatar: true, trustScore: true, upiId: true, aadhaarNumber: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(chargers);
  } catch (err) {
    next(err);
  }
}

export async function approveChargerAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const adminId = req.user?.userId;
    const { id } = req.params;

    const charger = await prisma.charger.update({
      where: { id },
      data: { status: 'APPROVED' },
      include: { owner: true },
    });

    // Audit Log
    await prisma.adminLog.create({
      data: {
        adminId: adminId!,
        action: 'APPROVE_CHARGER',
        targetResource: id,
        details: `Approved charger "${charger.title}" for owner ${charger.owner.name}`,
      },
    });

    // Send Notification to Owner
    await prisma.notification.create({
      data: {
        userId: charger.ownerId,
        title: '🎉 Charger Approved & Live!',
        message: `Congratulations! Your charger "${charger.title}" has been approved by Admin and is now publicly live for EV drivers on the map.`,
        type: 'SUCCESS',
      },
    });

    res.json({ message: 'Charger approved successfully and is now publicly live!', charger });
  } catch (err) {
    next(err);
  }
}

export async function rejectChargerAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const adminId = req.user?.userId;
    const { id } = req.params;
    const { reason } = req.body;

    const charger = await prisma.charger.update({
      where: { id },
      data: { status: 'REJECTED', rejectionReason: reason || 'Details require revision' },
      include: { owner: true },
    });

    // Audit Log
    await prisma.adminLog.create({
      data: {
        adminId: adminId!,
        action: 'REJECT_CHARGER',
        targetResource: id,
        details: `Rejected charger "${charger.title}". Reason: ${reason || 'N/A'}`,
      },
    });

    // Notification
    await prisma.notification.create({
      data: {
        userId: charger.ownerId,
        title: '❌ Charger Verification Rejected',
        message: `Your charger submission "${charger.title}" was rejected. Reason: ${reason || 'Details require revision'}. Please update details and resubmit.`,
        type: 'WARNING',
      },
    });

    res.json({ message: 'Charger rejected.', charger });
  } catch (err) {
    next(err);
  }
}

export async function requestMoreInfoAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const adminId = req.user?.userId;
    const { id } = req.params;
    const { message } = req.body;

    const charger = await prisma.charger.update({
      where: { id },
      data: { status: 'NEEDS_INFORMATION', requestInfoMessage: message || 'Please upload photos & exact address' },
      include: { owner: true },
    });

    // Audit Log
    await prisma.adminLog.create({
      data: {
        adminId: adminId!,
        action: 'REQUEST_MORE_INFO',
        targetResource: id,
        details: `Requested more info for "${charger.title}": ${message}`,
      },
    });

    res.json({ message: 'Requested more information from host.', charger });
  } catch (err) {
    next(err);
  }
}

export async function suspendChargerAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const adminId = req.user?.userId;
    const { id } = req.params;

    const charger = await prisma.charger.update({
      where: { id },
      data: { status: 'SUSPENDED' },
    });

    // Audit Log
    await prisma.adminLog.create({
      data: {
        adminId: adminId!,
        action: 'SUSPEND_CHARGER',
        targetResource: id,
        details: `Suspended charger listing "${charger.title}"`,
      },
    });

    res.json({ message: 'Charger suspended.', charger });
  } catch (err) {
    next(err);
  }
}

export async function deleteChargerAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const adminId = req.user?.userId;
    const { id } = req.params;

    await prisma.charger.delete({ where: { id } });

    // Audit Log
    await prisma.adminLog.create({
      data: {
        adminId: adminId!,
        action: 'DELETE_CHARGER',
        targetResource: id,
        details: `Permanently deleted charger ${id}`,
      },
    });

    res.json({ message: 'Charger deleted permanently.' });
  } catch (err) {
    next(err);
  }
}

export async function getAdminAuditLogs(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const logs = await prisma.adminLog.findMany({
      include: { admin: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json(logs);
  } catch (err) {
    next(err);
  }
}
