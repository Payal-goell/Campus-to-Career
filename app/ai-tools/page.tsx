'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Shield, Sparkles, ExternalLink, Copy, Check } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { ResumeAnalyzerModal } from '@/components/ResumeAnalyzerModal';
import { AI_HELP_TOOLS, AI_USE_CASES } from '@/data/ai-help';
import { stagger, staggerItem } from '@/lib/motion';

export default function AiToolsPage() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1600);
  };

  return (
    <div className="space-y-8 py-6">
      <PageHeader
        badge="AI Tools"
        title="Where to take help — and how"
        description="Recommended assistants for labs, resumes, and debug loops. Copy a prompt, then verify every fact in a textbook or docs."
        actions={
          <Button size="sm" variant="gradient" leftIcon={<FileText className="w-3.5 h-3.5" />} onClick={() => setOpen(true)}>
            Resume ATS scan
          </Button>
        }
      />

      <motion.div variants={stagger(0.04)} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {AI_HELP_TOOLS.map((t) => (
          <motion.div key={t.id} variants={staggerItem}>
            <Card className="p-5 sm:p-6 h-full flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-sm">{t.name}</h3>
                  <p className="text-[11px] text-[var(--text-muted)]">{t.vendor} · {t.cost} · {t.yearUse}</p>
                </div>
                <Sparkles className="w-4 h-4 text-[var(--primary)] shrink-0" />
              </div>
              <p className="text-xs text-[var(--text-secondary)]">{t.bestFor}</p>
              <p className="text-[11px] rounded-xl bg-[var(--surface-inset)] border border-[var(--border)] p-3 leading-relaxed">
                Prompt: {t.prompt}
              </p>
              <p className="text-[11px] text-[var(--text-muted)] inline-flex items-start gap-1">
                <Shield className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {t.guideline}
              </p>
              <div className="flex flex-wrap gap-2 mt-auto pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={copied === t.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  onClick={() => copy(t.id, t.prompt)}
                >
                  {copied === t.id ? 'Copied' : 'Copy prompt'}
                </Button>
                <Button size="sm" variant="gradient" href={t.url} target="_blank" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                  Open
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {AI_USE_CASES.map((u) => (
          <Card key={u.title} className="p-4 space-y-1">
            <h4 className="text-sm font-bold">{u.title}</h4>
            <p className="text-xs text-[var(--text-secondary)]">{u.detail}</p>
          </Card>
        ))}
      </div>

      <ResumeAnalyzerModal isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
}
