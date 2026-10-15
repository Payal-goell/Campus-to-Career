/**
 * Campus to Career — Design Token Definitions & Metadata
 * 6 Palettes × 2 Modes (12 Sets)
 */

export type ThemeMode = 'light' | 'dark';
export type ThemePreference = 'light' | 'dark' | 'system';
export type PaletteId = 'forest' | 'ocean' | 'ember' | 'plum' | 'graphite' | 'rosewood';

export interface PaletteDefinition {
  id: PaletteId;
  name: string;
  description: string;
  roleDefault?: 'Student' | 'Admin' | 'Recruiter';
  light: {
    primary: string;
    primaryForeground: string;
    accent: string;
    accentForeground: string;
    background: string;
    surface: string;
    border: string;
    textPrimary: string;
    textSecondary: string;
    accentText: string;
  };
  dark: {
    primary: string;
    primaryForeground: string;
    accent: string;
    accentForeground: string;
    background: string;
    surface: string;
    border: string;
    textPrimary: string;
    textSecondary: string;
    accentText: string;
  };
}

export const PALETTES: Record<PaletteId, PaletteDefinition> = {
  forest: {
    id: 'forest',
    name: 'Forest & Sand',
    description: 'Calm, grounded organic tones for focused lifelong learning.',
    roleDefault: 'Student',
    light: {
      primary: '#14532D',
      primaryForeground: '#FAF7F2',
      accent: '#D4A373',
      accentForeground: '#142018',
      background: '#FAF7F2',
      surface: '#FFFFFF',
      border: '#E8E1D4',
      textPrimary: '#142018',
      textSecondary: '#5E6B60',
      accentText: '#855829',
    },
    dark: {
      primary: '#4ADE80',
      primaryForeground: '#052E16',
      accent: '#E6BE92',
      accentForeground: '#142018',
      background: '#0B120D',
      surface: '#141E17',
      border: '#24352A',
      textPrimary: '#F1F6F2',
      textSecondary: '#9DB1A1',
      accentText: '#E6BE92',
    },
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean & Coral',
    description: 'Deep maritime blue with energetic coral for dynamic career growth.',
    roleDefault: 'Recruiter',
    light: {
      primary: '#0E5A7A',
      primaryForeground: '#F5FAFC',
      accent: '#F2845C',
      accentForeground: '#1F1410',
      background: '#F5FAFC',
      surface: '#FFFFFF',
      border: '#D9E8EF',
      textPrimary: '#0C2230',
      textSecondary: '#55707F',
      accentText: '#B43E15',
    },
    dark: {
      primary: '#38BDF8',
      primaryForeground: '#04202D',
      accent: '#FF9F7A',
      accentForeground: '#1F1410',
      background: '#07131A',
      surface: '#0F202B',
      border: '#1B3646',
      textPrimary: '#EAF6FC',
      textSecondary: '#93B2C2',
      accentText: '#FF9F7A',
    },
  },
  ember: {
    id: 'ember',
    name: 'Sunset Ember',
    description: 'Vibrant, warm motivation and high ambition for active job seekers.',
    light: {
      primary: '#C2410C',
      primaryForeground: '#FFF8F1',
      accent: '#F59E0B',
      accentForeground: '#2A1608',
      background: '#FFF8F1',
      surface: '#FFFFFF',
      border: '#F1DFCF',
      textPrimary: '#2A160B',
      textSecondary: '#7A5B48',
      accentText: '#A14E00',
    },
    dark: {
      primary: '#FB923C',
      primaryForeground: '#2A1203',
      accent: '#FCD34D',
      accentForeground: '#2A1608',
      background: '#140C08',
      surface: '#201510',
      border: '#3A261B',
      textPrimary: '#FFF1E6',
      textSecondary: '#C8A58E',
      accentText: '#FCD34D',
    },
  },
  plum: {
    id: 'plum',
    name: 'Royal Plum',
    description: 'Sophisticated amethyst & warm gold celebrating academic & creative mastery.',
    light: {
      primary: '#6B21A8',
      primaryForeground: '#FAF7FD',
      accent: '#D9A441',
      accentForeground: '#2A1C05',
      background: '#FAF7FD',
      surface: '#FFFFFF',
      border: '#E7DDF3',
      textPrimary: '#1E1030',
      textSecondary: '#6A5A80',
      accentText: '#8C5F10',
    },
    dark: {
      primary: '#C084FC',
      primaryForeground: '#1E0B33',
      accent: '#F2C46D',
      accentForeground: '#2A1C05',
      background: '#0F0A18',
      surface: '#191128',
      border: '#2E2247',
      textPrimary: '#F5EEFF',
      textSecondary: '#B7A6D0',
      accentText: '#F2C46D',
    },
  },
  graphite: {
    id: 'graphite',
    name: 'Graphite & Mint',
    description: 'Precision engineering aesthetic tailored for college administration & analytics.',
    roleDefault: 'Admin',
    light: {
      primary: '#1F2937',
      primaryForeground: '#F6F8F8',
      accent: '#14B8A6',
      accentForeground: '#052E2B',
      background: '#F6F8F8',
      surface: '#FFFFFF',
      border: '#DFE6E6',
      textPrimary: '#111827',
      textSecondary: '#5B6770',
      accentText: '#0F766E',
    },
    dark: {
      primary: '#5EEAD4',
      primaryForeground: '#03211E',
      accent: '#99F6E4',
      accentForeground: '#052E2B',
      background: '#0A0F10',
      surface: '#121A1C',
      border: '#223034',
      textPrimary: '#ECFEFF',
      textSecondary: '#9AAAB0',
      accentText: '#99F6E4',
    },
  },
  rosewood: {
    id: 'rosewood',
    name: 'Rosewood',
    description: 'Expressive ruby & soft lavender for rich cultural & talent expression.',
    light: {
      primary: '#BE185D',
      primaryForeground: '#FFF7FA',
      accent: '#A78BFA',
      accentForeground: '#1E1240',
      background: '#FFF7FA',
      surface: '#FFFFFF',
      border: '#F5DCE6',
      textPrimary: '#2A0F1C',
      textSecondary: '#7A5365',
      accentText: '#5B21B6',
    },
    dark: {
      primary: '#F0529C',
      primaryForeground: '#2A0614',
      accent: '#C4B5FD',
      accentForeground: '#1E1240',
      background: '#16090F',
      surface: '#22101A',
      border: '#3D1F2E',
      textPrimary: '#FFF0F6',
      textSecondary: '#C9A0B4',
      accentText: '#C4B5FD',
    },
  },
};

export const TALENT_CATEGORIES = [
  { id: 'technical', name: 'Technical', light: '#14532D', dark: '#4ADE80' },
  { id: 'dance', name: 'Dance & Movement', light: '#B5532F', dark: '#E07A5F' },
  { id: 'music', name: 'Music & Singing', light: '#C58A1B', dark: '#F4A261' },
  { id: 'sports', name: 'Sports & Athletics', light: '#3F7F73', dark: '#52B788' },
  { id: 'drama', name: 'Theatre & Drama', light: '#7A4B5E', dark: '#C08497' },
  { id: 'creative', name: 'Creative Arts', light: '#4A6C8C', dark: '#64B5F6' },
  { id: 'communication', name: 'Communication & Debate', light: '#D4A373', dark: '#E6BE92' },
  { id: 'leadership', name: 'Leadership & Social', light: '#6B8E23', dark: '#A7C957' },
] as const;

export const STATUS_COLORS = {
  success: { light: '#16A34A', dark: '#4ADE80' },
  warning: { light: '#D97706', dark: '#FBBF24' },
  danger: { light: '#DC2626', dark: '#F87171' },
  info: { light: '#0284C7', dark: '#38BDF8' },
  badgeFree: { light: '#16A34A', dark: '#4ADE80' },
  badgePaid: { light: '#B7791F', dark: '#F5C451' },
};
