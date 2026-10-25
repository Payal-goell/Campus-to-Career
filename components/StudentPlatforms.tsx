import { ExternalLink } from 'lucide-react';
import { STUDENT_PLATFORMS } from '@/data/student-platforms';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export function StudentPlatforms({ heading }: { heading: string }) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-sm font-bold text-[var(--text-primary)]">{heading}</h2>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          NPTEL, Coursera, Udemy, and the other sites students already use for a semester project or a placement certificate.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {STUDENT_PLATFORMS.map((platform) => (
          <a key={platform.name} href={platform.url} target="_blank" rel="noreferrer" className="block h-full">
            <Card className="p-4 h-full space-y-2 hover:border-[var(--primary)] transition-colors">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-sm">{platform.name}</h3>
                <Badge
                  variant={platform.cost === 'Paid' ? 'warning' : 'success'}
                  size="sm"
                >
                  {platform.cost}
                </Badge>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{platform.detail}</p>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--primary)]">
                Open platform <ExternalLink className="w-3 h-3" />
              </span>
            </Card>
          </a>
        ))}
      </div>
    </section>
  );
}
