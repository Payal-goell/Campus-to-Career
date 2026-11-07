export interface Opportunity {
  id: string;
  name: string;
  kind: 'Hackathon' | 'Internship' | 'Scholarship' | 'Open source' | 'Exam';
  window: string;
  why: string;
  url: string;
  cost: 'Free' | 'Paid exam';
}

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: 'sih',
    name: 'Smart India Hackathon',
    kind: 'Hackathon',
    window: 'Annual · MoE',
    why: 'The national problem-statement hackathon every RGPV campus already knows. Faculty briefs on this app map cleanly onto SIH problem statements.',
    url: 'https://www.sih.gov.in',
    cost: 'Free',
  },
  {
    id: 'gsoc',
    name: 'Google Summer of Code',
    kind: 'Open source',
    window: 'Mar–Sep contributor cycle',
    why: 'A merged PR plus a GSoC org list is still the strongest intern story for CSE and IT.',
    url: 'https://summerofcode.withgoogle.com',
    cost: 'Free',
  },
  {
    id: 'github-pack',
    name: 'GitHub Student Developer Pack',
    kind: 'Scholarship',
    window: 'Open with a college email',
    why: 'Codespaces, Copilot trial windows, and domain credits that make a project demo look real.',
    url: 'https://education.github.com/pack',
    cost: 'Free',
  },
  {
    id: 'nptel',
    name: 'NPTEL intern and course exams',
    kind: 'Exam',
    window: 'Jan / Jul terms',
    why: 'A scored NPTEL certificate is the free credential Indian recruiters already recognise.',
    url: 'https://nptel.ac.in',
    cost: 'Paid exam',
  },
  {
    id: 'mlsa',
    name: 'Microsoft Learn Student Ambassador',
    kind: 'Internship',
    window: 'Rolling campus cohort',
    why: 'SISTec already has a faculty desk for this. Run a Learn path, then apply with a campus event recap.',
    url: 'https://studentambassadors.microsoft.com',
    cost: 'Free',
  },
  {
    id: 'gdg',
    name: 'Google Developer Groups campus',
    kind: 'Hackathon',
    window: 'Campus calendar',
    why: 'Workshops and solution challenges sit next to the Amit Swami desk on Coordinators.',
    url: 'https://developers.google.com/community/gdg',
    cost: 'Free',
  },
  {
    id: 'gate',
    name: 'GATE',
    kind: 'Exam',
    window: 'Feb paper · IITs',
    why: 'The PSU and M.Tech door for core branches. Pair it with the year-4 placement lane, not a surprise in January.',
    url: 'https://gate.iitk.ac.in',
    cost: 'Paid exam',
  },
  {
    id: 'hackerrank',
    name: 'HackerRank skill verification',
    kind: 'Internship',
    window: 'Always on',
    why: 'A public badge you can paste on a TCS / Infosys form the night before a pool drive.',
    url: 'https://www.hackerrank.com/skills-verification',
    cost: 'Free',
  },
];
