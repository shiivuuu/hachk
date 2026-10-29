const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { v4: uuidv4 } = require('uuid');
const { recordAudit } = require('../services/auditService');

// Map between frontend resource IDs and database seeded resource IDs
const RESOURCE_ALIASES = {
  'res_haas_cnc': 'res_cnc_haas',
  'res_cleanroom_litho': 'res_cleanroom_bay',
  'res_highspeed_optics': 'res_phantom_camera',
  'res_drone_arena': 'res_robotics_arena',
  'res_cnc_haas': 'res_haas_cnc',
  'res_cleanroom_bay': 'res_cleanroom_litho',
  'res_phantom_camera': 'res_highspeed_optics',
  'res_robotics_arena': 'res_drone_arena'
};

/**
 * GET /api/resources
 * Search & filter resources
 */
router.get('/', (req, res) => {
  try {
    const { category, institution, search, status } = req.query;
    let query = `
      SELECT r.*, u.name as owner_name, u.email as owner_email, u.institution as owner_institution
      FROM resources r
      JOIN users u ON r.owner_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (category && category !== 'all') {
      query += ` AND r.category = ?`;
      params.push(category);
    }
    if (institution && institution !== 'all') {
      query += ` AND r.institution LIKE ?`;
      params.push(`%${institution}%`);
    }
    if (status && status !== 'all') {
      query += ` AND r.status = ?`;
      params.push(status);
    }
    if (search) {
      query += ` AND (r.title LIKE ? OR r.description LIKE ? OR r.type LIKE ? OR r.tags LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    query += ` ORDER BY r.created_at DESC`;

    const resources = db.prepare(query).all(...params);

    // Parse JSON columns and provide dual-compatibility for frontend fields
    const formatted = resources.map(r => {
      const images = JSON.parse(r.images || '[]');
      const firstImage = images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800';
      return {
        ...r,
        name: r.title, // frontend name property
        title: r.title,
        deposit_amount: r.deposit, // frontend deposit_amount property
        deposit: r.deposit,
        image_url: firstImage, // frontend image_url property
        images,
        specs: JSON.parse(r.specs || '{}'),
        required_certifications: JSON.parse(r.required_certifications || '[]'),
        tags: JSON.parse(r.tags || '[]')
      };
    });

    res.json({ success: true, count: formatted.length, resources: formatted });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/resources/:id
 */
router.get('/:id', (req, res) => {
  try {
    const rawId = req.params.id;
    const aliasedId = RESOURCE_ALIASES[rawId] || rawId;

    const resource = db.prepare(`
      SELECT r.*, u.name as owner_name, u.email as owner_email, u.avatar as owner_avatar
      FROM resources r
      JOIN users u ON r.owner_id = u.id
      WHERE r.id = ? OR r.id = ?
    `).get(rawId, aliasedId);

    if (!resource) {
      return res.status(404).json({ success: false, error: 'Resource not found' });
    }

    const matchedId = resource.id;

    // Get upcoming confirmed bookings for this resource
    const upcomingBookings = db.prepare(`
      SELECT b.id, b.start_time, b.end_time, b.status, b.purpose, u.name as user_name
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      WHERE (b.resource_id = ? OR b.resource_id = ?) AND b.status IN ('approved', 'checked_in')
      ORDER BY b.start_time ASC
    `).all(rawId, matchedId);

    // Get latest check-in / return condition history
    const conditionHistory = db.prepare(`
      SELECT c.initial_condition_status, c.initial_notes, c.checked_in_at,
             r.final_condition_status, r.final_notes, r.returned_at,
             b.booking_code
      FROM bookings b
      LEFT JOIN checkins c ON b.id = c.booking_id
      LEFT JOIN returns r ON b.id = r.booking_id
      WHERE (b.resource_id = ? OR b.resource_id = ?) AND (c.id IS NOT NULL OR r.id IS NOT NULL)
      ORDER BY b.start_time DESC
      LIMIT 5
    `).all(rawId, matchedId);

    const images = JSON.parse(resource.images || '[]');
    const firstImage = images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800';

    res.json({
      success: true,
      resource: {
        ...resource,
        name: resource.title,
        deposit_amount: resource.deposit,
        image_url: firstImage,
        images,
        specs: JSON.parse(resource.specs || '{}'),
        required_certifications: JSON.parse(resource.required_certifications || '[]'),
        tags: JSON.parse(resource.tags || '[]'),
        upcomingBookings,
        conditionHistory
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/resources/:id/eligibility (Step 2 in Lifecycle)
 * Checks user safety certs, remaining quotas, and deposit requirements
 */
router.get('/:id/eligibility', (req, res) => {
  try {
    const rawId = req.params.id;
    const aliasedId = RESOURCE_ALIASES[rawId] || rawId;
    const userId = req.query.userId || req.headers['x-user-id'] || 'usr_researcher';

    const resource = db.prepare('SELECT * FROM resources WHERE id = ? OR id = ?').get(rawId, aliasedId);
    if (!resource) return res.status(404).json({ success: false, error: 'Resource not found' });

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    const requiredCerts = JSON.parse(resource.required_certifications || '[]');
    const userCerts = db.prepare("SELECT * FROM certifications WHERE user_id = ? AND status = 'verified'").all(userId);

    const userCertTitles = userCerts.map(c => c.title.toLowerCase());
    const missingCertifications = [];
    const satisfiedCertifications = [];

    for (const reqCert of requiredCerts) {
      const match = userCertTitles.some(c => c.includes(reqCert.toLowerCase()) || reqCert.toLowerCase().includes(c));
      if (match) {
        satisfiedCertifications.push(reqCert);
      } else {
        missingCertifications.push(reqCert);
      }
    }

    const hasSufficientCredits = user.credits >= (resource.deposit || 0);
    const isEligible = missingCertifications.length === 0 && hasSufficientCredits;

    res.json({
      success: true,
      isEligible,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        trustScore: user.trust_score,
        credits: user.credits
      },
      requirements: {
        requiredCertifications: requiredCerts,
        satisfiedCertifications,
        missingCertifications,
        securityDepositRequired: resource.deposit,
        hasSufficientCredits,
        requiresSupervision: Boolean(resource.requires_supervision),
        supervisionNotes: resource.supervision_notes
      },
      recommendation: isEligible
        ? 'ELIGIBLE: All safety credentials verified. Ready to submit booking request.'
        : `INELIGIBLE: Missing ${missingCertifications.length} safety certifications (${missingCertifications.join(', ')}). Complete training before requesting.`
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/resources (Step 1 in Lifecycle)
 * Owner lists resource and defines usage conditions
 */
router.post('/', (req, res) => {
  try {
    const title = req.body.title || req.body.name;
    const description = req.body.description;
    const category = req.body.category || 'fabrication';
    const type = req.body.type || req.body.category || 'Specialized Hardware';
    const owner_id = req.body.owner_id;
    const institution = req.body.institution;
    const location = req.body.location;
    const images = req.body.images;
    const specs = req.body.specs;
    const hourly_rate = req.body.hourly_rate ?? 0;
    const deposit = req.body.deposit ?? req.body.deposit_amount ?? 0;
    const min_hours = req.body.min_hours ?? 1;
    const max_hours = req.body.max_hours ?? 8;
    const requires_supervision = req.body.requires_supervision ?? 0;
    const supervision_notes = req.body.supervision_notes ?? '';
    const required_certifications = req.body.required_certifications ?? [];
    const tags = req.body.tags ?? [];

    if (!title) {
      return res.status(400).json({ success: false, error: 'Title/name is required' });
    }

    const id = `res_${uuidv4().slice(0, 8)}`;
    const ownerId = owner_id || req.headers['x-user-id'] || 'usr_manager';
    const owner = db.prepare('SELECT * FROM users WHERE id = ?').get(ownerId);

    const stmt = db.prepare(`
      INSERT INTO resources (
        id, title, description, category, type, owner_id, institution, location,
        images, specs, hourly_rate, deposit, min_hours, max_hours,
        requires_supervision, supervision_notes, required_certifications, status,
        current_condition, condition_notes, tags
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'available', 'pristine', 'Listed in certified working order', ?)
    `);

    stmt.run(
      id,
      title,
      description || 'Institutional research equipment available for verified sharing.',
      category,
      type,
      ownerId,
      institution || (owner ? owner.institution : 'MIT Shared Labs'),
      location || 'Building 16, Room 210',
      JSON.stringify(images || ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800']),
      JSON.stringify(specs || {}),
      Number(hourly_rate),
      Number(deposit),
      Number(min_hours),
      Number(max_hours),
      requires_supervision ? 1 : 0,
      supervision_notes,
      JSON.stringify(required_certifications),
      JSON.stringify(tags)
    );

    // Record immutable audit log
    recordAudit({
      entityType: 'resource',
      entityId: id,
      action: 'RESOURCE_LISTED',
      actorId: ownerId,
      actorName: owner ? owner.name : 'Lab Manager',
      actorRole: owner ? owner.role : 'lab_manager',
      details: { title, category, type, deposit, hourly_rate }
    });

    res.status(201).json({ success: true, message: 'Resource listed successfully', resourceId: id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
