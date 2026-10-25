import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';
import { UserRole, UserSession } from './types';
import { prisma } from './prisma';
import { sessionForPayload, readLocalAccounts } from './local-accounts';

const JWT_SECRET = process.env.JWT_SECRET || 'campus-to-career-dev-jwt-secret-key-99887766';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'campus-to-career-dev-refresh-secret-key-11223344';

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function signRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '30d' });
}

export function verifyAccessToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function comparePassword(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

export async function getSessionUser(req: NextRequest): Promise<UserSession | null> {
  let token: string | null = null;

  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  if (!token) {
    const cookie = req.cookies.get('token');
    if (cookie) {
      token = cookie.value;
    }
  }

  if (!token) {
    return null;
  }

  const payload = verifyAccessToken(token);
  if (!payload) {
    return null;
  }

  let user;
  try {
    user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        studentProfile: true,
        coordinator: true,
      },
    });
  } catch (error) {
    console.error('Session lookup failed:', error);
    return sessionForPayload(req, payload);
  }

  if (!user || !user.isVerified) {
    return sessionForPayload(req, payload);
  }

  const local = readLocalAccounts(req).find(
    (account) => account.id === user.id || account.email === user.email
  );
  const savedProfile = Boolean(user.studentProfile) || Boolean(local?.profile);

  return {
    id: user.id,
    email: user.email,
    role: user.role as UserRole,
    isOnboarded: user.isOnboarded || savedProfile || Boolean(local?.isOnboarded),
    name: user.studentProfile?.fullName || local?.profile?.fullName || user.coordinator?.name || user.email.split('@')[0],
    avatarUrl: user.studentProfile?.avatarUrl || local?.profile?.avatarUrl || undefined,
  };
}
