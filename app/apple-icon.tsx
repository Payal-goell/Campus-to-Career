import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 40,
          background: 'linear-gradient(145deg, #10b981 0%, #0d9488 45%, #0f766e 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: 128,
            height: 128,
            borderRadius: 32,
            background: 'rgba(255,255,255,0.16)',
            color: 'white',
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          }}
        >
          <div style={{ display: 'flex', fontSize: 78, fontWeight: 800, letterSpacing: '-0.08em', lineHeight: 1 }}>
            C
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 4,
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: '0.22em',
              opacity: 0.92,
            }}
          >
            2C
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
