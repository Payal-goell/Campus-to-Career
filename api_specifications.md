# API Specifications: Campus to Career

## 1. Overview
This document defines the RESTful API endpoints for the **Campus to Career** platform. All protected endpoints require a JWT bearer token passed in the `Authorization` header (`Bearer <token>`).

---

## 2. Authentication & Authorization (`/api/v1/auth`)

### 2.1 Register User
* **Endpoint**: `POST /api/v1/auth/register`
* **Access**: Public
* **Request Body**:
  ```json
  {
    "email": "student@college.edu",
    "password": "SecurePassword123!",
    "role": "STUDENT" // Options: STUDENT, ADMIN, RECRUITER
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "message": "User registered successfully. Verification email sent.",
    "userId": "usr_987654321"
  }
  ```

### 2.2 Verify Email
* **Endpoint**: `POST /api/v1/auth/verify-email`
* **Access**: Public
* **Request Body**:
  ```json
  {
    "token": "verification_token_string"
  }
  ```

### 2.3 Login User
* **Endpoint**: `POST /api/v1/auth/login`
* **Access**: Public
* **Request Body**:
  ```json
  {
    "email": "student@college.edu",
    "password": "SecurePassword123!"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "d2FpdGlu...",
    "user": {
      "id": "usr_987654321",
      "email": "student@college.edu",
      "role": "STUDENT",
      "isOnboarded": false
    }
  }
  ```

---

## 3. Student Onboarding (`/api/v1/onboarding`)

### 3.1 Fetch / Submit Student Details Wizard
* **Endpoint**: `POST /api/v1/onboarding/profile`
* **Access**: Protected (`STUDENT`)
* **Request Body**:
  ```json
  {
    "basicInfo": {
      "fullName": "Alex Rivera",
      "phone": "+1234567890",
      "avatarUrl": "https://storage.provider.com/avatars/alex.jpg"
    },
    "academicDetails": {
      "collegeId": "clg_101",
      "branch": "Computer Science & Engineering",
      "currentYear": 2, // 1, 2, 3, or 4
      "cgpa": 8.5
    },
    "currentSkills": ["JavaScript", "Python", "Data Structures"],
    "careerPreferences": {
      "targetRole": "Full-Stack Developer",
      "preferredDomains": ["Web Development", "AI/ML"]
    },
    "goals": {
      "targetPlacementYear": 2026,
      "primaryGoal": "Land a Tier-1 Software Engineering Internship"
    }
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "message": "Onboarding profile initialized successfully.",
    "initialScore": 68,
    "dashboardUrl": "/api/v1/dashboard/student"
  }
  ```

---

## 4. Student Dashboard & Roadmap (`/api/v1/dashboard`)

### 4.1 Get Dashboard Overview
* **Endpoint**: `GET /api/v1/dashboard/student`
* **Access**: Protected (`STUDENT`)
* **Response (200 OK)**:
  ```json
  {
    "profileCompletion": 92,
    "developmentScore": 74,
    "roadmapProgress": {
      "currentYear": 2,
      "totalMilestones": 8,
      "completedMilestones": 5,
      "progressPercentage": 62.5
    },
    "skillGapAnalysis": [
      { "skill": "System Design", "required": 80, "current": 40 },
      { "skill": "React.js", "required": 85, "current": 75 }
    ],
    "recommendedActions": [
      "Complete Mock Interview #1",
      "Join the Web Development Club"
    ],
    "upcomingEvents": [
      { "id": "evt_01", "title": "Annual Campus Hackathon", "date": "2026-11-15" }
    ]
  }
  ```

### 4.2 Get Year-Wise Roadmap
* **Endpoint**: `GET /api/v1/dashboard/roadmap?year={1|2|3|4}`
* **Access**: Protected (`STUDENT`)
* **Response (200 OK)**:
  ```json
  {
    "year": 2,
    "theme": "Build & Experiment",
    "milestones": [
      { "id": "m_01", "title": "Build Technical Skills", "completed": true },
      { "id": "m_02", "title": "Participate in Hackathons", "completed": true },
      { "id": "m_03", "title": "Earn Mid-Level Certification", "completed": false }
    ]
  }
  ```

---

## 5. Course & Domain Exploration (`/api/v1/explore`)

### 5.1 Explore Courses & Specializations
* **Endpoint**: `GET /api/v1/explore/courses?branch={branch}&interest={interest}`
* **Access**: Protected (`STUDENT`)
* **Response (200 OK)**:
  ```json
  {
    "courses": [
      {
        "id": "crs_401",
        "title": "Advanced Web Architectures",
        "domain": "Full-Stack Web",
        "description": "Comprehensive course covering scalable server setups and frontend performance.",
        "alignmentScore": "95% match with your interests"
      }
    ]
  }
  ```

### 5.2 Select Final Course / Career Specialization
* **Endpoint**: `POST /api/v1/explore/select-path`
* **Access**: Protected (`STUDENT`)
* **Request Body**:
  ```json
  {
    "courseId": "crs_401",
    "targetRole": "Backend Systems Engineer"
  }
  ```

---

## 6. Centralized Resource Manager (`/api/v1/resources`)

### 6.1 List Resources
* **Endpoint**: `GET /api/v1/resources?type={course|youtube|doc|book|practice}&isPaid={true|false}`
* **Access**: Protected (`STUDENT`)
* **Response (200 OK)**:
  ```json
  {
    "total": 24,
    "resources": [
      {
        "id": "res_101",
        "title": "Complete Modern React & Redux",
        "type": "course",
        "isPaid": false,
        "provider": "FreeCodeCamp",
        "url": "https://freecodecamp.org/learn/react",
        "rating": 4.8
      },
      {
        "id": "res_102",
        "title": "System Design Primer",
        "type": "practice",
        "isPaid": false,
        "provider": "GitHub OpenSource",
        "url": "https://github.com/donnemartin/system-design-primer",
        "rating": 4.9
      }
    ]
  }
  ```

---

## 7. Extracurriculars, Clubs & Event Recaps (`/api/v1/extracurriculars`)

### 7.1 Get Clubs, Committees & Event Recaps
* **Endpoint**: `GET /api/v1/extracurriculars/clubs`
* **Access**: Protected (`STUDENT`)
* **Response (200 OK)**:
  ```json
  {
    "clubs": [
      {
        "id": "club_01",
        "name": "Robotics & Innovation Club",
        "category": "Technical",
        "description": "Focuses on IoT, embedded systems, and autonomous robotics.",
        "recentEventRecap": "Organized BotWars 2026 with over 300 active participants.",
        "leadCoordinator": "Jane Doe",
        "joinUrl": "https://college.edu/clubs/robotics"
      }
    ]
  }
  ```

---

## 8. Placement Training & Interview Prep (`/api/v1/placement-training`)

### 8.1 Get Placement Training Modules
* **Endpoint**: `GET /api/v1/placement-training/modules`
* **Access**: Protected (`STUDENT`)
* **Response (200 OK)**:
  ```json
  {
    "categories": [
      {
        "category": "Technical Training",
        "topics": ["Data Structures", "System Design", "SQL & Database Tuning"]
      },
      {
        "category": "Soft Skills & Behavioral",
        "topics": ["STAR Method Communication", "Corporate Etiquette"]
      },
      {
        "category": "Aptitude & Coding",
        "topics": ["Quantitative Reasoning", "Timed Coding Challenges"]
      }
    ]
  }
  ```

### 8.2 Resume ATS Analysis
* **Endpoint**: `POST /api/v1/placement-training/resume/analyze`
* **Access**: Protected (`STUDENT`)
* **Request Body**: Multipart Form-Data (PDF file upload)
* **Response (200 OK)**:
  ```json
  {
    "atsScore": 82,
    "missingKeywords": ["Docker", "Kubernetes", "CI/CD"],
    "suggestions": [
      "Quantify your project results using metrics (e.g., improved load time by 30%)."
    ]
  }
  ```

---

## 9. Student Coordinator Contacts (`/api/v1/coordinators`)

### 9.1 Get Student Coordinators Directory
* **Endpoint**: `GET /api/v1/coordinators`
* **Access**: Protected (`STUDENT`)
* **Response (200 OK)**:
  ```json
  {
    "coordinators": [
      {
        "id": "coord_01",
        "name": "Sarah Connor",
        "department": "Placement Cell - CSE",
        "email": "sarah.c@college.edu",
        "phone": "+1-555-0192",
        "availableHours": "Mon - Fri, 2:00 PM - 5:00 PM"
      }
    ]
  }
  ```

### 9.2 Contact / Query Student Coordinator
* **Endpoint**: `POST /api/v1/coordinators/contact`
* **Access**: Protected (`STUDENT`)
* **Request Body**:
  ```json
  {
    "coordinatorId": "coord_01",
    "subject": "Inquiry regarding upcoming campus placement drive",
    "message": "Hi Sarah, I would like to confirm the eligibility criteria for the XYZ company drive."
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "message": "Message sent successfully to the coordinator.",
    "ticketId": "tkt_55412"
  }
  ```

---

## 10. Admin & College Analytics (`/api/v1/admin`)

### 10.1 Get Overall Student Analytics
* **Endpoint**: `GET /api/v1/admin/analytics/overview`
* **Access**: Protected (`ADMIN`)
* **Response (200 OK)**:
  ```json
  {
    "totalStudents": 1250,
    "activeRoadmapUsers": 1180,
    "averageDevelopmentScore": 76.4,
    "placementStats": {
      "eligible": 450,
      "placed": 320,
      "placementPercentage": 71.1
    }
  }
  ```

### 10.2 Add / Update Resource (Resource Management)
* **Endpoint**: `POST /api/v1/admin/resources`
* **Access**: Protected (`ADMIN`)
* **Request Body**:
  ```json
  {
    "title": "Advanced Algorithmic Thinking",
    "type": "course",
    "isPaid": false,
    "provider": "MIT OpenCourseWare",
    "url": "https://ocw.mit.edu/courses/algorithms"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "message": "Resource successfully added.",
    "resourceId": "res_901"
  }
  ```