import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/** Home-screen icon with monogram + full website name. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 40,
          background: 'linear-gradient(145deg, #34d399 0%, #10b981 38%, #0f766e 100%)',
          color: 'white',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 52,
            fontWeight: 800,
            letterSpacing: '-0.05em',
            lineHeight: 1,
          }}
        >
          C2C
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 10,
            marginBottom: 12,
            width: 56,
            height: 4,
            borderRadius: 999,
            background: 'rgba(255,255,255,0.9)',
          }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: '0.02em',
            lineHeight: 1.2,
            opacity: 0.96,
            textAlign: 'center',
          }}
        >
          <span style={{ display: 'flex' }}>Campus to</span>
          <span style={{ display: 'flex' }}>Career</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
