'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { CoverImage } from '@/components/ui/CoverImage';
import { Badge } from '@/components/ui/Badge';
import { ClubCommitteeItem } from '@/lib/types';
import { CLUB_PHOTOS, SISTEC_CLUBS, photoForEvent } from '@/data/sistec-campus';
import { RGPV_UNIVERSITY_CLUBS } from '@/data/rgpv-life';
import {
  BRANCH_CLUB_IDS,
  BRANCH_LAB_CLUBS,
  CAMPUS_BRANCHES,
  CampusBranchId,
  EXTRA_GALLERY,
  branchFromProfile,
} from '@/data/campus-branches';
import { useRoadmapOptional } from '@/context/RoadmapContext';

type Shot = { src: string; title: string };

function withPhotos(clubs: ClubCommitteeItem[]): ClubCommitteeItem[] {
  return clubs.map((club) => {
    const universityWide = club.id.startsWith('rgpv-');
    return {
      ...club,
      imageUrl: club.imageUrl || (universityWide ? null : CLUB_PHOTOS[club.id] || null),
      events: (club.events || []).map((event) => ({
        ...event,
        imageUrl: event.imageUrl || (universityWide ? null : photoForEvent(event.id, event.category)),
      })),
    };
  });
}

function mergeClubs(incoming: ClubCommitteeItem[]): ClubCommitteeItem[] {
  const extra = incoming.filter((club) => !club.id.startsWith('rgpv-') && !BRANCH_LAB_CLUBS.some((lab) => lab.id === club.id));
  return withPhotos([...RGPV_UNIVERSITY_CLUBS, ...BRANCH_LAB_CLUBS, ...extra]);
}

function galleryFor(club: ClubCommitteeItem): Shot[] {
  const seen = new Map<string, string>();
  const add = (src?: string | null, title?: string) => {
    if (!src || seen.has(src)) return;
    seen.set(src, title || club.name);
  };
  add(club.imageUrl, club.name);
  for (const event of club.events || []) add(event.imageUrl, event.title);
  for (const extra of EXTRA_GALLERY[club.id] || []) add(extra.src, extra.title);
  return Array.from(seen.entries()).map(([src, title]) => ({ src, title }));
}

const INITIAL_CLUBS = mergeClubs(SISTEC_CLUBS as ClubCommitteeItem[]);

export default function CampusLifePage() {
  const roadmap = useRoadmapOptional();
  const [clubs, setClubs] = useState<ClubCommitteeItem[]>(INITIAL_CLUBS);
  const [branch, setBranch] = useState<CampusBranchId | null>(null);
  const [picked, setPicked] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/v1/extracurriculars/clubs', { signal: controller.signal })
      .then((r) => r.json())
      .then((json) => {
        if (json.success && Array.isArray(json.clubs) && json.clubs.length) {
          setClubs(mergeClubs(json.clubs));
        }
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (picked) return;
    const match = branchFromProfile(roadmap?.profile.branch);
    if (match) setBranch(match);
  }, [picked, roadmap?.profile.branch]);

  const openClubs = useMemo(() => {
    if (!branch) return [];
    const ids = BRANCH_CLUB_IDS[branch];
    return ids
      .map((id) => clubs.find((club) => club.id === id))
      .filter((club): club is ClubCommitteeItem => Boolean(club));
  }, [branch, clubs]);

  const shots = useMemo(() => openClubs.flatMap((club) => galleryFor(club)), [openClubs]);

  useEffect(() => {
    for (const shot of shots) {
      const img = new Image();
      img.decoding = 'async';
      img.src = shot.src;
    }
  }, [shots]);

  const branchLabel = CAMPUS_BRANCHES.find((item) => item.id === branch)?.label;

  return (
    <div className="space-y-6 py-2">
      <PageHeader
        badge="Campus life · RGPV"
        title="Open your branch."
        description="Each RGPV branch has its own committees. Choose one and every photo for those committees loads here. Fests, sports, and NSS sit under Every branch."
      />

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {CAMPUS_BRANCHES.map((item) => {
          const active = branch === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setPicked(true);
                setBranch(item.id);
              }}
              className={`h-10 px-4 rounded-full text-sm font-bold shrink-0 border transition-colors ${
                active
                  ? 'bg-[var(--primary)] text-[var(--primary-fg)] border-transparent'
                  : 'border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-inset)]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {!branch && (
        <p className="text-sm text-[var(--text-secondary)]">
          Choose CSE, IT, AI & DS, ECE, EE, Mechanical, Civil, or Every branch.
        </p>
      )}

      {branch && (
        <div className="space-y-8">
          <p className="text-sm text-[var(--text-secondary)]">
            {branchLabel} · {openClubs.length} {openClubs.length === 1 ? 'committee' : 'committees'} · {shots.length} photos
          </p>
          {openClubs.map((club) => {
            const images = galleryFor(club);
            return (
              <section key={club.id} className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-black text-[var(--text-primary)]">{club.name}</h2>
                  <Badge variant="primary" size="sm">
                    {club.category}
                  </Badge>
                </div>
                <p className="text-sm text-[var(--text-secondary)] max-w-3xl leading-relaxed">{club.description}</p>
                {images.length > 0 ? (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                    {images.map((image) => (
                      <figure
                        key={image.src}
                        className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)]"
                      >
                        <CoverImage
                          src={image.src}
                          alt={image.title}
                          priority
                          className="aspect-[4/3] w-full"
                        />
                        <figcaption className="px-3 py-2 text-xs font-semibold text-[var(--text-primary)] leading-snug">
                          {image.title}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[var(--text-muted)]">No gallery photos for this committee yet.</p>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
