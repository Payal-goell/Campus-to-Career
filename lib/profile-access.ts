import type { UserSession } from '@/lib/types';

/** A student profile exists after onboarding. Staff accounts keep the full campus tools. */
export function hasStudentProfile(user: UserSession | null | undefined): boolean {
  if (!user) return false;
  if (user.role === 'ADMIN' || user.role === 'COORDINATOR') return true;
  return user.isOnboarded;
}
