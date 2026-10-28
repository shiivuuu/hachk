import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CatalogPage from './pages/CatalogPage';
import BookingsPage from './pages/BookingsPage';
import ManagerDashboard from './pages/ManagerDashboard';
import AiAssistantTab from './pages/AiAssistantTab';
import AuditPage from './pages/AuditPage';

import BookingModal from './components/BookingModal';
import CheckInModal from './components/CheckInModal';
import ReturnModal from './components/ReturnModal';
import IncidentModal from './components/IncidentModal';
import ListResourceModal from './components/ListResourceModal';
import CertModal from './components/CertModal';

import { getActiveUser } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('catalog');
  const [currentUser, setCurrentUser] = useState(getActiveUser());

  // Modal states
  const [selectedResourceForBooking, setSelectedResourceForBooking] = useState(null);
  const [selectedBookingForCheckin, setSelectedBookingForCheckin] = useState(null);
  const [selectedBookingForReturn, setSelectedBookingForReturn] = useState(null);
  const [selectedIncidentForResolve, setSelectedIncidentForResolve] = useState(null);
  const [showListResourceModal, setShowListResourceModal] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);

  // Key to force refresh views upon actions
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const handleUserChanged = (e) => {
      setCurrentUser(e.detail);
      setRefreshKey(k => k + 1);
    };
    window.addEventListener('user-changed', handleUserChanged);
    return () => window.removeEventListener('user-changed', handleUserChanged);
  }, []);

  const triggerRefresh = () => {
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreateResource={() => setShowListResourceModal(true)}
        onOpenCertModal={() => setShowCertModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'catalog' && (
          <CatalogPage
            key={refreshKey}
            onSelectResource={(r) => setSelectedResourceForBooking(r)}
            onOpenListModal={() => setShowListResourceModal(true)}
          />
        )}

        {activeTab === 'bookings' && (
          <BookingsPage
            key={refreshKey}
            onOpenCheckIn={(b) => setSelectedBookingForCheckin(b)}
            onOpenReturn={(b) => setSelectedBookingForReturn(b)}
            onOpenIncidentView={(b) => {
              setActiveTab('manager');
            }}
          />
        )}

        {activeTab === 'manager' && (
          <ManagerDashboard
            key={refreshKey}
            onOpenResolveIncident={(inc) => setSelectedIncidentForResolve(inc)}
          />
        )}

        {activeTab === 'ai' && (
          <AiAssistantTab key={refreshKey} />
        )}

        {activeTab === 'audit' && (
          <AuditPage key={refreshKey} />
        )}
      </main>

      {/* Global Modals for Complete 10-Step Journey */}

      {/* Steps 2, 3, 4: Eligibility, Purpose & Booking */}
      {selectedResourceForBooking && (
        <BookingModal
          resource={selectedResourceForBooking}
          onClose={() => setSelectedResourceForBooking(null)}
          onSuccess={() => {
            setSelectedResourceForBooking(null);
            triggerRefresh();
            setActiveTab('bookings');
          }}
        />
      )}

      {/* Step 7: Check-In & Initial Condition */}
      {selectedBookingForCheckin && (
        <CheckInModal
          booking={selectedBookingForCheckin}
          onClose={() => setSelectedBookingForCheckin(null)}
          onSuccess={() => {
            setSelectedBookingForCheckin(null);
            triggerRefresh();
          }}
        />
      )}

      {/* Step 8: Return Handover & AI Condition Diff */}
      {selectedBookingForReturn && (
        <ReturnModal
          booking={selectedBookingForReturn}
          onClose={() => setSelectedBookingForReturn(null)}
          onSuccess={() => {
            setSelectedBookingForReturn(null);
            triggerRefresh();
          }}
        />
      )}

      {/* Step 9: Resolve Incident */}
      {selectedIncidentForResolve && (
        <IncidentModal
          incident={selectedIncidentForResolve}
          onClose={() => setSelectedIncidentForResolve(null)}
          onSuccess={() => {
            setSelectedIncidentForResolve(null);
            triggerRefresh();
          }}
        />
      )}

      {/* Step 1: List Resource */}
      {showListResourceModal && (
        <ListResourceModal
          onClose={() => setShowListResourceModal(false)}
          onSuccess={() => {
            setShowListResourceModal(false);
            triggerRefresh();
          }}
        />
      )}

      {/* User Safety Certifications Passport */}
      {showCertModal && (
        <CertModal
          onClose={() => setShowCertModal(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-8 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-extrabold text-slate-300">NexusEquip Platform</span>
            <span className="ml-2">Trusted Institutional Resource Exchange OS</span>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Built for Hackathon: Unlock Underused Equipment and Spaces. 100% 10-Step Lifecycle Complete.
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>● Vercel & Render Ready</span>
            <span>• Multi-Tenant Trust Fabric</span>
            <span>• Tamper-Evident Audit Ledger</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
