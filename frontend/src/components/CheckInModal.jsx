import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  ShieldCheck, 
  Camera, 
  CheckSquare, 
  FileCheck, 
  AlertTriangle,
  QrCode
} from 'lucide-react';
import { api } from '../services/api';
import confetti from 'canvas-confetti';

export default function CheckInModal({ booking, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [initialCondition, setInitialCondition] = useState('good');
  const [initialNotes, setInitialNotes] = useState('Equipment inspected upon arrival. Bed clean, emergency stop tested, power on self-test clean.');
  const [checklist, setChecklist] = useState({
    eStopTested: true,
    ppeEquipped: true,
    areaClean: true,
    preExistingWearDocumented: false
  });
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400');
  const [errorMsg, setErrorMsg] = useState(null);
  const [resultPass, setResultPass] = useState(null);

  const toggleCheck = (key) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCheckin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const payload = {
        initial_condition_status: initialCondition,
        initial_notes: initialNotes,
        initial_photos: photoUrl ? [photoUrl] : [],
        checklist_answers: checklist,
        supervisor_signature: 'Verified & Digitally Signed'
      };

      const res = await api.checkInBooking(booking.id, payload);
      setResultPass(res.checkin);
      confetti({ particleCount: 60, spread: 50 });
      setTimeout(() => {
        if (onSuccess) onSuccess(res);
      }, 1800);
    } catch (err) {
      setErrorMsg(err.message || 'Check-in failed');
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
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
              Step 7 in Sharing Lifecycle
            </span>
            <h2 className="text-lg font-bold text-white mt-0.5">
              Check-In & Initial Condition Documentation
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {resultPass ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center">
              <QrCode className="w-9 h-9" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Check-In Complete! Digital Pass Active
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                Your initial condition baseline is immutably recorded in the institutional audit ledger.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 inline-block font-mono text-center">
              <p className="text-[11px] text-slate-400 uppercase">Station Access Pass Code</p>
              <p className="text-xl font-extrabold text-cyan-400 tracking-wider mt-1">{resultPass.passCode}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCheckin} className="p-6 space-y-5">
            
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
              <p className="font-semibold text-white">Booking Ref: <span className="font-mono text-cyan-400">{booking.booking_code}</span></p>
              <p className="text-slate-400 mt-0.5">Resource: {booking.resource_title}</p>
            </div>

            {/* Condition selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Initial Equipment Condition (Step 7 Baseline)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'pristine', label: 'Pristine (Like New)' },
                  { id: 'good', label: 'Good (Normal)' },
                  { id: 'fair', label: 'Fair (Used)' },
                  { id: 'pre_existing_damage', label: 'Has Pre-Existing Wear' }
                ].map(cond => (
                  <button
                    key={cond.id}
                    type="button"
                    onClick={() => setInitialCondition(cond.id)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      initialCondition === cond.id
                        ? 'border-indigo-500 bg-indigo-950/40 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cond.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Safety Checklist */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />
                <span>Station Safety Checklist</span>
              </label>
              <div className="space-y-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.eStopTested}
                    onChange={() => toggleCheck('eStopTested')}
                    className="rounded border-slate-700 text-indigo-600 focus:ring-0"
                  />
                  <span>Emergency Stop button tested & functional</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.ppeEquipped}
                    onChange={() => toggleCheck('ppeEquipped')}
                    className="rounded border-slate-700 text-indigo-600 focus:ring-0"
                  />
                  <span>Personal Protective Equipment (Goggles/Lab Coat) worn</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.areaClean}
                    onChange={() => toggleCheck('areaClean')}
                    className="rounded border-slate-700 text-indigo-600 focus:ring-0"
                  />
                  <span>Workbay clean and free of combustible debris</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist.preExistingWearDocumented}
                    onChange={() => toggleCheck('preExistingWearDocumented')}
                    className="rounded border-slate-700 text-indigo-600 focus:ring-0"
                  />
                  <span>Documented pre-existing scratches (protects user from blame)</span>
                </label>
              </div>
            </div>

            {/* Initial Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Initial Condition Notes & Pre-Existing Wear
              </label>
              <textarea
                rows={3}
                required
                value={initialNotes}
                onChange={(e) => setInitialNotes(e.target.value)}
                placeholder="Note any cosmetic scratches, chip tray level, or baseline status..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Photo verification URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-cyan-400" />
                <span>Station Baseline Inspection Photo</span>
              </label>
              <input
                type="text"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                {errorMsg}
              </div>
            )}

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
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-600/20"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{loading ? 'Recording Baseline...' : 'Complete Check-In (Step 7)'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
