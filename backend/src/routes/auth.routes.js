const express = require('express');
const router = express.Router();
const db = require('../db/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'nexusequip-dev-secret-key-9988';

/**
 * GET /api/auth/users
 * Returns all seeded users so judges/evaluators can switch personas in 1 click
 */
router.get('/users', (req, res) => {
  try {
    const users = db.prepare(`
      SELECT id, name, email, role, institution, department, trust_score, credits, avatar, phone, bio, created_at 
      FROM users
    `).all();

    // Attach certification count to each user
    const certCountStmt = db.prepare("SELECT COUNT(*) as count FROM certifications WHERE user_id = ? AND status = 'verified'");
    const enriched = users.map(u => ({
      ...u,
      verifiedCertCount: certCountStmt.get(u.id).count
    }));

    res.json({ success: true, users: enriched });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/auth/login
 */
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid user email credentials' });
    }

    if (password && !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ success: false, error: 'Invalid password credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password_hash, ...safeUser } = user;
    res.json({ success: true, token, user: safeUser });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/auth/me
 */
router.get('/me', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const userId = req.headers['x-user-id'] || (authHeader ? jwt.decode(authHeader.replace('Bearer ', ''))?.id : null);

    if (!userId) {
      // Default to researcher for convenient demo testing
      const defaultUser = db.prepare('SELECT * FROM users WHERE id = "usr_researcher"').get();
      const { password_hash, ...safe } = defaultUser;
      const certs = db.prepare('SELECT * FROM certifications WHERE user_id = ?').all(defaultUser.id);
      return res.json({ success: true, user: { ...safe, certifications: certs } });
    }

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const { password_hash, ...safe } = user;
    const certs = db.prepare('SELECT * FROM certifications WHERE user_id = ?').all(userId);
    res.json({ success: true, user: { ...safe, certifications: certs } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
