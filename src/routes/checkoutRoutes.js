const express = require('express');
const checkoutController = require('../controllers/checkoutController');
const { requireLogin } = require('../middlewares/sessionAuth');

const router = express.Router();

/**
 * Rutas de checkout.
 * @route GET /checkout - Mensaje temporal del próximo sprint.
 */
router.get('/', requireLogin, checkoutController.show);

module.exports = router;
