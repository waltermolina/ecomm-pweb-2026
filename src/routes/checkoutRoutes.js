const express = require('express');
const checkoutController = require('../controllers/checkoutController');

const router = express.Router();

/**
 * Rutas de checkout.
 * @route GET /checkout - Mensaje temporal del próximo sprint.
 */
router.get('/', checkoutController.show);

module.exports = router;
