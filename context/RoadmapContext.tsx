'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type {
  AcademicYear,
  GeneratedRoadmap,
  RoadmapDiff,
  RoadmapNode,
  StudentProfile,
} from '@/lib/roadmap/types';
import { toast } from '@/components/ui/Toast';

type RoadmapEngine = typeof import('@/lib/roadmap');

const STORAGE_KEY = 'ctc.roadmap.v1';

const PLACEHOLDER_PROFILE: StudentProfile = {
  branch: 'B.Tech first year (RGPV common)',
  currentYear: 1,
  skills: [],
  interestDomains: ['Web Development'],
  talentInterests: ['Leadership/Volunteering'],
  targetRole: 'Explorer — still deciding',
  weeklyHours: 10,
  completedNodeIds: [],
  isPersonalized: false,
  personaId: 'explorer',
};

const EMPTY_ROADMAP: GeneratedRoadmap = {
  profile: PLACEHOLDER_PROFILE,
  nodes: [],
  usedFallback: true,
  startHereId: null,
  yearSummaries: [],
  wholePerson: { technicalPct: 0, talentPct: 0 },
  skillsBefore: {},
  skillsAfter: {},
};

interface StoredState {
  profile: StudentProfile;
  lastNodes: RoadmapNode[];
  pendingDiff: RoadmapDiff | null;
  pendingReveal?: boolean;
  lastOpenedId?: string | null;
}

interface RoadmapContextValue {
  ready: boolean;
  roadmap: GeneratedRoadmap;
  profile: StudentProfile;
  selectedYear: AcademicYear;
  setSelectedYear: (y: AcademicYear) => void;
  previewFuture: boolean;
  setPreviewFuture: (v: boolean) => void;
  pendingDiff: RoadmapDiff | null;
  pendingReveal: boolean;
  dismissReveal: () => void;
  applyPersona: (id: string) => void;
  saveProfile: (next: StudentProfile, opts?: { reveal?: boolean; diffAgainst?: RoadmapNode[] }) => void;
  previewProfile: (next: Partial<StudentProfile>) => { roadmap: GeneratedRoadmap; diff: RoadmapDiff };
  completeNode: (id: string, status: RoadmapNode['status']) => void;
  updateChecklist: (nodeId: string, item: string, checked: boolean) => void;
  addNote: (nodeId: string, note: string) => void;
  addCustomNode: (node: RoadmapNode) => void;
  acceptDiff: () => void;
  undoDiff: () => void;
  lastOpenedId: string | null;
  markOpened: (id: string) => void;
}

const RoadmapContext = createContext<RoadmapContextValue | null>(null);

function readStore(): StoredState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredState;
  } catch {
    return null;
  }
}

function writeStore(state: StoredState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function RoadmapProvider({ children }: { children: React.ReactNode }) {
  const engineRef = useRef<RoadmapEngine | null>(null);
  const [engine, setEngine] = useState<RoadmapEngine | null>(null);
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<StudentProfile>(PLACEHOLDER_PROFILE);
  const [pendingDiff, setPendingDiff] = useState<RoadmapDiff | null>(null);
  const [undoSnapshot, setUndoSnapshot] = useState<StudentProfile | null>(null);
  const [pendingReveal, setPendingReveal] = useState(false);
  const [selectedYear, setSelectedYear] = useState<AcademicYear>(1);
  const [previewFuture, setPreviewFuture] = useState(false);
  const [lastOpenedId, setLastOpenedId] = useState<string | null>(null);

  const roadmap = useMemo(
    () => (engine ? engine.generateRoadmap(profile) : { ...EMPTY_ROADMAP, profile }),
    [engine, profile]
  );

  useEffect(() => {
    let alive = true;
    const load = () => {
      import('@/lib/roadmap').then((mod) => {
        if (!alive) return;
        engineRef.current = mod;
        const stored = readStore();
        if (stored?.profile) {
          setProfile(stored.profile);
          setPendingDiff(stored.pendingDiff);
          setPendingReveal(Boolean(stored.pendingReveal));
          setSelectedYear(stored.profile.currentYear);
          setLastOpenedId(stored.lastOpenedId ?? null);
        } else {
          const seeded = mod.EXPLORER_PROFILE;
          setProfile(seeded);
          setSelectedYear(seeded.currentYear);
          writeStore({
            profile: seeded,
            lastNodes: mod.generateRoadmap(seeded).nodes,
            pendingDiff: null,
          });
        }
        setEngine(mod);
        setReady(true);
      });
    };

    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(load, { timeout: 700 });
      return () => {
        alive = false;
        window.cancelIdleCallback(id);
      };
    }

    const timer = window.setTimeout(load, 0);
    return () => {
      alive = false;
      window.clearTimeout(timer);
    };
  }, []);

  const persist = useCallback((next: StoredState) => {
    writeStore({ ...next, lastOpenedId: next.lastOpenedId ?? lastOpenedId });
  }, [lastOpenedId]);

  const markOpened = useCallback(
    (id: string) => {
      setLastOpenedId(id);
      const stored = readStore();
      if (stored) persist({ ...stored, lastOpenedId: id });
    },
    [persist]
  );

  const saveProfile = useCallback(
    (next: StudentProfile, opts?: { reveal?: boolean; diffAgainst?: RoadmapNode[] }) => {
      const current = engineRef.current;
      if (!current) return;
      const against = opts?.diffAgainst ?? roadmap.nodes;
      const { roadmap: generated, diff } = current.regenerateWithDiff(against, next);
      const hasDiff = diff.added.length + diff.removed.length + diff.moved.length > 0;
      setUndoSnapshot(profile);
      setProfile(next);
      setPendingDiff(hasDiff ? diff : null);
      setPendingReveal(Boolean(opts?.reveal));
      setSelectedYear(next.currentYear);
      persist({
        profile: next,
        lastNodes: generated.nodes,
        pendingDiff: hasDiff ? diff : null,
        pendingReveal: Boolean(opts?.reveal),
      });
    },
    [persist, profile, roadmap.nodes]
  );

  const applyPersona = useCallback(
    (id: string) => {
      const run = (current: RoadmapEngine) => {
        const persona = current.personaById(id);
        if (!persona) return;
        saveProfile(persona.profile);
        toast.success(`Loaded ${persona.label}`, persona.desc);
      };
      if (engineRef.current) {
        run(engineRef.current);
        return;
      }
      import('@/lib/roadmap').then((mod) => {
        engineRef.current = mod;
        setEngine(mod);
        setReady(true);
        run(mod);
      });
    },
    [saveProfile]
  );

  const previewProfile = useCallback(
    (partial: Partial<StudentProfile>) => {
      const current = engineRef.current;
      const next = { ...profile, ...partial };
      if (!current) {
        return {
          roadmap: { ...EMPTY_ROADMAP, profile: next },
          diff: { added: [], removed: [], moved: [], summary: '' },
        };
      }
      return current.regenerateWithDiff(roadmap.nodes, next);
    },
    [profile, roadmap.nodes]
  );

  const completeNode = useCallback(
    (id: string, status: RoadmapNode['status']) => {
      const node = roadmap.nodes.find((n) => n.id === id);
      if (!node) return;
      const completed = new Set(profile.completedNodeIds);
      const inProgress = new Set(profile.inProgressNodeIds ?? []);
      const skipped = new Set(profile.skippedNodeIds ?? []);
      completed.delete(id);
      inProgress.delete(id);
      skipped.delete(id);
      if (status === 'completed') completed.add(id);
      if (status === 'in-progress') inProgress.add(id);
      if (status === 'skipped') skipped.add(id);

      let skills = profile.skills;
      if (status === 'completed' && node.status !== 'completed') {
        const current = engineRef.current;
        skills = current ? current.applySkillGains(profile, node.skillGain) : profile.skills;
        toast.success('Level up', node.skillGain.map((g) => `${g.skill} +${g.levels}`).join(', ') || node.title);
      }

      saveProfile({
        ...profile,
        skills,
        completedNodeIds: Array.from(completed),
        inProgressNodeIds: Array.from(inProgress),
        skippedNodeIds: Array.from(skipped),
      });
    },
    [profile, roadmap.nodes, saveProfile]
  );

  const updateChecklist = useCallback(
    (nodeId: string, item: string, checked: boolean) => {
      const current = profile.checklistProgress?.[nodeId] ?? [];
      const nextItems = checked ? Array.from(new Set([...current, item])) : current.filter((i) => i !== item);
      const next = {
        ...profile,
        checklistProgress: { ...profile.checklistProgress, [nodeId]: nextItems },
      };
      setProfile(next);
      persist({ profile: next, lastNodes: roadmap.nodes, pendingDiff, pendingReveal });
    },
    [pendingDiff, pendingReveal, persist, profile, roadmap.nodes]
  );

  const addNote = useCallback(
    (nodeId: string, note: string) => {
      const next = { ...profile, notes: { ...profile.notes, [nodeId]: note } };
      setProfile(next);
      persist({ profile: next, lastNodes: roadmap.nodes, pendingDiff, pendingReveal });
    },
    [pendingDiff, pendingReveal, persist, profile, roadmap.nodes]
  );

  const addCustomNode = useCallback(
    (node: RoadmapNode) => {
      saveProfile({ ...profile, customNodes: [...(profile.customNodes ?? []), node] });
      toast.success('Custom milestone added', node.title);
    },
    [profile, saveProfile]
  );

  const acceptDiff = useCallback(() => {
    setPendingDiff(null);
    persist({ profile, lastNodes: roadmap.nodes, pendingDiff: null, pendingReveal });
  }, [pendingReveal, persist, profile, roadmap.nodes]);

  const undoDiff = useCallback(() => {
    if (!undoSnapshot) {
      setPendingDiff(null);
      return;
    }
    setProfile(undoSnapshot);
    setPendingDiff(null);
    const current = engineRef.current;
    persist({
      profile: undoSnapshot,
      lastNodes: current ? current.generateRoadmap(undoSnapshot).nodes : roadmap.nodes,
      pendingDiff: null,
    });
    toast.info('Roadmap change undone');
  }, [persist, roadmap.nodes, undoSnapshot]);

  const dismissReveal = useCallback(() => {
    setPendingReveal(false);
    persist({ profile, lastNodes: roadmap.nodes, pendingDiff, pendingReveal: false });
  }, [pendingDiff, persist, profile, roadmap.nodes]);

  const value: RoadmapContextValue = {
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
    applyPersona,
    saveProfile,
    previewProfile,
    completeNode,
    updateChecklist,
    addNote,
    addCustomNode,
    acceptDiff,
    undoDiff,
    lastOpenedId,
    markOpened,
  };

  return <RoadmapContext.Provider value={value}>{children}</RoadmapContext.Provider>;
}

export function useRoadmap() {
  const ctx = useContext(RoadmapContext);
  if (!ctx) throw new Error('useRoadmap must be used within RoadmapProvider');
  return ctx;
}

export function useRoadmapOptional() {
  return useContext(RoadmapContext);
}
