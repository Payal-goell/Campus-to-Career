'use client';

import { cn } from '@/lib/cn';

/** Crop SISTec photos so faces/stage stay in frame instead of a thin banner. */
export function CoverImage({
  src,
  alt = '',
  className,
  position = '50% 28%',
}: {
  src?: string | null;
  alt?: string;
  className?: string;
  position?: string;
}) {
  if (!src) {
    return <div className={cn('bg-[var(--surface-inset)]', className)} aria-hidden />;
  }
  return (
    <div className={cn('overflow-hidden bg-[var(--surface-inset)]', className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        style={{ objectPosition: position }}
      />
    </div>
  );
}
