const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'MedFind API is running',
    timestamp: new Date().toISOString()
  });
});

// User login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'test@test.com' && password === '123456') {
    res.json({
      success: true,
      message: 'Login successful',
      token: 'test-token-123',
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@test.com',
        role: 'user'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

// User registration
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  res.json({
    success: true,
    message: 'User registered successfully',
    token: 'test-token-123',
    user: {
      id: '2',
      name: name,
      email: email,
      role: 'user'
    }
  });
});

// Pharmacy login
app.post('/api/auth/pharmacy/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'pharmacy@test.com' && password === '123456') {
    res.json({
      success: true,
      message: 'Pharmacy login successful',
      token: 'pharmacy-token-123',
      user: {
        id: '3',
        name: 'Test Pharmacy',
        email: 'pharmacy@test.com',
        role: 'pharmacy'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid pharmacy credentials'
    });
  }
});

// Medicine search
app.get('/api/medicines/search', (req, res) => {
  const { name } = req.query;
  const medicines = [
    { id: 1, name: 'Paracetamol', price: 10, pharmacy: 'Test Pharmacy' },
    { id: 2, name: 'Aspirin', price: 15, pharmacy: 'Test Pharmacy' },
    { id: 3, name: 'Ibuprofen', price: 20, pharmacy: 'Test Pharmacy' }
  ];
  
  const filtered = name ? medicines.filter(m => m.name.toLowerCase().includes(name.toLowerCase())) : medicines;
  res.json({ success: true, medicines: filtered });
});

// Contact form
app.post('/api/contact', (req, res) => {
  res.json({ success: true, message: 'Message sent successfully' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 MedFind server running on port ${PORT}`);
  console.log(`📡 Health: http://localhost:${PORT}/api/health`);
  console.log(`👤 Login: test@test.com / 123456`);
  console.log(`🏥 Pharmacy: pharmacy@test.com / 123456`);
});