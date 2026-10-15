# UI/UX Specification: Campus to Career

## 1. Design Overview & Principles
* **Goal**: Deliver a clean, structured, and user-friendly interface that takes students step-by-step from their first visit to final career placement.
* **Core Principles**:
  * **Zero-Confusion Navigation**: Consolidate resources, roadmaps, and committee info into intuitive hubs to prevent students from hopping across multiple websites.
  * **Progress-Driven Layout**: Display visual meters, milestone trackers, and real-time skill gap assessments prominently on dashboards.
  * **Role-Based Views**: Tailored interfaces for Students, College/Admins, and Recruiters.

---

## 2. Navigation Architecture & Screen Flow

### 2.1 Public Access (Pre-Login)
* **Home Page**:
  * Platform overview, core features summary, how-it-works workflow, testimonials, and primary CTAs ("Get Started", "Login").
* **Explore (Public)**:
  * Open preview of available careers, branches, colleges, and public resource repositories.
* **Authentication**:
  * Login / Sign Up portal with role selection.
  * Email verification and account activation screens.

---

### 2.2 Student Onboarding (First-Time Login Wizard)
A sequential multi-step onboarding wizard to fetch and initialize student profile details:
1. **Basic Information**: Personal details, contact info, and profile picture upload.
2. **Academic Details**: Branch, current year, university/college affiliation, and GPA/CGPA.
3. **Current Skills**: Initial technical and soft skill tagging.
4. **Interests & Career Preferences**: Target roles, industries, and personal domains of interest.
5. **Goals & Self-Assessment**: Career timeline, primary targets, and initial self-appraisal quiz.
6. **Generated Initial Profile**: Final summary screen establishing the baseline student profile and score.

---

### 2.3 Student Dashboard (Main Hub)
The central command center upon logging in:
* **Top Navigation & Header**: Profile completion status, overall development score, roadmap progress bar, and notifications.
* **Widget Grid**:
  * **Progress Overview**: Visual stats tracking overall academic and professional growth.
  * **Current Goals & Skill Gaps**: Graphic representation of current standing vs. target job role requirements.
  * **Recommended Actions**: Smart, AI-driven next steps and pending tasks.
  * **Upcoming Opportunities & Events**: College events, hackathons, and deadlines.
  * **Recent Activities**: Timeline of recently completed modules and viewed resources.

---

### 2.4 Core Platform Modules (Main Navigation Bar)

1. **Profile**:
   * Detailed view of personal information, academic history, verified badges, skills, and portfolio links.
2. **Explore & Course Exploration**:
   * Filterable catalogue of colleges, branches, careers, and job roles.
   * Dedicated course exploration module allowing students to research and choose final courses aligning with their personal interests.
3. **Skills & Assessments**:
   * Skill categories, proficiency tracking, evidence uploading, and self-assessment test portals.
4. **Roadmap Module**:
   * Personalized, multi-year learning plans and milestones with dynamic progress tracking.
5. **Resource Manager**:
   * Centralized repository tab interface housing courses, YouTube tutorials, documentation, and practice platforms.
   * Clear categorization into **Free** and **Paid** resources to eliminate confusion and streamline access.
6. **Projects & Certifications**:
   * Step-by-step project guides, idea generators, and industry-relevant certification trackers (Free & Paid).
7. **Extracurricular & Campus Life**:
   * Comprehensive recaps, directories, and event details for college clubs, committees, hackathons, sports, and cultural activities to help students choose and join groups.
8. **Placement Training**:
   * Comprehensive modules covering technical training, soft skills, aptitude, mock interviews, and resume building.
9. **Student Coordinator Contacts**:
   * Direct contact directory and communication interface to reach designated student coordinators easily.

---

### 2.5 Year-Wise Student Development Journey (Workflow Views)
* **1st Year (Explore & Build Foundation)**: Focus on broad exploration, basic skills, joining clubs/committees, and personality development.
* **2nd Year (Build & Experiment)**: Focus on deep technical skills, hands-on projects, hackathons, and certifications.
* **3rd Year (Specialize & Prepare)**: Focus on advanced projects, internship preparation, industry skills, and resume building.
* **4th Year (Placement Readiness)**: Focus on mock interviews, placement applications, final skill-gap analysis, and tracking job offers.

---

### 2.6 Admin & College Portal (Separate Access)
* **Student & Branch Management**: Tools to manage student accounts, add opportunities, and view analytics.
* **Resource & Event Management**: Interface for adding and updating resource listings, committee recaps, and campus events.
* **Analytics & Reports**: Visual charts tracking student growth, skill development scores, and overall placement outcomes.