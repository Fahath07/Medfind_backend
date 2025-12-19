const express = require('express');
const {
  createPharmacy,
  getPharmacies,
  getPharmacy,
  updatePharmacy
} = require('../controllers/pharmacyController');
const { auth, pharmacyAuth } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', createPharmacy);
router.get('/', getPharmacies);
router.get('/:id', getPharmacy);

// Protected routes
router.put('/:id', pharmacyAuth, updatePharmacy);

module.exports = router;