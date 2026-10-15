'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function VerifyEmailPage() {
  const [code, setCode] = useState('');
  const [done, setDone] = useState(false);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <Card variant="raised" className="p-8 max-w-md w-full space-y-5 text-center">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-[var(--primary-subtle)] text-[var(--primary)] flex items-center justify-center">
          {done ? <CheckCircle2 className="w-6 h-6" /> : <Mail className="w-6 h-6" />}
        </div>
        <h1 className="text-2xl font-black text-[var(--text-primary)]">
          {done ? 'Account activated' : 'Verify your email'}
        </h1>
        <p className="text-xs text-[var(--text-secondary)]">
          {done
            ? 'Continue to first-time onboarding to generate your profile.'
            : 'Enter the 6-digit code sent to your college email to activate the account.'}
        </p>
        {!done ? (
          <>
            <Input
              label="Verification code"
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <Button
              variant="gradient"
              className="w-full"
              disabled={code.trim().length < 4}
              onClick={() => setDone(true)}
            >
              Verify & activate
            </Button>
          </>
        ) : (
          <Link href="/onboarding">
            <Button variant="gradient" className="w-full">Start onboarding</Button>
          </Link>
        )}
      </Card>
    </div>
  );
}
