export interface StudyCircle {
  id: string;
  subject: string;
  cadence: string;
  focus: string;
  seats: string;
}

export const STUDY_CIRCLES: StudyCircle[] = [
  {
    id: 'dsa',
    subject: 'DSA hour',
    cadence: 'Mon–Fri 8–9 pm',
    focus: 'One NeetCode pattern, then a HackerRank twin. Year 2 CSE and IT.',
    seats: '12 on a Meet link',
  },
  {
    id: 'dbms',
    subject: 'DBMS + SQLBolt',
    cadence: 'Tue / Thu 7 pm',
    focus: 'RGPV DBMS paper plus a live query. AIDS and CSE.',
    seats: 'Lab 2 after class',
  },
  {
    id: 'gate-ee',
    subject: 'GATE EE machines',
    cadence: 'Sunday 10 am',
    focus: 'Previous papers, Bosch-lab intuition, one numerical each week.',
    seats: 'EE classroom',
  },
  {
    id: 'web',
    subject: 'Campus web studio',
    cadence: 'Saturday 4 pm',
    focus: 'Ship one faculty brief screen. GitHub Student Pack required.',
    seats: 'E-Cell bay',
  },
  {
    id: 'gate-cs',
    subject: 'GATE CS theory',
    cadence: 'Wed 8 pm',
    focus: 'TOC, OS, CN in RGPV language. Year 3–4.',
    seats: 'Library annex',
  },
];

const KEY = 'ctc.circles.v1';

export function joinedCircles(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

export function toggleCircle(id: string): string[] {
  const current = new Set(joinedCircles());
  if (current.has(id)) current.delete(id);
  else current.add(id);
  const next = Array.from(current);
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
