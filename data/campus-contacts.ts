export interface CampusPerson {
  id: string;
  name: string;
  role: string;
  unit: string;
  /** 10-digit Indian mobile, when the campus list includes one. */
  phone?: string;
}

export interface CampusDesk {
  id: string;
  title: string;
  detail: string;
  /** Shown when this desk has no published numbers yet. */
  note?: string;
  people: CampusPerson[];
}

/** Branch clubs, E-Cell, and the placement cell. Numbers are the ones shared for student queries. */
export const CAMPUS_DESKS: CampusDesk[] = [
  {
    id: 'aids',
    title: 'AIDS',
    detail: 'AI & DS faculty coordinators for the branch clubs.',
    people: [
      {
        id: 'aids-ruchi',
        name: 'Ruchi Jain',
        role: 'Faculty coordinator',
        unit: 'Kaggle Koders',
        phone: '8982328393',
      },
      {
        id: 'aids-madhuri',
        name: 'Madhuri Walia',
        role: 'Faculty coordinator',
        unit: 'Kalasarthi',
        phone: '8770967274',
      },
    ],
  },
  {
    id: 'cyber',
    title: 'Cyber',
    detail: 'Cytrex faculty coordinator.',
    people: [
      {
        id: 'cyber-shivani',
        name: 'Shivani Saxena',
        role: 'Faculty coordinator',
        unit: 'Cytrex',
      },
    ],
  },
  {
    id: 'it',
    title: 'IT',
    detail: 'Information Technology branch desk.',
    note: 'Contact details for IT are not on this list yet.',
    people: [],
  },
  {
    id: 'civil',
    title: 'Civil',
    detail: 'Civil branch desk.',
    note: 'Contact details for Civil are not on this list yet.',
    people: [],
  },
  {
    id: 'gdg',
    title: 'Google Developer Groups',
    detail: 'Campus developer group.',
    people: [
      {
        id: 'gdg-amit',
        name: 'Amit Swami',
        role: 'Faculty coordinator',
        unit: 'Google Developer Groups',
        phone: '9981805978',
      },
    ],
  },
  {
    id: 'mlsa',
    title: 'Microsoft Learn Student Ambassador',
    detail: 'Campus Microsoft Learn ambassadors.',
    people: [
      {
        id: 'mlsa-amit',
        name: 'Amit Swami',
        role: 'Faculty coordinator',
        unit: 'Microsoft Learn Student Ambassador',
        phone: '9981805978',
      },
    ],
  },
  {
    id: 'tnp',
    title: 'Training and Placement',
    detail: 'Placement cell heads for drive and company queries.',
    people: [
      {
        id: 'tnp-prachi',
        name: 'Prachi Srivastava',
        role: 'Placement Head',
        unit: 'Training and Placement',
        phone: '9981292333',
      },
      {
        id: 'tnp-sharad',
        name: 'Sharad Srivastava',
        role: 'Corporate Relations Head',
        unit: 'Training and Placement',
        phone: '9827612847',
      },
    ],
  },
  {
    id: 'first-year',
    title: 'First-year clubs',
    detail: 'Abhivyakti and Tagore Club.',
    people: [
      {
        id: 'fy-abha',
        name: 'Abha Pal',
        role: 'Faculty coordinator',
        unit: 'Abhivyakti and Tagore Club',
        phone: '6263790720',
      },
    ],
  },
  {
    id: 'ecell',
    title: 'E-Cell, SISTec',
    detail: 'Faculty coordinator and the main student lead.',
    people: [
      {
        id: 'ecell-abhiuday',
        name: 'Abhiuday Tripathi',
        role: 'Faculty',
        unit: 'E-Cell, SISTec',
        phone: '7247658820',
      },
      {
        id: 'ecell-payal',
        name: 'Payal Goel',
        role: 'Main student lead',
        unit: 'E-Cell, SISTec',
        phone: '9310119969',
      },
    ],
  },
];

export function phoneDigits(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

export function phoneLabel(phone: string): string {
  const local = phone.replace(/\D/g, '').slice(-10);
  return `+91 ${local.slice(0, 5)} ${local.slice(5)}`;
}

export function callHref(phone: string): string {
  return `tel:+${phoneDigits(phone)}`;
}

export function whatsAppHref(phone: string, name: string, unit: string): string {
  const text = encodeURIComponent(`Hello ${name}, I am a SISTec student. I have a query about ${unit}.`);
  return `https://wa.me/${phoneDigits(phone)}?text=${text}`;
}

/** Desks that belong on a campus-life branch. Shared cells sit under Every branch. */
export function desksForBranch(branch: string): CampusDesk[] {
  const ids =
    branch === 'AIDS'
      ? ['aids']
      : branch === 'IT'
        ? ['it']
        : branch === 'CE'
          ? ['civil']
          : branch === 'CSE'
            ? ['cyber']
            : branch === 'CAMPUS'
              ? ['gdg', 'mlsa', 'tnp', 'first-year', 'ecell']
              : [];
  return CAMPUS_DESKS.filter((desk) => ids.includes(desk.id));
}
