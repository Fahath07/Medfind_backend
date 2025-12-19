const express = require('express');
const {
  searchMedicines,
  getMedicines,
  createMedicine,
  updateMedicine,
  deleteMedicine
} = require('../controllers/medicineController');
const { auth, pharmacyAuth } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/search', searchMedicines);

// Protected pharmacy routes
router.get('/', pharmacyAuth, getMedicines);
router.post('/', pharmacyAuth, createMedicine);
router.put('/:id', pharmacyAuth, updateMedicine);
router.delete('/:id', pharmacyAuth, deleteMedicine);

module.exports = router;