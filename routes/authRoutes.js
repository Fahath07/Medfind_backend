const express = require('express');
const { register, login, pharmacyLogin, pharmacyRegister } = require('../controllers/authController');
const { validateAuth } = require('../middleware/validation');

const router = express.Router();

router.post('/register', validateAuth, register);
router.post('/login', validateAuth, login);
router.post('/pharmacy/register', validateAuth, pharmacyRegister);
router.post('/pharmacy/login', validateAuth, pharmacyLogin);

module.exports = router;