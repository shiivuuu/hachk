import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  ShieldAlert, 
  Calendar, 
  Clock, 
  Award, 
  Coins, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Send,
  Info
} from 'lucide-react';
import { api, getActiveUser } from '../services/api';
import confetti from 'canvas-confetti';

export default function BookingModal({ resource, onClose, onSuccess }) {
  const currentUser = getActiveUser();
  const [loading, setLoading] = useState(false);
  const [eligibility, setEligibility] = useState(null);
  const [checkingEligibility, setCheckingEligibility] = useState(true);

  // Form state
  const [startDate, setStartDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('10:00');
  const [durationHours, setDurationHours] = useState(resource.min_hours || 2);
  const [purpose, setPurpose] = useState('Academic Thesis / Core Research');
  const [projectTitle, setProjectTitle] = useState('');
  const [supervisorName, setSupervisorName] = useState('Prof. Henrik Christensen');
  const [errorMsg, setErrorMsg] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  useEffect(() => {
    checkUserEligibility();
  }, [resource, currentUser]);

  const checkUserEligibility = async () => {
    try {
      setCheckingEligibility(true);
      const data = await api.checkEligibility(resource.id, currentUser.id);
      setEligibility(data);
    } catch (err) {
      console.error(err);
    } finally {
      setCheckingEligibility(false);
    }
  };

  const calculatePreviewScore = () => {
    let base = 25;
    if (purpose.includes('Thesis')) base = 40;
    else if (purpose.includes('Coursework')) base = 30;
    else if (purpose.includes('Student')) base = 25;
    else if (purpose.includes('Exploratory')) base = 15;
    else if (purpose.includes('Commercial')) base = 10;

    const trustPart = ((currentUser.trust_score || 85) / 100) * 20;
    return (base + trustPart).toFixed(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const startDateTime = new Date(`${startDate}T${startTime}:00Z`).toISOString();
      const endDateTime = new Date(new Date(`${startDate}T${startTime}:00Z`).getTime() + durationHours * 3600000).toISOString();

      const payload = {
        resource_id: resource.id,
        user_id: currentUser.id,
        start_time: startDateTime,
        end_time: endDateTime,
        purpose,
        project_title: projectTitle || `${currentUser.name} Research Session on ${resource.title}`,
        supervisor_name: supervisorName
      };

      const result = await api.createBooking(payload);
      setSubmitSuccess(result);
      confetti({ particleCount: 75, spread: 60, origin: { y: 0.7 } });
      setTimeout(() => {
        if (onSuccess) onSuccess(result);
      }, 2000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit booking request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
              Steps 2, 3 & 4: Eligibility & Fair Access Request
            </span>
            <h2 className="text-lg font-bold text-white mt-0.5">
              Request {resource.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {submitSuccess.booking.status === 'waitlisted' ? 'Placed on Transparent Waitlist' : 'Request Submitted Successfully!'}
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                {submitSuccess.message}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 inline-block text-left text-xs space-y-1">
              <p className="text-slate-400">Booking Code: <span className="font-mono text-cyan-400 font-bold">{submitSuccess.booking.bookingCode}</span></p>
              <p className="text-slate-400">Fairness Priority Score: <span className="text-emerald-400 font-bold">{submitSuccess.booking.fairnessScore} / 100</span></p>
              <p className="text-slate-400">Status: <span className="text-indigo-400 uppercase font-semibold">{submitSuccess.booking.status}</span></p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            
            {/* Step 2 Pre-flight Eligibility Banner */}
            <div className="rounded-xl border p-3.5 bg-slate-950/50">
              {checkingEligibility ? (
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-3.5 h-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying user safety credentials and security deposits...</span>
                </div>
              ) : eligibility?.isEligible ? (
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-emerald-400">Pre-Flight Eligibility Verified (Step 2 Complete)</p>
                    <p className="text-slate-300 mt-0.5">
                      {currentUser.name} holds all required certifications ({eligibility.requirements.satisfiedCertifications.join(', ') || 'General Access'}).
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-rose-400">Missing Safety Requirements</p>
                    <p className="text-slate-300 mt-0.5">
                      Missing prerequisites: <span className="text-rose-300 font-semibold">{eligibility?.requirements.missingCertifications.join(', ')}</span>.
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Tip: Use the persona switcher in top-right to test as <strong>Alex Rivera</strong> (Certified Researcher) or upload certification.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Purpose & Fairness Weight */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Project Purpose (Affects Step 4 Fairness Score)</span>
                <span className="text-[11px] text-cyan-400 font-mono">
                  Est. Score: ~{calculatePreviewScore()} pts
                </span>
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Academic Thesis / Core Research">Academic Thesis / Core Research (+40 pts priority)</option>
                <option value="Coursework Laboratory">Coursework Laboratory (+30 pts priority)</option>
                <option value="Student Innovation / Capstone">Student Innovation / Capstone (+25 pts priority)</option>
                <option value="Exploratory Prototyping">Exploratory Prototyping (+15 pts priority)</option>
                <option value="Commercial / External Partner">Commercial / External Partner (+10 pts priority)</option>
              </select>
            </div>

            {/* Project Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Research Project Title & Objective
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Titanium Joint Machining for Assistive Prosthetic"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Date & Time Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Requested Date
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Duration (Hours)
                </label>
                <input
                  type="number"
                  min={resource.min_hours || 1}
                  max={resource.max_hours || 8}
                  value={durationHours}
                  onChange={(e) => setDurationHours(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Supervisor presence */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Faculty / Safety Supervisor
              </label>
              <input
                type="text"
                value={supervisorName}
                onChange={(e) => setSupervisorName(e.target.value)}
                placeholder="Dr. Sarah Chen / Department Safety Coordinator"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Error banner */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Anti-Monopolization notice */}
            <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-900/40 text-[11px] text-slate-400 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                <strong>NexusEquip Fair Allocation Engine Active:</strong> Rolling 7-day usage limits prevent monopolization. 
                Thesis and coursework projects receive transparent allocation priority.
              </span>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || (eligibility && !eligibility.isEligible)}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20"
              >
                {loading ? (
                  <span>Evaluating Algorithm...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Request (Step 3)</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
