const crypto = require('crypto');

const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'];

/**
 * Compara dos tokens en tiempo constante.
 * @param {string} expected Token guardado en la sesión.
 * @param {string} received Token recibido en el formulario.
 * @returns {boolean} `true` si ambos tokens coinciden.
 */
function isSameToken(expected, received) {
  const expectedBuffer = Buffer.from(String(expected ?? ''));
  const receivedBuffer = Buffer.from(String(received ?? ''));

  if (expectedBuffer.length === 0 || expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}

/**
 * Middleware de protección CSRF para los formularios del sitio.
 * Genera un token por sesión, lo publica en `res.locals.csrfToken`
 * y valida el campo `_csrf` en los métodos que modifican estado.
 * @param {import('express').Request} req Request de Express.
 * @param {import('express').Response} res Response de Express.
 * @param {import('express').NextFunction} next Función para continuar la cadena.
 * @returns {void}
 */
function csrfProtection(req, res, next) {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString('hex');
  }

  res.locals.csrfToken = req.session.csrfToken;

  if (SAFE_METHODS.includes(req.method)) {
    next();
    return;
  }

  if (!isSameToken(req.session.csrfToken, req.body && req.body._csrf)) {
    const error = new Error('Token CSRF inválido.');
    error.status = 400;
    next(error);
    return;
  }

  next();
}

module.exports = csrfProtection;
