import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

/** Static tab favicon from the Campus Career brand mark. */
export default async function Icon() {
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
          borderRadius: 14,
          overflow: 'hidden',
          background: '#ffffff',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" width={64} height={64} style={{ objectFit: 'cover' }} />
      </div>
    ),
    { ...size }
  );
}
