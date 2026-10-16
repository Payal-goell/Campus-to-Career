'use client';

import React from 'react';
import Link from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

/* ─── Variants ────────────────────────────────────────────────── */
const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 font-semibold leading-none',
    'rounded-xl transition-colors duration-150 ease-out',
    'touch-manipulation max-w-full text-center',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]',
    'disabled:pointer-events-none disabled:opacity-40',
    'select-none align-middle',
    'active:scale-[0.98]',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-[var(--gradient-brand)] text-white',
          'shadow-[var(--glow-primary)]',
          'hover:brightness-110',
        ],
        secondary: [
          'bg-[var(--surface-raised)] text-[var(--text-primary)]',
          'border border-[var(--border)]',
          'hover:bg-[var(--surface-inset)] hover:border-[var(--border-strong)]',
          'shadow-[var(--shadow-sm)]',
        ],
        ghost: [
          'text-[var(--text-secondary)]',
          'hover:bg-[var(--surface-inset)] hover:text-[var(--text-primary)]',
        ],
        destructive: [
          'bg-[var(--danger)] text-white',
          'hover:opacity-90',
        ],
        outline: [
          'border border-[var(--border)] text-[var(--text-primary)]',
          'hover:border-[var(--primary-border)] hover:text-[var(--primary)]',
          'hover:bg-[var(--primary-subtle)]',
        ],
        accent: [
          'bg-[var(--accent)] text-white',
          'shadow-[var(--glow-accent)]',
          'hover:brightness-110',
        ],
        gradient: [
          'gradient-brand text-white',
          'shadow-[var(--glow-primary)]',
          'hover:brightness-110',
        ],
        link: [
          'text-[var(--primary)] underline-offset-4',
          'hover:underline h-auto p-0 rounded-none active:scale-100',
        ],
      },
      size: {
        xs: 'text-xs px-2.5 min-h-8 h-8 rounded-lg shrink-0 whitespace-nowrap',
        sm: 'text-sm px-3.5 min-h-10 h-10 whitespace-nowrap',
        md: 'text-sm px-5 min-h-11 h-11',
        lg: 'text-base px-6 min-h-12 h-12 rounded-2xl',
        xl: 'text-lg px-8 min-h-14 h-14 rounded-2xl',
        icon: 'w-10 h-10 min-h-10 min-w-10 rounded-xl p-0 shrink-0',
        'icon-sm': 'w-8 h-8 min-h-8 min-w-8 rounded-lg p-0 shrink-0',
        'icon-lg': 'w-11 h-11 min-h-11 min-w-11 rounded-xl p-0 shrink-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

/* ─── Props ───────────────────────────────────────────────────── */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?: boolean;
  href?: string;
  target?: string;
  rel?: string;
}

function isExternalHref(href: string, target?: string) {
  return target === '_blank' || /^(https?:|mailto:|tel:)/i.test(href);
}

/* ─── Component ───────────────────────────────────────────────── */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      href,
      target,
      rel,
      type = 'button',
      onClick,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;
    const content = (
      <>
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden />
        ) : (
          leftIcon && <span className="inline-flex shrink-0" aria-hidden>{leftIcon}</span>
        )}
        {children && <span className="inline-flex items-center">{children}</span>}
        {!loading && rightIcon && <span className="inline-flex shrink-0" aria-hidden>{rightIcon}</span>}
      </>
    );
    const classes = cn(buttonVariants({ variant, size }), className);

    if (href && !isDisabled) {
      if (isExternalHref(href, target)) {
        return (
          <a
            href={href}
            target={target}
            rel={rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)}
            className={classes}
            onClick={onClick as React.MouseEventHandler<HTMLAnchorElement> | undefined}
          >
            {content}
          </a>
        );
      }

      return (
        <Link
          href={href}
          className={classes}
          onClick={onClick as React.MouseEventHandler<HTMLAnchorElement> | undefined}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        onClick={onClick}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';

/* ─── Icon Button shorthand ───────────────────────────────────── */
export const IconButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & { label: string }
>(({ label, size = 'icon', ...props }, ref) => (
  <Button
    ref={ref}
    size={size}
    aria-label={label}
    title={label}
    {...props}
  />
));

IconButton.displayName = 'IconButton';
