"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Users,
  Search,
  TrendingUp,
  Award,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Filter,
  RefreshCw,
  MessageSquare,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { toast } from "@/components/ui/Toast";

interface StudentRow {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  branch: string;
  currentYear: number;
  cgpa: number | null;
  targetRole: string | null;
  developmentScore: number;
  profileCompletion: number;
  primaryGoal: string | null;
  careerGoal: string | null;
  skills: string[];
  isPlacementEligible: boolean;
  placementStatus: string;
}

interface StudentsResponse {
  success: boolean;
  students: StudentRow[];
  total: number;
  page: number;
  totalPages: number;
}

const BRANCH_OPTIONS = [
  "All Branches",
  "Computer Science & Engineering",
  "Information Technology",
  "Artificial Intelligence & Data Science",
  "Electronics & Communication Engineering",
  "Electrical Engineering",
  "Civil Engineering",
  "Mechanical Engineering",
];

const YEAR_OPTIONS = [
  { label: "All Years", value: "" },
  { label: "Year 1", value: "1" },
  { label: "Year 2", value: "2" },
  { label: "Year 3", value: "3" },
  { label: "Year 4", value: "4" },
];

function PlacementBadge({ status }: { status: string }) {
  if (status === "ELIGIBLE")
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
        <CheckCircle2 className="w-3 h-3" /> Eligible
      </span>
    );
  if (status === "INELIGIBLE")
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30">
        <AlertTriangle className="w-3 h-3" /> Ineligible
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
      <Clock className="w-3 h-3" /> Too early
    </span>
  );
}

export default function CoordinatorPortalPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [data, setData] = useState<StudentsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("All Branches");
  const [selectedYear, setSelectedYear] = useState("");
  const [page, setPage] = useState(1);

  // Redirect if not coordinator/admin
  useEffect(() => {
    if (!authLoading && (!user || (user.role !== "COORDINATOR" && user.role !== "ADMIN"))) {
      router.replace("/login?next=/coordinator-portal");
    }
  }, [user, authLoading, router]);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (search) params.set("search", search);
      if (selectedBranch !== "All Branches") params.set("branch", selectedBranch);
      if (selectedYear) params.set("year", selectedYear);

      const res = await fetch(`/api/v1/coordinator/students?${params}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) setData(json);
      }
    } catch (e) {
      console.error(e);
      toast.error("Could not load students", "Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [page, search, selectedBranch, selectedYear]);

  useEffect(() => {
    if (user && (user.role === "COORDINATOR" || user.role === "ADMIN")) {
      fetchStudents();
    }
  }, [user, fetchStudents]);

  // Derived stats from loaded students
  const stats = data
    ? {
        total: data.total,
        eligible: data.students.filter((s) => s.isPlacementEligible).length,
        avgScore:
          data.students.length > 0
            ? Math.round(
                data.students.reduce((sum, s) => sum + s.developmentScore, 0) /
                  data.students.length
              )
            : 0,
        onboarded: data.students.filter((s) => s.profileCompletion > 0).length,
      }
    : null;

  const isGuardPending = authLoading || !user || (user.role !== "COORDINATOR" && user.role !== "ADMIN");
  if (isGuardPending) {
    return (
      <div className="py-20 text-center text-xs text-[var(--color-text-muted)]">
        Verifying access…
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <Card
        variant="raised"
        className="p-6 sm:p-8 border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/90 backdrop-blur-xl shadow-xl"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="primary" size="sm">Placement Coordinator Portal</Badge>
              <span className="text-xs text-[var(--color-text-secondary)]">
                {user.name || user.email}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[var(--color-text-primary)] tracking-tight">
              Student Management
            </h1>
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1.5 max-w-2xl leading-relaxed">
              View all student profiles, track placement eligibility, development scores, and skill progress. Filter by branch or year.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchStudents}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Refresh
          </Button>
        </div>
      </Card>

      {/* KPI Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card variant="stat" className="p-5">
            <div className="flex items-center justify-between text-[var(--color-text-muted)] text-xs mb-2">
              <span>Total Students</span>
              <Users className="w-4 h-4 text-[var(--color-brand-primary)]" />
            </div>
            <div className="text-3xl font-black text-[var(--color-text-primary)] font-mono">
              {data?.total ?? "—"}
            </div>
            <span className="text-[11px] text-[var(--color-text-muted)]">Platform enrolments</span>
          </Card>

          <Card variant="stat" className="p-5">
            <div className="flex items-center justify-between text-[var(--color-text-muted)] text-xs mb-2">
              <span>Placement Eligible</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-3xl font-black text-emerald-500 font-mono">
              {stats.eligible}
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400">
              CGPA ≥ 6.0 and Year 3+
            </span>
          </Card>

          <Card variant="stat" className="p-5">
            <div className="flex items-center justify-between text-[var(--color-text-muted)] text-xs mb-2">
              <span>Avg Dev. Score</span>
              <Award className="w-4 h-4 text-fuchsia-500" />
            </div>
            <div className="text-3xl font-black text-fuchsia-500 font-mono">
              {stats.avgScore}
            </div>
            <span className="text-[11px] text-[var(--color-text-muted)]">Out of 100</span>
          </Card>

          <Card variant="stat" className="p-5">
            <div className="flex items-center justify-between text-[var(--color-text-muted)] text-xs mb-2">
              <span>Profiles Filled</span>
              <BookOpen className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-3xl font-black text-amber-500 font-mono">
              {stats.onboarded}
            </div>
            <span className="text-[11px] text-[var(--color-text-muted)]">Onboarding complete</span>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card variant="default" className="p-4 sm:p-5 flex flex-col sm:flex-row gap-3 items-start sm:items-end">
        <div className="flex-1 min-w-0">
          <Input
            placeholder="Search by name, email, branch, or target role…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] block">
              Branch
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => {
                setSelectedBranch(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-2 text-xs text-[var(--color-text-primary)] focus:border-[var(--color-border-focus)] outline-none"
            >
              {BRANCH_OPTIONS.map((b) => (
                <option key={b} value={b}>
                  {b === "All Branches" ? b : b.split(" ").slice(0, 2).join(" ")}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] block">
              Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-2 text-xs text-[var(--color-text-primary)] focus:border-[var(--color-border-focus)] outline-none"
            >
              {YEAR_OPTIONS.map((y) => (
                <option key={y.value} value={y.value}>
                  {y.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSearch("");
                setSelectedBranch("All Branches");
                setSelectedYear("");
                setPage(1);
              }}
              leftIcon={<Filter className="w-3.5 h-3.5" />}
            >
              Clear
            </Button>
          </div>
        </div>
      </Card>

      {/* Student Table */}
      <Card variant="default" className="p-0 overflow-hidden">
        <div className="p-5 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[var(--color-brand-primary)]" />
            <h2 className="text-sm font-bold text-[var(--color-text-primary)]">Student Profiles</h2>
            {data && (
              <span className="text-[11px] text-[var(--color-text-muted)]">
                {data.total} total · page {data.page} of {data.totalPages}
              </span>
            )}
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-[var(--color-text-muted)]">
            Loading student profiles…
          </div>
        ) : !data || data.students.length === 0 ? (
          <div className="py-16 text-center text-xs text-[var(--color-text-muted)]">
            No students match the current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)]">
                  {["Student", "Branch / Year", "CGPA", "Dev. Score", "Target Role", "Skills", "Placement"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-subtle)]">
                {data.students.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-[var(--color-surface-raised)] transition-colors"
                  >
                    {/* Name + Email */}
                    <td className="px-4 py-3 min-w-[160px]">
                      <div className="font-semibold text-[var(--color-text-primary)] truncate max-w-[140px]">
                        {student.fullName}
                      </div>
                      <div className="text-[10px] text-[var(--color-text-muted)] truncate max-w-[140px]">
                        {student.email}
                      </div>
                    </td>

                    {/* Branch / Year */}
                    <td className="px-4 py-3 min-w-[140px]">
                      <div className="text-[var(--color-text-secondary)] truncate max-w-[130px]">
                        {student.branch.split(" ").slice(0, 3).join(" ")}
                      </div>
                      <div className="text-[10px] text-[var(--color-text-muted)]">
                        Year {student.currentYear}
                      </div>
                    </td>

                    {/* CGPA */}
                    <td className="px-4 py-3">
                      <span
                        className={`font-mono font-bold ${
                          (student.cgpa ?? 0) >= 8
                            ? "text-emerald-500"
                            : (student.cgpa ?? 0) >= 6
                              ? "text-amber-500"
                              : "text-red-500"
                        }`}
                      >
                        {student.cgpa != null ? student.cgpa.toFixed(1) : "—"}
                      </span>
                    </td>

                    {/* Dev Score */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-16 h-1.5 rounded-full bg-[var(--color-surface-overlay)] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)]"
                            style={{ width: `${student.developmentScore}%` }}
                          />
                        </div>
                        <span className="font-mono text-[var(--color-text-primary)] text-[11px]">
                          {student.developmentScore}
                        </span>
                      </div>
                    </td>

                    {/* Target Role */}
                    <td className="px-4 py-3 min-w-[140px]">
                      <span className="text-[var(--color-text-secondary)] truncate block max-w-[130px]">
                        {student.targetRole || (
                          <span className="text-[var(--color-text-muted)]">Not set</span>
                        )}
                      </span>
                    </td>

                    {/* Skills count */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400" />
                        <span className="text-[var(--color-text-secondary)]">
                          {student.skills.length}
                        </span>
                      </div>
                      <div className="text-[10px] text-[var(--color-text-muted)]">skills</div>
                    </td>

                    {/* Placement status */}
                    <td className="px-4 py-3">
                      <PlacementBadge status={student.placementStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="p-4 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
            <Button
              size="sm"
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <span className="text-xs text-[var(--color-text-muted)]">
              Page {page} of {data.totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={page >= data.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </Card>

      {/* Inquiry Desk Link */}
      <Card variant="default" className="p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--color-text-primary)]">Student Inquiry Desk</h3>
            <p className="text-xs text-[var(--color-text-secondary)]">
              View tickets submitted by students and monitor overall engagement stats in the Admin Portal.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/admin")}
          leftIcon={<TrendingUp className="w-4 h-4" />}
        >
          Open Admin Portal
        </Button>
      </Card>
    </div>
  );
}
