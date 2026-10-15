import type { AcademicYear, PeriodSlot, RoadmapTemplate, TalentInterest } from '@/lib/roadmap/types';
import { free, tpl } from './builder';

type TalentArc = {
  track: TalentInterest;
  skill: string;
  y1: [string, string, string, string];
  y2: [string, string];
  y3: [string, string];
  y4: [string, string];
};

const ARCS: TalentArc[] = [
  {
    track: 'Dance',
    skill: 'Dance',
    y1: [
      'Attend 3 club orientations including the dance club audition',
      'Join dance club and commit to one performance slot',
      'Perform at a college event or fest',
      'Lead a 32-count combo in rehearsal',
    ],
    y2: ['Lead a dance team segment', 'Enter an inter-college dance competition'],
    y3: ['Choreograph a 3-minute piece', 'Mentor two first-year dancers'],
    y4: ['Stage a farewell / placement-week performance', 'Document a talent reel for portfolios'],
  },
  {
    track: 'Singing/Music',
    skill: 'Music',
    y1: [
      'Audition or sit-in with music / choir club',
      'Join and commit to one open-mic or assembly slot',
      'Perform at a fest or department night',
      'Record a simple live take',
    ],
    y2: ['Arrange a group number', 'Compete in a campus or city music event'],
    y3: ['Produce a 2-song EP or medley', 'Coach juniors for auditions'],
    y4: ['Publish a placement-season reel', 'Lead a cultural night closer'],
  },
  {
    track: 'Sports and Fitness',
    skill: 'Fitness',
    y1: [
      'Attend sports trials / intramural orientation',
      'Join a team or fitness club with weekly practice',
      'Play a college fixture or intra-dept match',
      'Log a 8-week fitness baseline',
    ],
    y2: ['Earn a starting / rotation role', 'Represent the college in one tournament'],
    y3: ['Captain a practice unit or fitness circle', 'Complete a certified fitness / first-aid micro-cred'],
    y4: ['Keep a match-day routine through placement season', 'Run a wellness session for peers'],
  },
  {
    track: 'Drama/Theatre',
    skill: 'Theatre',
    y1: [
      'Attend drama club orientations and a cold-read',
      'Take a backstage or ensemble role',
      'Perform in a short play or street play',
      'Write a one-page character note',
    ],
    y2: ['Lead a scene or assistant-direct a one-act', 'Festival performance with tech cues'],
    y3: ['Direct or produce a short piece', 'Workshop voice and presence for interviews'],
    y4: ['Stage a placement-week sketch', 'Archive a showreel of scenes'],
  },
  {
    track: 'Art/Design/Photography',
    skill: 'Visual craft',
    y1: [
      'Visit design / photo club orientations',
      'Join and ship one poster or photo set',
      'Exhibit 3 works at a campus wall / Insta series',
      'Write artist notes for each piece',
    ],
    y2: ['Brand a club event end-to-end', 'Enter a design / photo contest'],
    y3: ['Build a public portfolio site', 'Art-direct a fest vertical'],
    y4: ['Talent reel + case study for interviews', 'Mentor a junior designer'],
  },
  {
    track: 'Public Speaking/Debate',
    skill: 'Public speaking',
    y1: [
      'Attend debate / toastmasters orientation',
      'Give a 2-minute prepared speech',
      'Compete in a novice debate or jam',
      'Record and review one talk',
    ],
    y2: ['Break to a college debate finalist board', 'Host a department discussion'],
    y3: ['Run a mock GD for placement cell', 'Deliver a TEDx-style 8-minute talk'],
    y4: ['Weekly interview storytelling drills', 'Coach two juniors'],
  },
  {
    track: 'Writing/Blogging',
    skill: 'Writing',
    y1: [
      'Join the magazine / content club briefing',
      'Publish one campus blog or newsletter piece',
      'Ship a 4-part series or fest coverage',
      'Edit a peer’s draft',
    ],
    y2: ['Own a column or club editorial calendar', 'Pitch an external student publication'],
    y3: ['Technical blog for a project (SEO + diagrams)', 'Editorial lead for a fest booklet'],
    y4: ['Interview-story bank of 8 STAR essays', 'Public writing portfolio'],
  },
  {
    track: 'Leadership/Volunteering',
    skill: 'Leadership',
    y1: [
      'Attend NSS / student council / club volunteer booths',
      'Commit to a weekly volunteer slot',
      'Run a micro-drive (donation, tutoring, cleanup)',
      'Write a 1-page impact note',
    ],
    y2: ['Coordinate a 10-person volunteer pod', 'Own budget or comms for one event'],
    y3: ['Committee role with measurable KPI', 'Leadership workshop + peer feedback'],
    y4: ['Handover playbook for juniors', 'Service story ready for HR rounds'],
  },
];

const y1Periods: PeriodSlot[] = ['M1-2', 'M3-4', 'M7-9', 'M10-12'];
const later: Record<AcademicYear, PeriodSlot[]> = {
  1: y1Periods,
  2: ['M3-4', 'M7-9'],
  3: ['M3-4', 'M10-12'],
  4: ['M3-4', 'M7-9'],
};

function slug(track: TalentInterest) {
  return track.split('/')[0].split(' ')[0].toLowerCase();
}

export function talentTemplates(): RoadmapTemplate[] {
  const nodes: RoadmapTemplate[] = [];

  for (const arc of ARCS) {
    const s = slug(arc.track);
    arc.y1.forEach((title, i) => {
      const period = y1Periods[i];
      const id = `tal-${s}-y1-p${i + 1}`;
      nodes.push(
        tpl({
          id,
          year: 1,
          period,
          pillar: 'extracurricular',
          talentTrack: arc.track,
          title,
          why: `{talent} is on your profile because you chose it. Year 1 is join + show up, not perfection — it balances {role} grinding.`,
          deliverables: [`Proof of ${title.toLowerCase()}`, 'Photo / certificate / attendance note'],
          checklist: [
            'Find the club / team contact',
            'Attend the session on calendar',
            'Complete the committed artifact',
            'Log hours in your weeklyHours budget',
          ],
          hours: i === 0 ? 6 : 12,
          skill: arc.skill,
          gain: 1,
          teachesLevel: 1,
          synergy: i === 0 ? ['gen-y1-personality-intro'] : i === 2 ? ['gen-y1-personality-present'] : [],
          resources: [
            free('Campus Life club directory', '/campus-life', 'community'),
            free('Practice log template', '/roadmap', 'doc'),
          ],
          landmark: i === 2 ? 'quarter' : undefined,
        })
      );
    });

    ([2, 3, 4] as AcademicYear[]).forEach((year) => {
      const titles = year === 2 ? arc.y2 : year === 3 ? arc.y3 : arc.y4;
      titles.forEach((title, i) => {
        nodes.push(
          tpl({
            id: `tal-${s}-y${year}-p${i + 1}`,
            year,
            period: later[year][i],
            pillar: 'extracurricular',
            talentTrack: arc.track,
            title,
            why: `Year ${year} {talent} goal: raise the bar so talent stays in the mix while you specialize toward {role}.`,
            deliverables: [`Completed: ${title}`, 'Reflection: what skill transferred to interviews'],
            checklist: [
              'Confirm the commitment with a lead',
              'Train / create on a weekly cadence',
              'Deliver the public artifact',
              'Capture evidence for your portfolio',
            ],
            hours: 14 + year * 2,
            difficulty: year >= 3 ? 'Intermediate' : 'Beginner',
            skill: arc.skill,
            gain: 1,
            teachesLevel: year === 2 ? 2 : 3,
            resources: [free('Club events', '/campus-life', 'community')],
          })
        );
      });
    });
  }

  return nodes;
}
