const express = require('express');
const productController = require('../controllers/productController');
const { validateProductId } = require('../middlewares/normalizeId');

const router = express.Router();

/**
 * Rutas de productos.
 * @route GET /products - Listado con orden opcional (`?sort=asc` o `?sort=desc`).
 * @route GET /products/:id - Detalle de un producto validado por `validateProductId`.
 */
router.get('/', productController.list);
router.get('/:id', validateProductId, productController.detail);

module.exports = router;
