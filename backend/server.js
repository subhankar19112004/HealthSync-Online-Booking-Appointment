import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.JS';
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoutes.js';

const app = express();
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
);

app.use(express.json({ limit: '1mb' }));

app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'HealthSync API is running',
  });
});

app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/user', userRouter);

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

const startServer = async () => {
  try {
    await connectDB();
    connectCloudinary();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`HealthSync API listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start HealthSync backend:', error.message);
    process.exit(1);
  }
};

startServer();
