require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`===============================================`);
  console.log(`🚀 NexusEquip Core Backend API Running`);
  console.log(`📡 URL: http://0.0.0.0:${PORT}`);
  console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔒 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`===============================================`);
});

setInterval(() => {}, 60000);

process.on('SIGTERM', () => {
  server.close(() => console.log('Process terminated'));
});
