/**
 * Roadmap generation engine tests.
 * Run: npx tsx lib/roadmap/engine.test.ts
 */
import assert from 'node:assert/strict';
import { genericTemplates } from '../../data/roadmap-templates/generic';
import { talentTemplates } from '../../data/roadmap-templates/talent';
import { domainTemplates } from '../../data/roadmap-templates/domains';
import { moreDomainTemplates } from '../../data/roadmap-templates/domains-more';
import {
  balancePillars,
  capHours,
  generateRoadmap,
  orderByPrerequisites,
  regenerateWithDiff,
  subtractSkillGaps,
} from './generate';
import { EXPLORER_PROFILE, normalizeProfile } from './profile';
import { ROADMAP_PERSONAS } from './personas';
import { TALENT_PILLARS, TECHNICAL_PILLARS } from './constants';
import type { RoadmapNode, RoadmapTemplate, StudentProfile } from './types';
import { tpl } from '../../data/roadmap-templates/builder';

const library: RoadmapTemplate[] = [
  ...genericTemplates(),
  ...talentTemplates(),
  ...domainTemplates(),
  ...moreDomainTemplates(),
];

function miniLib(): RoadmapTemplate[] {
  return [
    tpl({
      id: 'a',
      year: 1,
      period: 'M1-2',
      pillar: 'skills',
      title: 'Linux basics',
      why: 'x',
      deliverables: ['d'],
      checklist: ['c'],
      hours: 20,
      skill: 'Linux',
      teachesLevel: 1,
    }),
    tpl({
      id: 'b',
      year: 1,
      period: 'M3-4',
      pillar: 'skills',
      title: 'Docker',
      why: 'x',
      deliverables: ['d'],
      checklist: ['c'],
      hours: 20,
      skill: 'Docker',
      teachesLevel: 1,
      prereqs: ['a'],
    }),
    tpl({
      id: 'c',
      year: 1,
      period: 'M1-2',
      pillar: 'personality',
      title: 'Intro',
      why: 'x',
      deliverables: ['d'],
      checklist: ['c'],
      hours: 6,
      skill: 'Communication',
      teachesLevel: 1,
      talentTrack: 'Personality',
    }),
    tpl({
      id: 'd',
      year: 1,
      period: 'M1-2',
      pillar: 'extracurricular',
      title: 'Dance club',
      why: 'x',
      deliverables: ['d'],
      checklist: ['c'],
      hours: 8,
      skill: 'Dance',
      teachesLevel: 1,
      talentTrack: 'Dance',
    }),
    tpl({
      id: 'e',
      year: 1,
      period: 'M1-2',
      pillar: 'certification',
      title: 'Huge cert',
      why: 'x',
      deliverables: ['d'],
      checklist: ['c'],
      hours: 80,
      skill: 'Certification discipline',
      teachesLevel: 1,
    }),
    tpl({
      id: 'e-small',
      year: 1,
      period: 'M3-4',
      pillar: 'certification',
      title: 'Short cert',
      why: 'x',
      deliverables: ['d'],
      checklist: ['c'],
      hours: 8,
      skill: 'Certification discipline',
      teachesLevel: 1,
    }),
  ];
}

function toNodes(ts: RoadmapTemplate[]): RoadmapNode[] {
  const r = generateRoadmap(
    {
      branch: 'CSE',
      currentYear: 1,
      skills: [],
      interestDomains: ['AI/Data Science'],
      talentInterests: ['Dance'],
      targetRole: 'ML Engineer',
      weeklyHours: 40,
      completedNodeIds: [],
    },
    ts
  );
  return r.nodes;
}

function testSkillGap() {
  const lib = miniLib();
  const withLinux: StudentProfile = {
    branch: 'CSE',
    currentYear: 1,
    skills: [{ name: 'Linux', category: 'technical', level: 2 }],
    interestDomains: ['Cloud and DevOps'],
    talentInterests: ['Dance'],
    targetRole: 'DevOps',
    weeklyHours: 20,
    completedNodeIds: [],
  };
  const kept = subtractSkillGaps(lib, withLinux);
  assert.equal(kept.some((t) => t.templateId === 'a'), false, 'Linux basics should be subtracted');
  assert.equal(kept.some((t) => t.templateId === 'b'), true, 'Docker should remain');
}

function testPrereqOrder() {
  const nodes: RoadmapNode[] = [
    {
      id: 'b',
      templateId: 'b',
      year: 1,
      period: 'M3-4',
      pillar: 'skills',
      title: 'Docker',
      why: '',
      deliverables: [],
      checklist: [],
      resources: [],
      estimatedHours: 10,
      difficulty: 'Beginner',
      prerequisites: ['a'],
      unlocks: [],
      synergyWith: [],
      status: 'locked',
      skillGain: [],
      domain: 'Generic',
      xp: 10,
    },
    {
      id: 'a',
      templateId: 'a',
      year: 1,
      period: 'M1-2',
      pillar: 'skills',
      title: 'Linux',
      why: '',
      deliverables: [],
      checklist: [],
      resources: [],
      estimatedHours: 10,
      difficulty: 'Beginner',
      prerequisites: [],
      unlocks: ['b'],
      synergyWith: [],
      status: 'locked',
      skillGain: [],
      domain: 'Generic',
      xp: 10,
    },
  ];
  const ordered = orderByPrerequisites(nodes);
  assert.equal(ordered[0].id, 'a');
  assert.equal(ordered[1].id, 'b');
}

function testHourCap() {
  const nodes = toNodes(miniLib());
  const capped = capHours(nodes, 6);
  const m12 = capped.filter((n) => n.year === 1 && n.period === 'M1-2');
  const hours = m12.reduce((s, n) => s + n.estimatedHours, 0);
  assert.ok(hours < 80, `hour cap should drop the 80h cert, got ${hours}`);
  assert.ok(
    m12.some((n) => TECHNICAL_PILLARS.includes(n.pillar) || n.pillar === 'placement'),
    'must keep a technical node'
  );
  assert.ok(m12.some((n) => TALENT_PILLARS.includes(n.pillar)), 'must keep a talent node');
}

function testBalance() {
  const profile: StudentProfile = {
    branch: 'CSE',
    currentYear: 1,
    skills: [],
    interestDomains: ['AI/Data Science'],
    talentInterests: ['Dance'],
    targetRole: 'ML',
    weeklyHours: 12,
    completedNodeIds: [],
  };
  const onlyTech = miniLib()
    .filter((t) => t.pillar === 'skills' || t.pillar === 'certification')
    .map((t) => ({
      id: t.templateId,
      templateId: t.templateId,
      year: t.year,
      period: t.period,
      pillar: t.pillar,
      title: t.title,
      why: t.why,
      deliverables: t.deliverables,
      checklist: t.checklist,
      resources: t.resources,
      estimatedHours: t.estimatedHours,
      difficulty: t.difficulty,
      prerequisites: t.prerequisiteTemplateIds,
      unlocks: [],
      synergyWith: [],
      status: 'available' as const,
      skillGain: t.skillGain,
      domain: t.domain,
      xp: 10,
    }));
  const balanced = balancePillars(onlyTech, miniLib(), profile);
  const m12 = balanced.filter((n) => n.period === 'M1-2' && n.year === 1);
  assert.ok(m12.some((n) => TALENT_PILLARS.includes(n.pillar)), 'Whole-Person: talent node injected');
}

function testFallback() {
  const { usedFallback, profile } = normalizeProfile({});
  assert.equal(usedFallback, true);
  assert.equal(profile.personaId, 'explorer');
  const r = generateRoadmap(null, library);
  assert.equal(r.usedFallback, true);
  assert.ok(r.nodes.length > 0, 'explorer roadmap is never empty');
}

function testAdaptiveDiff() {
  const base = ROADMAP_PERSONAS[0].profile;
  const first = generateRoadmap(base, library);
  const afterLinux: StudentProfile = {
    ...base,
    completedNodeIds: first.nodes.filter((n) => n.year === 1).slice(0, 3).map((n) => n.id),
    skills: [...base.skills, { name: 'Linux', category: 'technical', level: 2 }],
  };
  const { diff, roadmap } = regenerateWithDiff(first.nodes, afterLinux, library);
  assert.ok(roadmap.nodes.length > 0);
  assert.ok(typeof diff.summary === 'string');
}

function testPersonasPopulated() {
  for (const p of ROADMAP_PERSONAS) {
    const r = generateRoadmap(p.profile, library);
    assert.ok(r.nodes.length > 8, `${p.id} should have a full roadmap`);
    for (const year of [1, 2, 3, 4] as const) {
      const bucket = r.nodes.filter((n) => n.year === year);
      assert.ok(
        bucket.some((n) => TECHNICAL_PILLARS.includes(n.pillar) || n.pillar === 'placement'),
        `${p.id} year ${year} needs technical`
      );
      assert.ok(bucket.some((n) => TALENT_PILLARS.includes(n.pillar)), `${p.id} year ${year} needs talent`);
      const pillars = new Set(bucket.map((n) => n.pillar));
      assert.ok(pillars.has('skills') || pillars.has('subjects') || pillars.has('project'), `${p.id} y${year} skills/subjects`);
      assert.ok(pillars.has('extracurricular') || pillars.has('personality'), `${p.id} y${year} talent pillar`);
    }
    const certs = r.nodes.filter((n) => n.pillar === 'certification');
    assert.ok(certs.length > 0);
    assert.ok(certs.every((n) => n.resources.some((res) => res.cost === 'free') || n.resources.length === 0 || n.resources.some((res) => res.cost === 'paid' || res.cost === 'free')));
    const withCosts = certs.filter((n) => n.resources.length);
    assert.ok(withCosts.some((n) => n.resources.some((res) => res.cost === 'free')));
    assert.ok(withCosts.some((n) => n.resources.some((res) => res.cost === 'paid')));
  }
}

function testEmptyExplorerVsValid() {
  const empty = generateRoadmap({} as StudentProfile, library);
  assert.equal(empty.usedFallback, true);
  assert.ok(empty.nodes.length > 0);
  const priya = generateRoadmap(ROADMAP_PERSONAS[0].profile, library);
  assert.equal(priya.usedFallback, false);
  const y2priya = priya.nodes.filter((n) => n.year === 2).map((n) => n.templateId).sort();
  const y1priya = priya.nodes.filter((n) => n.year === 1).map((n) => n.templateId).sort();
  assert.notDeepEqual(y1priya, y2priya);
}

const tests: Array<[string, () => void]> = [
  ['skill-gap subtraction', testSkillGap],
  ['prerequisite ordering', testPrereqOrder],
  ['hour cap keeps whole-person pair', testHourCap],
  ['pillar balance rule', testBalance],
  ['empty-profile fallback', testFallback],
  ['adaptive re-generation diff', testAdaptiveDiff],
  ['personas fully populated', testPersonasPopulated],
  ['year 2 differs from year 1', testEmptyExplorerVsValid],
];

let failed = 0;
for (const [name, fn] of tests) {
  try {
    fn();
    console.log(`ok  - ${name}`);
  } catch (err) {
    failed += 1;
    console.error(`fail- ${name}`);
    console.error(err);
  }
}

if (failed) {
  console.error(`\n${failed} failed`);
  process.exit(1);
}
console.log(`\n${tests.length} passed`);
void EXPLORER_PROFILE;
