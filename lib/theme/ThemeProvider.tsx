'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useTransition } from 'react';
import { ThemePreference, ResolvedTheme, ThemeContextValue } from './types';
import { PaletteId } from '@/design-tokens/tokens';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const VALID_PALETTES: PaletteId[] = ['forest', 'ocean', 'ember', 'plum', 'graphite', 'rosewood'];

const BG_COLORS: Record<PaletteId, { light: string; dark: string }> = {
  forest: { light: '#FAF7F2', dark: '#0B120D' },
  ocean: { light: '#F5FAFC', dark: '#07131A' },
  ember: { light: '#FFF8F1', dark: '#140C08' },
  plum: { light: '#FAF7FD', dark: '#0F0A18' },
  graphite: { light: '#F6F8F8', dark: '#0A0F10' },
  rosewood: { light: '#FFF7FA', dark: '#16090F' },
};

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function updateMetaThemeColor(palette: PaletteId, theme: ResolvedTheme) {
  if (typeof document === 'undefined') return;
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
  const color = BG_COLORS[palette]?.[theme] || (theme === 'dark' ? '#0B120D' : '#FAF7F2');
  meta.setAttribute('content', color);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [resolvedTheme, setResolvedThemeState] = useState<ResolvedTheme>('light');
  const [palette, setPaletteState] = useState<PaletteId>('forest');
  const [activePreviewPalette, setActivePreviewPalette] = useState<PaletteId | null>(null);
  const [, startTransition] = useTransition();

  // Initialize from DOM or storage after mount
  useEffect(() => {
    try {
      const storedPref = (localStorage.getItem('theme-preference') as ThemePreference) || 'system';
      const storedPal = (localStorage.getItem('palette-preference') as PaletteId) || 'forest';
      const validPal = VALID_PALETTES.includes(storedPal) ? storedPal : 'forest';
      
      const currentResolved = storedPref === 'system' ? getSystemTheme() : storedPref;
      
      setPreferenceState(storedPref);
      setResolvedThemeState(currentResolved);
      setPaletteState(validPal);

      const root = document.documentElement;
      root.setAttribute('data-theme', currentResolved);
      root.setAttribute('data-palette', validPal);
      root.style.colorScheme = currentResolved;
      updateMetaThemeColor(validPal, currentResolved);
    } catch {
      // Safe fallback
    }
  }, []);

  // Listen to OS theme changes when preference is 'system'
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      if (preference === 'system') {
        const newResolved: ResolvedTheme = e.matches ? 'dark' : 'light';
        setResolvedThemeState(newResolved);
        const root = document.documentElement;
        root.setAttribute('data-theme', newResolved);
        root.style.colorScheme = newResolved;
        updateMetaThemeColor(palette, newResolved);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [preference, palette]);

  // Cross-tab synchronization via storage event
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'theme-preference' && e.newValue) {
        const newPref = e.newValue as ThemePreference;
        setPreferenceState(newPref);
        const newResolved = newPref === 'system' ? getSystemTheme() : newPref;
        setResolvedThemeState(newResolved);
        document.documentElement.setAttribute('data-theme', newResolved);
        document.documentElement.style.colorScheme = newResolved;
        updateMetaThemeColor(palette, newResolved);
      } else if (e.key === 'palette-preference' && e.newValue) {
        const newPal = e.newValue as PaletteId;
        if (VALID_PALETTES.includes(newPal)) {
          setPaletteState(newPal);
          document.documentElement.setAttribute('data-palette', newPal);
          updateMetaThemeColor(newPal, resolvedTheme);
        }
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [palette, resolvedTheme]);

  // Set Theme with View Transitions circular reveal or fallback
  const setTheme = useCallback((newPref: ThemePreference, event?: React.MouseEvent | MouseEvent) => {
    const newResolved: ResolvedTheme = newPref === 'system' ? getSystemTheme() : newPref;

    const applyTheme = () => {
      setPreferenceState(newPref);
      setResolvedThemeState(newResolved);
      try {
        localStorage.setItem('theme-preference', newPref);
      } catch {}

      const root = document.documentElement;
      root.setAttribute('data-theme', newResolved);
      root.style.colorScheme = newResolved;
      updateMetaThemeColor(palette, newResolved);
    };

    // If View Transitions API and coordinates available, perform circular reveal
    if (typeof document !== 'undefined' && 'startViewTransition' in document && event && event.clientX !== undefined) {
      const x = event.clientX;
      const y = event.clientY;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      // Add no-transitions temporarily to avoid conflicting CSS transitions
      document.documentElement.classList.add('no-transitions');

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transition = (document as any).startViewTransition(() => {
        applyTheme();
      });

      transition.ready.then(() => {
        document.documentElement.classList.remove('no-transitions');
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ];
        document.documentElement.animate(
          {
            clipPath: newResolved === 'dark' ? clipPath : [...clipPath].reverse(),
          },
          {
            duration: 350,
            easing: 'cubic-bezier(0.2, 0, 0, 1)',
            pseudoElement: newResolved === 'dark' ? '::view-transition-new(root)' : '::view-transition-old(root)',
          }
        );
      }).catch(() => {
        document.documentElement.classList.remove('no-transitions');
      });
    } else {
      // Graceful fallback with temporary .no-transitions class to avoid animation stutter
      if (typeof document !== 'undefined') {
        document.documentElement.classList.add('no-transitions');
        applyTheme();
        requestAnimationFrame(() => {
          document.documentElement.classList.remove('no-transitions');
        });
      } else {
        applyTheme();
      }
    }
  }, [palette]);

  // Set Palette
  const setPalette = useCallback((newPalette: PaletteId) => {
    if (!VALID_PALETTES.includes(newPalette)) return;

    startTransition(() => {
      setPaletteState(newPalette);
      setActivePreviewPalette(null);
    });

    try {
      localStorage.setItem('palette-preference', newPalette);
    } catch {}

    const root = document.documentElement;
    root.setAttribute('data-palette', newPalette);
    updateMetaThemeColor(newPalette, resolvedTheme);
  }, [resolvedTheme]);

  // Live preview without permanent commit
  const previewPalette = useCallback((tempPalette: PaletteId | null) => {
    setActivePreviewPalette(tempPalette);
    const target = tempPalette || palette;
    document.documentElement.setAttribute('data-palette', target);
    updateMetaThemeColor(target, resolvedTheme);
  }, [palette, resolvedTheme]);

  return (
    <ThemeContext.Provider
      value={{
        preference,
        resolvedTheme,
        palette: activePreviewPalette || palette,
        setTheme,
        setPalette,
        previewPalette,
        activePreviewPalette,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
