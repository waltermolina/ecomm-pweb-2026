const express = require('express');
const homeController = require('../controllers/homeController');

const router = express.Router();

/**
 * Rutas del home.
 * @route GET / - Página de inicio con destacados y más pedidos.
 */
router.get('/', homeController.index);

module.exports = router;
