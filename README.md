# Campus to Career — Full-Stack Platform

A modern, production-ready student development and career guidance platform built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Prisma ORM**, and **PostgreSQL**.

---

## 🌟 Key Features

1. **Public Website & Discovery**:
   - Modern landing page with 4-Year Student Growth Arc, core feature pillars, transparent Development Score explainer, and live metrics.
   - Public career exploration & domain comparison.

2. **Authentication & Multi-Role Support**:
   - JWT-based authentication with HttpOnly cookies & Bearer tokens.
   - Role-Based Access Control (`STUDENT`, `ADMIN`, `COORDINATOR`, `RECRUITER`).
   - 1-Click Demo Profile Switcher for instantaneous testing.

3. **Multi-Step Student Onboarding Wizard**:
   - Step 1: Basic & Contact Info
   - Step 2: Academic Standing & Current Year
   - Step 3: Current Technical & Professional Skills
   - Step 4: Target Roles & Preferred Domains
   - Step 5: Self-Assessment & Baseline Score Generation

4. **Student Command Center (Dashboard)**:
   - Visual Radial **Development Score Meter** (0–100) with transparent input weighting.
   - Interactive **Skill Gap Analysis** chart comparing student proficiency against target role benchmarks.
   - Year-specific roadmap progress bar and pending actions.
   - Upcoming campus events & hackathons.
   - Slide-over notifications drawer.

5. **Year-Wise Dynamic Roadmaps**:
   - **Year 1**: Explore & Build Foundations
   - **Year 2**: Build & Experiment
   - **Year 3**: Specialize & Prepare
   - **Year 4**: Placement Readiness
   - Real-time milestone status toggling with instant database sync.

6. **Centralized Learning Resource Catalog**:
   - Filterable tabs: Courses, YouTube Playlists, Official Docs, Practice Platforms, Reference Books.
   - High-contrast badges for **100% FREE** vs **PAID / PREMIUM** resources.
   - Bookmarking and learning status tracking.

7. **Campus Life & Extracurriculars**:
   - Vetted directory of student societies (Robotics & IoT, OSDC, CPC, E-Cell).
   - Event recaps (BotWars, HackApex, ICPC Regionals) with participant takeaways.
   - Society join links and lead coordinator contacts.

8. **Placement Preparation & Application Kanban**:
   - Interview curriculum modules: Technical, Behavioral (STAR method), Aptitude.
   - **AI Resume ATS Scanner**: Analyzes keyword density, missing tags, and metrics scoring.
   - **Visual Kanban Board**: Track applications across stages: *Saved*, *Applied*, *Interviewing*, *Offered*, *Archived*.

9. **Student Coordinator Directory & Inquiry Desk**:
   - Searchable directory of coordinators with approved office hours.
   - Ticketed query submission system with unique ticket IDs (e.g., `#tkt_99494`).

10. **College Administration & Analytics Portal**:
    - Real-time cohort metrics: Total students, active roadmap engagement, average development scores, placement offer percentages.
    - Resource publishing tool with Free/Paid designations.
    - Incoming student inquiries ticket inbox.

---

## 🚀 Demo Accounts

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Active Student** | `student@college.edu` | `Password123!` | Alex Rivera, 2nd Year CSE, Score: 78 |
| **New Student** | `newbie@college.edu` | `Password123!` | Un-onboarded (launches wizard) |
| **Coordinator** | `sarah.c@college.edu` | `CoordPass123!` | Sarah Connor, Lead Placement Cell |
| **Administrator** | `admin@college.edu` | `AdminPass123!` | Campus Head Administrator |

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, Lucide Icons, Recharts.
- **Backend**: Next.js Route Handlers (`app/api/v1/...`), REST Architecture, JSON Web Tokens (JWT), Bcrypt.js.
- **Database & ORM**: PostgreSQL (Docker container), Prisma ORM.
- **Validation**: Zod schema validation.

---

## 🏃‍♂️ Getting Started

### 1. Database Setup
```bash
docker start test-pg # or start your PostgreSQL instance
npx prisma db push
npm run prisma:seed
```

### 2. Run the Application
```bash
npm run dev
# or for production:
npm run build && npm run start
```
Access the application at [http://localhost:3000](http://localhost:3000).
