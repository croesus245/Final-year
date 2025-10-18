import dotenv from 'dotenv';

dotenv.config();

export const config = {
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/final-year-db',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
    expire: process.env.JWT_EXPIRE || '7d',
  },
  server: {
    port: parseInt(process.env.PORT || '5000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  cors: {
    origin: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(','),
    credentials: true,
  },
  file: {
    maxSize: parseInt(process.env.MAX_FILE_SIZE || '52428800', 10), // 50MB
    uploadDir: process.env.UPLOAD_DIR || './uploads',
  },
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@university.edu',
    defaultPassword: process.env.ADMIN_PASSWORD || 'ChangeMeInProduction',
  },
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3000',
  },
};
