const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validateRequired = (fields, req, res, next) => {
  const missing = [];
  
  fields.forEach(field => {
    if (!req.body[field] || req.body[field].trim() === '') {
      missing.push(field);
    }
  });

  if (missing.length > 0) {
    return res.status(400).json({
      message: `Missing required fields: ${missing.join(', ')}`
    });
  }

  next();
};

const validateAuth = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = {};

  // Validate email
  if (!email || email.trim() === '') {
    errors.email = 'Email is required';
  } else if (!validateEmail(email)) {
    errors.email = 'Please provide a valid email address';
  }

  // Validate password
  if (!password || password.trim() === '') {
    errors.password = 'Password is required';
  } else if (!validatePassword(password)) {
    errors.password = 'Password must be at least 6 characters long';
  }

  // Validate name for registration (if present in request)
  if (req.path === '/register') {
    if (!name || name.trim() === '') {
      errors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    } else if (name.trim().length > 50) {
      errors.name = 'Name cannot exceed 50 characters';
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

module.exports = {
  validateEmail,
  validatePassword,
  validateRequired,
  validateAuth
};