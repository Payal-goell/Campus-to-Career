/**
 * Placement, recruiter, and career facts sourced from official SISTec pages:
 * - https://www.sistec.ac.in/training-and-placement
 * - https://www.sistec.ac.in/ (Magnificent Placements counters)
 * - https://www.sistec.ac.in/courses-sagar-institute-bhopal
 * - https://www.sistec.ac.in/computer-science-engineering
 * - SISTec Placement Bulletin 2023-VI (campus offer profiles)
 */

const S = 'https://www.sistec.ac.in';
const LOGOS = `${S}/assets/web/images/placements/collaborations-logos`;

export const SISTEC_PLACEMENT_STATS = {
  jobOffersBatch2025: '1150+',
  averagePackageLpa: '4.8 LPA',
  highestPackage: '22 LPA by BNY Mellon',
  campusPlacementRate: '96%',
  internships: '100%',
  campusOpportunities: '200+',
  mous: '30+',
  startups: '15',
  offersBreakdown2026: {
    btech: 576,
    pharmacy: 19,
    mba: 56,
  },
  sourceUrl: `${S}/training-and-placement`,
  homeStatsUrl: `${S}/`,
} as const;

export const SISTEC_TRAINING_PROGRAMS = [
  {
    id: 'pod-ai',
    name: 'Pod AI',
    kind: 'Training app',
    blurb: 'AI-enabled training app for skill development and performance tracking (official T&P approach).',
    url: `${S}/training-and-placement`,
  },
  {
    id: 'headstart',
    name: 'SISTec Headstart',
    kind: 'Industry forum',
    blurb: 'Industry–academia forum bridging recruiters and students (Headstart 5.0 / Business School editions).',
    url: `${S}/training-and-placement`,
  },
  {
    id: 'manthan',
    name: 'Sagar Manthan',
    kind: 'Readiness program',
    blurb: 'Certified placement readiness program listed on the SISTec events gallery (2026 edition).',
    url: `${S}/event/sagar-manthan-2026-placement-readiness-program`,
    image: `${S}/assets/upload/events-images/1-sagar-manthan-2026-placement-readiness-program.jpg`,
  },
  {
    id: 'glory',
    name: 'Sagar Glory',
    kind: 'Celebration',
    blurb: 'Annual placement celebration recognising student offers (Governor-graced 2026 edition on T&P page).',
    url: `${S}/training-and-placement`,
  },
  {
    id: 'number-games',
    name: 'Number Games',
    kind: 'Aptitude',
    blurb: 'Aptitude training event run by the Training & Placement cell.',
    url: `${S}/training-and-placement`,
  },
  {
    id: 'cpl',
    name: 'Communication Premier League',
    kind: 'Soft skills',
    blurb: 'Communication readiness series listed under T&P training events.',
    url: `${S}/training-and-placement`,
  },
  {
    id: 'sagar-setu',
    name: 'Sagar Setu',
    kind: 'Interview readiness',
    blurb: 'Interview-readiness initiative from the official Training and Placement page.',
    url: `${S}/training-and-placement`,
  },
  {
    id: 'salesforce-immersion',
    name: 'Salesforce Student Immersion Program',
    kind: 'Company immersion',
    blurb: 'Hands-on Salesforce immersion hosted on campus (2026 gallery event).',
    url: `${S}/training-and-placement`,
    image: `${S}/assets/upload/events-images/1-salesforce-student-immersion-program-sistec-2026.jpg`,
  },
] as const;

export const SISTEC_CERT_PARTNERS = [
  { name: 'Cisco', focus: 'CCNA / Cloud & Python via NetAcad collaboration', logo: `${LOGOS}/cisco.png` },
  { name: 'AWS', focus: 'AWS Cloud Certified pathway', logo: `${LOGOS}/aws.png` },
  { name: 'Salesforce', focus: 'Dedicated Salesforce training lab', logo: `${LOGOS}/salesforce.png` },
  { name: 'IBM', focus: 'Industry certification collaboration', logo: `${LOGOS}/ibm.png` },
  { name: 'Google Cloud', focus: 'Cloud skills collaboration', logo: `${LOGOS}/google-cloud.png` },
  { name: 'Autodesk', focus: 'Design / CAD certification track', logo: `${LOGOS}/autodesk.png` },
  { name: 'SmartBridge', focus: 'Industry training partner', logo: `${LOGOS}/smartbridge.png` },
] as const;

export type SistecCompany = {
  name: string;
  category: 'IT services' | 'Product' | 'Core / manufacturing' | 'Consulting' | 'BFSI' | 'Startup / other' | 'CoE partner';
  roles: string[];
  branches: string[];
  note: string;
  logo?: string;
  source: string;
};

/** Campus recruiters + CoE partners named on official SISTec pages / placement bulletin. */
export const SISTEC_COMPANIES: SistecCompany[] = [
  {
    name: 'Tata Consultancy Services (TCS)',
    category: 'IT services',
    roles: ['Ninja', 'Graduate Engineer Trainee', 'Digital / NQT profiles'],
    branches: ['CSE', 'CSIT', 'AIDS', 'AIML', 'CYBER', 'ECE', 'EE', 'ME'],
    note: 'Regular pre-placement talks and orientation (Batch 2026 PPT with Regional TAG + Cyber Security Practice).',
    source: `${S}/training-and-placement`,
  },
  {
    name: 'Infosys',
    category: 'IT services',
    roles: ['Systems Engineer', 'Specialist Programmer (select)'],
    branches: ['CSE', 'CSIT', 'AIDS', 'AIML', 'ECE'],
    note: 'Named among leading organisations in T&P recruitment drives and CSE department recruiters.',
    source: `${S}/training-and-placement`,
  },
  {
    name: 'Wipro',
    category: 'IT services',
    roles: ['Project Engineer', 'WILP / GET'],
    branches: ['CSE', 'CSIT', 'ECE', 'EE'],
    note: 'Listed on Training & Placement and CSE popular recruiters.',
    source: `${S}/computer-science-engineering`,
  },
  {
    name: 'Accenture',
    category: 'Consulting',
    roles: ['Associate Software Engineer', 'Analyst'],
    branches: ['CSE', 'CSIT', 'AIDS', 'AIML'],
    note: 'Named in T&P drives and CSE recruiter list.',
    source: `${S}/training-and-placement`,
  },
  {
    name: 'Cognizant',
    category: 'IT services',
    roles: ['GenC', 'Programmer Analyst Trainee'],
    branches: ['CSE', 'CSIT', 'AIDS', 'ECE'],
    note: 'Official T&P recruiter list + CSE department page.',
    source: `${S}/training-and-placement`,
  },
  {
    name: 'Deloitte',
    category: 'Consulting',
    roles: ['Analyst', 'Technology consultant (select)'],
    branches: ['CSE', 'CSIT', 'AIDS', 'AIML'],
    note: 'Named among leading organisations on the Training and Placement page.',
    source: `${S}/training-and-placement`,
  },
  {
    name: 'HCLTech',
    category: 'IT services',
    roles: ['Graduate Engineer Trainee', 'Software Engineer'],
    branches: ['CSE', 'CSIT', 'ECE'],
    note: 'Recruiters’ Speak features HCLTech leaders (nexALM CoE / Marketing).',
    source: `${S}/training-and-placement`,
  },
  {
    name: 'BNY Mellon',
    category: 'BFSI',
    roles: ['Technology / analyst (dream offer band)'],
    branches: ['CSE', 'AIDS', 'AIML'],
    note: 'Highest package cited as 22 LPA by BNY Mellon on SISTec home placement counters.',
    source: `${S}/`,
  },
  {
    name: 'Hexaware Technologies',
    category: 'IT services',
    roles: ['Graduate Engineer Trainee'],
    branches: ['CSE', 'CSIT'],
    note: 'CSE popular recruiters + 2023 placement bulletin GET profiles.',
    source: `${S}/computer-science-engineering`,
  },
  {
    name: 'SAP Labs',
    category: 'Product',
    roles: ['Associate Developer (select)'],
    branches: ['CSE', 'CSIT', 'AIDS'],
    note: 'Listed among popular CSE campus recruiters.',
    source: `${S}/computer-science-engineering`,
  },
  {
    name: 'Big Basket',
    category: 'Product',
    roles: ['SDE / operations tech (select)'],
    branches: ['CSE', 'CSIT', 'AIDS'],
    note: 'Named on the CSE department recruiter list.',
    source: `${S}/computer-science-engineering`,
  },
  {
    name: 'Praemineo',
    category: 'Startup / other',
    roles: ['Software / product roles'],
    branches: ['CSE', 'CSIT'],
    note: 'Listed among CSE popular recruiters.',
    source: `${S}/computer-science-engineering`,
  },
  {
    name: 'ABSYZ',
    category: 'Product',
    roles: ['Salesforce Developer'],
    branches: ['CSE', 'CSIT'],
    note: 'Salesforce roles in placement bulletin; Salesforce Lead featured in Recruiters’ Speak.',
    source: `${S}/training-and-placement`,
  },
  {
    name: 'Salesforce',
    category: 'Product',
    roles: ['Admin / Developer trail (via immersion + lab)'],
    branches: ['CSE', 'CSIT', 'AIDS'],
    note: 'Dedicated Salesforce lab + Student Immersion Program 2026 on T&P page.',
    logo: `${LOGOS}/salesforce.png`,
    source: `${S}/training-and-placement`,
  },
  {
    name: 'Celebal Technologies',
    category: 'IT services',
    roles: ['Big Data Trainee'],
    branches: ['CSE', 'AIDS', 'AIML'],
    note: 'Appears in SISTec Placement Bulletin 2023-VI offer lists.',
    source: 'Placement Bulletin 2023-VI',
  },
  {
    name: 'Sasken',
    category: 'Product',
    roles: ['Associate Software Engineer'],
    branches: ['CSE', 'ECE'],
    note: 'Placement bulletin software profiles for CS students.',
    source: 'Placement Bulletin 2023-VI',
  },
  {
    name: 'Silver Touch Technologies',
    category: 'IT services',
    roles: ['Graduate Trainee'],
    branches: ['CSE', 'CSIT'],
    note: 'Multiple CS offers in the 2023 placement bulletin.',
    source: 'Placement Bulletin 2023-VI',
  },
  {
    name: 'Citi',
    category: 'BFSI',
    roles: ['Technology / operations (select)'],
    branches: ['CSE', 'AIDS'],
    note: 'AVP Citi Bank featured under Recruiters’ Speak on T&P page.',
    source: `${S}/training-and-placement`,
  },
  {
    name: 'IBM',
    category: 'Product',
    roles: ['Certification + select hiring pathways'],
    branches: ['CSE', 'AIDS', 'AIML', 'IOT'],
    note: 'Industry certification collaboration logo on T&P page.',
    logo: `${LOGOS}/ibm.png`,
    source: `${S}/training-and-placement`,
  },
  {
    name: 'Cisco',
    category: 'Product',
    roles: ['Networking / CCNA pathway'],
    branches: ['CSE', 'CYBER', 'ECE', 'EE'],
    note: 'CCNA / Cloud & Python collaboration listed under Industry Certifications.',
    logo: `${LOGOS}/cisco.png`,
    source: `${S}/training-and-placement`,
  },
  {
    name: 'AWS',
    category: 'Product',
    roles: ['Cloud practitioner pathway'],
    branches: ['CSE', 'CSIT', 'AIDS', 'AIML'],
    note: 'AWS Cloud Certified track on the Training and Placement page.',
    logo: `${LOGOS}/aws.png`,
    source: `${S}/training-and-placement`,
  },
  {
    name: 'Netlink (Lumenore)',
    category: 'CoE partner',
    roles: ['Data analytics CoE projects'],
    branches: ['AIDS', 'AIML', 'CSE'],
    note: 'CoE in Data Analytics supported by Netlink (SISTec home Centres of Excellence).',
    source: `${S}/`,
  },
  {
    name: 'Zarthi',
    category: 'CoE partner',
    roles: ['AI & Cloud CoE projects'],
    branches: ['AIML', 'AIDS', 'CSE'],
    note: 'CoE in Artificial Intelligence and Cloud Computing supported by Zarthi.',
    source: `${S}/`,
  },
  {
    name: 'Gaia Smart Cities',
    category: 'CoE partner',
    roles: ['IoT / measurement science projects'],
    branches: ['IOT', 'ECE', 'CSE'],
    note: 'CoE in IoT and Measurement Science supported by Gaia Smart Cities.',
    source: `${S}/`,
  },
  {
    name: 'Bosch Bridge',
    category: 'CoE partner',
    roles: ['Soft skills + automotive skill development'],
    branches: ['ME', 'EE', 'ECE', 'CSE'],
    note: 'CoE in Soft Skills and Automotive Skills Development supported by BOSCH BRIDGE.',
    source: `${S}/`,
  },
  {
    name: 'Renault Nissan',
    category: 'Core / manufacturing',
    roles: ['Automotive engineering CoE exposure'],
    branches: ['ME', 'EE', 'ECE'],
    note: 'CoE in Advance Automotive Engineering in association with Renault Nissan Tech.',
    source: `${S}/`,
  },
  {
    name: 'Eicher Tractors',
    category: 'Core / manufacturing',
    roles: ['Farm machinery CoE / trainee paths'],
    branches: ['ME', 'EE'],
    note: 'CoE in Farm Machinery; collaboration logo on T&P page.',
    logo: `${LOGOS}/eicher.png`,
    source: `${S}/`,
  },
  {
    name: 'UltraTech Cement',
    category: 'Core / manufacturing',
    roles: ['Sustainable construction CoE / site roles'],
    branches: ['CE'],
    note: 'CoE in Sustainable Construction Material in association with UltraTech Cement.',
    logo: `${LOGOS}/ultratech.png`,
    source: `${S}/`,
  },
  {
    name: 'Dhoot Transmission',
    category: 'Core / manufacturing',
    roles: ['Graduate Engineer Trainee'],
    branches: ['EE', 'ME', 'ECE'],
    note: 'Multiple EE GET offers in Placement Bulletin 2023-VI.',
    source: 'Placement Bulletin 2023-VI',
  },
  {
    name: 'Grupo Antolin',
    category: 'Core / manufacturing',
    roles: ['Trainee Engineer', 'Graduate Engineer Trainee'],
    branches: ['EE', 'ME'],
    note: 'Automotive supplier roles in the 2023 placement bulletin.',
    source: 'Placement Bulletin 2023-VI',
  },
  {
    name: 'Crompton Greaves',
    category: 'Core / manufacturing',
    roles: ['Trainee Engineer'],
    branches: ['EE', 'ME', 'ECE'],
    note: 'Core electrical / mechanical trainee profiles in bulletin lists.',
    source: 'Placement Bulletin 2023-VI',
  },
  {
    name: 'Dongfang Electronics',
    category: 'Core / manufacturing',
    roles: ['Graduate Engineer Trainee'],
    branches: ['ECE', 'EE'],
    note: 'EC/EE GET offers recorded in Placement Bulletin 2023-VI.',
    source: 'Placement Bulletin 2023-VI',
  },
];

export const SISTEC_CSE_TRAINING_ROADMAP = [
  { when: 'Sem 1', module: 'Refresher C (upto loops) + winter C programming' },
  { when: 'Sem 2', module: 'Programming using C++ (BCE)' },
  { when: 'Sem 3', module: 'HTML/CSS/JS (summer) + Core Java (odd)' },
  { when: 'Sem 4', module: 'Core Java + project (winter) + Advanced Java (even)' },
  { when: 'Sem 5', module: 'Python (summer) + Advanced Python (odd)' },
  { when: 'Sem 6', module: 'ML / Mobile app (winter) + Placement DSA/DBMS (even)' },
  { when: 'Sem 7–8', module: 'Company-specific trainings (summer / winter / odd)' },
] as const;

export const SISTEC_DREAM_OFFER_GALLERY = Array.from({ length: 12 }, (_, i) => ({
  id: `dream-${i + 1}`,
  image: `${S}/assets/upload/training-and-placement/dream-offers/dream-offer-${i + 1}.jpg`,
}));

export function companiesForBranch(code: string): SistecCompany[] {
  return SISTEC_COMPANIES.filter((c) => c.branches.includes(code) || c.category === 'CoE partner');
}
