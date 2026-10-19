import { ImageResponse } from 'next/og';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

/** Static fallback: ink + mint/amber dual-C pathway mark. */
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
          position: 'relative',
        }}
      >
        {/* Left C — campus (mint) */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            left: 10,
            top: 14,
            width: 28,
            height: 36,
            borderRadius: 18,
            border: '5px solid #5EEAD4',
            borderRightColor: 'transparent',
          }}
        />
        {/* Right C — career (amber) */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            right: 10,
            top: 14,
            width: 28,
            height: 36,
            borderRadius: 18,
            border: '5px solid #FBBF24',
            borderLeftColor: 'transparent',
          }}
        />
        {/* Pathway dash */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            bottom: 14,
            width: 22,
            height: 3,
            borderRadius: 999,
            background: 'rgba(255,255,255,0.85)',
            transform: 'rotate(-28deg)',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
