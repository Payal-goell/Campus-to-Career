'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from '@/lib/theme/ThemeProvider';
import { drawFaviconMark, faviconColorsFor } from '@/lib/favicon-mark';

const SIZE = 64;

/**
 * Live tab favicon: unique dual-C pathway mark that recolors with the active
 * palette and gently pulses so the icon feels interactive.
 */
export function InteractiveFavicon() {
  const { palette, resolvedTheme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const linkRef = useRef<HTMLLinkElement | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    let link = document.querySelector<HTMLLinkElement>('link[data-ctc-live-favicon="1"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/png';
      link.setAttribute('data-ctc-live-favicon', '1');
      document.head.appendChild(link);
    }
    linkRef.current = link;

    const canvas = document.createElement('canvas');
    canvas.width = SIZE;
    canvas.height = SIZE;
    canvasRef.current = canvas;

    const colors = faviconColorsFor(palette, resolvedTheme);
    let start = performance.now();
    let lastPush = 0;

    const tick = (now: number) => {
      const ctx = canvas.getContext('2d');
      if (!ctx || !linkRef.current) return;

      const t = (now - start) / 1000;
      const pulse = (Math.sin(t * 1.6) + 1) / 2; // 0→1 soft breath
      drawFaviconMark(ctx, SIZE, colors, pulse);

      // Throttle DOM writes — browsers dislike favicon spam
      if (now - lastPush > 180) {
        linkRef.current.href = canvas.toDataURL('image/png');
        lastPush = now;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [palette, resolvedTheme]);

  return null;
}
