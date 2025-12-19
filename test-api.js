const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testAPI() {
  try {
    console.log('Testing MedFind API...\n');

    // Test health check
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', health.data);

    // Test medicine search
    const search = await axios.get(`${BASE_URL}/medicines/search?name=paracetamol`);
    console.log('✅ Medicine Search:', search.data.length, 'results found');

    // Test user login
    const login = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'john@example.com',
      password: 'password123'
    });
    console.log('✅ User Login:', login.data.user.name);

    // Test pharmacy login
    const pharmacyLogin = await axios.post(`${BASE_URL}/auth/pharmacy/login`, {
      email: 'apollo@pharmacy.com',
      password: 'password123'
    });
    console.log('✅ Pharmacy Login:', pharmacyLogin.data.pharmacy.name);

    console.log('\n🎉 All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAPI();