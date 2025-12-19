const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test data
const testUser = {
  name: 'John Doe',
  email: 'john.doe@test.com',
  password: 'password123'
};

const testPharmacy = {
  name: 'Jane Smith',
  email: 'jane.pharmacy@test.com',
  password: 'password123',
  pharmacyName: 'Smith Pharmacy',
  phone: '+1234567890',
  address: '123 Main Street, City',
  location: 'Downtown'
};

async function testAPI() {
  console.log('🧪 Starting MedFind API Tests...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', healthResponse.data.status);
    console.log('');

    // Test 2: User Registration
    console.log('2️⃣ Testing User Registration...');
    try {
      const userRegResponse = await axios.post(`${BASE_URL}/auth/register`, testUser);
      console.log('✅ User Registration Success:', userRegResponse.data.message);
      console.log('   User ID:', userRegResponse.data.user.id);
      console.log('   Token received:', !!userRegResponse.data.token);
    } catch (error) {
      if (error.response?.data?.message?.includes('already exists')) {
        console.log('ℹ️ User already exists, continuing with login test...');
      } else {
        console.log('❌ User Registration Error:', error.response?.data?.message || error.message);
      }
    }
    console.log('');

    // Test 3: User Login
    console.log('3️⃣ Testing User Login...');
    try {
      const userLoginResponse = await axios.post(`${BASE_URL}/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });
      console.log('✅ User Login Success:', userLoginResponse.data.message);
      console.log('   User Role:', userLoginResponse.data.user.role);
    } catch (error) {
      console.log('❌ User Login Error:', error.response?.data?.message || error.message);
    }
    console.log('');

    // Test 4: Pharmacy Registration
    console.log('4️⃣ Testing Pharmacy Registration...');
    try {
      const pharmacyRegResponse = await axios.post(`${BASE_URL}/auth/pharmacy/register`, testPharmacy);
      console.log('✅ Pharmacy Registration Success:', pharmacyRegResponse.data.message);
      console.log('   Pharmacy ID:', pharmacyRegResponse.data.pharmacy.id);
      console.log('   Pharmacy Name:', pharmacyRegResponse.data.pharmacy.name);
    } catch (error) {
      if (error.response?.data?.message?.includes('already exists')) {
        console.log('ℹ️ Pharmacy already exists, continuing with login test...');
      } else {
        console.log('❌ Pharmacy Registration Error:', error.response?.data?.message || error.message);
      }
    }
    console.log('');

    // Test 5: Pharmacy Login
    console.log('5️⃣ Testing Pharmacy Login...');
    try {
      const pharmacyLoginResponse = await axios.post(`${BASE_URL}/auth/pharmacy/login`, {
        email: testPharmacy.email,
        password: testPharmacy.password
      });
      console.log('✅ Pharmacy Login Success:', pharmacyLoginResponse.data.message);
      console.log('   User Role:', pharmacyLoginResponse.data.user.role);
      console.log('   Pharmacy Info:', !!pharmacyLoginResponse.data.pharmacy);
    } catch (error) {
      console.log('❌ Pharmacy Login Error:', error.response?.data?.message || error.message);
    }
    console.log('');

    // Test 6: Validation Tests
    console.log('6️⃣ Testing Validation...');
    
    // Test invalid email
    try {
      await axios.post(`${BASE_URL}/auth/register`, {
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123'
      });
    } catch (error) {
      console.log('✅ Invalid Email Validation:', error.response?.data?.message);
    }

    // Test short password
    try {
      await axios.post(`${BASE_URL}/auth/register`, {
        name: 'Test User',
        email: 'test@example.com',
        password: '123'
      });
    } catch (error) {
      console.log('✅ Short Password Validation:', error.response?.data?.message);
    }

    // Test missing fields
    try {
      await axios.post(`${BASE_URL}/auth/register`, {
        email: 'test@example.com'
      });
    } catch (error) {
      console.log('✅ Missing Fields Validation:', error.response?.data?.message);
    }

    console.log('\n🎉 All tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure the server is running on port 5000');
      console.log('   Run: npm start or npm run dev');
    }
  }
}

// Run tests
testAPI();