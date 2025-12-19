const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Pharmacy = require('../models/Pharmacy');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'All fields are required',
        errors: {
          name: !name ? 'Name is required' : null,
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null
        }
      });
    }

    // Validate name length
    if (name.trim().length < 2) {
      return res.status(400).json({ 
        success: false,
        message: 'Name must be at least 2 characters long' 
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false,
        message: 'Password must be at least 6 characters long' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'User with this email already exists' 
      });
    }

    // Create user with validated role
    const userData = {
      name: name.trim(),
      email: email.toLowerCase(),
      password,
      role: role && ['user', 'pharmacy'].includes(role) ? role : 'user'
    };

    const user = await User.create(userData);
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = {};
      Object.keys(error.errors).forEach(key => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    res.status(500).json({ 
      success: false,
      message: 'Internal server error during registration' 
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and password are required' 
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error during login' 
    });
  }
};

const pharmacyLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and password are required' 
      });
    }

    const user = await User.findOne({ 
      email: email.toLowerCase(), 
      role: 'pharmacy' 
    });
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid pharmacy credentials' 
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid pharmacy credentials' 
      });
    }

    const pharmacy = await Pharmacy.findOne({ owner: user._id });
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Pharmacy login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      pharmacy: pharmacy || null
    });
  } catch (error) {
    console.error('Pharmacy login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error during pharmacy login' 
    });
  }
};

const pharmacyRegister = async (req, res) => {
  try {
    const { name, email, password, pharmacyName, phone, address, location } = req.body;

    // Validate required fields for pharmacy registration
    const requiredFields = { name, email, password, pharmacyName, phone, address, location };
    const missingFields = Object.keys(requiredFields).filter(field => !requiredFields[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required for pharmacy registration',
        missingFields
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'User with this email already exists' 
      });
    }

    // Check if pharmacy with same email exists
    const existingPharmacy = await Pharmacy.findOne({ email: email.toLowerCase() });
    if (existingPharmacy) {
      return res.status(400).json({ 
        success: false,
        message: 'Pharmacy with this email already exists' 
      });
    }

    // Create pharmacy user
    const userData = {
      name: name.trim(),
      email: email.toLowerCase(),
      password,
      role: 'pharmacy'
    };

    const user = await User.create(userData);

    // Create pharmacy profile
    const pharmacyData = {
      name: pharmacyName.trim(),
      email: email.toLowerCase(),
      phone: phone.trim(),
      address: address.trim(),
      location: location.trim(),
      owner: user._id
    };

    const pharmacy = await Pharmacy.create(pharmacyData);
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Pharmacy registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      pharmacy: {
        id: pharmacy._id,
        name: pharmacy.name,
        email: pharmacy.email,
        phone: pharmacy.phone,
        address: pharmacy.address,
        location: pharmacy.location
      }
    });
  } catch (error) {
    console.error('Pharmacy registration error:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = {};
      Object.keys(error.errors).forEach(key => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Pharmacy with this email already exists'
      });
    }

    res.status(500).json({ 
      success: false,
      message: 'Internal server error during pharmacy registration' 
    });
  }
};

module.exports = { register, login, pharmacyLogin, pharmacyRegister };