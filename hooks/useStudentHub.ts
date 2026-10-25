'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { demoStudentDashboard } from '@/lib/demo-accounts';
import { savedProfileFor } from '@/lib/saved-profile';
import type { DashboardOverview } from '@/lib/types';

type Options = {
  /**
   * When true, do not load guest preview — caller should show ModuleAuthGate.
   * When false (default), open the module with sample skill/dashboard data like Roadmap.
   */
  requireAuth?: boolean;
};

export function useStudentHub(options: Options = {}) {
  const { requireAuth = false } = options;
  const { user, isLoading: authLoading } = useAuth();
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      if (requireAuth) {
        setData(null);
        setIsGuest(false);
        setLoading(false);
        return;
      }
      // Browseable modules (Skills, Analytics) — same spirit as Roadmap for guests
      setData(demoStudentDashboard() as DashboardOverview);
      setIsGuest(true);
      setLoading(false);
      return;
    }

    if (!user.isOnboarded && requireAuth && !savedProfileFor(user.id)) {
      setData(null);
      setIsGuest(false);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/v1/dashboard/student');
        const json = await res.json();
        if (cancelled) return;
        if (json.success) {
          setData(json);
          setIsGuest(false);
        } else {
          const cached = savedProfileFor(user.id);
          if (cached) {
            setData(cached);
            setIsGuest(false);
          } else if (!requireAuth) {
            setData(demoStudentDashboard() as DashboardOverview);
            setIsGuest(true);
          } else {
            setData(null);
          }
        }
      } catch (e) {
        console.error(e);
        if (cancelled) return;
        const cached = savedProfileFor(user.id);
        if (cached) {
          setData(cached);
          setIsGuest(false);
        } else if (!requireAuth) {
          setData(demoStudentDashboard() as DashboardOverview);
          setIsGuest(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [user, authLoading, requireAuth]);

  const needsAuth = !authLoading && !user && requireAuth;
  const needsOnboarding = Boolean(
    user && !user.isOnboarded && requireAuth && !savedProfileFor(user.id)
  );

  return {
    user,
    data,
    loading: authLoading || loading,
    isGuest,
    needsAuth,
    needsOnboarding,
  };
}
