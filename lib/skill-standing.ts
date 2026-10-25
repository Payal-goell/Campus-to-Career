import { findAssessment, howWeKnow, type SkillAssessmentRecord } from '@/lib/skill-assessment';
import type { SkillGapItem } from '@/lib/types';

type Band = 'low' | 'mid' | 'high';

interface SkillMove {
  test: RegExp;
  required: number;
  href: string;
  low: string;
  mid: string;
  high: string;
}

/** Role skills every placement bar is checked against. */
export const ROLE_BENCHMARKS: Array<{ skill: string; required: number }> = [
  { skill: 'Data Structures & Algorithms', required: 90 },
  { skill: 'React / Next.js', required: 85 },
  { skill: 'System Design', required: 80 },
  { skill: 'Databases & SQL', required: 85 },
  { skill: 'Cloud & Docker', required: 75 },
  { skill: 'Communication & Behavioral', required: 80 },
];

const MOVES: SkillMove[] = [
  {
    test: /data structure|dsa|algorithm/,
    required: 90,
    href: 'https://www.geeksforgeeks.org/dsa/dsa-tutorial-learn-data-structures-and-algorithms/',
    low: 'Work the GeeksforGeeks DSA track and solve one array or string problem a day, then retake the easy quiz.',
    mid: 'Move to the NeetCode practice list and retake the quiz on medium. The role bar for this skill is 90%.',
    high: 'Keep one mixed problem a week and sit the hard quiz so the score stays at the 90% role bar.',
  },
  {
    test: /react|next/,
    required: 85,
    href: 'https://www.theodinproject.com/paths/foundations/courses/foundations',
    low: 'Finish The Odin Project foundations, build one page that renders your own data, then retake the easy quiz.',
    mid: 'Ship one small feature that loads data from an API, then take the medium quiz. The role bar is 85%.',
    high: 'Add one feature on a campus project and sit the hard quiz so this bar can move past 85%.',
  },
  {
    test: /system design/,
    required: 80,
    href: '/onboarding',
    low: 'Sketch one campus system (library issue or canteen queue) as boxes, data, and a request path, then take the easy quiz.',
    mid: 'Write the request path for one feature you have already built, then take the medium quiz. The role bar is 80%.',
    high: 'Explain that same design out loud in under ten minutes and sit the hard quiz.',
  },
  {
    test: /sql|postgres|database/,
    required: 85,
    href: 'https://sqlbolt.com/',
    low: 'Finish the SQLBolt lessons, write a students-and-marks schema, then retake the easy quiz.',
    mid: 'Add a join and a filter you can explain, then take the medium quiz. The role bar is 85%.',
    high: 'Add an index to the query you use most and sit the hard quiz.',
  },
  {
    test: /cloud|aws/,
    required: 75,
    href: 'https://skillbuilder.aws/',
    low: 'Complete AWS Skill Builder Cloud Practitioner Essentials, run one app from the Docker get-started guide, then take the easy quiz.',
    mid: 'Repeat one lab from that path, or add a second container, then take the medium quiz. The role bar is 75%.',
    high: 'Deploy that app once and sit the hard quiz.',
  },
  {
    test: /docker/,
    required: 75,
    href: 'https://docs.docker.com/get-started/',
    low: 'Follow the Docker get-started guide until one app runs in a container, then retake the easy quiz.',
    mid: 'Add a second service in Compose and take the medium quiz. The role bar is 75%.',
    high: 'Deploy that app once and sit the hard quiz.',
  },
  {
    test: /communic|leader|behavior/,
    required: 80,
    href: '/onboarding',
    low: 'Attach a certificate or a short speaking clip and mark the level you can demonstrate. A basic mark counts as 40%.',
    mid: 'Bring a newer certificate or a clip where you led, and mark intermediate. That stated level counts as 70%.',
    high: 'Add proof of a talk, a drive, or a win, and mark advanced so this bar can reach the 80% role line.',
  },
  {
    test: /python/,
    required: 80,
    href: 'https://www.kaggle.com/learn/python',
    low: 'Finish Kaggle Learn Python and retake the easy quiz. This score is the bar you see.',
    mid: 'Build one small script that reads a file and prints a result, then take the medium quiz.',
    high: 'Sit the hard quiz. The new score replaces this one.',
  },
  {
    test: /typescript|\bjavascript\b|\bjs\b/,
    required: 80,
    href: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/',
    low: 'Finish the freeCodeCamp JavaScript algorithms track, then retake the easy quiz.',
    mid: 'Rewrite one function you already know using the language feature you missed, then take the medium quiz.',
    high: 'Sit the hard quiz so this bar uses a harder score.',
  },
  {
    test: /machine learning|\bml\b/,
    required: 75,
    href: 'https://www.kaggle.com/learn/intro-to-machine-learning',
    low: 'Finish Kaggle Intro to Machine Learning and retake the easy quiz.',
    mid: 'Train one model on a dataset you can explain, then take the medium quiz.',
    high: 'Sit the hard quiz and keep the notebook you can talk through in an interview.',
  },
  {
    test: /node/,
    required: 75,
    href: 'https://nodejs.org/en/learn/getting-started/introduction-to-nodejs',
    low: 'Read the Node.js getting-started guide and build one route that returns JSON, then retake the easy quiz.',
    mid: 'Add one route that reads and writes data, then take the medium quiz.',
    high: 'Sit the hard quiz after that route is something you can demo.',
  },
  {
    test: /\bgit\b/,
    required: 70,
    href: 'https://www.theodinproject.com/paths/foundations/courses/foundations',
    low: 'Make three real commits on one project (start, change, fix), then retake the easy quiz.',
    mid: 'Open a branch, merge it, and take the medium quiz.',
    high: 'Sit the hard quiz. The role bar for Git is 70%.',
  },
];

const GENERIC: SkillMove = {
  test: /.*/,
  required: 75,
  href: '/onboarding',
  low: 'Spend a week on the questions you missed, then retake the easy quiz. The new score replaces this bar.',
  mid: 'Switch the quiz to medium. The score from that sitting replaces this one.',
  high: 'Take the hard quiz. A higher score raises the bar shown here.',
};

function band(percent: number): Band {
  if (percent >= 81) return 'high';
  if (percent >= 56) return 'mid';
  return 'low';
}

function moveFor(name: string): SkillMove {
  const label = name.toLowerCase();
  return MOVES.find((move) => move.test.test(label)) ?? GENERIC;
}

function standingLine(current: number, required: number, measured: boolean): string {
  if (!measured && current === 0) {
    return `The role bar for this skill is ${required}%. Your check will set the number you are at.`;
  }
  if (!measured) {
    return `The preview puts this skill at ${current}% against the ${required}% role bar.`;
  }
  if (current >= required) {
    return `You are at ${current}%, which meets the ${required}% role bar.`;
  }
  const left = required - current;
  return `You are at ${current}%. The role bar is ${required}%, so ${left} points are still open.`;
}

function fromRecord(record: SkillAssessmentRecord): SkillGapItem {
  let move = moveFor(record.name);
  if (record.kind === 'technical' && move.test.source.startsWith('communic')) {
    move = { ...GENERIC, required: move.required };
  }
  const level = band(record.percent);
  let next = move[level];
  if (record.kind === 'extracurricular' && record.proof && level === 'low') {
    next = `You already attached ${record.proof.fileName} at basic, which counts as 40%. Bring a stronger certificate or a clip where you led, then mark intermediate so this bar becomes 70%.`;
  }
  return {
    skill: record.name,
    required: move.required,
    current: record.percent,
    measured: true,
    basis: howWeKnow(record),
    standing: standingLine(record.percent, move.required, true),
    next,
    href: move.href,
  };
}

function waiting(skill: string, required: number): SkillGapItem {
  const move = moveFor(skill);
  return {
    skill,
    required,
    current: 0,
    measured: false,
    basis: 'This role skill is waiting for a quiz score or a certificate from your skill check.',
    standing: standingLine(0, required, false),
    next: `Add ${skill} in the skill check. A technical skill uses the quiz you pick. An extracurricular skill uses the level you mark and the file you attach.`,
    href: '/onboarding',
  };
}

function annotatePreview(item: Pick<SkillGapItem, 'skill' | 'required' | 'current'>): SkillGapItem {
  const move = moveFor(item.skill);
  const level = band(item.current);
  return {
    ...item,
    measured: false,
    basis: 'This figure is a preview on the sample profile. Your quiz score or certificate replaces it after the skill check.',
    standing: standingLine(item.current, item.required, false),
    next: move[level],
    href: move.href,
  };
}

export function presentSkillGap(item: SkillGapItem): SkillGapItem {
  if (item.basis && item.standing && item.next) return item;
  return annotatePreview(item);
}

/**
 * When the student has skill checks, the bars are those scores plus any role
 * skill still waiting. With no checks, the existing figures stay and are labeled as a preview.
 */
export function buildSkillGap(
  records: SkillAssessmentRecord[] | undefined,
  fallback: Array<Pick<SkillGapItem, 'skill' | 'required' | 'current'>>
): SkillGapItem[] {
  if (!records?.length) return fallback.map(annotatePreview);

  const rows = records.map(fromRecord);
  for (const bench of ROLE_BENCHMARKS) {
    if (findAssessment(records, bench.skill)) continue;
    rows.push(waiting(bench.skill, bench.required));
  }

  const measured = rows.filter((row) => row.measured);
  const open = rows.filter((row) => !row.measured);
  measured.sort((a, b) => b.required - b.current - (a.required - a.current));
  return [...measured, ...open];
}

/** Personal next steps. Preview profiles keep the actions already on the dashboard. */
export function actionsFromGaps(gaps: SkillGapItem[], fallback: string[]): string[] {
  if (!gaps.some((gap) => gap.measured)) return fallback;
  const work = gaps.filter((gap) => gap.next && gap.required - gap.current > 0);
  if (work.length === 0) {
    return ['You meet the role bar on every checked skill. Sit the next harder quiz on one of them to raise a score.'];
  }
  return work.slice(0, 4).map((gap) => `${gap.skill}: ${gap.next}`);
}
