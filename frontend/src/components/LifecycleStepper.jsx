import React, { useState } from 'react';
import { 
  PlusCircle, 
  Search, 
  Send, 
  ShieldCheck, 
  UserCheck, 
  CheckCircle, 
  LogIn, 
  LogOut, 
  AlertOctagon, 
  ScrollText,
  Info,
  ChevronRight
} from 'lucide-react';

const STEPS = [
  {
    step: 1,
    title: 'Resource Listed',
    role: 'Owner',
    desc: 'Owner specifies availability, required certs & supervision rules.',
    icon: PlusCircle,
    color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10'
  },
  {
    step: 2,
    title: 'Eligibility Check',
    role: 'User & System',
    desc: 'System pre-checks user training, safety badges & remaining quota.',
    icon: Search,
    color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10'
  },
  {
    step: 3,
    title: 'Request Submitted',
    role: 'User',
    desc: 'Booking requested with project purpose, timeslot & supervisor.',
    icon: Send,
    color: 'text-sky-400 border-sky-500/30 bg-sky-500/10'
  },
  {
    step: 4,
    title: 'Fair Allocation',
    role: 'AI Engine',
    desc: 'System computes explainable fairness score & detects conflicts.',
    icon: ShieldCheck,
    color: 'text-blue-400 border-blue-500/30 bg-blue-500/10'
  },
  {
    step: 5,
    title: 'Manager Review',
    role: 'Lab Manager',
    desc: 'Human oversight verifies project feasibility & safety risks.',
    icon: UserCheck,
    color: 'text-purple-400 border-purple-500/30 bg-purple-500/10'
  },
  {
    step: 6,
    title: 'Decision & Waitlist',
    role: 'System',
    desc: 'Approved with pass code or transparently placed in queue.',
    icon: CheckCircle,
    color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
  },
  {
    step: 7,
    title: 'Check-In & Baseline',
    role: 'User / Station',
    desc: 'Pre-use checklist, photo verification & pre-existing wear recorded.',
    icon: LogIn,
    color: 'text-amber-400 border-amber-500/30 bg-amber-500/10'
  },
  {
    step: 8,
    title: 'Return & Audit',
    role: 'User & Inspector',
    desc: 'Post-use inspection, consumables logged & deposit released.',
    icon: LogOut,
    color: 'text-teal-400 border-teal-500/30 bg-teal-500/10'
  },
  {
    step: 9,
    title: 'Incident & Damage',
    role: 'AI & Safety Officer',
    desc: 'Wear vs damage discrepancy flagged by AI, deposit hold resolved.',
    icon: AlertOctagon,
    color: 'text-rose-400 border-rose-500/30 bg-rose-500/10'
  },
  {
    step: 10,
    title: 'Immutable Audit',
    role: 'Consortium',
    desc: 'Tamper-evident history timeline viewable by all parties.',
    icon: ScrollText,
    color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10'
  }
];

export default function LifecycleStepper({ currentStep = 2, onSelectStep }) {
  const [selectedInfo, setSelectedInfo] = useState(null);

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 mb-6 backdrop-blur-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
            End-to-End Resource Sharing Lifecycle
          </span>
          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            10-Step Hackathon Workflow Verified
          </span>
        </div>
        <p className="text-xs text-slate-400 hidden sm:block">
          Click any step to inspect governance & accountability rules
        </p>
      </div>

      {/* 10 Step Pipeline Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
        {STEPS.map((s) => {
          const Icon = s.icon;
          const isCurrent = s.step === currentStep;
          return (
            <button
              key={s.step}
              onClick={() => setSelectedInfo(s)}
              className={`p-2 rounded-xl text-left border transition-all flex flex-col justify-between group ${
                isCurrent 
                  ? 'border-indigo-500 bg-indigo-950/40 ring-1 ring-indigo-500/50 shadow-md shadow-indigo-500/10' 
                  : 'border-slate-800/80 bg-slate-900/40 hover:bg-slate-850 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono font-bold text-slate-400 group-hover:text-white">
                  0{s.step}
                </span>
                <div className={`p-1 rounded-lg border ${s.color}`}>
                  <Icon className="w-3 h-3" />
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight line-clamp-1">
                  {s.title}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {s.role}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Info Popover Modal / Drawer if clicked */}
      {selectedInfo && (
        <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-700 flex items-start justify-between gap-3 animate-in fade-in">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-xl border ${selectedInfo.color} shrink-0`}>
              <selectedInfo.icon className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-white">
                  Step {selectedInfo.step}: {selectedInfo.title}
                </h4>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Actor: {selectedInfo.role}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {selectedInfo.desc}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedInfo(null)}
            className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 hover:bg-slate-700"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
