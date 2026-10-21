'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Medal, Sparkles, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { stagger, staggerItem } from '@/lib/motion';
import { CERT_CATALOG, type CertRec } from '@/data/cert-recommendations';

export default function CertificationsPage() {
  const [recs, setRecs] = useState<CertRec[]>([]);
  const [context, setContext] = useState<{ year?: number; targetRole?: string }>({});
  const [loading, setLoading] = useState(true);
  const [cost, setCost] = useState<'all' | 'free' | 'paid'>('all');

  const load = () => {
    setLoading(true);
    fetch('/api/v1/certifications/recommend')
      .then((r) => r.json())
      .then((j) => {
        if (j.success) {
          setRecs(j.recommended || []);
          setContext(j.context || {});
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const shown = cost === 'all' ? recs : recs.filter((c) => c.cost === cost);
  const catalog = cost === 'all' ? CERT_CATALOG : CERT_CATALOG.filter((c) => c.cost === cost);

  return (
    <div className="space-y-8 py-6">
      <PageHeader
        badge="AI recommendations"
        title="Certifications you can actually finish"
        description={
          context.targetRole
            ? `Ranked for Year ${context.year ?? '—'} · ${context.targetRole}. Each one is free to finish on a student schedule.`
            : 'Sign in for a profile-aware list. Until then, we rank free credentials you can finish in a semester.'
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex gap-1 p-1 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)]">
              {(['all', 'free', 'paid'] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCost(c)}
                  className={`h-9 px-3 rounded-xl text-xs font-bold capitalize ${
                    cost === c ? 'bg-[var(--primary)] text-[var(--primary-fg)]' : 'text-[var(--text-muted)]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <Button size="sm" variant="outline" leftIcon={<Sparkles className="w-3.5 h-3.5" />} onClick={load} loading={loading}>
              Refresh ranking
            </Button>
          </div>
        }
      />

      {!loading && shown.length === 0 && (
        <p className="text-sm text-[var(--text-muted)]">Every credential here is free to finish with a college email.</p>
      )}

      <motion.div variants={stagger(0.05)} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {shown.map((c) => (
          <motion.div key={c.id} variants={staggerItem}>
            <Card className="p-5 sm:p-6 h-full flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <span className="w-10 h-10 rounded-xl bg-[var(--primary-subtle)] text-[var(--primary)] inline-flex items-center justify-center shrink-0">
                  <Medal className="w-5 h-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm leading-snug">{c.name}</h3>
                  <p className="text-xs text-[var(--text-muted)]">{c.issuer}</p>
                </div>
                <Badge variant={c.cost === 'free' ? 'success' : 'warning'} size="sm">
                  {c.cost === 'free' ? 'Free' : 'Paid exam'}
                </Badge>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{c.why}</p>
              <p className="text-[11px] text-[var(--text-muted)]">{c.feasible}</p>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="outline" size="sm">{c.hours}</Badge>
                <Badge variant="outline" size="sm">{c.weeks} weeks</Badge>
                {c.year.map((y) => (
                  <Badge key={y} variant="primary" size="sm">Y{y}</Badge>
                ))}
              </div>
              <div className="mt-auto pt-1">
                <Button size="sm" variant="gradient" href={c.url} target="_blank" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                  Open provider
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="space-y-3">
        <h2 className="text-sm font-bold">Full catalog ({catalog.filter((c) => c.cost === 'free').length} free · {catalog.length} total in this filter)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {catalog.map((c) => (
            <Card key={`cat-${c.id}`} className="p-4 space-y-2">
              <div className="flex justify-between gap-2">
                <h3 className="font-bold text-xs leading-snug">{c.name}</h3>
                <Badge variant={c.cost === 'free' ? 'success' : 'warning'} size="sm">
                  {c.cost}
                </Badge>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">{c.issuer} · {c.weeks} weeks</p>
              <Button size="sm" variant="outline" href={c.url} target="_blank" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                Open
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
