'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, MessageSquare, Calculator, Briefcase, Wrench, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { stagger, staggerItem } from '@/lib/motion';

interface TopicDetail {
  title: string;
  detail: string;
  resource: string;
}

interface Module {
  category: string;
  description: string;
  duration?: string;
  mockQuestionsCount?: number;
  topics: string[];
  topicDetails?: TopicDetail[];
  weeklyPlan?: string[];
}

function iconFor(name: string) {
  if (name.includes('Technical')) return Cpu;
  if (name.includes('Soft')) return MessageSquare;
  if (name.includes('Aptitude')) return Calculator;
  if (name.includes('Interview')) return Briefcase;
  return Wrench;
}

export default function TrainingPage() {
  const [categories, setCategories] = useState<Module[]>([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/placement-training/modules')
      .then((r) => r.json())
      .then((j) => {
        if (j.success) setCategories(j.categories || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const current = categories[active];

  return (
    <div className="space-y-8 py-6">
      <PageHeader
        badge="Training & Development"
        title="Fetchable modules with weekly plans"
        description="Technical, aptitude, behavioral, interview labs, and industry tools — each with practice links you can open today."
      />

      {loading && <p className="text-xs text-[var(--text-muted)]">Loading modules…</p>}

      <div className="flex flex-wrap gap-2">
        {categories.map((c, i) => {
          const Icon = iconFor(c.category);
          return (
            <button
              key={c.category}
              type="button"
              onClick={() => setActive(i)}
              className={`h-10 px-3.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 border transition-colors ${
                i === active
                  ? 'bg-[var(--primary)] text-[var(--primary-fg)] border-transparent'
                  : 'border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {c.category}
            </button>
          );
        })}
      </div>

      {current && (
        <motion.div key={current.category} variants={stagger(0.05)} initial="hidden" animate="visible" className="space-y-5">
          <Card className="p-6 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-black">{current.category}</h2>
              {current.duration && <Badge variant="outline" size="sm">{current.duration}</Badge>}
              {current.mockQuestionsCount ? (
                <Badge variant="primary" size="sm">{current.mockQuestionsCount} practice items</Badge>
              ) : null}
            </div>
            <p className="text-sm text-[var(--text-secondary)]">{current.description}</p>
            {current.weeklyPlan && (
              <div className="flex flex-wrap gap-2">
                {current.weeklyPlan.map((w) => (
                  <Badge key={w} variant="success" size="sm">{w}</Badge>
                ))}
              </div>
            )}
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(current.topicDetails || current.topics.map((title) => ({ title, detail: '', resource: '' }))).map((t) => (
              <motion.div key={t.title} variants={staggerItem}>
                <Card className="p-5 h-full flex flex-col gap-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--success)] shrink-0 mt-0.5" />
                    <h3 className="text-sm font-bold">{t.title}</h3>
                  </div>
                  {t.detail && <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{t.detail}</p>}
                  {t.resource && (
                    <div className="mt-auto pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        href={t.resource.startsWith('http') ? t.resource : t.resource}
                        target={t.resource.startsWith('http') ? '_blank' : undefined}
                        rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                      >
                        Open practice
                      </Button>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
