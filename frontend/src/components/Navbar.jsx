import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Calendar, 
  Sparkles, 
  History, 
  PlusCircle, 
  UserCheck, 
  ChevronDown, 
  CheckCircle2, 
  Coins, 
  AlertTriangle,
  Building2,
  FileCheck2
} from 'lucide-react';
import { api, getActiveUser, setActiveUser } from '../services/api';

export default function Navbar({ activeTab, setActiveTab, onOpenCreateResource, onOpenCertModal }) {
  const [currentUser, setCurrentUser] = useState(getActiveUser());
  const [allUsers, setAllUsers] = useState([]);
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [pendingCount, setPendingCount] = useState(1);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const users = await api.getUsers();
      setAllUsers(users);
      // Ensure current user is in sync
      const current = getActiveUser();
      const matched = users.find(u => u.id === current.id) || users[1];
      setCurrentUser(matched);
      setActiveUser(matched);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectUser = (u) => {
    setActiveUser(u);
    setCurrentUser(u);
    setShowPersonaMenu(false);
    // Reload page or trigger state update
    window.dispatchEvent(new CustomEvent('user-changed', { detail: u }));
  };

  const roleBadges = {
    lab_manager: { label: 'Lab Manager', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
    researcher: { label: 'Researcher', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    student: { label: 'Student', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
    community_member: { label: 'Maker/Community', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    admin: { label: 'Safety Auditor', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('catalog')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  NexusEquip
                </span>
                <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Trust OS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block"></span>
                <span>Consortium Safety Fabric</span>
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'catalog' 
                  ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>Catalog & Matcher</span>
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'bookings' 
                  ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>My Lifecycle (1-10)</span>
            </button>

            <button
              onClick={() => setActiveTab('manager')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 relative ${
                activeTab === 'manager' 
                  ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Lab Control</span>
              {pendingCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-500 text-[10px] text-slate-950 font-bold flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'ai' 
                  ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>AI & Fairness</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'audit' 
                  ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Audit Trail</span>
            </button>
          </nav>

          {/* Right Action Bar & Persona Switcher */}
          <div className="flex items-center gap-3">
            
            {/* List Resource Button */}
            <button
              onClick={onOpenCreateResource}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>List Resource</span>
            </button>

            {/* Persona Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl border border-slate-800 bg-slate-900/90 hover:bg-slate-850 hover:border-slate-700 transition-all text-left"
              >
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={currentUser?.name}
                  className="w-8 h-8 rounded-lg object-cover ring-1 ring-indigo-500/30"
                />
                <div className="hidden sm:block">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-white leading-none">
                      {currentUser?.name || 'Alex Rivera'}
                    </span>
                    <span className={`text-[10px] px-1 py-0.2 rounded border font-medium ${roleBadges[currentUser?.role]?.color || 'bg-slate-800 text-slate-300'}`}>
                      {roleBadges[currentUser?.role]?.label || 'User'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                    <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                      ★ {currentUser?.trust_score || 94}% Trust
                    </span>
                    <span>•</span>
                    <span className="text-amber-400 flex items-center gap-0.5">
                      <Coins className="w-2.5 h-2.5" /> {currentUser?.credits || 1200}
                    </span>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
              </button>

              {/* Persona Dropdown Menu */}
              {showPersonaMenu && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-800 bg-slate-900/95 backdrop-blur-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="p-2 border-b border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Switch Persona (Judge Demo)
                      </span>
                      <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">
                        1-Click Test
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Experience different roles, access rights & safety verifications.
                    </p>
                  </div>

                  <div className="py-1 space-y-1">
                    {allUsers.map((u) => {
                      const isSelected = u.id === currentUser?.id;
                      return (
                        <button
                          key={u.id}
                          onClick={() => handleSelectUser(u)}
                          className={`w-full flex items-center gap-3 p-2 rounded-xl text-left transition-all ${
                            isSelected 
                              ? 'bg-indigo-600/15 border border-indigo-500/40' 
                              : 'hover:bg-slate-800/60 border border-transparent'
                          }`}
                        >
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-9 h-9 rounded-lg object-cover ring-1 ring-slate-700"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-bold text-white truncate">{u.name}</p>
                              {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                            </div>
                            <p className="text-[10px] text-slate-400 truncate">{u.institution}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className={`text-[9px] px-1 py-0.2 rounded border font-medium ${roleBadges[u.role]?.color}`}>
                                {roleBadges[u.role]?.label}
                              </span>
                              <span className="text-[10px] text-emerald-400 font-medium">
                                {u.trust_score}% Trust
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-2 border-t border-slate-800 mt-1 flex justify-between items-center">
                    <button
                      onClick={() => {
                        setShowPersonaMenu(false);
                        if (onOpenCertModal) onOpenCertModal();
                      }}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                    >
                      <FileCheck2 className="w-3.5 h-3.5" />
                      <span>My Safety Certifications</span>
                    </button>
                    <span className="text-[10px] text-slate-400">
                      ID: {currentUser?.id}
                    </span>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}
