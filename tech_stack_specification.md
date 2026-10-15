# Tech Stack Specification: Campus to Career

## 1. Overview
The "Campus to Career" platform requires a modern, high-performance, and scalable architecture capable of handling user onboarding, interactive dashboards, real-time analytics, resource management, personalized year-wise roadmaps, and AI-driven skill gap recommendations.

---

## 2. Technology Stack Details

### 2.1 Frontend Architecture
* **Framework**: React.js / Next.js (App Router)
  * *Rationale*: Offers server-side rendering (SSR) for fast public pages, client-side interactivity for student dashboards, and SEO benefits.
* **Language**: TypeScript
  * *Rationale*: Ensures type safety, reduces runtime bugs, and improves developer experience across dynamic UI components.
* **Styling**: Tailwind CSS + Shadcn UI / Radix UI
  * *Rationale*: Utility-first CSS framework enabling rapid, highly customizable, and responsive UI development matching modern standards.
* **State Management**: Zustand / TanStack Query (React Query)
  * *Rationale*: Efficient global state management with optimized asynchronous data fetching, caching, and server-state synchronization.
* **Charts & Visualization**: Recharts / Chart.js
  * *Rationale*: Light-weight library for displaying development scores, roadmap progress, and skill gap radar charts.

### 2.2 Backend Architecture
* **Runtime & Framework**: Node.js with Express.js or NestJS
  * *Rationale*: Asynchronous, event-driven architecture that scales cleanly for RESTful API endpoints and real-time requests.
* **API Paradigm**: REST API (with optional GraphQL support for complex analytics querying)
* **API Documentation**: Swagger / OpenAPI 3.0

### 2.3 Database Layer
* **Primary Database**: PostgreSQL
  * *Rationale*: Relational database ideal for structured data (student profiles, academic records, placement applications, and campus committee listings).
* **ORM**: Prisma / Drizzle ORM
  * *Rationale*: Type-safe database queries, seamless migrations, and optimized connection pooling.
* **Caching & Session Layer**: Redis
  * *Rationale*: In-memory cache for fast retrieval of resource listings, course catalogs, session tokens, and rate-limiting.

### 2.4 Authentication & Authorization
* **Provider**: NextAuth.js / Supabase Auth / Clerk / Firebase Auth
* **Security & Access Control**:
  * **Role-Based Access Control (RBAC)**: Enforces permissions across three distinct user types: `Student`, `Admin/College`, and `Recruiter`.
  * **JWT (JSON Web Tokens)**: Secure token handling with HttpOnly cookies for session management.
  * OAuth 2.0 integration (Google & LinkedIn Login).

### 2.5 AI & ML Services (Skill Gap & Analytics)
* **AI Engine**: OpenAI API / LangChain / Python FastAPI Microservice
  * *Rationale*: Powers automated resume analysis, skill-gap recommendations, ATS keyword matching, and personalized roadmap adjustments.
* **Vector Store (Optional for AI Search)**: Pinecone / Pgvector
  * *Rationale*: Enables semantic search across free/paid resources, courses, and project ideas.

### 2.6 Storage & Media
* **Object Storage**: Amazon S3 / Cloudflare R2
  * *Rationale*: Secure storage for student resumes (PDFs), certificates, portfolio uploads, and profile media.

### 2.7 DevOps, CI/CD & Deployment
* **Frontend Hosting**: Vercel / Netlify
* **Backend Hosting**: AWS ECS / Railway / Render / DigitalOcean App Platform
* **Database Hosting**: Supabase / Neon / AWS RDS
* **Version Control & CI/CD**: GitHub Actions (automated testing, linting, and deployment pipelines)
* **Monitoring & Analytics**: Sentry (error tracking), PostHog / Google Analytics (user tracking)