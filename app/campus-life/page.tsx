'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { CoverImage } from '@/components/ui/CoverImage';
import { PageHeader } from '@/components/ui/PageHeader';
import { ClubCommitteeItem } from '@/lib/types';

type View = 'story' | 'clubs';

type Recap = NonNullable<ClubCommitteeItem['events']>[number] & { clubName: string; clubId: string };

export default function CampusLifePage() {
  const [clubs, setClubs] = useState<ClubCommitteeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('story');
  const [category, setCategory] = useState('all');
  const [storyIndex, setStoryIndex] = useState(0);
  const [openClub, setOpenClub] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/v1/extracurriculars/clubs')
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setClubs(json.clubs || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categories = ['all', 'Technical', 'Leadership', 'Cultural'];

  const recaps: Recap[] = useMemo(
    () =>
      clubs.flatMap((c) =>
        (c.events || [])
          .filter((e) => e.imageUrl)
          .map((e) => ({ ...e, clubName: c.name, clubId: c.id }))
      ),
    [clubs]
  );

  const filteredRecaps = recaps.filter((e) => {
    if (category === 'all') return true;
    const club = clubs.find((c) => c.id === e.clubId);
    return club?.category.toLowerCase() === category.toLowerCase() || e.category.toLowerCase() === category.toLowerCase();
  });

  const filteredClubs =
    category === 'all' ? clubs : clubs.filter((c) => c.category.toLowerCase() === category.toLowerCase());

  const safeIndex = filteredRecaps.length ? storyIndex % filteredRecaps.length : 0;
  const featured = filteredRecaps[safeIndex];

  useEffect(() => {
    setStoryIndex(0);
  }, [category]);

  const go = (dir: number) => {
    if (!filteredRecaps.length) return;
    setStoryIndex((i) => (i + dir + filteredRecaps.length) % filteredRecaps.length);
  };

  return (
    <div className="space-y-6 py-6">
      <PageHeader
        badge="Campus story"
        title="SISTec events, then the club behind them"
        description="Swipe the gallery, tap a photo, then open the committee if you want to join."
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

      {loading && <p className="text-xs text-[var(--text-muted)] py-10 text-center">Loading campus photos…</p>}

      {!loading && view === 'story' && featured && (
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.4fr)_minmax(260px,0.8fr)] gap-4 items-start">
          <Card className="overflow-hidden p-0">
            <div className="relative">
              <CoverImage src={featured.imageUrl} alt={featured.title} className="aspect-[16/9] w-full max-h-[420px]" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent p-4 sm:p-6">
                <Badge variant="success" size="sm">
                  {featured.category}
                </Badge>
                <h2 className="text-white font-black text-lg sm:text-2xl mt-2 leading-tight">{featured.title}</h2>
                <p className="text-white/80 text-xs mt-1">
                  {featured.clubName} · {featured.date} · {featured.location}
                </p>
              </div>
              <button
                type="button"
                aria-label="Previous event"
                onClick={() => go(-1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white inline-flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                aria-label="Next event"
                onClick={() => go(1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white inline-flex items-center justify-center"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:items-end">
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed flex-1">{featured.recap || featured.description}</p>
              <div className="flex flex-wrap gap-2 shrink-0">
                {featured.registrationUrl && (
                  <Button size="sm" variant="gradient" href={featured.registrationUrl} target="_blank">
                    Recap on SISTec
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setOpenClub(featured.clubId);
                    setView('clubs');
                  }}
                >
                  Open {featured.clubName.split('(')[0].trim()}
                </Button>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {filteredRecaps.map((e, i) => (
              <button
                key={e.id}
                type="button"
                onClick={() => setStoryIndex(i)}
                className={`rounded-xl overflow-hidden border-2 ${
                  i === safeIndex ? 'border-[var(--primary)]' : 'border-transparent'
                }`}
              >
                <CoverImage src={e.imageUrl} alt={e.title} className="aspect-square w-full" />
              </button>
            ))}
          </div>
        </div>
      )}

      {!loading && view === 'story' && !featured && (
        <EmptyState title="No photos in this filter" description="Try All or Cultural." action={{ label: 'Show all', onClick: () => setCategory('all') }} />
      )}

      {!loading && view === 'clubs' && filteredClubs.length === 0 && (
        <EmptyState
          title="No committee in this filter"
          description="Sports is not a separate SISTec body here — try Cultural or Technical."
          action={{ label: 'Show all', onClick: () => setCategory('all') }}
        />
      )}

      {!loading && view === 'clubs' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredClubs.map((club) => {
            const open = openClub === club.id;
            return (
              <Card key={club.id} className="overflow-hidden p-0 flex flex-col">
                <div className="grid grid-cols-[112px_minmax(0,1fr)] sm:grid-cols-[160px_minmax(0,1fr)] min-h-[140px]">
                  <CoverImage src={club.imageUrl} alt={club.name} className="h-full min-h-[140px]" />
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
                </div>
                {open && (
                  <div className="border-t border-[var(--border)] p-4 space-y-3">
                    <p className="text-xs text-[var(--text-secondary)]">{club.purpose}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {club.skillsGained.map((sk) => (
                        <Badge key={sk} variant="success" size="sm">
                          {sk}
                        </Badge>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {(club.events || []).map((evt) => (
                        <button
                          key={evt.id}
                          type="button"
                          className="text-left rounded-xl overflow-hidden border border-[var(--border)]"
                          onClick={() => {
                            const idx = recaps.findIndex((r) => r.id === evt.id);
                            if (idx >= 0) {
                              setCategory('all');
                              setStoryIndex(idx);
                              setView('story');
                            }
                          }}
                        >
                          <CoverImage src={evt.imageUrl} alt="" className="aspect-[4/3] w-full" />
                          <p className="p-2 text-[11px] font-bold leading-snug line-clamp-2">{evt.title}</p>
                        </button>
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
