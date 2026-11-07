export interface TrendingTech {
  id: string;
  name: string;
  wave: string;
  why: string;
  startHere: { title: string; url: string; cost: 'Free' | 'Paid' };
  stack: string[];
  years: number[];
}

export const TRENDING_TECH: TrendingTech[] = [
  {
    id: 'genai',
    name: 'Generative AI apps',
    wave: 'Hiring 2026–27',
    why: 'Campus JDs now ask for a small LLM feature, not a research paper. A chatbot on your own notes is enough proof.',
    startHere: { title: 'Elements of AI', url: 'https://www.elementsofai.com', cost: 'Free' },
    stack: ['Python', 'APIs', 'Prompting'],
    years: [2, 3, 4],
  },
  {
    id: 'rag',
    name: 'RAG on college data',
    wave: 'Product internships',
    why: 'Retrieval-augmented generation is how intern teams ship “ask our PDF” tools without training a model.',
    startHere: { title: 'Kaggle Intro to Machine Learning', url: 'https://www.kaggle.com/learn/intro-to-machine-learning', cost: 'Free' },
    stack: ['Python', 'Embeddings', 'SQL'],
    years: [2, 3, 4],
  },
  {
    id: 'next',
    name: 'TypeScript + Next.js',
    wave: 'Web / SDE intern',
    why: 'Most campus product teams ship with React. TypeScript plus the App Router is the stack that survives a viva.',
    startHere: { title: 'freeCodeCamp Responsive Web', url: 'https://www.freecodecamp.org/learn', cost: 'Free' },
    stack: ['JavaScript', 'React', 'Git'],
    years: [1, 2, 3],
  },
  {
    id: 'flutter',
    name: 'Flutter / Dart apps',
    wave: 'App internships',
    why: 'One codebase still gets Android internships in Bhopal and Indore product shops.',
    startHere: { title: 'Microsoft Learn', url: 'https://learn.microsoft.com/training', cost: 'Free' },
    stack: ['Dart', 'Firebase', 'UI'],
    years: [2, 3],
  },
  {
    id: 'k8s',
    name: 'Containers and Kubernetes',
    wave: 'Cloud / DevOps',
    why: 'Docker plus a tiny cluster story beats a certificate with no repo.',
    startHere: { title: 'AWS Skill Builder', url: 'https://skillbuilder.aws', cost: 'Free' },
    stack: ['Linux', 'Docker', 'YAML'],
    years: [3, 4],
  },
  {
    id: 'cyber',
    name: 'Applied cybersecurity',
    wave: 'SOC / GRC intern',
    why: 'Network labs plus a TryHackMe-style write-up still convert on RGPV cyber and IT drives.',
    startHere: { title: 'Cisco Networking Academy', url: 'https://www.netacad.com', cost: 'Free' },
    stack: ['Networks', 'Linux', 'OWASP'],
    years: [2, 3, 4],
  },
  {
    id: 'dataeng',
    name: 'Data engineering',
    wave: 'Analytics intern',
    why: 'SQL plus a scheduled pipeline is what AIDS and CSE students get called for after the Python quiz.',
    startHere: { title: 'SQLBolt', url: 'https://sqlbolt.com', cost: 'Free' },
    stack: ['SQL', 'Python', 'ETL'],
    years: [2, 3, 4],
  },
  {
    id: 'edge',
    name: 'On-device / edge ML',
    wave: 'ECE · IoT',
    why: 'Tiny models on a board beat a Colab notebook when the JD says embedded or IoT.',
    startHere: { title: 'NPTEL', url: 'https://nptel.ac.in', cost: 'Free' },
    stack: ['C', 'Python', 'Sensors'],
    years: [2, 3, 4],
  },
  {
    id: 'rust',
    name: 'Rust systems track',
    wave: 'Core / systems',
    why: 'A small CLI in Rust is a differentiator for compiler, OS, and performance roles.',
    startHere: { title: 'The Odin Project', url: 'https://www.theodinproject.com', cost: 'Free' },
    stack: ['Rust', 'Git', 'Testing'],
    years: [3, 4],
  },
  {
    id: 'product',
    name: 'Product analytics',
    wave: 'Startup intern',
    why: 'Event tracking and a one-page funnel story help E-Cell and GDG students talk like builders.',
    startHere: { title: 'Google Data Analytics (Coursera)', url: 'https://www.coursera.org/professional-certificates/google-data-analytics', cost: 'Paid' },
    stack: ['Spreadsheets', 'SQL', 'Storytelling'],
    years: [2, 3, 4],
  },
];
