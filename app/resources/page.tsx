"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  BookOpen,
  Bookmark,
  ExternalLink,
  Search,
  Star,
  CheckCircle,
  Video,
  FileCode,
  Code2,
  DollarSign,
  Tag,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { ResourceItem } from "@/lib/types";

export default function ResourcesPage() {
  const { user } = useAuth();
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("all");
  const [paidFilter, setPaidFilter] = useState<"all" | "free" | "paid">("free");
  const [searchQuery, setSearchQuery] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    fetchResources();
  }, [selectedType, paidFilter]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedType !== "all") params.append("type", selectedType);
      if (paidFilter === "free") params.append("isPaid", "false");
      if (paidFilter === "paid") params.append("isPaid", "true");

      const res = await fetch(`/api/v1/resources?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setResources(json.resources || []);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSave = async (resourceId: string, currentSaved?: boolean) => {
    setSavingId(resourceId);
    setResources((prev) =>
      prev.map((r) =>
        r.id === resourceId ? { ...r, isSaved: !currentSaved, userStatus: !currentSaved ? "SAVED" : undefined } : r
      )
    );

    try {
      await fetch("/api/v1/resources/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resourceId,
          status: !currentSaved ? "SAVED" : null,
        }),
      });
    } catch (e) {
      console.error(e);
    } finally {
      setSavingId(null);
    }
  };

  const typeTabs = [
    { id: "all", label: "All Resources", icon: Sparkles },
    { id: "course", label: "Structured Courses", icon: BookOpen },
    { id: "youtube", label: "YouTube Playlists", icon: Video },
    { id: "doc", label: "Official Docs", icon: FileCode },
    { id: "practice", label: "Practice Platforms", icon: Code2 },
    { id: "book", label: "Reference Books", icon: Bookmark },
  ];

  const filteredResources = resources.filter((r) => {
    if (selectedType !== 'all' && r.type !== selectedType) return false;
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return (
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.provider.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <Card variant="raised" className="p-6 sm:p-8 border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/90 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <Badge variant="accent" size="sm">
              Centralized Learning Repository
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--color-text-primary)] tracking-tight">
            Resource Manager & Catalog
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1.5 max-w-2xl leading-relaxed">
            Eliminate cross-platform searching. Every resource is curated by senior mentors with unambiguous badges for Free vs Paid tiers and direct provider links.
          </p>
        </div>

        {/* Free / Paid Toggle Segment */}
        <div className="flex rounded-2xl p-1.5 border border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)] shrink-0">
          <button
            onClick={() => setPaidFilter("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              paidFilter === "all" ? "bg-[var(--color-brand-primary)] text-white shadow-sm" : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            All Tiers
          </button>
          <button
            onClick={() => setPaidFilter("free")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              paidFilter === "free" ? "bg-emerald-600 text-white shadow-sm" : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            Free Only
          </button>
          <button
            onClick={() => setPaidFilter("paid")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              paidFilter === "paid" ? "bg-purple-600 text-white shadow-sm" : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            Paid / Premium
          </button>
        </div>
      </Card>

      {/* Tabs by format */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 max-w-full">
        {typeTabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = selectedType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${
                isSelected
                  ? "bg-[var(--color-brand-primary)] text-white border-[var(--color-brand-primary)] shadow-sm"
                  : "bg-[var(--color-surface)] border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-default)]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="max-w-md">
        <Input
          placeholder="Filter resources by topic, provider, or keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
      </div>

      {/* Grid of Resource Cards */}
      {loading ? (
        <div className="text-center py-20 text-[var(--color-text-muted)]">Loading resources...</div>
      ) : filteredResources.length === 0 ? (
        <EmptyState
          title="No Learning Resources Found"
          description="Try adjusting your filters or search terms to browse the directory."
          action={{
            label: "Reset Filters",
            onClick: () => {
              setSelectedType("all");
              setPaidFilter("all");
              setSearchQuery("");
            },
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res) => (
            <Card
              key={res.id}
              variant="interactive"
              animate
              className="p-6 border border-[var(--color-border-subtle)] flex flex-col justify-between space-y-4 relative group"
            >
              <div>
                {/* Badges: Free vs Paid + Rating */}
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={res.isPaid ? "paid" : "free"} size="sm">
                    {res.isPaid ? "PAID / PREMIUM" : "100% FREE"}
                  </Badge>

                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold font-mono">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{res.rating.toFixed(1)}</span>
                  </div>
                </div>

                <span className="text-[10px] font-semibold text-[var(--color-text-muted)] block mb-1">
                  Provider: <strong className="text-[var(--color-text-primary)]">{res.provider}</strong>
                </span>

                <h3 className="font-extrabold text-[var(--color-text-primary)] text-base leading-snug mb-2 group-hover:text-[var(--color-brand-primary)] transition-colors">
                  {res.title}
                </h3>

                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-4 line-clamp-3">
                  {res.description}
                </p>

                {/* Category & Level pills */}
                <div className="flex flex-wrap gap-1.5 text-[10px]">
                  <Badge variant="outline" size="sm">
                    {res.category}
                  </Badge>
                  <Badge variant="primary" size="sm">
                    {res.level}
                  </Badge>
                  {res.academicYear && (
                    <Badge variant="default" size="sm">
                      Yr {res.academicYear}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-[var(--color-border-subtle)] flex items-center justify-between gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleSave(res.id, res.isSaved)}
                  disabled={savingId === res.id}
                  leftIcon={<Bookmark className={`w-3.5 h-3.5 ${res.isSaved ? "fill-[var(--color-brand-primary)] text-[var(--color-brand-primary)]" : ""}`} />}
                >
                  {res.isSaved ? "Saved" : "Save"}
                </Button>
                <Button
                  variant="gradient"
                  size="sm"
                  href={res.url}
                  target="_blank"
                  rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                >
                  Open
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
