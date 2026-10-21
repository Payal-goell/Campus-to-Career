'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Pause,
  Play,
  Sparkles,
  Users,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { CoverImage } from '@/components/ui/CoverImage';
import { PageHeader } from '@/components/ui/PageHeader';
import { ClubCommitteeItem } from '@/lib/types';
import { CLUB_PHOTOS, SISTEC_CLUBS, photoForEvent } from '@/data/sistec-campus';
import { RGPV_LIFE_PATHS, RGPV_SEMESTER_MOVES, RGPV_UNIVERSITY_CLUBS } from '@/data/rgpv-life';

type View = 'story' | 'clubs';

type Recap = NonNullable<ClubCommitteeItem['events']>[number] & { clubName: string; clubId: string };

const STORY_MS = 5500;
const CATEGORIES = ['all', 'Technical', 'Cultural', 'Sports', 'Leadership'] as const;

function withPhotos(clubs: ClubCommitteeItem[]): ClubCommitteeItem[] {
  return clubs.map((club) => {
    const universityWide = club.id.startsWith('rgpv-');
    return {
      ...club,
      imageUrl: club.imageUrl || (universityWide ? null : CLUB_PHOTOS[club.id] || null),
      events: (club.events || []).map((event) => ({
        ...event,
        imageUrl:
          event.imageUrl || (universityWide ? null : photoForEvent(event.id, event.category)),
      })),
    };
  });
}

function mergeClubs(incoming: ClubCommitteeItem[]): ClubCommitteeItem[] {
  const extra = incoming.filter((club) => !club.id.startsWith('rgpv-'));
  return withPhotos([...RGPV_UNIVERSITY_CLUBS, ...extra]);
}

const INITIAL_CLUBS = mergeClubs(SISTEC_CLUBS as ClubCommitteeItem[]);

export default function CampusLifePage() {
  const [clubs, setClubs] = useState<ClubCommitteeItem[]>(INITIAL_CLUBS);
  const [view, setView] = useState<View>('story');
  const [category, setCategory] = useState('all');
  const [storyIndex, setStoryIndex] = useState(0);
  const [openClub, setOpenClub] = useState<string | null>(null);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [query, setQuery] = useState('');
  const touchX = useRef<number | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const startedAt = useRef(Date.now());

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

  const categories = CATEGORIES;

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

  const searchedRecaps = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return recaps;
    return recaps.filter((event) =>
      `${event.title} ${event.clubName} ${event.description} ${event.recap || ''}`.toLowerCase().includes(q)
    );
  }, [recaps, query]);

  const filteredRecaps = useMemo(
    () =>
      searchedRecaps.filter((event) => {
        if (category === 'all') return true;
        const club = clubs.find((item) => item.id === event.clubId);
        return (
          club?.category.toLowerCase() === category.toLowerCase() ||
          event.category.toLowerCase() === category.toLowerCase()
        );
      }),
    [searchedRecaps, clubs, category]
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: searchedRecaps.length };
    for (const cat of categories) {
      if (cat === 'all') continue;
      counts[cat] = searchedRecaps.filter((event) => {
        const club = clubs.find((item) => item.id === event.clubId);
        return club?.category.toLowerCase() === cat.toLowerCase() || event.category.toLowerCase() === cat.toLowerCase();
      }).length;
    }
    return counts;
  }, [searchedRecaps, clubs, categories]);

  const q = query.trim().toLowerCase();
  const filteredClubs = clubs.filter((club) => {
    const catOk = category === 'all' || club.category.toLowerCase() === category.toLowerCase();
    if (!q) return catOk;
    const blob = `${club.name} ${club.description} ${club.purpose} ${(club.events || []).map((event) => event.title).join(' ')}`.toLowerCase();
    return catOk && blob.includes(q);
  });

  const safeIndex = filteredRecaps.length ? storyIndex % filteredRecaps.length : 0;
  const featured = filteredRecaps[safeIndex];
  const wallTiles = featured
    ? [featured, ...filteredRecaps.filter((event) => event.id !== featured.id)].slice(0, 12)
    : [];

  const bumpStory = (dir: number) => {
    if (!filteredRecaps.length) return;
    setStoryIndex((index) => (index + dir + filteredRecaps.length) % filteredRecaps.length);
    startedAt.current = Date.now();
    setProgress(0);
  };

  const selectStory = (id: string) => {
    const next = filteredRecaps.findIndex((item) => item.id === id);
    if (next >= 0) {
      setStoryIndex(next);
      startedAt.current = Date.now();
      setProgress(0);
    }
  };

  useEffect(() => {
    setStoryIndex(0);
    startedAt.current = Date.now();
    setProgress(0);
  }, [category, query]);

  useEffect(() => {
    const next = filteredRecaps[(safeIndex + 1) % Math.max(filteredRecaps.length, 1)];
    if (!next?.imageUrl || next.id === featured?.id) return;
    const img = new Image();
    img.decoding = 'async';
    img.src = next.imageUrl;
  }, [featured?.id, filteredRecaps, safeIndex]);

  useEffect(() => {
    const node = stripRef.current?.querySelector<HTMLElement>(`[data-story-id="${featured?.id}"]`);
    node?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [featured?.id]);

  useEffect(() => {
    if (view !== 'story' || !playing || filteredRecaps.length < 2) return;
    let frame = 0;
    const tick = () => {
      const elapsed = Date.now() - startedAt.current;
      const ratio = Math.min(1, elapsed / STORY_MS);
      setProgress(ratio);
      if (ratio >= 1) {
        setStoryIndex((index) => (index + 1) % filteredRecaps.length);
        startedAt.current = Date.now();
        setProgress(0);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [view, playing, filteredRecaps.length, featured?.id]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (view !== 'story') return;
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      if (event.key === 'ArrowRight') bumpStory(1);
      if (event.key === 'ArrowLeft') bumpStory(-1);
      if (event.key === ' ') {
        event.preventDefault();
        setPlaying((value) => !value);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [view, filteredRecaps.length]);

  const onStageTouchStart = (event: React.TouchEvent) => {
    touchX.current = event.changedTouches[0]?.clientX ?? null;
    setPlaying(false);
  };

  const onStageTouchEnd = (event: React.TouchEvent) => {
    if (touchX.current == null) return;
    const delta = (event.changedTouches[0]?.clientX ?? touchX.current) - touchX.current;
    if (Math.abs(delta) < 36) {
      touchX.current = null;
      return;
    }
    if (delta > 0) bumpStory(-1);
    else bumpStory(1);
    touchX.current = null;
  };

  return (
    <div className="space-y-5 sm:space-y-6 py-2 overflow-x-clip">
      <PageHeader
        badge="Campus life · RGPV"
        title="Your college. The whole university."
        description="Clubs, sports, NSS, and placement cells differ by campus. The pattern is the same across RGPV: join one technical body and one outside the lab, then keep the certificate. Photos further down are from affiliated-campus galleries."
        actions={
          <div className="flex w-full sm:w-auto flex-wrap gap-2">
            <div className="flex flex-1 sm:flex-none p-1 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)]">
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
                  className={`flex-1 sm:flex-none h-10 sm:h-9 px-3.5 rounded-xl text-xs font-bold transition-colors ${
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
              href="https://www.rgpv.ac.in"
              target="_blank"
              className="shrink-0"
              rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
            >
              RGPV
            </Button>
          </div>
        }
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {RGPV_LIFE_PATHS.map((path) => (
          <button
            key={path.id}
            type="button"
            onClick={() => {
              setCategory(path.category);
              setView('clubs');
              setQuery('');
            }}
            className="text-left rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-4 space-y-2 hover:border-[var(--border-strong)] transition-colors"
          >
            <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400">
              {path.category}
            </span>
            <span className="block font-black text-sm text-[var(--text-primary)] leading-snug">{path.title}</span>
            <span className="block text-xs text-[var(--text-secondary)] leading-relaxed">{path.blurb}</span>
          </button>
        ))}
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-4 sm:px-5">
        <p className="text-[10px] uppercase tracking-wider font-bold text-[var(--text-muted)] mb-2">This semester</p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {RGPV_SEMESTER_MOVES.map((move) => (
            <li key={move} className="text-xs text-[var(--text-secondary)] leading-relaxed flex gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" aria-hidden />
              <span>{move}</span>
            </li>
          ))}
        </ul>
      </section>

      <label className="flex items-center gap-2 h-11 px-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)]">
        <Search className="w-4 h-4 text-[var(--text-muted)] shrink-0" aria-hidden />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search clubs, fests, NSS, sports…"
          className="w-full bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none"
        />
      </label>

      {featured && view === 'story' && (
        <div className="rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--surface-raised)] to-[var(--surface)] px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3 animate-in fade-in duration-500">
          <div className="relative w-full sm:w-28 shrink-0 aspect-[16/10] sm:aspect-square rounded-xl overflow-hidden border border-[var(--border)]">
            <CoverImage
              src={featured.imageUrl}
              alt=""
              className="absolute inset-0 h-full w-full"
              priority
            />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-[10px] uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Now on stage
            </p>
            <p className="font-black text-sm sm:text-base text-[var(--text-primary)] leading-snug line-clamp-2">
              {featured.title}
            </p>
            <p className="text-[11px] text-[var(--text-secondary)] truncate inline-flex items-center gap-1.5">
              <CalendarDays className="w-3 h-3 shrink-0" />
              {featured.clubName} · {featured.date}
            </p>
          </div>
          <Button
            size="sm"
            variant="gradient"
            className="shrink-0 w-full sm:w-auto"
            onClick={() => {
              setOpenClub(featured.clubId);
              setView('clubs');
            }}
          >
            Meet the club
          </Button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {[
          { label: 'Event photos', value: String(recaps.length) },
          { label: 'Committees', value: String(clubs.length) },
          { label: 'In this filter', value: featured ? `${safeIndex + 1} / ${filteredRecaps.length}` : '—' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] px-3 py-3 text-center"
          >
            <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold">{stat.label}</p>
            <p className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="-mx-3 min-[375px]:-mx-4 sm:mx-0 px-3 min-[375px]:px-4 sm:px-0 overflow-x-auto scrollbar-hide">
        <div className="flex gap-1.5 min-w-max sm:min-w-0 sm:flex-wrap pb-0.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`h-9 px-3.5 rounded-full text-xs font-bold capitalize shrink-0 inline-flex items-center gap-1.5 transition-colors ${
                category === cat
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/25'
                  : 'border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-inset)]'
              }`}
            >
              {cat}
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                  category === cat ? 'bg-white/20' : 'bg-[var(--surface-inset)]'
                }`}
              >
                {categoryCounts[cat] ?? 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {view === 'story' && featured && (
        <section
          className="-mx-3 min-[375px]:-mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden border-y border-[var(--border)] bg-black"
          onMouseEnter={() => setPlaying(false)}
          onMouseLeave={() => setPlaying(true)}
        >
          <div className="flex gap-1 px-2 pt-2 sm:px-3">
            {(filteredRecaps.length <= 10 ? filteredRecaps : [featured]).map((event, index) => {
              const multi = filteredRecaps.length <= 10;
              const active = multi ? index === safeIndex : true;
              const filled = multi && index < safeIndex;
              return (
                <button
                  key={event.id + String(index)}
                  type="button"
                  aria-label={multi ? `Jump to ${event.title}` : 'Story progress'}
                  onClick={() => (multi ? selectStory(event.id) : undefined)}
                  className="h-1 flex-1 rounded-full bg-white/25 overflow-hidden"
                >
                  <span
                    className="block h-full bg-emerald-400 transition-[width] duration-100 ease-linear"
                    style={{
                      width: filled ? '100%' : active ? `${progress * 100}%` : '0%',
                    }}
                  />
                </button>
              );
            })}
          </div>

          <div
            className="relative sm:hidden h-[min(52dvh,360px)] min-h-[220px] touch-pan-y"
            onTouchStart={onStageTouchStart}
            onTouchEnd={onStageTouchEnd}
          >
            <CoverImage
              key={featured.id}
              src={featured.imageUrl}
              alt={featured.title}
              priority
              className="absolute inset-0 h-full w-full animate-in fade-in duration-500"
            />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent p-3.5 pointer-events-none">
              <span className="inline-flex items-center gap-1.5">
                <Badge variant="success" size="sm">
                  {featured.category}
                </Badge>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 inline-flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Live story
                </span>
              </span>
              <span className="block text-white font-black text-base leading-tight mt-1.5 line-clamp-2">
                {featured.title}
              </span>
              <span className="block text-white/80 text-[11px] mt-1 truncate">
                {featured.clubName} · {featured.date}
              </span>
            </span>
            <button
              type="button"
              aria-label="Previous event"
              onClick={() => bumpStory(-1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/45 text-white inline-flex items-center justify-center backdrop-blur-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              aria-label="Next event"
              onClick={() => bumpStory(1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/45 text-white inline-flex items-center justify-center backdrop-blur-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div
            ref={stripRef}
            className="sm:hidden flex gap-0 overflow-x-auto overscroll-x-contain snap-x snap-mandatory scrollbar-hide border-t border-white/10"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {filteredRecaps.map((event) => {
              const selected = event.id === featured.id;
              return (
                <button
                  key={event.id}
                  type="button"
                  data-story-id={event.id}
                  onClick={() => selectStory(event.id)}
                  className={`relative shrink-0 w-[18vw] min-w-[64px] max-w-[84px] aspect-square overflow-hidden snap-start transition-transform ${
                    selected ? 'ring-2 ring-inset ring-emerald-300 scale-[1.02] z-[1]' : 'opacity-90'
                  }`}
                >
                  <CoverImage
                    src={event.imageUrl}
                    alt={event.title}
                    className="absolute inset-0 h-full w-full"
                  />
                </button>
              );
            })}
          </div>

          <div className="hidden sm:grid grid-cols-4 gap-0">
            {wallTiles.map((event, index) => {
              const selected = event.id === featured.id;
              return (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => selectStory(event.id)}
                  className={`relative block overflow-hidden text-left aspect-square group ${
                    index === 0 ? 'col-span-2 row-span-2' : ''
                  } ${selected ? 'ring-2 ring-inset ring-emerald-300' : ''}`}
                >
                  <CoverImage
                    src={event.imageUrl}
                    alt={event.title}
                    priority={index < 3}
                    className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-105"
                  />
                  {index === 0 && (
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-5 pointer-events-none">
                      <span className="inline-flex items-center gap-2">
                        <Badge variant="success" size="sm">
                          {event.category}
                        </Badge>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 inline-flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Live story
                        </span>
                      </span>
                      <span className="block text-white font-black text-2xl mt-2 leading-tight">{event.title}</span>
                      <span className="block text-white/80 text-xs mt-1">
                        {event.clubName} · {event.date} · {event.location}
                      </span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 px-3 sm:px-5 py-3 bg-[var(--surface)] sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[var(--text-secondary)] leading-snug line-clamp-3 sm:line-clamp-2 min-w-0">
              {featured.recap || featured.description}
            </p>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                aria-label={playing ? 'Pause story' : 'Play story'}
                onClick={() => setPlaying((value) => !value)}
                className="w-9 h-9 rounded-full border border-[var(--border)] inline-flex items-center justify-center"
              >
                {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                aria-label="Previous event"
                onClick={() => bumpStory(-1)}
                className="hidden sm:inline-flex w-9 h-9 rounded-full border border-[var(--border)] items-center justify-center"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label="Next event"
                onClick={() => bumpStory(1)}
                className="hidden sm:inline-flex w-9 h-9 rounded-full border border-[var(--border)] items-center justify-center"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono text-[var(--text-muted)] sm:hidden">
                {safeIndex + 1}/{filteredRecaps.length}
              </span>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 sm:flex-none"
                onClick={() => {
                  setOpenClub(featured.clubId);
                  setView('clubs');
                }}
              >
                Meet the club
              </Button>
              {featured.registrationUrl && (
                <Button
                  size="sm"
                  variant="gradient"
                  className="flex-1 sm:flex-none"
                  href={featured.registrationUrl}
                  target="_blank"
                >
                  Full recap
                </Button>
              )}
            </div>
          </div>
        </section>
      )}

      {view === 'story' && !featured && (
        <EmptyState
          title="No photos in this filter"
          description="University-wide committees often have no public photo yet. Open Committees, or clear the search."
          action={{ label: 'Show all', onClick: () => { setCategory('all'); setQuery(''); } }}
        />
      )}

      {view === 'clubs' && filteredClubs.length === 0 && (
        <EmptyState
          title="No committee in this filter"
          description="Try another category, or clear the search. Sports, NSS, and coding cells are listed for every RGPV college."
          action={{ label: 'Show all', onClick: () => { setCategory('all'); setQuery(''); } }}
        />
      )}

      {view === 'clubs' && filteredClubs.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredClubs.map((club) => {
            const open = openClub === club.id;
            const eventPhotos = (club.events || []).filter((event) => event.imageUrl);
            const photos = eventPhotos.slice(0, 3);
            const eventCount = club.events?.length ?? 0;
            return (
              <Card
                key={club.id}
                className={`overflow-hidden p-0 flex flex-col [content-visibility:auto] transition-all duration-300 ${
                  open ? 'shadow-lg ring-1 ring-emerald-500/35 -translate-y-0.5' : 'hover:shadow-md'
                }`}
              >
                <div className="grid grid-cols-3 gap-0 relative">
                  {(photos.length
                    ? photos
                    : [{ id: club.id, imageUrl: club.imageUrl, title: club.name }]
                  ).map((photo) => (
                    <button
                      key={photo.id}
                      type="button"
                      className="relative aspect-[4/3] overflow-hidden group"
                      onClick={() => {
                        const idx = recaps.findIndex((item) => item.id === photo.id);
                        if (idx >= 0) {
                          setCategory('all');
                          setStoryIndex(idx);
                          setView('story');
                          startedAt.current = Date.now();
                          setProgress(0);
                        } else {
                          setOpenClub(open ? null : club.id);
                        }
                      }}
                    >
                      <CoverImage
                        src={photo.imageUrl}
                        alt={photo.title}
                        className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-105"
                      />
                    </button>
                  ))}
                  {eventCount > 0 && (
                    <span className="absolute bottom-2 right-2 z-[1] text-[10px] font-bold px-2 py-1 rounded-full bg-black/65 text-white backdrop-blur-sm">
                      {eventCount} event{eventCount === 1 ? '' : 's'}
                    </span>
                  )}
                </div>
                <div className="p-4 space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="primary" size="sm">
                      {club.category}
                    </Badge>
                    <span className="text-[11px] text-[var(--text-muted)] inline-flex items-center gap-1 min-w-0">
                      <Users className="w-3 h-3 shrink-0" />
                      <span className="truncate">{club.leadCoordinator}</span>
                    </span>
                  </div>
                  <h2 className="font-black text-base leading-snug text-[var(--text-primary)]">{club.name}</h2>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                    {club.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {club.skillsGained.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="outline" size="sm">
                        {skill}
                      </Badge>
                    ))}
                    {club.skillsGained.length > 3 && (
                      <Badge variant="outline" size="sm">
                        +{club.skillsGained.length - 3}
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 pt-0.5">
                    <Button
                      size="sm"
                      variant={open ? 'secondary' : 'outline'}
                      className="flex-1 min-[420px]:flex-none"
                      onClick={() => setOpenClub(open ? null : club.id)}
                    >
                      {open ? 'Hide details' : 'Events & join'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 min-[420px]:flex-none"
                      onClick={() => {
                        const first = eventPhotos[0];
                        const idx = first ? recaps.findIndex((item) => item.id === first.id) : -1;
                        if (idx >= 0) {
                          setCategory('all');
                          setStoryIndex(idx);
                          setView('story');
                          startedAt.current = Date.now();
                          setProgress(0);
                        }
                      }}
                    >
                      View in story
                    </Button>
                    {club.joinUrl && (
                      <Button
                        size="sm"
                        variant="gradient"
                        className="flex-1 min-[420px]:flex-none"
                        href={club.joinUrl}
                        target="_blank"
                      >
                        Official page
                      </Button>
                    )}
                  </div>
                </div>
                {open && (
                  <div className="border-t border-[var(--border)] px-4 py-3.5 space-y-3 animate-in fade-in slide-in-from-top-1 duration-300 bg-[var(--surface-raised)]/50">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-bold text-[var(--text-muted)] mb-1">
                        Purpose
                      </p>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{club.purpose}</p>
                    </div>
                    {club.responsibilities && (
                      <div>
                        <p className="text-[10px] uppercase tracking-wider font-bold text-[var(--text-muted)] mb-1">
                          What members do
                        </p>
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                          {club.responsibilities}
                        </p>
                      </div>
                    )}
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
