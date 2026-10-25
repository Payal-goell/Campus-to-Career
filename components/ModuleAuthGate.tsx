'use client';

import Link from 'next/link';
import { Lock, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

/** Soft sign-in prompt for modules that need an account (no silent redirect). */
export function ModuleAuthGate({
  title,
  description,
  nextPath,
}: {
  title: string;
  description: string;
  nextPath: string;
}) {
  const loginHref = `/login?next=${encodeURIComponent(nextPath)}`;
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
      <Card variant="raised" className="p-6 sm:p-8 max-w-md w-full space-y-4 text-center">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-[var(--primary-subtle)] text-[var(--primary)] flex items-center justify-center">
          <Lock className="w-5 h-5" />
        </div>
        <h1 className="text-xl font-black text-[var(--text-primary)]">{title}</h1>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{description}</p>
        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <Button variant="gradient" href={loginHref} className="flex-1">
            Sign in
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
          <Button variant="outline" href={`/register?next=${encodeURIComponent(nextPath)}`} className="flex-1">
            Create account
          </Button>
        </div>
        <p className="text-[11px] text-[var(--text-muted)]">
          Or browse{' '}
          <Link href="/explore" className="text-[var(--primary)] font-semibold hover:underline">
            Explore
          </Link>
          {' '}and{' '}
          <Link href="/campus-life" className="text-[var(--primary)] font-semibold hover:underline">
            Campus Life
          </Link>
          .
        </p>
      </Card>
    </div>
  );
}

/** Shown when a module stays closed until the student finishes onboarding. */
export function BuildProfilePrompt({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const { user } = useAuth();
  const href = user ? '/onboarding' : '/register';
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
      <Card variant="raised" className="p-6 sm:p-8 max-w-md w-full space-y-4 text-center">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-[var(--primary-subtle)] text-[var(--primary)] flex items-center justify-center">
          <Lock className="w-5 h-5" />
        </div>
        <h1 className="text-xl font-black text-[var(--text-primary)]">{title}</h1>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{description}</p>
        <Button variant="gradient" href={href} className="w-full">
          Build your profile
          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
        </Button>
        <p className="text-[11px] text-[var(--text-muted)]">
          Until then,{' '}
          <Link href="/explore" className="text-[var(--primary)] font-semibold hover:underline">
            Explore
          </Link>
          {' '}and{' '}
          <Link href="/campus-life" className="text-[var(--primary)] font-semibold hover:underline">
            Campus Life
          </Link>
          {' '}stay open.
        </p>
      </Card>
    </div>
  );
}

/** Compact banner when a module is in guest preview mode. */
export function GuestPreviewBanner({ nextPath }: { nextPath: string }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <p className="text-xs text-[var(--text-secondary)]">
        Preview mode — sample data so you can explore this module. Sign in to load your own profile.
      </p>
      <Button size="sm" variant="gradient" href={`/login?next=${encodeURIComponent(nextPath)}`}>
        Sign in to personalize
      </Button>
    </div>
  );
}
