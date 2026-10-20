import Image from 'next/image';
import { cn } from '@/lib/cn';

/** Static brand artwork — graduation → career mark with site name in the mark. */
export function BrandMark({ className, size = 36 }: { className?: string; size?: number }) {
  return (
    <span
      className={cn(
        'relative shrink-0 overflow-hidden rounded-[22%] shadow-[var(--glow-primary)]',
        'ring-1 ring-black/5 bg-white transition-transform duration-150 group-hover:scale-105',
        className
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src="/brand/mark-512.png"
        alt="Campus to Career"
        width={size}
        height={size}
        className="object-cover w-full h-full"
        priority
        unoptimized
      />
    </span>
  );
}
