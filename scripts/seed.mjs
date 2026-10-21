import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Campus to Career database...');

  // Clean existing tables in order
  await prisma.activityLog.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.coordinatorInquiry.deleteMany({});
  await prisma.coordinatorContact.deleteMany({});
  await prisma.interviewRecord.deleteMany({});
  await prisma.placementApplication.deleteMany({});
  await prisma.userRoadmapMilestone.deleteMany({});
  await prisma.roadmapMilestone.deleteMany({});
  await prisma.collegeEvent.deleteMany({});
  await prisma.clubCommittee.deleteMany({});
  await prisma.userSavedResource.deleteMany({});
  await prisma.resource.deleteMany({});
  await prisma.careerPath.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.studentProject.deleteMany({});
  await prisma.studentCertification.deleteMany({});
  await prisma.studentProfile.deleteMany({});
  await prisma.user.deleteMany({});

  const studentHashedPassword = await bcrypt.hash('Password123!', 10);
  const adminHashedPassword = await bcrypt.hash('AdminPass123!', 10);
  const coordHashedPassword = await bcrypt.hash('CoordPass123!', 10);

  // 1. Create Users
  const studentUser = await prisma.user.create({
    data: {
      email: 'student@college.edu',
      password: studentHashedPassword,
      role: 'STUDENT',
      isVerified: true,
      isOnboarded: true,
      studentProfile: {
        create: {
          fullName: 'Aarav Sharma',
          phone: '+91 98765 43210',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          collegeId: 'uit_rgpv_bpl',
          collegeName: 'Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV), Bhopal',
          branch: 'Computer Science & Engineering',
          currentYear: 2,
          cgpa: 8.7,
          skills: ['JavaScript', 'TypeScript', 'React.js', 'Node.js', 'Python', 'Data Structures & Algorithms', 'PostgreSQL'],
          targetRole: 'Full-Stack Software Engineer',
          preferredDomains: ['Web Development', 'Cloud Systems', 'AI/ML'],
          targetPlacementYear: 2026,
          primaryGoal: 'Secure a product SDE internship in Bengaluru/Hyderabad or TCS Digital / GATE CS',
          profileCompletion: 92,
          developmentScore: 78,
          projects: {
            create: [
              {
                title: 'Campus Food Delivery & Dining Tracker',
                description: 'Full-stack web application with real-time dining hall wait estimates and pre-ordering for 3,000+ students.',
                techStack: ['Next.js', 'PostgreSQL', 'Tailwind CSS', 'Prisma'],
                githubUrl: 'https://github.com/aaravsharma/campus-dining',
                liveUrl: 'https://campus-dining.demo.app',
              },
              {
                title: 'Algorithmic Trading Backtester',
                description: 'Python engine backtesting moving average and RSI strategies with interactive Streamlit visualization.',
                techStack: ['Python', 'Pandas', 'NumPy', 'Streamlit'],
                githubUrl: 'https://github.com/aaravsharma/algo-backtest',
              }
            ]
          },
          certifications: {
            create: [
              {
                name: 'Meta Front-End Developer Professional Certificate',
                issuer: 'Coursera / Meta',
                isVerified: true,
                credentialUrl: 'https://coursera.org/verify/meta-frontend'
              },
              {
                name: 'AWS Certified Cloud Practitioner',
                issuer: 'Amazon Web Services',
                isVerified: true,
                credentialUrl: 'https://aws.amazon.com/verification'
              }
            ]
          }
        }
      }
    }
  });

  const freshStudent = await prisma.user.create({
    data: {
      email: 'newbie@college.edu',
      password: studentHashedPassword,
      role: 'STUDENT',
      isVerified: true,
      isOnboarded: false, // Testing onboarding wizard
    }
  });

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@college.edu',
      password: adminHashedPassword,
      role: 'ADMIN',
      isVerified: true,
      isOnboarded: true,
    }
  });

  const coordUser = await prisma.user.create({
    data: {
      email: 'sarah.c@college.edu',
      password: coordHashedPassword,
      role: 'COORDINATOR',
      isVerified: true,
      isOnboarded: true,
      coordinator: {
        create: {
          name: 'Prof. Meera Joshi',
          department: 'Training and Placement Cell, RGPV',
          role: 'Lead TPO & Technical Training Coordinator',
          email: 'sarah.c@college.edu',
          phone: '+91 755 267 8891',
          availableHours: 'Mon - Fri, 2:00 PM - 5:00 PM (TPO Office, Academic Block C)'
        }
      }
    },
    include: {
      coordinator: true
    }
  });

  // Additional Coordinators
  await prisma.coordinatorContact.createMany({
    data: [
      {
        name: 'Prof. Rajesh Khanna',
        department: 'Career Development Cell & Industry Relations',
        role: 'Faculty Head of Placements (TPO)',
        email: 'david.vance@college.edu',
        phone: '+91 755 267 8892',
        availableHours: 'Tue & Thu, 10:00 AM - 1:00 PM (TPO Office)'
      },
      {
        name: 'Rohan Sharma',
        department: 'Student Council & Committee Liaison',
        role: 'Extracurricular & Hackathon Coordinator',
        email: 'rohan.sharma@college.edu',
        phone: '+91 94250 33445',
        availableHours: 'Mon, Wed, Fri, 3:30 PM - 6:00 PM (Student Center)'
      },
      {
        name: 'Dr. Kavita Nair',
        department: 'Innovation and Robotics Cell, RGPV',
        role: 'Technical Projects & Lab Mentor',
        email: 'elena.rostova@college.edu',
        phone: '+91 98260 11223',
        availableHours: 'Daily, 4:00 PM - 6:00 PM (Robotics MakerSpace)'
      }
    ]
  });

  // 2. Courses
  await prisma.course.createMany({
    data: [
      {
        title: 'Advanced Web Architectures & Cloud Microservices',
        domain: 'Full-Stack Web',
        branch: 'Computer Science & Engineering',
        description: 'Comprehensive curriculum spanning scalable distributed systems, Docker orchestration, caching layers, and high-concurrency client patterns.',
        typicalSkills: ['Next.js', 'Node.js', 'PostgreSQL', 'Docker', 'Redis', 'Kubernetes'],
        learningPath: 'HTML/CSS/JS Basics -> React Component Architecture -> Node.js REST APIs -> Microservices with Docker',
        alignmentScore: '96% match with target role'
      },
      {
        title: 'Data Structures, Algorithms & Competitive Programming',
        domain: 'Core Computer Science',
        branch: 'Computer Science & Engineering',
        description: 'Rigorous deep-dive into graph algorithms, dynamic programming, trees, amortized analysis, and LeetCode master patterns.',
        typicalSkills: ['C++', 'Java', 'Python', 'Time Complexity Analysis', 'Graph Theory'],
        learningPath: 'Arrays & Strings -> Linked Lists & Stacks -> Trees & Graphs -> Dynamic Programming',
        alignmentScore: '92% match with placement requirements'
      },
      {
        title: 'Machine Learning & Applied Generative AI',
        domain: 'Artificial Intelligence',
        branch: 'Artificial Intelligence & Data Science',
        description: 'From statistical learning to transformer architectures, LLM fine-tuning, RAG pipelines, and PyTorch deployment.',
        typicalSkills: ['Python', 'PyTorch', 'Scikit-Learn', 'Vector Databases', 'Transformers'],
        learningPath: 'Linear Algebra -> Classical Machine Learning -> Deep Neural Networks -> LLM Engineering',
        alignmentScore: '85% match'
      },
      {
        title: 'Cloud DevOps & Site Reliability Engineering',
        domain: 'Cloud Systems',
        branch: 'Information Technology',
        description: 'Modern infrastructure as code, CI/CD pipelines, AWS/GCP architecture, monitoring with Prometheus/Grafana.',
        typicalSkills: ['Terraform', 'AWS', 'Linux', 'GitHub Actions', 'Prometheus'],
        learningPath: 'Linux Shell Mastery -> Git & GitHub Actions -> Docker & Containerization -> Cloud Services',
        alignmentScore: '89% match'
      }
    ]
  });

  // 3. Career Paths
  await prisma.careerPath.createMany({
    data: [
      {
        title: 'Full-Stack Software Engineer',
        industry: 'Software & Technology',
        description: 'Designs and delivers end-to-end web architectures, microservices, interactive client apps, and relational data pipelines.',
        coreSkills: ['TypeScript', 'React / Next.js', 'Node.js / Express', 'PostgreSQL', 'System Design'],
        averageSalary: '$95,000 - $145,000 / ₹14 - 24 LPA',
        demandLevel: 'Very High'
      },
      {
        title: 'Cloud & DevOps Engineer',
        industry: 'Cloud Infrastructure & Security',
        description: 'Automates deployment pipelines, provisions scalable multi-region cloud infrastructures, and ensures 99.99% system uptime.',
        coreSkills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Linux'],
        averageSalary: '$105,000 - $155,000 / ₹16 - 28 LPA',
        demandLevel: 'High'
      },
      {
        title: 'AI / Machine Learning Engineer',
        industry: 'Artificial Intelligence',
        description: 'Trains, optimizes, and deploys predictive neural networks, computer vision models, and generative AI agents.',
        coreSkills: ['Python', 'PyTorch', 'Vector DBs', 'Model Evaluation', 'FastAPI'],
        averageSalary: '$115,000 - $170,000 / ₹18 - 32 LPA',
        demandLevel: 'Exploding'
      },
      {
        title: 'Data Analyst & Business Intelligence Specialist',
        industry: 'Analytics & Consulting',
        description: 'Transforms petabytes of enterprise data into actionable statistical insights, predictive dashboards, and revenue models.',
        coreSkills: ['SQL', 'Tableau', 'Python', 'PowerBI', 'Data Warehousing'],
        averageSalary: '$80,000 - $120,000 / ₹10 - 18 LPA',
        demandLevel: 'Steady'
      }
    ]
  });

  // 4. Resources (Free and Paid)
  const resourcesData = [
    {
      title: 'React — Quick Start',
      type: 'course',
      category: 'Web Development',
      provider: 'React',
      url: 'https://react.dev/learn',
      isPaid: false,
      level: 'Beginner to Intermediate',
      rating: 4.9,
      description: 'Official free React tutorial. Build tic-tac-toe, then reuse the same steps on a college project.',
      academicYear: 2
    },
    {
      title: 'The System Design Primer (Interactive Repository)',
      type: 'practice',
      category: 'System Design',
      provider: 'GitHub Open Source (Donne Martin)',
      url: 'https://github.com/donnemartin/system-design-primer',
      isPaid: false,
      level: 'Intermediate to Advanced',
      rating: 5.0,
      description: 'An immense open-source guide preparing software engineers for large-scale architectural and system design interviews.',
      academicYear: 3
    },
    {
      title: 'NeetCode 150 — Curated DSA Video Solutions',
      type: 'youtube',
      category: 'Data Structures & Algorithms',
      provider: 'NeetCode YouTube Channel',
      url: 'https://www.youtube.com/c/neetcode',
      isPaid: false,
      level: 'All Levels',
      rating: 4.9,
      description: 'Crystal-clear visual explanations of the top 150 algorithmic problems asked by Google, Meta, Amazon, and Microsoft.',
      academicYear: 2
    },
    {
      title: 'Official PostgreSQL Documentation',
      type: 'doc',
      category: 'Databases',
      provider: 'PostgreSQL Global Development Group',
      url: 'https://www.postgresql.org/docs/current/',
      isPaid: false,
      level: 'Beginner to Advanced',
      rating: 4.8,
      description: 'Authoritative documentation detailing query plans, indexing strategies, ACID guarantees, and JSONB operators.',
      academicYear: 2
    },
    {
      title: 'Think Python (free PDF)',
      type: 'book',
      category: 'Programming',
      provider: 'Allen B. Downey / Green Tea Press',
      url: 'https://greenteapress.com/wp/think-python-2e/',
      isPaid: false,
      level: 'Beginner',
      rating: 4.7,
      description: 'Free Year-1 Python companion for RGPV PPS labs with runnable chapter exercises.',
      academicYear: 1
    },
    {
      title: 'Eloquent JavaScript (free online)',
      type: 'book',
      category: 'Web Development',
      provider: 'Marijn Haverbeke',
      url: 'https://eloquentjavascript.net/',
      isPaid: false,
      level: 'Beginner',
      rating: 4.8,
      description: 'Free HTML/CSS/JS book — chapters 1–14 cover a static site before React.',
      academicYear: 1
    },
    {
      title: 'Operating Systems: Three Easy Pieces (free)',
      type: 'book',
      category: 'Operating Systems',
      provider: 'Remzi & Andrea Arpaci-Dusseau',
      url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/',
      isPaid: false,
      level: 'Intermediate',
      rating: 4.9,
      description: 'Free OS chapters that map to RGPV OS: virtualization, concurrency, persistence.',
      academicYear: 3
    },
    {
      title: 'MIT OCW 6.006 Introduction to Algorithms',
      type: 'course',
      category: 'Data Structures & Algorithms',
      provider: 'MIT OpenCourseWare',
      url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/',
      isPaid: false,
      level: 'Intermediate',
      rating: 4.9,
      description: 'Free lectures and problem sets for Year 2 DSA. Printed CLRS stays the library copy.',
      academicYear: 2
    },
    {
      title: 'Designing Data-Intensive Applications (O\'Reilly Book)',
      type: 'book',
      category: 'System Architecture',
      provider: "O'Reilly Media / Martin Kleppmann",
      url: 'https://dataintensive.net',
      isPaid: true,
      level: 'Advanced',
      rating: 5.0,
      description: 'The industry-standard bible for distributed systems, replication, partitioning, consensus, and stream processing.',
      academicYear: 3
    },
    {
      title: 'TypeScript Handbook',
      type: 'doc',
      category: 'Web Development',
      provider: 'Microsoft',
      url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
      isPaid: false,
      level: 'Intermediate',
      rating: 4.9,
      description: 'Official free handbook. Read Everyday Types and Narrowing, then type one college React component.',
      academicYear: 2
    },
    {
      title: 'NeetCode Practice (Blind 75)',
      type: 'practice',
      category: 'Competitive Programming',
      provider: 'NeetCode',
      url: 'https://neetcode.io/practice',
      isPaid: false,
      level: 'All Levels',
      rating: 4.7,
      description: 'Free curated problem list with video solutions. Two problems a day is enough for campus OAs.',
      academicYear: 4
    },
    {
      title: 'Docker — Get started',
      type: 'doc',
      category: 'Cloud & DevOps',
      provider: 'Docker',
      url: 'https://docs.docker.com/get-started/',
      isPaid: false,
      level: 'Beginner to Intermediate',
      rating: 4.8,
      description: 'Official free guide. Containerise one college project and run it locally.',
      academicYear: 3
    }
  ];

  for (const res of resourcesData) {
    const created = await prisma.resource.create({ data: res });
    // Bookmark first two for student
    if (res.title.includes('React') || res.title.includes('System Design')) {
      await prisma.userSavedResource.create({
        data: {
          userId: studentUser.id,
          resourceId: created.id,
          status: res.title.includes('React') ? 'IN_PROGRESS' : 'SAVED'
        }
      });
    }
  }

  // 5. Clubs & Committees
  const clubs = [
    {
      name: 'Apex Robotics & IoT Innovation Club',
      category: 'Technical',
      description: 'Student-led engineering collective crafting autonomous ground robots, aerial drones, ROS-enabled microcontrollers, and IoT hardware.',
      purpose: 'Bridge academic theory with tangible hardware engineering through hands-on fabrication and international competitions.',
      responsibilities: 'Host weekly workshops, manage lab equipment, organize the annual National BotWars arena battle, and mentor junior builders.',
      skillsGained: ['Embedded C++', 'Computer Vision', 'Circuit Design', 'Team Leadership', 'Project Management'],
      leadCoordinator: 'Elena Rostova',
      joinUrl: 'https://apex.edu/clubs/robotics/apply',
      recentEventRecap: 'Organized National BotWars 2026 featuring 42 collegiate teams, 120 combat matches, and $5,000 in sponsored hardware prizes.',
      imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80'
    },
    {
      name: 'Open Source & Web Development Cell (OSDC)',
      category: 'Technical',
      description: 'Passionate developer guild shipping internal campus platforms, contributing to upstream GitHub projects, and running hackathons.',
      purpose: 'Cultivate software craftsmanship, open collaboration, and portfolio-worthy production code before students graduate.',
      responsibilities: 'Maintain college open-source repositories, run Git & Web bootcamps, and facilitate mock technical screening.',
      skillsGained: ['Full-Stack Web Dev', 'Git Workflow', 'CI/CD Pipelines', 'Code Reviewing', 'Public Speaking'],
      leadCoordinator: 'Rohan Sharma',
      joinUrl: 'https://apex.edu/clubs/osdc/apply',
      recentEventRecap: 'Held HackApex 2026 (36-hour hackathon) with 450 participants, generating 84 submitted production prototypes.',
      imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80'
    },
    {
      name: 'Apex Competitive Programming Club (CPC)',
      category: 'Technical',
      description: 'Elite algorithmic problem-solving society training for ICPC, Google Code Jam, and Tier-1 technical screens.',
      purpose: 'Sharpen analytical intuition and optimize mathematical problem-solving speed under tournament conditions.',
      responsibilities: 'Host bi-weekly contests, create editorial analyses, and conduct peer mock coding interviews.',
      skillsGained: ['Advanced DSA', 'Algorithmic Speed', 'Mathematical Logic', 'Stress Management'],
      leadCoordinator: 'Sarah Connor',
      joinUrl: 'https://apex.edu/clubs/cpc/apply',
      recentEventRecap: 'Qualified 3 teams into the ICPC Regional Finals 2026, ranking top 10 among collegiate participants.',
      imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80'
    },
    {
      name: 'Apex Entrepreneurship & Venture Cell (E-Cell)',
      category: 'Leadership',
      description: 'Incubator for student startups providing seed mentoring, investor demo days, and product-market fit clinics.',
      purpose: 'Empower students to turn breakthrough technical concepts into commercial businesses and funded ventures.',
      responsibilities: 'Organize annual E-Summit, invite angel investors, run pitch competitions, and assist in legal company formation.',
      skillsGained: ['Pitching & Storytelling', 'Product Strategy', 'Financial Modeling', 'Networking'],
      leadCoordinator: 'Prof. David Vance',
      joinUrl: 'https://apex.edu/clubs/ecell/apply',
      recentEventRecap: 'Hosted Apex Venture Summit 2026; 5 student startups secured cumulative pre-seed term sheets of $150,000.',
      imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop&q=80'
    }
  ];

  for (const c of clubs) {
    const createdClub = await prisma.clubCommittee.create({ data: c });

    // Create upcoming event for this club
    await prisma.collegeEvent.create({
      data: {
        title: `${c.name.split(' ')[1]} Annual Showcase & Spring Challenge`,
        clubId: createdClub.id,
        category: c.category === 'Technical' ? 'Hackathon' : 'Competition',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // in 14 days
        location: 'Main Auditorium & Innovation Lab',
        description: 'Interactive exhibition of ongoing research projects, hands-on hardware demos, lightning talks, and recruiter networking.',
        recap: 'Last year’s edition drew 600 attendees and 18 corporate sponsors.',
        registrationUrl: 'https://apex.edu/events/spring-showcase'
      }
    });
  }

  // 6. Roadmap Milestones (Year 1 to Year 4)
  const roadmapData = [
    // Year 1: Foundations
    {
      year: 1,
      theme: 'Explore & Build Foundations',
      title: 'Discover Core Computer Science & Algorithmic Logic',
      description: 'Master programming fundamentals in C++/Python, basic data structures (arrays, pointers, recursion), and command-line shell mastery.',
      category: 'Foundational',
      domain: 'Core CS',
      difficulty: 'Beginner',
      estimatedHours: 45,
      skillsTargeted: ['C++', 'Python', 'Memory Management', 'Recursion', 'Linux Terminal'],
      actionItems: ['Complete 30 foundational exercises', 'Set up GitHub and terminal dotfiles', 'Implement binary search and sorting from scratch'],
      order: 1
    },
    {
      year: 1,
      theme: 'Explore & Build Foundations',
      title: 'Join 1-2 Technical or Campus Leadership Societies',
      description: 'Attend introductory orientation bootcamps, engage with senior mentors, and participate in freshman hackathons.',
      category: 'Extracurricular',
      domain: 'Leadership',
      difficulty: 'Beginner',
      estimatedHours: 20,
      skillsTargeted: ['Teamwork', 'Communication', 'Git Collaborations', 'Peer Mentorship'],
      actionItems: ['Attend OSDC & Robotics club orientations', 'Join a project subgroup team', 'Participate in freshman coding contest'],
      order: 2
    },
    {
      year: 1,
      theme: 'Explore & Build Foundations',
      title: 'Construct First Version-Controlled Showcase Project',
      description: 'Create an interactive web application or developer utility tool with Git version control and deploy live.',
      category: 'Project',
      domain: 'Full-Stack Web',
      difficulty: 'Beginner',
      estimatedHours: 35,
      skillsTargeted: ['HTML5/CSS3', 'Modern JavaScript', 'Git Workflow', 'Vercel Deployment'],
      actionItems: ['Build personal developer portfolio', 'Host code on public GitHub repo', 'Write clean README with screenshots'],
      order: 3
    },
    {
      year: 1,
      theme: 'Explore & Build Foundations',
      title: 'Discrete Mathematics & Boolean Logic Foundations',
      description: 'Strengthen mathematical proof techniques, combinatorics, graph theory basics, and asymptotic Big-O notations.',
      category: 'Foundational',
      domain: 'Core CS',
      difficulty: 'Intermediate',
      estimatedHours: 30,
      skillsTargeted: ['Time Complexity', 'Combinatorics', 'Set Theory', 'Logic Gates'],
      actionItems: ['Complete Big-O complexity cheat sheet', 'Solve 20 recurrence relation problems', 'Verify space complexity proofs'],
      order: 4
    },

    // Year 2: Build & Experiment
    {
      year: 2,
      theme: 'Build & Experiment',
      title: 'Master Intermediate DSA & LeetCode 150 Core Patterns',
      description: 'Solve 150+ medium/hard algorithmic problems across trees, dynamic programming, sliding window, and graphs.',
      category: 'Technical',
      domain: 'Competitive Programming',
      difficulty: 'Intermediate',
      estimatedHours: 70,
      skillsTargeted: ['Trees & BST', 'Dynamic Programming', 'Graph BFS/DFS', 'Two Pointers'],
      actionItems: ['Solve NeetCode 150 pattern set', 'Participate in bi-weekly LeetCode contests', 'Maintain personal solution notes on GitHub'],
      order: 1
    },
    {
      year: 2,
      theme: 'Build & Experiment',
      title: 'Compete in First 24-Hour Collegiate Hackathon',
      description: 'Form a cross-functional team, brainstorm an end-to-end MVP, build through the night, and pitch to industry judges.',
      category: 'Extracurricular',
      domain: 'Hackathons',
      difficulty: 'Intermediate',
      estimatedHours: 30,
      skillsTargeted: ['Rapid Prototyping', 'Product Pitching', 'API Integration', 'Stress Resilience'],
      actionItems: ['Form a 4-person multidisciplinary team', 'Integrate third-party APIs and database', 'Deliver 3-minute pitch deck and demo video'],
      order: 2
    },
    {
      year: 2,
      theme: 'Build & Experiment',
      title: 'Construct a Full-Stack Production Portfolio Web App',
      description: 'Architect a modern web application with Next.js 14, PostgreSQL database, Prisma ORM, and JWT authentication.',
      category: 'Project',
      domain: 'Full-Stack Web',
      difficulty: 'Intermediate',
      estimatedHours: 60,
      skillsTargeted: ['Next.js App Router', 'TypeScript', 'PostgreSQL', 'Tailwind CSS', 'REST APIs'],
      actionItems: ['Implement relational schema with Prisma', 'Add authentication and session cookies', 'Deploy with CI/CD on Vercel/Docker'],
      order: 3
    },
    {
      year: 2,
      theme: 'Build & Experiment',
      title: 'Earn Industry Cloud or Developer Certification',
      description: 'Earn AWS Certified Cloud Practitioner, Meta Front-End, or Docker Certified Associate to prove verified skills.',
      category: 'Professional',
      domain: 'Cloud Systems',
      difficulty: 'Intermediate',
      estimatedHours: 40,
      skillsTargeted: ['AWS Cloud', 'Docker Containerization', 'Cloud Economics', 'Security Controls'],
      actionItems: ['Complete video preparation course', 'Take 3 full-length practice exams', 'Pass certification and link badge on LinkedIn'],
      order: 4
    },
    {
      year: 2,
      theme: 'Build & Experiment',
      title: 'Open Source Contribution to Campus or Upstream Repos',
      description: 'Submit accepted pull requests to campus society platforms or trending GitHub open-source repositories.',
      category: 'Extracurricular',
      domain: 'Open Source',
      difficulty: 'Intermediate',
      estimatedHours: 25,
      skillsTargeted: ['Code Review', 'Git Rebase', 'Issue Triage', 'Collaboration'],
      actionItems: ['Find good first issues on GitHub', 'Submit clean pull request with unit tests', 'Get PR merged by maintainers'],
      order: 5
    },

    // Year 3: Specialize & Prepare
    {
      year: 3,
      theme: 'Specialize & Prepare',
      title: 'System Design & High-Concurrency Scalable Architecture',
      description: 'Study load balancers, horizontal scaling, caching strategies with Redis, database sharding, and message queues (Kafka/RabbitMQ).',
      category: 'Technical',
      domain: 'Full-Stack Web',
      difficulty: 'Advanced',
      estimatedHours: 55,
      skillsTargeted: ['System Design', 'Redis Caching', 'Database Sharding', 'Microservices', 'Rate Limiting'],
      actionItems: ['Study Donne Martin System Design Primer', 'Design URL Shortener and Chat System', 'Simulate latency bottlenecks with wrk/k6'],
      order: 1
    },
    {
      year: 3,
      theme: 'Specialize & Prepare',
      title: 'Targeted Resume Engineering & ATS Keyword Optimization',
      description: 'Format technical resume to Harvard/Jakes standard, quantify deliverables with the XYZ formula, and pass 80%+ ATS score.',
      category: 'Placement',
      domain: 'General',
      difficulty: 'Intermediate',
      estimatedHours: 15,
      skillsTargeted: ['Resume Crafting', 'ATS Optimization', 'Quantified Metrics', 'Technical Storytelling'],
      actionItems: ['Format with 1-page clean template', 'Quantify each bullet with metric impact', 'Scan using Campus ATS Scanner tool'],
      order: 2
    },
    {
      year: 3,
      theme: 'Specialize & Prepare',
      title: 'Secure & Excel in Tier-1 Summer Tech Internship',
      description: 'Apply early to on-campus placement drives and off-campus tech internships; ship real engineering features in a production team.',
      category: 'Placement',
      domain: 'General',
      difficulty: 'Advanced',
      estimatedHours: 80,
      skillsTargeted: ['Production Codebase', 'Agile Sprints', 'Code Review', 'Cross-Functional Teamwork'],
      actionItems: ['Track 20+ applications in Kanban tracker', 'Clear technical screenings and OA rounds', 'Receive return offer or strong recommendation'],
      order: 3
    },
    {
      year: 3,
      theme: 'Specialize & Prepare',
      title: 'Quantitative Aptitude, Speed Math & Verbal Drills',
      description: 'Master placement aptitude filters covering time-speed-distance, probability, data interpretation, and verbal comprehension.',
      category: 'Placement',
      domain: 'General',
      difficulty: 'Intermediate',
      estimatedHours: 35,
      skillsTargeted: ['Quantitative Reasoning', 'Speed Math', 'Data Interpretation', 'Logical Deduction'],
      actionItems: ['Practice 500+ quantitative aptitude questions', 'Take 5 timed simulated campus placement tests', 'Achieve 85%+ accuracy in speed rounds'],
      order: 4
    },
    {
      year: 3,
      theme: 'Specialize & Prepare',
      title: 'Applied AI / Cloud Microservices Specialization Capstone',
      description: 'Build specialized project: RAG pipeline with vector DB or Kubernetes multi-cluster deployment with Prometheus monitoring.',
      category: 'Project',
      domain: 'AI / Machine Learning',
      difficulty: 'Advanced',
      estimatedHours: 65,
      skillsTargeted: ['PyTorch / LangChain', 'Vector Search', 'Docker & Kubernetes', 'Prometheus Monitoring'],
      actionItems: ['Architect specialized pipeline architecture', 'Benchmarking inference or query response time', 'Publish live interactive demo with docs'],
      order: 5
    },

    // Year 4: Placement Readiness
    {
      year: 4,
      theme: 'Placement Readiness',
      title: 'Mock Technical & Behavioral Interviews (10+ Sessions)',
      description: 'Practice simulated coding rounds with peers and alumni; perfect STAR method delivery for leadership and conflict queries.',
      category: 'Placement',
      domain: 'General',
      difficulty: 'Advanced',
      estimatedHours: 40,
      skillsTargeted: ['STAR Method', 'Live Coding Pressure', 'Executive Communication', 'Technical Depth'],
      actionItems: ['Schedule 5 peer mock coding rounds', 'Do 3 alumni behavioral interview simulations', 'Review recorded answers and refine explanations'],
      order: 1
    },
    {
      year: 4,
      theme: 'Placement Readiness',
      title: 'Company-Specific Recruitment Drives & Kanban Tracking',
      description: 'Target Tier-1 and product companies, review past question archives, and manage multi-stage interview pipeline.',
      category: 'Placement',
      domain: 'General',
      difficulty: 'Advanced',
      estimatedHours: 60,
      skillsTargeted: ['Interview Strategy', 'Pipeline Management', 'Offer Negotiation', 'Domain Deep Dives'],
      actionItems: ['Review company-specific question archives', 'Update Kanban board status after each round', 'Coordinate with Placement Coordinator Sarah Connor'],
      order: 2
    },
    {
      year: 4,
      theme: 'Placement Readiness',
      title: 'Degree Capstone Engineering Project & Publication',
      description: 'Finalize senior engineering thesis project, write comprehensive documentation, and present to college evaluation panel.',
      category: 'Project',
      domain: 'Core CS',
      difficulty: 'Advanced',
      estimatedHours: 75,
      skillsTargeted: ['Engineering Documentation', 'Thesis Writing', 'Technical Presentation', 'Architecture Evaluation'],
      actionItems: ['Complete capstone system testing', 'Write IEEE format research/project paper', 'Present thesis to faculty evaluation committee'],
      order: 3
    },
    {
      year: 4,
      theme: 'Placement Readiness',
      title: 'Offer Evaluation, Benefits Analysis & Career Transition',
      description: 'Evaluate job offers, analyze base salary vs stock grants and location cost, negotiate terms with guidance from coordinators.',
      category: 'Professional',
      domain: 'Leadership',
      difficulty: 'Intermediate',
      estimatedHours: 20,
      skillsTargeted: ['Offer Negotiation', 'Contract Review', 'Career Planning', 'Relocation Budgeting'],
      actionItems: ['Compare total compensation breakdowns', 'Review employment terms with coordinator', 'Sign offer and finalize graduation transition'],
      order: 4
    }
  ];

  for (const m of roadmapData) {
    const createdMilestone = await prisma.roadmapMilestone.create({ data: m });

    // Link Year 1 milestones as COMPLETED and some Year 2 as COMPLETED for studentUser
    if (m.year === 1) {
      await prisma.userRoadmapMilestone.create({
        data: {
          userId: studentUser.id,
          milestoneId: createdMilestone.id,
          completed: true,
          status: 'COMPLETED',
          completedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)
        }
      });
    } else if (m.year === 2 && m.order <= 2) {
      await prisma.userRoadmapMilestone.create({
        data: {
          userId: studentUser.id,
          milestoneId: createdMilestone.id,
          completed: true,
          status: 'COMPLETED',
          completedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      });
    } else if (m.year === 2 && m.order === 3) {
      await prisma.userRoadmapMilestone.create({
        data: {
          userId: studentUser.id,
          milestoneId: createdMilestone.id,
          completed: false,
          status: 'IN_PROGRESS'
        }
      });
    }
  }

  // 7. Placement Applications & Interview Kanban
  const app1 = await prisma.placementApplication.create({
    data: {
      userId: studentUser.id,
      company: 'Stripe',
      role: 'Software Engineering Intern — Core Infrastructure',
      location: 'San Francisco, CA (Hybrid / Remote)',
      salary: '$62 / hour ($10,000/mo) + Housing Stipend',
      status: 'INTERVIEWING',
      appliedDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
      notes: 'Passed online coding assessment with 100% test cases. Technical phone screen scheduled next week.',
      interviews: {
        create: [
          {
            round: 'Online Technical Assessment (Codesignal)',
            date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
            mode: 'Virtual Automated',
            status: 'CLEARED',
            feedback: 'Scored 840/850 on 4 questions within 70 minutes.'
          },
          {
            round: 'Technical Architecture & Live Coding (Round 1)',
            date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            mode: 'Virtual (Google Meet)',
            status: 'SCHEDULED',
            feedback: 'Focus on distributed rate limiters and concurrency.'
          }
        ]
      }
    }
  });

  const app2 = await prisma.placementApplication.create({
    data: {
      userId: studentUser.id,
      company: 'Datadog',
      role: 'Systems Software Engineer Intern',
      location: 'New York, NY',
      salary: '$58 / hour + Relocation Allowance',
      status: 'OFFERED',
      appliedDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
      notes: 'Received written summer internship offer! Decision deadline is in 2 weeks.',
      interviews: {
        create: [
          {
            round: 'Initial Screening & Recruiter Chat',
            date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            mode: 'Virtual',
            status: 'CLEARED'
          },
          {
            round: 'Technical Systems Round (Go/C++)',
            date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
            mode: 'Virtual',
            status: 'CLEARED'
          },
          {
            round: 'Engineering Director Behavioral Round',
            date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            mode: 'Virtual',
            status: 'CLEARED',
            feedback: 'Strong problem-solving attitude and cultural fit.'
          }
        ]
      }
    }
  });

  const app3 = await prisma.placementApplication.create({
    data: {
      userId: studentUser.id,
      company: 'Microsoft',
      role: 'Software Engineer (Explore Intern)',
      location: 'Redmond, WA',
      salary: '$50 / hour',
      status: 'APPLIED',
      appliedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      notes: 'Submitted application through university portal with coordinator referral.'
    }
  });

  // 8. Coordinator Inquiries
  await prisma.coordinatorInquiry.create({
    data: {
      ticketId: 'tkt_88291',
      userId: studentUser.id,
      coordinatorId: coordUser.coordinator.id,
      subject: 'Inquiry regarding campus placement registration for Stripe',
      message: 'Hi Sarah, I would like to clarify if off-campus internship offers need to be registered with the college placement office before signing.',
      status: 'RESOLVED',
      response: 'Hi Alex! Yes, please upload a copy of your offer letter to your student portal so we can grant academic credit for your internship semester.'
    }
  });

  // 9. Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: studentUser.id,
        title: 'Upcoming Stripe Technical Interview',
        message: 'Your Round 1 Technical Interview is scheduled in 3 days. Review System Design Primer & concurrency notes.',
        type: 'PLACEMENT'
      },
      {
        userId: studentUser.id,
        title: 'Spring HackApex 2026 Registration Open',
        message: 'Registration is live for the annual 36-hour hackathon hosted by OSDC. Early-bird team slots available.',
        type: 'EVENT'
      },
      {
        userId: studentUser.id,
        title: 'Roadmap Milestone Milestone Reminder',
        message: 'You have completed 2 out of 4 Year 2 milestones. Next target: Cloud/DevOps certification.',
        type: 'REMINDER'
      }
    ]
  });

  // 10. Activity Logs
  await prisma.activityLog.createMany({
    data: [
      {
        userId: studentUser.id,
        action: 'Completed Roadmap Milestone: Participate in First 24h Hackathon'
      },
      {
        userId: studentUser.id,
        action: 'Saved Resource: The System Design Primer'
      },
      {
        userId: studentUser.id,
        action: 'Updated Placement Application: Stripe status changed to INTERVIEWING'
      }
    ]
  });

  console.log('✅ Database successfully seeded with comprehensive data!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
