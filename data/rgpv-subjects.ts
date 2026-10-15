import type { AcademicYear, PeriodSlot, RoadmapTemplate } from '@/lib/roadmap/types';
import { free, tpl } from './roadmap-templates/builder';

export type RgpvBranchKey = 'cse' | 'ece' | 'it' | 'me' | 'ee' | 'ce' | 'common';

export interface RgpvPaper {
  code: string;
  name: string;
  kind?: 'theory' | 'lab' | 'project' | 'audit';
}

const nptel = (title: string) =>
  free(`NPTEL / SWAYAM: ${title}`, 'https://onlinecourses.nptel.ac.in', 'course');
const rgpvNotes = free('RGPV official scheme & syllabus', 'https://www.rgpv.ac.in', 'doc');
const gfg = (topic: string) => free(`GeeksforGeeks: ${topic}`, 'https://www.geeksforgeeks.org', 'practice');

/** First-year papers are common across RGPV B.Tech branches (Group A / B). */
const SEM: Record<string, RgpvPaper[]> = {
  '1': [
    { code: 'BT-101', name: 'Engineering Chemistry' },
    { code: 'BT-202', name: 'Mathematics-II' },
    { code: 'BT-103', name: 'English for Communication' },
    { code: 'BT-104', name: 'Basic Electrical & Electronics Engineering' },
    { code: 'BT-105', name: 'Engineering Graphics' },
    { code: 'BT-106', name: 'Manufacturing Practices', kind: 'lab' },
    { code: 'BT-108', name: 'Rural Outreach', kind: 'audit' },
  ],
  '2': [
    { code: 'BT-201', name: 'Engineering Physics' },
    { code: 'BT-102', name: 'Mathematics-I' },
    { code: 'BT-203', name: 'Basic Mechanical Engineering' },
    { code: 'BT-204', name: 'Basic Civil Engineering & Mechanics' },
    { code: 'BT-205', name: 'Basic Computer Engineering' },
    { code: 'BT-206', name: 'Language Lab & Seminars', kind: 'lab' },
  ],
  'cse-3': [
    { code: 'ES-301', name: 'Energy & Environmental Engineering' },
    { code: 'CS-302', name: 'Discrete Structure' },
    { code: 'CS-303', name: 'Data Structure' },
    { code: 'CS-304', name: 'Digital Systems' },
    { code: 'CS-305', name: 'Object Oriented Programming and Methodology' },
    { code: 'CS-306', name: 'Computer Workshop', kind: 'lab' },
  ],
  'cse-4': [
    { code: 'BT-401', name: 'Mathematics-III' },
    { code: 'CS-402', name: 'Analysis & Design of Algorithms' },
    { code: 'CS-403', name: 'Software Engineering' },
    { code: 'CS-404', name: 'Computer Organization & Architecture' },
    { code: 'CS-405', name: 'Operating Systems' },
    { code: 'CS-406', name: 'Programming Practices', kind: 'lab' },
    { code: 'BT-408', name: 'Cyber Security', kind: 'audit' },
    { code: 'BT-409I', name: 'Indian Knowledge System', kind: 'audit' },
  ],
  'cse-5': [
    { code: 'CS-501', name: 'Theory of Computation' },
    { code: 'CS-502', name: 'Database Management Systems' },
    { code: 'CS-503', name: 'Dept. Elective — Data Analytics / Pattern Recognition / Cyber Security' },
    { code: 'CS-504', name: 'Open Elective — Internet & Web Technology / OOP / Intro DBMS' },
    { code: 'CS-505', name: 'Linux Lab', kind: 'lab' },
    { code: 'CS-506', name: 'Python Lab', kind: 'lab' },
    { code: 'CS-508', name: 'Minor Project-I', kind: 'project' },
  ],
  'cse-6': [
    { code: 'CS-601', name: 'Machine Learning' },
    { code: 'CS-602', name: 'Computer Networks' },
    { code: 'CS-603', name: 'Dept. Elective — ACA / Computer Graphics / Compiler Design' },
    { code: 'CS-604', name: 'Open Elective — Knowledge / Project / Rural Technology' },
    { code: 'CS-605', name: 'Data Analytics Lab', kind: 'lab' },
    { code: 'CS-608', name: 'Minor Project-II', kind: 'project' },
  ],
  'cse-7': [
    { code: 'CS-701', name: 'Software Architectures' },
    { code: 'CS-702', name: 'Dept. Elective — Computational Intelligence / Deep RL / Wireless / Big Data' },
    { code: 'CS-703', name: 'Open Elective — Cryptography / Data Mining / Agile / Disaster Management' },
    { code: 'CS-706', name: 'Major Project-I', kind: 'project' },
  ],
  'cse-8': [
    { code: 'CS-801', name: 'Internet of Things' },
    { code: 'CS-802', name: 'Dept. Elective — Blockchain / Cloud Computing / HPC / OOSE' },
    { code: 'CS-803', name: 'Open Elective — Image Processing / Game Theory / IoT / Entrepreneurship' },
    { code: 'CS-805', name: 'Major Project-II', kind: 'project' },
  ],
  'ece-3': [
    { code: 'BT-301', name: 'Mathematics-III' },
    { code: 'EC-302', name: 'Electronic Measurements and Instrumentation' },
    { code: 'EC-303', name: 'Digital System Design' },
    { code: 'EC-304', name: 'Electronic Devices' },
    { code: 'EC-305', name: 'Network Analysis' },
    { code: 'EC-306', name: 'EMI Lab', kind: 'lab' },
  ],
  'ece-4': [
    { code: 'EC-402', name: 'Signals & Systems' },
    { code: 'EC-403', name: 'Analog Communication' },
    { code: 'EC-404', name: 'Control System' },
    { code: 'EC-405', name: 'Analog Circuits' },
    { code: 'EC-406', name: 'Simulation Lab', kind: 'lab' },
    { code: 'ES-401', name: 'Energy & Environmental Engineering' },
  ],
  'ece-5': [
    { code: 'EC-501', name: 'Microprocessor and its Applications' },
    { code: 'EC-502', name: 'Digital Communication' },
    { code: 'EC-503', name: 'Dept. Elective — CNTL / Mobile Communication / Advanced Control' },
    { code: 'EC-504', name: 'Open Elective — EMT / Computer Organization / Process Control' },
  ],
  'ece-6': [
    { code: 'EC-601', name: 'Digital Signal Processing' },
    { code: 'EC-602', name: 'Antennas and Wave Propagation' },
    { code: 'EC-603', name: 'Dept. Elective — Data Communication / CMOS / Satellite' },
    { code: 'EC-604', name: 'Microcontroller & Embedded Systems / Biomedical / Power Electronics' },
  ],
  'ece-7': [
    { code: 'EC-701', name: 'VLSI Design' },
    { code: 'EC-702', name: 'Dept. Elective — Microwave / Information Theory / Nano Electronics' },
    { code: 'EC-703', name: 'Open Elective — Cellular Mobile / Internet of Things' },
    { code: 'EC-705', name: 'Major Project-I', kind: 'project' },
  ],
  'ece-8': [
    { code: 'EC-801', name: 'Optical Communication / Wireless Systems' },
    { code: 'EC-802', name: 'Dept. Elective — Embedded IoT / Radar / VLSI Testing' },
    { code: 'EC-805', name: 'Major Project-II', kind: 'project' },
  ],
  'it-3': [
    { code: 'ES-301', name: 'Energy & Environmental Engineering' },
    { code: 'IT-302', name: 'Discrete Structure' },
    { code: 'IT-303', name: 'Data Structure' },
    { code: 'IT-304', name: 'Digital Circuits & Systems' },
    { code: 'IT-305', name: 'Object Oriented Programming' },
  ],
  'it-4': [
    { code: 'BT-401', name: 'Mathematics-III' },
    { code: 'IT-402', name: 'Analysis & Design of Algorithms' },
    { code: 'IT-403', name: 'Software Engineering' },
    { code: 'IT-404', name: 'Computer Organization' },
    { code: 'IT-405', name: 'Operating Systems' },
  ],
  'it-5': [
    { code: 'IT-501', name: 'Theory of Computation' },
    { code: 'IT-502', name: 'Database Management Systems' },
    { code: 'IT-503', name: 'Web Technology' },
    { code: 'IT-508', name: 'Minor Project-I', kind: 'project' },
  ],
  'it-6': [
    { code: 'IT-601', name: 'Computer Networks' },
    { code: 'IT-602', name: 'Information Security' },
    { code: 'IT-608', name: 'Minor Project-II', kind: 'project' },
  ],
  'it-7': [
    { code: 'IT-701', name: 'Cloud Computing' },
    { code: 'IT-706', name: 'Major Project-I', kind: 'project' },
  ],
  'it-8': [
    { code: 'IT-801', name: 'Internet of Things' },
    { code: 'IT-805', name: 'Major Project-II', kind: 'project' },
  ],
  'me-3': [
    { code: 'ES-301', name: 'Energy & Environmental Engineering' },
    { code: 'ME-302', name: 'Thermodynamics' },
    { code: 'ME-303', name: 'Strength of Materials' },
    { code: 'ME-304', name: 'Manufacturing Processes' },
    { code: 'ME-305', name: 'Machine Drawing & CAD' },
  ],
  'me-4': [
    { code: 'BT-401', name: 'Mathematics-III' },
    { code: 'ME-402', name: 'Fluid Mechanics' },
    { code: 'ME-403', name: 'Theory of Machines' },
    { code: 'ME-404', name: 'Material Science' },
  ],
  'me-5': [
    { code: 'ME-501', name: 'Heat & Mass Transfer' },
    { code: 'ME-502', name: 'Dynamics of Machines' },
    { code: 'ME-503', name: 'Design of Machine Elements' },
  ],
  'me-6': [
    { code: 'ME-601', name: 'I.C. Engines / Thermal Engineering' },
    { code: 'ME-602', name: 'Mechanical Measurement & Control' },
  ],
  'me-7': [
    { code: 'ME-701', name: 'CAD/CAM / Automation' },
    { code: 'ME-706', name: 'Major Project-I', kind: 'project' },
  ],
  'me-8': [
    { code: 'ME-801', name: 'Refrigeration & Air Conditioning / Elective' },
    { code: 'ME-805', name: 'Major Project-II', kind: 'project' },
  ],
  'ee-3': [
    { code: 'ES-301', name: 'Energy & Environmental Engineering' },
    { code: 'EE-302', name: 'Electrical Circuit Analysis' },
    { code: 'EE-303', name: 'Electrical Machines-I' },
    { code: 'EE-304', name: 'Electromagnetic Field Theory' },
  ],
  'ee-4': [
    { code: 'BT-401', name: 'Mathematics-III' },
    { code: 'EE-402', name: 'Electrical Machines-II' },
    { code: 'EE-403', name: 'Power System-I' },
    { code: 'EE-404', name: 'Control Systems' },
  ],
  'ee-5': [
    { code: 'EE-501', name: 'Power Electronics' },
    { code: 'EE-502', name: 'Power System-II' },
    { code: 'EE-503', name: 'Microprocessors & Microcontrollers' },
  ],
  'ee-6': [
    { code: 'EE-601', name: 'Electrical Drives' },
    { code: 'EE-602', name: 'Switchgear & Protection' },
  ],
  'ee-7': [
    { code: 'EE-701', name: 'High Voltage Engineering / Smart Grid' },
    { code: 'EE-706', name: 'Major Project-I', kind: 'project' },
  ],
  'ee-8': [
    { code: 'EE-801', name: 'Utilization of Electrical Energy' },
    { code: 'EE-805', name: 'Major Project-II', kind: 'project' },
  ],
  'ce-3': [
    { code: 'ES-301', name: 'Energy & Environmental Engineering' },
    { code: 'CE-302', name: 'Strength of Materials' },
    { code: 'CE-303', name: 'Fluid Mechanics' },
    { code: 'CE-304', name: 'Building Materials & Construction' },
  ],
  'ce-4': [
    { code: 'BT-401', name: 'Mathematics-III' },
    { code: 'CE-402', name: 'Structural Analysis-I' },
    { code: 'CE-403', name: 'Geotechnical Engineering-I' },
    { code: 'CE-404', name: 'Surveying' },
  ],
  'ce-5': [
    { code: 'CE-501', name: 'RCC Design' },
    { code: 'CE-502', name: 'Transportation Engineering' },
    { code: 'CE-503', name: 'Environmental Engineering' },
  ],
  'ce-6': [
    { code: 'CE-601', name: 'Steel Structures' },
    { code: 'CE-602', name: 'Hydrology & Irrigation' },
  ],
  'ce-7': [
    { code: 'CE-701', name: 'Quantity Surveying & Estimation' },
    { code: 'CE-706', name: 'Major Project-I', kind: 'project' },
  ],
  'ce-8': [
    { code: 'CE-801', name: 'Construction Planning & Management' },
    { code: 'CE-805', name: 'Major Project-II', kind: 'project' },
  ],
};

const YEAR_SEMS: Record<AcademicYear, [string, string]> = {
  1: ['1', '2'],
  2: ['3', '4'],
  3: ['5', '6'],
  4: ['7', '8'],
};

const PERIOD_FOR_SEM: Record<string, PeriodSlot> = {
  '1': 'M1-2',
  '2': 'M7-9',
  '3': 'M1-2',
  '4': 'M7-9',
  '5': 'M1-2',
  '6': 'M7-9',
  '7': 'M1-2',
  '8': 'M7-9',
};

export function resolveRgpvBranch(branch: string): RgpvBranchKey {
  const b = branch.toLowerCase();
  if (b.includes('electron') || b.includes('ece') || b.includes('communication')) return 'ece';
  if (b.includes('information technology') || b.includes(' it') || b.startsWith('it')) return 'it';
  if (b.includes('mechanical')) return 'me';
  if (b.includes('electrical') && !b.includes('electron')) return 'ee';
  if (b.includes('civil')) return 'ce';
  if (b.includes('explorer') || b.includes('undeclared') || b.includes('common') || b.includes('first year')) return 'common';
  return 'cse';
}

function papersFor(key: RgpvBranchKey, sem: string): RgpvPaper[] {
  if (sem === '1' || sem === '2') return SEM[sem];
  if (key === 'common') return SEM[sem === '3' ? 'cse-3' : sem === '4' ? 'cse-4' : `cse-${sem}`] ?? SEM['1'];
  return SEM[`${key}-${sem}`] ?? SEM[`cse-${sem}`] ?? [];
}

export function rgpvSubjectTemplates(): RoadmapTemplate[] {
  const keys: RgpvBranchKey[] = ['cse', 'ece', 'it', 'me', 'ee', 'ce', 'common'];
  const out: RoadmapTemplate[] = [];

  for (const key of keys) {
    ([1, 2, 3, 4] as AcademicYear[]).forEach((year) => {
      YEAR_SEMS[year].forEach((sem) => {
        const papers = papersFor(key, sem);
        if (!papers.length) return;
        const codes = papers.map((p) => p.code).join(', ');
        const names = papers.map((p) => `${p.code} ${p.name}`).join('; ');
        const mid = papers.filter((p) => p.kind !== 'lab' && p.kind !== 'project').slice(0, 4);
        out.push(
          tpl({
            id: `rgpv-${key}-y${year}-sem${sem}`,
            year,
            period: PERIOD_FOR_SEM[sem],
            pillar: 'subjects',
            title: `RGPV Sem ${sem} (${key.toUpperCase()}): ${mid.map((p) => p.name).slice(0, 2).join(' + ')}`,
            why: `These are official RGPV B.Tech papers for {branch}. Scoring well in ${codes} keeps TPO shortlists, GATE, and {role} internships open.`,
            deliverables: [
              `Mid-sem + end-sem plan for: ${names}`,
              'Unit-wise notes mapped to RGPV scheme credits',
            ],
            checklist: [
              'Download the current RGPV scheme PDF for this semester',
              ...mid.slice(0, 3).map((p) => `Finish Unit 1–2 notes for ${p.code} ${p.name}`),
              'Attempt last 2 RGPV end-sem question papers',
              'Book a faculty doubt slot before mid-sem',
            ],
            hours: 18,
            skill: 'RGPV academics',
            gain: 1,
            teachesLevel: year === 1 ? 1 : year,
            resources: [
              rgpvNotes,
              nptel(mid[0]?.name ?? 'Engineering core'),
              gfg(mid[1]?.name ?? 'DSA'),
              free('Unacademy / Physics Wallah RGPV playlist (free lectures)', 'https://www.youtube.com', 'video'),
            ],
          })
        );
      });
    });
  }

  return out;
}
