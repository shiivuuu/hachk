import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  LogIn, 
  LogOut, 
  AlertOctagon, 
  ScrollText, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight,
  Filter,
  Coins,
  QrCode
} from 'lucide-react';
import { api, getActiveUser } from '../services/api';

export default function BookingsPage({ onOpenCheckIn, onOpenReturn, onOpenIncidentView }) {
  const currentUser = getActiveUser();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    loadBookings();
  }, [currentUser, filterStatus]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (filterStatus !== 'all') filters.status = filterStatus;
      const data = await api.getBookings(filters);
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    pending_approval: { label: 'Pending Manager Review', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    approved: { label: 'Approved (Ready for Step 7 Check-In)', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
    waitlisted: { label: 'Transparent Waitlist', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
    checked_in: { label: 'Checked In (Step 7 Active)', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    returned_pending_inspection: { label: 'Returned (Inspecting)', color: 'bg-teal-500/10 text-teal-400 border-teal-500/20' },
    completed: { label: 'Completed & Audited (Step 10)', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
    incident_reported: { label: 'Incident Review (Step 9)', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
    rejected: { label: 'Declined', color: 'bg-slate-800 text-slate-400 border-slate-700' }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Title & Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-indigo-400">
            Lifecycle Tracking & Auditable Records
          </span>
          <h1 className="text-2xl font-extrabold text-white mt-0.5">
            Resource Bookings & Station Passes
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Active reservations, initial condition check-ins, return handovers, and security deposit releases.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'all', label: 'All Bookings' },
            { id: 'approved', label: 'Ready for Check-In' },
            { id: 'checked_in', label: 'In Active Use' },
            { id: 'completed', label: 'Completed' },
            { id: 'incident_reported', label: 'Incidents' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterStatus(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                filterStatus === f.id
                  ? 'border-indigo-500 bg-indigo-600/20 text-white'
                  : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="p-16 text-center">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-400">Loading booking records...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="p-16 text-center rounded-2xl border border-slate-800 bg-slate-900/40">
          <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white">No bookings match this filter</h3>
          <p className="text-xs text-slate-400 mt-1">
            Request equipment in the Catalog to experience the 10-step lifecycle.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => {
            const conf = statusConfig[b.status] || { label: b.status, color: 'bg-slate-800 text-slate-300' };
            const isUserOwner = b.user_id === currentUser.id;

            return (
              <div
                key={b.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-all p-5 shadow-lg space-y-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  
                  {/* Left: Resource & Purpose */}
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40">
                        {b.booking_code}
                      </span>
                      <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${conf.color}`}>
                        {conf.label}
                      </span>
                      {b.waitlist_position && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          Queue Position #{b.waitlist_position}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-extrabold text-white">
                      {b.resource_title}
                    </h3>

                    <p className="text-xs text-slate-300">
                      <strong>Project:</strong> {b.project_title}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{new Date(b.start_time).toLocaleString()}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{b.resource_location || 'Campus Shared Core'}</span>
                      </span>
                      <span>•</span>
                      <span className="text-slate-300">
                        Applicant: <strong>{b.user_name}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Right: Lifecycle Action Triggers */}
                  <div className="flex flex-wrap items-center gap-2">
                    
                    {/* Step 7 Check-in Trigger */}
                    {b.status === 'approved' && (
                      <button
                        onClick={() => onOpenCheckIn(b)}
                        className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-600/20 transition-all"
                      >
                        <LogIn className="w-4 h-4" />
                        <span>Check In (Step 7)</span>
                      </button>
                    )}

                    {/* Step 8 Return Trigger */}
                    {b.status === 'checked_in' && (
                      <button
                        onClick={() => onOpenReturn(b)}
                        className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-teal-600/20 transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Return & Inspection (Step 8)</span>
                      </button>
                    )}

                    {/* Step 9 Incident Trigger */}
                    {b.status === 'incident_reported' && (
                      <button
                        onClick={() => onOpenIncidentView && onOpenIncidentView(b)}
                        className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition-all"
                      >
                        <AlertOctagon className="w-4 h-4" />
                        <span>Review AI Incident (Step 9)</span>
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedBooking(selectedBooking?.id === b.id ? null : b)}
                      className="px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-slate-300 hover:text-white text-xs font-semibold"
                    >
                      {selectedBooking?.id === b.id ? 'Hide Details' : 'View Audit & Pass'}
                    </button>

                  </div>

                </div>

                {/* Collapsible Inspection & Audit Details Drawer */}
                {selectedBooking?.id === b.id && (
                  <div className="pt-4 border-t border-slate-800 space-y-3 animate-in fade-in">
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      
                      {/* Step 4 Fairness Breakdown */}
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 text-xs space-y-1.5">
                        <span className="text-[10px] uppercase font-bold text-indigo-400 block">
                          Step 4 Fairness Allocation
                        </span>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Priority Score:</span>
                          <span className="font-bold text-emerald-400">{b.fairness_priority_score} / 100</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-tight">
                          {b.fairness_breakdown?.explanation || "Purpose priority and institutional trust verified."}
                        </p>
                      </div>

                      {/* Step 7 Check-in Record */}
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 text-xs space-y-1.5">
                        <span className="text-[10px] uppercase font-bold text-amber-400 block">
                          Step 7 Baseline Condition
                        </span>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Baseline Status:</span>
                          <span className="font-semibold text-white uppercase">{b.initial_condition_status || 'Not checked in yet'}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {b.checked_in_at ? `Checked in: ${new Date(b.checked_in_at).toLocaleTimeString()}` : 'Awaiting physical station check-in.'}
                        </p>
                      </div>

                      {/* Step 8 Return Record */}
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 text-xs space-y-1.5">
                        <span className="text-[10px] uppercase font-bold text-teal-400 block">
                          Step 8 Handover Condition
                        </span>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Final Handover:</span>
                          <span className="font-semibold text-white uppercase">{b.final_condition_status || 'In progress'}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {b.returned_at ? `Returned: ${new Date(b.returned_at).toLocaleTimeString()}` : 'Awaiting station checkout.'}
                        </p>
                      </div>

                    </div>

                    {b.approval_notes && (
                      <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-900/40 text-xs text-slate-300">
                        <strong className="text-indigo-400">Lab Manager Instructions:</strong> {b.approval_notes}
                      </div>
                    )}

                    {b.rejection_reason && (
                      <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-900/40 text-xs text-rose-300">
                        <strong className="text-rose-400">Decline Explanation:</strong> {b.rejection_reason}
                      </div>
                    )}

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
