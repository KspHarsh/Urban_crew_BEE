import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

// Load environment variables
dotenv.config();

// ============================================
// Admin Seed Script
// ============================================
// Usage: node seed.js
//
// This script creates a default admin account using
// credentials from environment variables.
// It checks for existing admin to avoid duplicates.
// Password is hashed using bcrypt before saving.
//
// SECURITY NOTE: This script is for initial setup only
// and must NOT be exposed as a public API endpoint.
// ============================================

const seedAdmin = async () => {
    try {
        // Connect to MongoDB
        console.log('🔗 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Get admin credentials from environment variables
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;
        const adminName = process.env.ADMIN_NAME || 'UrbanCrew Admin';
        const adminPhone = process.env.ADMIN_PHONE || '9999999999';

        if (!adminEmail || !adminPassword) {
            console.error('❌ ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env file');
            process.exit(1);
        }

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log(`⚠️  Admin already exists with email: ${adminEmail}`);
            console.log(`   Role: ${existingAdmin.role}`);
            console.log(`   Active: ${existingAdmin.isActive}`);
            console.log('   No changes made.');
            process.exit(0);
        }

        // Create admin user (password will be hashed by the User model pre-save hook)
        const admin = await User.create({
            name: adminName,
            email: adminEmail,
            password: adminPassword, // Hashed automatically by Mongoose pre-save hook
            phone: adminPhone,
            role: 'admin',
            isActive: true
        });

        console.log('\n✅ Admin account created successfully!');
        console.log('   ┌──────────────────────────────────');
        console.log(`   │ Name:     ${admin.name}`);
        console.log(`   │ Email:    ${admin.email}`);
        console.log(`   │ Role:     ${admin.role}`);
        console.log(`   │ Active:   ${admin.isActive}`);
        console.log(`   │ ID:       ${admin._id}`);
        console.log('   └──────────────────────────────────');
        console.log('\n🔒 Password has been securely hashed with bcrypt.');
        console.log('📝 You can change admin credentials via the .env file.\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error.message);
        process.exit(1);
    }
};

seedAdmin();
