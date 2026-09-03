const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

/**
 * Rutas de categorías.
 * @route GET /categories/:category - Listado filtrado por categoría.
 */
router.get('/:category', productController.byCategory);

module.exports = router;
