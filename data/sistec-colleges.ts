export const SISTEC_CAMPUSES = [
  {
    id: 'gn',
    short: 'SISTec-GN',
    name: 'Sagar Institute of Science and Technology — Gandhi Nagar',
    established: 2007,
    address: 'Opposite International Airport, Gandhi Nagar, Bhopal (M.P.) 462036',
    phone: '+91 91099 75760',
    email: 'admission@sistec.ac.in',
    site: 'https://www.sistecgn.ac.in/',
    image: 'https://www.sistecgn.ac.in/assets/admin/upload/slider//299600image.jpeg',
    about:
      'Flagship SISTec campus under Sagar Group of Institutions. NBA-accredited B.Tech programs affiliated to RGPV, with industry CoEs and a large CSE intake.',
    highlights: ['NBA-accredited B.Tech', 'RGPV affiliated', 'CoEs with Netlink, Bosch, Zarthi', 'Sagar Fiesta host campus'],
    branches: [
      'Civil Engineering',
      'Computer Science & Engineering',
      'Computer Science & Information Technology',
      'CSE with AI & Data Science',
      'CSE with Cyber Security',
      'Electrical & Electronics Engineering',
      'Electronics & Communication Engineering',
      'Mechanical Engineering',
    ],
  },
  {
    id: 'ratibad',
    short: 'SISTec-R',
    name: 'Sagar Institute of Science, Technology & Research — Ratibad',
    established: 2009,
    address: 'Sikandrabad, Near Ratibad, Bhadbhada Road, Bhopal (M.P.) 462044',
    phone: '+91 88719 99122',
    email: 'admissions@sistec.ac.in',
    site: 'https://sistecr.ac.in/',
    image: 'https://sistecr.ac.in/assets/admin/upload/slider//665960image.jpg',
    about:
      '12-acre green campus at Ratibad. B.Tech and M.Tech with CoEs in IoT (Gaia), Data Analytics (Netlink), and sustainable construction (UltraTech).',
    highlights: ['12-acre campus', 'SAC + NSS active', 'Drone & Robotics club', 'Future Forge Ideathon'],
    branches: [
      'Civil Engineering',
      'Computer Science & Engineering',
      'CSE with AI & Machine Learning',
      'Electronics & Communication Engineering',
      'Mechanical Engineering',
    ],
  },
  {
    id: 'e',
    short: 'SISTec-E',
    name: 'SISTec Engineering (Ratibad programmes)',
    established: 2009,
    address: 'SISTec Ratibad Campus, Bhopal 462044',
    phone: '+91 88719 99122',
    email: 'admissions@sistec.ac.in',
    site: 'https://www.sistece.ac.in/programmes-offered',
    // Real Ratibad campus photo (not the wide SGI header logo strip)
    image: 'https://sistecr.ac.in/assets/admin/upload/slider//135224image.jpg',
    about:
      'Undergraduate B.Tech (4 years, RGPV) with CSE, CSE-IoT, Electrical, ECE, and Mechanical. M.Tech Power Systems at PG.',
    highlights: ['60 seats / programme', 'RGPV B.Tech', 'IoT specialisation', 'M.Tech Power Systems'],
    branches: [
      'Computer Science & Engineering',
      'CSE with Internet of Things',
      'Electrical Engineering',
      'Electronics & Communication Engineering',
      'Mechanical Engineering',
    ],
  },
];

export type BranchCareer = {
  title: string;
  industry: string;
  description: string;
  coreSkills: string[];
  averageSalary: string;
  demandLevel: string;
};

export const SISTEC_BRANCHES: Array<{
  code: string;
  name: string;
  seats: string;
  campuses: string[];
  youLearn: string;
  after: string;
  image: string;
  site: string;
  careers: BranchCareer[];
}> = [
  {
    code: 'CSE',
    name: 'Computer Science & Engineering',
    seats: '540 (group)',
    campuses: ['Gandhi Nagar', 'Ratibad'],
    youLearn: 'Programming, DSA, OS, DBMS, networks, plus electives in web and cloud.',
    after: 'SDE internships, TCS/product roles, GATE CS.',
    image: 'https://www.sistec.ac.in/assets/upload/home-sliders/sih-3.jpg',
    site: 'https://www.sistec.ac.in/courses-sagar-institute-bhopal',
    careers: [
      { title: 'Software Development Engineer', industry: 'Product / IT services', description: 'Build features in Java/JS for TCS Digital, product startups, or SISTec 1150+ offer pipeline.', coreSkills: ['DSA', 'Java or JS', 'SQL', 'Git'], averageSalary: '4.5–12 LPA (campus mix)', demandLevel: 'Very high' },
      { title: 'Full-Stack Engineer', industry: 'Web product', description: 'React/Next + Node APIs. Matches Year 2 web projects and Odin/freeCodeCamp paths.', coreSkills: ['HTML/CSS', 'JavaScript', 'React', 'REST'], averageSalary: '5–14 LPA', demandLevel: 'High' },
      { title: 'Backend / API engineer', industry: 'SaaS', description: 'Auth, databases, and deployments for campus and intern crates.', coreSkills: ['Node or Java', 'PostgreSQL', 'Docker'], averageSalary: '6–15 LPA', demandLevel: 'High' },
    ],
  },
  {
    code: 'CSIT',
    name: 'Computer Science & Information Technology',
    seats: '60',
    campuses: ['Gandhi Nagar'],
    youLearn: 'Software + IT systems, databases, application development.',
    after: 'IT services, product support, full-stack roles.',
    image: 'https://www.sistec.ac.in/assets/upload/home-sliders/cisco-slider-2.png',
    site: 'https://www.sistec.ac.in/courses-sagar-institute-bhopal',
    careers: [
      { title: 'Application / support engineer', industry: 'IT services', description: 'Client apps, tickets, SQL reports — common TCS/Infosys campus profiles.', coreSkills: ['SQL', 'Java or .NET', 'ITIL basics'], averageSalary: '3.6–6 LPA', demandLevel: 'High' },
      { title: 'Full-Stack developer', industry: 'Web', description: 'Same stack as CSE, with extra IT-systems electives.', coreSkills: ['JavaScript', 'Databases', 'Linux'], averageSalary: '4.5–10 LPA', demandLevel: 'High' },
    ],
  },
  {
    code: 'AIDS',
    name: 'CSE with AI & Data Science',
    seats: '120',
    campuses: ['Gandhi Nagar'],
    youLearn: 'Python, stats, ML pipelines, dashboards (Netlink CoE).',
    after: 'Data analyst, ML intern, analytics CoE projects.',
    image: 'https://www.sistec.ac.in/assets/upload/coe/netlink-lumenore.jpg',
    site: 'https://www.sistec.ac.in/courses-sagar-institute-bhopal',
    careers: [
      { title: 'Data analyst', industry: 'Analytics / BFSI', description: 'SQL + dashboards. Netlink CoE and Kaggle intro ML map here.', coreSkills: ['SQL', 'Python', 'Excel/Power BI'], averageSalary: '4–9 LPA', demandLevel: 'High' },
      { title: 'ML intern / junior DS', industry: 'Product AI', description: 'Classification notebooks, Streamlit demos from Year 3 projects.', coreSkills: ['pandas', 'scikit-learn', 'stats'], averageSalary: '5–12 LPA intern-to-PPO', demandLevel: 'High' },
    ],
  },
  {
    code: 'AIML',
    name: 'CSE with AI & Machine Learning',
    seats: '120',
    campuses: ['Gandhi Nagar', 'Ratibad'],
    youLearn: 'Neural nets, CV/NLP intros, TensorFlow notebooks.',
    after: 'AI internships, research mini-projects, NPTEL ML.',
    image: 'https://www.sistec.ac.in/assets/upload/coe/zarthi.png',
    site: 'https://www.sistec.ac.in/courses-sagar-institute-bhopal',
    careers: [
      { title: 'Machine learning engineer (junior)', industry: 'AI product', description: 'Train small models, ship inference APIs. Zarthi CoE + Elements of AI then Kaggle.', coreSkills: ['Python', 'PyTorch or TF', 'Git'], averageSalary: '6–14 LPA', demandLevel: 'High' },
      { title: 'AI application engineer', industry: 'Services + product', description: 'Integrate LLM/vision APIs into campus tools — not research-only.', coreSkills: ['Python', 'REST', 'prompt eval'], averageSalary: '5–11 LPA', demandLevel: 'Rising' },
    ],
  },
  {
    code: 'IOT',
    name: 'CSE with Internet of Things',
    seats: '60',
    campuses: ['Gandhi Nagar', 'SISTec-E'],
    youLearn: 'Sensors, ESP/NodeMCU, MQTT, Gaia Smart Cities CoE.',
    after: 'Embedded/IoT internships, campus lab occupancy projects.',
    image: 'https://www.sistec.ac.in/assets/upload/coe/gaia.jpg',
    site: 'https://www.sistece.ac.in/programmes-offered',
    careers: [
      { title: 'IoT / embedded engineer', industry: 'Smart cities / industry 4.0', description: 'Firmware + MQTT dashboards. Gaia CoE and drone club overlap.', coreSkills: ['C/C++', 'ESP8266', 'MQTT', 'Python'], averageSalary: '4–9 LPA', demandLevel: 'Medium-high' },
      { title: 'Firmware intern', industry: 'Hardware startups', description: 'Lab occupancy lamp project is a portfolio piece.', coreSkills: ['Arduino', 'sensors', 'HTTP'], averageSalary: 'Stipend + PPO path', demandLevel: 'Medium' },
    ],
  },
  {
    code: 'CYBER',
    name: 'CSE with Cyber Security',
    seats: '60',
    campuses: ['Gandhi Nagar'],
    youLearn: 'Networks, crypto basics, digital forensics workshops.',
    after: 'SOC intern, Cisco NetAcad, campus cyber workshops.',
    image: 'https://www.sistec.ac.in/assets/upload/events-images/hands-on-cyber-security-digital-forensics-workshop-1.JPG',
    site: 'https://www.sistec.ac.in/courses-sagar-institute-bhopal',
    careers: [
      { title: 'SOC / security analyst (junior)', industry: 'Cyber', description: 'Logs, phishing, forensics workshop on SISTec gallery.', coreSkills: ['Networking', 'Linux', 'SIEM basics'], averageSalary: '4–8 LPA', demandLevel: 'High' },
      { title: 'Network security intern', industry: 'IT services', description: 'Cisco Networking Basics then CCNA later.', coreSkills: ['TCP/IP', 'firewalls', 'Wireshark'], averageSalary: '3.6–7 LPA', demandLevel: 'High' },
    ],
  },
  {
    code: 'ECE',
    name: 'Electronics & Communication Engineering',
    seats: '180',
    campuses: ['Gandhi Nagar', 'Ratibad'],
    youLearn: 'Signals, VLSI intro, embedded, communication labs.',
    after: 'Core ECE, embedded, GATE ECE, semiconductor CoE.',
    image: 'https://www.sistec.ac.in/assets/upload/coe/semiconductor-technology.jpg',
    site: 'https://www.sistec.ac.in/courses-sagar-institute-bhopal',
    careers: [
      { title: 'Embedded systems engineer', industry: 'Electronics / auto', description: 'MCU + RTOS lite. Overlaps IoT labs and semiconductor CoE.', coreSkills: ['C', 'digital electronics', 'PCB basics'], averageSalary: '4–10 LPA', demandLevel: 'High' },
      { title: 'VLSI / DFT intern', industry: 'Semiconductor', description: 'AICTE–MeitY CoE path. GATE ECE helps.', coreSkills: ['Verilog', 'digital design', 'timing'], averageSalary: '5–12 LPA internships', demandLevel: 'Rising' },
      { title: 'SDE (ECE crossover)', industry: 'Software', description: 'Many ECE students sit TCS NQT — add DSA + one web project.', coreSkills: ['DSA', 'C++', 'OS'], averageSalary: '4–9 LPA', demandLevel: 'High' },
    ],
  },
  {
    code: 'EE',
    name: 'Electrical / Electrical & Electronics',
    seats: '60 / 30',
    campuses: ['Gandhi Nagar', 'SISTec-E'],
    youLearn: 'Power, machines, control, EEE labs; M.Tech Power Systems.',
    after: 'Core electrical, power-system PG, TAES department club.',
    image: 'https://www.sistec.ac.in/assets/upload/coe/eicher.jpg',
    site: 'https://www.sistec.ac.in/courses-sagar-institute-bhopal',
    careers: [
      { title: 'Power systems / protection engineer', industry: 'Energy / utilities', description: 'M.Tech Power Systems intake 18. Site + design roles.', coreSkills: ['power systems', 'MATLAB', 'protection'], averageSalary: '4–8 LPA', demandLevel: 'Medium' },
      { title: 'Electrical design intern', industry: 'EPC / manufacturing', description: 'Eicher / Bosch CoE adjacency for automotive electrical.', coreSkills: ['AutoCAD electrical', 'machines', 'safety'], averageSalary: '3.5–7 LPA', demandLevel: 'Medium' },
    ],
  },
  {
    code: 'ME',
    name: 'Mechanical Engineering',
    seats: '180',
    campuses: ['Gandhi Nagar', 'Ratibad'],
    youLearn: 'Design, manufacturing, CAD; Quad Torc / FOMBI team.',
    after: 'Core ME, automotive CoEs (Renault Nissan, Eicher, Bosch).',
    image: 'https://www.sistec.ac.in/assets/upload/home-sliders/quad-torc.jpg',
    site: 'https://www.sistec.ac.in/technical-clubs',
    careers: [
      { title: 'Design / CAD engineer', industry: 'Automotive / manufacturing', description: 'Quad Torc Season 11 is the portfolio. SolidWorks/CATIA.', coreSkills: ['CAD', 'strength of materials', 'GD&T'], averageSalary: '3.8–8 LPA', demandLevel: 'High' },
      { title: 'Production / quality engineer', industry: 'Auto OEMs', description: 'Bosch Bridge and Renault Nissan CoEs.', coreSkills: ['manufacturing', 'QC tools', 'lean basics'], averageSalary: '3.6–7 LPA', demandLevel: 'High' },
      { title: 'EV / motorsport intern', industry: 'Mobility', description: 'FOMBI + farm-machinery Eicher CoE.', coreSkills: ['vehicle dynamics', 'workshop', 'team ops'], averageSalary: 'Stipend + core PPO', demandLevel: 'Rising' },
    ],
  },
  {
    code: 'CE',
    name: 'Civil Engineering',
    seats: '120',
    campuses: ['Gandhi Nagar', 'Ratibad'],
    youLearn: 'Structures, surveying, UltraTech sustainable materials CoE.',
    after: 'Site engineer, GATE CE, FACE civil club.',
    image: 'https://www.sistec.ac.in/assets/upload/coe/ultratech.jpg',
    site: 'https://www.sistec.ac.in/courses-sagar-institute-bhopal',
    careers: [
      { title: 'Site / planning engineer', industry: 'Construction', description: 'UltraTech CoE + Nirmaan events. AutoCAD + quantities.', coreSkills: ['AutoCAD', 'estimation', 'site safety'], averageSalary: '3.5–7 LPA', demandLevel: 'High' },
      { title: 'Structural design intern', industry: 'Consultancy', description: 'M.Tech Structural Engineering (18 seats) as a later path.', coreSkills: ['STAAD/ETABS', 'RCC', 'steel'], averageSalary: '4–8 LPA', demandLevel: 'Medium-high' },
    ],
  },
];
