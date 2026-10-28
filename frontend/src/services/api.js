/**
 * NexusEquip Centralized API Service
 * Points to VITE_API_URL or defaults to localhost:5000/api
 * Includes intelligent local fallback mock data in case backend is offline
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

let activeUser = {
  id: 'usr_researcher',
  name: 'Alex Rivera',
  email: 'researcher@stanford.edu',
  role: 'researcher',
  institution: 'Stanford Bio-X & Robotics',
  department: 'Mechanical Engineering & Bio-Robotics',
  trust_score: 94,
  credits: 1200,
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  phone: '+1 (650) 723-2300',
  bio: 'PhD candidate researching bio-compatible titanium soft-robotics.'
};

export const setActiveUser = (user) => {
  activeUser = user;
  localStorage.setItem('nexusequip_active_user', JSON.stringify(user));
};

export const getActiveUser = () => {
  const saved = localStorage.getItem('nexusequip_active_user');
  if (saved) {
    try {
      activeUser = JSON.parse(saved);
    } catch {}
  }
  return activeUser;
};

const getHeaders = () => {
  const user = getActiveUser();
  return {
    'Content-Type': 'application/json',
    'x-user-id': user ? user.id : 'usr_researcher'
  };
};

export const api = {
  // Auth & Personas
  async getUsers() {
    try {
      const res = await fetch(`${API_BASE}/auth/users`, { headers: getHeaders() });
      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      return data.users;
    } catch (err) {
      console.warn('Backend unavailable, using local users', err);
      return [
        {
          id: 'usr_manager',
          name: 'Dr. Sarah Chen',
          email: 'manager@mit.edu',
          role: 'lab_manager',
          institution: 'MIT Center for Bits and Atoms',
          department: 'FabLab & Shared Facilities',
          trust_score: 98,
          credits: 2500,
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
          verifiedCertCount: 4
        },
        {
          id: 'usr_researcher',
          name: 'Alex Rivera',
          email: 'researcher@stanford.edu',
          role: 'researcher',
          institution: 'Stanford Bio-X & Robotics',
          department: 'Mechanical Engineering & Bio-Robotics',
          trust_score: 94,
          credits: 1200,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          verifiedCertCount: 2
        },
        {
          id: 'usr_student',
          name: 'Maya Lin',
          email: 'student@cmu.edu',
          role: 'student',
          institution: 'Carnegie Mellon University',
          department: 'Integrated Innovation Institute',
          trust_score: 88,
          credits: 450,
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
          verifiedCertCount: 1
        },
        {
          id: 'usr_creator',
          name: 'Marcus Vance',
          email: 'creator@makerhub.org',
          role: 'community_member',
          institution: 'Downtown Community MakerSpace',
          department: 'Hardware Innovation Cohort',
          trust_score: 82,
          credits: 300,
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          verifiedCertCount: 1
        },
        {
          id: 'usr_admin',
          name: 'Dean Arthur Vance',
          email: 'admin@inst.edu',
          role: 'admin',
          institution: 'Inter-Institutional Research Consortium',
          department: 'Safety & Resource Oversight Board',
          trust_score: 100,
          credits: 9999,
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
          verifiedCertCount: 5
        }
      ];
    }
  },

  async getCurrentUser() {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, { headers: getHeaders() });
      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      return data.user;
    } catch {
      return getActiveUser();
    }
  },

  // Resources
  async getResources(filters = {}) {
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await fetch(`${API_BASE}/resources?${params}`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch resources');
      const data = await res.json();
      return data.resources;
    } catch (err) {
      console.warn('Fallback resources:', err);
      return [];
    }
  },

  async getResourceById(id) {
    const res = await fetch(`${API_BASE}/resources/${id}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch resource');
    const data = await res.json();
    return data.resource;
  },

  async checkEligibility(resourceId, userId) {
    const uid = userId || getActiveUser().id;
    const res = await fetch(`${API_BASE}/resources/${resourceId}/eligibility?userId=${uid}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Eligibility check failed');
    return await res.json();
  },

  async createResource(data) {
    const res = await fetch(`${API_BASE}/resources`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to list resource');
    }
    return await res.json();
  },

  // Bookings
  async getBookings(filters = {}) {
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await fetch(`${API_BASE}/bookings?${params}`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch bookings');
      const data = await res.json();
      return data.bookings;
    } catch (err) {
      console.warn('Fallback bookings:', err);
      return [];
    }
  },

  async getBookingById(id) {
    const res = await fetch(`${API_BASE}/bookings/${id}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch booking detail');
    const data = await res.json();
    return data.booking;
  },

  async createBooking(data) {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Failed to submit booking');
    }
    return result;
  },

  async approveBooking(id, notes) {
    const res = await fetch(`${API_BASE}/bookings/${id}/approve`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ approval_notes: notes })
    });
    if (!res.ok) throw new Error('Failed to approve booking');
    return await res.json();
  },

  async rejectBooking(id, reason) {
    const res = await fetch(`${API_BASE}/bookings/${id}/reject`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ rejection_reason: reason })
    });
    if (!res.ok) throw new Error('Failed to reject booking');
    return await res.json();
  },

  async checkInBooking(id, checkinData) {
    const res = await fetch(`${API_BASE}/bookings/${id}/checkin`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(checkinData)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Check-in failed');
    return result;
  },

  async returnBooking(id, returnData) {
    const res = await fetch(`${API_BASE}/bookings/${id}/return`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(returnData)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Return failed');
    return result;
  },

  // Incidents
  async getIncidents(filters = {}) {
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await fetch(`${API_BASE}/incidents?${params}`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch incidents');
      const data = await res.json();
      return data.incidents;
    } catch {
      return [];
    }
  },

  async resolveIncident(id, resolutionNotes, depositAction) {
    const res = await fetch(`${API_BASE}/incidents/${id}/resolve`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ resolution_notes: resolutionNotes, deposit_action: depositAction })
    });
    if (!res.ok) throw new Error('Failed to resolve incident');
    return await res.json();
  },

  // Audit Logs
  async getAuditLogs(filters = {}) {
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await fetch(`${API_BASE}/audit?${params}`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch audit logs');
      const data = await res.json();
      return data.auditLogs;
    } catch {
      return [];
    }
  },

  // Certifications
  async getCertifications(userId) {
    try {
      const uid = userId || getActiveUser().id;
      const res = await fetch(`${API_BASE}/certifications?userId=${uid}`, { headers: getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch certifications');
      const data = await res.json();
      return data.certifications;
    } catch {
      return [];
    }
  },

  async uploadCertification(certData) {
    const res = await fetch(`${API_BASE}/certifications/upload`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(certData)
    });
    if (!res.ok) throw new Error('Failed to upload certification');
    return await res.json();
  },

  // AI Suite
  async aiMatch(query) {
    const res = await fetch(`${API_BASE}/ai/match`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ query })
    });
    if (!res.ok) throw new Error('AI match failed');
    return await res.json();
  },

  async aiAnalyzeCondition(data) {
    const res = await fetch(`${API_BASE}/ai/analyze-condition`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Condition analysis failed');
    return await res.json();
  },

  async aiVerifyCert(certData) {
    const res = await fetch(`${API_BASE}/ai/verify-cert`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(certData)
    });
    if (!res.ok) throw new Error('Cert verification failed');
    return await res.json();
  },

  async aiGetFairnessReport() {
    const res = await fetch(`${API_BASE}/ai/fairness-report`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Fairness report failed');
    const data = await res.json();
    return data.report;
  }
};
