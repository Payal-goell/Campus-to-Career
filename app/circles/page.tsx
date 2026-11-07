'use client';

import { useEffect, useMemo, useState } from 'react';
import { UsersRound } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { joinedCircles, STUDY_CIRCLES, toggleCircle } from '@/data/study-circles';

export default function CirclesPage() {
  const [joined, setJoined] = useState<string[]>([]);

  useEffect(() => {
    setJoined(joinedCircles());
  }, []);
  const mine = useMemo(() => STUDY_CIRCLES.filter((c) => joined.includes(c.id)), [joined]);

  return (
    <div className="space-y-8 py-6">
      <PageHeader
        badge="Peer lab"
        title="Study circles"
        description="Pick a subject huddle. The seat lives on this device so you can show up with the same group next week."
      />
      {mine.length > 0 && (
        <p className="text-xs text-[var(--text-secondary)]">
          You are in {mine.map((c) => c.subject).join(', ')}.
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {STUDY_CIRCLES.map((circle) => {
          const inCircle = joined.includes(circle.id);
          return (
            <Card key={circle.id} className="p-5 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <UsersRound className="w-4 h-4 text-[var(--primary)]" />
                <h2 className="font-bold text-sm">{circle.subject}</h2>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">{circle.cadence} · {circle.seats}</p>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{circle.focus}</p>
              <div className="mt-auto pt-1">
                <Button
                  size="sm"
                  variant={inCircle ? 'secondary' : 'gradient'}
                  onClick={() => setJoined(toggleCircle(circle.id))}
                >
                  {inCircle ? 'Leave circle' : 'Join this circle'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
