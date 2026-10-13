
import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';

import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Configure CORS using comma-separated allowed origins.
const allowedOrigins = (
  process.env.CLIENT_URL || 'http://localhost:5173'
)
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests without an Origin header, such as server-to-server calls.
      if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
        return callback(null, true);
      }

      return callback(new Error('Origin not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token', 'atoken', 'dtoken'],
  })
);

app.use(express.json({ limit: '1mb' }));

// Health-check endpoint.
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'HealthSync backend is running',
    environment: process.env.NODE_ENV || 'development',
  });
});

// API routes.
app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/user', userRouter);

// Handle unknown routes.
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
  });
});

// Centralized error handler.
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err.message === 'Origin not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'Origin not allowed',
    });
  }

  console.error('Request error:', err.message);

  return res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
  });
});

// Start only after required services initialize successfully.
const startServer = async () => {
  try {
    await connectDB();
    connectCloudinary();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`HealthSync backend listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start HealthSync backend:', error);
    process.exit(1);
  }
};

startServer();
