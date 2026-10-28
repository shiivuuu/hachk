import React, { useState } from 'react';
import { 
  X, 
  LogOut, 
  Sparkles, 
  Camera, 
  Star, 
  AlertTriangle, 
  ShieldCheck, 
  Coins, 
  CheckCircle2, 
  AlertOctagon,
  FileSpreadsheet
} from 'lucide-react';
import { api } from '../services/api';
import confetti from 'canvas-confetti';

export default function ReturnModal({ booking, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [finalCondition, setFinalCondition] = useState('good');
  const [finalNotes, setFinalNotes] = useState('Session concluded smoothly. Machine wiped down, tools racked in order, waste collected.');
  const [cleanlinessRating, setCleanlinessRating] = useState(5);
  const [consumables, setConsumables] = useState({
    operationalHours: '3.0',
    coolantRefilled: 'Yes',
    notes: 'None'
  });
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=400');
  const [errorMsg, setErrorMsg] = useState(null);
  const [aiVerdict, setAiVerdict] = useState(null);

  const handleReturn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const payload = {
        final_condition_status: finalCondition,
        final_notes: finalNotes,
        final_photos: photoUrl ? [photoUrl] : [],
        cleanliness_rating: cleanlinessRating,
        consumables_used: consumables
      };

      const res = await api.returnBooking(booking.id, payload);
      setAiVerdict(res);
      if (!res.aiConditionAnalysis.requiresIncidentReport) {
        confetti({ particleCount: 70, spread: 60 });
      }
      setTimeout(() => {
        if (onSuccess) onSuccess(res);
      }, 2500);
    } catch (err) {
      setErrorMsg(err.message || 'Return submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
              Steps 8 & 9: Return, AI Condition Audit & Deposit Refund
            </span>
            <h2 className="text-lg font-bold text-white mt-0.5">
              Return Inspection & Sign-Off
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {aiVerdict ? (
          <div className="p-8 space-y-4">
            <div className={`w-16 h-16 rounded-2xl border mx-auto flex items-center justify-center ${
              aiVerdict.aiConditionAnalysis.requiresIncidentReport
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              {aiVerdict.aiConditionAnalysis.requiresIncidentReport ? (
                <AlertOctagon className="w-9 h-9" />
              ) : (
                <CheckCircle2 className="w-9 h-9" />
              )}
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-white">
                {aiVerdict.aiConditionAnalysis.requiresIncidentReport
                  ? 'Condition Discrepancy Flagged (Step 9 Active)'
                  : 'Return Complete & Deposit Refunded!'}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                {aiVerdict.message}
              </p>
            </div>

            {/* AI Analysis Summary Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <Sparkles className="w-4 h-4" />
                <span>AI Vision & Diff Analysis Verdict:</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {aiVerdict.aiConditionAnalysis.executiveSummary}
              </p>
              <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Severity: <strong className="uppercase text-white">{aiVerdict.aiConditionAnalysis.damageSeverity}</strong></span>
                <span className="text-slate-400">Deposit Action: <strong className="uppercase text-amber-400">{aiVerdict.depositRefundStatus}</strong></span>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleReturn} className="p-6 space-y-5">
            
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs flex justify-between items-center">
              <div>
                <p className="font-semibold text-white">Ref: <span className="font-mono text-cyan-400">{booking.booking_code}</span></p>
                <p className="text-slate-400">{booking.resource_title}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Security Deposit</span>
                <span className="text-xs font-bold text-emerald-400">${booking.resource_deposit || 150}</span>
              </div>
            </div>

            {/* Final Condition Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Final Equipment Condition Status (Step 8)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'pristine', label: 'Pristine (Clean)' },
                  { id: 'good', label: 'Good (Normal)' },
                  { id: 'wear_detected', label: 'Normal Wear' },
                  { id: 'damaged', label: 'Damage / Jam' }
                ].map(cond => (
                  <button
                    key={cond.id}
                    type="button"
                    onClick={() => setFinalCondition(cond.id)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      finalCondition === cond.id
                        ? cond.id === 'damaged' 
                          ? 'border-rose-500 bg-rose-950/40 text-white' 
                          : 'border-teal-500 bg-teal-950/40 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cond.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Cleanliness rating */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Cleanliness & Handover Rating</span>
                <span className="text-xs text-amber-400 font-bold">{cleanlinessRating} / 5 Stars</span>
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setCleanlinessRating(star)}
                    className={`p-2 rounded-xl border flex-1 flex items-center justify-center transition-all ${
                      star <= cleanlinessRating
                        ? 'border-amber-500/50 bg-amber-500/10 text-amber-400'
                        : 'border-slate-800 bg-slate-950 text-slate-600'
                    }`}
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                ))}
              </div>
            </div>

            {/* Return notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Post-Operation Handover Notes (Triggered for AI Vision Scan)
              </label>
              <textarea
                rows={3}
                required
                value={finalNotes}
                onChange={(e) => setFinalNotes(e.target.value)}
                placeholder="Mention any tool wear, strange noises, thermal alerts, or clean return details..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Consumables / Photo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Active Run Hours / Filament
                </label>
                <input
                  type="text"
                  value={consumables.operationalHours}
                  onChange={(e) => setConsumables({ ...consumables, operationalHours: e.target.value })}
                  placeholder="e.g., 3.0 hrs"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Final Inspection Photo URL
                </label>
                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                {errorMsg}
              </div>
            )}

            {/* AI Automated Diff notice */}
            <div className="p-3 rounded-xl bg-teal-950/30 border border-teal-900/40 text-[11px] text-slate-400 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                <strong>NexusEquip AI Inspection Guard:</strong> System will automatically compare this submission against your Step 7 baseline to verify deposit refund eligibility.
              </span>
            </div>

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
                disabled={loading}
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-teal-600/20"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{loading ? 'Running AI Vision Audit...' : 'Submit Return & Audit (Step 8)'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
