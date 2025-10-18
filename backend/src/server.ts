import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { connectDB, disconnectDB } from './config/database.js';
import { config } from './config/index.js';
import { errorHandler, notFound } from './middleware/index.js';
import projectRoutes from './routes/projectRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app: Application = express();

// =============================================
// SECURITY & MIDDLEWARE
// =============================================

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: config.cors.origin,
    credentials: config.cors.credentials,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api/', limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// =============================================
// API ROUTES
// =============================================

// Project routes
app.use('/api/projects', projectRoutes);

// Admin routes
app.use('/api/admin', adminRoutes);

// =============================================
// ERROR HANDLING
// =============================================

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

// =============================================
// SERVER START
// =============================================

const PORT = config.server.port;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║   🚀 Final-Year Project Repository    ║
║   📌 API Server Started                ║
╠════════════════════════════════════════╣
║   Port: ${PORT}                              ║
║   Environment: ${config.server.nodeEnv}              ║
║   CORS Origins: ${config.cors.origin.join(', ')} ║
╚════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('📛 SIGTERM received. Shutting down gracefully...');
  await disconnectDB();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('📛 SIGINT received. Shutting down gracefully...');
  await disconnectDB();
  process.exit(0);
});

// Unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

startServer();

export default app;
