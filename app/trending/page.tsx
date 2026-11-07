'use client';

import { Flame } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { TRENDING_TECH } from '@/data/trending-tech';

export default function TrendingPage() {
  return (
    <div className="space-y-8 py-6">
      <PageHeader
        badge="Hiring signal"
        title="Trending technologies"
        description="What 2026 campus JDs actually name. Each card has one place to start, with a free or paid label that matches the catalog."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TRENDING_TECH.map((tech) => (
          <Card key={tech.id} className="p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[var(--primary)]" />
                <h2 className="font-bold text-sm">{tech.name}</h2>
              </div>
              <Badge variant="primary" size="sm">
                {tech.wave}
              </Badge>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{tech.why}</p>
            <div className="flex flex-wrap gap-1.5">
              {tech.stack.map((item) => (
                <Badge key={item} variant="outline" size="sm">
                  {item}
                </Badge>
              ))}
              {tech.years.map((year) => (
                <Badge key={year} variant="outline" size="sm">
                  Y{year}
                </Badge>
              ))}
            </div>
            <div className="mt-auto pt-1">
              <Button size="sm" variant="secondary" href={tech.startHere.url} target="_blank">
                {tech.startHere.title} · {tech.startHere.cost}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
