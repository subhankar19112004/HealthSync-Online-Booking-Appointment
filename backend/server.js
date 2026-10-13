<<<<<<< HEAD

import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';

=======
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.JS';
>>>>>>> bae9ce1fa03153cbb09537b55e5713cab8eabda3
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoutes.js';

const app = express();
<<<<<<< HEAD
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
=======
const PORT = Number(process.env.PORT) || 4000;

const configuredOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const developmentOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
];

const allowedOrigins =
  configuredOrigins.length > 0
    ? configuredOrigins
    : process.env.NODE_ENV === 'production'
      ? []
      : developmentOrigins;

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests without an Origin header (e.g. health checks/server-to-server).
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('CORS_ORIGIN_BLOCKED'));
    },
    credentials: true,
  }),
>>>>>>> bae9ce1fa03153cbb09537b55e5713cab8eabda3
);

app.use(express.json({ limit: '1mb' }));

<<<<<<< HEAD
// Health-check endpoint.
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'HealthSync backend is running',
    environment: process.env.NODE_ENV || 'development',
  });
});

// API routes.
=======
app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'HealthSync API is running',
  });
});

>>>>>>> bae9ce1fa03153cbb09537b55e5713cab8eabda3
app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/user', userRouter);

<<<<<<< HEAD
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
=======
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found',
  });
});

app.use((err, _req, res, _next) => {
  if (err.message === 'CORS_ORIGIN_BLOCKED') {
    return res.status(403).json({
      success: false,
      message: 'This origin is not allowed by the API CORS policy.',
    });
  }

  console.error('Unhandled API error:', err);

  return res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});

>>>>>>> bae9ce1fa03153cbb09537b55e5713cab8eabda3
const startServer = async () => {
  try {
    await connectDB();
    connectCloudinary();

    app.listen(PORT, '0.0.0.0', () => {
<<<<<<< HEAD
      console.log(`HealthSync backend listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start HealthSync backend:', error);
=======
      console.log(`HealthSync API listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start HealthSync backend:', error.message);
>>>>>>> bae9ce1fa03153cbb09537b55e5713cab8eabda3
    process.exit(1);
  }
};

startServer();
