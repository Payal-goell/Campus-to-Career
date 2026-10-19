import { ImageResponse } from 'next/og';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

/** High-contrast C2C mark for browser tabs. */
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
          background: 'linear-gradient(145deg, #34d399 0%, #10b981 40%, #0f766e 100%)',
          boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.22)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
            lineHeight: 1,
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: '-0.06em',
            }}
          >
            C2C
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 3,
              width: 28,
              height: 3,
              borderRadius: 999,
              background: 'rgba(255,255,255,0.85)',
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
