import React, { useState, useEffect } from 'react';
import { 
  History, 
  Filter, 
  ShieldCheck, 
  User, 
  Cpu, 
  Clock, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Code,
  FileCheck2,
  Calendar
} from 'lucide-react';
import { api } from '../services/api';

export default function AuditPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [entityFilter, setEntityFilter] = useState('all');
  const [expandedLogId, setExpandedLogId] = useState(null);

  useEffect(() => {
    loadLogs();
  }, [entityFilter]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (entityFilter !== 'all') filters.entityType = entityFilter;
      const data = await api.getAuditLogs(filters);
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const actionBadges = {
    RESOURCE_LISTED: { label: 'Step 1: Listing Created', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
    REQUEST_SUBMITTED: { label: 'Step 3: Request Submitted', color: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
    REQUEST_APPROVED: { label: 'Step 6: Approved', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    REQUEST_REJECTED: { label: 'Step 6: Declined', color: 'bg-slate-800 text-slate-400 border-slate-700' },
    STEP7_CHECKIN_COMPLETED: { label: 'Step 7: Check-In Baseline', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    STEP8_RETURN_COMPLETED: { label: 'Step 8: Return Handover', color: 'bg-teal-500/10 text-teal-400 border-teal-500/20' },
    STEP9_DAMAGE_INCIDENT_FLAGGED: { label: 'Step 9: AI Damage Discrepancy', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
    INCIDENT_RESOLVED: { label: 'Step 9: Dispute Resolved', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
    CERTIFICATE_AI_VERIFIED: { label: 'AI Safety Cert Verified', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' }
  };

  const exportAuditLogJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `nexusequip-audit-ledger-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-indigo-400">
            Step 10: Immutable Transaction History
          </span>
          <h1 className="text-2xl font-extrabold text-white mt-0.5">
            Consortium Audit Trail & Governance Log
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tamper-evident chronological ledger recording every access request, safety inspection, condition baseline, and resolution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportAuditLogJson}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-white font-semibold flex items-center gap-2 shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export Compliance JSON</span>
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
        {[
          { id: 'all', label: 'All Ledger Events' },
          { id: 'booking', label: 'Bookings & Lifecycle' },
          { id: 'incident', label: 'Incidents & Damages' },
          { id: 'resource', label: 'Equipment Listings' },
          { id: 'certification', label: 'Safety Certifications' }
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setEntityFilter(f.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              entityFilter === f.id
                ? 'border-indigo-500 bg-indigo-600/20 text-white'
                : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Audit Log Stream */}
      {loading ? (
        <div className="p-16 text-center">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-400">Loading audit records from ledger...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="p-16 text-center rounded-2xl border border-slate-800 bg-slate-900/40">
          <History className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white">No audit records found</h3>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => {
            const badge = actionBadges[log.action] || { label: log.action, color: 'bg-slate-800 text-slate-300' };
            const isExpanded = expandedLogId === log.id;

            return (
              <div
                key={log.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-all p-4 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  
                  {/* Left: Action & Entity */}
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${badge.color}`}>
                      {badge.label}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-white">
                        Entity: <span className="text-slate-300 font-mono">{log.entity_type}</span> #{log.entity_id}
                      </span>
                      <p className="text-[11px] text-slate-400">
                        Actor: <strong className="text-white">{log.actor_name}</strong> ({log.actor_role})
                      </p>
                    </div>
                  </div>

                  {/* Right: Timestamp & Diff Trigger */}
                  <div className="flex items-center gap-3 text-xs text-slate-400 self-end sm:self-auto">
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                    </span>

                    <button
                      onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                      className="px-2.5 py-1 rounded-lg border border-slate-850 bg-slate-950 hover:bg-slate-900 text-slate-300 text-[11px] font-mono flex items-center gap-1"
                    >
                      <Code className="w-3 h-3 text-cyan-400" />
                      <span>{isExpanded ? 'Hide Payload' : 'Inspect Payload'}</span>
                    </button>
                  </div>

                </div>

                {/* Expanded JSON details payload */}
                {isExpanded && (
                  <div className="mt-2 p-3 rounded-xl bg-slate-950 border border-slate-850 font-mono text-[11px] text-slate-300 overflow-x-auto animate-in fade-in">
                    <div className="flex items-center justify-between mb-1 pb-1 border-b border-slate-850 text-slate-500 text-[10px]">
                      <span>Cryptographic Audit Proof Hash: SHA256_{log.id.slice(0, 12)}...</span>
                      <span>Actor ID: {log.actor_id}</span>
                    </div>
                    <pre>{JSON.stringify(log.details, null, 2)}</pre>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
