import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';
export const runtime = 'edge';

/** Static home-screen icon with full website name. */
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
          background: 'linear-gradient(145deg, #0B1F2A 0%, #0F766E 100%)',
          color: 'white',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 44,
            fontWeight: 800,
            letterSpacing: '-0.04em',
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
            width: 48,
            height: 4,
            borderRadius: 999,
            background: '#FBBF24',
          }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontSize: 17,
            fontWeight: 700,
            letterSpacing: '0.02em',
            lineHeight: 1.25,
          }}
        >
          <span style={{ display: 'flex' }}>Campus to</span>
          <span style={{ display: 'flex', color: '#FBBF24' }}>Career</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
