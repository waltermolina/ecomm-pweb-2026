const express = require('express');
const authController = require('../controllers/authController');
const { validateRegister } = require('../middlewares/validateRegister');
const { guestOnly } = require('../middlewares/sessionAuth');

const router = express.Router();

/**
 * Rutas SSR de login y registro; comparten el servicio de autenticación con la API.
 * @route GET /login - Formulario de inicio de sesión.
 * @route POST /login - Valida credenciales e inicia una sesión SSR.
 * @route GET /register - Formulario de registro.
 * @route POST /register - Validación del registro con middleware reutilizable.
 */
router.get('/login', guestOnly, authController.loginForm);
router.post('/login', guestOnly, authController.login);
router.get('/register', guestOnly, authController.registerForm);
router.post('/register', guestOnly, validateRegister, authController.register);
router.post('/logout', authController.logout);

module.exports = router;
