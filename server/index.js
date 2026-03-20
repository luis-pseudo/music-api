const cors= require('cors');
const express = require('express');
const routes = require('../routes');

const server = express();
server.use(cors());
server.options('*', cors());

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use('/api', routes);

// Error handling middleware
server.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  
  // Multer errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size exceeds 5MB limit',
        error: err.message,
      });
    }
    return res.status(400).json({
      success: false,
      message: 'File upload error',
      error: err.message,
    });
  }

  // Custom errors
  if (err.message) {
    return res.status(err.status || 500).json({
      success: false,
      message: err.message,
      error: process.env.NODE_ENV === 'development' ? err.message : 'Server error',
    });
  }

  // Default error
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? String(err) : 'Server error',
  });
});

module.exports = server;