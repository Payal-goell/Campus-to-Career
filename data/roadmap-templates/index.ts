import type { RoadmapTemplate } from '@/lib/roadmap/types';
import { genericTemplates } from './generic';
import { talentTemplates } from './talent';
import { domainTemplates } from './domains';
import { moreDomainTemplates } from './domains-more';
import { rgpvSubjectTemplates } from '../rgpv-subjects';

let cache: RoadmapTemplate[] | null = null;

export function getRoadmapTemplates(): RoadmapTemplate[] {
  if (cache) return cache;
  cache = [
    ...genericTemplates(),
    ...talentTemplates(),
    ...domainTemplates(),
    ...moreDomainTemplates(),
    ...rgpvSubjectTemplates(),
  ];
  return cache;
}

export function templatesForTest(extra: RoadmapTemplate[] = []): RoadmapTemplate[] {
  return [...getRoadmapTemplates(), ...extra];
}
