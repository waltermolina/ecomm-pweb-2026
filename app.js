const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

const products = [
  {
    id: 1,
    name: 'Auriculares Urbanos',
    description: 'Auriculares cómodos para escuchar música, estudiar o jugar.',
    points: 1200,
    image: '/images/auriculares.svg',
  },
  {
    id: 2,
    name: 'Mochila Tech',
    description: 'Mochila resistente con espacio para notebook y accesorios.',
    points: 2500,
    image: '/images/mochila.svg',
  },
  {
    id: 3,
    name: 'Botella Térmica',
    description: 'Botella reutilizable para mantener bebidas frías o calientes.',
    points: 900,
    image: '/images/botella.svg',
  },
  {
    id: 4,
    name: 'Cuaderno Premium',
    description: 'Cuaderno de tapa dura ideal para apuntes de clase.',
    points: 650,
    image: '/images/cuaderno.svg',
  },
];

const cartItems = [
  {
    name: 'Auriculares Urbanos',
    quantity: 1,
    points: 1200,
    image: '/images/auriculares.svg',
  },
  {
    name: 'Botella Térmica',
    quantity: 2,
    points: 900,
    image: '/images/botella.svg',
  },
];

const cartTotal = cartItems.reduce((total, item) => total + item.points * item.quantity, 0);

/**
 * Configuración principal de Express.
 * Define EJS como motor de vistas y expone la carpeta pública.
 */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Ruta principal del ecommerce.
 * Renderiza la página de inicio con categorías y productos mockeados.
 */
app.get('/', (req, res) => {
  res.render('pages/index', { products });
});

/**
 * Ruta de detalle de producto.
 * Renderiza una pantalla estática con la información de un producto ejemplo.
 */
app.get('/products', (req, res) => {
  res.render('pages/product', { product: products[0] });
});

/**
 * Ruta del carrito.
 * Muestra productos de ejemplo sin persistencia ni base de datos.
 */
app.get('/cart', (req, res) => {
  res.render('pages/cart', { cartItems, cartTotal });
});

/**
 * Ruta de checkout.
 * Presenta un resumen simple de compra para finalizar el flujo del sprint.
 */
app.get('/checkout', (req, res) => {
  res.render('pages/checkout', { cartItems, cartTotal });
});

/**
 * Ruta de login.
 * Renderiza el formulario de inicio de sesión estático.
 */
app.get('/login', (req, res) => {
  res.render('pages/login');
});

/**
 * Ruta de registro.
 * Renderiza el formulario de registro estático.
 */
app.get('/register', (req, res) => {
  res.render('pages/register');
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Mi Ecommerce Sprint 1 disponible en http://localhost:${PORT}`);
  });
}

module.exports = app;
