'use client';

import React, { useMemo, useState } from 'react';
import {
  Filter,
  List,
  Map as MapIcon,
  Plus,
  Search,
  SlidersHorizontal,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { useRoadmap } from '@/context/RoadmapContext';
import { PILLAR_FILTERS, YEAR_THEMES } from '@/lib/roadmap/constants';
import { filterNodes } from '@/lib/roadmap/generate';
import type { AcademicYear, PillarFilterId, RoadmapNode } from '@/lib/roadmap/types';
import { JourneyMap } from '@/components/roadmap/JourneyMap';
import { NodeDrawer } from '@/components/roadmap/NodeDrawer';
import { TunePanel } from '@/components/roadmap/TunePanel';
import { SummaryStrip } from '@/components/roadmap/SummaryStrip';
import { RevealOverlay } from '@/components/roadmap/RevealOverlay';
import { cn } from '@/lib/cn';
import { toast } from '@/components/ui/Toast';
import { PERIODS } from '@/lib/roadmap/constants';

export default function RoadmapPage() {
  const {
    ready,
    roadmap,
    profile,
    selectedYear,
    setSelectedYear,
    previewFuture,
    setPreviewFuture,
    pendingDiff,
    pendingReveal,
    dismissReveal,
    saveProfile,
    previewProfile,
    completeNode,
    updateChecklist,
    addNote,
    addCustomNode,
    acceptDiff,
    undoDiff,
    markOpened,
  } = useRoadmap();

  const [filter, setFilter] = useState<PillarFilterId>('all');
  const [query, setQuery] = useState('');
  const [onlyThisMonth, setOnlyThisMonth] = useState(false);
  const [expandLanes, setExpandLanes] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [view, setView] = useState<'map' | 'list'>('map');
  const [focusedId, setFocusedId] = useState<string | null>(roadmap.startHereId);
  const [openNode, setOpenNode] = useState<RoadmapNode | null>(null);
  const [tuneOpen, setTuneOpen] = useState(false);

  const yearLocked = selectedYear > profile.currentYear;
  const yearNodes = useMemo(
    () => filterNodes(roadmap.nodes, { filter, query, onlyThisMonth, year: selectedYear }),
    [filter, onlyThisMonth, query, roadmap.nodes, selectedYear]
  );

  const nextActions = roadmap.nodes.filter(
    (n) => n.year === profile.currentYear && (n.status === 'available' || n.status === 'in-progress')
  );

  const openCustom = () => {
    const id = `custom-${Date.now()}`;
    addCustomNode({
      id,
      templateId: id,
      year: selectedYear,
      period: PERIODS[0],
      pillar: 'skills',
      title: 'Custom milestone',
      why: `You added this to stay on track for ${profile.targetRole}.`,
      deliverables: ['Define the outcome'],
      checklist: ['Scope it', 'Ship a proof', 'Reflect'],
      resources: [],
      estimatedHours: 8,
      difficulty: 'Beginner',
      prerequisites: [],
      unlocks: [],
      synergyWith: [],
      status: 'available',
      skillGain: [{ skill: 'Custom', levels: 1 }],
      domain: 'Generic',
      xp: 8,
    });
  };

  if (!ready) {
    return (
      <div className="space-y-4 py-6">
        <Skeleton className="h-28 w-full" rounded="2xl" />
        <Skeleton className="h-64 w-full" rounded="2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4 overflow-x-hidden">
      {pendingReveal && <RevealOverlay roadmap={roadmap} onStart={dismissReveal} />}

      {(roadmap.usedFallback || !profile.isPersonalized) && (
        <div className="rounded-2xl border border-[var(--accent-border)] bg-[var(--accent-subtle)] px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-sm text-[var(--text-primary)]">
            Personalize this roadmap — Explorer demo path until you save onboarding or pick a Demo persona.
          </p>
          <Button variant="secondary" onClick={() => setTuneOpen(true)}>
            Tune my roadmap
          </Button>
        </div>
      )}

      {pendingDiff && pendingDiff.summary !== 'No structural changes' && (
        <div className="rounded-2xl border border-[var(--primary-border)] bg-[var(--primary-subtle)] px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <p className="text-sm text-[var(--text-primary)]">{pendingDiff.summary}</p>
          <div className="flex gap-2">
            <Button variant="primary" onClick={acceptDiff}>
              Accept
            </Button>
            <Button variant="outline" onClick={undoDiff}>
              Undo
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <Badge variant="primary" size="sm">
            Whole-Person journey
          </Badge>
          <h1 className="mt-2 text-2xl sm:text-3xl font-display font-bold text-[var(--text-primary)]">
            Your year-by-year roadmap
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {profile.branch} · {profile.targetRole} · {profile.weeklyHours} hrs/week
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => setTuneOpen(true)}>
            <SlidersHorizontal className="w-4 h-4" /> Tune my roadmap
          </Button>
          <div className="flex rounded-xl border border-[var(--border)] p-1">
            <button
              type="button"
              onClick={() => setView('map')}
              className={cn(
                'px-3 py-2 rounded-lg text-xs font-semibold min-h-11 inline-flex items-center gap-1',
                view === 'map' ? 'bg-[var(--primary)] text-[var(--primary-fg)]' : 'text-[var(--text-muted)]'
              )}
            >
              <MapIcon className="w-3.5 h-3.5" /> Map
            </button>
            <button
              type="button"
              onClick={() => setView('list')}
              className={cn(
                'px-3 py-2 rounded-lg text-xs font-semibold min-h-11 inline-flex items-center gap-1',
                view === 'list' ? 'bg-[var(--primary)] text-[var(--primary-fg)]' : 'text-[var(--text-muted)]'
              )}
            >
              <List className="w-3.5 h-3.5" /> List
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3" role="tablist" aria-label="Year switcher">
        {roadmap.yearSummaries.map((tab) => {
          const selected = selectedYear === tab.year;
          return (
            <button
              key={tab.year}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => {
                setSelectedYear(tab.year as AcademicYear);
                if (tab.year > profile.currentYear) setPreviewFuture(true);
              }}
              className={cn(
                'p-4 rounded-2xl border text-left min-h-[96px] transition-colors',
                selected
                  ? 'bg-[var(--primary)] text-[var(--primary-fg)] border-[var(--primary)] shadow-[var(--glow-primary)]'
                  : 'bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--primary-border)]'
              )}
            >
              <div className="flex items-center justify-between">
                <span className={cn('text-[10px] font-mono font-bold', selected ? 'text-[var(--primary-fg)]' : 'text-[var(--primary)]')}>
                  YEAR 0{tab.year}
                </span>
                <span
                  className="relative w-8 h-8"
                  aria-hidden
                >
                  <svg viewBox="0 0 36 36" className="-rotate-90">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray={`${(tab.completionPct / 100) * 88} 88`}
                    />
                  </svg>
                </span>
              </div>
              <h3 className={cn('font-bold text-sm mt-1', selected ? 'text-[var(--primary-fg)]' : 'text-[var(--text-primary)]')}>
                {YEAR_THEMES[tab.year as AcademicYear].split(' ').slice(0, 3).join(' ')}
              </h3>
              <p className={cn('text-[11px] mt-1', selected ? 'text-[var(--primary-fg)]/80' : 'text-[var(--text-secondary)]')}>
                {tab.completionPct}% · {tab.xp} XP
                {tab.year > profile.currentYear ? ' · locked' : ''}
              </p>
            </button>
          );
        })}
      </div>

      {yearLocked && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-inset)] px-4 py-2.5">
          <p className="text-xs text-[var(--text-secondary)]">
            Year {selectedYear} stays locked until the Year {selectedYear - 1} reflection gate. Preview is on.
          </p>
          <Button variant="ghost" onClick={() => setPreviewFuture(!previewFuture)}>
            {previewFuture ? 'Preview on' : 'Preview Year ' + selectedYear}
          </Button>
        </div>
      )}

      <SummaryStrip roadmap={roadmap} year={selectedYear} nextActions={nextActions} />

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
          {PILLAR_FILTERS.map((chip) => {
            const active = filter === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => setFilter(chip.id)}
                className={cn(
                  'px-3 py-2 rounded-xl text-xs font-semibold shrink-0 min-h-11 border',
                  active
                    ? 'bg-[var(--primary)] text-[var(--primary-fg)] border-[var(--primary)]'
                    : 'bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--primary-border)]'
                )}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search nodes"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--text-primary)] min-h-11"
            />
          </label>
          <Button variant={onlyThisMonth ? 'primary' : 'outline'} onClick={() => setOnlyThisMonth((v) => !v)}>
            Show only this month
          </Button>
          <Button variant="outline" onClick={() => setExpandLanes((v) => !v)}>
            {expandLanes ? 'Collapse lanes' : 'Expand all lanes'}
          </Button>
          <Button variant="ghost" onClick={() => setZoom((z) => Math.max(0.7, z - 0.1))} aria-label="Zoom out">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button variant="ghost" onClick={() => setZoom((z) => Math.min(1.4, z + 0.1))} aria-label="Zoom in">
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="secondary" onClick={openCustom}>
            <Plus className="w-4 h-4" /> Add custom milestone
          </Button>
        </div>
      </div>

      {yearNodes.length === 0 ? (
        <EmptyState
          title="No milestones match this filter"
          description="Clear filters to see your full year path, or tune interests if this pillar should be populated."
          action={{ label: 'Clear filters', onClick: () => { setFilter('all'); setQuery(''); setOnlyThisMonth(false); } }}
          secondaryAction={{ label: 'Tune my roadmap', onClick: () => setTuneOpen(true) }}
        />
      ) : view === 'map' ? (
        <JourneyMap
          nodes={yearNodes}
          year={selectedYear}
          focusedId={focusedId ?? roadmap.startHereId}
          onFocus={setFocusedId}
          onOpen={(n) => {
            setOpenNode(n);
            markOpened(n.id);
          }}
          expandLanes={expandLanes}
          zoom={zoom}
          previewFuture={previewFuture}
          yearLocked={yearLocked}
        />
      ) : (
        <ul className="space-y-2" aria-label="Roadmap list">
          {yearNodes.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => {
                  setOpenNode(n);
                  markOpened(n.id);
                }}
                className="w-full text-left p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary-border)]"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-sm text-[var(--text-primary)]">{n.title}</p>
                  <Badge variant="outline" size="sm">
                    {n.status}
                  </Badge>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2">{n.why}</p>
              </button>
            </li>
          ))}
        </ul>
      )}

      <NodeDrawer
        node={openNode}
        checklistDone={openNode ? profile.checklistProgress?.[openNode.id] ?? [] : []}
        note={openNode ? profile.notes?.[openNode.id] ?? '' : ''}
        onClose={() => setOpenNode(null)}
        onStatus={(status) => {
          if (!openNode) return;
          completeNode(openNode.id, status);
          toast.success('Saved', 'You can undo from the diff banner if the path shifted.');
          setOpenNode((n) => (n ? { ...n, status } : n));
        }}
        onToggleCheck={(item, checked) => openNode && updateChecklist(openNode.id, item, checked)}
        onNote={(note) => openNode && addNote(openNode.id, note)}
      />

      <TunePanel
        open={tuneOpen}
        profile={profile}
        onClose={() => setTuneOpen(false)}
        preview={previewProfile}
        onApply={(next) => saveProfile(next)}
      />
    </div>
  );
}
