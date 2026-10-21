import type { ClubCommitteeItem } from '@/lib/types';

/** How campus life works at any college under RGPV — not one institute. */
export const RGPV_LIFE_PATHS = [
  {
    id: 'technical',
    category: 'Technical',
    title: 'Coding cell & student chapters',
    blurb: 'CSE, IT, and ECE departments at RGPV colleges usually run a coding cell plus IEEE, CSI, or ISTE chapters.',
    moves: ['Ask the department office which chapter is active', 'Ship one small project with the cell this semester', 'Put the chapter role on your resume only after you actually ran an event'],
  },
  {
    id: 'cultural',
    category: 'Cultural',
    title: 'Cultural committee & youth fest',
    blurb: 'College fests feed the university youth festival. Dance, music, theatre, and fine arts all count.',
    moves: ['Audition in the first month, not the week of the fest', 'Take one ops role (stage, finance, or hospitality) if you do not perform', 'Keep a photo and a one-line credit for the resume'],
  },
  {
    id: 'sports',
    category: 'Sports',
    title: 'College team, then RGPV meet',
    blurb: 'Trials happen at your college. Selected squads play inter-college fixtures under the university sports calendar.',
    moves: ['Attend the trial even if you are unsure of the level', 'Log practice days — coaches ask for consistency, not a single match', 'Carry the college sports certificate into activity points'],
  },
  {
    id: 'service',
    category: 'Leadership',
    title: 'NSS and NCC',
    blurb: 'Almost every affiliated college has an NSS unit. NCC wings exist where the college has a troop.',
    moves: ['Enrol at the start of the year — mid-year seats are often full', 'Finish the camp or service hours your unit requires', 'Ask the programme officer for the activity certificate before exams'],
  },
  {
    id: 'innovation',
    category: 'Leadership',
    title: 'IIC, E-cell, hackathons',
    blurb: 'Many RGPV colleges run an Institution’s Innovation Council and a startup cell. Hackathons are how you get a team.',
    moves: ['Join the next ideathon with a problem from your own campus', 'File one simple idea note (problem, user, demo) even if you do not win', 'Use the cell’s mentor hour before you buy hardware'],
  },
  {
    id: 'placement',
    category: 'Leadership',
    title: 'Your college training & placement cell',
    blurb: 'Drives, aptitude, and offer letters are run by the T&P cell of your college. RGPV sets the degree; the college runs the season.',
    moves: ['Register on the cell’s portal in Year 3, not the week a company arrives', 'Volunteer as a student coordinator if you want recruiter-facing practice', 'Track every application in Placement — the cell will not do that for you'],
  },
] as const;

export const RGPV_SEMESTER_MOVES = [
  'Write your college name in Profile. Roadmaps follow the RGPV scheme; clubs follow your campus.',
  'Join one technical body and one non-technical body. Two is enough.',
  'Keep a shared folder of event photos, role, and dates for activity certificates.',
  'Before a drive, rehearse a 60-second intro that names your college, branch, project, and club.',
];

const RGPV = 'https://www.rgpv.ac.in';

/** Bodies a student can look for on any RGPV campus. No invented fest dates. */
export const RGPV_UNIVERSITY_CLUBS: ClubCommitteeItem[] = [
  {
    id: 'rgpv-coding',
    name: 'Department coding cell',
    category: 'Technical',
    description:
      'A peer lab for DSA, web, and open source. Present at most CSE/IT departments under RGPV — the name changes (CodeCell, Coding Club, Developer Student Club).',
    purpose: 'Weekly practice, one public repo, and a junior teaching hour.',
    responsibilities: 'Host a contest or doubt session, review pull requests, and keep a semester project board.',
    skillsGained: ['DSA', 'Git', 'Code review', 'Mentoring'],
    leadCoordinator: 'Department faculty advisor + student lead',
    joinUrl: RGPV,
    recentEventRecap: 'Look for the club notice on your department board in the first two weeks of the semester.',
    imageUrl: null,
    events: [
      {
        id: 'rgpv-ev-dsa',
        title: 'Weekly DSA hour',
        category: 'Workshop',
        date: 'Every semester',
        location: 'Your department lab',
        description: 'One problem set, one discussion, no new framework.',
        recap: 'Run it even with six people. Consistency beats a one-day bootcamp.',
      },
    ],
  },
  {
    id: 'rgpv-chapters',
    name: 'IEEE / CSI / ISTE student chapter',
    category: 'Technical',
    description:
      'Professional-body chapters that RGPV colleges open under a faculty branch counselor. Good for talks, membership, and a formal role.',
    purpose: 'Connect coursework to a society that recruiters recognise.',
    responsibilities: 'One expert talk, one membership drive, and a short project review each semester.',
    skillsGained: ['Technical talks', 'Networking', 'Event reports'],
    leadCoordinator: 'Branch counselor (faculty)',
    joinUrl: RGPV,
    recentEventRecap: 'If your college has no chapter yet, start with the coding cell and ask the HOD about CSI or ISTE affiliation.',
    imageUrl: null,
    events: [
      {
        id: 'rgpv-ev-talk',
        title: 'Expert session or paper reading',
        category: 'Workshop',
        date: 'Every semester',
        location: 'Seminar hall',
        description: 'One outside speaker or a student paper circle.',
        recap: 'Write a 10-line report. Chapters need it for the annual activity file.',
      },
    ],
  },
  {
    id: 'rgpv-cultural',
    name: 'Cultural committee',
    category: 'Cultural',
    description:
      'College fest, freshers, and the contingent that may go to the university youth festival. Open to every branch.',
    purpose: 'Stage time, production roles, and a public proof of teamwork.',
    responsibilities: 'Auditions, rehearsals, budget, and hospitality during the fest week.',
    skillsGained: ['Stage management', 'Teamwork', 'Public speaking'],
    leadCoordinator: 'Cultural faculty in-charge',
    joinUrl: RGPV,
    recentEventRecap: 'Audition lists usually go up on the student notice board and the college Instagram in the first month.',
    imageUrl: null,
    events: [
      {
        id: 'rgpv-ev-fest',
        title: 'College cultural fest',
        category: 'Cultural',
        date: 'Once a year',
        location: 'Your campus',
        description: 'Perform or run a desk. Both belong on an activity certificate.',
        recap: 'Save the certificate and one photo with your name in the caption.',
      },
    ],
  },
  {
    id: 'rgpv-sports',
    name: 'Sports council',
    category: 'Sports',
    description:
      'College teams in cricket, football, athletics, volleyball, badminton, and others. Inter-college selection feeds RGPV sports meets.',
    purpose: 'Fitness, selection trials, and a sports certificate that activity points accept.',
    responsibilities: 'Trials, practice slots, and travel for inter-college fixtures.',
    skillsGained: ['Discipline', 'Team play', 'Time management'],
    leadCoordinator: 'Sports officer / physical education faculty',
    joinUrl: RGPV,
    recentEventRecap: 'Trial dates are announced by the sports office at the start of the session. Miss the trial and you wait a year.',
    imageUrl: null,
    events: [
      {
        id: 'rgpv-ev-trials',
        title: 'College trials and inter-college meet',
        category: 'Competition',
        date: 'Session start',
        location: 'College ground / host campus',
        description: 'Play for the college first. University selection follows results.',
        recap: 'Ask the sports office which fixtures are RGPV events versus friendly matches.',
      },
    ],
  },
  {
    id: 'rgpv-nss',
    name: 'NSS unit (and NCC where enrolled)',
    category: 'Leadership',
    description:
      'National Service Scheme units operate across RGPV affiliated colleges. NCC is separate and only where the college has a wing.',
    purpose: 'Service hours, camps, and a certificate signed by the programme officer.',
    responsibilities: 'Camps, campus drives, and the annual report your unit submits.',
    skillsGained: ['Volunteering', 'Coordination', 'Community work'],
    leadCoordinator: 'NSS programme officer',
    joinUrl: RGPV,
    recentEventRecap: 'Enrolment is a form plus a short orientation. Do it before the unit closes the list.',
    imageUrl: null,
    events: [
      {
        id: 'rgpv-ev-nss',
        title: 'Enrolment and service camp',
        category: 'Cultural',
        date: 'Odd semester',
        location: 'NSS office, your college',
        description: 'Orientation, then a camp or a set of service hours.',
        recap: 'Keep the hour log. The certificate is issued from that log.',
      },
    ],
  },
  {
    id: 'rgpv-iic',
    name: 'Innovation council & E-cell',
    category: 'Leadership',
    description:
      'Institution’s Innovation Council and entrepreneurship cells at affiliated colleges. Use them for ideathons, IPR basics, and mentor access.',
    purpose: 'Turn a lab idea into a demo, a pitch, and optionally a startup note.',
    responsibilities: 'Ideathon, mentor hours, and a one-page problem statement.',
    skillsGained: ['Problem framing', 'Pitching', 'Team formation'],
    leadCoordinator: 'IIC convener / E-cell faculty',
    joinUrl: RGPV,
    recentEventRecap: 'Watch the IIC calendar on your college site. Events are often posted only a week ahead.',
    imageUrl: null,
    events: [
      {
        id: 'rgpv-ev-idea',
        title: 'Ideathon or hackathon weekend',
        category: 'Hackathon',
        date: 'Every semester',
        location: 'Your campus or a host college',
        description: 'A 1–2 day build with a mentor review.',
        recap: 'Submit a demo link, not only slides. That is what the next mentor will open.',
      },
    ],
  },
  {
    id: 'rgpv-tnp',
    name: 'Training & placement student team',
    category: 'Leadership',
    description:
      'Student coordinators who support the college T&P cell: registrations, pre-placement talks, and floor management on drive day.',
    purpose: 'See how a drive actually runs, and keep your own applications in order.',
    responsibilities: 'PPT logistics, eligibility lists, and student queries. Not a substitute for your own preparation.',
    skillsGained: ['Corporate etiquette', 'Coordination', 'Aptitude habits'],
    leadCoordinator: 'Training & placement officer',
    joinUrl: RGPV,
    recentEventRecap: 'The cell publishes the season calendar. Your college’s numbers are the ones that matter — not another campus’s brochure.',
    imageUrl: null,
    events: [
      {
        id: 'rgpv-ev-ppt',
        title: 'Pre-placement talk and aptitude week',
        category: 'Workshop',
        date: 'Placement season',
        location: 'Auditorium / T&P cell',
        description: 'Company briefing, then a timed aptitude or coding slot.',
        recap: 'Register before the deadline. Walk-ins are rarely accepted on drive day.',
      },
    ],
  },
];
