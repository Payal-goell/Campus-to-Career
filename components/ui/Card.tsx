'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { hoverLift } from '@/lib/motion';

/* ─── Variants ────────────────────────────────────────────────── */
const cardVariants = cva(
  'rounded-2xl border transition-all duration-base ease-standard',
  {
    variants: {
      variant: {
        default:     'bg-[var(--surface)] border-[var(--border)] shadow-[var(--shadow-sm)]',
        raised:      'bg-[var(--surface-raised)] border-[var(--border)] shadow-[var(--shadow-md)]',
        glass:       'glass shadow-[var(--shadow-lg)]',
        bento:       'bg-[var(--surface)] border-[var(--border)] shadow-[var(--shadow-sm)] overflow-hidden',
        inset:       'bg-[var(--surface-inset)] border-[var(--border)]',
        gradient:    'gradient-border bg-[var(--surface)] shadow-[var(--shadow-md)]',
        interactive: [
          'bg-[var(--surface)] border-[var(--border)] shadow-[var(--shadow-sm)]',
          'cursor-pointer',
          'hover:border-[var(--primary-border)] hover:shadow-[var(--shadow-lg)]',
          'hover:-translate-y-0.5',
        ],
        stat: [
          'bg-[var(--surface-raised)] border-[var(--border)] shadow-[var(--shadow-sm)]',
          'hover:border-[var(--primary-border)]',
        ],
      },
      padding: {
        none: '',
        sm:   'p-4',
        md:   'p-5',
        lg:   'p-6',
        xl:   'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'lg',
    },
  }
);

/* ─── Props ───────────────────────────────────────────────────── */
export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  animate?: boolean;
  tilt?: boolean;
}

/* ─── Component ───────────────────────────────────────────────── */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, animate = false, tilt = false, children, ...props }, ref) => {
    const classes = cn(cardVariants({ variant, padding }), className);

    if (animate) {
      return (
        <motion.div
          ref={ref}
          className={classes}
          whileHover={tilt ? { scale: 1.01, y: -2 } : hoverLift}
          transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
          {...(props as React.ComponentProps<typeof motion.div>)}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

/* ─── Sub-components ─────────────────────────────────────────── */
export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col gap-1 pb-4 border-b border-[var(--border)]', className)}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('font-display font-bold text-[var(--text-primary)] text-lg tracking-tight', className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm text-[var(--text-muted)] leading-relaxed', className)} {...props} />
  );
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('pt-4', className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center justify-between gap-3 flex-wrap pt-4 border-t border-[var(--border)] mt-4', className)}
      {...props}
    />
  );
}
