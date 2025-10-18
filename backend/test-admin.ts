import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import { Admin } from './src/models/Admin.js';

dotenv.config();

const testAdminLogin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/final-year-db';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Find the admin user
    const admin = await Admin.findOne({ email: 'admin@university.edu' }).select('+passwordHash');
    
    if (!admin) {
      console.log('❌ Admin user not found');
      process.exit(1);
    }

    console.log('✅ Admin found:');
    console.log('  Email:', admin.email);
    console.log('  Password Hash:', admin.passwordHash.substring(0, 20) + '...');

    // Test password comparison
    const testPassword = 'Admin@123';
    const isValid = await admin.comparePassword(testPassword);
    
    console.log(`\nPassword Test:`);
    console.log(`  Password: ${testPassword}`);
    console.log(`  Valid: ${isValid}`);

    if (!isValid) {
      console.log('\n⚠️ Password comparison failed. Trying to re-hash...');
      
      // Delete and recreate admin
      await Admin.deleteMany({});
      const newAdmin = new Admin({
        email: 'admin@university.edu',
        passwordHash: 'Admin@123',
        role: 'admin',
      });
      await newAdmin.save();
      console.log('✅ Admin recreated with new hash');

      // Test again
      const updatedAdmin = await Admin.findOne({ email: 'admin@university.edu' }).select('+passwordHash');
      const isValidNow = await updatedAdmin!.comparePassword('Admin@123');
      console.log(`  New validation result: ${isValidNow}`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

testAdminLogin();
