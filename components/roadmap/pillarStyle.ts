import { PILLAR_LANE, TALENT_TOKEN } from '@/lib/roadmap/constants';
import type { RoadmapNode, RoadmapPillar } from '@/lib/roadmap/types';

export function laneVar(node: RoadmapNode): { color: string; subtle: string; fg: string } {
  const lane = PILLAR_LANE[node.pillar];
  if (lane === 'placement') {
    return { color: 'var(--accent)', subtle: 'var(--accent-subtle)', fg: 'var(--accent-fg)' };
  }
  if (lane === 'talent') {
    const key = node.talentTrack ? TALENT_TOKEN[node.talentTrack] : 'communication';
    return {
      color: `var(--talent-${key})`,
      subtle: `var(--talent-${key}-subtle)`,
      fg: `var(--talent-${key}-fg)`,
    };
  }
  return {
    color: 'var(--talent-technical)',
    subtle: 'var(--talent-technical-subtle)',
    fg: 'var(--talent-technical-fg)',
  };
}

export function pillarLabel(p: RoadmapPillar): string {
  const map: Record<RoadmapPillar, string> = {
    subjects: 'Subjects',
    skills: 'Skills',
    certification: 'Certification',
    project: 'Project',
    extracurricular: 'Extracurricular',
    personality: 'Personality',
    placement: 'Placement',
  };
  return map[p];
}
