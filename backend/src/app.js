const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Import routes
const authRoutes = require('./routes/auth.routes');
const resourceRoutes = require('./routes/resources.routes');
const bookingRoutes = require('./routes/bookings.routes');
const incidentRoutes = require('./routes/incidents.routes');
const certRoutes = require('./routes/certifications.routes');
const auditRoutes = require('./routes/audit.routes');
const aiRoutes = require('./routes/ai.routes');
const db = require('./db/database');

const app = express();

// Enable CORS for all origins (supports Vercel frontend seamlessly)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Health check endpoint (for Render and uptime monitors)
app.get('/api/health', (req, res) => {
  try {
    const userCount = db.prepare('SELECT COUNT(*) as c FROM users').get().c;
    const resourceCount = db.prepare('SELECT COUNT(*) as c FROM resources').get().c;
    const bookingCount = db.prepare('SELECT COUNT(*) as c FROM bookings').get().c;

    res.json({
      status: 'healthy',
      system: 'NexusEquip Platform API',
      version: '1.0.0',
      database: 'connected (SQLite WAL)',
      records: {
        users: userCount,
        resources: resourceCount,
        bookings: bookingCount
      },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ status: 'unhealthy', error: err.message });
  }
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/certifications', certRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/ai', aiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route not found: ${req.method} ${req.url}` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

module.exports = app;
