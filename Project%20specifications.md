# Campus to Career — Project Specifications

## 1. Project Overview

**Campus to Career** is a student development and career guidance
platform that supports students from their first year through graduation
and placement. It brings student profiles, career exploration, college
opportunities, learning resources, extracurricular activities,
personalized roadmaps, and placement preparation into one platform.

## 2. Problem Statement

Students often search across multiple websites, social media pages,
college groups, and informal sources to find reliable learning
resources, understand career options, discover college activities, and
prepare for placements. This can create confusion and make it difficult
to follow a clear development plan. Campus to Career provides a
centralized, organized, and personalized platform for these needs.

## 3. Main Objectives

- Create student accounts and maintain academic and skills profiles.
- Provide a dashboard to track student information, progress,
  achievements, and opportunities.
- Help students explore courses, branches, career paths, and job roles
  aligned with their interests.
- Share information and recaps about college events, clubs, committees,
  hackathons, and competitions.
- Organize free and paid learning resources in one place.
- Provide personalized roadmaps with milestones appropriate to each
  academic year.
- Encourage extracurricular participation and skill development.
- Support placement preparation through resume building, aptitude
  practice, interview preparation, and job tracking.
- Help students contact relevant student coordinators.
- Give students a clear overview of their development and placement
  readiness.

## 4. Intended Users

### Student

Creates an account, completes a profile, explores careers and college
opportunities, saves resources, follows a roadmap, records progress, and
prepares for placements.

### College Administrator

Manages college information, branches, events, committees,
opportunities, resources, and reports.

### Student Coordinator

Shares information about assigned events, committees, activities, and
opportunities and provides approved contact details.

### Future Recruiter Role

A recruiter-facing role may be considered later to share jobs or
internships and view permitted student profiles. It is not required for
the first version.

## 5. Core Features

### 5.1 Account and Student Profile

- Registration, login, logout, and account recovery.
- Collect name, email, college, branch, academic year, interests,
  current skills, and career goals.
- Allow students to add projects, certifications, achievements, and
  update their details.

### 5.2 Student Dashboard

- Show profile summary, current goals, roadmap milestones, skills, saved
  resources, upcoming opportunities, and recent activities.
- Display progress based on recorded activities and completed
  milestones.
- Show relevant reminders and notifications.

### 5.3 Course and Career Exploration

- Present courses, branches, career paths, and job roles.
- Explain typical skills and learning paths associated with each option.
- Let students compare options and save areas of interest.
- Provide guidance based on selected interests and skills, without
  promising guaranteed outcomes.

### 5.4 College Events, Clubs, and Committees

- Display event recaps, upcoming events, clubs, committees, hackathons,
  competitions, and cultural or sports activities.
- Explain each activity’s purpose, eligibility, responsibilities, and
  potential skills gained.
- Provide participation information and relevant student coordinator
  contacts.

### 5.5 Resource Manager

- Organize resources by topic, skill, career path, format, and academic
  year.
- Include free and paid courses, videos, books, documentation,
  certifications, and practice platforms.
- Display resource title, provider, cost category, level, description,
  and external link.
- Let students save resources and mark them as started or completed.
- Clearly label paid resources and link to their original provider.

### 5.6 Personalized Year-Wise Roadmap

- Build a roadmap based on academic year, interests, current skills, and
  career goals.
- **Year 1 — Explore and Build Foundations:** explore careers, identify
  interests, learn basic skills, and participate in college activities.
- **Year 2 — Build and Experiment:** develop technical skills, work on
  projects, join hackathons, and begin certifications.
- **Year 3 — Specialize and Prepare:** build advanced projects, pursue
  internships, strengthen industry skills, and improve resume and
  aptitude.
- **Year 4 — Placement Readiness:** practice interviews, apply for
  internships and jobs, track applications, and identify remaining skill
  gaps.
- Let students mark milestones as not started, in progress, or
  completed.
- Keep roadmaps adaptable rather than identical for every student.

### 5.7 Extracurricular Development

- List clubs, committees, events, competitions, hackathons, sports,
  cultural activities, and leadership opportunities.
- Explain skills each activity may help develop, such as teamwork,
  communication, creativity, and leadership.
- Let students record participation and achievements.

### 5.8 Placement Preparation

- Provide placement preparation resources and learning plans.
- Include aptitude practice, technical preparation, resume guidance, and
  interview preparation.
- Track job or internship applications and their stages when students
  enter that information.
- Allow students to record offers and placement outcomes.

### 5.9 Student Coordinator Contact

- Display coordinator name, role, area of responsibility, and approved
  contact method.
- Help students identify whom to contact for events, committees, clubs,
  or placement-related activities.
- Publish only contact details approved for sharing.

### 5.10 Progress and Development Summary

- Summarize completed milestones, skills, projects, certifications,
  extracurricular activities, and placement preparation.
- Show progress over time using clear indicators.
- Explain how any development score is calculated; do not treat it as a
  definitive measure of ability.
- Allow students to review and correct their recorded information.

### 5.11 Administration

- Allow authorized administrators to manage branches, events,
  committees, resources, opportunities, and coordinator details.
- Support basic reports where appropriate.
- Restrict administrative features to authorized accounts.

## 6. Typical Student Workflow

1.  Student visits the public home page.
2.  Student creates an account and signs in.
3.  Student completes their academic, skills, interests, and career-goal
    profile.
4.  The personalized dashboard is displayed.
5.  Student explores courses, careers, events, committees, and
    extracurricular opportunities.
6.  Student saves relevant resources and follows a year-wise roadmap.
7.  Student records completed activities, projects, skills, and
    certifications.
8.  Student uses placement preparation features and tracks applications.
9.  The dashboard updates the student’s progress summary.
10. Student contacts the relevant coordinator when guidance is needed.

## 7. Initial Scope — Minimum Viable Product (MVP)

The first version should prioritize: 1. Account registration and login.
2. Student profile creation and editing. 3. Student dashboard. 4. Course
and career exploration. 5. College events, clubs, and committees
listing. 6. Resource manager with free/paid labels and external links.
7. Year-wise roadmap with milestone tracking. 8. Extracurricular
activity listings and participation records. 9. Student coordinator
contact directory. 10. Basic placement preparation and application
tracking. 11. Simple, transparent progress summary. 12. Admin access for
managing platform content.

Advanced AI recommendations, recruiter accounts, automated resume
scoring, college-system integrations, and advanced analytics can be
considered after the core platform works reliably.

## 8. Suggested Technology Direction

Confirm the final stack before implementation. One practical web option
is: - **Frontend:** HTML, CSS, JavaScript; React may be added if
required. - **Backend:** Python with Flask or Django. - **Database:**
MySQL. - **Version control:** Git and GitHub. - **Deployment:** A
suitable cloud or web hosting service selected during deployment
planning.

Use one consistent stack for the initial version instead of mixing
multiple backend frameworks or databases.

## 9. High-Level Data Entities

- **User:** account credentials, role, and account status.
- **StudentProfile:** academic details, interests, skills, and career
  goals.
- **CareerPath:** course, career, job-role, and skill information.
- **Event:** event details, date, category, and participation
  information.
- **ClubCommittee:** organization details, roles, and responsibilities.
- **Coordinator:** name, role, responsibility area, and approved contact
  details.
- **Resource:** title, provider, topic, cost category, level, and URL.
- **Roadmap:** student-linked plan and year-wise milestones.
- **ProgressRecord:** milestone status, completion date, and notes or
  evidence.
- **ProjectCertification:** student projects, certificates, and
  achievements.
- **Opportunity:** internship, job, training, or competition details.
- **ApplicationRecord:** student-linked application status and updates.
- **Notification:** reminders and platform updates.

These are conceptual entities; exact fields and relationships will be
finalized during database design.

## 10. Functional Requirements

- Users can register, log in, and log out.
- Students can create and update profiles.
- Students can browse and search platform content.
- Students can save resources and track roadmap milestones.
- Students can view events, extracurricular activities, and coordinator
  contacts.
- Students can record placement preparation and application progress.
- Authorized administrators can create, update, and remove managed
  content.
- The dashboard reflects recorded information and progress.

## 11. Non-Functional Requirements

- **Usability:** clear navigation and simple language.
- **Security:** securely hashed passwords and role-based access.
- **Privacy:** collect only necessary student information and restrict
  access to personal records.
- **Reliability:** validate user input and handle errors clearly.
- **Performance:** pages and common actions should respond promptly for
  expected college-project usage.
- **Maintainability:** organized, modular code and documented setup
  instructions.
- **Accessibility:** readable contrast, labels, keyboard-friendly
  controls, and responsive layouts.
- **Data integrity:** validate records and prevent duplicate or
  inconsistent entries where possible.

## 12. Assumptions and Limitations

- College events, resources, and coordinator details must be maintained
  by authorized users.
- External resource availability and fees may change; users should
  confirm details with providers.
- Career suggestions are informational and do not guarantee admission or
  employment.
- Progress indicators depend on the information students record.
- College ERP integrations, automatic verification, and recruiter access
  are outside the initial scope unless separately approved.

## 13. Expected Outcome

Campus to Career will give students one organized place to explore
options, discover college opportunities, find learning resources, follow
a personalized roadmap, track achievements, and prepare for placements.
It aims to reduce confusion and help students make informed decisions
throughout college.
