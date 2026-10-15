'use client';

import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';
import { scaleIn, fadeInOut } from '@/lib/motion';

/* ─── Modal (Dialog) ──────────────────────────────────────────── */
export const Modal = DialogPrimitive.Root;
export const ModalTrigger = DialogPrimitive.Trigger;
export const ModalClose = DialogPrimitive.Close;

interface ModalContentProps extends React.ComponentProps<typeof DialogPrimitive.Content> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showClose?: boolean;
}

const sizeMap = {
  sm:   'max-w-sm',
  md:   'max-w-md',
  lg:   'max-w-lg',
  xl:   'max-w-2xl',
  full: 'max-w-5xl',
};

export function ModalContent({
  className,
  children,
  size = 'md',
  showClose = true,
  ...props
}: ModalContentProps) {
  return (
    <DialogPrimitive.Portal>
      <AnimatePresence>
        <DialogPrimitive.Overlay asChild>
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            variants={fadeInOut}
            initial="hidden"
            animate="visible"
            exit="hidden"
          />
        </DialogPrimitive.Overlay>
        <DialogPrimitive.Content asChild {...props}>
          <motion.div
            className={cn(
              'fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)]',
              'bg-[var(--surface)] border border-[var(--border)]',
              'rounded-2xl shadow-[var(--shadow-xl)]',
              'focus:outline-none',
              sizeMap[size],
              className
            )}
            style={{ translateX: '-50%', translateY: '-50%' }}
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {showClose && (
              <DialogPrimitive.Close className="absolute right-4 top-4 rounded-lg p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-inset)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--border-focus)]">
                <X className="w-4 h-4" />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            )}
            {children}
          </motion.div>
        </DialogPrimitive.Content>
      </AnimatePresence>
    </DialogPrimitive.Portal>
  );
}

export function ModalHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-6 pt-6 pb-4 border-b border-[var(--border)]', className)} {...props} />;
}

export function ModalTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <DialogPrimitive.Title
      className={cn('font-display font-bold text-xl text-[var(--text-primary)] tracking-tight', className)}
      {...props}
    />
  );
}

export function ModalDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <DialogPrimitive.Description
      className={cn('text-sm text-[var(--text-muted)] mt-1', className)}
      {...props}
    />
  );
}

export function ModalBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-6 py-5', className)} {...props} />;
}

export function ModalFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('px-6 pb-6 pt-4 border-t border-[var(--border)] flex justify-end gap-3', className)}
      {...props}
    />
  );
}

/* ─── Sheet (Side Drawer) ─────────────────────────────────────── */
interface SheetContentProps extends React.ComponentProps<typeof DialogPrimitive.Content> {
  side?: 'left' | 'right';
  width?: string;
}

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;

import type { Variants } from 'framer-motion';

const slideVariants: Record<'left' | 'right', Variants> = {
  right: {
    hidden:  { x: '100%', opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.35, ease: [0.05, 0.7, 0.1, 1] } },
    exit:    { x: '100%', opacity: 0, transition: { duration: 0.25, ease: [0.4, 0, 1, 1] } },
  },
  left: {
    hidden:  { x: '-100%', opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.35, ease: [0.05, 0.7, 0.1, 1] } },
    exit:    { x: '-100%', opacity: 0, transition: { duration: 0.25, ease: [0.4, 0, 1, 1] } },
  },
};

export function SheetContent({
  className,
  children,
  side = 'right',
  width = 'max-w-md',
  ...props
}: SheetContentProps) {
  return (
    <DialogPrimitive.Portal>
      <AnimatePresence>
        <DialogPrimitive.Overlay asChild>
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            variants={fadeInOut}
            initial="hidden"
            animate="visible"
            exit="hidden"
          />
        </DialogPrimitive.Overlay>
        <DialogPrimitive.Content asChild {...props}>
          <motion.div
            className={cn(
              'fixed top-0 bottom-0 z-50 flex flex-col',
              'bg-[var(--surface)] border-[var(--border)]',
              'shadow-[var(--shadow-xl)] focus:outline-none',
              'w-full',
              width,
              side === 'right' ? 'right-0 rounded-l-2xl border-l' : 'left-0 rounded-r-2xl border-r',
              className
            )}
            variants={slideVariants[side]}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <DialogPrimitive.Close className="absolute right-4 top-4 rounded-lg p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-inset)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--border-focus)] z-10">
              <X className="w-4 h-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
            {children}
          </motion.div>
        </DialogPrimitive.Content>
      </AnimatePresence>
    </DialogPrimitive.Portal>
  );
}

export function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-6 pt-6 pb-4 border-b border-[var(--border)]', className)} {...props} />;
}
export function SheetTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <DialogPrimitive.Title
      className={cn('font-display font-bold text-lg text-[var(--text-primary)] tracking-tight', className)}
      {...props}
    />
  );
}
export function SheetBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex-1 overflow-y-auto px-6 py-5', className)} {...props} />;
}
export function SheetFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('px-6 pb-6 pt-4 border-t border-[var(--border)] flex gap-3', className)} {...props} />
  );
}
