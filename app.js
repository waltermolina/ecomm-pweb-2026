const path = require('path');
const express = require('express');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');

const routes = require('./src/routes');
const cartLocals = require('./src/middlewares/cartLocals');
const { notFoundHandler, errorHandler } = require('./src/middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Configuración principal de Express.
 * Define EJS con layout base, expone la carpeta pública, habilita el parseo de
 * formularios y activa las sesiones donde vive el carrito.
 */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('layout', 'layouts/main');
app.use(expressLayouts);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'mi-ecommerce-sprint-2',
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true, sameSite: 'lax' },
  }),
);

app.use(cartLocals);

/**
 * Rutas de la aplicación agrupadas en el router principal.
 */
app.use('/', routes);

/**
 * Manejo de rutas inexistentes (404) y middleware global de errores (500).
 */
app.use(notFoundHandler);
app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Mi Ecommerce Sprint 2 disponible en http://localhost:${PORT}`);
  });
}

module.exports = app;
