const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';
let authToken = '';
let pharmacyToken = '';

// Test data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  phone: '1234567890'
};

const testPharmacy = {
  name: 'Test Owner',
  email: 'pharmacy@example.com',
  password: 'password123',
  pharmacyName: 'Test Pharmacy',
  phone: '1234567890',
  address: 'Test Address',
  location: 'Test Location'
};

const testMedicine = {
  name: 'Test Medicine',
  genericName: 'Test Generic',
  manufacturer: 'Test Manufacturer',
  price: 10.99,
  stock: 100,
  description: 'Test medicine description'
};

async function testAPI() {
  console.log('🧪 Starting comprehensive API tests...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', health.data.status);

    // Test 2: User Registration
    console.log('\n2️⃣ Testing User Registration...');
    try {
      const userReg = await axios.post(`${BASE_URL}/auth/register`, testUser);
      console.log('✅ User registration successful');
    } catch (error) {
      if (error.response?.data?.message?.includes('already exists')) {
        console.log('ℹ️ User already exists, continuing...');
      } else {
        throw error;
      }
    }

    // Test 3: User Login
    console.log('\n3️⃣ Testing User Login...');
    const userLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    authToken = userLogin.data.token;
    console.log('✅ User login successful');

    // Test 4: Pharmacy Registration
    console.log('\n4️⃣ Testing Pharmacy Registration...');
    try {
      const pharmReg = await axios.post(`${BASE_URL}/auth/pharmacy/register`, testPharmacy);
      console.log('✅ Pharmacy registration successful');
    } catch (error) {
      if (error.response?.data?.message?.includes('already exists')) {
        console.log('ℹ️ Pharmacy already exists, continuing...');
      } else {
        throw error;
      }
    }

    // Test 5: Pharmacy Login
    console.log('\n5️⃣ Testing Pharmacy Login...');
    const pharmLogin = await axios.post(`${BASE_URL}/auth/pharmacy/login`, {
      email: testPharmacy.email,
      password: testPharmacy.password
    });
    pharmacyToken = pharmLogin.data.token;
    console.log('✅ Pharmacy login successful');

    // Test 6: Get Pharmacies (Public)
    console.log('\n6️⃣ Testing Get Pharmacies...');
    const pharmacies = await axios.get(`${BASE_URL}/pharmacy`);
    console.log('✅ Get pharmacies successful, count:', pharmacies.data.length);

    // Test 7: Add Medicine (Pharmacy Protected)
    console.log('\n7️⃣ Testing Add Medicine...');
    const addMedicine = await axios.post(`${BASE_URL}/medicines`, testMedicine, {
      headers: { Authorization: `Bearer ${pharmacyToken}` }
    });
    const medicineId = addMedicine.data.id;
    console.log('✅ Add medicine successful');

    // Test 8: Search Medicines (Public)
    console.log('\n8️⃣ Testing Search Medicines...');
    const searchMeds = await axios.get(`${BASE_URL}/medicines/search?name=Test`);
    console.log('✅ Search medicines successful, found:', searchMeds.data.length);

    // Test 9: Get Pharmacy Medicines (Protected)
    console.log('\n9️⃣ Testing Get Pharmacy Medicines...');
    const pharmMeds = await axios.get(`${BASE_URL}/medicines`, {
      headers: { Authorization: `Bearer ${pharmacyToken}` }
    });
    console.log('✅ Get pharmacy medicines successful, count:', pharmMeds.data.length);

    // Test 10: Update Medicine (Protected)
    console.log('\n🔟 Testing Update Medicine...');
    const updateMed = await axios.put(`${BASE_URL}/medicines/${medicineId}`, {
      ...testMedicine,
      price: 15.99
    }, {
      headers: { Authorization: `Bearer ${pharmacyToken}` }
    });
    console.log('✅ Update medicine successful');

    // Test 11: Contact Form
    console.log('\n1️⃣1️⃣ Testing Contact Form...');
    const contact = await axios.post(`${BASE_URL}/contact`, {
      name: 'Test Contact',
      email: 'contact@example.com',
      subject: 'Test Subject',
      message: 'Test message'
    });
    console.log('✅ Contact form submission successful');

    // Test 12: Delete Medicine (Protected)
    console.log('\n1️⃣2️⃣ Testing Delete Medicine...');
    await axios.delete(`${BASE_URL}/medicines/${medicineId}`, {
      headers: { Authorization: `Bearer ${pharmacyToken}` }
    });
    console.log('✅ Delete medicine successful');

    console.log('\n🎉 All tests passed! Backend is fully functional.');

  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Wait for server to start
setTimeout(testAPI, 2000);