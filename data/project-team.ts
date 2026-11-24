export interface ProjectBuilder {
  id: string;
  name: string;
  photo: string;
  role: string;
  year: string;
  skills: string[];
  github?: string;
  linkedin?: string;
  quote: string;
}

/** Students who built Campus to Career. Public portraits for visitors. */
export const PROJECT_TEAM: ProjectBuilder[] = [
  {
    id: 'payal',
    name: 'Payal Goel',
    photo: '/team/payal-goel.jpg',
    role: 'Lead Developer & Product',
    year: '3rd Year, CSE',
    skills: ['Next.js', 'TypeScript', 'UI/UX', 'System Design'],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    quote: 'Built this so no RGPV student has to figure out placement alone.',
  },
  {
    id: 'kahkasha',
    name: 'Kahkasha Begum',
    photo: '/team/kahkasha-begum.jpg',
    role: 'Full-Stack Developer',
    year: '3rd Year, CSE',
    skills: ['React', 'Node.js', 'PostgreSQL', 'API Design'],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    quote: 'Every feature here started as a problem I saw someone struggle with.',
  },
  {
    id: 'ilya',
    name: 'Ilya Ali',
    photo: '/team/ilya-ali.jpg',
    role: 'ML & Backend Engineer',
    year: '3rd Year, CSE',
    skills: ['Python', 'scikit-learn', 'FastAPI', 'Data Analysis'],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    quote: 'The ML model learns from real student paths, not textbook theory.',
  },
  {
    id: 'om',
    name: 'Om Dwivedi',
    photo: '/team/om-dwivedi.jpg',
    role: 'Frontend & Design',
    year: '3rd Year, CSE',
    skills: ['React', 'Tailwind CSS', 'Framer Motion', 'Figma'],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    quote: 'Every pixel here was a decision. Most of them were the right one.',
  },
];
