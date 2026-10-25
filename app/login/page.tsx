"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { GraduationCap, Lock, Mail, ArrowRight, AlertCircle, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { safeNextPath } from "@/lib/safe-next";
import { emailError, loginPasswordError } from "@/lib/field-rules";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = safeNextPath(searchParams.get("next"), "/dashboard");
  const { login, quickLogin, user, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const goAfterAuth = (isOnboarded: boolean) => {
    if (!isOnboarded) {
      router.push("/onboarding");
      return;
    }
    router.push(nextPath);
  };

  useEffect(() => {
    if (!authLoading && user) {
      goAfterAuth(user.isOnboarded);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user, router, nextPath]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const submittedEmail = String(data.get("email") || email).trim();
    const submittedPassword = String(data.get("password") || password);
    const nextEmailMessage = emailError(submittedEmail);
    const nextPasswordMessage = loginPasswordError(submittedPassword);
    setEmailMessage(nextEmailMessage);
    setPasswordMessage(nextPasswordMessage);
    setError("");
    if (nextEmailMessage || nextPasswordMessage) return;
    setLoading(true);

    const result = await login(submittedEmail, submittedPassword);
    setLoading(false);

    if (result.needsVerification) {
      if (result.devOtp) {
        sessionStorage.setItem("ctc.otp.dev", result.devOtp);
      }
      router.push(
        `/verify-email?email=${encodeURIComponent(submittedEmail.toLowerCase())}&next=${encodeURIComponent(nextPath)}`
      );
      return;
    }

    if (result.success) {
      goAfterAuth(Boolean(result.isOnboarded));
    } else {
      setError(result.error || "That email and password do not match an account.");
    }
  };

  const demoAccounts = [
    { label: "Aarav Sharma (Y2 CSE, RGPV)", email: "student@college.edu", password: "Password123!", role: "Active Student" },
    { label: "New Student (Setup)", email: "newbie@college.edu", password: "Password123!", role: "Needs Onboarding" },
    { label: "Prof. Meera Joshi (TPO)", email: "sarah.c@college.edu", password: "CoordPass123!", role: "Placement Coordinator" },
    { label: "Campus Admin", email: "admin@college.edu", password: "AdminPass123!", role: "Administrator" },
  ];

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-md">
        <Card variant="raised" className="p-6 sm:p-10 border border-[var(--color-border-subtle)] bg-[var(--color-surface)] shadow-xl space-y-6">
          <div className="text-center space-y-2.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] p-3 mx-auto flex items-center justify-center shadow-lg shadow-[var(--color-brand-primary)]/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[var(--color-text-primary)] tracking-tight">Welcome Back</h1>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Sign in to access your student dashboard and career roadmap
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-[var(--color-danger-subtle)] border border-[var(--color-danger-border)] text-[var(--color-danger-text)] text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-[var(--color-danger)]" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="College Email Address *"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="name@sistec.ac.in"
              value={email}
              error={emailMessage}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailMessage("");
              }}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Password *"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••••••"
              value={password}
              error={passwordMessage}
              hint="This must be the password saved for this email."
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordMessage("");
              }}
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <Button
              type="submit"
              variant="gradient"
              loading={loading}
              className="w-full mt-2 py-3 shadow-md shadow-[var(--color-brand-primary)]/20"
            >
              Sign In to Campus to Career
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          {/* 1-Click Demo Profiles */}
          <div className="pt-5 border-t border-[var(--color-border-subtle)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                1-Click Instant Demo Access:
              </span>
              <Badge variant="accent" size="sm">Demo Mode</Badge>
            </div>
            <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-2.5">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={async () => {
                    const result = await quickLogin(acc.email, acc.password);
                    if (!result.success && !result.needsVerification) {
                      setError(result.error || "Could not sign in");
                    }
                  }}
                  className="p-2.5 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)] hover:border-[var(--color-border-focus)] hover:bg-[var(--color-surface-overlay)] text-left transition-all text-xs group"
                >
                  <span className="font-semibold text-[var(--color-text-primary)] block text-xs truncate group-hover:text-[var(--color-brand-primary)]">
                    {acc.label}
                  </span>
                  <span className="text-[10px] text-[var(--color-text-muted)] font-mono block">
                    {acc.role}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="text-center text-xs text-[var(--color-text-secondary)] pt-1">
            Don&apos;t have an account yet?{" "}
            <Link
              href={`/register?next=${encodeURIComponent(nextPath)}`}
              className="text-[var(--color-brand-primary)] font-semibold hover:underline"
            >
              Register here
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[85vh]" />}>
      <LoginForm />
    </Suspense>
  );
}
