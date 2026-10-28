import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertOctagon, 
  Sparkles, 
  Coins, 
  ChevronRight,
  Award,
  Users,
  Building2,
  FileText
} from 'lucide-react';
import { api, getActiveUser } from '../services/api';
import confetti from 'canvas-confetti';

export default function ManagerDashboard({ onOpenResolveIncident }) {
  const currentUser = getActiveUser();
  const [pendingBookings, setPendingBookings] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [waitlistedBookings, setWaitlistedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('requests'); // requests | incidents | waitlist
  const [actionNotes, setActionNotes] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, [currentUser]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [allBookings, allIncidents] = await Promise.all([
        api.getBookings(),
        api.getIncidents()
      ]);

      setPendingBookings(allBookings.filter(b => b.status === 'pending_approval'));
      setWaitlistedBookings(allBookings.filter(b => b.status === 'waitlisted'));
      setIncidents(allIncidents);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (b) => {
    try {
      await api.approveBooking(b.id, actionNotes || 'Approved following standard facility safety protocol.');
      confetti({ particleCount: 50, spread: 50 });
      setActionNotes('');
      loadDashboardData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReject = async (b) => {
    const reason = prompt('Please provide transparent reason for decline (required by Consortium):', 'Priority allocated to departmental capstone exam.');
    if (!reason) return;
    try {
      await api.rejectBooking(b.id, reason);
      loadDashboardData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-purple-400">
            Institutional Safety & Resource Governance
          </span>
          <h1 className="text-2xl font-extrabold text-white mt-0.5">
            Lab Manager & Safety Officer Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review applicant credentials, authorize access passes, monitor fair usage curves, and adjudicate damage reports.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'requests'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Requests ({pendingBookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('incidents')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'incidents'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Incidents ({incidents.filter(i => i.status !== 'resolved').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('waitlist')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'waitlist'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Waitlist ({waitlistedBookings.length})</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-400">Loading governance queues...</p>
        </div>
      ) : activeTab === 'requests' ? (
        
        /* Pending Requests Queue (Steps 5 & 6) */
        <div className="space-y-4">
          {pendingBookings.length === 0 ? (
            <div className="p-16 text-center rounded-2xl border border-slate-800 bg-slate-900/40">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-white">All Request Queues Cleared!</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                No bookings are currently pending human manager review. Switch to researcher persona to submit a new test request.
              </p>
            </div>
          ) : (
            pendingBookings.map((b) => (
              <div
                key={b.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40">
                        {b.booking_code}
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Awaiting Manager Oversight (Step 5)
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-white">
                      {b.resource_title}
                    </h3>

                    <p className="text-xs text-slate-300">
                      <strong>Applicant:</strong> {b.user_name} ({b.user_institution}) • Trust Rating: <span className="text-emerald-400 font-bold">{b.user_trust_score}%</span>
                    </p>

                    <p className="text-xs text-slate-400">
                      <strong>Project:</strong> {b.project_title} ({b.purpose})
                    </p>

                    <p className="text-xs text-slate-400">
                      <strong>Time Window:</strong> {new Date(b.start_time).toLocaleString()} to {new Date(b.end_time).toLocaleTimeString()}
                    </p>
                  </div>

                  {/* Fairness Score Breakdown Card */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 lg:w-72 shrink-0 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-indigo-400">
                        Fairness Priority Score
                      </span>
                      <span className="text-sm font-extrabold text-emerald-400">
                        {b.fairness_priority_score} / 100
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-tight">
                      {b.fairness_breakdown?.explanation || "Calculated using rolling 7-day usage & purpose weight."}
                    </p>
                    <div className="pt-1.5 border-t border-slate-850 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Monopolization Risk:</span>
                      <span className="text-emerald-400 font-semibold">Low (Clean Access)</span>
                    </div>
                  </div>

                </div>

                {/* Manager Actions */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => handleReject(b)}
                    className="px-4 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Decline with Reason (Step 6)</span>
                  </button>

                  <button
                    onClick={() => handleApprove(b)}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/20"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Authorize Access Pass (Step 6)</span>
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

      ) : activeTab === 'incidents' ? (
        
        /* Incidents & Damage Queue (Step 9) */
        <div className="space-y-4">
          {incidents.length === 0 ? (
            <div className="p-16 text-center rounded-2xl border border-slate-800 bg-slate-900/40">
              <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-white">Zero Active Equipment Incidents</h3>
              <p className="text-xs text-slate-400 mt-1">All facilities operating without reported hardware disputes.</p>
            </div>
          ) : (
            incidents.map((inc) => (
              <div
                key={inc.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-rose-400 px-2 py-0.5 rounded bg-rose-950/60 border border-rose-800/40">
                        {inc.id}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                        inc.status === 'resolved' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {inc.status}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1">
                      {inc.resource_title} — {inc.incident_type.replace('_', ' ').toUpperCase()}
                    </h3>
                  </div>

                  {inc.status !== 'resolved' && (
                    <button
                      onClick={() => onOpenResolveIncident(inc)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md self-start sm:self-auto"
                    >
                      Adjudicate Incident (Step 9)
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-300">
                  {inc.description}
                </p>

                {inc.ai_analysis_summary && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
                    <span className="text-cyan-400 font-bold flex items-center gap-1 text-[11px]">
                      <Sparkles className="w-3.5 h-3.5" />
                      AI Vision Root Cause:
                    </span>
                    <p className="text-slate-300 text-[11px]">{inc.ai_analysis_summary}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      ) : (

        /* Waitlist & Prioritization (Anti-Monopolization) */
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-900/40 text-xs text-slate-300 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">Explainable Dynamic Waitlist Algorithm Active</p>
              <p className="text-slate-400 mt-0.5">
                Queue positions are ordered mathematically based on purpose weights (Thesis &gt; Coursework &gt; Commercial), 
                institutional trust scores, starvation protection bonus (+1.5 pts/hour waiting), and anti-monopolization usage penalties.
              </p>
            </div>
          </div>

          {waitlistedBookings.length === 0 ? (
            <div className="p-16 text-center rounded-2xl border border-slate-800 bg-slate-900/40">
              <Clock className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-white">No Bookings Currently Waitlisted</h3>
              <p className="text-xs text-slate-400 mt-1">Available slots accommodate all current reservation demand.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {waitlistedBookings.map((wb, idx) => (
                <div
                  key={wb.id}
                  className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 font-extrabold flex items-center justify-center text-sm border border-purple-500/30">
                      #{idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{wb.resource_title}</h4>
                      <p className="text-[11px] text-slate-400">{wb.user_name} • {wb.purpose}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-emerald-400 block">{wb.fairness_priority_score} pts</span>
                    <span className="text-[10px] text-slate-400">Fairness Rank</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      )}

    </div>
  );
}
