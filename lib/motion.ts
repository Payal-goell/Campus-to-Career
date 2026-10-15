/**
 * Shared Framer Motion tokens, variants, and presets.
 * Import from here — never define animation variants inline in components.
 *
 * Usage:
 *   import { fadeUp, stagger, scaleIn } from '@/lib/motion';
 *   <motion.div variants={fadeUp} initial="hidden" animate="visible" />
 */

import type { Variants, Transition } from 'framer-motion';

/* ─── Duration tokens (ms) ────────────────────────────────────── */
export const duration = {
  fast:   0.15,
  base:   0.25,
  slow:   0.40,
  slower: 0.60,
} as const;

/* ─── Easing presets ─────────────────────────────────────────── */
export const ease = {
  standard:   [0.2, 0, 0, 1]    as [number, number, number, number],
  emphasized: [0.05, 0.7, 0.1, 1] as [number, number, number, number],
  decelerate: [0, 0, 0.2, 1]    as [number, number, number, number],
  accelerate: [0.4, 0, 1, 1]    as [number, number, number, number],
  spring:     { type: 'spring', stiffness: 400, damping: 30 } as Transition,
  springGentle: { type: 'spring', stiffness: 200, damping: 25 } as Transition,
} as const;

/* ─── Reusable animation variants ────────────────────────────── */

/** Fade up — standard entrance for most elements */
export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 16 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: duration.base, ease: ease.standard },
  },
  exit: {
    opacity: 0, y: -8,
    transition: { duration: duration.fast, ease: ease.accelerate },
  },
};

/** Fade down — used for dropdowns */
export const fadeDown: Variants = {
  hidden:  { opacity: 0, y: -8 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: duration.base, ease: ease.standard },
  },
  exit: {
    opacity: 0, y: -8,
    transition: { duration: duration.fast, ease: ease.accelerate },
  },
};

/** Scale in — cards, modals */
export const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1, scale: 1,
    transition: { duration: duration.base, ease: ease.emphasized },
  },
  exit: {
    opacity: 0, scale: 0.96,
    transition: { duration: duration.fast, ease: ease.accelerate },
  },
};

/** Slide in from right — drawers/panels */
export const slideInRight: Variants = {
  hidden:  { opacity: 0, x: 40 },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: duration.slow, ease: ease.emphasized },
  },
  exit: {
    opacity: 0, x: 40,
    transition: { duration: duration.base, ease: ease.accelerate },
  },
};

/** Slide in from left */
export const slideInLeft: Variants = {
  hidden:  { opacity: 0, x: -40 },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: duration.slow, ease: ease.emphasized },
  },
  exit: {
    opacity: 0, x: -40,
    transition: { duration: duration.base, ease: ease.accelerate },
  },
};

/** Fade only — for overlays/backdrops */
export const fadeInOut: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: duration.base } },
  exit:    { opacity: 0, transition: { duration: duration.fast } },
};

/** Stagger container — wraps staggered children */
export const stagger = (staggerChildren = 0.07, delayChildren = 0): Variants => ({
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren, delayChildren },
  },
});

/** Stagger item — use as children of stagger container */
export const staggerItem: Variants = {
  hidden:  { opacity: 0, y: 12 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: duration.base, ease: ease.standard },
  },
};

/** Page transition */
export const pageTransition: Variants = {
  hidden:  { opacity: 0, y: 8 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: duration.slow, ease: ease.emphasized },
  },
  exit: {
    opacity: 0, y: -8,
    transition: { duration: duration.base, ease: ease.accelerate },
  },
};

/** Hover lift — apply to motion.div with whileHover */
export const hoverLift = {
  scale: 1.02,
  y: -2,
  transition: { duration: duration.fast, ease: ease.standard },
};

/** Button press — apply with whileTap */
export const tapPress = {
  scale: 0.97,
  transition: { duration: duration.fast },
};

/** Spring bounce — for success/completion feedback */
export const springBounce: Variants = {
  hidden:  { scale: 0, opacity: 0 },
  visible: {
    scale: 1, opacity: 1,
    transition: { type: 'spring', stiffness: 500, damping: 22 },
  },
};

/** Count-up transition — attach to motion.span with useCountUp hook */
export const countUpTransition: Transition = {
  duration: duration.slower,
  ease: ease.decelerate,
};

/** Onboarding step transition — horizontal slide between wizard steps */
export const stepForward: Variants = {
  hidden:  { opacity: 0, x: 60 },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: duration.slow, ease: ease.emphasized },
  },
  exit: {
    opacity: 0, x: -60,
    transition: { duration: duration.base, ease: ease.accelerate },
  },
};

export const stepBackward: Variants = {
  hidden:  { opacity: 0, x: -60 },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: duration.slow, ease: ease.emphasized },
  },
  exit: {
    opacity: 0, x: 60,
    transition: { duration: duration.base, ease: ease.accelerate },
  },
};
