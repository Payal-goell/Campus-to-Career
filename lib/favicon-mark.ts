/** Shared C2C dual-path mark colors + drawing for static + live favicons. */

export const FAVICON_THEME = {
  inkTop: '#0B1F2A',
  inkBottom: '#0F766E',
  mint: '#5EEAD4',
  amber: '#FBBF24',
  white: '#FFFFFF',
} as const;

export type FaviconPalette = {
  inkTop: string;
  inkBottom: string;
  mint: string;
  amber: string;
};

/** Map site palette → live favicon colors (unique per theme). */
export function faviconColorsFor(
  paletteId: string,
  mode: 'light' | 'dark'
): FaviconPalette {
  const dark = mode === 'dark';
  switch (paletteId) {
    case 'ocean':
      return {
        inkTop: dark ? '#07131A' : '#0C2230',
        inkBottom: dark ? '#0E5A7A' : '#0E5A7A',
        mint: dark ? '#38BDF8' : '#7DD3FC',
        amber: dark ? '#FF9F7A' : '#F2845C',
      };
    case 'ember':
      return {
        inkTop: dark ? '#140C08' : '#2A160B',
        inkBottom: dark ? '#9A3412' : '#C2410C',
        mint: dark ? '#FCD34D' : '#FBBF24',
        amber: dark ? '#FB923C' : '#F97316',
      };
    case 'plum':
      return {
        inkTop: dark ? '#0F0A18' : '#1E1030',
        inkBottom: dark ? '#6B21A8' : '#6B21A8',
        mint: dark ? '#C084FC' : '#E9D5FF',
        amber: dark ? '#F2C46D' : '#D9A441',
      };
    case 'graphite':
      return {
        inkTop: dark ? '#0A0F10' : '#111827',
        inkBottom: dark ? '#134E4A' : '#1F2937',
        mint: dark ? '#5EEAD4' : '#2DD4BF',
        amber: dark ? '#99F6E4' : '#14B8A6',
      };
    case 'rosewood':
      return {
        inkTop: dark ? '#16090F' : '#2A0F1C',
        inkBottom: dark ? '#9D174D' : '#BE185D',
        mint: dark ? '#F0529C' : '#FBCFE8',
        amber: dark ? '#C4B5FD' : '#A78BFA',
      };
    case 'forest':
    default:
      return {
        inkTop: dark ? '#0B120D' : '#0B1F2A',
        inkBottom: dark ? '#14532D' : '#0F766E',
        mint: dark ? '#4ADE80' : '#5EEAD4',
        amber: dark ? '#E6BE92' : '#FBBF24',
      };
  }
}

/** Draw the dual-C pathway mark onto a canvas (size typically 64). */
export function drawFaviconMark(
  ctx: CanvasRenderingContext2D,
  size: number,
  colors: FaviconPalette,
  pulse = 0
) {
  const r = size * 0.22;
  ctx.clearRect(0, 0, size, size);

  // Rounded badge
  roundedRect(ctx, 0, 0, size, size, r);
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, colors.inkTop);
  grad.addColorStop(1, colors.inkBottom);
  ctx.fillStyle = grad;
  ctx.fill();

  // Soft inner rim
  roundedRect(ctx, size * 0.04, size * 0.04, size * 0.92, size * 0.92, r * 0.85);
  ctx.strokeStyle = `rgba(255,255,255,${0.14 + pulse * 0.1})`;
  ctx.lineWidth = Math.max(1, size * 0.02);
  ctx.stroke();

  const cx = size / 2;
  const cy = size / 2;
  const stroke = Math.max(2.5, size * 0.09);

  // Left C (mint) — campus
  ctx.beginPath();
  ctx.arc(cx - size * 0.12, cy, size * 0.22, -Math.PI * 0.72, Math.PI * 0.72, false);
  ctx.strokeStyle = colors.mint;
  ctx.lineWidth = stroke;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Right C (amber) — career
  ctx.beginPath();
  ctx.arc(cx + size * 0.12, cy, size * 0.22, Math.PI * 0.28, -Math.PI * 0.28, false);
  ctx.strokeStyle = colors.amber;
  ctx.lineWidth = stroke;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Ascending path — interactive pulse
  const pathAlpha = 0.55 + pulse * 0.45;
  ctx.beginPath();
  ctx.moveTo(size * 0.22, size * 0.72);
  ctx.quadraticCurveTo(cx, size * 0.55 - pulse * size * 0.04, size * 0.72, size * 0.28);
  ctx.strokeStyle = `rgba(255,255,255,${pathAlpha})`;
  ctx.lineWidth = Math.max(1.5, size * 0.035);
  ctx.lineCap = 'round';
  ctx.stroke();

  // Arrow head
  const ax = size * 0.72;
  const ay = size * 0.28;
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(ax - size * 0.07, ay + size * 0.02);
  ctx.lineTo(ax - size * 0.02, ay + size * 0.07);
  ctx.closePath();
  ctx.fillStyle = colors.amber;
  ctx.fill();
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number
) {
  const r = Math.min(radius, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
