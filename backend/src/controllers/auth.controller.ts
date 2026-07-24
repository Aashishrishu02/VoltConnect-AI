import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma';
import { generateTokens, verifyRefreshToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, name, phone } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required.' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Every single new user automatically gets DRIVER role!
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        phone,
        roles: ['DRIVER'],
        wallet: {
          create: { balance: 2500.0, currency: 'INR' },
        },
      },
      include: { wallet: true },
    });

    const tokens = generateTokens({ userId: user.id, email: user.email, roles: user.roles as string[] });

    res.status(201).json({
      message: 'Registration successful! Welcome bonus ₹2,500 added to wallet.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles,
        wallet: user.wallet,
      },
      ...tokens,
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { wallet: true },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const tokens = generateTokens({ userId: user.id, email: user.email, roles: user.roles as string[] });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles,
        avatar: user.avatar,
        wallet: user.wallet,
      },
      ...tokens,
    });
  } catch (err) {
    next(err);
  }
}

export async function googleLogin(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, name, googleId, avatar } = req.body;

    if (!email || !googleId) {
      return res.status(400).json({ error: 'Email and googleId required.' });
    }

    let user = await prisma.user.findUnique({ where: { email }, include: { wallet: true } });

    if (!user) {
      const dummyPassword = await bcrypt.hash(Math.random().toString(), 10);
      user = await prisma.user.create({
        data: {
          email,
          name: name || 'Google User',
          googleId,
          avatar,
          passwordHash: dummyPassword,
          roles: ['DRIVER'],
          emailVerified: true,
          wallet: {
            create: { balance: 2500.0, currency: 'INR' },
          },
        },
        include: { wallet: true },
      });
    }

    const tokens = generateTokens({ userId: user.id, email: user.email, roles: user.roles as string[] });

    res.json({
      message: 'Google authentication successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles,
        avatar: user.avatar,
        wallet: user.wallet,
      },
      ...tokens,
    });
  } catch (err) {
    next(err);
  }
}

export async function refreshToken(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required.' });
    }

    const payload = verifyRefreshToken(refreshToken);
    const tokens = generateTokens({ userId: payload.userId, email: payload.email, roles: payload.roles });

    res.json(tokens);
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired refresh token.' });
  }
}

export async function getProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        wallet: true,
        _count: { select: { bookings: true, chargers: true, reviews: true } },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const { passwordHash, ...safeUser } = user;
    res.json(safeUser);
  } catch (err) {
    next(err);
  }
}
