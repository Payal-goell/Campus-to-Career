'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import type { DashboardOverview } from '@/lib/types';

export function useStudentHub() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user && !user.isOnboarded) {
      router.push('/onboarding');
      return;
    }
    if (!user) return;

    const run = async () => {
      try {
        const res = await fetch('/api/v1/dashboard/student');
        const json = await res.json();
        if (json.success) setData(json);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [user, authLoading, router]);

  return { user, data, loading: authLoading || loading };
}
