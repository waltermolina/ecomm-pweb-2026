const express = require('express');
const homeRoutes = require('./homeRoutes');
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const searchRoutes = require('./searchRoutes');
const cartRoutes = require('./cartRoutes');
const checkoutRoutes = require('./checkoutRoutes');
const authRoutes = require('./authRoutes');
const ordersRoutes = require('./ordersRoutes');
const adminRoutes = require('./adminRoutes');

const router = express.Router();

/**
 * Router principal de la aplicación.
 * Agrupa todas las rutas del ecommerce bajo sus prefijos correspondientes.
 */
router.use('/', homeRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/search', searchRoutes);
router.use('/cart', cartRoutes);
router.use('/checkout', checkoutRoutes);
router.use('/orders', ordersRoutes);
router.use('/admin', adminRoutes);
router.use('/', authRoutes);

module.exports = router;
