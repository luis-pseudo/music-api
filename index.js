require('dotenv').config();
const server = require('./server');
const db = require('./database/models');

const PORT = process.env.PORT || 3300;

// Initialize database before starting server
async function startServer() {
  try {
    // Authenticate database connection
    await db.sequelize.authenticate();
    console.log('✓ Database connected successfully');

    // Start server only after DB is ready
    server.listen(PORT, () => {
      console.log(`✓ Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();