const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createTestUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete existing test user if exists
    await User.deleteOne({ email: 'test@test.com' });
    
    // Create test user
    const testUser = await User.create({
      name: 'Test User',
      email: 'test@test.com',
      password: '123456',
      role: 'user'
    });

    console.log('✅ Test user created successfully:');
    console.log('Email: test@test.com');
    console.log('Password: 123456');
    console.log('User ID:', testUser._id);

    // Create test pharmacy user
    await User.deleteOne({ email: 'pharmacy@test.com' });
    
    const testPharmacy = await User.create({
      name: 'Test Pharmacy',
      email: 'pharmacy@test.com',
      password: '123456',
      role: 'pharmacy'
    });

    console.log('✅ Test pharmacy user created successfully:');
    console.log('Email: pharmacy@test.com');
    console.log('Password: 123456');
    console.log('Pharmacy ID:', testPharmacy._id);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test user:', error);
    process.exit(1);
  }
};

createTestUser();