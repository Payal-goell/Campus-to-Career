"""
catalog.py  -  the "knowledge base" of the roadmap system.

You edit THIS file (not the ML code) to add roles, skills or steps.
Skill levels everywhere:  0 = none, 1 = basic, 2 = good, 3 = strong
"""

LEVELS = {0: "none", 1: "basic", 2: "good", 3: "strong"}

COURSES = ["CSE", "IT", "ECE", "EE", "ME", "OTHER"]
GOALS = ["product_company", "service_company", "startup", "higher_studies"]

# "extracurricular" is treated like a skill:
#   1 = active in a club, 2 = hackathons / events, 3 = leadership
SKILLS = [
    "programming", "dsa", "web_basics", "fullstack", "sql", "git",
    "statistics", "ml_basics", "system_design", "cloud", "aptitude",
    "communication", "projects", "extracurricular",
]

SKILL_LABELS = {
    "programming": "programming", "dsa": "DSA", "web_basics": "web basics",
    "fullstack": "full-stack development", "sql": "SQL", "git": "Git",
    "statistics": "statistics", "ml_basics": "machine learning",
    "system_design": "system design", "cloud": "cloud", "aptitude": "aptitude",
    "communication": "communication", "projects": "project experience",
    "extracurricular": "extracurricular activity",
}


def _role(label, **levels):
    full = {s: 0 for s in SKILLS}
    full.update(levels)
    return {"label": label, "required": full}


# Level of each skill a student needs for the role (the "role-to-skills table")
ROLES = {
    "sde": _role("Software Engineer (SDE)", programming=3, dsa=3, sql=1, git=2,
                 system_design=2, cloud=1, aptitude=2, communication=2,
                 projects=2, extracurricular=1),
    "web_dev": _role("Web Developer", programming=2, dsa=2, web_basics=3,
                     fullstack=3, sql=2, git=2, cloud=1, aptitude=1,
                     communication=2, projects=2, extracurricular=1),
    "data_analyst": _role("Data Analyst", programming=2, dsa=1, sql=3,
                          statistics=3, ml_basics=1, git=1, aptitude=2,
                          communication=3, projects=2, extracurricular=1),
    "ml_engineer": _role("ML Engineer", programming=3, dsa=2, sql=2, git=2,
                         statistics=3, ml_basics=3, cloud=1, aptitude=2,
                         communication=2, projects=2, extracurricular=1),
    "cloud_devops": _role("Cloud / DevOps Engineer", programming=2, dsa=1,
                          sql=1, git=3, system_design=1, cloud=3, aptitude=1,
                          communication=2, projects=2, extracurricular=1),
}

# The goal changes how hard each skill must be (only applied if role needs it)
GOAL_ADJUST = {
    "product_company": {"dsa": +1, "system_design": +1},
    "service_company": {"aptitude": +1, "dsa": -1},
    "startup": {"fullstack": +1, "projects": +1, "extracurricular": +1},
    "higher_studies": {"aptitude": +1, "statistics": +1, "dsa": -1},
}


def _m(id, title, skill, to_level, prereqs, hours, why, stage=None):
    return {
        "id": id, "title": title, "skill": skill, "to_level": to_level,
        "prereqs": prereqs, "hours": hours, "why": why,
        "stage": stage if stage is not None else (to_level or 3),
    }


# ----------------------------------------------------------------------
# MILESTONE CATALOG  (the ONLY steps the model is allowed to recommend)
# skill=None  -> special step decided by time left / readiness
# ----------------------------------------------------------------------
MILESTONES = [
    # programming
    _m("prog_basics", "Learn programming basics (Python or C++)", "programming", 1, [], 40,
       "Every technical role starts here: variables, loops, functions."),
    _m("prog_intermediate", "Programming: OOP, files, libraries, debugging", "programming", 2, ["prog_basics"], 60,
       "You need to write real programs, not just small exercises."),
    _m("prog_advanced", "Programming: clean code, testing, one language in depth", "programming", 3, ["prog_intermediate"], 60,
       "Interviews and jobs expect strong command of one language."),
    # DSA
    _m("dsa_basics", "DSA basics: arrays, strings, recursion, complexity", "dsa", 1, ["prog_basics"], 50,
       "Problem-solving is the base of every coding round."),
    _m("dsa_practice", "DSA: stacks, trees, graphs, sorting - solve 100+ problems", "dsa", 2, ["dsa_basics", "prog_intermediate"], 100,
       "Most companies test these topics in online assessments."),
    _m("dsa_advanced", "DSA: dynamic programming, hard problems, contests", "dsa", 3, ["dsa_practice"], 120,
       "Product companies ask medium-to-hard problems."),
    # web
    _m("web_html_css", "HTML and CSS: build 3 static pages", "web_basics", 1, [], 30,
       "The foundation of anything shown in a browser."),
    _m("web_javascript", "JavaScript and DOM: build interactive pages", "web_basics", 2, ["web_html_css", "prog_basics"], 40,
       "Makes your pages dynamic; required before any framework."),
    _m("web_frontend_framework", "React: build a component-based app", "web_basics", 3, ["web_javascript"], 50,
       "Most web jobs ask for React or a similar framework."),
    # full-stack
    _m("fs_backend_basics", "Backend basics: Node.js/Express or Flask", "fullstack", 1, ["web_javascript"], 45,
       "Your app needs a server that handles requests."),
    _m("fs_rest_api_db", "Build REST APIs with a database and login", "fullstack", 2, ["fs_backend_basics", "sql_basics"], 60,
       "Real apps store data and have users."),
    _m("fs_deploy_app", "Deploy a full-stack app live (Vercel/Render)", "fullstack", 3, ["fs_rest_api_db", "git_basics"], 40,
       "A live demo link is far stronger than code on a laptop."),
    # SQL
    _m("sql_basics", "SQL basics: SELECT, WHERE, GROUP BY", "sql", 1, [], 25,
       "Almost every role uses databases."),
    _m("sql_joins", "SQL: joins, subqueries, window functions", "sql", 2, ["sql_basics"], 35,
       "Joins are asked in most interviews."),
    _m("sql_advanced", "SQL: query optimization and real datasets", "sql", 3, ["sql_joins"], 40,
       "Needed for analyst and data-heavy roles."),
    # git
    _m("git_basics", "Git and GitHub basics: commit, push, branch", "git", 1, [], 10,
       "Every team uses version control."),
    _m("git_collab", "Git: pull requests, merge conflicts, open-source contribution", "git", 2, ["git_basics"], 15,
       "Shows you can work in a team."),
    _m("git_ci", "Git workflows and CI pipelines (GitHub Actions)", "git", 3, ["git_collab"], 25,
       "Core skill for DevOps roles."),
    # statistics
    _m("stats_basics", "Statistics basics: mean, variance, probability", "statistics", 1, [], 40,
       "The language of data and ML."),
    _m("stats_inference", "Statistics: distributions, hypothesis tests", "statistics", 2, ["stats_basics"], 50,
       "Needed to draw correct conclusions from data."),
    _m("stats_applied", "Applied statistics and A/B testing on real data", "statistics", 3, ["stats_inference"], 50,
       "Analyst roles are judged on this."),
    # ML
    _m("ml_intro", "Machine learning intro: regression, classification", "ml_basics", 1, ["prog_intermediate", "stats_basics"], 50,
       "First step into ML."),
    _m("ml_models", "ML models: trees, SVM, evaluation, scikit-learn", "ml_basics", 2, ["ml_intro"], 70,
       "You must be able to train and evaluate models."),
    _m("ml_pipeline", "End-to-end ML project: data to deployed model", "ml_basics", 3, ["ml_models", "stats_inference"], 80,
       "ML jobs value complete projects over theory."),
    # system design
    _m("sd_basics", "System design basics: client-server, databases, APIs", "system_design", 1, ["prog_intermediate", "sql_basics"], 40,
       "You need the vocabulary before the case studies."),
    _m("sd_core", "System design: caching, load balancing, scaling", "system_design", 2, ["sd_basics", "dsa_practice"], 60,
       "Asked in interviews for experienced candidates."),
    _m("sd_cases", "System design case studies (URL shortener, chat app)", "system_design", 3, ["sd_core"], 60,
       "Product-company interviews include design rounds."),
    # cloud
    _m("cloud_basics", "Cloud basics: compute, storage, networking", "cloud", 1, ["prog_basics"], 30,
       "Most software now runs on the cloud."),
    _m("cloud_cert", "Earn a cloud certification (AWS/Azure/GCP fundamentals)", "cloud", 2, ["cloud_basics"], 50,
       "A certificate is verifiable proof for your resume."),
    _m("cloud_devops_tools", "Docker, Kubernetes and Linux for deployment", "cloud", 3, ["cloud_cert", "git_collab"], 60,
       "Core daily tools for DevOps roles."),
    # aptitude
    _m("apt_basics", "Aptitude basics: percentages, ratios, time and work", "aptitude", 1, [], 30,
       "First round of most campus drives."),
    _m("apt_practice", "Aptitude + logical reasoning practice sets", "aptitude", 2, ["apt_basics"], 50,
       "Speed and accuracy decide cut-offs."),
    _m("apt_mocks", "Full-length aptitude mock tests", "aptitude", 3, ["apt_practice"], 40,
       "Builds exam stamina and time management."),
    # communication
    _m("comm_basics", "Communication basics: speaking and email writing", "communication", 1, [], 20,
       "You will explain your work to others every day."),
    _m("comm_gd_hr", "Group discussion and HR interview practice", "communication", 2, ["comm_basics"], 30,
       "Many campus drives have GD and HR rounds."),
    _m("comm_present", "Present a project demo in front of an audience", "communication", 3, ["comm_gd_hr"], 30,
       "Confident presentation sets you apart."),
    # projects
    _m("project_mini", "Build one mini project and put it on GitHub", "projects", 1, ["prog_basics"], 40,
       "Proof that you can build things."),
    _m("project_major", "Build a major project with real users or real data", "projects", 2, ["project_mini", "prog_intermediate"], 80,
       "Recruiters ask about projects in almost every interview."),
    _m("project_capstone", "Build a capstone project with live demo and write-up", "projects", 3, ["project_major", "git_collab"], 120,
       "A polished flagship project can carry your resume."),
    # extracurricular
    _m("join_club", "Join a technical club or committee", "extracurricular", 1, [], 10,
       "Peers, mentors and early exposure."),
    _m("hackathon", "Take part in a hackathon", "extracurricular", 2, ["join_club"], 30,
       "Teamwork under pressure, plus a story for interviews."),
    _m("lead_event", "Lead or organise a campus event", "extracurricular", 3, ["hackathon"], 30,
       "Shows leadership and ownership."),
    # special steps (decided by time left / readiness / goal)
    _m("resume_ats", "Build an ATS-friendly resume and LinkedIn profile", None, None, [], 15,
       "Your resume decides if you even get a first call.", stage=3),
    _m("internship", "Apply for a summer internship", None, None, ["prog_intermediate", "resume_ats"], 80,
       "Internships are the strongest route to full-time offers.", stage=4),
    _m("mock_interviews", "Give mock technical and HR interviews", None, None, ["resume_ats"], 40,
       "Practice under real conditions before the real thing.", stage=4),
    _m("placement_applications", "Track and apply to company drives", None, None, ["mock_interviews", "resume_ats"], 30,
       "Placement season is the time to apply widely.", stage=5),
    _m("higher_studies_prep", "Prepare for higher-studies exams (GATE/GRE) and applications", None, None, [], 100,
       "Your goal is higher studies, so exam preparation starts early.", stage=4),
]
