'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  STORAGE_KEY,
  applySkillGains,
  generateRoadmap,
  personaById,
  regenerateWithDiff,
  type AcademicYear,
  type GeneratedRoadmap,
  type RoadmapDiff,
  type RoadmapNode,
  type StudentProfile,
} from '@/lib/roadmap';
import { EXPLORER_PROFILE } from '@/lib/roadmap/profile';
import { toast } from '@/components/ui/Toast';

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

function seedPriorYears(profile: StudentProfile): StudentProfile {
  if (profile.currentYear <= 1) return profile;
  const draft = generateRoadmap({ ...profile, completedNodeIds: [] });
  const prior = draft.nodes.filter((n) => n.year < profile.currentYear).map((n) => n.id);
  return { ...profile, completedNodeIds: Array.from(new Set([...(profile.completedNodeIds ?? []), ...prior])) };
}

export function RoadmapProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<StudentProfile>(EXPLORER_PROFILE);
  const [pendingDiff, setPendingDiff] = useState<RoadmapDiff | null>(null);
  const [undoSnapshot, setUndoSnapshot] = useState<StudentProfile | null>(null);
  const [pendingReveal, setPendingReveal] = useState(false);
  const [selectedYear, setSelectedYear] = useState<AcademicYear>(1);
  const [previewFuture, setPreviewFuture] = useState(false);
  const [lastOpenedId, setLastOpenedId] = useState<string | null>(null);

  const roadmap = useMemo(() => generateRoadmap(profile), [profile]);

  useEffect(() => {
    const stored = readStore();
    if (stored?.profile) {
      setProfile(stored.profile);
      setPendingDiff(stored.pendingDiff);
      setPendingReveal(Boolean(stored.pendingReveal));
      setSelectedYear(stored.profile.currentYear);
      setLastOpenedId(stored.lastOpenedId ?? null);
    } else {
      setProfile(EXPLORER_PROFILE);
      setSelectedYear(EXPLORER_PROFILE.currentYear);
      writeStore({ profile: EXPLORER_PROFILE, lastNodes: generateRoadmap(EXPLORER_PROFILE).nodes, pendingDiff: null });
    }
    setReady(true);
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
      const against = opts?.diffAgainst ?? roadmap.nodes;
      const { roadmap: generated, diff } = regenerateWithDiff(against, next);
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
      const persona = personaById(id);
      if (!persona) return;
      const seeded = seedPriorYears(persona.profile);
      saveProfile(seeded);
      toast.success(`Loaded ${persona.label}`, persona.desc);
    },
    [saveProfile]
  );

  const previewProfile = useCallback(
    (partial: Partial<StudentProfile>) => {
      const next = { ...profile, ...partial };
      return regenerateWithDiff(roadmap.nodes, next);
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
        skills = applySkillGains(profile, node.skillGain);
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
    persist({ profile: undoSnapshot, lastNodes: generateRoadmap(undoSnapshot).nodes, pendingDiff: null });
    toast.info('Roadmap change undone');
  }, [persist, undoSnapshot]);

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
