export interface FacultyBrief {
  id: string;
  facultyName: string;
  department: string;
  title: string;
  problem: string;
  skills: string[];
  postedAt: string;
  claimedBy?: string;
}

export const SEED_BRIEFS: FacultyBrief[] = [
  {
    id: 'brief-aids-attendance',
    facultyName: 'Ruchi Jain',
    department: 'AIDS · Kaggle Koders',
    title: 'Lab attendance that lab assistants can trust',
    problem:
      'Paper sheets go missing after AIDS lab hours. Need a simple web form with a QR on the door, a CSV export, and a late-mark rule the faculty can edit.',
    skills: ['Next.js', 'Spreadsheets', 'QR'],
    postedAt: '2026-10-20',
  },
  {
    id: 'brief-civil-mix',
    facultyName: 'Civil lab in-charge',
    department: 'Civil',
    title: 'Concrete mix helper for UltraTech lab',
    problem:
      'Students still compute mix ratios by hand during Nirmaan week. A phone-friendly calculator with IS-code notes and a saved history would cut viva chaos.',
    skills: ['JavaScript', 'UI', 'Civil labs'],
    postedAt: '2026-10-18',
  },
  {
    id: 'brief-ece-booking',
    facultyName: 'ECE lab coordinator',
    department: 'ECE',
    title: 'Equipment booking for the semiconductor lab',
    problem:
      'Oscilloscopes and kits get double-booked. Need a slot board by bench, a faculty override, and a weekly printout.',
    skills: ['Full-stack', 'Auth', 'Calendar'],
    postedAt: '2026-10-12',
  },
  {
    id: 'brief-ecell-pipeline',
    facultyName: 'Abhiuday Tripathi',
    department: 'E-Cell, SISTec',
    title: 'Founder office-hours tracker',
    problem:
      'Mentors drop in, students miss the slot. A public board of who is in, for how long, and a 3-question intake form would help the student lead run the room.',
    skills: ['Forms', 'Realtime', 'WhatsApp'],
    postedAt: '2026-10-08',
  },
];

const KEY = 'ctc.faculty-briefs.v1';

export function loadBriefs(): FacultyBrief[] {
  if (typeof window === 'undefined') return SEED_BRIEFS;
  try {
    const extra: FacultyBrief[] = JSON.parse(localStorage.getItem(KEY) || '[]');
    const byId = new Map<string, FacultyBrief>();
    for (const brief of SEED_BRIEFS) byId.set(brief.id, brief);
    for (const brief of extra) if (brief.id) byId.set(brief.id, { ...byId.get(brief.id), ...brief });
    return Array.from(byId.values()).sort((a, b) => b.postedAt.localeCompare(a.postedAt));
  } catch {
    return SEED_BRIEFS;
  }
}

export function savePostedBrief(brief: FacultyBrief) {
  const extra: FacultyBrief[] = JSON.parse(localStorage.getItem(KEY) || '[]');
  localStorage.setItem(KEY, JSON.stringify([brief, ...extra]));
}

export function claimBrief(id: string, studentName: string) {
  const extra: FacultyBrief[] = JSON.parse(localStorage.getItem(KEY) || '[]');
  const nextExtra = extra.map((b) => (b.id === id ? { ...b, claimedBy: studentName } : b));
  const seedHit = SEED_BRIEFS.find((b) => b.id === id);
  if (seedHit && !extra.some((b) => b.id === id)) {
    nextExtra.unshift({ ...seedHit, claimedBy: studentName });
  }
  localStorage.setItem(KEY, JSON.stringify(nextExtra));
}
