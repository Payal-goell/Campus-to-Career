'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Compass, GraduationCap, Map, BookOpen, Users, Briefcase,
  Shield, Bell, Menu, X, LogOut, Sparkles, ChevronDown,
  UserCheck, MoreHorizontal, User, Wrench, FolderKanban, Medal,
  Bot, BarChart3, FileText, MessageSquare, Heart,
} from 'lucide-react';
import { NotificationDrawer } from './NotificationDrawer';
import { ThemeToggle } from './ui/ThemeToggle';
import { ThemeStudio } from './ThemeStudio';
import { Avatar } from './ui/Avatar';
import { cn } from '@/lib/cn';
import { useRoadmapOptional } from '@/context/RoadmapContext';
import { ROADMAP_PERSONAS } from '@/lib/roadmap/personas';

const publicLinks = [
  { name: 'Explore', href: '/explore', icon: Compass, requireAuth: false },
  { name: 'Resources', href: '/resources', icon: BookOpen, requireAuth: false },
];

const coreLinks = [
  { name: 'Dashboard', href: '/dashboard', icon: Compass, requireAuth: true },
  { name: 'Profile', href: '/profile', icon: User, requireAuth: true },
  { name: 'Explore', href: '/explore', icon: Compass, requireAuth: false },
  { name: 'Skills', href: '/skills', icon: Wrench, requireAuth: true },
  { name: 'Roadmap', href: '/roadmap', icon: Map, requireAuth: true },
  { name: 'Resources', href: '/resources', icon: BookOpen, requireAuth: false },
  { name: 'Projects', href: '/projects', icon: FolderKanban, requireAuth: true },
  { name: 'Certifications', href: '/certifications', icon: Medal, requireAuth: true },
  { name: 'AI Tools', href: '/ai-tools', icon: Bot, requireAuth: true },
];

const supportingLinks = [
  { name: 'Campus Life', href: '/campus-life', icon: Users, requireAuth: false },
  { name: 'Training', href: '/training', icon: Sparkles, requireAuth: true },
  { name: 'Personality', href: '/personality', icon: Heart, requireAuth: true },
  { name: 'Resume', href: '/resume', icon: FileText, requireAuth: true },
  { name: 'Interview', href: '/interview', icon: MessageSquare, requireAuth: true },
  { name: 'Placement', href: '/placement', icon: Briefcase, requireAuth: true },
  { name: 'Analytics', href: '/analytics', icon: BarChart3, requireAuth: true },
  { name: 'Coordinators', href: '/coordinators', icon: UserCheck, requireAuth: false },
];

const demoAccounts = [
  { label: 'Aarav Sharma', email: 'student@college.edu',  role: 'STUDENT',     desc: 'Y2 CSE · UIT-RGPV · 8.7 CGPA' },
  { label: 'Fresh Start',  email: 'newbie@college.edu',   role: 'STUDENT',     desc: 'Needs onboarding'      },
  { label: 'Prof. Meera Joshi', email: 'sarah.c@college.edu', role: 'COORDINATOR', desc: 'TPO / Placement Cell, RGPV' },
  { label: 'Admin',        email: 'admin@college.edu',   role: 'ADMIN',       desc: 'College admin (UIT-RGPV)'   },
];

export function Navbar() {
  const pathname  = usePathname();
  const { user, logout, quickLogin } = useAuth();
  const roadmap = useRoadmapOptional();
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [notifOpen,  setNotifOpen]        = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled]           = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);
  const [morePos, setMorePos] = useState({ top: 0, left: 0 });
  const navMeasureRef = useRef<HTMLDivElement>(null);
  const moreBtnRef = useRef<HTMLButtonElement>(null);

  // Scroll-aware glass intensification
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setMobileOpen(false);
    setRoleSwitcherOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  const links = (() => {
    if (!user) return publicLinks;
    const staff = user.role === 'ADMIN' || user.role === 'COORDINATOR';
    const extra = staff
      ? [{ name: 'Admin Portal', href: '/admin', icon: Shield, requireAuth: true }]
      : [];
    return [...coreLinks, ...supportingLinks, ...extra];
  })();

  useEffect(() => {
    const el = navMeasureRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const width = el.clientWidth;
      // Always reserve room for a More control on typical laptop widths
      if (width < 480) setVisibleCount(2);
      else if (width < 640) setVisibleCount(3);
      else if (width < 820) setVisibleCount(4);
      else if (width < 1020) setVisibleCount(5);
      else setVisibleCount(Math.max(5, links.length - 1));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [links.length]);

  useEffect(() => {
    if (!moreOpen) return;
    const place = () => {
      const btn = moreBtnRef.current;
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      setMorePos({ top: r.bottom + 8, left: Math.min(r.left, window.innerWidth - 230) });
    };
    place();
    const close = (e: MouseEvent) => {
      const t = e.target as Node;
      if (moreBtnRef.current?.contains(t)) return;
      const menu = document.getElementById('nav-more-menu');
      if (menu?.contains(t)) return;
      setMoreOpen(false);
    };
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    document.addEventListener('mousedown', close);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
      document.removeEventListener('mousedown', close);
    };
  }, [moreOpen]);

  const primaryLinks = links.slice(0, visibleCount);
  const overflowLinks = links.slice(visibleCount);

  return (
    <>
      <nav
        className={cn(
          'sticky top-0 z-40 w-full transition-all duration-slow ease-standard',
          scrolled
            ? 'glass border-b border-[var(--border)] shadow-[var(--shadow-md)]'
            : 'bg-transparent border-b border-transparent'
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-3 min-[375px]:px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 flex-nowrap gap-2 min-w-0">

            {/* ── Logo ─────────────────────────────────────────── */}
            <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0 min-w-0" aria-label="Campus to Career home">
              <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shadow-[var(--glow-primary)] transition-transform duration-150 group-hover:scale-105">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="hidden lg:flex flex-col leading-none min-w-0">
                <span className="font-display font-bold text-base gradient-text tracking-tight">
                  Campus to Career
                </span>
                <span className="text-[9px] uppercase font-semibold tracking-widest text-[var(--text-muted)]">
                  Student Growth Platform
                </span>
              </div>
            </Link>

            {/* ── Desktop Nav Links (nowrap + More overflow) ─────── */}
            <div className="hidden lg:flex items-center gap-0.5 flex-1 min-w-0 flex-nowrap overflow-visible" role="menubar">
            <div
              ref={navMeasureRef}
              className="flex items-center gap-0.5 flex-1 min-w-0 overflow-hidden flex-nowrap"
            >
              {primaryLinks.map((link) => {
                const Icon   = link.icon;
                const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    role="menuitem"
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0',
                      'transition-colors duration-fast ease-standard',
                      'focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]',
                      isActive
                        ? 'text-[var(--primary)] bg-[var(--primary-subtle)]'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-inset)]'
                    )}
                  >
                    <span className="relative z-10 flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5" aria-hidden />
                      {link.name}
                    </span>
                  </Link>
                );
              })}
            </div>
              {overflowLinks.length > 0 && (
                <div className="relative shrink-0 overflow-visible">
                  <button
                    ref={moreBtnRef}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setRoleSwitcherOpen(false);
                      const r = moreBtnRef.current?.getBoundingClientRect();
                      if (r) setMorePos({ top: r.bottom + 8, left: Math.min(r.left, window.innerWidth - 230) });
                      setMoreOpen((v) => !v);
                    }}
                    aria-expanded={moreOpen}
                    aria-haspopup="menu"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-inset)]"
                  >
                    More <MoreHorizontal className="w-3.5 h-3.5" />
                  </button>
                  {moreOpen &&
                    createPortal(
                      <div
                        id="nav-more-menu"
                        role="menu"
                        className="fixed z-[80] w-56 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-xl)] p-1.5"
                        style={{ top: morePos.top, left: morePos.left }}
                      >
                        {overflowLinks.map((link) => (
                          <Link
                            key={link.name}
                            href={link.href}
                            role="menuitem"
                            onClick={() => setMoreOpen(false)}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-inset)] hover:text-[var(--text-primary)] whitespace-nowrap min-h-11"
                          >
                            <link.icon className="w-4 h-4" />
                            {link.name}
                          </Link>
                        ))}
                      </div>,
                      document.body
                    )}
                </div>
              )}
            </div>

            {/* ── Right Side Controls ───────────────────────────── */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {/* Theme controls — always visible */}
              <ThemeToggle />
              <ThemeStudio />

              {/* Quick role switcher */}
              <div className="relative hidden lg:block">
                <button
                  onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                  aria-haspopup="listbox"
                  aria-expanded={roleSwitcherOpen}
                  className={cn(
                    'flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold',
                    'bg-[var(--surface-inset)] border border-[var(--border)]',
                    'text-[var(--text-muted)] hover:text-[var(--text-primary)]',
                    'hover:border-[var(--border-strong)] transition-colors duration-fast',
                    'focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]',
                  )}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" aria-hidden />
                  Demo
                  <ChevronDown className={cn('w-3 h-3 transition-transform', roleSwitcherOpen && 'rotate-180')} aria-hidden />
                </button>

                  {roleSwitcherOpen && (
                    <div
                      className="absolute right-0 mt-2 w-[min(18rem,calc(100vw-1.5rem))] bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow-xl)] overflow-hidden z-50 max-h-[70vh] overflow-y-auto"
                      role="listbox"
                      aria-label="Demo accounts"
                    >
                      <div className="px-3 py-2 border-b border-[var(--border)]">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">
                          1-Click Demo Profiles
                        </span>
                      </div>
                      <div className="p-1.5 space-y-0.5">
                        <p className="px-3 pt-1 text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">
                          Roadmap personas
                        </p>
                        {ROADMAP_PERSONAS.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              roadmap?.applyPersona(p.id);
                              setRoleSwitcherOpen(false);
                            }}
                            className="w-full text-left px-3 py-2.5 rounded-xl text-sm hover:bg-[var(--surface-inset)]"
                          >
                            <span className="font-semibold text-[var(--text-primary)] text-xs">{p.label}</span>
                            <span className="text-[11px] text-[var(--text-muted)] mt-0.5 block">{p.desc}</span>
                          </button>
                        ))}
                        {demoAccounts.map((acc) => (
                          <button
                            key={acc.email}
                            role="option"
                            aria-selected={user?.email === acc.email}
                            onClick={() => { quickLogin(acc.email, 'Password123!'); setRoleSwitcherOpen(false); }}
                            className={cn(
                              'w-full text-left px-3 py-2.5 rounded-xl text-sm',
                              'hover:bg-[var(--surface-inset)] transition-colors',
                              'focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]',
                              user?.email === acc.email && 'bg-[var(--primary-subtle)] border border-[var(--primary-border)]'
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-[var(--text-primary)] text-xs">{acc.label}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[var(--surface-inset)] text-[var(--primary)] font-mono">
                                {acc.role}
                              </span>
                            </div>
                            <span className="text-[11px] text-[var(--text-muted)] mt-0.5 block">{acc.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              {/* Notification bell */}
              {user && (
                <button
                  onClick={() => setNotifOpen(true)}
                  aria-label="Open notifications"
                  className={cn(
                    'relative w-9 h-9 rounded-xl flex items-center justify-center',
                    'text-[var(--text-muted)] hover:text-[var(--text-primary)]',
                    'hover:bg-[var(--surface-inset)] border border-transparent',
                    'hover:border-[var(--border)] transition-colors duration-fast',
                    'focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]',
                  )}
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--primary)] rounded-full ring-2 ring-[var(--bg)]" aria-hidden />
                </button>
              )}

              {/* User avatar / auth CTAs */}
              {user ? (
                <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-[var(--border)]">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity focus-visible:outline-2 focus-visible:outline-[var(--border-focus)] rounded-lg"
                    aria-label={`Go to ${user.name ?? 'your'} dashboard`}
                  >
                    <Avatar name={user.name ?? 'U'} size="sm" gradient />
                    <div className="hidden md:flex flex-col leading-none">
                      <span className="text-xs font-semibold text-[var(--text-primary)] truncate max-w-[90px]">
                        {user.name ?? 'Student'}
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-mono">
                        {user.role}
                      </span>
                    </div>
                  </Link>
                  <button
                    onClick={logout}
                    aria-label="Sign out"
                    title="Sign out"
                    className={cn(
                      'w-8 h-8 rounded-xl flex items-center justify-center',
                      'text-[var(--text-muted)] hover:text-[var(--danger)]',
                      'hover:bg-[var(--danger-subtle)] transition-colors duration-fast',
                      'focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]',
                    )}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-2 flex-nowrap">
                  <Link
                    href="/login"
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-inset)] transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap text-white gradient-brand shadow-[var(--glow-primary)] hover:-translate-y-0.5 transition-transform"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav"
                className={cn(
                  'lg:hidden w-11 h-11 rounded-xl flex items-center justify-center',
                  'text-[var(--text-muted)] hover:text-[var(--text-primary)]',
                  'hover:bg-[var(--surface-inset)] border border-[var(--border)]',
                  'transition-colors focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]'
                )}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Nav drawer ────────────────────────────────── */}
          {mobileOpen && (
            <div
              id="mobile-nav"
              className="lg:hidden fixed inset-0 z-50 bg-[var(--overlay)]"
            >
              <button type="button" className="absolute inset-0" aria-label="Close menu" onClick={() => setMobileOpen(false)} />
              <div className="absolute right-0 top-0 h-full w-[min(100%,20rem)] overflow-y-auto overscroll-contain border-l border-[var(--border)] bg-[var(--surface)] px-4 pb-8">
              <div className="pt-4 grid grid-cols-2 gap-1.5">
                {links.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'flex items-center gap-2 px-3 min-h-11 rounded-xl text-sm font-medium',
                        'transition-colors duration-fast',
                        isActive
                          ? 'bg-[var(--primary-subtle)] text-[var(--primary)]'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--surface-inset)]'
                      )}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" aria-hidden />
                      {link.name}
                    </Link>
                  );
                })}
              </div>

              {/* Auth row */}
              <div className="mt-4 pt-4 border-t border-[var(--border)] space-y-3">
                <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">Demo profiles</p>
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {demoAccounts.map((acc) => (
                    <button
                      key={acc.email}
                      type="button"
                      onClick={() => { quickLogin(acc.email, 'Password123!'); setMobileOpen(false); }}
                      className="w-full text-left px-3 py-2.5 min-h-11 rounded-xl hover:bg-[var(--surface-inset)]"
                    >
                      <span className="block text-xs font-semibold text-[var(--text-primary)]">{acc.label}</span>
                      <span className="block text-[11px] text-[var(--text-muted)]">{acc.desc}</span>
                    </button>
                  ))}
                </div>
                {user ? (
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar name={user.name ?? 'U'} size="sm" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{user.name}</p>
                        <p className="text-xs text-[var(--text-muted)] truncate">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { logout(); setMobileOpen(false); }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-[var(--danger)] hover:bg-[var(--danger-subtle)] transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Link href="/login" onClick={() => setMobileOpen(false)}
                      className="flex-1 text-center py-2.5 rounded-xl text-sm font-medium text-[var(--text-secondary)] bg-[var(--surface-inset)] border border-[var(--border)]">
                      Sign In
                    </Link>
                    <Link href="/register" onClick={() => setMobileOpen(false)}
                      className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold text-white gradient-brand">
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
              </div>
            </div>
          )}
      </nav>

      <NotificationDrawer isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
    </>
  );
}
