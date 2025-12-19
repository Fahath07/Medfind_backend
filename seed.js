const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Pharmacy = require('./models/Pharmacy');
const Medicine = require('./models/Medicine');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medfind');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Pharmacy.deleteMany({});
    await Medicine.deleteMany({});

    // Create pharmacy users
    const pharmacyUser1 = await User.create({
      name: 'Apollo Pharmacy Owner',
      email: 'apollo@pharmacy.com',
      password: 'password123',
      role: 'pharmacy'
    });

    const pharmacyUser2 = await User.create({
      name: 'MedPlus Owner',
      email: 'medplus@pharmacy.com',
      password: 'password123',
      role: 'pharmacy'
    });

    // Create regular user
    await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user'
    });

    // Create pharmacies
    const pharmacy1 = await Pharmacy.create({
      name: 'Apollo Pharmacy',
      email: 'apollo@pharmacy.com',
      phone: '+91 9876543210',
      address: '123 Main Street, Coimbatore',
      location: 'Coimbatore, Tamil Nadu',
      owner: pharmacyUser1._id
    });

    const pharmacy2 = await Pharmacy.create({
      name: 'MedPlus Pharmacy',
      email: 'medplus@pharmacy.com',
      phone: '+91 9876543211',
      address: '456 Park Avenue, Chennai',
      location: 'Chennai, Tamil Nadu',
      owner: pharmacyUser2._id
    });

    // Create medicines
    const medicines = [
      { name: 'Paracetamol', category: 'Pain Relief', price: 25, quantity: 100, pharmacy: pharmacy1._id },
      { name: 'Aspirin', category: 'Pain Relief', price: 30, quantity: 50, pharmacy: pharmacy1._id },
      { name: 'Ibuprofen', category: 'Anti-inflammatory', price: 45, quantity: 75, pharmacy: pharmacy1._id },
      { name: 'Paracetamol', category: 'Pain Relief', price: 28, quantity: 80, pharmacy: pharmacy2._id },
      { name: 'Cough Syrup', category: 'Respiratory', price: 120, quantity: 30, pharmacy: pharmacy2._id },
      { name: 'Vitamin D', category: 'Supplements', price: 200, quantity: 40, pharmacy: pharmacy2._id }
    ];

    await Medicine.insertMany(medicines);

    console.log('Seed data created successfully!');
    console.log('\nTest Credentials:');
    console.log('User Login: john@example.com / password123');
    console.log('Pharmacy Login: apollo@pharmacy.com / password123');
    console.log('Pharmacy Login: medplus@pharmacy.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();