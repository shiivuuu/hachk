import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Coins, 
  Cpu, 
  ChevronRight, 
  Users, 
  Sparkles,
  Award
} from 'lucide-react';
import { getActiveUser } from '../services/api';

export default function ResourceCard({ resource, onSelect, userEligible = true, missingCerts = [] }) {
  const currentUser = getActiveUser();
  const requiredCerts = resource.required_certifications || [];
  
  const categoryBadges = {
    fabrication: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    equipment: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    space: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    testing_rig: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    computing: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
  };

  const imageSrc = resource.images && resource.images.length > 0
    ? resource.images[0]
    : 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800';

  return (
    <div className="group rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900/90 hover:border-slate-700 transition-all duration-300 flex flex-col overflow-hidden shadow-lg hover:shadow-indigo-500/5">
      
      {/* Thumbnail & Badges */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
        <img
          src={imageSrc}
          alt={resource.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border backdrop-blur-md ${categoryBadges[resource.category] || 'bg-slate-800 text-slate-300'}`}>
            {resource.category}
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-slate-300 border border-slate-700">
            {resource.type}
          </span>
        </div>

        {/* Supervision Badge */}
        {resource.requires_supervision === 1 && (
          <div className="absolute top-3 right-3">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md flex items-center gap-1">
              <Users className="w-2.5 h-2.5" />
              <span>Supervised</span>
            </span>
          </div>
        )}

        {/* Bottom image overlay stats */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs text-slate-300">
          <span className="flex items-center gap-1 text-[11px] text-slate-300 truncate max-w-[200px]">
            <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
            <span className="truncate">{resource.institution}</span>
          </span>
          <span className="text-[11px] font-medium text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
            {resource.status === 'available' ? 'Available' : resource.status}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-base text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
            {resource.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {resource.description}
          </p>

          {/* Location detail */}
          <div className="flex items-center gap-1 text-xs text-slate-400 mt-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
            <span className="truncate">{resource.location}</span>
          </div>

          {/* Required Certifications */}
          <div className="mt-3">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5 flex items-center gap-1">
              <Award className="w-3 h-3 text-indigo-400" />
              <span>Required Safety Certifications:</span>
            </span>
            <div className="flex flex-wrap gap-1">
              {requiredCerts.length > 0 ? (
                requiredCerts.map((c, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-800/90 text-slate-300 border border-slate-700/60 truncate max-w-[220px]"
                  >
                    {c}
                  </span>
                ))
              ) : (
                <span className="text-[10px] text-slate-400 italic">Open access (Basic Safety Only)</span>
              )}
            </div>
          </div>
        </div>

        {/* Pricing, Deposit & Booking CTA */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-extrabold text-white">
                ${resource.hourly_rate}
              </span>
              <span className="text-[11px] text-slate-400">/hr</span>
              {resource.deposit > 0 && (
                <span className="text-[10px] text-slate-400 ml-1.5">
                  (${resource.deposit} dep)
                </span>
              )}
            </div>
            <p className="text-[10px] text-cyan-400">
              Min {resource.min_hours}h - Max {resource.max_hours}h
            </p>
          </div>

          <button
            onClick={() => onSelect(resource)}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all group-hover:translate-x-0.5"
          >
            <span>Request Access</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
}
