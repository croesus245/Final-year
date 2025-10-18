import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Admin } from './src/models/Admin.js';

dotenv.config();

const cleanup = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/final-year-db';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear admin collection
    const result = await Admin.deleteMany({});
    console.log(`🗑️ Deleted ${result.deletedCount} admin records`);

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

cleanup();
