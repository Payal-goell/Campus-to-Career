'use client';

import React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from '@/lib/cn';

/* ─── Avatar ──────────────────────────────────────────────────── */
interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  online?: boolean;
  gradient?: boolean;
  className?: string;
}

const sizeClasses = {
  xs:  'w-6 h-6 text-[9px]',
  sm:  'w-8 h-8 text-xs',
  md:  'w-10 h-10 text-sm',
  lg:  'w-12 h-12 text-base',
  xl:  'w-16 h-16 text-lg',
  '2xl': 'w-20 h-20 text-xl',
};

const dotSizes = {
  xs: 'w-1.5 h-1.5 border',
  sm: 'w-2 h-2 border',
  md: 'w-2.5 h-2.5 border-2',
  lg: 'w-3 h-3 border-2',
  xl: 'w-3.5 h-3.5 border-2',
  '2xl': 'w-4 h-4 border-2',
};

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export function Avatar({
  src,
  alt,
  name = 'User',
  size = 'md',
  online,
  gradient = true,
  className,
}: AvatarProps) {
  return (
    <AvatarPrimitive.Root className={cn('relative inline-flex flex-shrink-0', sizeClasses[size], className)}>
      <AvatarPrimitive.Image
        src={src}
        alt={alt ?? name}
        className="w-full h-full rounded-full object-cover"
      />
      <AvatarPrimitive.Fallback
        className={cn(
          'w-full h-full rounded-full flex items-center justify-center font-bold text-white',
          gradient
            ? 'bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500'
            : 'bg-[var(--surface-raised)]'
        )}
      >
        {getInitials(name)}
      </AvatarPrimitive.Fallback>
      {online !== undefined && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-[var(--surface)] block',
            dotSizes[size],
            online ? 'bg-green-500' : 'bg-[var(--text-muted)]'
          )}
          aria-label={online ? 'Online' : 'Offline'}
        />
      )}
    </AvatarPrimitive.Root>
  );
}

/* ─── Avatar Group ────────────────────────────────────────────── */
interface AvatarGroupProps {
  avatars: { src?: string; name: string }[];
  max?: number;
  size?: AvatarProps['size'];
  className?: string;
}

export function AvatarGroup({ avatars, max = 4, size = 'sm', className }: AvatarGroupProps) {
  const shown = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className={cn('flex items-center', className)}>
      {shown.map((av, i) => (
        <div key={i} className={cn('-ml-2 first:ml-0 ring-2 ring-[var(--surface)] rounded-full')}>
          <Avatar src={av.src} name={av.name} size={size} />
        </div>
      ))}
      {remaining > 0 && (
        <div className={cn(
          '-ml-2 ring-2 ring-[var(--surface)] rounded-full flex items-center justify-center',
          'bg-[var(--surface-raised)] text-[var(--text-muted)] font-semibold text-xs',
          sizeClasses[size]
        )}>
          +{remaining}
        </div>
      )}
    </div>
  );
}
