const express = require('express');
const {
  submitContact,
  getContacts,
  updateContactStatus
} = require('../controllers/contactController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/', submitContact);

// Protected routes (admin only)
router.get('/', auth, getContacts);
router.put('/:id', auth, updateContactStatus);

module.exports = router;