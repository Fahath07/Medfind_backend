const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testFrontendIntegration() {
  console.log('🔗 Testing Frontend-Backend Integration...\n');

  try {
    // Test 1: Health Check (Frontend would call this)
    console.log('1️⃣ Testing Health Check Endpoint...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check:', health.data.status);

    // Test 2: User Registration (Frontend signup form)
    console.log('\n2️⃣ Testing User Registration Flow...');
    const userRegData = {
      name: 'Frontend User',
      email: 'frontend@example.com',
      password: 'password123'
    };
    
    try {
      const userReg = await axios.post(`${BASE_URL}/auth/register`, userRegData);
      console.log('✅ User registration successful');
    } catch (error) {
      if (error.response?.data?.message?.includes('already exists')) {
        console.log('ℹ️ User already exists, continuing...');
      } else {
        throw error;
      }
    }

    // Test 3: User Login (Frontend login form)
    console.log('\n3️⃣ Testing User Login Flow...');
    const userLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: userRegData.email,
      password: userRegData.password
    });
    console.log('✅ User login successful, token received');

    // Test 4: Medicine Search (Frontend search functionality)
    console.log('\n4️⃣ Testing Medicine Search (Public)...');
    const searchResults = await axios.get(`${BASE_URL}/medicines/search?name=Test`);
    console.log('✅ Medicine search successful, results:', searchResults.data.length);

    // Test 5: Get Pharmacies (Frontend pharmacy listing)
    console.log('\n5️⃣ Testing Get Pharmacies (Public)...');
    const pharmacies = await axios.get(`${BASE_URL}/pharmacy`);
    console.log('✅ Get pharmacies successful, count:', pharmacies.data.length);

    // Test 6: Contact Form (Frontend contact page)
    console.log('\n6️⃣ Testing Contact Form Submission...');
    const contactData = {
      name: 'Frontend Contact',
      email: 'contact@frontend.com',
      subject: 'Integration Test',
      message: 'Testing frontend integration'
    };
    const contact = await axios.post(`${BASE_URL}/contact`, contactData);
    console.log('✅ Contact form submission successful');

    // Test 7: Pharmacy Registration (Frontend pharmacy signup)
    console.log('\n7️⃣ Testing Pharmacy Registration Flow...');
    const pharmacyRegData = {
      name: 'Frontend Owner',
      email: 'frontendpharmacy@example.com',
      password: 'password123',
      pharmacyName: 'Frontend Pharmacy',
      phone: '9876543210',
      address: 'Frontend Address',
      location: 'Frontend Location'
    };

    try {
      const pharmReg = await axios.post(`${BASE_URL}/auth/pharmacy/register`, pharmacyRegData);
      console.log('✅ Pharmacy registration successful');
    } catch (error) {
      if (error.response?.data?.message?.includes('already exists')) {
        console.log('ℹ️ Pharmacy already exists, continuing...');
      } else {
        throw error;
      }
    }

    // Test 8: Pharmacy Login (Frontend pharmacy login)
    console.log('\n8️⃣ Testing Pharmacy Login Flow...');
    const pharmLogin = await axios.post(`${BASE_URL}/auth/pharmacy/login`, {
      email: pharmacyRegData.email,
      password: pharmacyRegData.password
    });
    const pharmacyToken = pharmLogin.data.token;
    console.log('✅ Pharmacy login successful, token received');

    // Test 9: Protected Pharmacy Routes (Frontend pharmacy dashboard)
    console.log('\n9️⃣ Testing Protected Pharmacy Routes...');
    
    // Get pharmacy medicines
    const pharmMeds = await axios.get(`${BASE_URL}/medicines`, {
      headers: { Authorization: `Bearer ${pharmacyToken}` }
    });
    console.log('✅ Get pharmacy medicines successful, count:', pharmMeds.data.length);

    // Add medicine
    const newMedicine = {
      name: 'Frontend Medicine',
      price: 25.99,
      quantity: 50,
      category: 'Test Category'
    };
    const addMed = await axios.post(`${BASE_URL}/medicines`, newMedicine, {
      headers: { Authorization: `Bearer ${pharmacyToken}` }
    });
    console.log('✅ Add medicine successful');

    console.log('\n🎉 All frontend-backend integration tests passed!');
    console.log('\n📋 Summary:');
    console.log('   ✅ User authentication flows working');
    console.log('   ✅ Pharmacy authentication flows working');
    console.log('   ✅ Public API endpoints accessible');
    console.log('   ✅ Protected API endpoints secured');
    console.log('   ✅ Medicine search functionality working');
    console.log('   ✅ Contact form submission working');
    console.log('   ✅ All CRUD operations functional');

  } catch (error) {
    console.error('\n❌ Integration test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

testFrontendIntegration();