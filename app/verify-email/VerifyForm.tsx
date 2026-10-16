'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';

const DEV_OTP_KEY = 'ctc.otp.dev';

function VerifyEmailForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { verifyOtp } = useAuth();
  const email = (params.get('email') || '').trim().toLowerCase();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(DEV_OTP_KEY);
    if (stored) setDevOtp(stored);
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Open this page from registration so we know which account to verify.');
      return;
    }
    setError('');
    setLoading(true);
    const result = await verifyOtp(email, code.trim());
    setLoading(false);
    if (!result.success) {
      setError(result.error || 'Verification failed');
      return;
    }
    sessionStorage.removeItem(DEV_OTP_KEY);
    setDone(true);
    window.setTimeout(() => {
      router.push(result.isOnboarded ? '/dashboard' : '/onboarding');
    }, 700);
  };

  const handleResend = async () => {
    if (!email) return;
    setError('');
    setInfo('');
    setLoading(true);
    try {
      const res = await fetch('/api/v1/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Could not send a new code');
      } else {
        if (data.devOtp) {
          sessionStorage.setItem(DEV_OTP_KEY, data.devOtp);
          setDevOtp(data.devOtp);
        }
        setInfo(data.message || 'A new code is ready.');
      }
    } catch {
      setError('Network error while requesting a new code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <Card variant="raised" className="p-6 sm:p-8 max-w-md w-full space-y-5 text-center">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-[var(--primary-subtle)] text-[var(--primary)] flex items-center justify-center">
          {done ? <CheckCircle2 className="w-6 h-6" /> : <Mail className="w-6 h-6" />}
        </div>
        <h1 className="text-2xl font-black text-[var(--text-primary)]">
          {done ? 'Account activated' : 'Verify your email'}
        </h1>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          {done
            ? 'Your code matched this account. Taking you to profile setup.'
            : email
              ? `Enter the 6-digit code created for ${email}. It expires in 10 minutes and will not work for any other account.`
              : 'Enter the 6-digit code created for your account. It expires in 10 minutes.'}
        </p>

        {devOtp && !done && (
          <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)] px-3 py-2 text-left text-xs text-[var(--text-secondary)]">
            Mail is not configured on this server, so the code for this account is shown here:{' '}
            <span className="font-mono font-bold tracking-[0.2em] text-[var(--text-primary)]">{devOtp}</span>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-[var(--color-danger-subtle)] text-[var(--color-danger-text)] text-xs flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {info && !error && (
          <p className="text-xs text-[var(--text-secondary)]">{info}</p>
        )}

        {!done ? (
          <form onSubmit={handleVerify} className="space-y-3 text-left">
            <Input
              label="Verification code"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="000000"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            />
            <Button
              type="submit"
              variant="gradient"
              className="w-full"
              loading={loading}
              disabled={code.length !== 6}
            >
              Verify & activate
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={loading || !email}
              onClick={handleResend}
            >
              Send a new code
            </Button>
          </form>
        ) : (
          <Link href="/onboarding">
            <Button variant="gradient" className="w-full">Continue</Button>
          </Link>
        )}
      </Card>
    </div>
  );
}

export function VerifyEmailScreen() {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <VerifyEmailForm />
    </Suspense>
  );
}
