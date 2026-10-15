# Campus to Career — Design System Specification

## 1. Overview
The **Campus to Career Design System** is a unified, accessible, and high-density SaaS design language built for university students, college administrators, and recruiters. It bridges academic planning, skill tracking, and corporate placement readiness.

---

## 2. Design Tokens Architecture

The design system is powered by semantic CSS custom properties defined in `styles/tokens.css` and mapped into `tailwind.config.ts`. All components consume tokens rather than hardcoded palette values.

### 2.1 Theme Support
The system provides a seamless three-way theme engine (**Light**, **Dark**, and **System**) driven by `next-themes` and zero-FOUC initialization script.

### 2.2 Color Scales & Semantic Roles
| Role | Dark Token | Light Token | Purpose |
|------|------------|-------------|---------|
| `--color-surface` | `#0f1422` | `#ffffff` | Primary card & section background |
| `--color-surface-raised` | `#161d31` | `#f8fafc` | Elevated dropdowns, popovers, modals |
| `--color-surface-overlay` | `#1f2945` | `#f1f5f9` | Inset backgrounds, segmented tabs |
| `--color-brand-primary` | `#6366f1` | `#4f46e5` | Core brand identity & CTA buttons |
| `--color-brand-secondary` | `#8b5cf6` | `#7c3aed` | Secondary gradients & roadmap markers |
| `--color-accent` | `#06b6d4` | `#0891b2` | High-engagement highlights, metrics |
| `--color-text-primary` | `#f8fafc` | `#0f172a` | High-contrast headings and body |
| `--color-text-secondary` | `#94a3b8` | `#475569` | Sub-labels, captions, descriptive text |
| `--color-text-muted` | `#64748b` | `#94a3b8` | Placeholders, inactive icons, timestamps |
| `--color-border-subtle` | `rgba(255,255,255,0.08)` | `rgba(0,0,0,0.08)` | Dividers, card borders, table rows |

### 2.3 Semantic Status Tokens
- **Success:** `#10b981` (Completed milestones, verified badges, offer received)
- **Warning:** `#f59e0b` (In progress, upcoming deadlines, pending review)
- **Danger:** `#ef4444` (Missed milestones, critical errors, rejections)
- **Info:** `#3b82f6` (System notifications, informational tooltips)

---

## 3. Typography Hierarchy

- **Display Fonts:** Plus Jakarta Sans & Space Grotesk
- **Monospace Code/Data Font:** JetBrains Mono

| Class | Desktop Size / Leading | Mobile Size / Leading | Weight | Usage |
|-------|------------------------|-----------------------|--------|-------|
| `.text-display-2xl` | 48px / 56px | 32px / 40px | 800 (Extrabold) | Hero Headlines |
| `.text-display-xl` | 40px / 48px | 28px / 36px | 800 (Extrabold) | Page Titles |
| `.text-display-lg` | 32px / 40px | 24px / 32px | 700 (Bold) | Module / Section Headings |
| `.text-display-md` | 24px / 32px | 20px / 28px | 600 (Semibold) | Card Titles, Modal Headers |
| `.text-base` | 16px / 24px | 15px / 22px | 400 (Regular) | Body Content |
| `.text-sm` | 14px / 20px | 13px / 18px | 500 (Medium) | Subtitle, Form Inputs |
| `.text-xs` | 12px / 16px | 11px / 14px | 600 (Semibold) | Badges, Helper Text, Micro-labels |

---

## 4. Motion & Micro-interactions (`lib/motion.ts`)

- **Timing Presets:**
  - `fast`: `150ms` (hover, button clicks)
  - `base`: `250ms` (dropdowns, accordions)
  - `slow`: `400ms` (modals, sheets, page transitions)
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` (Emphasized Apple/Linear curve)
- **Accessibility:** Fully honors `prefers-reduced-motion` across Framer Motion variants and CSS keyframes.

---

## 5. Component Library Index (`components/ui/`)

1. **Button (`Button.tsx`)**: 8 variants (`primary`, `secondary`, `accent`, `gradient`, `outline`, `ghost`, `destructive`, `link`), 4 sizes (`xs`, `sm`, `md`, `lg`), with loading spinner and icon slots.
2. **Badge (`Badge.tsx`)**: 11 variants including `free`, `paid`, `outline`, and pulse dot indicators.
3. **Card (`Card.tsx`)**: Bento grid layouts, stats presentation, interactive hover lifts, and subcomponents (`CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`).
4. **Input (`Input.tsx`)**: Form control with left/right icons, error states, and helper hints.
5. **Select (`Select.tsx`)**: Radix UI select dropdown with smooth popover placement.
6. **Switch (`Switch.tsx`)**: Accessible toggle switch with optional label and description.
7. **Tabs (`Tabs.tsx`)**: Sliding active indicator powered by Framer Motion `layoutId`.
8. **Modal & Sheet (`Modal.tsx`)**: Radix Dialog and side drawer with spring transitions and keyboard focus trapping.
9. **Progress (`Progress.tsx`)**: `ProgressBar` (viewport animated), `ProgressRing` (SVG circular), and `AnimatedCount` (count-up integer animation).
10. **Avatar & AvatarGroup (`Avatar.tsx`)**: Gradient fallback initials, online status indicator, and grouped stack with `+N` count.
11. **Toast (`Toast.tsx`)**: Sonner wrapper with typed helpers for `success`, `error`, `warning`, `info`, and promise states.
12. **EmptyState (`EmptyState.tsx`)**: Illustrated empty state with primary and secondary CTA buttons.
13. **ThemeToggle (`ThemeToggle.tsx`)**: Segmented or floating button for Light/Dark/System cycling.

---

## 6. Showcase & Living Documentation
Visit the `/design-system` route locally at `http://localhost:3000/design-system` to test all components, interactive states, and theme switching live.
