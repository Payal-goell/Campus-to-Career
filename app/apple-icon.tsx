import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/** Home-screen icon: unique dual-C mark + website name. */
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
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              display: 'flex',
              width: 42,
              height: 54,
              borderRadius: 28,
              border: '8px solid #5EEAD4',
              borderRightColor: 'transparent',
            }}
          />
          <div
            style={{
              display: 'flex',
              width: 42,
              height: 54,
              borderRadius: 28,
              border: '8px solid #FBBF24',
              borderLeftColor: 'transparent',
            }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: '0.04em',
            lineHeight: 1.25,
            opacity: 0.95,
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
