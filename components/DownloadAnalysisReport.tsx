'use client';

import { useState } from 'react';
import { Download, Printer, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { toast } from '@/components/ui/Toast';
import { downloadAnalysisReport, printAnalysisReport } from '@/lib/analysis-report';
import type { DashboardOverview } from '@/lib/types';

export function DownloadAnalysisReport({ data }: { data: DashboardOverview }) {
  const [busy, setBusy] = useState(false);
  const gaps = data.skillGapAnalysis.filter((g) => g.required - g.current > 15).length;

  const onDownload = () => {
    setBusy(true);
    try {
      downloadAnalysisReport(data);
      toast.success('Report downloaded', 'Open the HTML file in any browser, or print to PDF.');
    } catch {
      toast.error('Download failed', 'Try again or use Print / Save as PDF.');
    } finally {
      setBusy(false);
    }
  };

  const onPrint = () => {
    const ok = printAnalysisReport(data);
    if (!ok) {
      toast.error('Pop-up blocked', 'Allow pop-ups for this site, then try Print again.');
      return;
    }
    toast.success('Print dialog ready', 'Choose “Save as PDF” in the print sheet if you need a PDF.');
  };

  return (
    <Card className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 border border-[var(--border)] bg-[var(--surface-raised)]">
      <div className="w-11 h-11 rounded-2xl bg-emerald-600/15 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
        <FileText className="w-5 h-5" />
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <h2 className="text-sm font-bold text-[var(--text-primary)]">Downloadable analysis report</h2>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          Score, skill gaps, roadmap snapshot, and next actions for{' '}
          <span className="font-semibold text-[var(--text-primary)]">{data.student.fullName}</span>
          {gaps > 0 ? ` · ${gaps} priority gap${gaps === 1 ? '' : 's'}` : ''}. Save HTML or print to PDF.
        </p>
      </div>
      <div className="flex flex-wrap gap-2 shrink-0">
        <Button size="sm" variant="gradient" loading={busy} onClick={onDownload} leftIcon={<Download className="w-3.5 h-3.5" />}>
          Download report
        </Button>
        <Button size="sm" variant="outline" onClick={onPrint} leftIcon={<Printer className="w-3.5 h-3.5" />}>
          Print / PDF
        </Button>
      </div>
    </Card>
  );
}
