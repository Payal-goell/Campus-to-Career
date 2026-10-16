"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { GraduationCap, Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
const DEV_OTP_KEY = "ctc.otp.dev";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await register(email, password, "STUDENT");
    setLoading(false);

    if (result.success) {
      if (result.devOtp) {
        sessionStorage.setItem(DEV_OTP_KEY, result.devOtp);
      } else {
        sessionStorage.removeItem(DEV_OTP_KEY);
      }
      router.push(`/verify-email?email=${encodeURIComponent(email.trim().toLowerCase())}`);
    } else {
      setError(result.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-md">
        <Card variant="raised" className="p-6 sm:p-10 border border-[var(--color-border-subtle)] bg-[var(--color-surface)] shadow-xl space-y-6">
          <div className="text-center space-y-2.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] p-3 mx-auto flex items-center justify-center shadow-lg shadow-[var(--color-brand-primary)]/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[var(--color-text-primary)] tracking-tight">Create Account</h1>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Join the Campus to Career university platform
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-[var(--color-danger-subtle)] border border-[var(--color-danger-border)] text-[var(--color-danger-text)] text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-[var(--color-danger)]" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              Student accounts only. After you submit, a one-time code is created for this email. The account stays locked until that code is entered.
            </p>

            <Input
              label="College Email Address"
              type="email"
              required
              placeholder="aarav.sharma@uitrgpv.ac.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Password (Min 6 characters)"
              type="password"
              required
              minLength={6}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <Button
              type="submit"
              variant="gradient"
              loading={loading}
              className="w-full mt-2 py-3 shadow-md shadow-[var(--color-brand-primary)]/20"
            >
              Email me a verification code
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          <div className="text-center text-xs text-[var(--color-text-secondary)] pt-2 border-t border-[var(--color-border-subtle)]">
            Already registered?{" "}
            <Link href="/login" className="text-[var(--color-brand-primary)] font-semibold hover:underline">
              Sign in here
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
