// shrifurniturevillage-backend/src/scripts/seed.js
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Category from '../models/Category.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

async function seed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Create categories
    const categories = [
      { name: 'Sofas', slug: 'sofas' },
      { name: 'Wooden Sofas', slug: 'wooden-sofas' },
      { name: 'Beds', slug: 'beds' },
      { name: 'Bedroom', slug: 'bedroom' },
      { name: 'Dining', slug: 'dining' },
      { name: 'Dining & Kitchen', slug: 'dining-kitchen' },
      { name: 'Living Room', slug: 'living-room' },
      { name: 'Office', slug: 'office' }
    ];

    console.log('Creating categories...');
    for (const cat of categories) {
      const existing = await Category.findOne({ slug: cat.slug });
      if (!existing) {
        await Category.create(cat);
        console.log(`Created category: ${cat.name}`);
      } else {
        console.log(`Category already exists: ${cat.name}`);
      }
    }

    // Create admin user
    const adminEmail = 'admin@shrifurniture.com';
    const adminPassword = 'admin123';
    
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      await User.create({
        email: adminEmail,
        passwordHash,
        role: 'admin',
        name: 'Admin User'
      });
      console.log(`Created admin user: ${adminEmail} (password: ${adminPassword})`);
    } else {
      console.log(`Admin user already exists: ${adminEmail}`);
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
