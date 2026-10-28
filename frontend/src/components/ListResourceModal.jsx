import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  ShieldCheck, 
  Cpu, 
  Award, 
  Coins, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';
import { api, getActiveUser } from '../services/api';
import confetti from 'canvas-confetti';

const CERT_OPTIONS = [
  '5-Axis CNC Mill Certified Operator',
  'Class 3B/4 Laser Safety Operator',
  'MakerSpace Basic Safety Orientation',
  'Nanoscale Imaging Safety',
  'Cleanroom Class 1000 Orientation',
  '3D Additive Sintering Operator',
  'BioSafety Level 2 Biohazard Containment',
  'Hazardous Chemical Handling'
];

export default function ListResourceModal({ onClose, onSuccess }) {
  const currentUser = getActiveUser();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('fabrication');
  const [type, setType] = useState('CNC Machining Center');
  const [description, setDescription] = useState('');
  const [institution, setInstitution] = useState(currentUser.institution || 'MIT Shared Labs');
  const [location, setLocation] = useState('Building 16, Room 210');
  const [hourlyRate, setHourlyRate] = useState(30);
  const [deposit, setDeposit] = useState(150);
  const [minHours, setMinHours] = useState(1);
  const [maxHours, setMaxHours] = useState(6);
  const [requiresSupervision, setRequiresSupervision] = useState(false);
  const [supervisionNotes, setSupervisionNotes] = useState('Supervisor must inspect fixture alignment prior to spindle start.');
  const [selectedCerts, setSelectedCerts] = useState(['5-Axis CNC Mill Certified Operator']);
  const [errorMsg, setErrorMsg] = useState(null);

  const toggleCert = (cert) => {
    setSelectedCerts(prev => 
      prev.includes(cert) ? prev.filter(c => c !== cert) : [...prev, cert]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const payload = {
        title,
        description,
        category,
        type,
        owner_id: currentUser.id,
        institution,
        location,
        hourly_rate: Number(hourlyRate),
        deposit: Number(deposit),
        min_hours: Number(minHours),
        max_hours: Number(maxHours),
        requires_supervision: requiresSupervision ? 1 : 0,
        supervision_notes: supervisionNotes,
        required_certifications: selectedCerts,
        specs: {
          'Operator Supervision': requiresSupervision ? 'Mandatory' : 'Optional',
          'Capacity': 'Single group per reservation',
          'Access Tier': 'Consortium Verified'
        },
        images: [
          'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800'
        ]
      };

      const res = await api.createResource(payload);
      confetti({ particleCount: 75, spread: 60 });
      if (onSuccess) onSuccess(res);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to list resource');
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
              Step 1: Listing & Governance Conditions
            </span>
            <h2 className="text-lg font-bold text-white mt-0.5">
              List Underused Space or Specialized Equipment
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Resource Name / Model
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Haas VF-3 Super Speed CNC"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="fabrication">Fabrication & Machining</option>
                <option value="equipment">Specialized Scientific Equipment</option>
                <option value="space">Controlled Space & Cleanrooms</option>
                <option value="testing_rig">Testing Rig & Robotics Volume</option>
                <option value="computing">High Performance Computing</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Equipment Type
              </label>
              <input
                type="text"
                required
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="e.g., 5-Axis Milling Machine"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Building & Room Location
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Bldg 35, High-Bay Annex"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Description & Access Protocols
            </label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe machine capability, materials allowed, and safety considerations..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Rates and limits */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Hourly Rate ($)
              </label>
              <input
                type="number"
                min="0"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Security Deposit ($)
              </label>
              <input
                type="number"
                min="0"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Min Slot (Hrs)
              </label>
              <input
                type="number"
                min="1"
                value={minHours}
                onChange={(e) => setMinHours(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Max Slot (Hrs)
              </label>
              <input
                type="number"
                min="1"
                value={maxHours}
                onChange={(e) => setMaxHours(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Required Certifications Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
              <span>Mandatory Safety Certifications (Prerequisites)</span>
              <span className="text-[10px] text-cyan-400">Step 2 Eligibility Guard</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-36 overflow-y-auto p-2 rounded-xl bg-slate-950 border border-slate-800">
              {CERT_OPTIONS.map((c) => {
                const active = selectedCerts.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleCert(c)}
                    className={`px-2 py-1.5 rounded-lg text-left text-[11px] font-medium transition-all flex items-center justify-between border ${
                      active 
                        ? 'border-indigo-500 bg-indigo-950/50 text-indigo-300' 
                        : 'border-transparent text-slate-400 hover:bg-slate-900'
                    }`}
                  >
                    <span className="truncate">{c}</span>
                    {active && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Supervision Toggle */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
              <input
                type="checkbox"
                checked={requiresSupervision}
                onChange={(e) => setRequiresSupervision(e.target.checked)}
                className="rounded border-slate-700 text-indigo-600 focus:ring-0"
              />
              <span>Requires On-Site Faculty / Staff Supervision</span>
            </label>
            {requiresSupervision && (
              <input
                type="text"
                value={supervisionNotes}
                onChange={(e) => setSupervisionNotes(e.target.value)}
                placeholder="Specify staff supervision guidelines..."
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
              />
            )}
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
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{loading ? 'Publishing to Network...' : 'Publish Listing (Step 1)'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
