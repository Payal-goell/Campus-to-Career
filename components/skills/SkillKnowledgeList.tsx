'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { howWeKnow, readStoredAssessments, type SkillAssessmentRecord } from '@/lib/skill-assessment';

export function useSkillRecords(serverRecords?: SkillAssessmentRecord[]) {
  const [records, setRecords] = useState<SkillAssessmentRecord[]>(serverRecords ?? []);

  useEffect(() => {
    if (serverRecords && serverRecords.length > 0) {
      setRecords(serverRecords);
      return;
    }
    setRecords(readStoredAssessments());
  }, [serverRecords]);

  return records;
}

export function SkillKnowledgeList({
  records,
  names,
}: {
  records: SkillAssessmentRecord[];
  names: string[];
}) {
  if (records.length === 0) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {names.map((name) => (
          <Badge key={name} variant="outline" size="sm">{name}</Badge>
        ))}
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {records.map((record) => (
        <li key={record.name} className="text-xs text-[var(--text-secondary)] space-y-0.5">
          <p>
            <span className="font-semibold text-[var(--text-primary)]">{record.name}</span>
            {' · '}
            <span className="font-semibold text-[var(--primary)]">{record.percent}%</span>
          </p>
          <p>{howWeKnow(record)}</p>
        </li>
      ))}
    </ul>
  );
}
