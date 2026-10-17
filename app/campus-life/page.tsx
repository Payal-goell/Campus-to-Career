'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { CoverImage } from '@/components/ui/CoverImage';
import { PageHeader } from '@/components/ui/PageHeader';
import { ClubCommitteeItem } from '@/lib/types';
import { CLUB_PHOTOS, SISTEC_CLUBS, photoForEvent } from '@/data/sistec-campus';

type View = 'story' | 'clubs';

type Recap = NonNullable<ClubCommitteeItem['events']>[number] & { clubName: string; clubId: string };

function withPhotos(clubs: ClubCommitteeItem[]): ClubCommitteeItem[] {
  return clubs.map((club) => ({
    ...club,
    imageUrl: club.imageUrl || CLUB_PHOTOS[club.id] || null,
    events: (club.events || []).map((event) => ({
      ...event,
      imageUrl: event.imageUrl || photoForEvent(event.id, event.category),
    })),
  }));
}

const INITIAL_CLUBS = withPhotos(SISTEC_CLUBS as ClubCommitteeItem[]);

export default function CampusLifePage() {
  const [clubs, setClubs] = useState<ClubCommitteeItem[]>(INITIAL_CLUBS);
  const [view, setView] = useState<View>('story');
  const [category, setCategory] = useState('all');
  const [storyIndex, setStoryIndex] = useState(0);
  const [openClub, setOpenClub] = useState<string | null>(null);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/v1/extracurriculars/clubs', { signal: controller.signal })
      .then((r) => r.json())
      .then((json) => {
        if (json.success && Array.isArray(json.clubs) && json.clubs.length) {
          setClubs(withPhotos(json.clubs));
        }
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  const categories = ['all', 'Technical', 'Leadership', 'Cultural'];

  const recaps: Recap[] = useMemo(() => {
    const seen = new Set<string>();
    const list: Recap[] = [];
    for (const club of clubs) {
      for (const event of club.events || []) {
        if (!event.imageUrl || seen.has(event.imageUrl)) continue;
        seen.add(event.imageUrl);
        list.push({ ...event, imageUrl: event.imageUrl, clubName: club.name, clubId: club.id });
      }
    }
    return list;
  }, [clubs]);

  const filteredRecaps = recaps.filter((event) => {
    if (category === 'all') return true;
    const club = clubs.find((item) => item.id === event.clubId);
    return club?.category.toLowerCase() === category.toLowerCase() || event.category.toLowerCase() === category.toLowerCase();
  });

  const filteredClubs =
    category === 'all' ? clubs : clubs.filter((club) => club.category.toLowerCase() === category.toLowerCase());

  const safeIndex = filteredRecaps.length ? storyIndex % filteredRecaps.length : 0;
  const featured = filteredRecaps[safeIndex];
  const mosaic = featured
    ? [featured, ...filteredRecaps.filter((event) => event.id !== featured.id)]
    : [];

  const go = (dir: number) => {
    if (!filteredRecaps.length) return;
    setStoryIndex((index) => (index + dir + filteredRecaps.length) % filteredRecaps.length);
  };

  useEffect(() => {
    setStoryIndex(0);
  }, [category]);

  useEffect(() => {
    const next = filteredRecaps[(safeIndex + 1) % Math.max(filteredRecaps.length, 1)];
    if (!next?.imageUrl || next.id === featured?.id) return;
    const img = new Image();
    img.decoding = 'async';
    img.src = next.imageUrl;
  }, [featured?.id, filteredRecaps, safeIndex]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (view !== 'story') return;
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      if (event.key === 'ArrowRight') go(1);
      if (event.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [view, filteredRecaps.length]);

  return (
    <div className="space-y-5 py-2">
      <PageHeader
        badge="Campus story"
        title="SISTec events, then the club behind them"
        description="Tap a photo. Arrow keys and swipe move through the wall."
        actions={
          <div className="flex flex-wrap gap-2">
            <div className="flex p-1 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)]">
              {(
                [
                  ['story', 'Photo story'],
                  ['clubs', 'Committees'],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setView(id)}
                  className={`h-9 px-3 rounded-xl text-xs font-bold ${
                    view === id ? 'bg-[var(--primary)] text-[var(--primary-fg)]' : 'text-[var(--text-muted)]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              href="https://www.sistec.ac.in/events-and-gallery"
              target="_blank"
              rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
            >
              sistec.ac.in
            </Button>
          </div>
        }
      />

      <div className="flex flex-wrap gap-1.5">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`h-9 px-3 rounded-full text-xs font-bold capitalize ${
              category === cat ? 'bg-emerald-600 text-white' : 'border border-[var(--border)] text-[var(--text-muted)]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {view === 'story' && featured && (
        <section
          className="-mx-3 min-[375px]:-mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden border-y border-[var(--border)] bg-black"
          onTouchStart={(event) => {
            touchX.current = event.changedTouches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            if (touchX.current == null) return;
            const delta = (event.changedTouches[0]?.clientX ?? touchX.current) - touchX.current;
            if (delta > 40) go(-1);
            if (delta < -40) go(1);
            touchX.current = null;
          }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-0">
            {mosaic.map((event, index) => {
              const selected = event.id === featured.id;
              return (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => {
                    const next = filteredRecaps.findIndex((item) => item.id === event.id);
                    if (next >= 0) setStoryIndex(next);
                  }}
                  className={`relative block overflow-hidden text-left aspect-square ${
                    index === 0 ? 'col-span-2 row-span-2' : ''
                  } ${selected ? 'ring-2 ring-inset ring-white' : ''}`}
                >
                  <CoverImage
                    src={event.imageUrl}
                    alt={event.title}
                    priority={index < 3}
                    className="absolute inset-0 h-full w-full"
                  />
                  {index === 0 && (
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 sm:p-5 pointer-events-none">
                      <Badge variant="success" size="sm">
                        {event.category}
                      </Badge>
                      <span className="block text-white font-black text-base sm:text-2xl mt-2 leading-tight">{event.title}</span>
                      <span className="block text-white/80 text-xs mt-1">
                        {event.clubName} · {event.date} · {event.location}
                      </span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between gap-3 px-3 sm:px-5 py-3 bg-[var(--surface)]">
            <p className="text-sm text-[var(--text-secondary)] leading-snug line-clamp-2 min-w-0">
              {featured.recap || featured.description}
            </p>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                aria-label="Previous event"
                onClick={() => go(-1)}
                className="w-9 h-9 rounded-full border border-[var(--border)] inline-flex items-center justify-center"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label="Next event"
                onClick={() => go(1)}
                className="w-9 h-9 rounded-full border border-[var(--border)] inline-flex items-center justify-center"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setOpenClub(featured.clubId);
                  setView('clubs');
                }}
              >
                Open club
              </Button>
            </div>
          </div>
        </section>
      )}

      {view === 'story' && !featured && (
        <EmptyState title="No photos in this filter" description="Try All or Cultural." action={{ label: 'Show all', onClick: () => setCategory('all') }} />
      )}

      {view === 'clubs' && filteredClubs.length === 0 && (
        <EmptyState
          title="No committee in this filter"
          description="Sports is not a separate SISTec body here — try Cultural or Technical."
          action={{ label: 'Show all', onClick: () => setCategory('all') }}
        />
      )}

      {view === 'clubs' && filteredClubs.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {filteredClubs.map((club) => {
            const open = openClub === club.id;
            const photos = (club.events || []).filter((event) => event.imageUrl).slice(0, 3);
            return (
              <Card key={club.id} className="overflow-hidden p-0 flex flex-col [content-visibility:auto]">
                <div className="grid grid-cols-3 gap-0">
                  {(photos.length ? photos : [{ id: club.id, imageUrl: club.imageUrl, title: club.name }]).map((photo) => (
                    <button
                      key={photo.id}
                      type="button"
                      className="relative aspect-[4/3] overflow-hidden"
                      onClick={() => {
                        const idx = recaps.findIndex((item) => item.id === photo.id);
                        if (idx >= 0) {
                          setCategory('all');
                          setStoryIndex(idx);
                          setView('story');
                        } else {
                          setOpenClub(open ? null : club.id);
                        }
                      }}
                    >
                      <CoverImage src={photo.imageUrl} alt={photo.title} className="absolute inset-0 h-full w-full" />
                    </button>
                  ))}
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="primary" size="sm">
                      {club.category}
                    </Badge>
                    <span className="text-[11px] text-[var(--text-muted)] inline-flex items-center gap-1">
                      <Users className="w-3 h-3" /> {club.leadCoordinator}
                    </span>
                  </div>
                  <h2 className="font-black text-sm leading-snug">{club.name}</h2>
                  <p className="text-xs text-[var(--text-secondary)] line-clamp-2">{club.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant={open ? 'secondary' : 'outline'} onClick={() => setOpenClub(open ? null : club.id)}>
                      {open ? 'Hide' : 'Events & join'}
                    </Button>
                    {club.joinUrl && (
                      <Button size="sm" variant="gradient" href={club.joinUrl} target="_blank">
                        Official page
                      </Button>
                    )}
                  </div>
                </div>
                {open && (
                  <div className="border-t border-[var(--border)] px-4 py-3 space-y-3">
                    <p className="text-xs text-[var(--text-secondary)]">{club.purpose}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {club.skillsGained.map((skill) => (
                        <Badge key={skill} variant="success" size="sm">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
