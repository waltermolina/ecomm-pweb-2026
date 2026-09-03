const express = require('express');
const cartController = require('../controllers/cartController');
const { validateProductId } = require('../middlewares/normalizeId');

const router = express.Router();

/**
 * Rutas del carrito en sesión.
 * @route GET /cart - Vista del carrito.
 * @route POST /cart/add/:id - Agrega un producto o incrementa su cantidad.
 * @route POST /cart/increase/:id - Suma una unidad.
 * @route POST /cart/decrease/:id - Resta una unidad y elimina la línea si llega a 0.
 * @route POST /cart/remove/:id - Elimina una línea completa.
 * @route POST /cart/clear - Vacía el carrito.
 */
router.get('/', cartController.show);
router.post('/add/:id', validateProductId, cartController.add);
router.post('/increase/:id', validateProductId, cartController.increase);
router.post('/decrease/:id', validateProductId, cartController.decrease);
router.post('/remove/:id', validateProductId, cartController.remove);
router.post('/clear', cartController.clear);

module.exports = router;
