const cartService = require('../services/cartService');

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
    res.redirect('/cart');
  },

  /**
   * Aumenta en una unidad la cantidad de un producto del carrito.
   * @param {import('express').Request} req Request de Express.
   * @param {import('express').Response} res Response de Express.
   * @returns {void}
   */
  increase(req, res) {
    cartService.updateQuantity(req, req.productId, 1);
    res.redirect('/cart');
  },

  /**
   * Disminuye en una unidad la cantidad de un producto y lo elimina si llega a cero.
   * @param {import('express').Request} req Request de Express.
   * @param {import('express').Response} res Response de Express.
   * @returns {void}
   */
  decrease(req, res) {
    cartService.updateQuantity(req, req.productId, -1);
    res.redirect('/cart');
  },

  /**
   * Vacía por completo el carrito de la sesión.
   * @param {import('express').Request} req Request de Express.
   * @param {import('express').Response} res Response de Express.
   * @returns {void}
   */
  clear(req, res) {
    cartService.clear(req);
    res.redirect('/cart');
  },
};

module.exports = cartController;
