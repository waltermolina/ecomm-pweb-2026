const cartService = require('../services/cartService');

/**
 * Middleware que expone datos globales a todas las vistas.
 * Publica la cantidad total del carrito para el header y las categorías del menú.
 * @param {import('express').Request} req Request de Express.
 * @param {import('express').Response} res Response de Express.
 * @param {import('express').NextFunction} next Función para continuar la cadena.
 * @returns {void}
 */
function cartLocals(req, res, next) {
  res.locals.cartQuantity = cartService.getTotalQuantity(req);
  next();
}

module.exports = cartLocals;
