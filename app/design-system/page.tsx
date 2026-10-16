"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { ProgressBar, ProgressRing, AnimatedCount } from "@/components/ui/Progress";
import { Avatar, AvatarGroup } from "@/components/ui/Avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from "@/components/ui/Modal";
import { Skeleton, SkeletonCard, SkeletonStat } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { SimpleTooltip } from "@/components/ui/Tooltip";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { toast } from "@/components/ui/Toast";
import {
  Sparkles,
  Rocket,
  Search,
  Mail,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Terminal,
  ExternalLink,
  Flame,
  Palette,
  Layers,
  Activity,
  Sliders,
} from "lucide-react";

export default function DesignSystemPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [switchState, setSwitchState] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [progressVal, setProgressVal] = useState(68);

  const colors = [
    { name: "Brand Primary", var: "var(--color-brand-primary)", hex: "#6366F1" },
    { name: "Brand Secondary", var: "var(--color-brand-secondary)", hex: "#8B5CF6" },
    { name: "Brand Accent", var: "var(--color-accent)", hex: "#06B6D4" },
    { name: "Surface Default", var: "var(--color-surface)", hex: "Surface" },
    { name: "Surface Raised", var: "var(--color-surface-raised)", hex: "Raised" },
    { name: "Surface Overlay", var: "var(--color-surface-overlay)", hex: "Overlay" },
    { name: "Success", var: "var(--color-success)", hex: "#10B981" },
    { name: "Warning", var: "var(--color-warning)", hex: "#F59E0B" },
    { name: "Danger", var: "var(--color-danger)", hex: "#EF4444" },
    { name: "Info", var: "var(--color-info)", hex: "#3B82F6" },
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--color-border-subtle)] pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] border border-[var(--color-brand-primary)]/20 mb-3">
            <Palette className="w-3.5 h-3.5" />
            <span>Design Tokens & Component Library</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
            Campus to Career Design System
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-2 max-w-2xl">
            Strict token-driven architecture supporting Light & Dark themes, WCAG 2.2 AA accessibility, fluid micro-interactions, and high-density SaaS patterns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle variant="segmented" />
        </div>
      </div>

      {/* Tabs for Navigation */}
      <Tabs defaultValue="components" variant="pill">
        <TabsList className="mb-10">
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="tokens">Design Tokens</TabsTrigger>
          <TabsTrigger value="feedback">Feedback & Modals</TabsTrigger>
          <TabsTrigger value="skeletons">Loading States</TabsTrigger>
        </TabsList>

        {/* Tab 1: Components */}
        <TabsContent value="components" className="space-y-16">
          {/* Buttons */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 border-b border-[var(--color-border-subtle)] pb-3">
              <Sparkles className="w-5 h-5 text-[var(--color-brand-primary)]" />
              <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Button Variants & States</h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="accent">Accent</Button>
              <Button variant="gradient">Gradient Glow</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="primary" loading>Loading</Button>
              <Button variant="primary" leftIcon={<Rocket className="w-4 h-4" />}>
                With Icon
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="xs">Size XS</Button>
              <Button size="sm">Size SM</Button>
              <Button size="md">Size MD</Button>
              <Button size="lg">Size LG</Button>
            </div>
          </section>

          {/* Badges */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 border-b border-[var(--color-border-subtle)] pb-3">
              <ShieldCheck className="w-5 h-5 text-[var(--color-brand-primary)]" />
              <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Badges & Tags</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge variant="primary">Primary Brand</Badge>
              <Badge variant="accent">Accent Cyan</Badge>
              <Badge variant="success" dot>Success</Badge>
              <Badge variant="warning" dot>In Progress</Badge>
              <Badge variant="danger" dot>Critical</Badge>
              <Badge variant="info">Information</Badge>
              <Badge variant="free">Free Access</Badge>
              <Badge variant="paid">Premium Pro</Badge>
              <Badge variant="outline">Outline Badge</Badge>
              <Badge variant="default">Default Neutral</Badge>
            </div>
          </section>

          {/* Inputs & Form Elements */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 border-b border-[var(--color-border-subtle)] pb-3">
              <Sliders className="w-5 h-5 text-[var(--color-brand-primary)]" />
              <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Form Controls</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Standard Input"
                placeholder="Enter student email..."
                leftIcon={<Mail className="w-4 h-4" />}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                hint="We will send placement updates to this address."
              />
              <Input
                label="Error State Input"
                placeholder="Required field..."
                defaultValue="invalid_email"
                error="Please enter a valid university email (.edu)"
              />
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Select Dropdown (Radix)
                </label>
                <Select defaultValue="y3">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Academic Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="y1">Year 1 — Foundation & Orientation</SelectItem>
                    <SelectItem value="y2">Year 2 — Core CS & Data Structures</SelectItem>
                    <SelectItem value="y3">Year 3 — Internships & Specialization</SelectItem>
                    <SelectItem value="y4">Year 4 — Placements & Capstone</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-8">
              <Switch
                label="Weekly Placement Digest"
                description="Receive coordinator job notifications on Monday"
                checked={switchState}
                onCheckedChange={setSwitchState}
              />
              <div className="flex items-center gap-2">
                <SimpleTooltip content="Helpful tooltip explaining this feature!">
                  <Button variant="outline" size="sm">Hover for Tooltip</Button>
                </SimpleTooltip>
              </div>
            </div>
          </section>

          {/* Cards & Bento Grid */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 border-b border-[var(--color-border-subtle)] pb-3">
              <Layers className="w-5 h-5 text-[var(--color-brand-primary)]" />
              <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Cards & Bento Layouts</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card variant="default">
                <CardHeader>
                  <Badge variant="primary" className="w-fit mb-2">Default Variant</Badge>
                  <CardTitle>Standard Card</CardTitle>
                  <CardDescription>Clean border with surface elevation tokens</CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-[var(--color-text-secondary)]">
                  Contains balanced padding and clean typography ready for stats or listings.
                </CardContent>
                <CardFooter>
                  <Button size="xs" variant="ghost">Action →</Button>
                </CardFooter>
              </Card>

              <Card variant="interactive" animate>
                <CardHeader>
                  <Badge variant="accent" className="w-fit mb-2">Interactive Hover</Badge>
                  <CardTitle>Animated Card</CardTitle>
                  <CardDescription>Lifts smoothly on hover with token glow</CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-[var(--color-text-secondary)]">
                  Perfect for clickable milestone cards, modules, and course tiles.
                </CardContent>
                <CardFooter>
                  <Button size="xs" variant="accent">Explore</Button>
                </CardFooter>
              </Card>

              <Card variant="stat">
                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Placement Readiness</span>
                  <div className="text-3xl font-extrabold text-[var(--color-text-primary)]">87%</div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-500 pt-2">
                    <span>↑ +14% this month</span>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          {/* Avatars & Progress */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 border-b border-[var(--color-border-subtle)] pb-3">
              <Activity className="w-5 h-5 text-[var(--color-brand-primary)]" />
              <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Progress & Avatars</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-5 p-6 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
                <h3 className="text-sm font-bold text-[var(--color-text-primary)]">Progress Bars & Rings</h3>
                <ProgressBar value={progressVal} showValue label="Roadmap Progress" />
                <div className="flex items-center gap-6 pt-2">
                  <ProgressRing value={progressVal} size={72} strokeWidth={6} label="Completion" />
                  <div>
                    <div className="text-2xl font-black text-[var(--color-text-primary)]">
                      <AnimatedCount value={2450} />
                    </div>
                    <div className="text-xs text-[var(--color-text-secondary)]">Active Enrolled Students</div>
                  </div>
                </div>
              </div>

              <div className="space-y-5 p-6 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
                <h3 className="text-sm font-bold text-[var(--color-text-primary)]">Avatars & Groups</h3>
                <div className="flex items-center gap-4">
                  <Avatar name="Alex Johnson" size="sm" online />
                  <Avatar name="Priya Sharma" size="md" online />
                  <Avatar name="Rohan Verma" size="lg" />
                  <Avatar name="Ananya Roy" size="xl" online />
                </div>
                <div>
                  <p className="text-xs text-[var(--color-text-secondary)] mb-2">Team Avatar Group (+overflow):</p>
                  <AvatarGroup
                    avatars={[
                      { name: "John Doe" },
                      { name: "Sarah Connor" },
                      { name: "Alan Turing" },
                      { name: "Grace Hopper" },
                      { name: "Linus Torvalds" },
                      { name: "Ada Lovelace" },
                    ]}
                    max={4}
                  />
                </div>
              </div>
            </div>
          </section>
        </TabsContent>

        {/* Tab 2: Tokens */}
        <TabsContent value="tokens" className="space-y-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {colors.map((c) => (
              <div
                key={c.name}
                className="p-4 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] space-y-2"
              >
                <div
                  className="w-full h-14 rounded-lg shadow-inner border border-black/10"
                  style={{ backgroundColor: c.var }}
                />
                <div className="text-xs font-semibold text-[var(--color-text-primary)]">{c.name}</div>
                <div className="text-[10px] font-mono text-[var(--color-text-muted)] truncate">{c.var}</div>
              </div>
            ))}
          </div>

          <div className="p-6 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] space-y-4">
            <h3 className="text-sm font-bold text-[var(--color-text-primary)]">Typography Hierarchy</h3>
            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-mono text-[var(--color-text-muted)]">.text-display-2xl (48px / 56px)</span>
                <div className="text-3xl sm:text-5xl font-black text-[var(--color-text-primary)] tracking-tight">Display Headline 2XL</div>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[var(--color-text-muted)]">.text-display-lg (32px / 40px)</span>
                <div className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)]">Large Section Heading</div>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[var(--color-text-muted)]">.text-base (16px)</span>
                <div className="text-base text-[var(--color-text-secondary)]">Body text standard — optimized line heights and tracking for maximum legibility.</div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab 3: Feedback & Modals */}
        <TabsContent value="feedback" className="space-y-8">
          <div className="p-6 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] space-y-4">
            <h3 className="text-sm font-bold text-[var(--color-text-primary)]">Toasts (Sonner)</h3>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.success("Milestone completed successfully!", "Your roadmap score increased.")}
              >
                Success Toast
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.error("Submission failed", "Please check your network connection.")}
              >
                Error Toast
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.warning("Session expiring soon", "Save your active changes.")}
              >
                Warning Toast
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.info("New Placement Drive", "Google SDE drive open for registrations.")}
              >
                Info Toast
              </Button>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] space-y-4">
            <h3 className="text-sm font-bold text-[var(--color-text-primary)]">Modal Dialog (Radix + Motion)</h3>
            <Button variant="primary" onClick={() => setModalOpen(true)}>
              Open Sample Modal
            </Button>

            <Modal open={modalOpen} onOpenChange={setModalOpen}>
              <ModalContent>
                <ModalHeader>
                  <ModalTitle>Career Track Milestone</ModalTitle>
                  <ModalDescription>Confirm completing your LeetCode 75 challenge milestone.</ModalDescription>
                </ModalHeader>
                <ModalBody>
                  <div className="space-y-3 py-2 text-sm text-[var(--color-text-secondary)]">
                    <p>
                      Marking this milestone will automatically update your placement readiness score on the coordinator dashboard.
                    </p>
                    <div className="p-3 rounded-xl bg-[var(--color-surface-overlay)] border border-[var(--color-border-subtle)] text-xs text-[var(--color-text-muted)]">
                      💡 Tip: Upload proof of completion or certificate to earn a verified badge.
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setModalOpen(false);
                      toast.success("Milestone marked as completed!");
                    }}
                  >
                    Confirm & Submit
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>

          <EmptyState
            title="No Results Found"
            description="We couldn't find any resources matching your search query. Try refining your keywords."
            action={{
              label: "Reset Search Filter",
              onClick: () => toast.info("Filters reset"),
            }}
          />
        </TabsContent>

        {/* Tab 4: Loading States */}
        <TabsContent value="skeletons" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonStat />
            <div className="p-6 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-9 w-24 rounded-xl" />
                <Skeleton className="h-9 w-24 rounded-xl" />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
