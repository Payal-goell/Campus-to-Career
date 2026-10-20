import { ImageResponse } from 'next/og';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';
export const runtime = 'edge';

/** Static tab icon — fixed ink / mint / amber dual-C (does not change with theme). */
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
          background: 'linear-gradient(145deg, #0B1F2A 0%, #0F766E 100%)',
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
          <div style={{ display: 'flex', fontSize: 20, fontWeight: 800, letterSpacing: '-0.04em' }}>
            C2C
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 4,
              fontSize: 7,
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: '#FBBF24',
              textTransform: 'uppercase',
            }}
          >
            Campus
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
