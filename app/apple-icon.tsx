import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/** Static apple / home-screen icon from the Campus Career brand mark. */
export default async function AppleIcon() {
  const bytes = await readFile(join(process.cwd(), 'public/brand/mark-512.png'));
  const base64 = Buffer.from(bytes).toString('base64');
  const src = `data:image/png;base64,${base64}`;

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
          overflow: 'hidden',
          background: '#ffffff',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" width={180} height={180} style={{ objectFit: 'cover' }} />
      </div>
    ),
    { ...size }
  );
}
