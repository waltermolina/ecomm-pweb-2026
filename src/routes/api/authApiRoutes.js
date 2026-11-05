const express = require('express');
const authController = require('../../controllers/authController');

const router = express.Router();

router.post('/register', authController.registerApi);
router.post('/login', authController.loginApi);

module.exports = router;
