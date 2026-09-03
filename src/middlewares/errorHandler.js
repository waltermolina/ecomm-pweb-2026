/**
 * Middleware que atiende todas las rutas inexistentes.
 * Renderiza la vista `404.ejs` con status HTTP 404.
 * @param {import('express').Request} req Request de Express.
 * @param {import('express').Response} res Response de Express.
 * @returns {void}
 */
function notFoundHandler(req, res) {
  res.status(404).render('pages/404', {
    title: 'Página no encontrada',
    message: 'No encontramos la página que estabas buscando.',
  });
}

/**
 * Middleware global de errores.
 * Devuelve 404 o 400 con la vista amigable y cualquier otro error con `500.ejs`.
 * Nunca expone detalles internos del error.
 * @param {Error & { status?: number }} err Error capturado.
 * @param {import('express').Request} req Request de Express.
 * @param {import('express').Response} res Response de Express.
 * @param {import('express').NextFunction} next Función para continuar la cadena.
 * @returns {void}
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = Number(err && err.status) || 500;

  if (status === 404 || status === 400) {
    res.status(status).render('pages/404', {
      title: status === 404 ? 'Página no encontrada' : 'Pedido inválido',
      message:
        status === 404
          ? 'No encontramos la página que estabas buscando.'
          : 'La dirección solicitada no es válida.',
    });
    return;
  }

  console.error('[error]', err && err.message);

  res.status(500).render('pages/500', {
    title: 'Error interno',
  });
}

module.exports = { notFoundHandler, errorHandler };
