const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegistration } = require('../middleware/authMiddleware');

router.post('/register', validateRegistration, authController.register);
router.post('/login', authController.login);

module.exports = router;
