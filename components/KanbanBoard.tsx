'use client';

import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  MapPin,
  DollarSign,
  Calendar,
  Trash2,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Clock,
  Building,
} from 'lucide-react';
import { ApplicationItem } from '@/lib/types';

interface KanbanBoardProps {
  initialApplications: ApplicationItem[];
  onRefresh?: () => void;
}

const COLUMNS: Array<{ id: ApplicationItem['status']; label: string; color: string; border: string }> = [
  { id: 'SAVED', label: 'Saved Wishlist', color: 'bg-slate-500/10 text-slate-300', border: 'border-slate-500/30' },
  { id: 'APPLIED', label: 'Applied', color: 'bg-blue-500/10 text-blue-300', border: 'border-blue-500/30' },
  { id: 'INTERVIEWING', label: 'Interviewing', color: 'bg-amber-500/10 text-amber-300', border: 'border-amber-500/30' },
  { id: 'OFFERED', label: 'Offers Received', color: 'bg-emerald-500/10 text-emerald-300', border: 'border-emerald-500/30' },
  { id: 'REJECTED', label: 'Archived', color: 'bg-rose-500/10 text-rose-300', border: 'border-rose-500/30' },
];

export function KanbanBoard({ initialApplications, onRefresh }: KanbanBoardProps) {
  const [applications, setApplications] = useState<ApplicationItem[]>(initialApplications);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // New application form state
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newLocation, setNewLocation] = useState('Remote / Hybrid');
  const [newSalary, setNewSalary] = useState('');
  const [newStatus, setNewStatus] = useState<ApplicationItem['status']>('APPLIED');
  const [newNotes, setNewNotes] = useState('');

  const handleStatusChange = async (appId: string, status: ApplicationItem['status']) => {
    // Optimistic UI update
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status } : app))
    );

    try {
      await fetch('/api/v1/placement-training/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: appId, status }),
      });
      if (onRefresh) onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (appId: string) => {
    if (!confirm('Are you sure you want to remove this application?')) return;
    setApplications((prev) => prev.filter((a) => a.id !== appId));
    try {
      await fetch(`/api/v1/placement-training/applications?id=${appId}`, {
        method: 'DELETE',
      });
      if (onRefresh) onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany || !newRole) return;

    setLoading(true);
    try {
      const res = await fetch('/api/v1/placement-training/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: newCompany,
          role: newRole,
          location: newLocation,
          salary: newSalary,
          status: newStatus,
          notes: newNotes,
        }),
      });

      const data = await res.json();
      if (data.success && data.application) {
        setApplications((prev) => [data.application, ...prev]);
        setShowAddModal(false);
        setNewCompany('');
        setNewRole('');
        setNewSalary('');
        setNewNotes('');
        if (onRefresh) onRefresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with stats and Add button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-400" />
            Placement & Internship Application Tracker
          </h3>
          <p className="text-xs text-slate-400">
            Track full recruitment cycles, scheduled rounds, and formal offers
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="glow-btn px-3.5 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Add Application
        </button>
      </div>

      {/* Columns Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5 pb-4">
        {COLUMNS.map((col) => {
          const colApps = applications.filter((a) => a.status === col.id);
          return (
            <div
              key={col.id}
              className="rounded-2xl p-3 min-w-0 md:min-w-[200px] flex flex-col min-h-[280px] md:min-h-[380px] border border-[var(--border)] bg-[var(--surface)]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${col.color}`}>
                  {col.label}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-white/5">
                  {colApps.length}
                </span>
              </div>

              {/* Applications in Column */}
              <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[500px]">
                {colApps.length === 0 ? (
                  <div className="h-32 border border-dashed border-white/10 rounded-xl flex items-center justify-center text-slate-600 text-xs">
                    No roles here
                  </div>
                ) : (
                  colApps.map((app) => (
                    <div
                      key={app.id}
                      className="glass-card rounded-xl p-3 border border-white/10 hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-2"
                    >
                      <div>
                        <div className="flex items-start justify-between">
                          <h4 className="font-bold text-white text-xs truncate max-w-[140px]">
                            {app.company}
                          </h4>
                          <button
                            onClick={() => handleDelete(app.id)}
                            className="text-slate-500 hover:text-rose-400 transition-colors p-0.5"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] font-medium text-indigo-300 mt-0.5 line-clamp-1">
                          {app.role}
                        </p>
                      </div>

                      <div className="space-y-1 text-[10px] text-slate-400">
                        {app.location && (
                          <div className="flex items-center gap-1 truncate">
                            <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                            <span>{app.location}</span>
                          </div>
                        )}
                        {app.salary && (
                          <div className="flex items-center gap-1 text-emerald-400 font-medium truncate">
                            <DollarSign className="w-3 h-3 shrink-0" />
                            <span>{app.salary}</span>
                          </div>
                        )}
                      </div>

                      {/* Interviews tag if any */}
                      {app.interviews && app.interviews.length > 0 && (
                        <div className="bg-slate-900/80 rounded-lg p-2 text-[10px] space-y-1 border border-white/5">
                          <span className="text-[9px] font-semibold text-amber-400 uppercase tracking-wider block">
                            Interview Rounds ({app.interviews.length})
                          </span>
                          {app.interviews.map((iv) => (
                            <div key={iv.id} className="flex items-center justify-between text-slate-300">
                              <span className="truncate max-w-[110px]">{iv.round}</span>
                              <span className={`px-1 rounded text-[9px] ${
                                iv.status === 'CLEARED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-blue-500/20 text-blue-300'
                              }`}>
                                {iv.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {app.notes && (
                        <p className="text-[10px] text-slate-400 italic bg-white/5 p-1.5 rounded">
                          "{app.notes}"
                        </p>
                      )}

                      {/* Move to another column select */}
                      <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] text-slate-500">Stage:</span>
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationItem['status'])}
                          className="bg-slate-900 text-slate-300 text-[10px] rounded px-1.5 py-0.5 border border-white/10 focus:outline-none focus:border-indigo-500 cursor-pointer"
                        >
                          {COLUMNS.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel rounded-2xl max-w-md w-full p-6 border border-white/15 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Add Job / Internship Application</h3>
            <p className="text-xs text-slate-400 mb-4">Record role details, target stipend, and application status.</p>

            <form onSubmit={handleAddSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Company *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google, Stripe, Microsoft"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Job Role *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Software Engineering Intern"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. San Francisco / Remote"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Stipend / CTC</label>
                  <input
                    type="text"
                    placeholder="e.g. $55/hr or ₹18 LPA"
                    value={newSalary}
                    onChange={(e) => setNewSalary(e.target.value)}
                    className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Initial Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ApplicationItem['status'])}
                  className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {COLUMNS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Notes / Links</label>
                <textarea
                  rows={2}
                  placeholder="Referral name, recruiter email, or drive notes..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="glow-btn px-4 py-1.5 rounded-xl text-xs font-semibold text-white"
                >
                  {loading ? 'Saving...' : 'Save Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
