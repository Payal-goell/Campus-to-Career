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
  sampleCompanies?: string[];
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
    // Official courses page: B.Tech 540 (GN 240 + Ratibad 240 + SISTec-E 60), M.Tech 36
    seats: 'B.Tech 540 · M.Tech 36',
    campuses: ['Gandhi Nagar', 'Ratibad', 'SISTec-E'],
    youLearn: 'Programming, DSA, OS, DBMS, networks, Java/Python roadmap, cloud labs (official CSE training modules).',
    after: 'TCS/Infosys/Wipro/Accenture drives, product roles, GATE CS — aligned to 1150+ campus offers.',
    image: 'https://www.sistec.ac.in/assets/upload/home-sliders/sih-3.jpg',
    site: 'https://www.sistec.ac.in/computer-science-engineering',
    careers: [
      { title: 'Software Development Engineer', industry: 'Product / IT services', description: 'Java/JS features for TCS Digital, Infosys, Wipro, Hexaware, and the SISTec 1150+ offer pipeline.', coreSkills: ['DSA', 'Java or JS', 'SQL', 'Git'], averageSalary: 'Campus mix ~4.8 LPA avg · dream up to 22 LPA', demandLevel: 'Very high', sampleCompanies: ['TCS', 'Infosys', 'Wipro', 'Hexaware', 'Sasken'] },
      { title: 'Full-Stack Engineer', industry: 'Web product', description: 'HTML/CSS/JS → Core/Advanced Java path from the official CSE semester training roadmap.', coreSkills: ['HTML/CSS', 'JavaScript', 'Java', 'REST'], averageSalary: '5–14 LPA', demandLevel: 'High', sampleCompanies: ['Accenture', 'Cognizant', 'Praemineo', 'Big Basket'] },
      { title: 'Salesforce / CRM developer', industry: 'SaaS', description: 'ABSYZ Salesforce Developer profiles + dedicated Salesforce lab / immersion on campus.', coreSkills: ['Apex basics', 'Admin trail', 'SQL'], averageSalary: '4.5–10 LPA', demandLevel: 'High', sampleCompanies: ['ABSYZ', 'Salesforce'] },
    ],
  },
  {
    code: 'CSIT',
    name: 'Computer Science & Information Technology',
    seats: 'B.Tech 60',
    campuses: ['Gandhi Nagar'],
    youLearn: 'Software + IT systems, databases, application development.',
    after: 'IT services and product support roles alongside CSE drives.',
    image: 'https://www.sistec.ac.in/assets/upload/home-sliders/cisco-slider-2.png',
    site: 'https://www.sistec.ac.in/courses-sagar-institute-bhopal',
    careers: [
      { title: 'Application / support engineer', industry: 'IT services', description: 'Client apps and SQL reports — common TCS / Infosys / Cognizant campus profiles.', coreSkills: ['SQL', 'Java or .NET', 'ITIL basics'], averageSalary: '3.6–6 LPA', demandLevel: 'High', sampleCompanies: ['TCS', 'Infosys', 'Cognizant'] },
      { title: 'Full-Stack developer', industry: 'Web', description: 'Same stack as CSE with extra IT-systems electives.', coreSkills: ['JavaScript', 'Databases', 'Linux'], averageSalary: '4.5–10 LPA', demandLevel: 'High', sampleCompanies: ['Wipro', 'Accenture', 'Silver Touch Technologies'] },
    ],
  },
  {
    code: 'AIDS',
    name: 'CSE with Artificial Intelligence and Data Science',
    seats: 'B.Tech 120',
    campuses: ['Gandhi Nagar'],
    youLearn: 'Python, stats, ML pipelines, dashboards — Netlink Data Analytics CoE.',
    after: 'Data analyst / ML intern roles; analytics CoE projects.',
    image: 'https://www.sistec.ac.in/assets/upload/coe/netlink-lumenore.jpg',
    site: 'https://www.sistec.ac.in/courses-sagar-institute-bhopal',
    careers: [
      { title: 'Data analyst', industry: 'Analytics / BFSI', description: 'SQL + dashboards via Netlink CoE; Deloitte/Accenture analytics-adjacent hiring.', coreSkills: ['SQL', 'Python', 'Excel/Power BI'], averageSalary: '4–9 LPA', demandLevel: 'High', sampleCompanies: ['Netlink (Lumenore)', 'Deloitte', 'Accenture'] },
      { title: 'ML intern / junior DS', industry: 'Product AI', description: 'Classification notebooks and demos; Celebal Big Data Trainee style profiles appear in bulletins.', coreSkills: ['pandas', 'scikit-learn', 'stats'], averageSalary: '5–12 LPA intern-to-PPO', demandLevel: 'High', sampleCompanies: ['Celebal Technologies', 'Zarthi', 'BNY Mellon'] },
    ],
  },
  {
    code: 'AIML',
    name: 'CSE with Artificial Intelligence and Machine Learning',
    seats: 'B.Tech 120',
    campuses: ['Gandhi Nagar', 'Ratibad'],
    youLearn: 'Neural nets, CV/NLP intros — Zarthi AI & Cloud CoE.',
    after: 'AI internships and company-specific training in Sem 7–8.',
    image: 'https://www.sistec.ac.in/assets/upload/coe/zarthi.png',
    site: 'https://www.sistec.ac.in/courses-sagar-institute-bhopal',
    careers: [
      { title: 'Machine learning engineer (junior)', industry: 'AI product', description: 'Train small models and ship inference — Zarthi CoE + Sem 6 ML module.', coreSkills: ['Python', 'PyTorch or TF', 'Git'], averageSalary: '6–14 LPA', demandLevel: 'High', sampleCompanies: ['Zarthi', 'Celebal Technologies', 'IBM'] },
      { title: 'AI application engineer', industry: 'Services + product', description: 'Integrate LLM/vision APIs; TCS Cyber/AI talks run on campus for Batch 2026.', coreSkills: ['Python', 'REST', 'prompt eval'], averageSalary: '5–11 LPA', demandLevel: 'Rising', sampleCompanies: ['TCS', 'HCLTech', 'Accenture'] },
    ],
  },
  {
    code: 'IOT',
    name: 'CSE with Internet of Things',
    seats: 'B.Tech 60',
    campuses: ['Gandhi Nagar', 'SISTec-E'],
    youLearn: 'Sensors, embedded boards, MQTT — Gaia Smart Cities IoT CoE.',
    after: 'Embedded/IoT internships and smart-city style projects.',
    image: 'https://www.sistec.ac.in/assets/upload/coe/gaia.jpg',
    site: 'https://www.sistece.ac.in/programmes-offered',
    careers: [
      { title: 'IoT / embedded engineer', industry: 'Smart cities / industry 4.0', description: 'Firmware + MQTT dashboards aligned to Gaia CoE.', coreSkills: ['C/C++', 'ESP8266', 'MQTT', 'Python'], averageSalary: '4–9 LPA', demandLevel: 'Medium-high', sampleCompanies: ['Gaia Smart Cities', 'Bosch Bridge'] },
      { title: 'Firmware intern', industry: 'Hardware startups', description: 'Campus IoT lab projects as portfolio for core + product crossover.', coreSkills: ['Arduino', 'sensors', 'HTTP'], averageSalary: 'Stipend + PPO path', demandLevel: 'Medium', sampleCompanies: ['Gaia Smart Cities', 'IBM'] },
    ],
  },
  {
    code: 'CYBER',
    name: 'CSE with Cyber Security',
    seats: 'B.Tech 60',
    campuses: ['Gandhi Nagar'],
    youLearn: 'Networks, crypto basics, digital forensics workshops; Cisco NetAcad path.',
    after: 'SOC intern, CCNA, campus cyber workshops.',
    image: 'https://www.sistec.ac.in/assets/upload/events-images/hands-on-cyber-security-digital-forensics-workshop-1.JPG',
    site: 'https://www.sistec.ac.in/courses-sagar-institute-bhopal',
    careers: [
      { title: 'SOC / security analyst (junior)', industry: 'Cyber', description: 'Logs and forensics workshops; TCS Cyber Security Practice leaders visit campus.', coreSkills: ['Networking', 'Linux', 'SIEM basics'], averageSalary: '4–8 LPA', demandLevel: 'High', sampleCompanies: ['TCS', 'Cisco', 'HCLTech'] },
      { title: 'Network security intern', industry: 'IT services', description: 'Cisco CCNA / Cloud collaboration listed under Industry Certifications.', coreSkills: ['TCP/IP', 'firewalls', 'Wireshark'], averageSalary: '3.6–7 LPA', demandLevel: 'High', sampleCompanies: ['Cisco', 'Wipro', 'Infosys'] },
    ],
  },
  {
    code: 'ECE',
    name: 'Electronics & Communication Engineering',
    seats: 'B.Tech 180 · M.Tech 36',
    campuses: ['Gandhi Nagar', 'Ratibad'],
    youLearn: 'Signals, VLSI intro, embedded — Semiconductor CoE (AICTE–MeitY).',
    after: 'Core ECE, embedded, GATE ECE, software crossover via TCS NQT.',
    image: 'https://www.sistec.ac.in/assets/upload/coe/semiconductor-technology.jpg',
    site: 'https://www.sistec.ac.in/courses-sagar-institute-bhopal',
    careers: [
      { title: 'Embedded systems engineer', industry: 'Electronics / auto', description: 'MCU work with Semiconductor CoE and Bosch Bridge soft-skill track.', coreSkills: ['C', 'digital electronics', 'PCB basics'], averageSalary: '4–10 LPA', demandLevel: 'High', sampleCompanies: ['Dongfang Electronics', 'Bosch Bridge', 'Renault Nissan'] },
      { title: 'VLSI / DFT intern', industry: 'Semiconductor', description: 'AICTE–MeitY Semiconductor CoE; M.Tech VLSI Design (18 seats) as PG path.', coreSkills: ['Verilog', 'digital design', 'timing'], averageSalary: '5–12 LPA internships', demandLevel: 'Rising', sampleCompanies: ['Dongfang Electronics'] },
      { title: 'SDE (ECE crossover)', industry: 'Software', description: 'Many ECE students sit TCS/Wipro screens — add DSA + one project.', coreSkills: ['DSA', 'C++', 'OS'], averageSalary: '4–9 LPA', demandLevel: 'High', sampleCompanies: ['TCS', 'Wipro', 'Cognizant'] },
    ],
  },
  {
    code: 'EE',
    name: 'Electrical / Electrical & Electronics',
    seats: 'EE 60 · EEE 30 · M.Tech Power 18',
    campuses: ['Gandhi Nagar', 'SISTec-E'],
    youLearn: 'Power, machines, control; M.Tech Power Systems; Eicher / Bosch adjacency.',
    after: 'Core electrical GET roles (Dhoot, Crompton, Grupo Antolin in bulletin).',
    image: 'https://www.sistec.ac.in/assets/upload/coe/eicher.jpg',
    site: 'https://www.sistec.ac.in/courses-sagar-institute-bhopal',
    careers: [
      { title: 'Power systems / protection engineer', industry: 'Energy / utilities', description: 'M.Tech Power Systems (18 seats) plus core trainee pipelines.', coreSkills: ['power systems', 'MATLAB', 'protection'], averageSalary: '4–8 LPA', demandLevel: 'Medium', sampleCompanies: ['Crompton Greaves', 'Dhoot Transmission'] },
      { title: 'Electrical design / trainee engineer', industry: 'EPC / automotive', description: 'Grupo Antolin and Dhoot Transmission GET profiles from placement bulletin.', coreSkills: ['AutoCAD electrical', 'machines', 'safety'], averageSalary: '3.5–7 LPA', demandLevel: 'Medium', sampleCompanies: ['Grupo Antolin', 'Dhoot Transmission', 'Eicher Tractors'] },
    ],
  },
  {
    code: 'ME',
    name: 'Mechanical Engineering',
    seats: 'B.Tech 180 · M.Tech 36',
    campuses: ['Gandhi Nagar', 'Ratibad'],
    youLearn: 'Design, manufacturing, CAD; Quad Torc / Renault Nissan / Eicher CoEs.',
    after: 'Core ME trainee roles and automotive CoE exposure.',
    image: 'https://www.sistec.ac.in/assets/upload/home-sliders/quad-torc.jpg',
    site: 'https://www.sistec.ac.in/technical-clubs',
    careers: [
      { title: 'Design / CAD engineer', industry: 'Automotive / manufacturing', description: 'Quad Torc portfolio + Autodesk collaboration on T&P certifications.', coreSkills: ['CAD', 'strength of materials', 'GD&T'], averageSalary: '3.8–8 LPA', demandLevel: 'High', sampleCompanies: ['Renault Nissan', 'Autodesk', 'Eicher Tractors'] },
      { title: 'Production / quality engineer', industry: 'Auto OEMs', description: 'Bosch Bridge and Renault Nissan CoEs on the official CoE list.', coreSkills: ['manufacturing', 'QC tools', 'lean basics'], averageSalary: '3.6–7 LPA', demandLevel: 'High', sampleCompanies: ['Bosch Bridge', 'Renault Nissan', 'Grupo Antolin'] },
      { title: 'EV / motorsport intern', industry: 'Mobility', description: 'FOMBI + farm-machinery Eicher CoE.', coreSkills: ['vehicle dynamics', 'workshop', 'team ops'], averageSalary: 'Stipend + core PPO', demandLevel: 'Rising', sampleCompanies: ['Eicher Tractors', 'Renault Nissan'] },
    ],
  },
  {
    code: 'CE',
    name: 'Civil Engineering',
    seats: 'B.Tech 120 · M.Tech CTM/Structural available',
    campuses: ['Gandhi Nagar', 'Ratibad'],
    youLearn: 'Structures, surveying — UltraTech sustainable construction CoE.',
    after: 'Site engineer, GATE CE, UltraTech-linked projects.',
    image: 'https://www.sistec.ac.in/assets/upload/coe/ultratech.jpg',
    site: 'https://www.sistec.ac.in/courses-sagar-institute-bhopal',
    careers: [
      { title: 'Site / planning engineer', industry: 'Construction', description: 'UltraTech CoE + Nirmaan events. AutoCAD + quantities.', coreSkills: ['AutoCAD', 'estimation', 'site safety'], averageSalary: '3.5–7 LPA', demandLevel: 'High', sampleCompanies: ['UltraTech Cement'] },
      { title: 'Structural design intern', industry: 'Consultancy', description: 'M.Tech Structural Engineering (18 seats) as a later path on the courses page.', coreSkills: ['STAAD/ETABS', 'RCC', 'steel'], averageSalary: '4–8 LPA', demandLevel: 'Medium-high', sampleCompanies: ['UltraTech Cement'] },
    ],
  },
];
