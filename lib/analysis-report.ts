import type { DashboardOverview } from '@/lib/types';

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function gapLabel(current: number, required: number) {
  const delta = required - current;
  if (delta <= 5) return 'On track';
  if (delta <= 20) return 'Close — practice weekly';
  return 'Priority gap';
}

/** Build a printable / downloadable HTML development analysis report. */
export function buildAnalysisReportHtml(data: DashboardOverview, opts?: { generatedAt?: Date }) {
  const when = (opts?.generatedAt ?? new Date()).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  const s = data.student;
  const gaps = [...data.skillGapAnalysis].sort((a, b) => b.required - b.current - (a.required - a.current));
  const priority = gaps.filter((g) => g.required - g.current > 15);

  const skillRows = gaps
    .map(
      (g) => `
      <tr>
        <td>${escapeHtml(g.skill)}</td>
        <td>${g.current}</td>
        <td>${g.required}</td>
        <td>${g.required - g.current}</td>
        <td>${escapeHtml(g.basis || gapLabel(g.current, g.required))}</td>
        <td>${escapeHtml(g.next || '')}</td>
      </tr>`
    )
    .join('');

  const actions = (data.recommendedActions || [])
    .map((a) => `<li>${escapeHtml(a)}</li>`)
    .join('');

  const skills = (s.skills || []).map((sk) => `<span class="chip">${escapeHtml(sk)}</span>`).join(' ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Campus to Career — Analysis Report · ${escapeHtml(s.fullName)}</title>
  <style>
    :root { color-scheme: light; }
    body { font-family: "Segoe UI", system-ui, sans-serif; margin: 0; padding: 32px; color: #142018; background: #faf7f2; }
    .sheet { max-width: 820px; margin: 0 auto; background: #fff; border: 1px solid #e8e1d4; border-radius: 16px; padding: 28px 32px; }
    h1 { font-size: 22px; margin: 0 0 4px; }
    h2 { font-size: 15px; margin: 28px 0 10px; color: #0f766e; text-transform: uppercase; letter-spacing: 0.06em; }
    .muted { color: #5e6b60; font-size: 13px; }
    .brand { font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #0f766e; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 18px; }
    .stat { border: 1px solid #e8e1d4; border-radius: 12px; padding: 14px; background: #faf7f2; }
    .stat b { display: block; font-size: 22px; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th, td { text-align: left; padding: 8px 10px; border-bottom: 1px solid #eee; }
    th { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #5e6b60; }
    .chip { display: inline-block; border: 1px solid #d4e8e0; background: #f0faf6; border-radius: 999px; padding: 3px 10px; font-size: 12px; margin: 2px; }
    ul { margin: 0; padding-left: 18px; font-size: 13px; line-height: 1.55; }
    .footer { margin-top: 28px; padding-top: 14px; border-top: 1px solid #e8e1d4; font-size: 11px; color: #5e6b60; }
    @media print {
      body { background: #fff; padding: 0; }
      .sheet { border: none; }
    }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="brand">Campus to Career</div>
    <h1>Student Development Analysis Report</h1>
    <p class="muted">Generated ${escapeHtml(when)} · For personal preparation use</p>

    <h2>Student profile</h2>
    <p><strong>${escapeHtml(s.fullName)}</strong><br />
    ${escapeHtml(s.branch)} · Year ${s.currentYear}<br />
    ${escapeHtml(s.collegeName)}<br />
    Target role: <strong>${escapeHtml(s.targetRole || 'Not set')}</strong></p>
    <div>${skills || '<span class="muted">No skills listed yet</span>'}</div>

    <div class="grid">
      <div class="stat"><span class="muted">Development score</span><b>${data.developmentScore}</b></div>
      <div class="stat"><span class="muted">Profile completion</span><b>${data.profileCompletion}%</b></div>
      <div class="stat"><span class="muted">Roadmap progress</span><b>${data.roadmapProgress.progressPercentage}%</b></div>
    </div>

    <h2>Roadmap snapshot</h2>
    <p class="muted">Year ${data.roadmapProgress.currentYear} · ${data.roadmapProgress.completedMilestones} of ${data.roadmapProgress.totalMilestones} milestones · ${data.applicationsCount} applications · ${data.savedResourcesCount} saved resources</p>

    <h2>Skill gap analysis</h2>
    <table>
      <thead>
        <tr><th>Skill</th><th>You</th><th>Target</th><th>Gap</th><th>How this number is set</th><th>Do this</th></tr>
      </thead>
      <tbody>${skillRows}</tbody>
    </table>

    <h2>Priority focus (${priority.length})</h2>
    ${
      priority.length
        ? `<ul>${priority.map((g) => `<li><strong>${escapeHtml(g.skill)}</strong> — ${escapeHtml(g.standing || `You are at ${g.current}% against a ${g.required}% role bar.`)} ${escapeHtml(g.next || '')}</li>`).join('')}</ul>`
        : '<p class="muted">Every checked skill meets its role bar. Sit a harder quiz to raise a score.</p>'
    }

    <h2>Recommended next actions</h2>
    <ul>${actions || '<li>Complete onboarding and refresh your skill list.</li>'}</ul>

    <div class="footer">
      Campus to Career · RGPV student growth report · Not an official placement letter.
      Open Analytics on the site to regenerate with latest data.
    </div>
  </div>
</body>
</html>`;
}

export function downloadAnalysisReport(data: DashboardOverview) {
  const html = buildAnalysisReportHtml(data);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const stamp = new Date().toISOString().slice(0, 10);
  const safeName = (data.student.fullName || 'student').replace(/[^\w\-]+/g, '_').slice(0, 40);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Campus-to-Career-Analysis-${safeName}-${stamp}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function printAnalysisReport(data: DashboardOverview) {
  const html = buildAnalysisReportHtml(data);
  const win = window.open('', '_blank', 'noopener,noreferrer,width=900,height=700');
  if (!win) return false;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => {
    win.print();
  }, 350);
  return true;
}
