import { ImageResponse } from 'next/og';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

/** Brand mark shown in the browser tab. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 14,
          background: 'linear-gradient(145deg, #10b981 0%, #0d9488 45%, #0f766e 100%)',
          boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.18)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'rgba(255,255,255,0.14)',
            color: 'white',
            fontSize: 30,
            fontWeight: 800,
            letterSpacing: '-0.08em',
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          }}
        >
          C
        </div>
      </div>
    ),
    { ...size }
  );
}
