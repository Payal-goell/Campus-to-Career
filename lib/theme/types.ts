import { PaletteId } from '@/design-tokens/tokens';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeContextValue {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  palette: PaletteId;
  setTheme: (pref: ThemePreference, event?: React.MouseEvent | MouseEvent) => void;
  setPalette: (palette: PaletteId) => void;
  previewPalette: (palette: PaletteId | null) => void;
  activePreviewPalette: PaletteId | null;
}
