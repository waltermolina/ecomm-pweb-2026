const express = require('express');
const authController = require('../controllers/authController');
const { validateRegister } = require('../middlewares/validateRegister');

const router = express.Router();

/**
 * Rutas de login y registro (sin autenticación real).
 * @route GET /login - Formulario de inicio de sesión.
 * @route GET /register - Formulario de registro.
 * @route POST /register - Validación del registro con middleware reutilizable.
 */
router.get('/login', authController.loginForm);
router.get('/register', authController.registerForm);
router.post('/register', validateRegister, authController.register);

module.exports = router;
