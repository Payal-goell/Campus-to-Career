"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { GraduationCap, Lock, Mail, ArrowRight, AlertCircle, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function LoginPage() {
  const router = useRouter();
  const { login, quickLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.needsVerification) {
      if (result.devOtp) {
        sessionStorage.setItem("ctc.otp.dev", result.devOtp);
      }
      router.push(`/verify-email?email=${encodeURIComponent(email.trim().toLowerCase())}`);
      return;
    }

    if (result.success) {
      if (result.isOnboarded) {
        router.push("/dashboard");
      } else {
        router.push("/onboarding");
      }
    } else {
      setError(result.error || "Invalid credentials");
    }
  };

  const demoAccounts = [
    { label: "Aarav Sharma (Y2 CSE, UIT-RGPV)", email: "student@college.edu", password: "Password123!", role: "Active Student" },
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
              label="College Email Address"
              type="email"
              required
              placeholder="aarav.sharma@uitrgpv.ac.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Password
                </label>
                <span className="text-xs text-[var(--color-brand-primary)] hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <Input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
              />
            </div>

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
                  onClick={() => quickLogin(acc.email, acc.password)}
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
            <Link href="/register" className="text-[var(--color-brand-primary)] font-semibold hover:underline">
              Register here
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
