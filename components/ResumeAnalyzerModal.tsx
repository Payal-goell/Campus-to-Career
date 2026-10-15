'use client';

import React, { useState } from 'react';
import { FileText, Sparkles, CheckCircle2, AlertCircle, X, ArrowRight, Upload } from 'lucide-react';

interface ResumeAnalysisResult {
  atsScore: number;
  foundKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
}

export function ResumeAnalyzerModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResumeAnalysisResult | null>(null);

  const sampleResume = `AARAV SHARMA
SDE Intern candidate | B.Tech CSE, RGPV
aarav.sharma@uitrgpv.ac.in | github.com/aaravsharma | linkedin.com/in/aaravsharma | +91 98765 43210

EDUCATION
University Institute of Technology, RGPV Bhopal — B.Tech Computer Science & Engineering | CGPA: 8.7 / 10.0 (2026)

TECHNICAL SKILLS
Languages: TypeScript, JavaScript, Python, C++, SQL
Frameworks: React.js, Next.js, Node.js, Express, Tailwind CSS
Databases & Cloud: PostgreSQL, Prisma ORM, Redis, AWS (S3, EC2)
Tools: Git, Docker, REST APIs, System Design, Linux

PROJECTS
Campus Dining Tracker & Wait Estimation
• Architected full-stack web application serving 3,000+ daily student meals.
• Reduced order latency by 45% using Redis caching and PostgreSQL query indexing.
• Implemented role-based authentication and automated CI/CD deployment pipelines.

Algorithmic Trading Backtester
• Engineered modular Python backtesting framework testing RSI and moving average strategies.
• Processed 500,000 historical price ticks with NumPy and visualized execution graphs.`;

  const handleAnalyze = async (textToScan = resumeText) => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/placement-training/resume/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: textToScan }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleFillSample = () => {
    setResumeText(sampleResume);
    handleAnalyze(sampleResume);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="glass-panel rounded-3xl max-w-2xl w-full p-6 border border-white/15 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">AI-Powered Resume ATS Scanner</h3>
            <p className="text-xs text-slate-400">
              Check ATS keyword compatibility and metric-based scoring against Tier-1 benchmarks
            </p>
          </div>
        </div>

        {/* Input Text Area */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">
              Paste Resume Content or Use Demo Sample:
            </label>
            <button
              onClick={handleFillSample}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium underline"
            >
              Fill Sample Resume & Scan
            </button>
          </div>

          <textarea
            rows={5}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste raw resume text here (education, technical skills, projects, metrics)..."
            className="w-full bg-slate-900/90 border border-white/10 rounded-2xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
          />

          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => handleAnalyze()}
              disabled={loading || !resumeText.trim()}
              className="glow-btn px-5 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-2"
            >
              {loading ? 'Analyzing Keywords...' : 'Run ATS Scan'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Result Display */}
        {result && (
          <div className="mt-6 pt-5 border-t border-white/10 space-y-4 animate-fadeIn">
            {/* Score header */}
            <div className="glass-card rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block mb-0.5">Overall ATS Compatibility Score</span>
                <h4 className="text-2xl font-black text-white flex items-center gap-2">
                  <span className={result.atsScore >= 80 ? 'text-emerald-400' : 'text-indigo-400'}>
                    {result.atsScore}%
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {result.atsScore >= 80 ? 'Top 10% Applicant Alignment' : 'Good Match'}
                  </span>
                </h4>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-indigo-500 flex items-center justify-center font-bold text-sm text-indigo-300">
                {result.atsScore}/100
              </div>
            </div>

            {/* Keyword badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-3.5">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="w-4 h-4" /> Detected ATS Keywords ({result.foundKeywords?.length || 0})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {result.foundKeywords?.map((kw) => (
                    <span
                      key={kw}
                      className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 text-[11px] font-mono border border-emerald-500/20"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-amber-950/20 border border-amber-500/20 rounded-2xl p-3.5">
                <span className="font-bold text-amber-400 flex items-center gap-1.5 mb-2">
                  <AlertCircle className="w-4 h-4" /> Missing Keywords to Add
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {result.missingKeywords?.map((kw) => (
                    <span
                      key={kw}
                      className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 text-[11px] font-mono border border-amber-500/20"
                    >
                      + {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-slate-900/80 rounded-2xl p-4 border border-white/5 space-y-2">
              <span className="text-xs font-bold text-slate-200 block">
                Actionable Optimization Tips:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {result.suggestions?.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
