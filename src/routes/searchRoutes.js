const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

/**
 * Rutas de búsqueda.
 * @route GET /search?query=texto - Búsqueda por coincidencia parcial del nombre.
 */
router.get('/', productController.search);

module.exports = router;
