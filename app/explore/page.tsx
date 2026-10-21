'use client';

import React, { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Building2, ExternalLink, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/ui/PageHeader';
import { CoverImage } from '@/components/ui/CoverImage';
import { SISTEC_BRANCHES, SISTEC_CAMPUSES } from '@/data/sistec-colleges';
import {
  SISTEC_COMPANIES,
  SISTEC_PLACEMENT_STATS,
  companiesForBranch,
} from '@/data/sistec-placement';
import { toast } from '@/components/ui/Toast';

type Tab = 'sistec' | 'branches' | 'careers' | 'companies';

export default function ExplorePage() {
  const [tab, setTab] = useState<Tab>('sistec');
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [pickedRole, setPickedRole] = useState<number>(0);
  const [companyFilter, setCompanyFilter] = useState<string>('all');

  const branch = SISTEC_BRANCHES.find((b) => b.code === selectedBranch);
  const roles = branch?.careers ?? [];
  const role = roles[pickedRole] ?? roles[0];
  const branchCompanies = selectedBranch ? companiesForBranch(selectedBranch) : [];

  const campusForBranch = useMemo(() => {
    if (!branch) return null;
    return SISTEC_CAMPUSES.find((c) =>
      branch.campuses.some((name) => c.short.includes(name.split(' ')[0]) || c.name.includes(name))
    );
  }, [branch]);

  const companyCategories = useMemo(
    () => ['all', ...Array.from(new Set(SISTEC_COMPANIES.map((c) => c.category)))],
    []
  );

  const filteredCompanies =
    companyFilter === 'all'
      ? SISTEC_COMPANIES
      : SISTEC_COMPANIES.filter((c) => c.category === companyFilter);

  return (
    <div className="space-y-8 py-6">
      <PageHeader
        badge="Explore RGPV"
        title="Campus → branch → jobs → companies"
        description="Roadmaps follow the RGPV B.Tech scheme for every affiliated college. The seats and recruiter names below are one worked example (SISTec) so you can see the shape of a season — your T&P cell publishes your own numbers."
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {[
          { label: 'Job offers', value: SISTEC_PLACEMENT_STATS.jobOffersBatch2025 },
          { label: 'Average package', value: SISTEC_PLACEMENT_STATS.averagePackageLpa },
          { label: 'Highest package', value: SISTEC_PLACEMENT_STATS.highestPackage.replace(' by BNY Mellon', '') },
          { label: 'Placement rate', value: SISTEC_PLACEMENT_STATS.campusPlacementRate },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] px-3 py-3 text-center"
          >
            <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold">{stat.label}</p>
            <p className="text-sm sm:text-base font-black text-emerald-600 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] w-fit">
        {(
          [
            ['sistec', '1. Campuses'],
            ['branches', '2. Branches'],
            ['careers', '3. Jobs'],
            ['companies', '4. Companies'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`h-10 px-4 rounded-xl text-xs font-bold ${
              tab === id ? 'bg-[var(--primary)] text-[var(--primary-fg)]' : 'text-[var(--text-muted)]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'sistec' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {SISTEC_CAMPUSES.map((c) => (
            <Card key={c.id} className="overflow-hidden p-0 flex flex-col">
              <CoverImage src={c.image} alt={c.short} className="aspect-[16/9] w-full" position="50% 40%" />
              <div className="p-5 space-y-3 flex-1 flex flex-col">
                <Badge variant="primary" size="sm">
                  {c.short} · est. {c.established}
                </Badge>
                <h3 className="font-bold text-sm leading-snug">{c.name}</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-3">{c.about}</p>
                <p className="text-[11px] text-[var(--text-muted)] inline-flex gap-1.5">
                  <MapPin className="w-3.5 h-3.5 shrink-0" /> {c.address}
                </p>
                <p className="text-[11px] text-[var(--text-muted)] inline-flex gap-1.5">
                  <Phone className="w-3.5 h-3.5 shrink-0" /> {c.phone}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {c.highlights.slice(0, 3).map((h) => (
                    <Badge key={h} variant="outline" size="sm">
                      {h}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mt-auto pt-2">
                  <Button size="sm" variant="gradient" href={c.site} target="_blank" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                    Official site
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setTab('branches')}>
                    See branches
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'branches' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {SISTEC_BRANCHES.map((b) => (
            <Card key={b.code} className="overflow-hidden p-0 flex flex-col">
              <CoverImage src={b.image} alt={b.name} className="aspect-[16/10] w-full" />
              <div className="p-4 space-y-2 flex-1 flex flex-col">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" size="sm">
                    {b.code}
                  </Badge>
                  <span className="text-[11px] text-[var(--text-muted)] text-right">{b.seats}</span>
                </div>
                <h3 className="font-bold text-sm leading-snug">{b.name}</h3>
                <p className="text-xs text-[var(--text-secondary)] line-clamp-2">{b.youLearn}</p>
                <p className="text-[11px] text-[var(--text-muted)]">{b.campuses.join(' · ')}</p>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  Jobs: {b.careers.map((c) => c.title).join(', ')}
                </p>
                <Button
                  size="sm"
                  variant="gradient"
                  className="mt-auto"
                  onClick={() => {
                    setSelectedBranch(b.code);
                    setPickedRole(0);
                    setTab('careers');
                  }}
                >
                  See jobs for {b.code}
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'careers' && !branch && (
        <div className="space-y-4">
          <p className="text-sm text-[var(--text-secondary)]">
            Tap your branch. Job titles map to companies named on sistec.ac.in T&P / CSE pages.
          </p>
          <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-5 gap-3">
            {SISTEC_BRANCHES.map((b) => (
              <button
                key={b.code}
                type="button"
                onClick={() => {
                  setSelectedBranch(b.code);
                  setPickedRole(0);
                }}
                className="text-left rounded-2xl border border-[var(--border)] overflow-hidden bg-[var(--surface-raised)] hover:border-[var(--primary)] transition-colors"
              >
                <CoverImage src={b.image} alt="" className="aspect-[4/3] w-full" />
                <div className="p-3 space-y-1">
                  <p className="text-[11px] font-black tracking-wide">{b.code}</p>
                  <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 leading-snug">{b.name}</p>
                  <p className="text-[10px] text-[var(--text-muted)]">{b.careers.length} jobs · {b.seats}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === 'careers' && branch && role && (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-5 items-start">
          <Card className="overflow-hidden p-0">
            <CoverImage
              src={branch.image}
              alt={branch.name}
              className="aspect-[21/9] w-full max-h-44"
              position="50% 30%"
            />
            <div className="p-5 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => setSelectedBranch(null)} leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
                  Change branch
                </Button>
                <Badge variant="primary" size="sm">
                  {branch.code}
                </Badge>
                <span className="text-xs text-[var(--text-muted)]">{branch.name}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {roles.map((r, i) => (
                  <button
                    key={r.title}
                    type="button"
                    onClick={() => setPickedRole(i)}
                    className={`h-9 px-3 rounded-full text-xs font-bold ${
                      i === pickedRole
                        ? 'bg-[var(--primary)] text-[var(--primary-fg)]'
                        : 'border border-[var(--border)] text-[var(--text-muted)]'
                    }`}
                  >
                    {i + 1}. {r.title}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h2 className="text-xl font-black leading-tight">{role.title}</h2>
                  <Badge variant="warning" size="sm">
                    {role.demandLevel} demand
                  </Badge>
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{role.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-[var(--border)] p-3">
                    <p className="text-[10px] font-bold uppercase text-[var(--text-muted)]">Industry</p>
                    <p className="text-xs font-semibold mt-1">{role.industry}</p>
                  </div>
                  <div className="rounded-2xl border border-[var(--border)] p-3">
                    <p className="text-[10px] font-bold uppercase text-[var(--text-muted)]">Campus pay band</p>
                    <p className="text-xs font-semibold mt-1 text-emerald-600">{role.averageSalary}</p>
                  </div>
                  <div className="rounded-2xl border border-[var(--border)] p-3">
                    <p className="text-[10px] font-bold uppercase text-[var(--text-muted)]">After this branch</p>
                    <p className="text-xs font-semibold mt-1">{branch.after}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1.5">Learn these</p>
                  <div className="flex flex-wrap gap-1.5">
                    {role.coreSkills.map((s) => (
                      <Badge key={s} variant="outline" size="sm">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
                {(role.sampleCompanies?.length || branchCompanies.length > 0) && (
                  <div>
                    <p className="text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1.5">
                      Companies that hire this path
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {(role.sampleCompanies || branchCompanies.slice(0, 8).map((c) => c.name)).map((name) => (
                        <Badge key={name} variant="success" size="sm">
                          {name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 pt-1">
                  <Button
                    variant="gradient"
                    href="/onboarding"
                    onClick={() => toast.success('Saved as target', role.title)}
                  >
                    Use this as my target
                  </Button>
                  <Button variant="outline" onClick={() => setTab('companies')}>
                    All recruiters
                  </Button>
                  <Button size="sm" variant="outline" href={branch.site} target="_blank">
                    SISTec branch page
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4 space-y-3">
            <p className="text-[10px] font-bold uppercase text-[var(--text-muted)]">Where you’ll study</p>
            {campusForBranch && (
              <CoverImage src={campusForBranch.image} alt="" className="aspect-[4/3] rounded-xl" position="50% 40%" />
            )}
            <p className="text-xs font-bold">{branch.campuses.join(' · ')}</p>
            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">{branch.youLearn}</p>
            <p className="text-[11px] text-[var(--text-muted)]">{branch.seats}</p>
            <Button size="sm" variant="outline" onClick={() => setTab('branches')}>
              All branches
            </Button>
          </Card>
        </div>
      )}

      {tab === 'companies' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h2 className="text-lg font-black">Campus recruiters & CoE partners</h2>
              <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-2xl">
                Named on sistec.ac.in Training & Placement, CSE department, Centres of Excellence, and Placement Bulletin
                2023-VI. Stats: {SISTEC_PLACEMENT_STATS.jobOffersBatch2025} offers · placement rate{' '}
                {SISTEC_PLACEMENT_STATS.campusPlacementRate} · {SISTEC_PLACEMENT_STATS.highestPackage}.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              href={SISTEC_PLACEMENT_STATS.sourceUrl}
              target="_blank"
              rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
            >
              Official T&P
            </Button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {companyCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCompanyFilter(cat)}
                className={`h-9 px-3 rounded-full text-xs font-bold capitalize ${
                  companyFilter === cat
                    ? 'bg-emerald-600 text-white'
                    : 'border border-[var(--border)] text-[var(--text-muted)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {filteredCompanies.map((company) => (
              <Card key={company.name} className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  {company.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={company.logo}
                      alt=""
                      className="w-12 h-12 object-contain rounded-xl bg-white border border-[var(--border)] p-1.5"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-[var(--surface-inset)] inline-flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-[var(--primary)]" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm leading-snug">{company.name}</h3>
                    <Badge variant="outline" size="sm" className="mt-1">
                      {company.category}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{company.note}</p>
                <div>
                  <p className="text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">Roles seen on campus</p>
                  <div className="flex flex-wrap gap-1.5">
                    {company.roles.map((r) => (
                      <Badge key={r} variant="success" size="sm">
                        {r}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-[var(--text-muted)] mb-1">Branches</p>
                  <p className="text-[11px] text-[var(--text-secondary)]">{company.branches.join(' · ')}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
