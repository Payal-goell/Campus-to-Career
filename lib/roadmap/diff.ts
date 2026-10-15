import type { RoadmapDiff, RoadmapDiffItem, RoadmapNode } from './types';

export function diffRoadmaps(prev: RoadmapNode[], next: RoadmapNode[]): RoadmapDiff {
  const prevMap = new Map(prev.map((n) => [n.templateId, n]));
  const nextMap = new Map(next.map((n) => [n.templateId, n]));

  const added: RoadmapDiffItem[] = [];
  const removed: RoadmapDiffItem[] = [];
  const moved: RoadmapDiffItem[] = [];

  for (const node of next) {
    const old = prevMap.get(node.templateId);
    if (!old) {
      added.push({
        id: node.id,
        title: node.title,
        year: node.year,
        kind: 'added',
        reason: reasonAdded(node),
      });
    } else if (old.year !== node.year || old.period !== node.period) {
      moved.push({
        id: node.id,
        title: node.title,
        year: node.year,
        kind: 'moved',
        reason: `Moved from Year ${old.year} ${old.period} to Year ${node.year} ${node.period} to rebalance load.`,
        fromPeriod: old.period,
        toPeriod: node.period,
      });
    }
  }

  for (const node of prev) {
    if (!nextMap.has(node.templateId) && node.status !== 'completed') {
      removed.push({
        id: node.id,
        title: node.title,
        year: node.year,
        kind: 'removed',
        reason: reasonRemoved(node),
      });
    }
  }

  const yearTouched = [...added, ...removed, ...moved].map((d) => d.year);
  const year = yearTouched.sort()[0];
  const parts: string[] = [];
  if (added[0]) parts.push(`added ${added[0].title}`);
  if (removed[0]) parts.push(`removed ${removed[0].title}`);
  if (moved[0]) parts.push(`moved ${moved[0].title}`);
  const summary =
    parts.length === 0
      ? 'No structural changes'
      : `Year ${year ?? next[0]?.year ?? 1} updated: ${parts.join('; ')}`;

  return { added, removed, moved, summary };
}

function reasonAdded(node: RoadmapNode): string {
  const gain = node.skillGain[0]?.skill;
  if (gain) return `Added ${node.title} because your skill gap still includes ${gain}.`;
  if (node.pillar === 'extracurricular') return `Added ${node.title} to keep your talent track active.`;
  return `Added ${node.title} to restore Whole-Person balance.`;
}

function reasonRemoved(node: RoadmapNode): string {
  const skill = node.skillGain[0]?.skill;
  if (skill) return `Removed ${node.title} because you already sit at or above this ${skill} level.`;
  return `Removed ${node.title} to respect your weekly hours cap.`;
}
