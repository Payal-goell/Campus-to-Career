export interface FeasibleProject {
  id: string;
  title: string;
  weeks: number;
  hours: string;
  year: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  stack: string[];
  working: string;
  steps: string[];
  demoHint: string;
  repoHint: string;
  domains: string[];
}

export const FEASIBLE_PROJECTS: FeasibleProject[] = [
  {
    id: 'proj-portfolio',
    title: 'Personal portfolio + RGPV mark sheet tracker',
    weeks: 2,
    hours: '8–12 hrs',
    year: 1,
    difficulty: 'Beginner',
    stack: ['HTML', 'CSS', 'JavaScript', 'localStorage'],
    working:
      'Static pages for About, Skills, and Projects. A marks form writes CGPA to localStorage and draws a simple bar chart with CSS widths. No backend required — open index.html or GitHub Pages.',
    steps: [
      'Create index.html, styles.css, app.js.',
      'Add a form: subject, credits, grade. Compute SGPA = Σ(grade×credits)/Σcredits.',
      'Persist JSON in localStorage; render bars for each semester.',
      'Deploy on GitHub Pages and add the URL to your profile.',
    ],
    demoHint: 'Show adding a subject and the bar updating without a refresh.',
    repoHint: 'Folder: /portfolio with README screenshots.',
    domains: ['Web Development', 'General'],
  },
  {
    id: 'proj-library',
    title: 'College library issue desk (CRUD)',
    weeks: 3,
    hours: '12–18 hrs',
    year: 1,
    difficulty: 'Beginner',
    stack: ['HTML', 'CSS', 'JavaScript'],
    working:
      'Librarian adds a book (title, ISBN, copies). Student searches and “issues” a copy; copies decrement. Data lives in localStorage so it works offline in a lab.',
    steps: [
      'Model {id, title, isbn, copies, issuedTo[]}.',
      'Build search that filters as you type.',
      'Issue / return buttons update copies and a history table.',
      'Export JSON as a backup file.',
    ],
    demoHint: 'Issue the last copy and show the button disable.',
    repoHint: 'Include sample-books.json.',
    domains: ['Web Development', 'Databases'],
  },
  {
    id: 'proj-weather',
    title: 'Bhopal weather + commute dashboard',
    weeks: 2,
    hours: '10–14 hrs',
    year: 2,
    difficulty: 'Beginner',
    stack: ['JavaScript', 'Fetch API', 'Open-Meteo (free)'],
    working:
      'Calls the free Open-Meteo API (no key) for Bhopal lat/long. Shows temperature, rain chance, and a 7-day strip. Pure front-end.',
    steps: [
      'fetch https://api.open-meteo.com/v1/forecast?latitude=23.26&longitude=77.41&daily=temperature_2m_max,precipitation_probability_max',
      'Map the array to cards.',
      'Add a “campus hours” note if rain > 50%.',
      'Host on Netlify drop.',
    ],
    demoHint: 'Toggle °C/°F.',
    repoHint: 'Document the public API in README.',
    domains: ['Web Development'],
  },
  {
    id: 'proj-todo-auth',
    title: 'Notes app with login (Next.js + Prisma)',
    weeks: 4,
    hours: '20–28 hrs',
    year: 2,
    difficulty: 'Intermediate',
    stack: ['Next.js', 'Prisma', 'SQLite', 'JWT cookie'],
    working:
      'Register/login sets an httpOnly cookie. Notes CRUD is scoped to userId. SQLite file in /prisma so it runs on a lab PC without Postgres.',
    steps: [
      'npx create-next-app, add Prisma sqlite.',
      'User + Note models; bcrypt passwords.',
      'API routes /api/notes GET/POST/PATCH/DELETE.',
      'Simple list UI with edit/delete.',
    ],
    demoHint: 'Two browsers, two accounts, isolated notes.',
    repoHint: 'Ship .env.example and seed user.',
    domains: ['Web Development', 'Full-Stack'],
  },
  {
    id: 'proj-attendance',
    title: 'QR attendance for a club meeting',
    weeks: 3,
    hours: '16–22 hrs',
    year: 2,
    difficulty: 'Intermediate',
    stack: ['React', 'qrcode.react', 'html5-qrcode', 'JSON file / Sheets'],
    working:
      'Coordinator generates a QR encoding meetingId+date. Member phone camera scans it; row appends to a Google Sheet via a free Apps Script webhook, or a local JSON if offline.',
    steps: [
      'Page A: generate QR for today’s meeting.',
      'Page B: scanner writes {name, roll, time}.',
      'Deduplicate same roll same meeting.',
      'Download CSV for SAC reports.',
    ],
    demoHint: 'Scan with a second phone; CSV downloads.',
    repoHint: 'Optional Apps Script snippet in /docs.',
    domains: ['Web Development', 'Campus'],
  },
  {
    id: 'proj-shop',
    title: 'Campus lost-and-found board',
    weeks: 3,
    hours: '14–20 hrs',
    year: 2,
    difficulty: 'Intermediate',
    stack: ['Next.js', 'Cloudinary unsigned upload', 'Prisma'],
    working:
      'Student posts item photo + location (e.g. Gandhi Nagar canteen). Others mark “claimed”. Images go to a free Cloudinary unsigned preset; metadata in DB.',
    steps: [
      'Form: photo, title, place, contact.',
      'Grid of open items; filter by campus.',
      'Claim button sets status=closed.',
      'Admin pin for fake reports.',
    ],
    demoHint: 'Upload a sample ID card photo (blurred).',
    repoHint: 'Never store unblurred IDs in git.',
    domains: ['Web Development', 'Campus'],
  },
  {
    id: 'proj-ml-iris',
    title: 'Placement CGPA vs skills classifier',
    weeks: 3,
    hours: '16–24 hrs',
    year: 3,
    difficulty: 'Intermediate',
    stack: ['Python', 'pandas', 'scikit-learn', 'Streamlit'],
    working:
      'Synthetic CSV: CGPA, DSA_score, internships, placed(0/1). Train LogisticRegression. Streamlit slider predicts P(placed). Fully local, no GPU.',
    steps: [
      'Generate 400 dummy rows in generate.py.',
      'Train/test split, print accuracy & confusion matrix.',
      'Dump model with joblib.',
      'streamlit run app.py with sliders.',
    ],
    demoHint: 'Move internships 0→2 and show probability jump.',
    repoHint: 'Include dataset.csv and model.joblib.',
    domains: ['AI / Machine Learning', 'Data'],
  },
  {
    id: 'proj-iot',
    title: 'Lab occupancy lamp (ESP8266 + dashboard)',
    weeks: 4,
    hours: '18–26 hrs',
    year: 3,
    difficulty: 'Intermediate',
    stack: ['ESP8266', 'MQTT / HTTP', 'React'],
    working:
      'PIR or button on NodeMCU posts {occupied:true} to a free HiveMQ Cloud broker (or a Next.js POST). Dashboard lights green/red. Feasible in CoE IoT labs.',
    steps: [
      'Flash Arduino sketch: Wi-Fi + POST JSON every 10s.',
      'API stores last heartbeat.',
      'Front-end polls /api/lab-status.',
      'Show “stale” if no ping > 60s.',
    ],
    demoHint: 'Cover PIR; lamp turns red.',
    repoHint: 'Pinout diagram in README.',
    domains: ['IoT', 'Campus'],
  },
  {
    id: 'proj-resume-api',
    title: 'ATS keyword checker (your own tool)',
    weeks: 2,
    hours: '10–16 hrs',
    year: 3,
    difficulty: 'Beginner',
    stack: ['TypeScript', 'Next.js'],
    working:
      'Paste JD + resume text. Count overlapping keywords (skills list). Score = matched/required * 100. No ML — regex + token set. Complements the platform AI scan.',
    steps: [
      'Tokenize, lowercase, drop stopwords.',
      'Highlight missing skills in red.',
      'Export a checklist Markdown file.',
    ],
    demoHint: 'Same resume vs two JDs, different scores.',
    repoHint: 'Unit test the matcher.',
    domains: ['Web Development', 'Placement'],
  },
  {
    id: 'proj-kanban',
    title: 'Personal application tracker (clone of placement Kanban)',
    weeks: 3,
    hours: '16–22 hrs',
    year: 4,
    difficulty: 'Intermediate',
    stack: ['React', 'dnd-kit', 'localStorage'],
    working:
      'Columns Saved → Applied → Interview → Offer. Drag cards. Dates and notes persist locally so you can use it offline in a placement cell.',
    steps: [
      'Card model {id, company, role, status, notes}.',
      'dnd-kit onDragEnd updates status.',
      'Filter by month.',
      'JSON export for TPO reports.',
    ],
    demoHint: 'Drag a card Applied → Interview.',
    repoHint: 'Seed 3 SISTec-drive companies.',
    domains: ['Web Development', 'Placement'],
  },
];
