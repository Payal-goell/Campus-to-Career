export interface CertRec {
  id: string;
  name: string;
  issuer: string;
  cost: 'free' | 'paid';
  hours: string;
  weeks: string;
  year: number[];
  domains: string[];
  skills: string[];
  why: string;
  url: string;
  feasible: string;
}

export const CERT_CATALOG: CertRec[] = [
  {
    id: 'cert-nptel-dsa',
    name: 'NPTEL Programming, Data Structures and Algorithms using Python',
    issuer: 'IIT Madras / NPTEL',
    cost: 'free',
    hours: '4 hrs/week',
    weeks: '8–12',
    year: [1, 2],
    domains: ['Web Development', 'AI / Machine Learning', 'General'],
    skills: ['Python', 'Data Structures & Algorithms'],
    why: 'Matches RGPV DSA and is proctored-exam optional. Audit is free; e-certificate is a small fee only if you sit the exam.',
    url: 'https://nptel.ac.in/courses/106106145',
    feasible: 'Do weekly assignments on weekends; skip exam if budget is tight — still list “audited” on resume.',
  },
  {
    id: 'cert-google-it',
    name: 'Google IT Support (Coursera audit)',
    issuer: 'Google',
    cost: 'free',
    hours: '5 hrs/week',
    weeks: '8',
    year: [1, 2],
    domains: ['General', 'Cloud Systems'],
    skills: ['Linux', 'Networking'],
    why: 'Audit videos free. Paid certificate only if you want the badge.',
    url: 'https://www.coursera.org/professional-certificates/google-it-support',
    feasible: 'Finish course 1–2 in a month; enough for helpdesk internships.',
  },
  {
    id: 'cert-ibm-data',
    name: 'IBM Data Analyst (audit) / Google Data Analytics',
    issuer: 'IBM / Google',
    cost: 'free',
    hours: '5 hrs/week',
    weeks: '10',
    year: [2, 3],
    domains: ['AI / Machine Learning', 'Data'],
    skills: ['SQL', 'Python', 'pandas'],
    why: 'Free audit path; project notebooks become GitHub proof.',
    url: 'https://www.coursera.org/professional-certificates/google-data-analytics',
    feasible: 'Use college Wi-Fi; download datasets once.',
  },
  {
    id: 'cert-aws-cloud',
    name: 'AWS Cloud Practitioner (CLF-C02)',
    issuer: 'Amazon Web Services',
    cost: 'paid',
    hours: '5 hrs/week',
    weeks: '4–6',
    year: [2, 3, 4],
    domains: ['Cloud Systems', 'Web Development'],
    skills: ['Cloud / AWS', 'Docker'],
    why: 'Entry cloud cert recruiters recognise. Exam fee ~$100; use AWS Skill Builder free digital course first.',
    url: 'https://aws.amazon.com/certification/certified-cloud-practitioner/',
    feasible: 'Only sit the exam after scoring 80%+ on free practice tests.',
  },
  {
    id: 'cert-meta-front',
    name: 'Meta Front-End Developer (audit)',
    issuer: 'Meta / Coursera',
    cost: 'free',
    hours: '6 hrs/week',
    weeks: '8',
    year: [2, 3],
    domains: ['Web Development'],
    skills: ['HTML', 'CSS', 'JavaScript', 'React.js'],
    why: 'HTML→React sequence matches Year 1–2 roadmap. Certificate paid; projects still free.',
    url: 'https://www.coursera.org/professional-certificates/meta-front-end-developer',
    feasible: 'Ship the portfolio project; skip paid badge if needed.',
  },
  {
    id: 'cert-cisco',
    name: 'Cisco Networking Basics / CCNA Intro',
    issuer: 'Cisco Networking Academy',
    cost: 'free',
    hours: '3 hrs/week',
    weeks: '6',
    year: [1, 2, 3],
    domains: ['General', 'Cloud Systems'],
    skills: ['Networking'],
    why: 'NetAcad courses are free for students. Full CCNA exam is paid — take only after CN semester.',
    url: 'https://www.netacad.com/courses/networking-basics',
    feasible: 'Complete Networking Basics badge in one semester alongside CN labs.',
  },
  {
    id: 'cert-microsoft-az900',
    name: 'Microsoft Azure Fundamentals (AZ-900)',
    issuer: 'Microsoft',
    cost: 'paid',
    hours: '4 hrs/week',
    weeks: '3–4',
    year: [3, 4],
    domains: ['Cloud Systems'],
    skills: ['Cloud / AWS', 'Azure'],
    why: 'Shorter than AWS SAA. Free MS Learn path; exam when TCS/Infosys cloud roles appear.',
    url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/',
    feasible: 'Use student Azure credits; attempt exam in Year 3 winter.',
  },
  {
    id: 'cert-hackerrank',
    name: 'HackerRank Problem Solving (Basic + Intermediate)',
    issuer: 'HackerRank',
    cost: 'free',
    hours: '3 hrs/week',
    weeks: '2–4',
    year: [1, 2, 3, 4],
    domains: ['Web Development', 'General'],
    skills: ['Data Structures & Algorithms'],
    why: 'Timed, free, shareable badge. Many campus OA screens reuse similar questions.',
    url: 'https://www.hackerrank.com/skills-verification',
    feasible: 'Book a 90-minute slot on a Sunday; retake Intermediate after 20 LeetCode easy.',
  },
  {
    id: 'cert-free-sql',
    name: 'Mode / Select Star SQL (free)',
    issuer: 'Mode Analytics / Select Star SQL',
    cost: 'free',
    hours: '3 hrs/week',
    weeks: '2',
    year: [2, 3],
    domains: ['Data', 'Web Development'],
    skills: ['SQL', 'PostgreSQL'],
    why: 'Interactive SQL with no signup paywall.',
    url: 'https://selectstarsql.com/',
    feasible: 'Finish in two weekends before DBMS internals.',
  },
  {
    id: 'cert-deep-ai',
    name: 'Elements of AI (University of Helsinki)',
    issuer: 'MinnaLearn / Univ. of Helsinki',
    cost: 'free',
    hours: '2–3 hrs/week',
    weeks: '6',
    year: [1, 2, 3],
    domains: ['AI / Machine Learning'],
    skills: ['Machine Learning'],
    why: 'No programming required for part 1; good Year 1 AI interest proof.',
    url: 'https://www.elementsofai.com/',
    feasible: 'English course; certificate free on completion.',
  },
  {
    id: 'cert-fcc-js',
    name: 'freeCodeCamp JavaScript Algorithms and Data Structures',
    issuer: 'freeCodeCamp',
    cost: 'free',
    hours: '5 hrs/week',
    weeks: '8',
    year: [1, 2],
    domains: ['Web Development', 'General'],
    skills: ['JavaScript', 'Data Structures & Algorithms'],
    why: 'Fully free, project-based, shareable cert. Matches Year 1–2 DSA labs.',
    url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/',
    feasible: 'One certification project per weekend.',
  },
  {
    id: 'cert-fcc-web',
    name: 'freeCodeCamp Responsive Web Design',
    issuer: 'freeCodeCamp',
    cost: 'free',
    hours: '4 hrs/week',
    weeks: '6',
    year: [1, 2],
    domains: ['Web Development'],
    skills: ['HTML', 'CSS'],
    why: 'Five projects, no paywall. Good first GitHub repo.',
    url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/',
    feasible: 'Finish tribute + survey form in week 1.',
  },
  {
    id: 'cert-fcc-py',
    name: 'freeCodeCamp Scientific Computing with Python',
    issuer: 'freeCodeCamp',
    cost: 'free',
    hours: '4 hrs/week',
    weeks: '8',
    year: [1, 2, 3],
    domains: ['AI / Machine Learning', 'Data', 'General'],
    skills: ['Python'],
    why: 'Free Python cert before NPTEL exam season.',
    url: 'https://www.freecodecamp.org/learn/scientific-computing-with-python/',
    feasible: 'Arithmetic formatter project is a resume bullet.',
  },
  {
    id: 'cert-kaggle-ml',
    name: 'Kaggle Intro to Machine Learning',
    issuer: 'Kaggle',
    cost: 'free',
    hours: '1 hr/week',
    weeks: '1',
    year: [2, 3],
    domains: ['AI / Machine Learning', 'Data'],
    skills: ['Machine Learning', 'Python', 'pandas'],
    why: 'Four-hour notebook course with a free micro-credential. AIDS/AIML first badge.',
    url: 'https://www.kaggle.com/learn/intro-to-machine-learning',
    feasible: 'One Saturday lab.',
  },
  {
    id: 'cert-ibm-skillsbuild',
    name: 'IBM SkillsBuild — Artificial Intelligence Fundamentals',
    issuer: 'IBM SkillsBuild',
    cost: 'free',
    hours: '3 hrs/week',
    weeks: '4',
    year: [1, 2, 3],
    domains: ['AI / Machine Learning'],
    skills: ['Machine Learning'],
    why: 'No card required. Digital badge after quizzes.',
    url: 'https://skillsbuild.org/',
    feasible: 'Use college email; screenshot the badge.',
  },
  {
    id: 'cert-google-cyber',
    name: 'Google Cybersecurity (Coursera audit)',
    issuer: 'Google',
    cost: 'free',
    hours: '5 hrs/week',
    weeks: '8',
    year: [2, 3],
    domains: ['General', 'Cloud Systems'],
    skills: ['Networking', 'Linux'],
    why: 'Audit path for CSE-Cyber. Paid badge optional.',
    url: 'https://www.coursera.org/professional-certificates/google-cybersecurity',
    feasible: 'Course 1–2 cover enough for SOC intern language.',
  },
  {
    id: 'cert-oracle-java',
    name: 'Oracle Java Foundations (free learning path) / HackerRank Java',
    issuer: 'Oracle / HackerRank',
    cost: 'free',
    hours: '4 hrs/week',
    weeks: '4',
    year: [1, 2, 3],
    domains: ['Web Development', 'General'],
    skills: ['Java', 'Data Structures & Algorithms'],
    why: 'HackerRank Java (Basic) is free and timed like campus OAs.',
    url: 'https://www.hackerrank.com/skills-verification',
    feasible: 'Sit the Java Basic badge after RGPV OOP internals.',
  },
  {
    id: 'cert-github-foundations',
    name: 'GitHub Foundations (prep) + GitHub Student Pack',
    issuer: 'GitHub',
    cost: 'free',
    hours: '2 hrs/week',
    weeks: '2',
    year: [1, 2, 3, 4],
    domains: ['Web Development', 'General', 'Cloud Systems'],
    skills: ['Git'],
    why: 'Student Pack is free with college email. Foundations exam later if needed.',
    url: 'https://education.github.com/pack',
    feasible: 'Apply Pack in Year 1 week 1.',
  },
  {
    id: 'cert-postman',
    name: 'Postman Student Expert',
    issuer: 'Postman',
    cost: 'free',
    hours: '3 hrs/week',
    weeks: '2',
    year: [2, 3],
    domains: ['Web Development'],
    skills: ['REST', 'JavaScript'],
    why: 'Free student program. Proves you can test APIs for internships.',
    url: 'https://academy.postman.com/path/postman-student-expert',
    feasible: 'Use your notes-app API as the collection.',
  },
  {
    id: 'cert-mongodb',
    name: 'MongoDB University — Intro to MongoDB',
    issuer: 'MongoDB',
    cost: 'free',
    hours: '3 hrs/week',
    weeks: '3',
    year: [2, 3],
    domains: ['Web Development', 'Data'],
    skills: ['MongoDB', 'NoSQL'],
    why: 'Free university courses with a completion cert.',
    url: 'https://learn.mongodb.com/',
    feasible: 'Pair with a MERN mini-project.',
  },
];

export function recommendCerts(opts: {
  year?: number;
  domains?: string[];
  skills?: string[];
  targetRole?: string;
}): CertRec[] {
  const year = opts.year ?? 2;
  const domains = (opts.domains ?? []).map((d) => d.toLowerCase());
  const skills = (opts.skills ?? []).map((s) => s.toLowerCase());
  const role = (opts.targetRole ?? '').toLowerCase();

  const scored = CERT_CATALOG.map((c) => {
    let score = 0;
    if (c.year.includes(year)) score += 4;
    if (c.year.includes(year) && Math.abs(c.year[0] - year) === 0) score += 1;
    if (c.domains.some((d) => domains.some((x) => x.includes(d.toLowerCase()) || d.toLowerCase().includes(x)))) score += 3;
    if (c.skills.some((s) => skills.some((x) => x.includes(s.toLowerCase()) || s.toLowerCase().includes(x)))) score += 2;
    if (role.includes('data') && c.domains.includes('Data')) score += 2;
    if ((role.includes('cloud') || role.includes('devops')) && c.domains.includes('Cloud Systems')) score += 2;
    if ((role.includes('front') || role.includes('full') || role.includes('software')) && c.domains.includes('Web Development')) score += 2;
    if ((role.includes('ml') || role.includes('ai')) && c.domains.includes('AI / Machine Learning')) score += 3;
    if (c.cost === 'free') score += 1;
    return { c, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
    .map((x) => x.c);
}
