# Campus to Career

A college platform that takes a student from first year through placement. It combines a public discovery site, a signed-in student workspace, and a coordinator/admin desk.

The product is for students of Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV), Bhopal — the university and its affiliated colleges, not one institute. Students get a year-wise roadmap, skill-gap view, resources, campus clubs, interview practice, and an application tracker. Faculty and placement coordinators get cohort numbers and an inquiry inbox.

---

## Stack

| Layer | Choice |
| :--- | :--- |
| App | Next.js 14.2 App Router, React 18, TypeScript |
| UI | Tailwind CSS 3, design tokens in `design-tokens/tokens.css`, Radix primitives, Lucide icons |
| Charts | Recharts (skill-gap bars) |
| Forms | React Hook Form, Zod, `@hookform/resolvers` |
| Auth | JWT (7-day access, 30-day refresh) in an HttpOnly `token` cookie, or `Authorization: Bearer` |
| Passwords | bcrypt (cost 10) |
| Data | PostgreSQL + Prisma 5 |
| Year map | TypeScript templates in `data/roadmap-templates`, run in the browser and stored in `localStorage` |
| Career path | Hybrid catalog + RandomForest + rules service in `ml/` (FastAPI). Next.js calls it and falls back to the TypeScript rules if the service is down |

`OPENAI_API_KEY` is listed in `.env.example` and is not read by the app. Resume scoring is a local keyword match, not an external model call.

---

## How a student moves through the product

1. **Land.** `/` explains the four-year arc, the modules, and what the Development Score is. Public pages (`/explore`, `/resources`, `/campus-life`, `/coordinators`) work without an account.
2. **Create a student account.** `/register` posts to `POST /api/v1/auth/register`, which hashes the password, creates the `User`, and sets the session cookie. New students have `isOnboarded: false`.
3. **Sign in.** `/login` with email and password, or the navbar **Demo** menu (laptop width) / **Demo profiles** list (phone menu). After login the student is routed by role: `STUDENT` goes to `/onboarding` (first time) or `/dashboard`; `COORDINATOR` goes to `/coordinator-portal`; `ADMIN` goes to `/admin`.
4. **Onboard.** Six steps collect name and contact (identity only), college, branch, and year, **a full skill quiz and extracurricular proof upload** (Step 3 — see Skill Assessment below), interests and target role, career goal (product company, service company, startup, or higher studies), graduation year, weekly hours (1–60), and placement readiness (0–100). Saving calls `POST /api/v1/onboarding/profile`, which creates `StudentProfile` and flips `isOnboarded`. Name and mobile are stored on the profile and are never sent as ML features.
5. **Work from the dashboard.** `/dashboard` loads `GET /api/v1/dashboard/student`: profile, Development Score, roadmap progress, skill-gap bars, recommended actions, upcoming events, saved-resource count, and application count. Students who are not signed in are sent to `/login`.
6. **Follow the roadmap.** `/roadmap` shows two surfaces. The **Career path** panel calls `POST /api/v1/roadmap/generate` and lists numbered steps with hours, a required reason, a Prerequisite badge when a step was inserted automatically, hours planned versus hours available, and a collapsed **Do later** list. Students can mark a step done or mark it useful / not useful (`POST /api/v1/roadmap/feedback`). Below that, the year-by-year **journey map** is still built in the browser from branch, year, domains, and talents (`localStorage` key `ctc.roadmap.v1`). A separate database milestone list still exists at `/api/v1/dashboard/roadmap` for the older year-wise checklist.
7. **Prepare and apply.** Resources, projects, certifications, training, resume scan, interview bank, and the placement Kanban sit on their own routes. Coordinator questions become tickets.

Coordinators and admins use the same login. `/admin` is limited to `ADMIN` and `COORDINATOR`.

---

## Routes

Auth in the table means what the page itself enforces. The API underneath may still require a session even when the page shell is public.

| Path | Who | What it does |
| :--- | :--- | :--- |
| `/` | Public | Landing page: growth arc, modules, Development Score explainer |
| `/login` | Public | Email and password sign-in, plus demo account buttons |
| `/register` | Public | Student registration with email and password. Signs the student in immediately |
| `/onboarding` | Student | Six-step profile wizard. Skipping it blocks the dashboard |
| `/explore` | Public | Branches, careers, and course paths. `/courses` redirects here |
| `/resources` | Public catalog | Filterable courses, videos, docs, books, and practice sets. Saving a resource needs a session |
| `/campus-life` | Public | Clubs and event recaps |
| `/coordinators` | Public directory | Coordinator cards. Sending a question needs a session |
| `/dashboard` | Signed-in student | Command center. Redirects to `/login` or `/onboarding` when those steps are missing |
| `/profile` | Signed-in | Profile completion, academics, skills, projects, certifications |
| `/skills` | Signed-in | Skill list and the gap chart |
| `/roadmap` | Signed-in | Career path from the ML service (or the rules fallback), plus the year-by-year journey map, list view, tune panel, and node drawer |
| `/projects` | Signed-in | Feasible project catalog |
| `/certifications` | Signed-in | Recommended certificates for the student's path |
| `/ai-tools` | Signed-in | Links and helpers for study and placement tools |
| `/training` | Signed-in | Placement-training modules |
| `/personality` | Signed-in | Soft-skill and personality prompts tied to the roadmap |
| `/resume` | Signed-in | Resume text or file scan (keyword ATS-style score) |
| `/interview` | Signed-in | Question bank and links into training, tools, and coordinators |
| `/placement` | Signed-in | Application Kanban: Saved, Applied, Interviewing, Offered, Rejected |
| `/analytics` | Signed-in | Score, skill growth, and roadmap progress for the current student |
| `/notifications` | Signed-in | Notification inbox. The bell in the navbar opens the same data in a drawer |
| `/admin` | Admin or coordinator | Cohort metrics, publish a resource, inquiry inbox. Redirects non-staff to `/dashboard` |
| `/coordinator-portal` | Coordinator or admin | Paginated student table: CGPA, development score, placement eligibility, skill count, branch/year filters |
| `/team` | Public | Interactive team page — hover each card to reveal skills, role, quote, and social links |
| `/design-system` | Public | Living spec of buttons, tokens, and feedback components |

The navbar shows Explore and Resources to everyone. After sign-in it adds Dashboard, Profile, Skills, Roadmap, Projects, Certifications, AI Tools, Campus Life, Training, Personality, Resume, Interview, Placement, Analytics, and Coordinators. Admins and coordinators also get **Admin Portal** and **Coord. Portal**. Login routes by role: students go to dashboard or onboarding, coordinators go to `/coordinator-portal`, admins go to `/admin`. On screens narrower than 1024px those links live in the menu; the demo list is inside that menu too.

---

## HTTP API

Base path: `/api/v1`. Protected handlers read the `token` cookie or a Bearer token via `getSessionUser`.

### Auth

| Method | Path | Access | Notes |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Public | Student accounts only. Creates the user and sets the access cookie |
| `POST` | `/auth/login` | Public | Body: `email`, `password`. Sets the access cookie on a match |
| `POST` | `/auth/logout` | Public | Clears the cookie |
| `GET` | `/auth/me` | Session | Current user, role, onboarding flag, name |

Auth is email and password only. Public registration cannot create admin, coordinator, or recruiter accounts. Seeded demo users work from the navbar demo sign-in.

### Student data

| Method | Path | Access | Notes |
| :--- | :--- | :--- | :--- |
| `POST` | `/onboarding/profile` | Session | Writes `StudentProfile` and marks the user onboarded |
| `GET` | `/dashboard/student` | Session | Profile, score, milestone progress, skill-gap series, events, counts |
| `GET` | `/dashboard/roadmap` | Session | Database milestones for the student's year, with completion state |
| `POST` | `/dashboard/roadmap` | Session | Toggle a milestone (`milestoneId`, `completed`) |
| `POST` | `/roadmap/generate` | Session | Hybrid career path. Calls the ML service (8s timeout) and falls back to the TypeScript rules. Stores the profile (no name or mobile) and steps |
| `POST` | `/roadmap/feedback` | Session | Body: `roadmapId`, `stepId`, `action` (`completed`, `skipped`, `liked`, `disliked`) |
| `GET` | `/notifications` | Session | Inbox |
| `POST` | `/notifications` | Session | Mark one or all as read |
| `POST` | `/resources/save` | Session | Bookmark a catalog resource (`SAVED`, `IN_PROGRESS`, `COMPLETED`) |
| `POST` | `/explore/select-path` | Session | Stores the chosen course on the profile |
| `POST` | `/coordinators/contact` | Session | Opens a `CoordinatorInquiry` with a unique `ticketId` |
| `GET` | `/certifications/recommend` | Session | Suggestions from branch, year, and target role |

### Catalogs (no session required unless noted)

| Method | Path | Notes |
| :--- | :--- | :--- |
| `GET` | `/resources` | Query filters: type, year, paid/free, search |
| `GET` | `/explore/courses` | Courses and career paths |
| `GET` | `/extracurriculars/clubs` | Clubs and events |
| `GET` | `/coordinators` | Directory |
| `GET` | `/projects/catalog` | Project ideas |
| `GET` | `/placement-training/modules` | Training modules |

### Placement

| Method | Path | Access | Notes |
| :--- | :--- | :--- | :--- |
| `GET` | `/placement-training/applications` | Session | Kanban cards and interview rounds |
| `POST` | `/placement-training/applications` | Session | Add a company, role, status, notes |
| `PATCH` | `/placement-training/applications` | Session | Move status or edit fields |
| `DELETE` | `/placement-training/applications` | Session | Remove an application |
| `POST` | `/placement-training/resume/analyze` | Public handler | JSON `{ resumeText }` or multipart `file` / `resumeText`. Returns a keyword score and missing terms. It does not call an LLM |

### Admin and coordinator

| Method | Path | Access | Notes |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin/analytics/overview` | `ADMIN` or `COORDINATOR` | Headcount, average Development Score, roadmap engagement, offer rate, latest inquiries |
| `POST` | `/admin/resources` | `ADMIN` or `COORDINATOR` | Publish a catalog resource |
| `DELETE` | `/admin/resources` | `ADMIN` or `COORDINATOR` | Remove a resource |
| `GET` | `/coordinator/students` | `ADMIN` or `COORDINATOR` | Paginated student list with CGPA, dev score, skills, target role, and placement eligibility. Query params: `page`, `limit`, `search`, `branch`, `year` |

---

## Data model

Prisma schema: `prisma/schema.prisma`. PostgreSQL URL: `DATABASE_URL`.

| Model | Role |
| :--- | :--- |
| `User` | Account. Roles: `STUDENT`, `ADMIN`, `COORDINATOR`, `RECRUITER`. Public signup creates students only. Admin and coordinator rows come from the seed |
| `StudentProfile` | Name, college, branch, year, CGPA, skills, target role, domains, `careerGoal`, `weeklyHours`, `readiness`, `graduationYear`, `skillLevels`, `profileCompletion`, `developmentScore` |
| `GeneratedRoadmap` | One generated career path: profile JSON, steps JSON, `source` (`ml` or `rules`), hours, skipped titles. Table `roadmaps` |
| `RoadmapFeedback` | Per-step events (`completed`, `skipped`, `liked`, `disliked`) used later as training data. Table `roadmap_feedback` |
| `StudentProject`, `StudentCertification` | Evidence attached to a profile |
| `Course`, `CareerPath` | Explore catalog |
| `Resource`, `UserSavedResource` | Learning catalog and per-user status |
| `ClubCommittee`, `CollegeEvent` | Campus life |
| `RoadmapMilestone`, `UserRoadmapMilestone` | Database checklist (year, theme, category, hours, action items) |
| `PlacementApplication`, `InterviewRecord` | Kanban card and interview rounds |
| `CoordinatorContact`, `CoordinatorInquiry` | Directory and ticketed questions (`PENDING`, `IN_REVIEW`, `RESOLVED`) |
| `Notification` | Bell and `/notifications` |
| `ActivityLog` | Timestamped action rows |

Seed script `scripts/seed.mjs` fills users, an onboarded CSE profile (projects and certificates), coordinators, resources, clubs, events, milestones, and sample applications. Re-running the seed against a database that already has those emails will fail on unique constraints; reset the database first if you need a clean load.

---

## Skill assessment during onboarding

Step 3 of onboarding uses `SkillCheck` (`components/onboarding/SkillCheck.tsx`). Every skill the student picks goes through a real check before it enters the ML model.

**Technical skills** (JavaScript, Python, DSA, SQL, Docker, etc.):
- Student picks a difficulty level: Easy, Medium, or Hard.
- A 6-question multiple-choice quiz runs entirely in the browser — no server round-trip.
- Score is `correct / 6 × 100`. That percentage feeds the ML feature vector as the skill level (≥80 → 3, ≥60 → 2, ≥30 → 1, else 0).
- Questions come from `data/skill-quizzes.ts`, which has 3-level banks for 15+ skills and a generic fallback for any other name.

**Extracurricular skills** (dance, sports, music, volunteering, etc.):
- Student marks Basic / Intermediate / Advanced.
- Student uploads a file (certificate PDF, photo, or performance video). The file stays on the student's device — only the filename, type, and size are recorded in the profile cookie.
- The stated level maps to a fixed percentage (Basic 40%, Intermediate 70%, Advanced 90%), held as provisional until a coordinator reviews the proof.

**Why this matters for the ML model:**
- The 48-feature vector the RandomForest receives contains real quiz scores for each of the 14 ML skill dimensions (`programming`, `dsa`, `web_basics`, `fullstack`, `sql`, `git`, `statistics`, `ml_basics`, `system_design`, `cloud`, `aptitude`, `communication`, `projects`, `extracurricular`).
- Before this change, those values were self-reported 0–3 levels. Now they are quiz-derived percentages mapped to that same 0–3 scale via `mapSkillLevels` in `lib/roadmap/ml-profile.ts`.
- The roadmap engine therefore knows precisely how far each skill sits from the role bar and surfaces the right next step — not a generic "improve your skills" message.

The quiz scores and proof metadata are stored as `skillAssessments` in `StudentProfile` and are readable by the Skills page (`/skills`) and the gap chart without any extra API call.

---

The model does not invent steps. It scores a fixed catalog, then a rules layer adds prerequisites, orders them, caps hours at 80% of available time, and writes a reason for every step. If the model file is missing, unsure, or the service errors, the student still gets a roadmap.

Full factor list, 48-feature vector, 53 milestones, RandomForest settings, and eval metrics: [`ml/README.md`](ml/README.md).

| Piece | Where |
| :--- | :--- |
| Catalog | `ml/catalog.json` (roles, skills 0–3, milestones) |
| Features, teacher rules, safety, reasons | `ml/rules.py` |
| Training and `--eval` | `ml/train.py` |
| Inference and fallback | `ml/roadmap.py` |
| HTTP service | `ml/app.py` — `GET /health`, `POST /api/roadmap` |
| Next.js caller | `app/api/v1/roadmap/generate/route.ts` reads `ML_SERVICE_URL` |
| Profile mapping | `lib/roadmap/ml-profile.ts` (strips name and mobile) |
| UI | `components/roadmap/CareerPathPanel.tsx` |

Deploy the ML service separately (Render, Railway, or Fly). The model artifact is about 13 MB compressed and is a poor fit for a Vercel Python function. Next.js stays on Vercel and points at `ML_SERVICE_URL`. Leave that variable empty to use only the in-app rules fallback.

Recent local eval (about 2,500 synthetic students, 500 held out): step-level precision / recall / F1 about 0.94 / 0.89 / 0.91, finalized overlap with the rule roadmap about 0.88, prerequisite-order violations 0. Re-run `python train.py --eval` after a catalog change.

---

## Roadmap engine

The interactive year map on `/roadmap` does not wait on Prisma. The Career path panel above it does call the API.

- Templates live in `data/roadmap-templates` (generic, domain, talent, and RGPV subject tracks).
- `lib/roadmap/generate.ts` picks templates from branch, academic year, interest domains, and talent interests, then fills `{branch}`, `{role}`, `{domain}`, and `{talent}` in the copy.
- Years are themed: Explore and Build Foundation, Build and Experiment, Specialize and Prepare, Placement Readiness. Each year is split into month bands `M1-2` through `M10-12`.
- Pillars: subjects, skills, certification, project, extracurricular, personality, placement.
- The provider in `context/RoadmapContext.tsx` loads after the first paint, reads `localStorage` (`ctc.roadmap.v1`), and can diff a tuned profile against the current nodes (added, removed, moved).
- Personas in `lib/roadmap/personas.ts` (Priya, Arjun, Neha, and others) swap the in-browser profile from the Demo menu. They do not create database users.

The older database milestones (`/api/v1/dashboard/roadmap`) still drive the progress percentage on the student dashboard when those rows exist.

---

## Scores and analysis

**Development Score** (`StudentProfile.developmentScore`, 0–100) is stored on the profile. The seeded student sits at 78 with profile completion 92. The landing page states what the score is meant to reflect: finished roadmap milestones, projects, certifications, and campus leadership. The platform does not promise a placement outcome.

**Skill gap** (`GET /api/v1/dashboard/student`) compares the profile's skill strings with a fixed software-engineering benchmark:

| Skill | Target |
| :--- | :--- |
| Data Structures & Algorithms | 90 |
| React / Next.js | 85 |
| System Design | 80 |
| Databases & SQL | 85 |
| Cloud & Docker | 75 |
| Communication & Behavioral | 80 |

If the profile lists a matching skill, the "current" bar is the higher preset; otherwise it is the lower preset. `/skills` and `/analytics` chart that series. This is a rules comparison, not a statistical model.

**Cohort analytics** (`GET /api/v1/admin/analytics/overview`) averages `developmentScore`, counts students who have any roadmap milestone row, and computes offer rate as `OFFERED` applications divided by all applications. When the database has one or fewer students, the handler falls back to display totals (1250 students) so the admin cards are not empty on a tiny seed.

**Resume scan** scores text by the presence of terms such as Docker, Kubernetes, PostgreSQL, System Design, TypeScript, and AWS, and lists the ones that are missing.

---

## Front end

- `app/layout.tsx` wraps every page in theme, auth, and roadmap providers, plus the navbar and footer.
- Theme (light, dark, system) and color palette are applied before paint by an inline script so the first frame matches the saved choice. Palettes live in `design-tokens/`.
- Shared controls are in `components/ui` (Button, Card, Input, Tabs, Modal, Toast).
- Layout is mobile-first. Below 1024px the section list is a full-height menu. Drawers (roadmap node, tune panel, notifications) use the full viewport width on a phone and a side panel from `sm` up.
- Fonts are self-hosted with `next/font` (Plus Jakarta Sans, Space Grotesk, JetBrains Mono) and `display: swap`.

---

## Demo accounts

Created by `npm run prisma:seed`. Use these on `/login`.

| Who | Email | Password | What you get |
| :--- | :--- | :--- | :--- |
| Aarav Sharma, Year 2 CSE, RGPV, CGPA 8.7, score 78 | `student@college.edu` | `Password123!` | Onboarded student dashboard |
| Fresh start | `newbie@college.edu` | `Password123!` | Account with no profile; login opens onboarding |
| Prof. Meera Joshi, TPO | `sarah.c@college.edu` | `CoordPass123!` | Coordinator directory record and admin portal |
| Campus admin | `admin@college.edu` | `AdminPass123!` | Admin portal |

The navbar demo buttons call login with `Password123!` for every row. That matches the two student accounts. Admin and coordinator need the passwords in the table above when you use the login form.

---

## Run it locally

Requirements: Node 20+, PostgreSQL 14+, Python 3.11+ for the career-path service (3.14 works with the current `ml/requirements.txt`).

```bash
cp .env.example .env
# DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET
# ML_SERVICE_URL="http://127.0.0.1:8000"

npm install
npx prisma generate
npx prisma db push
npm run prisma:seed
npm run dev
```

In a second terminal:

```bash
cd ml
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export ML_MODEL_PATH=artifacts/roadmap_model.joblib
uvicorn app:app --host 127.0.0.1 --port 8000
```

Open [http://localhost:3000](http://localhost:3000). Career path generation uses the ML service when `ML_SERVICE_URL` is set and the process on port 8000 is up. Otherwise `/roadmap` still renders a rules roadmap.

| Script | What it does |
| :--- | :--- |
| `npm run dev` | Next.js dev server |
| `npm run build` | `prisma generate` then `next build` |
| `npm start` | Production server after a build |
| `npm run prisma:generate` | Regenerate the Prisma client |
| `npm run prisma:push` | Push `schema.prisma` without a migration history |
| `npm run prisma:migrate` | `prisma migrate dev --name init` |
| `npm run prisma:seed` | `node scripts/seed.mjs` |

### Environment

| Variable | Required | Purpose |
| :--- | :--- | :--- |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes in production | Access-token signing key. A dev fallback exists in `lib/auth.ts` if this is unset |
| `JWT_REFRESH_SECRET` | Yes in production | Refresh-token signing key. Same fallback behavior |
| `NEXT_PUBLIC_APP_URL` | No | Public origin, default `http://localhost:3000` |
| `OPENAI_API_KEY` | No | Unused by the current code |
| `ML_SERVICE_URL` | No | Base URL of the FastAPI career-path service, for example `http://127.0.0.1:8000`. Empty means the TypeScript rules fallback |
| `ML_MODEL_PATH` | No | Path to `roadmap_model.joblib` inside the ML process. Default `ml/artifacts/roadmap_model.joblib` |

Change both JWT secrets before any shared or production deploy. Cookies are marked `secure` only when `NODE_ENV` is `production`.

---

## Repository map

```
app/                 pages and /api/v1 route handlers
components/          navbar, dashboard, roadmap, placement, ui kit
context/             AuthContext, RoadmapContext
lib/                 auth, prisma client, roadmap engine, ML profile mapper
data/                roadmap templates, courses, projects, interview bank, campus media
design-tokens/       color palettes and CSS variables
ml/                  catalog, RandomForest trainer, rules layer, FastAPI service, tests, model README
prisma/schema.prisma database
scripts/seed.mjs     demo data
```

Related write-ups already in the repo: `ml/README.md` (model factors, features, metrics), `Features.md`, `api_specifications.md`, `DESIGN_SYSTEM.md`, `tech_stack_specification.md`, and `Project specifications.md`. Where those disagree with this file, the code and this README are the ones to trust. Auth is email and password only. Sign-in does not use OTP or email verification.
