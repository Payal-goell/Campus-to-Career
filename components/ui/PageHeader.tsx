import { Badge } from '@/components/ui/Badge';
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
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between',
        className
      )}
    >
      <div className="min-w-0 space-y-2">
        {badge && (
          <Badge variant="primary" size="sm">
            {badge}
          </Badge>
        )}
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight break-words">{title}</h1>
        {description && (
          <p className="text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {actions}
        </div>
      )}
    </div>
  );
}
