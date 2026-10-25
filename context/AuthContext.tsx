'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole, UserSession } from '@/lib/types';
import { markProfileReadyLocal, profileMarkedReady } from '@/lib/saved-profile';
import { useRouter } from 'next/navigation';

interface AuthResult {
  success: boolean;
  error?: string;
  isOnboarded?: boolean;
  needsVerification?: boolean;
  devOtp?: string;
}

interface AuthContextType {
  user: UserSession | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (email: string, password: string, role?: UserRole) => Promise<AuthResult>;
  verifyOtp: (email: string, otp: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  markProfileReady: () => void;
  quickLogin: (email: string, password: string) => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/v1/auth/me');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.user) {
          const ready = profileMarkedReady(json.user.id);
          setUser(ready ? { ...json.user, isOnboarded: true } : json.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const markProfileReady = () => {
    setUser((current) => {
      if (current) markProfileReadyLocal(current.id);
      return current ? { ...current, isOnboarded: true } : current;
    });
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.needsVerification) {
        return {
          success: false,
          needsVerification: true,
          error: data.error || 'Verify the code sent to your email',
          devOtp: data.devOtp,
        };
      }

      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Failed to sign in' };
      }

      const onboarded = Boolean(data.user.isOnboarded) || profileMarkedReady(data.user.id);
      setUser(onboarded ? { ...data.user, isOnboarded: true } : data.user);
      return { success: true, isOnboarded: onboarded };
    } catch {
      return { success: false, error: 'Network error during login' };
    }
  };

  const register = async (email: string, password: string, role: UserRole = 'STUDENT') => {
    try {
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Registration failed' };
      }

      return { success: true, devOtp: data.devOtp };
    } catch {
      return { success: false, error: 'Network error during registration' };
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    try {
      const res = await fetch('/api/v1/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Verification failed' };
      }
      const onboarded = Boolean(data.user.isOnboarded) || profileMarkedReady(data.user.id);
      setUser(onboarded ? { ...data.user, isOnboarded: true } : data.user);
      return { success: true, isOnboarded: onboarded };
    } catch {
      return { success: false, error: 'Network error during verification' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/v1/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    setUser(null);
    router.push('/login');
  };

  const quickLogin = async (email: string, password: string) => {
    setIsLoading(true);
    const result = await login(email, password);
    const next =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('next')
        : null;
    const dest = (() => {
      if (!next || !next.startsWith('/') || next.startsWith('//') || next.includes('://')) {
        return '/dashboard';
      }
      if (next.startsWith('/login') || next.startsWith('/register') || next.startsWith('/verify-email')) {
        return '/dashboard';
      }
      return next;
    })();
    if (result.needsVerification) {
      router.push(
        `/verify-email?email=${encodeURIComponent(email.trim().toLowerCase())}&next=${encodeURIComponent(dest)}`
      );
    } else if (result.success) {
      router.push(result.isOnboarded ? dest : '/onboarding');
    }
    setIsLoading(false);
    return result;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        verifyOtp,
        logout,
        refreshUser: fetchSession,
        markProfileReady,
        quickLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
