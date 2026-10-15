'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import { fadeUp, stagger, staggerItem } from '@/lib/motion';
import { cn } from '@/lib/cn';

export function PageHeader({
  badge,
  title,
  description,
  actions,
  className,
}: {
  badge?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={stagger(0.06)}
      initial="hidden"
      animate="visible"
      className={cn(
        'flex flex-col lg:flex-row lg:items-center justify-between gap-5',
        className
      )}
    >
      <div className="min-w-0 space-y-2">
        {badge && (
          <motion.div variants={staggerItem}>
            <Badge variant="primary" size="sm">
              {badge}
            </Badge>
          </motion.div>
        )}
        <motion.h1 variants={staggerItem} className="text-2xl sm:text-3xl font-black tracking-tight">
          {title}
        </motion.h1>
        {description && (
          <motion.p variants={fadeUp} className="text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            {description}
          </motion.p>
        )}
      </div>
      {actions && (
        <motion.div variants={staggerItem} className="flex flex-wrap items-center gap-2 shrink-0">
          {actions}
        </motion.div>
      )}
    </motion.div>
  );
}
