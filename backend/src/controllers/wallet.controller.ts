import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth';

export async function getWallet(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    let wallet = await prisma.wallet.findUnique({
      where: { userId },
      include: {
        transactions: { orderBy: { createdAt: 'desc' }, take: 20 },
      },
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: { userId: userId!, balance: 0.0 },
        include: { transactions: true },
      });
    }

    res.json(wallet);
  } catch (err) {
    next(err);
  }
}

export async function topUpWallet(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    const { amount, paymentMethod = 'STRIPE' } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid top up amount is required.' });
    }

    let wallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) {
      wallet = await prisma.wallet.create({ data: { userId: userId!, balance: 0.0 } });
    }

    const updated = await prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance: { increment: parseFloat(amount) } },
    });

    await prisma.transaction.create({
      data: {
        walletId: wallet.id,
        type: 'DEPOSIT',
        amount: parseFloat(amount),
        description: `Wallet top-up via ${paymentMethod}`,
      },
    });

    res.json({ message: 'Wallet top-up successful!', balance: updated.balance });
  } catch (err) {
    next(err);
  }
}

export async function withdrawWallet(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid withdrawal amount is required.' });
    }

    const wallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance for withdrawal.' });
    }

    const updated = await prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance: { decrement: parseFloat(amount) } },
    });

    await prisma.transaction.create({
      data: {
        walletId: wallet.id,
        type: 'WITHDRAWAL',
        amount: parseFloat(amount),
        description: 'Withdrawal to bank account',
      },
    });

    res.json({ message: 'Withdrawal request processed successfully!', balance: updated.balance });
  } catch (err) {
    next(err);
  }
}
