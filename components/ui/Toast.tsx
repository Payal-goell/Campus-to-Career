'use client';

import React from 'react';
import { Toaster as SonnerToaster, toast as sonnerToast } from 'sonner';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

/* ─── Toast Provider ──────────────────────────────────────────── */
export function ToastProvider() {
  return (
    <SonnerToaster
      position="bottom-right"
      expand={false}
      richColors={false}
      closeButton
      toastOptions={{
        classNames: {
          toast: [
            'group flex items-start gap-3 w-full',
            'bg-[var(--surface-raised)] border border-[var(--border)]',
            'rounded-2xl p-4 shadow-[var(--shadow-xl)]',
            'text-[var(--text-primary)] text-sm font-medium',
          ].join(' '),
          title: 'font-semibold text-[var(--text-primary)] text-sm',
          description: 'text-xs text-[var(--text-muted)] mt-0.5',
          closeButton: [
            'absolute right-3 top-3 w-6 h-6 rounded-lg',
            'flex items-center justify-center',
            'text-[var(--text-muted)] hover:text-[var(--text-primary)]',
            'hover:bg-[var(--surface-inset)] transition-colors',
          ].join(' '),
          actionButton: [
            'px-3 py-1.5 rounded-lg text-xs font-semibold mt-2',
            'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]',
            'transition-colors cursor-pointer',
          ].join(' '),
          cancelButton: [
            'px-3 py-1.5 rounded-lg text-xs font-semibold mt-2 ml-2',
            'bg-[var(--surface-inset)] text-[var(--text-muted)]',
            'hover:bg-[var(--border)] transition-colors cursor-pointer',
          ].join(' '),
        },
      }}
    />
  );
}

/* ─── Typed toast helpers ─────────────────────────────────────── */
export const toast = {
  success: (message: string, description?: string) =>
    sonnerToast.success(message, {
      description,
      icon: <CheckCircle2 className="w-4 h-4 text-[var(--success)] flex-shrink-0 mt-0.5" />,
    }),
  error: (message: string, description?: string) =>
    sonnerToast.error(message, {
      description,
      icon: <XCircle className="w-4 h-4 text-[var(--danger)] flex-shrink-0 mt-0.5" />,
    }),
  warning: (message: string, description?: string) =>
    sonnerToast.warning(message, {
      description,
      icon: <AlertTriangle className="w-4 h-4 text-[var(--warning)] flex-shrink-0 mt-0.5" />,
    }),
  info: (message: string, description?: string) =>
    sonnerToast.message(message, {
      description,
      icon: <Info className="w-4 h-4 text-[var(--info)] flex-shrink-0 mt-0.5" />,
    }),
  promise: sonnerToast.promise,
  dismiss: sonnerToast.dismiss,
  loading: (message: string) => sonnerToast.loading(message),
};
