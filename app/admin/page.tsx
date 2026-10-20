"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Shield,
  Users,
  Award,
  TrendingUp,
  Plus,
  Trash2,
  CheckCircle,
  ExternalLink,
  MessageSquare,
  BookOpen,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { toast } from "@/components/ui/Toast";

interface AdminAnalytics {
  totalStudents: number;
  activeRoadmapUsers: number;
  averageDevelopmentScore: number;
  placementStats: {
    eligible: number;
    placed: number;
    placementPercentage: number;
  };
  recentInquiries: Array<{
    id: string;
    ticketId: string;
    subject: string;
    message: string;
    status: string;
    studentName: string;
    coordinatorName: string;
    date: string;
  }>;
}

export default function AdminPortalPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  // New resource form state
  const [title, setTitle] = useState("");
  const [type, setType] = useState("course");
  const [isPaid, setIsPaid] = useState(false);
  const [provider, setProvider] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("Web Development");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [savingResource, setSavingResource] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace("/login?next=/admin");
        return;
      }
    }
    fetchAnalytics();
  }, [user, authLoading, router]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/admin/analytics/overview");
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setAnalytics(json);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !provider || !url) return;

    setSavingResource(true);
    try {
      const res = await fetch("/api/v1/admin/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          type,
          isPaid,
          provider,
          url,
          category,
          description: description || "High quality vetted learning resource.",
          level,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Resource "${title}" published to catalog successfully!`);
        toast.success("Resource published", `"${title}" is now active in the student directory.`);
        setTitle("");
        setProvider("");
        setUrl("");
        setDescription("");
        setTimeout(() => setSuccessMsg(""), 4000);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to publish resource", "Please review inputs and retry.");
    } finally {
      setSavingResource(false);
    }
  };

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <Card variant="raised" className="p-6 sm:p-8 border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/90 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <Badge variant="danger" size="sm">
              University Management & Reports
            </Badge>
            <span className="text-xs text-[var(--color-text-secondary)]">
              Logged in as: <strong className="text-[var(--color-text-primary)]">{user?.name || user?.email}</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--color-text-primary)] tracking-tight">
            College Administration & Analytics Portal
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1.5 max-w-2xl leading-relaxed">
            Oversee university cohort metrics, publish curated learning resources with Free/Paid designations, and review active student inquiries.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {['Manage students', 'Colleges / branches', 'Add opportunities', 'Resource management', 'View analytics', 'Generate reports'].map((step, i) => (
              <span key={step} className="text-[10px] px-2.5 py-1 rounded-full border border-[var(--border)] text-[var(--text-secondary)]">
                {i + 1}. {step}
              </span>
            ))}
          </div>
        </div>
      </Card>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {/* Analytics KPI Cards */}
      {loading ? (
        <div className="text-center py-12 text-[var(--color-text-muted)]">Loading platform reports...</div>
      ) : analytics ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card variant="stat" className="p-5">
            <div className="flex items-center justify-between text-[var(--color-text-muted)] text-xs">
              <span>Total Enrolled Students</span>
              <Users className="w-4 h-4 text-[var(--color-brand-primary)]" />
            </div>
            <div className="text-3xl font-black text-[var(--color-text-primary)] font-mono">
              {analytics.totalStudents}
            </div>
            <span className="text-[11px] text-[var(--color-text-muted)]">Active university cohort</span>
          </Card>

          <Card variant="stat" className="p-5">
            <div className="flex items-center justify-between text-[var(--color-text-muted)] text-xs">
              <span>Active Roadmap Users</span>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-3xl font-black text-emerald-500 font-mono">
              {analytics.activeRoadmapUsers}
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              {Math.round((analytics.activeRoadmapUsers / analytics.totalStudents) * 100)}% engagement rate
            </span>
          </Card>

          <Card variant="stat" className="p-5">
            <div className="flex items-center justify-between text-[var(--color-text-muted)] text-xs">
              <span>Average Development Score</span>
              <Award className="w-4 h-4 text-fuchsia-500" />
            </div>
            <div className="text-3xl font-black text-fuchsia-500 font-mono">
              {analytics.averageDevelopmentScore}
            </div>
            <span className="text-[11px] text-[var(--color-text-muted)]">Out of 100 benchmark</span>
          </Card>

          <Card variant="stat" className="p-5">
            <div className="flex items-center justify-between text-[var(--color-text-muted)] text-xs">
              <span>Placement rate</span>
              <Shield className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-3xl font-black text-amber-500 font-mono">
              {analytics.placementStats.placementPercentage}%
            </div>
            <span className="text-[11px] text-[var(--color-text-muted)]">
              Official SISTec campus rate (same on Home / Explore / Placement)
            </span>
          </Card>
        </div>
      ) : null}

      {/* Two Column Layout: Add Resource Form & Recent Coordinator Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Add Resource Form */}
        <Card variant="default" className="lg:col-span-7 p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[var(--color-border-subtle)]">
            <div className="p-2 rounded-xl bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Add / Publish Learning Resource</h2>
              <p className="text-xs text-[var(--color-text-secondary)]">Add vetted educational material to the centralized catalog.</p>
            </div>
          </div>

          <form onSubmit={handleAddResource} className="space-y-4">
            <Input
              label="Resource Title *"
              required
              placeholder="e.g. Advanced Algorithmic Thinking"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] block">
                  Format Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3.5 py-2.5 text-xs text-[var(--color-text-primary)] focus:border-[var(--color-border-focus)] outline-none"
                >
                  <option value="course">Structured Course</option>
                  <option value="youtube">YouTube Tutorial</option>
                  <option value="doc">Official Documentation</option>
                  <option value="practice">Practice Platform</option>
                  <option value="book">Reference Book</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] block">
                  Fee Tier
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPaid(false)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      !isPaid
                        ? "bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                        : "bg-[var(--color-surface-raised)] border-[var(--color-border-subtle)] text-[var(--color-text-muted)]"
                    }`}
                  >
                    Free
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPaid(true)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      isPaid
                        ? "bg-purple-500/15 border-purple-500 text-purple-600 dark:text-purple-400"
                        : "bg-[var(--color-surface-raised)] border-[var(--color-border-subtle)] text-[var(--color-text-muted)]"
                    }`}
                  >
                    Paid
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <Input
                label="Provider / Author *"
                required
                placeholder="e.g. MIT OpenCourseWare"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
              />

              <Input
                label="Direct URL *"
                type="url"
                required
                placeholder="https://..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            <Input
              label="Category / Skill Tag"
              placeholder="e.g. System Design, Algorithms, Cloud"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] block">
                Description
              </label>
              <textarea
                rows={2}
                placeholder="Key concepts covered, prerequisites..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3.5 py-2.5 text-xs text-[var(--color-text-primary)] focus:border-[var(--color-border-focus)] outline-none"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                variant="gradient"
                loading={savingResource}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Publish Resource
              </Button>
            </div>
          </form>
        </Card>

        {/* Coordinator Inquiry Desk Stream */}
        <Card variant="default" className="lg:col-span-5 p-6 sm:p-8 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-[var(--color-border-subtle)] mb-4">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Student Inquiries Stream</h2>
                <p className="text-xs text-[var(--color-text-secondary)]">Tickets submitted to coordinator contact desk.</p>
              </div>
            </div>

            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {!analytics || analytics.recentInquiries.length === 0 ? (
                <div className="text-center py-12 text-[var(--color-text-muted)] text-xs">
                  No pending student queries.
                </div>
              ) : (
                analytics.recentInquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-3.5 rounded-xl bg-[var(--color-surface-raised)] border border-[var(--color-border-subtle)] space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-[var(--color-brand-primary)] font-bold">
                        #{inq.ticketId}
                      </span>
                      <Badge variant="warning" size="sm">
                        {inq.status}
                      </Badge>
                    </div>
                    <h4 className="font-bold text-[var(--color-text-primary)]">{inq.subject}</h4>
                    <p className="text-[11px] text-[var(--color-text-secondary)] line-clamp-2">&ldquo;{inq.message}&rdquo;</p>
                    <div className="pt-2 flex items-center justify-between text-[10px] text-[var(--color-text-muted)] border-t border-[var(--color-border-subtle)]">
                      <span>From: {inq.studentName}</span>
                      <span>Assigned: {inq.coordinatorName}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
