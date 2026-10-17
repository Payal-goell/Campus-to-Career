'use client';

import { cn } from '@/lib/cn';

/** Crop SISTec photos so faces/stage stay in frame instead of a thin banner. */
export function CoverImage({
  src,
  alt = '',
  className,
  position = '50% 28%',
  priority = false,
}: {
  src?: string | null;
  alt?: string;
  className?: string;
  position?: string;
  priority?: boolean;
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
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        className="block w-full h-full object-cover"
        style={{ objectPosition: position }}
      />
    </div>
  );
}
