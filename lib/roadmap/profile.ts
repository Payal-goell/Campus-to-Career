import type {
  AcademicYear,
  InterestDomain,
  SkillLevel,
  StudentProfile,
  StudentSkill,
  TalentInterest,
} from './types';
import { DOMAINS, TALENT_INTERESTS } from './constants';

export const EXPLORER_PROFILE: StudentProfile = {
  branch: 'B.Tech first year (RGPV common)',
  currentYear: 1,
  skills: [],
  interestDomains: ['Web Development'],
  talentInterests: ['Leadership/Volunteering'],
  targetRole: 'Explorer — still deciding',
  weeklyHours: 10,
  completedNodeIds: [],
  inProgressNodeIds: [],
  skippedNodeIds: [],
  isPersonalized: false,
  personaId: 'explorer',
};

export function parseWeeklyHours(raw: string | number | undefined): number {
  if (typeof raw === 'number' && Number.isFinite(raw)) return Math.max(4, Math.min(40, Math.round(raw)));
  if (!raw) return 10;
  const nums = String(raw).match(/\d+/g)?.map(Number) ?? [];
  if (nums.length === 0) return 10;
  const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
  return Math.max(4, Math.min(40, Math.round(avg)));
}

export function coerceYear(n: number | undefined): AcademicYear {
  if (n === 2 || n === 3 || n === 4) return n;
  return 1;
}

export function coerceDomain(label: string): InterestDomain {
  const l = label.toLowerCase();
  if (l.includes('ai') || l.includes('machine') || l.includes('data')) return 'AI/Data Science';
  if (l.includes('app') || l.includes('mobile') || l.includes('android') || l.includes('ios') || l.includes('flutter')) {
    return 'App Development';
  }
  if (l.includes('cloud') || l.includes('devops') || l.includes('sre')) return 'Cloud and DevOps';
  if (l.includes('cyber') || l.includes('secur')) return 'Cybersecurity';
  if (l.includes('iot') || l.includes('electron') || l.includes('embed') || l.includes('core') || l.includes('vlsi') || l.includes('robot')) {
    return 'Core Engineering/Electronics';
  }
  if (l.includes('entrepreneur') || l.includes('startup') || l.includes('found')) return 'Entrepreneurship';
  if (l.includes('web') || l.includes('full-stack') || l.includes('frontend') || l.includes('front-end')) {
    return 'Web Development';
  }
  return 'Web Development';
}

export function coerceTalent(label: string): TalentInterest {
  const l = label.toLowerCase();
  if (l.includes('dance')) return 'Dance';
  if (l.includes('sing') || l.includes('music') || l.includes('choir')) return 'Singing/Music';
  if (l.includes('cricket') || l.includes('sport') || l.includes('fitness') || l.includes('football') || l.includes('athlet')) {
    return 'Sports and Fitness';
  }
  if (l.includes('drama') || l.includes('theatre') || l.includes('theater') || l.includes('act')) return 'Drama/Theatre';
  if (l.includes('art') || l.includes('design') || l.includes('photo')) return 'Art/Design/Photography';
  if (l.includes('speak') || l.includes('debate') || l.includes('toast')) return 'Public Speaking/Debate';
  if (l.includes('writ') || l.includes('blog') || l.includes('journal')) return 'Writing/Blogging';
  return 'Leadership/Volunteering';
}

export function skillsFromNames(names: string[], level: SkillLevel = 1): StudentSkill[] {
  return names.filter(Boolean).map((name) => {
    const l = name.toLowerCase();
    const category =
      l.includes('communic') || l.includes('leader') || l.includes('team') || l.includes('time')
        ? 'soft'
        : l.includes('dance') || l.includes('music') || l.includes('sport') || l.includes('art')
          ? 'talent'
          : 'technical';
    return { name, category, level };
  });
}

export function skillLevel(profile: StudentProfile, skill: string): number {
  const target = skill.toLowerCase();
  const found = profile.skills.find((s) => s.name.toLowerCase() === target);
  if (found) return found.level;
  const loose = profile.skills.find(
    (s) => s.name.toLowerCase().includes(target) || target.includes(s.name.toLowerCase())
  );
  return loose?.level ?? 0;
}

export function applySkillGains(profile: StudentProfile, gains: Array<{ skill: string; levels: number }>): StudentSkill[] {
  const next = profile.skills.map((s) => ({ ...s }));
  for (const g of gains) {
    const idx = next.findIndex((s) => s.name.toLowerCase() === g.skill.toLowerCase());
    if (idx === -1) {
      next.push({ name: g.skill, category: 'technical', level: Math.min(4, g.levels) as SkillLevel });
    } else {
      const lvl = Math.min(4, next[idx].level + g.levels) as SkillLevel;
      next[idx] = { ...next[idx], level: lvl };
    }
  }
  return next;
}

export function normalizeProfile(input: Partial<StudentProfile> | null | undefined): { profile: StudentProfile; usedFallback: boolean } {
  if (!input || (!input.branch && !input.interestDomains?.length && !input.skills?.length && !input.targetRole)) {
    return { profile: { ...EXPLORER_PROFILE, completedNodeIds: input?.completedNodeIds ?? [] }, usedFallback: true };
  }

  const interestDomains = (input.interestDomains ?? [])
    .map((d) => (DOMAINS.includes(d as InterestDomain) ? (d as InterestDomain) : coerceDomain(String(d))))
    .filter((v, i, a) => a.indexOf(v) === i);

  const talentInterests = (input.talentInterests ?? [])
    .map((t) => (TALENT_INTERESTS.includes(t as TalentInterest) ? (t as TalentInterest) : coerceTalent(String(t))))
    .filter((v, i, a) => a.indexOf(v) === i);

  const profile: StudentProfile = {
    branch: input.branch || EXPLORER_PROFILE.branch,
    currentYear: coerceYear(input.currentYear),
    skills: input.skills?.length ? input.skills : [],
    interestDomains: interestDomains.length ? interestDomains : ['Web Development'],
    talentInterests: talentInterests.length ? talentInterests : ['Leadership/Volunteering'],
    targetRole: input.targetRole || 'Software Engineer',
    weeklyHours: parseWeeklyHours(input.weeklyHours),
    completedNodeIds: input.completedNodeIds ?? [],
    inProgressNodeIds: input.inProgressNodeIds ?? [],
    skippedNodeIds: input.skippedNodeIds ?? [],
    snoozedNodeIds: input.snoozedNodeIds ?? [],
    notes: input.notes ?? {},
    checklistProgress: input.checklistProgress ?? {},
    customNodes: input.customNodes ?? [],
    isPersonalized: input.isPersonalized !== false,
    personaId: input.personaId,
  };

  const emptyish =
    !input.branch &&
    !input.targetRole &&
    (input.interestDomains?.length ?? 0) === 0 &&
    (input.skills?.length ?? 0) === 0;

  return { profile, usedFallback: emptyish };
}
