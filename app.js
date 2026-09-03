const crypto = require('crypto');
const path = require('path');
const express = require('express');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');

const { migrateProducts } = require('./db/migrate');
const routes = require('./src/routes');
const cartLocals = require('./src/middlewares/cartLocals');
const csrfProtection = require('./src/middlewares/csrfProtection');
const { notFoundHandler, errorHandler } = require('./src/middlewares/errorHandler');

/**
 * Asegura que el catálogo semilla esté disponible en SQLite.
 * Usa `INSERT OR IGNORE`, por lo que es seguro ejecutarla en cada arranque.
 */
migrateProducts();

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Clave de firma de la cookie de sesión.
 * En desarrollo se genera una clave aleatoria por arranque para no versionar secretos.
 */
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');

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
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    },
  }),
);

app.use(csrfProtection);
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
    console.log(`Mi Ecommerce Sprint 3 disponible en http://localhost:${PORT}`);
  });
}

module.exports = app;
