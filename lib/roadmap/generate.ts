import { getRoadmapTemplates } from '@/data/roadmap-templates';
import {
  ALL_PILLARS,
  PERIOD_MONTHS,
  PERIODS,
  TALENT_PILLARS,
  TECHNICAL_PILLARS,
  YEAR_THEMES,
} from './constants';
import { diffRoadmaps } from './diff';
import { normalizeProfile, skillLevel } from './profile';
import { resolveRgpvBranch } from '@/data/rgpv-subjects';
import type {
  AcademicYear,
  GeneratedRoadmap,
  InterestDomain,
  PeriodSlot,
  RoadmapDiff,
  RoadmapNode,
  RoadmapPillar,
  RoadmapTemplate,
  StudentProfile,
  TalentInterest,
  YearSummary,
} from './types';

function personalize(text: string, profile: StudentProfile, domain?: string, talent?: string): string {
  return text
    .replaceAll('{branch}', profile.branch)
    .replaceAll('{role}', profile.targetRole)
    .replaceAll('{domain}', domain || profile.interestDomains[0] || 'your domain')
    .replaceAll('{talent}', talent || profile.talentInterests[0] || 'your talent')
    .replaceAll('{year}', String(profile.currentYear))
    .replaceAll('{next}', String(Math.min(4, profile.currentYear + 1)));
}

export function pickTemplates(
  profile: StudentProfile,
  library: RoadmapTemplate[]
): RoadmapTemplate[] {
  const domains = new Set<InterestDomain | 'Generic'>(['Generic', ...profile.interestDomains]);
  const talents = new Set<TalentInterest | 'Personality'>(['Personality', ...profile.talentInterests]);

  const rgpvKey = resolveRgpvBranch(profile.branch);
  return library.filter((t) => {
    if (t.templateId.startsWith('rgpv-')) {
      return t.templateId.startsWith(`rgpv-${rgpvKey}-`);
    }
    if (t.domain === 'Generic' && !t.talentTrack) return true;
    if (t.talentTrack && t.talentTrack !== 'Personality') return talents.has(t.talentTrack);
    if (t.talentTrack === 'Personality') return true;
    return domains.has(t.domain);
  });
}

export function subtractSkillGaps(templates: RoadmapTemplate[], profile: StudentProfile): RoadmapTemplate[] {
  return templates.filter((t) => {
    if (t.landmarkKind === 'year-end' || t.templateId.startsWith('rgpv-')) return true;
    if (!t.teachesSkill) return true;
    const have = skillLevel(profile, t.teachesSkill);
    return have < t.teachesLevel;
  });
}

function difficultyXp(hours: number, difficulty: RoadmapTemplate['difficulty']): number {
  const m = difficulty === 'Advanced' ? 1.4 : difficulty === 'Intermediate' ? 1.2 : 1;
  return Math.round(hours * m);
}

function toNode(t: RoadmapTemplate, profile: StudentProfile): RoadmapNode {
  return {
    id: t.templateId,
    templateId: t.templateId,
    year: t.year,
    period: t.period,
    pillar: t.pillar,
    title: t.title,
    why: personalize(t.why, profile, t.domain === 'Generic' ? undefined : t.domain, t.talentTrack),
    deliverables: t.deliverables,
    checklist: t.checklist,
    resources: t.resources,
    estimatedHours: t.estimatedHours,
    difficulty: t.difficulty,
    prerequisites: [...t.prerequisiteTemplateIds],
    unlocks: [...t.unlocksTemplateIds],
    synergyWith: [...t.synergyTemplateIds],
    status: 'locked',
    skillGain: t.skillGain,
    isLandmark: t.isLandmark,
    landmarkKind: t.landmarkKind,
    domain: t.domain,
    talentTrack: t.talentTrack,
    xp: difficultyXp(t.estimatedHours, t.difficulty),
  };
}

export function orderByPrerequisites(nodes: RoadmapNode[]): RoadmapNode[] {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const periodRank = (p: PeriodSlot) => PERIODS.indexOf(p);
  const incoming = new Map<string, number>();
  nodes.forEach((n) => incoming.set(n.id, 0));
  nodes.forEach((n) => {
    n.prerequisites.forEach((p) => {
      if (byId.has(p)) incoming.set(n.id, (incoming.get(n.id) ?? 0) + 1);
    });
  });

  const ready = nodes
    .filter((n) => (incoming.get(n.id) ?? 0) === 0)
    .sort((a, b) => a.year - b.year || periodRank(a.period) - periodRank(b.period) || a.id.localeCompare(b.id));
  const out: RoadmapNode[] = [];
  const seen = new Set<string>();

  while (ready.length) {
    const n = ready.shift()!;
    if (seen.has(n.id)) continue;
    seen.add(n.id);
    out.push(n);
    nodes.forEach((m) => {
      if (m.prerequisites.includes(n.id)) {
        incoming.set(m.id, (incoming.get(m.id) ?? 1) - 1);
        if ((incoming.get(m.id) ?? 0) <= 0) ready.push(m);
      }
    });
    ready.sort((a, b) => a.year - b.year || periodRank(a.period) - periodRank(b.period) || a.id.localeCompare(b.id));
  }

  nodes.forEach((n) => {
    if (!seen.has(n.id)) out.push(n);
  });

  return out.sort((a, b) => a.year - b.year || periodRank(a.period) - periodRank(b.period) || a.id.localeCompare(b.id));
}

function isTechnical(p: RoadmapPillar) {
  return TECHNICAL_PILLARS.includes(p) || p === 'placement';
}

export function capHours(nodes: RoadmapNode[], weeklyHours: number): RoadmapNode[] {
  const capFor = (period: PeriodSlot) => Math.max(12, weeklyHours * 4 * PERIOD_MONTHS[period] * 0.45);
  const keep = new Set<string>();

  ([1, 2, 3, 4] as AcademicYear[]).forEach((year) => {
    nodes.filter((n) => n.year === year && n.templateId.startsWith('rgpv-')).forEach((n) => keep.add(n.id));
    PERIODS.forEach((period) => {
      const bucket = nodes.filter((n) => n.year === year && n.period === period);
      const tech = bucket.filter((n) => isTechnical(n.pillar));
      const talent = bucket.filter((n) => TALENT_PILLARS.includes(n.pillar));
      const must = [...tech.slice(0, 1), ...talent.slice(0, 1)];
      must.forEach((n) => keep.add(n.id));

      const rest = bucket
        .filter((n) => !keep.has(n.id))
        .sort((a, b) => {
          if (a.landmarkKind === 'year-end') return -1;
          if (b.landmarkKind === 'year-end') return 1;
          return a.estimatedHours - b.estimatedHours;
        });

      let hours = must.reduce((s, n) => s + n.estimatedHours, 0);
      const cap = capFor(period);
      for (const n of rest) {
        if (n.landmarkKind === 'year-end' || hours + n.estimatedHours <= cap) {
          keep.add(n.id);
          hours += n.estimatedHours;
        }
      }
    });

    ALL_PILLARS.forEach((pillar) => {
      if (pillar === 'placement' && year < 3) return;
      const yearKept = nodes.filter((n) => n.year === year && keep.has(n.id));
      if (yearKept.some((n) => n.pillar === pillar)) return;
      const candidate = nodes
        .filter((n) => n.year === year && n.pillar === pillar)
        .sort((a, b) => a.estimatedHours - b.estimatedHours)[0];
      if (candidate) keep.add(candidate.id);
    });
  });

  return nodes.filter((n) => keep.has(n.id));
}

function rankForStudent(node: RoadmapNode, profile: StudentProfile): number {
  let score = 0;
  if (node.domain !== 'Generic' && profile.interestDomains.includes(node.domain as InterestDomain)) score += 10;
  if (
    node.talentTrack &&
    node.talentTrack !== 'Personality' &&
    profile.talentInterests.includes(node.talentTrack as TalentInterest)
  ) {
    score += 8;
  }
  if (node.templateId.startsWith('rgpv-')) score += 6;
  if (
    node.pillar === 'project' &&
    node.domain !== 'Generic' &&
    profile.interestDomains.includes(node.domain as InterestDomain)
  ) {
    score += 8;
  }
  const skill = node.skillGain[0]?.skill;
  if (skill) {
    const have = skillLevel(profile, skill);
    if (have >= 4) score -= 6;
    else if (have > 0 && have < 3) score += 5;
    else score += 2;
  }
  if (node.estimatedHours > 20) score -= 3;
  if (node.pillar === 'placement' && node.year < 3) score -= 8;
  return score;
}

function takeDistinct(
  pool: RoadmapNode[],
  profile: StudentProfile,
  limit: number,
  used: Set<string>
): RoadmapNode[] {
  const ranked = pool
    .filter((node) => !used.has(node.id))
    .sort((a, b) => rankForStudent(b, profile) - rankForStudent(a, profile) || a.estimatedHours - b.estimatedHours);
  const picked: RoadmapNode[] = [];
  const seen = new Set<string>();
  for (const node of ranked) {
    const key = (node.skillGain[0]?.skill || node.title).toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    picked.push(node);
    if (picked.length >= limit) break;
  }
  return picked;
}

/**
 * Full RGPV paper list for the year, plus a technical set and an extracurricular set.
 * Those three feed the year milestone.
 */
export function alignToStudent(nodes: RoadmapNode[], profile: StudentProfile): RoadmapNode[] {
  const years = ([1, 2, 3, 4] as AcademicYear[]).filter((year) => year >= profile.currentYear);
  const kept: RoadmapNode[] = [];

  years.forEach((year) => {
    const bucket = nodes.filter((node) => node.year === year);
    const used = new Set<string>();
    const papers = bucket.filter((node) => node.templateId.startsWith('rgpv-'));
    const subjects = papers.length
      ? papers
      : bucket.filter((node) => node.pillar === 'subjects').slice(0, 1);

    const skillLimit = year === profile.currentYear ? 3 : 2;
    const talentLimit = year === profile.currentYear ? 2 : 1;
    const technical = takeDistinct(
      bucket.filter(
        (node) =>
          (node.pillar === 'skills' || node.pillar === 'project' || node.pillar === 'certification') &&
          !node.templateId.startsWith('rgpv-')
      ),
      profile,
      skillLimit,
      used
    );
    technical.forEach((node) => used.add(node.id));
    const extracurricular = takeDistinct(
      bucket.filter((node) => TALENT_PILLARS.includes(node.pillar) && node.landmarkKind !== 'year-end'),
      profile,
      talentLimit,
      used
    );

    const feeders = [...subjects, ...technical, ...extracurricular];
    feeders.forEach((node) => {
      if (node.templateId.startsWith('rgpv-')) {
        kept.push(node);
        return;
      }
      const role = profile.targetRole || 'your target role';
      const why = TALENT_PILLARS.includes(node.pillar)
        ? `Extracurricular work for Year ${year}. It counts toward the year milestone beside the RGPV papers.`
        : `Technical practice for ${role}. It sits next to the RGPV papers on the way to the Year ${year} milestone.`;
      kept.push({ ...node, why });
    });

    const gate = bucket.find((node) => node.landmarkKind === 'year-end');
    if (gate) {
      kept.push({
        ...gate,
        title: `Year ${year} milestone`,
        why: `Received when the Year ${year} RGPV papers, the technical skill set, and the extracurricular set are done.`,
        prerequisites: feeders.map((node) => node.id),
        isLandmark: true,
      });
    }
  });

  return kept.length ? kept : nodes.filter((node) => node.year >= profile.currentYear);
}

export function balancePillars(nodes: RoadmapNode[], library: RoadmapTemplate[], profile: StudentProfile): RoadmapNode[] {
  const present = new Set(nodes.map((n) => n.id));
  const extras: RoadmapNode[] = [];

  ([1, 2, 3, 4] as AcademicYear[]).forEach((year) => {
    PERIODS.forEach((period) => {
      const bucket = nodes.filter((n) => n.year === year && n.period === period);
      const hasTech = bucket.some((n) => isTechnical(n.pillar));
      const hasTalent = bucket.some((n) => TALENT_PILLARS.includes(n.pillar));

      if (!hasTech) {
        const filler = library.find(
          (t) =>
            t.year === year &&
            t.period === period &&
            isTechnical(t.pillar) &&
            !present.has(t.templateId) &&
            (t.domain === 'Generic' || profile.interestDomains.includes(t.domain as InterestDomain))
        );
        if (filler) {
          extras.push(toNode(filler, profile));
          present.add(filler.templateId);
        }
      }
      if (!hasTalent) {
        const filler = library.find(
          (t) =>
            t.year === year &&
            (t.period === period || true) &&
            TALENT_PILLARS.includes(t.pillar) &&
            !present.has(t.templateId) &&
            (!t.talentTrack || t.talentTrack === 'Personality' || profile.talentInterests.includes(t.talentTrack as TalentInterest))
        );
        if (filler) {
          extras.push({ ...toNode(filler, profile), period });
          present.add(filler.templateId);
        }
      }
    });

    ALL_PILLARS.forEach((pillar) => {
      if (pillar === 'placement' && year < 3) return;
      const has = [...nodes, ...extras].some((n) => n.year === year && n.pillar === pillar);
      if (!has) {
        const filler = library.find((t) => t.year === year && t.pillar === pillar && !present.has(t.templateId));
        if (filler) {
          extras.push(toNode(filler, profile));
          present.add(filler.templateId);
        }
      }
    });
  });

  return [...nodes, ...extras];
}

function applyStatus(nodes: RoadmapNode[], profile: StudentProfile): RoadmapNode[] {
  const completed = new Set(profile.completedNodeIds);
  const inProgress = new Set(profile.inProgressNodeIds ?? []);
  const skipped = new Set(profile.skippedNodeIds ?? []);
  const byId = new Map(nodes.map((n) => [n.id, n]));

  return nodes.map((n) => {
    let status = n.status;
    const prereqsMet = n.prerequisites.every((id) => !byId.has(id) || completed.has(id) || skipped.has(id));

    if (completed.has(n.id)) status = 'completed';
    else if (skipped.has(n.id)) status = 'skipped';
    else if (n.year > profile.currentYear) status = 'locked';
    else if (!prereqsMet) status = 'locked';
    else if (inProgress.has(n.id)) status = 'in-progress';
    else status = 'available';

    return { ...n, status, isStartHere: false };
  });
}

function markStartHere(nodes: RoadmapNode[], profile: StudentProfile): { nodes: RoadmapNode[]; startHereId: string | null } {
  const candidate = nodes.find(
    (n) => n.year === profile.currentYear && (n.status === 'available' || n.status === 'in-progress')
  );
  if (!candidate) return { nodes, startHereId: null };
  return {
    nodes: nodes.map((n) => (n.id === candidate.id ? { ...n, isStartHere: true } : n)),
    startHereId: candidate.id,
  };
}

function yearSummaries(nodes: RoadmapNode[], profile: StudentProfile): YearSummary[] {
  return ([1, 2, 3, 4] as AcademicYear[]).filter((year) => year >= profile.currentYear).map((year) => {
    const bucket = nodes.filter((n) => n.year === year);
    const completedCount = bucket.filter((n) => n.status === 'completed').length;
    const totalXp = bucket.reduce((s, n) => s + n.xp, 0);
    const xp = bucket.filter((n) => n.status === 'completed').reduce((s, n) => s + n.xp, 0);
    const yearEndDone = bucket.some((n) => n.landmarkKind === 'year-end' && n.status === 'completed');
    return {
      year,
      theme: YEAR_THEMES[year],
      completionPct: bucket.length ? Math.round((completedCount / bucket.length) * 100) : 0,
      xp,
      totalXp,
      nodeCount: bucket.length,
      completedCount,
      locked: year > profile.currentYear && !yearEndDone,
    };
  });
}

function wholePerson(nodes: RoadmapNode[], year: AcademicYear) {
  const bucket = nodes.filter((n) => n.year === year);
  const tech = bucket.filter((n) => isTechnical(n.pillar)).length;
  const talent = bucket.filter((n) => TALENT_PILLARS.includes(n.pillar)).length;
  const total = Math.max(1, tech + talent);
  return { technicalPct: Math.round((tech / total) * 100), talentPct: Math.round((talent / total) * 100) };
}

function skillMaps(profile: StudentProfile, nodes: RoadmapNode[]) {
  const before: Record<string, number> = {};
  profile.skills.forEach((s) => {
    before[s.name] = s.level;
  });
  const after = { ...before };
  nodes
    .filter((n) => n.status === 'completed' || n.year <= profile.currentYear)
    .forEach((n) => {
      n.skillGain.forEach((g) => {
        after[g.skill] = Math.min(4, (after[g.skill] ?? 0) + (n.status === 'completed' ? g.levels : 0));
      });
      n.skillGain.forEach((g) => {
        if (after[g.skill] === undefined) after[g.skill] = before[g.skill] ?? 0;
      });
    });
  nodes.forEach((n) => {
    n.skillGain.forEach((g) => {
      if (after[g.skill] === undefined) after[g.skill] = before[g.skill] ?? 0;
      if (n.year === profile.currentYear && n.status !== 'skipped') {
        const projected = Math.min(4, (before[g.skill] ?? 0) + g.levels);
        after[g.skill] = Math.max(after[g.skill], projected);
      }
    });
  });
  return { skillsBefore: before, skillsAfter: after };
}

export function generateRoadmap(
  raw: Partial<StudentProfile> | null | undefined,
  library: RoadmapTemplate[] = getRoadmapTemplates()
): GeneratedRoadmap {
  const { profile, usedFallback } = normalizeProfile(raw);
  const picked = pickTemplates(profile, library);
  const gapped = subtractSkillGaps(picked, profile);
  let nodes = gapped.map((t) => toNode(t, profile));
  nodes = balancePillars(nodes, library, profile);
  nodes = capHours(nodes, profile.weeklyHours);
  nodes = alignToStudent(nodes, profile);
  nodes = orderByPrerequisites(nodes);
  if (profile.customNodes?.length) {
    nodes = orderByPrerequisites([...nodes, ...profile.customNodes]);
  }
  nodes = applyStatus(nodes, profile);
  nodes = nodes.filter((n) => n.year >= profile.currentYear);
  const marked = markStartHere(nodes, profile);
  nodes = marked.nodes;

  const { skillsBefore, skillsAfter } = skillMaps(profile, nodes);

  return {
    profile,
    nodes,
    usedFallback,
    startHereId: marked.startHereId,
    yearSummaries: yearSummaries(nodes, profile),
    wholePerson: wholePerson(nodes, profile.currentYear),
    skillsBefore,
    skillsAfter,
  };
}

export function regenerateWithDiff(
  prevNodes: RoadmapNode[],
  raw: Partial<StudentProfile> | null | undefined,
  library?: RoadmapTemplate[]
): { roadmap: GeneratedRoadmap; diff: RoadmapDiff } {
  const roadmap = generateRoadmap(raw, library);
  return { roadmap, diff: diffRoadmaps(prevNodes, roadmap.nodes) };
}

export function thisMonthPeriod(now = new Date()): PeriodSlot {
  const m = now.getMonth() + 1;
  if (m <= 2) return 'M1-2';
  if (m <= 4) return 'M3-4';
  if (m <= 6) return 'M5-6';
  if (m <= 9) return 'M7-9';
  return 'M10-12';
}

export function filterNodes(
  nodes: RoadmapNode[],
  opts: { filter: string; query: string; onlyThisMonth: boolean; year: AcademicYear }
): RoadmapNode[] {
  const q = opts.query.trim().toLowerCase();
  const month = thisMonthPeriod();
  return nodes.filter((n) => {
    if (n.year !== opts.year) return false;
    if (opts.onlyThisMonth && n.period !== month) return false;
    if (opts.filter === 'subjects-skills' && n.pillar !== 'subjects' && n.pillar !== 'skills') return false;
    if (opts.filter === 'certifications' && n.pillar !== 'certification') return false;
    if (opts.filter === 'projects' && n.pillar !== 'project') return false;
    if (opts.filter === 'extracurricular-talent' && n.pillar !== 'extracurricular') return false;
    if (opts.filter === 'personality' && n.pillar !== 'personality') return false;
    if (opts.filter === 'placement' && n.pillar !== 'placement') return false;
    if (q && !`${n.title} ${n.why} ${n.pillar} ${n.domain}`.toLowerCase().includes(q)) return false;
    return true;
  });
}
