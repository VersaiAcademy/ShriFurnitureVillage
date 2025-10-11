import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

async function reset() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI not set in environment');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    const email = 'admin@shrifurniture.com';
    const newPassword = 'admin123';

    const user = await User.findOne({ email });
    if (!user) {
      const passwordHash = await bcrypt.hash(newPassword, 10);
      const created = await User.create({ email, passwordHash, role: 'admin', name: 'Admin User' });
      console.log('Created admin user with email:', created.email);
    } else {
      const passwordHash = await bcrypt.hash(newPassword, 10);
      user.passwordHash = passwordHash;
      // normalize role to lowercase to satisfy enum
      user.role = String(user.role || 'admin').toLowerCase();
      await user.save();
      console.log('Updated admin password for:', email, 'and normalized role to', user.role);
    }

    console.log('Done. Admin password reset to:', newPassword);
    process.exit(0);
  } catch (err) {
    console.error('Error resetting admin password:', err.message || err);
    process.exit(1);
  }
}

reset();
