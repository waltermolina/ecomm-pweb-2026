const cartService = require('../services/cartService');
const eventService = require('../services/eventService');

/**
 * Publica el estado real del carrito por WebSocket para todas las pestañas
 * asociadas a la misma sesión.
 * @param {import('express').Request} req Request de Express.
 * @returns {{items: number, total: number, detailedItems: import('../services/cartService').CartDetailItem[]}} Estado del carrito.
 */
function broadcastCart(req) {
  const cartSummary = cartService.getSummary(req);
  eventService.broadcast('cartUpdated', cartSummary, req.sessionID);

  if (cartSummary.items === 0) {
    eventService.broadcast('cartEmptied', cartSummary, req.sessionID);
  }

  return cartSummary;
}

/**
 * Responde una mutación del carrito conservando el flujo SSR sin JavaScript
 * y entregando JSON cuando la acción fue interceptada por el cliente WebSocket.
 * @param {import('express').Request} req Request de Express.
 * @param {import('express').Response} res Response de Express.
 * @param {{items: number, total: number, detailedItems: object[]}} cartSummary Estado del carrito.
 * @returns {void}
 */
function respondCartChange(req, res, cartSummary) {
  if (req.get('accept') && req.get('accept').includes('application/json')) {
    res.json({ ok: true, cart: cartSummary });
    return;
  }

  res.redirect('/cart');
}

/**
 * Controlador del carrito.
 * Toda manipulación de `req.session.cart` se delega en `cartService`.
 */
const cartController = {
  /**
   * Renderiza el carrito combinando los ids de la sesión con los datos del JSON.
   * @param {import('express').Request} req Request de Express.
   * @param {import('express').Response} res Response de Express.
   * @returns {void}
   */
  show(req, res) {
    res.render('pages/cart', {
      title: 'Carrito',
      cartItems: cartService.getDetailedItems(req),
      cartTotal: cartService.getTotal(req),
    });
  },

  /**
   * Agrega un producto al carrito e incrementa la cantidad si ya existía.
   * @param {import('express').Request} req Request de Express.
   * @param {import('express').Response} res Response de Express.
   * @returns {void}
   */
  add(req, res) {
    cartService.addProduct(req, req.productId);
    respondCartChange(req, res, broadcastCart(req));
  },

  /**
   * Aumenta en una unidad la cantidad de un producto del carrito.
   * @param {import('express').Request} req Request de Express.
   * @param {import('express').Response} res Response de Express.
   * @returns {void}
   */
  increase(req, res) {
    cartService.updateQuantity(req, req.productId, 1);
    respondCartChange(req, res, broadcastCart(req));
  },

  /**
   * Disminuye en una unidad la cantidad de un producto y lo elimina si llega a cero.
   * @param {import('express').Request} req Request de Express.
   * @param {import('express').Response} res Response de Express.
   * @returns {void}
   */
  decrease(req, res) {
    cartService.updateQuantity(req, req.productId, -1);
    respondCartChange(req, res, broadcastCart(req));
  },

  /**
   * Elimina una línea completa del carrito.
   * @param {import('express').Request} req Request de Express.
   * @param {import('express').Response} res Response de Express.
   * @returns {void}
   */
  remove(req, res) {
    cartService.removeProduct(req, req.productId);
    respondCartChange(req, res, broadcastCart(req));
  },

  /**
   * Vacía por completo el carrito de la sesión.
   * @param {import('express').Request} req Request de Express.
   * @param {import('express').Response} res Response de Express.
   * @returns {void}
   */
  clear(req, res) {
    cartService.clear(req);
    respondCartChange(req, res, broadcastCart(req));
  },
};

module.exports = cartController;
