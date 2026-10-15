import type { AcademicYear, RoadmapTemplate } from '@/lib/roadmap/types';
import { free, paid, tpl } from './builder';

const years: AcademicYear[] = [1, 2, 3, 4];

export function genericTemplates(): RoadmapTemplate[] {
  const nodes: RoadmapTemplate[] = [];

  for (const year of years) {
    nodes.push(
      tpl({
        id: `gen-y${year}-subjects-core`,
        year,
        period: year === 1 ? 'M5-6' : year === 2 ? 'M1-2' : 'M1-2',
        pillar: 'subjects',
        title:
          year === 1
            ? 'RGPV mid-sem / end-sem scoring plan (Maths, Physics, Basic Computer Engg.)'
            : year === 2
              ? 'RGPV internal + mid-sem tracker for departmental cores'
              : year === 3
                ? 'Map RGPV departmental electives to TPO / GATE / internship skills'
                : 'Major Project-II, remaining RGPV credits, and TPO form freeze',
        why: 'RGPV internals + end-sem for {branch} keep TPO shortlists, GATE, and {role} internships open.',
        deliverables: [
          'Written scoring plan with target grades per subject',
          'Weekly 90-minute revision block on the calendar',
        ],
        checklist: [
          'List core subjects and current vs target grade',
          'Identify the two weakest topics',
          'Book a faculty hour or peer study slot',
          'Log the first two weeks of scores',
        ],
        hours: year === 1 ? 16 : 12,
        skill: 'Academic planning',
        gain: 1,
        teachesLevel: 1,
        resources: [
          free('Anki spaced-repetition', 'https://apps.ankiweb.net', 'tool'),
          paid('Premium tutoring pack (optional)', 'https://www.coursera.org', 'course'),
        ],
      }),
      tpl({
        id: `gen-y${year}-personality-habits`,
        year,
        period: year === 1 ? 'M7-9' : 'M5-6',
        pillar: 'personality',
        title:
          year === 1
            ? 'Time management and habit tracker'
            : year === 2
              ? 'Teamwork, conflict handling, and networking'
              : year === 3
                ? 'Ownership, feedback loops, and interview presence'
                : 'Offer-season energy, ethics, and decision journal',
        why: 'Whole-person growth for {role}: technical output only sticks if habits and people skills scale with it.',
        deliverables: [
          year === 1 ? '4-week habit tracker with weeklyHours budget' : 'Reflection log with 3 conflict/feedback notes',
          'One visible improvement shared with a mentor or club lead',
        ],
        checklist: [
          'Track study vs talent vs rest for 14 days',
          'Protect one deep-work block matching weeklyHours',
          'Write a weekly retro (what moved, what slipped)',
          'Ask one person for candid feedback',
        ],
        hours: 10,
        skill: 'Self-management',
        gain: 1,
        teachesLevel: year === 1 ? 1 : 2,
        talentTrack: 'Personality',
        resources: [
          free('Atomic Habits summary notes', 'https://jamesclear.com/atomic-habits', 'doc'),
          free('Pomodoro timer', 'https://pomofocus.io', 'tool'),
        ],
        landmark: year === 1 ? 'quarter' : undefined,
      }),
      tpl({
        id: `gen-y${year}-year-end`,
        year,
        period: 'M10-12',
        pillar: 'personality',
        title: `Year ${year} reflection and skill reassessment`,
        why: 'Closing Year {year} honestly is what unlocks a sharper Year {next} roadmap for {role}.',
        deliverables: [
          'Skill self-score (0–4) for every tracked skill',
          'List of nodes to keep, drop, or raise difficulty',
        ],
        checklist: [
          'Re-rate every skill on the 0–4 scale',
          'Note 3 wins and 2 gaps',
          'Decide talent commitment for next year',
          'Mark this gate complete to unlock the next year path',
        ],
        hours: 6,
        skill: 'Reflection',
        gain: 1,
        teachesLevel: 1,
        talentTrack: 'Personality',
        landmark: 'year-end',
        resources: [free('Skill rubric (internal)', '/roadmap', 'doc')],
      })
    );
  }

  nodes.push(
    tpl({
      id: 'gen-y1-personality-intro',
      year: 1,
      period: 'M1-2',
      pillar: 'personality',
      title: 'Communication warm-up: introduce yourself in 3 club meetings',
      why: 'Year 1 at {branch} is when names stick. Speaking early compounds into {role} interviews later.',
      deliverables: ['3 short intros delivered', 'Contact list of 5 peers / seniors'],
      checklist: [
        'Write a 30-second intro (name, year, curiosity, ask)',
        'Attend meeting 1 and speak',
        'Attend meeting 2 and speak',
        'Attend meeting 3 and exchange contacts',
      ],
      hours: 6,
      skill: 'Communication',
      gain: 1,
      teachesLevel: 1,
      talentTrack: 'Personality',
      synergy: ['tal-dance-y1-orient', 'tal-speak-y1-orient'],
      resources: [
        free('Toastmasters Ice Breaker tips', 'https://www.toastmasters.org', 'doc'),
      ],
    }),
    tpl({
      id: 'gen-y1-personality-present',
      year: 1,
      period: 'M5-6',
      pillar: 'personality',
      title: 'Public speaking: present your mini-project for 3 minutes',
      why: 'Explaining a build is the same muscle {role} interviews test. Pair it with your project node.',
      deliverables: ['3-minute talk given at a department / club session', 'Slide or demo outline'],
      checklist: [
        'Draft a 3-beat story: problem, build, lesson',
        'Rehearse once with a friend',
        'Present in a lab, club, or class',
        'Collect one piece of feedback',
      ],
      hours: 8,
      skill: 'Public speaking',
      gain: 1,
      teachesLevel: 1,
      talentTrack: 'Personality',
      synergy: ['ai-y1-project-mini', 'web-y1-project-mini'],
      resources: [free('3-minute thesis structure', 'https://threeminutethesis.uq.edu.au', 'doc')],
    }),
    tpl({
      id: 'gen-y1-extra-lead-micro',
      year: 1,
      period: 'M10-12',
      pillar: 'extracurricular',
      title: 'Take one leadership micro-role (event volunteer)',
      why: 'A named volunteer role on your profile beats “member” and feeds {role} behavioral stories.',
      deliverables: ['Confirmed volunteer / coordinator-assist slot', 'One-paragraph recap'],
      checklist: [
        'Ask a club lead for a micro-role',
        'Show up for the full event window',
        'Write what you owned vs what you learned',
        'Add it to your campus-life log',
      ],
      hours: 10,
      skill: 'Leadership',
      gain: 1,
      teachesLevel: 1,
      talentTrack: 'Leadership/Volunteering',
      resources: [free('Volunteer role board (campus)', '/campus-life', 'community')],
    }),
    tpl({
      id: 'gen-y3-placement-resume',
      year: 3,
      period: 'M3-4',
      pillar: 'placement',
      title: 'Internship-ready resume and GitHub hygiene',
      why: 'Year 3 is when {role} recruiters start reading. Your roadmap projects must look hireable.',
      deliverables: ['1-page resume PDF', 'Pinned GitHub repos with READMEs'],
      checklist: [
        'Rewrite resume with quantified bullets',
        'Pin 3 projects with screenshots',
        'Add placement-cell keywords for {role}',
        'Get one coordinator review',
      ],
      hours: 12,
      skill: 'Career packaging',
      gain: 1,
      teachesLevel: 2,
      difficulty: 'Intermediate',
      resources: [
        free('IIT Bombay Placement resume tips', 'https://www.iitb.ac.in', 'doc'),
        paid('Resume review (optional)', 'https://www.linkedin.com', 'community'),
      ],
    }),
    tpl({
      id: 'gen-y3-placement-oa',
      year: 3,
      period: 'M7-9',
      pillar: 'placement',
      title: 'Online assessment lap: DSA + aptitude weekly',
      why: 'Most {role} intern pipelines gate on OA. Start now so Year 4 is mock interviews, not panic.',
      deliverables: ['40 tagged problems', 'Aptitude error log'],
      checklist: [
        'Schedule 4 OA-style sessions',
        'Track accuracy by topic',
        'Redo every missed problem in 72 hours',
        'Sit one timed mock',
      ],
      hours: 28,
      skill: 'DSA',
      gain: 1,
      teachesLevel: 3,
      difficulty: 'Intermediate',
      resources: [
        free('NeetCode 150', 'https://neetcode.io', 'practice'),
        paid('InterviewBit / LeetCode Premium (optional)', 'https://leetcode.com', 'practice'),
      ],
    }),
    tpl({
      id: 'gen-y4-placement-mocks',
      year: 4,
      period: 'M1-2',
      pillar: 'placement',
      title: 'Mock interviews, resume freeze, and offer tracking',
      why: 'Placement readiness for {role}: freeze the story, rehearse the room, track every offer.',
      deliverables: ['2 technical + 1 HR mock', 'Offer tracker sheet'],
      checklist: [
        'Freeze resume version 1.0',
        'Book mocks with seniors / cell',
        'Log companies, dates, statuses',
        'Write a negotiation / decision rubric',
      ],
      hours: 20,
      skill: 'Interviewing',
      gain: 1,
      teachesLevel: 3,
      difficulty: 'Advanced',
      resources: [
        free('Pramp / peer mock', 'https://www.pramp.com', 'practice'),
        paid('Interview coaching (optional)', 'https://www.interviewing.io', 'practice'),
      ],
    }),
    tpl({
      id: 'gen-y4-placement-intern-convert',
      year: 4,
      period: 'M5-6',
      pillar: 'placement',
      title: 'Internship conversion and backup-college drives',
      why: 'Keep a conversion plan and a campus-drive backup so {role} outcomes are not a single bet.',
      deliverables: ['Conversion checklist with manager', '2 backup applications filed'],
      checklist: [
        'Ask for conversion criteria in writing',
        'Ship a visible intern impact doc',
        'Apply to 2 safety / stretch campus drives',
        'Update tracker weekly',
      ],
      hours: 14,
      skill: 'Career packaging',
      gain: 1,
      teachesLevel: 3,
      difficulty: 'Advanced',
      resources: [free('Offer comparison sheet', '/placement', 'doc')],
    })
  );

  return nodes;
}
