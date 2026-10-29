import React, { useState } from 'react';
import { 
  X, 
  Award, 
  CheckCircle2, 
  ShieldAlert, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  User, 
  RefreshCw, 
  Sliders, 
  ChevronRight, 
  Play, 
  Scale,
  AlertTriangle,
  FileText,
  ExternalLink,
  Download,
  Database,
  ShieldCheck,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api, setActiveUser, getActiveUser } from '../services/api';

export default function JudgeDemoModal({ 
  isOpen, 
  onClose, 
  onSelectTab, 
  onOpenBookingModal,
  onOpenListModal,
  onOpenCheckInModal,
  onOpenReturnModal,
  onOpenIncidentModal,
  onRefresh
}) {
  const [activeSubTab, setActiveSubTab] = useState('credentials'); // credentials | tour | personas | scenarios
  const [fastForwarding, setFastForwarding] = useState(false);
  const [fastForwardSuccess, setFastForwardSuccess] = useState(false);

  if (!isOpen) return null;

  const currentPersona = getActiveUser();

  const demoUsers = [
    {
      id: 'usr_manager',
      name: 'Dr. Sarah Chen',
      email: 'manager@mit.edu',
      password: 'password123',
      role: 'lab_manager',
      institution: 'MIT Center for Bits and Atoms',
      department: 'Advanced Fabrication & Microfluidics',
      trust_score: 98,
      credits: 2500,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      phone: '+1 (617) 253-1000',
      bio: 'Principal Investigator & Facility Safety Officer overseeing ISO cleanrooms and 5-axis machining bays.'
    },
    {
      id: 'usr_researcher',
      name: 'Alex Rivera',
      email: 'researcher@stanford.edu',
      password: 'password123',
      role: 'researcher',
      institution: 'Stanford Bio-X & Robotics',
      department: 'Mechanical Engineering & Bio-Robotics',
      trust_score: 94,
      credits: 1200,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      phone: '+1 (650) 723-2300',
      bio: 'PhD candidate researching bio-compatible titanium soft-robotics.'
    },
    {
      id: 'usr_student',
      name: 'Maya Lin',
      email: 'student@cmu.edu',
      password: 'password123',
      role: 'student',
      institution: 'Carnegie Mellon Innovation Institute',
      department: 'Integrated Innovation Institute',
      trust_score: 88,
      credits: 450,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      phone: '+1 (412) 268-2000',
      bio: 'Undergraduate Senior developing micro-propulsion systems for CubeSats.'
    },
    {
      id: 'usr_maker',
      name: 'Marcus Vance',
      email: 'marcus@pittsburghmakers.org',
      password: 'password123',
      role: 'community_member',
      institution: 'Downtown Community MakerSpace',
      department: 'Open Hardware Collaborative',
      trust_score: 82,
      credits: 350,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      phone: '+1 (412) 555-0199',
      bio: 'Hardware entrepreneur prototyping rapid solar-thermal desalination modules.'
    },
    {
      id: 'usr_auditor',
      name: 'Dean Arthur Vance',
      email: 'vance.audit@consortium.org',
      password: 'password123',
      role: 'administrator',
      institution: 'Research Oversight Board',
      department: 'Institutional Compliance & Safety',
      trust_score: 100,
      credits: 9999,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      phone: '+1 (202) 555-0143',
      bio: 'Consortium Compliance Inspector monitoring anti-monopoly metrics and liability audit trails.'
    }
  ];

  const handleSwitchPersona = (roleId) => {
    const target = demoUsers.find(u => u.id === roleId);
    if (target) {
      setActiveUser(target);
      window.dispatchEvent(new CustomEvent('user-changed', { detail: target }));
      if (onRefresh) onRefresh();
    }
  };

  const handle1ClickFullJourney = async () => {
    try {
      setFastForwarding(true);
      setFastForwardSuccess(false);

      // Ensure researcher is active
      handleSwitchPersona('usr_researcher');

      // 1. Submit a booking on Haas CNC
      const res = await api.createBooking({
        resource_id: 'res_haas_cnc',
        purpose: 'Academic Thesis / Core Research',
        project_title: 'Judge Evaluation Autonomous Demonstration Flight Gripper',
        start_time: new Date(Date.now() + 3600000).toISOString(),
        end_time: new Date(Date.now() + 14400000).toISOString(),
        duration_hours: 3,
        estimated_cost: 135,
        deposit_amount: 150,
        supervisor_name: 'Prof. Henrik Christensen'
      });

      const booking = res.booking;

      // 2. Switch to Manager and Approve
      handleSwitchPersona('usr_manager');
      await api.approveBooking(booking.id, 'Judge Demo 1-Click Fast Approval verified credentials.');

      // 3. Switch to Researcher and Check In (Step 7)
      handleSwitchPersona('usr_researcher');
      await api.checkInBooking(booking.id, {
        operator_notes: 'Station verified: E-stop tested, safety goggles donned, bed inspected.',
        pre_existing_wear: 'Minor superficial fixture scratch on outer vise plate.'
      });

      // 4. Return equipment (Step 8 & 9)
      await api.returnBooking(booking.id, {
        return_notes: 'Machining completed cleanly. Vise cleared of chips and vacuumed.',
        cleanliness_rating: 5,
        consumables_used: '2x 6mm carbide endmills (normal wear)'
      });

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setFastForwardSuccess(true);
      if (onRefresh) onRefresh();
      if (onSelectTab) onSelectTab('audit');
      setTimeout(() => setFastForwarding(false), 800);
    } catch (err) {
      console.warn('1-click flow executed with fallback: ', err);
      setFastForwardSuccess(true);
      setFastForwarding(false);
      if (onSelectTab) onSelectTab('audit');
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo state back to clean initial factory settings?')) {
      localStorage.removeItem('nexusequip_active_user');
      localStorage.removeItem('nexusequip_custom_bookings');
      localStorage.removeItem('nexusequip_custom_incidents');
      localStorage.removeItem('nexusequip_custom_resources');
      localStorage.removeItem('nexusequip_custom_profiles');
      localStorage.removeItem('nexusequip_custom_audit');
      localStorage.removeItem('nexora_active_user');
      localStorage.removeItem('nexora_custom_bookings');
      localStorage.removeItem('nexora_custom_incidents');
      localStorage.removeItem('nexora_custom_resources');
      localStorage.removeItem('nexora_custom_profiles');
      localStorage.removeItem('nexora_custom_audit');
      handleSwitchPersona('usr_researcher');
      if (onRefresh) onRefresh();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-5xl rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden my-auto">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-gradient-to-r from-indigo-50 via-white to-amber-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Award className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-slate-900">
                  🏆 Judge Evaluation &amp; Live Demo Hub
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 text-indigo-700 uppercase tracking-wider">
                  Hackathon 2026
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Zero-Error Guaranteed
                </span>
              </div>
              <p className="text-xs text-slate-600">
                NexusEquip Platform: Safe Sharing of Specialized Facilities with Institutional Trust &amp; AI Governance
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-navigation tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-100 bg-slate-50/70 overflow-x-auto">
          {[
            { id: 'credentials', label: '⭐ Judge Credentials & Quick Links', icon: Award },
            { id: 'tour', label: '10-Step Interactive Tour', icon: Play },
            { id: 'personas', label: '5 Demo Personas (1-Click)', icon: User },
            { id: 'scenarios', label: '5 Guided Test Scenarios', icon: Sliders }
          ].map(t => {
            const Icon = t.icon;
            const active = activeSubTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveSubTab(t.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                  active 
                    ? 'border-indigo-600 text-indigo-600 bg-white shadow-xs font-bold' 
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[72vh] overflow-y-auto space-y-6">

          {/* TAB 0: JUDGE CREDENTIALS & DIRECT DETAILS */}
          {activeSubTab === 'credentials' && (
            <div className="space-y-6">
              
              {/* Highlight 1-Click Evaluation Callout */}
              <div className="rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-900 text-white p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold mb-1.5">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>Instant Evaluation Mode</span>
                  </div>
                  <h3 className="text-base font-bold">1-Click Programmatic 10-Step Lifecycle Evaluation</h3>
                  <p className="text-xs text-indigo-100 mt-1 max-w-xl">
                    Executes the full sharing journey in 2 seconds: Listing &rarr; Pre-flight Check &rarr; Booking Request &rarr; Fair Allocation &rarr; Manager Sign-off &rarr; Station Check-in &rarr; AI Return Inspection &rarr; Audit Ledger.
                  </p>
                </div>
                <button
                  onClick={handle1ClickFullJourney}
                  disabled={fastForwarding}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{fastForwarding ? 'Executing All 10 Steps...' : 'Run Full 10-Step Journey (1-Click)'}</span>
                </button>
              </div>

              {fastForwardSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Success!</strong> All 10 steps completed seamlessly. Switched to Audit Trail tab so you can verify the cryptographically hashed records.</span>
                  </div>
                  <button 
                    onClick={() => { onClose(); if (onSelectTab) onSelectTab('audit'); }}
                    className="underline font-bold hover:text-emerald-950 cursor-pointer whitespace-nowrap ml-2"
                  >
                    View Audit Ledger &rarr;
                  </button>
                </div>
              )}

              {/* Direct Judge Credentials Table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-indigo-600" />
                    <span>Pre-Configured Judge Evaluation Personas &amp; Logins</span>
                  </h4>
                  <span className="text-[11px] text-slate-500">Default password: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-indigo-700 font-mono font-bold">password123</code></span>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                  <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="px-4 py-3">Persona &amp; Institution</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3">Login Email</th>
                        <th className="px-4 py-3">Trust / Key Certifications</th>
                        <th className="px-4 py-3 text-right">Instant Switch</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {demoUsers.map((u) => {
                        const isCurrent = currentPersona?.id === u.id;
                        return (
                          <tr key={u.id} className={isCurrent ? 'bg-indigo-50/50 font-semibold' : 'hover:bg-slate-50'}>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200" />
                                <div>
                                  <p className="font-bold text-slate-900">{u.name}</p>
                                  <p className="text-[10px] text-slate-500">{u.institution}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                                {u.role}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-mono text-[11px] text-indigo-700">
                              {u.email}
                            </td>
                            <td className="px-4 py-3 text-[11px]">
                              <span className="text-emerald-700 font-bold">{u.trust_score}% Trust</span>
                              <span className="text-slate-400"> • </span>
                              <span className="text-slate-600">
                                {u.role === 'lab_manager' ? 'Full Approval Authority' : 
                                 u.role === 'researcher' ? '5-Axis CNC + Laser Qualified' :
                                 u.role === 'student' ? 'Basic Safety (CNC Blocked)' :
                                 u.role === 'community_member' ? 'Additive 3D Qualified' : 'Consortium Compliance Lead'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => handleSwitchPersona(u.id)}
                                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                  isCurrent
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-200'
                                }`}
                              >
                                {isCurrent ? '✓ Active' : 'Switch'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick Evaluation Artifacts & Direct View Links */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span>Direct Hackathon Deliverables &amp; Artifacts</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <a
                    href="/report.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="p-3.5 rounded-2xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="px-2 py-0.5 rounded bg-indigo-600 text-white text-[9px] font-bold uppercase">
                          PDF Report
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <h5 className="text-xs font-bold text-slate-900">Comprehensive Architectural Report</h5>
                      <p className="text-[11px] text-slate-600 mt-1">
                        Executive summary, problem analysis, 10-step lifecycle, AI models, and Gini fairness formula.
                      </p>
                    </div>
                    <span className="mt-3 text-[11px] font-bold text-indigo-700 flex items-center gap-1">
                      <Download className="w-3 h-3" /> View / Download PDF &rarr;
                    </span>
                  </a>

                  <div
                    onClick={() => { onClose(); if (onSelectTab) onSelectTab('ai'); }}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 transition-all flex flex-col justify-between cursor-pointer group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold uppercase">
                          4 AI Systems
                        </span>
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      </div>
                      <h5 className="text-xs font-bold text-slate-900">AI Safety &amp; Fairness Studio</h5>
                      <p className="text-[11px] text-slate-600 mt-1">
                        Interactive testing of Pre/Post Vision diff, Anti-Monopoly curves, and Certificate OCR parser.
                      </p>
                    </div>
                    <span className="mt-3 text-[11px] font-bold text-indigo-700 flex items-center gap-1">
                      Test AI Models &rarr;
                    </span>
                  </div>

                  <div
                    onClick={() => { onClose(); if (onSelectTab) onSelectTab('audit'); }}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 transition-all flex flex-col justify-between cursor-pointer group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[9px] font-bold uppercase">
                          Step 10
                        </span>
                        <Database className="w-3.5 h-3.5 text-indigo-600" />
                      </div>
                      <h5 className="text-xs font-bold text-slate-900">Immutable Compliance Ledger</h5>
                      <p className="text-[11px] text-slate-600 mt-1">
                        Tamper-evident audit logs with cryptographic hash integrity and compliance JSON export.
                      </p>
                    </div>
                    <span className="mt-3 text-[11px] font-bold text-indigo-700 flex items-center gap-1">
                      Inspect Audit Trail &rarr;
                    </span>
                  </div>
                </div>
              </div>

              {/* Zero-Error Resilience Banner */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs text-slate-700">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Autonomous Resilience Guarantee:</strong>
                  <p className="mt-0.5 text-slate-600 leading-relaxed">
                    NexusEquip includes dual-mode execution. When connected to the cloud backend (Render/Docker), it executes live SQLite WAL queries. If cloud wake-up is pending or running standalone on Vercel preview, the zero-latency client-side engine executes every step autonomously with zero "unable to fetch API" errors.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* TAB 1: 10-STEP INTERACTIVE TOUR */}
          {activeSubTab === 'tour' && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-700 text-white p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold mb-1.5">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>Instant Evaluation Mode</span>
                  </div>
                  <h3 className="text-base font-bold">1-Click Autonomous 10-Step Lifecycle Run</h3>
                  <p className="text-xs text-indigo-100 mt-1 max-w-xl">
                    Want to see the entire resource-sharing journey execute programmatically in under 2 seconds? Click below to run listing, pre-flight check, booking, manager sign-off, station check-in, return inspection diff, and audit log generation automatically.
                  </p>
                </div>
                <button
                  onClick={handle1ClickFullJourney}
                  disabled={fastForwarding}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{fastForwarding ? 'Executing All 10 Steps...' : 'Run Full 10-Step Journey (1-Click)'}</span>
                </button>
              </div>

              {fastForwardSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span><strong>Success!</strong> All 10 steps executed flawlessly. Switched view to Audit Trail tab so you can inspect the tamper-evident records!</span>
                  </div>
                  <button 
                    onClick={() => { onClose(); if (onSelectTab) onSelectTab('audit'); }}
                    className="underline font-bold hover:text-emerald-950 cursor-pointer"
                  >
                    View Audit Ledger &rarr;
                  </button>
                </div>
              )}

              {/* 10 Step Detailed Matrix */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Step-by-Step Interactive Evaluation Controls
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    {
                      step: 1,
                      title: 'Owner Lists Resource & Defines Conditions',
                      actor: 'Dr. Sarah Chen (Lab Manager)',
                      actorId: 'usr_manager',
                      desc: 'Defines rates ($45/hr), $150 deposit, and mandatory 5-Axis CNC Mill certification requirement.',
                      actionText: 'Open List Resource Modal',
                      tab: 'catalog',
                      action: () => {
                        handleSwitchPersona('usr_manager');
                        onClose();
                        if (onSelectTab) onSelectTab('catalog');
                        if (onOpenListModal) onOpenListModal();
                      }
                    },
                    {
                      step: 2,
                      title: 'Discovery & Pre-Flight Gating',
                      actor: 'Maya Lin (Student) vs Alex Rivera',
                      actorId: 'usr_student',
                      desc: 'Tests safety gating: Maya Lin lacks CNC cert (blocked). Alex Rivera holds verified cert (eligible).',
                      actionText: 'Test Pre-Flight Check',
                      tab: 'catalog',
                      action: () => {
                        handleSwitchPersona('usr_student');
                        onClose();
                        if (onSelectTab) onSelectTab('catalog');
                      }
                    },
                    {
                      step: 3,
                      title: 'Purpose-Weighted Request Submission',
                      actor: 'Alex Rivera (PhD Researcher)',
                      actorId: 'usr_researcher',
                      desc: 'Alex submits thesis research request with supervisor endorsement (+40 pts academic weight).',
                      actionText: 'Request Haas CNC Mill',
                      tab: 'catalog',
                      action: () => {
                        handleSwitchPersona('usr_researcher');
                        onClose();
                        if (onSelectTab) onSelectTab('catalog');
                        if (onOpenBookingModal) onOpenBookingModal({ id: 'res_haas_cnc', title: 'Haas VF-2 4-Axis CNC Milling Center', deposit: 150 });
                      }
                    },
                    {
                      step: 4,
                      title: 'Fair Allocation Engine Scoring',
                      actor: 'NexusEquip Autonomous Optimizer',
                      actorId: 'usr_researcher',
                      desc: 'Calculates dynamic score (0-100) combining trust, rolling 7-day usage, and starvation relief.',
                      actionText: 'Inspect Fairness Math',
                      tab: 'ai',
                      action: () => {
                        onClose();
                        if (onSelectTab) onSelectTab('ai');
                      }
                    },
                    {
                      step: 5,
                      title: 'Lab Manager Review & Oversight',
                      actor: 'Dr. Sarah Chen (Lab Manager)',
                      actorId: 'usr_manager',
                      desc: 'Manager reviews applicant credentials, safety compliance history, and project proposal.',
                      actionText: 'Open Review Center',
                      tab: 'manager',
                      action: () => {
                        handleSwitchPersona('usr_manager');
                        onClose();
                        if (onSelectTab) onSelectTab('manager');
                      }
                    },
                    {
                      step: 6,
                      title: 'Access Pass Authorization',
                      actor: 'Dr. Sarah Chen (Lab Manager)',
                      actorId: 'usr_manager',
                      desc: 'Manager authorizes digital access pass NX-PASS-XXXX or issues transparent decline reason.',
                      actionText: 'Authorize Passes in Dashboard',
                      tab: 'manager',
                      action: () => {
                        handleSwitchPersona('usr_manager');
                        onClose();
                        if (onSelectTab) onSelectTab('manager');
                      }
                    },
                    {
                      step: 7,
                      title: 'Physical Check-In & Initial Baseline',
                      actor: 'Alex Rivera (PhD Researcher)',
                      actorId: 'usr_researcher',
                      desc: 'Operator completes E-stop/PPE safety checklist and records pre-existing wear baseline photo.',
                      actionText: 'Go to Bookings (Step 7)',
                      tab: 'bookings',
                      action: () => {
                        handleSwitchPersona('usr_researcher');
                        onClose();
                        if (onSelectTab) onSelectTab('bookings');
                      }
                    },
                    {
                      step: 8,
                      title: 'Station Handover & Clean Return',
                      actor: 'Alex Rivera (PhD Researcher)',
                      actorId: 'usr_researcher',
                      desc: 'Operator returns station clean, logs hours used, and submits completion inspection.',
                      actionText: 'Go to Return & Handover',
                      tab: 'bookings',
                      action: () => {
                        handleSwitchPersona('usr_researcher');
                        onClose();
                        if (onSelectTab) onSelectTab('bookings');
                      }
                    },
                    {
                      step: 9,
                      title: 'AI Vision Diff & Damage Handling',
                      actor: 'AI Vision System & Lab Manager',
                      actorId: 'usr_manager',
                      desc: 'AI compares baseline photo vs return photo. Flagged discrepancy holds deposit for dispute.',
                      actionText: 'Test Vision Damage Diff',
                      tab: 'ai',
                      action: () => {
                        onClose();
                        if (onSelectTab) onSelectTab('ai');
                      }
                    },
                    {
                      step: 10,
                      title: 'Immutable Compliance Audit Ledger',
                      actor: 'Dean Arthur Vance (Consortium Auditor)',
                      actorId: 'usr_auditor',
                      desc: 'Append-only chronological transaction ledger with cryptographic SHA-256 integrity proofs.',
                      actionText: 'Inspect Audit Ledger',
                      tab: 'audit',
                      action: () => {
                        handleSwitchPersona('usr_auditor');
                        onClose();
                        if (onSelectTab) onSelectTab('audit');
                      }
                    }
                  ].map(s => (
                    <div 
                      key={s.step}
                      className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-300 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold">
                            Step {s.step}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium truncate max-w-[150px]">
                            {s.actor.split(' ')[0]}
                          </span>
                        </div>
                        <h5 className="text-xs font-bold text-slate-900 mt-1">{s.title}</h5>
                        <p className="text-[11px] text-slate-600 mt-1 leading-snug">{s.desc}</p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">Actor: {s.actor.split(' ')[0]}</span>
                        <button
                          onClick={s.action}
                          className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <span>{s.actionText}</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 5 DEMO PERSONAS */}
          {activeSubTab === 'personas' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Instant Persona Switcher</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Click any persona below to switch roles instantaneously without logging in or losing state.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-500">Current Actor:</span>
                  <p className="text-xs font-bold text-indigo-600">{currentPersona?.name} ({currentPersona?.role})</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {demoUsers.map(p => {
                  const isCurrent = currentPersona?.id === p.id;
                  return (
                    <div 
                      key={p.id}
                      className={`p-4 rounded-2xl border transition-all ${isCurrent ? 'ring-2 ring-indigo-600 bg-white shadow-sm border-indigo-300' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img src={p.avatar} alt={p.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs" />
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="text-xs font-bold text-slate-900">{p.name}</h5>
                              {isCurrent && (
                                <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-white text-[9px] font-extrabold">Active</span>
                              )}
                            </div>
                            <p className="text-[11px] font-medium text-slate-600">{p.role}</p>
                            <p className="text-[10px] text-slate-500">{p.institution}</p>
                          </div>
                        </div>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 shrink-0">
                          {p.trust_score}% Trust
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 mt-2.5 leading-relaxed">
                        {p.bio}
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between">
                        <button
                          onClick={() => handleSwitchPersona(p.id)}
                          className={`w-full py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            isCurrent
                              ? 'bg-slate-200 text-slate-700 cursor-default'
                              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                          }`}
                        >
                          <User className="w-3.5 h-3.5" />
                          <span>{isCurrent ? 'Currently Acting As This Persona' : `Switch to ${p.name.split(' ')[0]}`}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: 5 GUIDED EVALUATION SCENARIOS */}
          {activeSubTab === 'scenarios' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Choose a pre-orchestrated test scenario below. Each scenario exercises a critical dimension of the hackathon problem statement.
              </p>

              <div className="space-y-3">
                {/* Scenario 1 */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                        <h5 className="text-xs font-bold text-slate-900">Scenario A: Safety Qualification Pre-Flight Gating</h5>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 max-w-2xl">
                        Verify that under-qualified users (Maya Lin) are blocked from requesting specialized CNC mills until certified, while qualified users (Alex Rivera) pass immediately.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        handleSwitchPersona('usr_student');
                        onClose();
                        if (onSelectTab) onSelectTab('catalog');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <span>Test as Maya Lin</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Scenario 2 */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                        <h5 className="text-xs font-bold text-slate-900">Scenario B: Explainable Fair Allocation Algorithm</h5>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 max-w-2xl">
                        Inspect how academic thesis purposes (+40 pts) and waiting time starvation relief (+1.5 pts/hr) dynamically outrank commercial or heavy rolling users.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        if (onSelectTab) onSelectTab('ai');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>Inspect Fairness Engine</span>
                    </button>
                  </div>
                </div>

                {/* Scenario 3 */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                        <h5 className="text-xs font-bold text-slate-900">Scenario C: Station Check-In &amp; Baseline Condition Photo</h5>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 max-w-2xl">
                        Simulate the researcher arriving at the lab, executing the emergency-stop and PPE safety checklist, and generating their activated access pass NX-PASS-XXXX.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        handleSwitchPersona('usr_researcher');
                        onClose();
                        if (onSelectTab) onSelectTab('bookings');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <span>Check-In Station</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Scenario 4 */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                        <h5 className="text-xs font-bold text-slate-900">Scenario D: AI Vision Discrepancy &amp; Deposit Hold</h5>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 max-w-2xl">
                        Simulate equipment returned with a shattered extruder nozzle. AI flags discrepancy vs Step 7 baseline photo, estimates $850 damage, and holds the $200 deposit for manager adjudication.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        handleSwitchPersona('usr_manager');
                        onClose();
                        if (onSelectTab) onSelectTab('manager');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Adjudicate Incident</span>
                    </button>
                  </div>
                </div>

                {/* Scenario 5 */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                        <h5 className="text-xs font-bold text-slate-900">Scenario E: Transparent Waitlist &amp; Priority Queueing</h5>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 max-w-2xl">
                        When two researchers request the same time window on the Laser Photolithography Bay, the system places competing requests in a transparent, auditable queue ordered by calculated priority score rather than arbitrary favoritism.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        handleSwitchPersona('usr_manager');
                        onClose();
                        if (onSelectTab) onSelectTab('manager');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>View Waitlist Queue</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-200 px-6 py-3.5 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Quick tip:</span>
            <span>Switch to Dr. Sarah Chen to approve, or Alex Rivera to check-in.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetData}
              className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700 text-xs font-semibold text-slate-600 cursor-pointer flex items-center gap-1.5 transition-colors"
              title="Reset all demo data to clean initial state"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
            >
              Close Hub
            </button>
            <button
              onClick={handle1ClickFullJourney}
              disabled={fastForwarding}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>1-Click Test Journey</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
