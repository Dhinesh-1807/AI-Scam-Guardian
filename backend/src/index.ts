import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { apiRateLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
import analyzeRoutes from './routes/analyzeRoutes.js';
import scansRoutes from './routes/scansRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import healthRoutes from './routes/healthRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Trust proxy if running behind reverse proxy (Render, Cloudflare, etc.)
app.set('trust proxy', 1);

// Security & CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow localhost, FRONTEND_URL, or no-origin (curl, postman, mobile apps)
      if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1') || origin === FRONTEND_URL) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive for hackathon demos
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Apply rate limiter to /api
app.use('/api', apiRateLimiter);

// API Routes
app.use('/api/analyze', analyzeRoutes);
app.use('/api/scans', scansRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/health', healthRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'AI Scam Guardian API is active.',
    tagline: 'Detect the scam before you take the bait.',
    endpoints: [
      'POST /api/analyze/message',
      'POST /api/analyze/url',
      'GET /api/scans',
      'GET /api/scans/:id',
      'DELETE /api/scans/:id',
      'GET /api/analytics',
      'GET /api/health',
    ],
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `API route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`
🛡️ ========================================================
   AI SCAM GUARDIAN — CYBERSECURITY BACKEND
   Tagline: "Detect the scam before you take the bait."
   Server running on: http://localhost:${PORT}
   AI Provider: ${process.env.AI_PROVIDER || 'local'}
======================================================== 🛡️
    `);
  });
}

export default app;
