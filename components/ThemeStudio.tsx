'use client';

import React, { useState } from 'react';
import { Palette, Shuffle, Check, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useTheme } from '@/lib/theme/ThemeProvider';
import { PALETTES } from '@/design-tokens/tokens';
import { ThemeToggle } from './ui/ThemeToggle';

const paletteList = Object.values(PALETTES);

export function ThemeStudio() {
  const { palette, setPalette, previewPalette, resolvedTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const handleSurprise = () => {
    const others = paletteList.filter((p) => p.id !== palette);
    const pick = others[Math.floor(Math.random() * others.length)];
    setPalette(pick.id);
  };

  return (
    <div className="relative">
      {/* Studio Trigger */}
      <button
        id="theme-studio-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Open Theme Studio"
        className={cn(
          'relative w-10 h-10 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center',
          'border border-border bg-inset text-text-muted',
          'hover:bg-raised hover:border-border-strong hover:text-text-primary',
          'transition-colors duration-[150ms] ease-standard',
          'focus-visible:outline-2 focus-visible:outline-ring',
          'active:scale-95 touch-manipulation',
          open && 'border-primary/40 bg-primary/10 text-primary',
        )}
      >
        <Palette className="w-4 h-4" aria-hidden />
        {/* Active palette dot */}
        <span
          className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
          style={{
            backgroundColor:
              PALETTES[palette]?.[resolvedTheme === 'dark' ? 'dark' : 'light']?.primary ?? 'var(--primary)',
          }}
          aria-hidden
        />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              previewPalette(null);
              setOpen(false);
            }}
            aria-hidden
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label="Theme Studio"
            className={cn(
              'z-50 w-[min(18rem,calc(100vw-1.5rem))] rounded-2xl overflow-hidden',
              'bg-surface border border-border shadow-xl',
              'absolute right-0 top-12',
              'max-sm:fixed max-sm:right-3 max-sm:top-[4.25rem]',
            )}
          >
              {/* Header */}
              <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-border">
                <div>
                  <h3 className="font-display font-bold text-sm text-text-primary">Theme Studio</h3>
                  <p className="text-[11px] text-text-muted mt-0.5">Personalize your experience</p>
                </div>
                <button
                  onClick={() => { previewPalette(null); setOpen(false); }}
                  aria-label="Close theme studio"
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-inset transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mode Toggle */}
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <span className="text-xs font-semibold text-text-secondary">Appearance</span>
                <ThemeToggle variant="segmented" />
              </div>

              {/* Palette Grid */}
              <div className="px-4 pt-3 pb-2">
                <p className="text-[10px] uppercase font-bold tracking-wider text-text-muted mb-2.5">Color Palette</p>
                <div className="grid grid-cols-3 gap-2">
                  {paletteList.map((p) => {
                    const colors = resolvedTheme === 'dark' ? p.dark : p.light;
                    const isActive = palette === p.id;
                    return (
                      <button
                        key={p.id}
                        onMouseEnter={() => previewPalette(p.id)}
                        onMouseLeave={() => !isActive && previewPalette(null)}
                        onClick={() => {
                          setPalette(p.id);
                          setOpen(false);
                        }}
                        aria-label={`Apply ${p.name} palette`}
                        aria-pressed={isActive}
                        className={cn(
                          'relative flex flex-col items-center gap-1.5 p-2.5 rounded-xl',
                          'border transition-colors duration-[150ms]',
                          'active:scale-[0.98] touch-manipulation',
                          isActive
                            ? 'border-primary/60 bg-primary/8 shadow-glow'
                            : 'border-border hover:border-border-strong hover:bg-inset',
                        )}
                      >
                        {/* Color swatch circles */}
                        <div className="flex items-center gap-1 h-7 w-full justify-center">
                          <span
                            className="w-5 h-5 rounded-full shadow-sm ring-1 ring-black/10"
                            style={{ backgroundColor: colors.background }}
                          />
                          <span
                            className="w-5 h-5 rounded-full shadow-sm ring-1 ring-black/10 -ml-2"
                            style={{ backgroundColor: colors.surface }}
                          />
                          <span
                            className="w-6 h-6 rounded-full shadow-md ring-1 ring-black/15 -ml-2"
                            style={{ backgroundColor: colors.primary }}
                          />
                          <span
                            className="w-4 h-4 rounded-full shadow-sm ring-1 ring-black/10 -ml-1.5"
                            style={{ backgroundColor: colors.accent }}
                          />
                        </div>
                        <span className="text-[10px] font-semibold text-text-secondary leading-none text-center">
                          {p.name}
                        </span>
                        {isActive && (
                          <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-primary-foreground" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="px-4 pb-4 pt-2 flex items-center gap-2">
                <button
                  onClick={handleSurprise}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold',
                    'border border-border bg-inset text-text-secondary',
                    'hover:border-border-strong hover:bg-raised hover:text-text-primary',
                    'transition-colors duration-[150ms]',
                  )}
                >
                  <Shuffle className="w-3.5 h-3.5" aria-hidden />
                  Surprise me
                </button>
                <button
                  onClick={() => { previewPalette(null); setOpen(false); }}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold',
                    'bg-primary text-primary-foreground',
                    'hover:bg-primary-hover transition-colors duration-[150ms]',
                  )}
                >
                  Done
                </button>
              </div>

              {/* Active Palette Description */}
              <div className="px-4 pb-3">
                <p className="text-[10px] text-text-muted text-center">
                  {PALETTES[palette]?.description}
                </p>
              </div>
            </div>
          </>
        )}
    </div>
  );
}
