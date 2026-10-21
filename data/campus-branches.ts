import type { ClubCommitteeItem } from '@/lib/types';
import { SISTEC_OFFICIAL as O } from '@/data/sistec-media';

export const CAMPUS_BRANCHES = [
  { id: 'CSE', label: 'CSE' },
  { id: 'IT', label: 'IT' },
  { id: 'AIDS', label: 'AI & DS' },
  { id: 'ECE', label: 'ECE' },
  { id: 'EE', label: 'EE' },
  { id: 'ME', label: 'Mechanical' },
  { id: 'CE', label: 'Civil' },
  { id: 'CAMPUS', label: 'Every branch' },
] as const;

export type CampusBranchId = (typeof CAMPUS_BRANCHES)[number]['id'];

/** Committees that open for that branch. Shared fests live under Every branch. */
export const BRANCH_CLUB_IDS: Record<CampusBranchId, string[]> = {
  CSE: ['rgpv-coding', 'sistec-ieee', 'sistec-coe-data'],
  IT: ['rgpv-coding', 'sistec-ieee', 'sistec-coe-data'],
  AIDS: ['sistec-ieee', 'sistec-coe-data'],
  ECE: ['sistec-ieee', 'sistec-coe-iot', 'rgpv-ece-labs'],
  EE: ['rgpv-ee-labs'],
  ME: ['sistec-quad', 'sistec-iiie'],
  CE: ['rgpv-civil'],
  CAMPUS: ['sistec-sac', 'sistec-nss', 'rgpv-sports', 'sistec-iic', 'sistec-placement-cell'],
};

const shot = (
  id: string,
  title: string,
  src: string,
  category = 'Workshop'
): NonNullable<ClubCommitteeItem['events']>[number] => ({
  id,
  title,
  category,
  date: 'Campus gallery',
  location: 'RGPV affiliated campus',
  description: title,
  imageUrl: src,
});

/** Branch labs that are not already a named SISTec committee, with their real gallery photos. */
export const BRANCH_LAB_CLUBS: ClubCommitteeItem[] = [
  {
    id: 'rgpv-ece-labs',
    name: 'Communication & semiconductor labs',
    category: 'Technical',
    description: 'ECE students use the communication lab, Cisco-style networking sessions, and the semiconductor lab.',
    purpose: 'One working circuit or networking note you can show in a viva.',
    responsibilities: 'Lab hours, a short demo, and the experiment file.',
    skillsGained: ['Networks', 'Semiconductors', 'Lab reports'],
    leadCoordinator: 'ECE department lab in-charge',
    joinUrl: 'https://www.rgpv.ac.in',
    imageUrl: O.semiconductor,
    events: [
      shot('rgpv-ece-semi', 'Semiconductor technology lab', O.semiconductor),
      shot('rgpv-ece-cisco', 'Networking session', O.cisco, 'Workshop'),
      shot('rgpv-ece-coe', 'Department lab floor', O.coe3),
    ],
  },
  {
    id: 'rgpv-ee-labs',
    name: 'Electrical machines & industrial drives',
    category: 'Technical',
    description: 'EE students work in machines labs and industry-supported drive workshops such as the Bosch lab.',
    purpose: 'Log one machine experiment and one industrial visit or lab photo.',
    responsibilities: 'Lab roster, safety brief, and the experiment write-up.',
    skillsGained: ['Machines', 'Drives', 'Lab safety'],
    leadCoordinator: 'EE department lab in-charge',
    joinUrl: 'https://www.rgpv.ac.in',
    imageUrl: O.bosch,
    events: [
      shot('rgpv-ee-bosch', 'Bosch industrial lab', O.bosch),
      shot('rgpv-ee-floor', 'Electrical lab floor', O.coe4),
      shot('rgpv-ee-bench', 'Bench session', O.coe2),
    ],
  },
  {
    id: 'rgpv-civil',
    name: 'Civil materials & site cell',
    category: 'Technical',
    description: 'Civil students join materials workshops and site-exposure events such as Nirmaan and the UltraTech lab.',
    purpose: 'One quantity sheet plus one site or lab photo for the activity file.',
    responsibilities: 'Workshop attendance and a short site note.',
    skillsGained: ['Materials', 'Site exposure', 'Quantity basics'],
    leadCoordinator: 'Civil department coordinator',
    joinUrl: 'https://www.rgpv.ac.in',
    imageUrl: O.ultratech,
    events: [
      shot('rgpv-ce-ultra', 'UltraTech materials lab', O.ultratech),
      shot('rgpv-ce-nirmaan', 'Nirmaan site event', O.nirmaan, 'Competition'),
      shot('rgpv-ce-samadhan', 'Samadhan build challenge', O.samadhan, 'Competition'),
    ],
  },
];

/** Extra photos so a branch gallery is complete, not a single cover. */
export const EXTRA_GALLERY: Record<string, { src: string; title: string }[]> = {
  'rgpv-coding': [
    { src: O.events.flutter, title: 'Android and Flutter workshop' },
    { src: O.events.google, title: 'Google expert session' },
    { src: O.events.gdg, title: 'GDG session' },
    { src: O.sih, title: 'Smart India Hackathon' },
    { src: O.events.cyber, title: 'Cyber security workshop' },
  ],
  'sistec-ieee': [
    { src: O.events.ieee, title: 'IEEE chapter' },
    { src: O.cisco, title: 'Networking lab' },
  ],
  'sistec-coe-data': [
    { src: O.netlink, title: 'Data analytics lab' },
    { src: O.events.tcsAi, title: 'AI foundation session' },
    { src: O.events.salesforce, title: 'Salesforce immersion' },
    { src: O.zarthi, title: 'Analytics partner lab' },
  ],
  'sistec-coe-iot': [
    { src: O.gaia, title: 'IoT lab' },
    { src: O.coe1, title: 'Sensor lab' },
  ],
  'sistec-quad': [
    { src: O.quadTorc, title: 'Quad Torc' },
    { src: O.eicher, title: 'Vehicle lab' },
    { src: O.renault, title: 'Automotive lab' },
  ],
  'sistec-iiie': [{ src: O.events.iiie, title: 'IIIE chapter' }],
  'rgpv-sports': [
    { src: O.gnCampus, title: 'College ground' },
    { src: O.gnCampus2, title: 'Campus practice area' },
  ],
};

export function branchFromProfile(branch?: string | null): CampusBranchId | null {
  if (!branch) return null;
  const value = branch.toLowerCase();
  if (value.includes('civil')) return 'CE';
  if (value.includes('mechanical')) return 'ME';
  if (value.includes('electronics') || value.includes('communication')) return 'ECE';
  if (value.includes('electrical')) return 'EE';
  if (value.includes('information technology')) return 'IT';
  if (value.includes('artificial') || value.includes('data science') || value.includes('machine learning')) return 'AIDS';
  if (value.includes('computer')) return 'CSE';
  return null;
}
