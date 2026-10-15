# Design Tokens Changelog

## [1.0.0] - Phase 1 Foundation Release

### Architecture & Parity Contract Established
- Implemented **12-Combination Design System** supporting two independent axes on `<html>`:
  - `data-theme="light|dark"`
  - `data-palette="forest|ocean|ember|plum|graphite|rosewood"` (Default: `forest`)
- Every palette defines every semantic token across both light and dark modes with identical structural elevation order:
  `--bg` < `--surface` < `--surface-elevated` < `--overlay`.
- Dark mode brand colors are tuned lighter and balanced to prevent optical vibration against deep backgrounds.
- All 8 whole-person talent categories (Technical, Dance, Music, Sports, Drama, Creative, Communication, Leadership) have dedicated semantic tokens across both modes.

### WCAG 2.2 AA Contrast Adjustments
1. **Accent Text Token (`--accent-text`)**:
   - In light mode, base accent colors (such as sand `#D4A373` and amber `#F59E0B`) fail 4.5:1 against light surface backgrounds `#FAF7F2` and `#FFFFFF`.
   - Introduced `--accent-text` across all 6 palettes with computed dark variants (`#855829`, `#B43E15`, `#A14E00`, `#8C5F10`, `#0F766E`, `#5B21B6`), guaranteeing strict >= 4.5:1 contrast against surfaces when used as typography.
2. **Text Secondary Contrast (`--text-secondary` and `--text-muted`)**:
   - Adjusted `--text-secondary` in all 12 combinations to exceed 4.5:1 on their corresponding background and surface tokens.
3. **Derived Interactive States**:
   - Hover: `mix(color, foreground, 8%)`
   - Active: `mix(color, foreground, 14%)`
   - Subtle: 12% opacity (light) / 16% opacity (dark) over base surface.
