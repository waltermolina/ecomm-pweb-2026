const productService = require('../services/productService');

/**
 * Convierte un identificador recibido por URL en un número entero positivo.
 * @param {string|number} value Valor recibido en la ruta.
 * @returns {number|null} Identificador numérico o `null` si no es válido.
 */
function normalizeId(value) {
  const rawValue = String(value ?? '').trim();

  if (!/^\d+$/.test(rawValue)) {
    return null;
  }

  const id = Number(rawValue);

  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

/**
 * Crea un error HTTP con el status indicado.
 * @param {number} status Código de estado HTTP.
 * @param {string} message Mensaje interno del error.
 * @returns {Error & { status: number }} Error listo para el middleware global.
 */
function createHttpError(status, message) {
  const error = new Error(message);
  error.status = status;

  return error;
}

/**
 * Middleware que valida el parámetro `:id` recibido por URL.
 * Responde 400 si el id no es numérico y 404 si el producto no existe en SQLite.
 * Deja disponibles `req.productId` y `req.product` para los controladores.
 * @param {import('express').Request} req Request de Express.
 * @param {import('express').Response} res Response de Express.
 * @param {import('express').NextFunction} next Función para continuar la cadena.
 * @returns {void}
 */
function validateProductId(req, res, next) {
  const id = normalizeId(req.params.id);

  if (id === null) {
    next(createHttpError(400, 'Identificador de producto inválido.'));
    return;
  }

  if (!productService.exists(id)) {
    next(createHttpError(404, 'Producto inexistente.'));
    return;
  }

  req.productId = id;
  req.product = productService.getById(id);
  next();
}

module.exports = { normalizeId, validateProductId, createHttpError };
