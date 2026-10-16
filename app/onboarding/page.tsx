"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  GraduationCap,
  User,
  BookOpen,
  Code,
  Target,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/Progress";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { useRoadmapOptional } from "@/context/RoadmapContext";
import {
  DOMAINS as ROADMAP_DOMAINS,
  TALENT_INTERESTS,
  coerceDomain,
  coerceYear,
  parseWeeklyHours,
  skillsFromNames,
  type TalentInterest,
} from "@/lib/roadmap";

const COMMON_SKILLS = [
  "JavaScript",
  "TypeScript",
  "React.js",
  "Node.js",
  "Python",
  "C++",
  "Java",
  "Data Structures & Algorithms",
  "SQL",
  "PostgreSQL",
  "Docker",
  "System Design",
  "Git",
  "Machine Learning",
  "Cloud / AWS",
  "Communication & Leadership",
];

const TARGET_ROLES = [
  "Full-Stack Software Engineer",
  "Backend Systems Engineer",
  "Cloud & DevOps Engineer",
  "AI / Machine Learning Engineer",
  "Data Analyst / Data Scientist",
  "Cybersecurity Specialist",
  "Product Manager / Tech Consultant",
];

const DOMAINS = [...ROADMAP_DOMAINS];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const roadmap = useRoadmapOptional();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [calculatedScore, setCalculatedScore] = useState<number | null>(null);

  // Form State
  const [fullName, setFullName] = useState(user?.name || "");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
  );

  const [branch, setBranch] = useState("Computer Science & Engineering");
  const [currentYear, setCurrentYear] = useState(1);
  const [collegeName, setCollegeName] = useState("University Institute of Technology, RGPV, Bhopal");
  const [cgpa, setCgpa] = useState("8.5");

  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    "JavaScript",
    "React.js",
    "Data Structures & Algorithms",
  ]);
  const [customSkill, setCustomSkill] = useState("");

  const [targetRole, setTargetRole] = useState("Full-Stack Software Engineer");
  const [preferredDomains, setPreferredDomains] = useState<string[]>(["Web Development"]);
  const [talentInterests, setTalentInterests] = useState<TalentInterest[]>(["Dance"]);

  const [targetPlacementYear, setTargetPlacementYear] = useState("2026");
  const [primaryGoal, setPrimaryGoal] = useState(
    "Secure a product-company SDE internship (Bengaluru / Hyderabad / Pune) or TCS Digital / GATE path"
  );
  const [hoursPerWeek, setHoursPerWeek] = useState("10-15 hours");
  const [confidence, setConfidence] = useState("Building");

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const addCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills([...selectedSkills, customSkill.trim()]);
      setCustomSkill("");
    }
  };

  const toggleDomain = (dom: string) => {
    if (preferredDomains.includes(dom)) {
      setPreferredDomains(preferredDomains.filter((d) => d !== dom));
    } else {
      setPreferredDomains([...preferredDomains, dom]);
    }
  };

  const persistRoadmapProfile = () => {
    const profile = {
      branch,
      currentYear: coerceYear(Number(currentYear)),
      skills: skillsFromNames(selectedSkills, 1),
      interestDomains: preferredDomains.map((d) => coerceDomain(d)),
      talentInterests,
      targetRole,
      weeklyHours: parseWeeklyHours(hoursPerWeek),
      completedNodeIds: [] as string[],
      isPersonalized: true,
    };
    roadmap?.saveProfile(profile, { reveal: true });
  };

  const handleSubmitOnboarding = async () => {
    setLoading(true);
    persistRoadmapProfile();
    try {
      const payload = {
        basicInfo: {
          fullName,
          phone,
          avatarUrl,
        },
        academicDetails: {
          collegeId: "clg_101",
          collegeName,
          branch,
          currentYear: Number(currentYear),
          cgpa: cgpa ? parseFloat(cgpa) : undefined,
        },
        currentSkills: selectedSkills,
        careerPreferences: {
          targetRole,
          preferredDomains,
        },
        goals: {
          targetPlacementYear: parseInt(targetPlacementYear, 10),
          primaryGoal,
        },
      };

      const res = await fetch("/api/v1/onboarding/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setCalculatedScore(data.initialScore || 72);
        await refreshUser();
      } else {
        setCalculatedScore(72);
      }
      setCurrentStep(7);
    } catch (e) {
      console.error(e);
      setCalculatedScore(72);
      setCurrentStep(7);
    } finally {
      setLoading(false);
    }
  };

  const totalSteps = 6;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 space-y-8">
      {/* Wizard Header */}
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] p-3 mx-auto flex items-center justify-center shadow-lg shadow-[var(--color-brand-primary)]/20">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[var(--color-text-primary)] tracking-tight">
          Student Profile Onboarding Wizard
        </h1>
        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
          Personalize your year-wise roadmap, skill gap analysis, and placement tracking
        </p>

        {/* Step Progression Bar */}
        {currentStep <= 6 && (
          <div className="max-w-md mx-auto pt-3 space-y-2">
            <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] font-medium">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round((currentStep / totalSteps) * 100)}% Completed</span>
            </div>
            <ProgressBar value={(currentStep / totalSteps) * 100} size="sm" />
          </div>
        )}
      </div>

      {/* Step Panels */}
      <Card variant="raised" className="p-6 sm:p-8 border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/90 backdrop-blur-xl shadow-xl">
        <AnimatePresence mode="wait">
          {/* STEP 1: Basic Info */}
          {currentStep === 1 && (
            <motion.div key="step-1" variants={fadeUp} initial="hidden" animate="visible" exit="hidden" className="space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-[var(--color-border-subtle)]">
                <div className="p-2.5 rounded-xl bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[var(--color-text-primary)]">1. Basic & Contact Information</h2>
                  <p className="text-xs text-[var(--color-text-secondary)]">Tell us your name and student contact info.</p>
                </div>
              </div>

              <div className="space-y-4">
                <Input
                  label="Full Name *"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <Input
                  label="Phone Number"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <Input
                  label="Profile Avatar URL"
                  type="url"
                  placeholder="https://..."
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="button"
                  variant="gradient"
                  onClick={() => setCurrentStep(2)}
                  disabled={!fullName.trim()}
                >
                  Next: Academic Details
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Academic Details */}
          {currentStep === 2 && (
            <motion.div key="step-2" variants={fadeUp} initial="hidden" animate="visible" exit="hidden" className="space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-[var(--color-border-subtle)]">
                <div className="p-2.5 rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[var(--color-text-primary)]">2. Academic & University Standing</h2>
                  <p className="text-xs text-[var(--color-text-secondary)]">Your current year dictates your personalized roadmap focus.</p>
                </div>
              </div>

              <div className="space-y-4">
                <Input
                  label="College / University Name"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                />

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] block">
                    Engineering Branch / Major
                  </label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3.5 py-2.5 text-xs text-[var(--color-text-primary)] focus:border-[var(--color-border-focus)] outline-none"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering (CSE)</option>
                    <option value="Information Technology">Information Technology (IT)</option>
                    <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science</option>
                    <option value="Electronics & Communication Engineering">Electronics & Communication (ECE)</option>
                    <option value="Electrical Engineering">Electrical Engineering (EE)</option>
                    <option value="Civil Engineering">Civil Engineering (CE)</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] block">
                      Current Academic Year *
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 4].map((yr) => (
                        <button
                          key={yr}
                          type="button"
                          onClick={() => setCurrentYear(yr)}
                          className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                            currentYear === yr
                              ? "bg-[var(--color-brand-primary)]/15 border-[var(--color-brand-primary)] text-[var(--color-brand-primary)]"
                              : "bg-[var(--color-surface-raised)] border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                          }`}
                        >
                          Yr {yr}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Input
                    label="Cumulative CGPA (Out of 10)"
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={cgpa}
                    onChange={(e) => setCgpa(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={() => setCurrentStep(1)}>
                  <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
                </Button>
                <Button type="button" variant="gradient" onClick={() => setCurrentStep(3)}>
                  Next: Current Skills
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Current Skills */}
          {currentStep === 3 && (
            <motion.div key="step-3" variants={fadeUp} initial="hidden" animate="visible" exit="hidden" className="space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-[var(--color-border-subtle)]">
                <div className="p-2.5 rounded-xl bg-[var(--color-brand-secondary)]/10 text-[var(--color-brand-secondary)]">
                  <Code className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[var(--color-text-primary)]">3. Technical & Professional Skills</h2>
                  <p className="text-xs text-[var(--color-text-secondary)]">Select what you already know or have studied.</p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] block">
                  Click to add / remove skills ({selectedSkills.length} selected):
                </label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_SKILLS.map((sk) => {
                    const isSelected = selectedSkills.includes(sk);
                    return (
                      <button
                        key={sk}
                        type="button"
                        onClick={() => toggleSkill(sk)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                          isSelected
                            ? "bg-[var(--color-brand-primary)] text-white border-[var(--color-brand-primary)] shadow-sm"
                            : "bg-[var(--color-surface-raised)] text-[var(--color-text-secondary)] border-[var(--color-border-subtle)] hover:border-[var(--color-border-default)]"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {sk}
                      </button>
                    );
                  })}
                </div>

                {/* Add custom skill input */}
                <div className="flex gap-2 pt-2">
                  <Input
                    placeholder="Add custom skill (e.g. Next.js, Flutter, AWS)..."
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                  />
                  <Button type="button" variant="secondary" onClick={addCustomSkill}>
                    Add
                  </Button>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={() => setCurrentStep(2)}>
                  <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
                </Button>
                <Button type="button" variant="gradient" onClick={() => setCurrentStep(4)}>
                  Next: Career Goals
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Career Preferences */}
          {currentStep === 4 && (
            <motion.div key="step-4" variants={fadeUp} initial="hidden" animate="visible" exit="hidden" className="space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-[var(--color-border-subtle)]">
                <div className="p-2.5 rounded-xl bg-fuchsia-500/10 text-fuchsia-500">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[var(--color-text-primary)]">4. Target Roles & Preferred Domains</h2>
                  <p className="text-xs text-[var(--color-text-secondary)]">We benchmark your skill gap analysis against this target role.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] block">
                    Primary Target Job Role *
                  </label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3.5 py-2.5 text-xs text-[var(--color-text-primary)] focus:border-[var(--color-border-focus)] outline-none"
                  >
                    {TARGET_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] block">
                    Domains of Interest (Choose 1 or more):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {DOMAINS.map((dom) => {
                      const isSelected = preferredDomains.includes(dom);
                      return (
                        <button
                          key={dom}
                          type="button"
                          onClick={() => toggleDomain(dom)}
                          className={`p-2.5 rounded-xl text-left text-xs font-medium border transition-all ${
                            isSelected
                              ? "bg-[var(--color-brand-primary)]/15 border-[var(--color-brand-primary)] text-[var(--color-brand-primary)] shadow-sm"
                              : "bg-[var(--color-surface-raised)] border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                          }`}
                        >
                          {isSelected ? "✓ " : ""}
                          {dom}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] block">
                    Extracurricular / talent interests
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {TALENT_INTERESTS.map((t) => {
                      const isSelected = talentInterests.includes(t);
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() =>
                            setTalentInterests((prev) =>
                              prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
                            )
                          }
                          className={`p-2.5 rounded-xl text-left text-xs font-medium border min-h-11 ${
                            isSelected
                              ? "bg-[var(--primary-subtle)] border-[var(--primary)] text-[var(--primary)]"
                              : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)]"
                          }`}
                        >
                          {isSelected ? "✓ " : ""}
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={() => setCurrentStep(3)}>
                  <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
                </Button>
                <Button type="button" variant="gradient" onClick={() => setCurrentStep(5)}>
                  Next: Goals
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: Goals */}
          {currentStep === 5 && (
            <motion.div key="step-5" variants={fadeUp} initial="hidden" animate="visible" exit="hidden" className="space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-[var(--color-border-subtle)]">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[var(--color-text-primary)]">5. Goals</h2>
                  <p className="text-xs text-[var(--color-text-secondary)]">Set the milestone your year-wise journey should aim at.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] block">
                    Primary Career Milestone / Goal *
                  </label>
                  <textarea
                    rows={2}
                    value={primaryGoal}
                    onChange={(e) => setPrimaryGoal(e.target.value)}
                    className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3.5 py-2.5 text-xs text-[var(--color-text-primary)] focus:border-[var(--color-border-focus)] outline-none"
                  />
                </div>
                <Input
                  label="Target Placement Year"
                  type="number"
                  value={targetPlacementYear}
                  onChange={(e) => setTargetPlacementYear(e.target.value)}
                />
              </div>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={() => setCurrentStep(4)}>
                  <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
                </Button>
                <Button type="button" variant="gradient" onClick={() => setCurrentStep(6)}>
                  Next: Self Assessment
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 6: Self Assessment */}
          {currentStep === 6 && (
            <motion.div key="step-6" variants={fadeUp} initial="hidden" animate="visible" exit="hidden" className="space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-[var(--color-border-subtle)]">
                <div className="p-2.5 rounded-xl bg-[var(--primary-subtle)] text-[var(--primary)]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[var(--color-text-primary)]">6. Self Assessment</h2>
                  <p className="text-xs text-[var(--color-text-secondary)]">Baseline effort and confidence used to generate your first profile.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] block">
                    Weekly Commitment
                  </label>
                  <select
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(e.target.value)}
                    className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3.5 py-2.5 text-xs text-[var(--color-text-primary)] focus:border-[var(--color-border-focus)] outline-none"
                  >
                    <option value="5-10 hours">5 - 10 hours / week</option>
                    <option value="10-15 hours">10 - 15 hours / week</option>
                    <option value="15-20 hours">15 - 20 hours / week</option>
                    <option value="20+ hours">20+ hours (Intensive)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] block">
                    Current placement confidence
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {["Exploring", "Building", "Interview-ready"].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setConfidence(level)}
                        className={`p-2.5 rounded-xl text-xs font-medium border ${
                          confidence === level
                            ? "bg-[var(--primary-subtle)] border-[var(--primary)] text-[var(--primary)]"
                            : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)]"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={() => setCurrentStep(5)}>
                  <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
                </Button>
                <Button
                  type="button"
                  variant="gradient"
                  onClick={handleSubmitOnboarding}
                  loading={loading}
                >
                  Generate initial profile
                  <Sparkles className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 7: Generated Profile */}
          {currentStep === 7 && (
            <motion.div key="step-6" variants={fadeUp} initial="hidden" animate="visible" exit="hidden" className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <Badge variant="success" size="sm" className="mx-auto">
                  Onboarding Complete!
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] tracking-tight">
                  Your roadmap is ready
                </h2>
                <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
                  Personalized Year {currentYear} path for {targetRole}, including talent tracks: {talentInterests.join(", ") || "Explorer"}.
                </p>
              </div>

              {/* Score Highlight Card */}
              <div className="max-w-sm mx-auto rounded-2xl p-6 border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)] space-y-3">
                <span className="text-xs text-[var(--color-text-muted)] font-medium">Initial Calculated Development Score</span>
                <div className="text-4xl font-black text-[var(--color-brand-primary)] font-mono">
                  {calculatedScore} / 100
                </div>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Targeting: <strong className="text-[var(--color-text-primary)]">{targetRole}</strong>
                </p>
              </div>

              <div className="pt-2">
                <Button
                  type="button"
                  variant="gradient"
                  size="lg"
                  onClick={() => router.push("/roadmap")}
                  className="shadow-lg shadow-[var(--glow-primary)]"
                >
                  Open my pictorial roadmap
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}
