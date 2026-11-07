'use client';

import { Radar } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { OPPORTUNITIES } from '@/data/opportunities';

export default function OpportunitiesPage() {
  return (
    <div className="space-y-8 py-6">
      <PageHeader
        badge="Open calls"
        title="Hackathons, packs, and exams you can finish"
        description="Public programs Indian RGPV students already apply to. Dates move; the official page is the source."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {OPPORTUNITIES.map((item) => (
          <Card key={item.id} className="p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <Radar className="w-4 h-4 text-[var(--primary)]" />
                <h2 className="font-bold text-sm">{item.name}</h2>
              </div>
              <Badge variant="primary" size="sm">
                {item.kind}
              </Badge>
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">{item.window}</p>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{item.why}</p>
            <div className="mt-auto pt-1 flex items-center justify-between gap-2">
              <Badge variant="outline" size="sm">
                {item.cost}
              </Badge>
              <Button size="sm" variant="gradient" href={item.url} target="_blank">
                Open official page
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
