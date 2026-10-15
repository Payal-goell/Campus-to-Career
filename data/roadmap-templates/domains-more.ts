import type { AcademicYear, InterestDomain, PeriodSlot, RoadmapPillar, RoadmapTemplate } from '@/lib/roadmap/types';
import { free, paid, tpl } from './builder';

type Beat = {
  period: PeriodSlot;
  pillar: RoadmapPillar;
  title: string;
  why: string;
  hours: number;
  skill: string;
  level: number;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  deliverables: string[];
  checklist: string[];
  resources: ReturnType<typeof free>[];
  synergy?: string[];
  landmark?: 'quarter' | 'year-end';
};

function expand(domain: InterestDomain, prefix: string, years: Record<AcademicYear, Beat[]>): RoadmapTemplate[] {
  const out: RoadmapTemplate[] = [];
  ([1, 2, 3, 4] as AcademicYear[]).forEach((year) => {
    years[year].forEach((b, i) => {
      out.push(
        tpl({
          id: `${prefix}-y${year}-${b.pillar.slice(0, 4)}-${i + 1}`,
          domain,
          year,
          period: b.period,
          pillar: b.pillar,
          title: b.title,
          why: b.why,
          deliverables: b.deliverables,
          checklist: b.checklist,
          resources: b.resources,
          hours: b.hours,
          difficulty: b.difficulty,
          synergy: b.synergy,
          skill: b.skill,
          gain: 1,
          teachesLevel: b.level,
          landmark: b.landmark,
        })
      );
    });
  });
  return out;
}

function fourYear(domain: InterestDomain, prefix: string, skills: [string, string, string, string], flavor: string[]): RoadmapTemplate[] {
  const [s1, s2, s3, s4] = skills;
  return expand(domain, prefix, {
    1: [
      {
        period: 'M1-2', pillar: 'skills', title: flavor[0], why: `Year 1 {domain} foundations for {role}.`, hours: 26, skill: s1, level: 1,
        deliverables: ['Practice log', 'First small demo'],
        checklist: ['Daily target', 'Finish intro path', 'Push notes', 'Ask a senior'],
        resources: [free('Official getting started', 'https://developer.mozilla.org', 'doc')],
      },
      {
        period: 'M3-4', pillar: 'skills', title: 'Git/GitHub hygiene + first public artifact', why: 'Same Year 1 contract as every domain: public proof.', hours: 14, skill: 'Git', level: 1,
        deliverables: ['README profile', 'Public repo'],
        checklist: ['GitHub', 'README', 'Issues', 'One Pages/docs site'],
        resources: [free('GitHub Skills', 'https://skills.github.com', 'course')],
      },
      {
        period: 'M3-4', pillar: 'certification', title: flavor[1], why: 'A free intro cert keeps {domain} honest without a card swipe.', hours: 18, skill: s1, level: 1,
        deliverables: ['Enrollment + week 4 done'],
        checklist: ['Enroll free', 'Assignments', 'Notes', 'Exam optional'],
        resources: [free('NPTEL / Cisco / Google audit', 'https://nptel.ac.in', 'course'), paid('Exam fee optional', 'https://nptel.ac.in', 'course')],
      },
      {
        period: 'M5-6', pillar: 'project', title: flavor[2], why: 'Mini project + 3-minute presentation this period.', hours: 24, skill: s1, level: 2,
        deliverables: ['Working mini-project', 'README'],
        checklist: ['Scope', 'Build', 'Document', 'Present'],
        resources: [free('Project ideas list', '/courses', 'doc')],
        synergy: ['gen-y1-personality-present'],
      },
      {
        period: 'M7-9', pillar: 'skills', title: flavor[3], why: 'Widen the toolbelt before the Year 1 team project.', hours: 20, skill: s2, level: 1,
        deliverables: ['Workbook / labs'],
        checklist: ['Labs 1–4', 'Cheat sheet', 'Peer review'],
        resources: [free('Free lab path', 'https://www.coursera.org', 'course')],
      },
      {
        period: 'M7-9', pillar: 'certification', title: 'Intro analytics or domain survey (free audit)', why: 'Breadth cert so {domain} does not silo you.', hours: 16, skill: s2, level: 1,
        deliverables: ['Audit progress'],
        checklist: ['Pick Google/IBM/Cisco', 'Finish 50%+', 'Skip paid'],
        resources: [free('Google/IBM audit', 'https://www.coursera.org', 'course'), paid('Paid cert optional', 'https://www.coursera.org', 'course')],
      },
      {
        period: 'M10-12', pillar: 'project', title: 'Team mini-project or hackathon', why: 'Year 1 close: team + deadline.', hours: 28, skill: 'Collaboration', level: 1,
        deliverables: ['Team demo'],
        checklist: ['Team', 'Hack or lab', 'Demo', 'Retro'],
        resources: [free('Devfolio', 'https://devfolio.co', 'community')],
        landmark: 'quarter',
      },
    ],
    2: [
      {
        period: 'M1-2', pillar: 'skills', title: flavor[4], why: `Year 2 deepen {domain} toward {role}.`, hours: 30, skill: s2, level: 2, difficulty: 'Intermediate',
        deliverables: ['Intermediate labs'],
        checklist: ['Core course', 'Build notes', 'Teach a junior once'],
        resources: [free('Intermediate path', 'https://www.coursera.org', 'course')],
      },
      {
        period: 'M3-4', pillar: 'project', title: 'Real project 1 with a real user', why: 'Two real projects this year.', hours: 34, skill: s2, level: 2, difficulty: 'Intermediate',
        deliverables: ['Public case study'],
        checklist: ['User', 'MVP', 'Metric', 'README'],
        resources: [free('Campus problem board', '/campus-life', 'community')],
      },
      {
        period: 'M5-6', pillar: 'certification', title: flavor[5], why: 'One intermediate cert with Free and Paid options.', hours: 22, skill: s3, level: 2, difficulty: 'Intermediate',
        deliverables: ['Badge or audit transcript'],
        checklist: ['Choose one vendor', 'Labs', 'Paid exam only if listed on JDs'],
        resources: [free('Free-tier labs', 'https://www.netacad.com', 'course'), paid('Professional exam optional', 'https://www.coursera.org', 'course')],
      },
      {
        period: 'M7-9', pillar: 'project', title: 'Project 2 + hackathon', why: 'Experiment under time pressure.', hours: 36, skill: s2, level: 3, difficulty: 'Intermediate',
        deliverables: ['Hack demo + postmortem'],
        checklist: ['Register', 'Ship', 'Retro'],
        resources: [free('Unstop', 'https://unstop.com', 'community')],
      },
      {
        period: 'M10-12', pillar: 'skills', title: 'Quality: tests, docs, and review', why: 'Intern-ready hygiene.', hours: 14, skill: 'Testing', level: 2, difficulty: 'Intermediate',
        deliverables: ['CI or lab notebook standard'],
        checklist: ['Tests or lab protocol', 'Docs', 'Peer review'],
        resources: [free('Testing docs', 'https://testing-library.com', 'doc')],
      },
    ],
    3: [
      {
        period: 'M1-2', pillar: 'skills', title: flavor[6], why: 'Year 3 specialize.', hours: 32, skill: s3, level: 3, difficulty: 'Advanced',
        deliverables: ['Specialization spike'],
        checklist: ['JD map', 'Spike', 'Mentor chat'],
        resources: [free('Advanced docs', 'https://developer.mozilla.org', 'doc')],
      },
      {
        period: 'M3-4', pillar: 'project', title: 'Internship-grade flagship', why: 'Resume bullet #1.', hours: 42, skill: s3, level: 3, difficulty: 'Advanced',
        deliverables: ['Demo + case study'],
        checklist: ['Scope', 'Ship', 'Measure', 'Write'],
        resources: [free('Case study template', '/placement', 'doc')],
      },
      {
        period: 'M5-6', pillar: 'certification', title: flavor[7], why: 'Cloud/security/domain cert that shows up on {role} JDs.', hours: 18, skill: s4, level: 2, difficulty: 'Intermediate',
        deliverables: ['Badge'],
        checklist: ['Free labs first', 'Paid if 3 JDs name it'],
        resources: [free('Cloud/security free quests', 'https://www.cloudskillsboost.google', 'course'), paid('Vendor exam optional', 'https://aws.amazon.com/certification/', 'course')],
      },
      {
        period: 'M7-9', pillar: 'project', title: 'Open source, paper, or startup spike', why: 'Public proof beyond class.', hours: 26, skill: s3, level: 3, difficulty: 'Advanced',
        deliverables: ['PR, paper note, or landing'],
        checklist: ['Pick venue', 'Ship', 'Share'],
        resources: [free('Good First Issue', 'https://goodfirstissue.dev', 'community')],
      },
    ],
    4: [
      {
        period: 'M1-2', pillar: 'skills', title: 'Interview kit: design + take-home for this domain', why: 'Year 4 {role} loops.', hours: 22, skill: s4, level: 3, difficulty: 'Advanced',
        deliverables: ['Take-home kit'],
        checklist: ['3 design prompts', 'Timed take-home', 'Peer review'],
        resources: [free('Pramp', 'https://www.pramp.com', 'practice')],
      },
      {
        period: 'M3-4', pillar: 'project', title: 'Portfolio freeze: two case studies', why: 'Two links, not twelve.', hours: 16, skill: 'Career packaging', level: 3, difficulty: 'Intermediate',
        deliverables: ['Portfolio pages'],
        checklist: ['Rewrite', 'Metrics', 'Video'],
        resources: [free('Portfolio host', 'https://vercel.com', 'tool')],
      },
      {
        period: 'M7-9', pillar: 'certification', title: 'Paid specialist exam only if a company list requires it', why: 'Otherwise mocks win.', hours: 12, skill: 'Certification discipline', level: 3, difficulty: 'Advanced',
        deliverables: ['Go/no-go memo'],
        checklist: ['Scan JDs', 'Schedule or skip'],
        resources: [paid('Named exam optional', 'https://www.coursera.org', 'course'), free('Mocks', '/placement', 'practice')],
      },
    ],
  });
}

export function moreDomainTemplates(): RoadmapTemplate[] {
  return [
    ...fourYear('App Development', 'app', ['Dart/Kotlin', 'Mobile UI', 'App architecture', 'Release'], [
      'App foundations: Dart or Kotlin + layout basics',
      'Google Android / Flutter intro (audit) or NPTEL mobile',
      'Mini app: campus utility (timetable, attendance, quiz)',
      'Local data, lists, and simple API calls',
      'State management and navigation at intern depth',
      'Associate Android / Meta React Native / Flutter cert (audit + paid option)',
      'Specialize: offline-first, maps, or wearables',
      'Play / App Store listing hygiene micro-cert',
    ]),
    ...fourYear('Cloud and DevOps', 'cloud', ['Linux', 'Docker', 'Kubernetes', 'SRE'], [
      'Linux basics, shell, and networking mental model',
      'Cisco networking basics or Linux Foundation intro (free)',
      'Mini project: containerize a Python/Node app',
      'Intro to CI and GitHub Actions',
      'Docker → Compose → first Kubernetes lab',
      'CKA-prep free labs or AWS Cloud Practitioner (paid optional)',
      'Specialize: observability, IaC (Terraform), or platform',
      'CKA / AWS SAA / AZ-104 only if JDs demand',
    ]),
    ...fourYear('Cybersecurity', 'sec', ['Networking', 'Linux security', 'AppSec', 'Blue team'], [
      'Cyber + networking fundamentals and threat model vocabulary',
      'Cisco Intro to Cybersecurity (free) or ISC2 CC official',
      'Mini project: home-lab notes + basic CTF write-up (legal platforms)',
      'Linux hardening and log reading',
      'Web AppSec (OWASP) and a documented finding on your own app',
      'CompTIA Security+ or ISC2 CC (free content + paid exam option)',
      'Specialize: SOC, cloud security, or AppSec reviews',
      'eJPT / Security+ paid exam only if listed',
    ]),
    ...fourYear('Core Engineering/Electronics', 'core', ['Circuits', 'Embedded C', 'IoT', 'Hardware bring-up'], [
      'Circuits, signals, and C-for-embedded warmup',
      'NPTEL basic electrical / embedded (free) or Arduino fundamentals',
      'Mini project: sensor + serial plotter / simple IoT blink-to-cloud',
      'PCB-lite or simulation (KiCad / Tinkercad) plus datasheet habit',
      'RTOS-lite, protocols (I2C/SPI/MQTT), and MATLAB/Python for signals',
      'ARM / NI / Cisco IoT intermediate (audit + paid option)',
      'Specialize: IoT product, VLSI-lite, or robotics stack',
      'Vendor embedded cert only if core-company JDs name it',
    ]),
    ...fourYear('Entrepreneurship', 'ent', ['Problem discovery', 'MVP', 'Growth', 'Pitch'], [
      'Talk to 10 users about one campus or local pain',
      'NPTEL entrepreneurship / YC Startup School (free)',
      'Mini MVP: landing page + waitlist or no-code demo',
      'Unit economics sketch and ethics/privacy note',
      'Second experiment: paid pilot or 20 users',
      'Lean canvas cert-style course (free) + optional paid accelerator app',
      'Specialize: incorporate-or-not, internship vs found, or venture intern',
      'Pitch deck freeze; skip paid certs unless a program requires',
    ]),
  ];
}
