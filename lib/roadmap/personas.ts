import type { StudentProfile } from './types';

export const ROADMAP_PERSONAS: Array<{ id: string; label: string; desc: string; profile: StudentProfile }> = [
  {
    id: 'priya-cse-y1',
    label: 'Priya Mehta',
    desc: 'UIT-RGPV CSE · Year 1 · AI/DS + dance',
    profile: {
      branch: 'Computer Science & Engineering',
      currentYear: 1,
      skills: [
        { name: 'Python', category: 'technical', level: 1 },
        { name: 'Dance', category: 'talent', level: 1 },
      ],
      interestDomains: ['AI/Data Science'],
      talentInterests: ['Dance'],
      targetRole: 'AI / Machine Learning Engineer',
      weeklyHours: 12,
      completedNodeIds: [],
      isPersonalized: true,
      personaId: 'priya-cse-y1',
    },
  },
  {
    id: 'arjun-ece-y2',
    label: 'Arjun Iyer',
    desc: 'UIT-RGPV ECE · Year 2 · IoT + cricket + speaking',
    profile: {
      branch: 'Electronics & Communication Engineering',
      currentYear: 2,
      skills: [
        { name: 'C', category: 'technical', level: 2 },
        { name: 'Circuits', category: 'technical', level: 2 },
        { name: 'Python', category: 'technical', level: 1 },
        { name: 'Fitness', category: 'talent', level: 2 },
        { name: 'Public speaking', category: 'soft', level: 1 },
      ],
      interestDomains: ['Core Engineering/Electronics', 'App Development'],
      talentInterests: ['Sports and Fitness', 'Public Speaking/Debate'],
      targetRole: 'IoT / Embedded Systems Engineer',
      weeklyHours: 14,
      completedNodeIds: [],
      isPersonalized: true,
      personaId: 'arjun-ece-y2',
    },
  },
  {
    id: 'neha-cse-y3',
    label: 'Neha Kapoor',
    desc: 'UIT-RGPV CSE · Year 3 · Cloud/DevOps + singing + E-Cell',
    profile: {
      branch: 'Computer Science & Engineering',
      currentYear: 3,
      skills: [
        { name: 'Linux', category: 'technical', level: 2 },
        { name: 'Docker', category: 'technical', level: 1 },
        { name: 'Git', category: 'technical', level: 3 },
        { name: 'Music', category: 'talent', level: 2 },
        { name: 'Problem discovery', category: 'soft', level: 1 },
      ],
      interestDomains: ['Cloud and DevOps', 'Entrepreneurship'],
      talentInterests: ['Singing/Music'],
      targetRole: 'Cloud & DevOps Engineer',
      weeklyHours: 16,
      completedNodeIds: [],
      isPersonalized: true,
      personaId: 'neha-cse-y3',
    },
  },
];

export function personaById(id: string) {
  return ROADMAP_PERSONAS.find((p) => p.id === id) ?? null;
}
