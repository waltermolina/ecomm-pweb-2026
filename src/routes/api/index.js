const express = require('express');
const productsApiRoutes = require('./productsApiRoutes');
const categoriesApiRoutes = require('./categoriesApiRoutes');
const statsApiRoutes = require('./statsApiRoutes');
const authApiRoutes = require('./authApiRoutes');

const router = express.Router();

router.use('/auth', authApiRoutes);
router.use('/products', productsApiRoutes);
router.use('/categories', categoriesApiRoutes);
router.use('/stats', statsApiRoutes);

router.use((req, res) => {
  res.status(404).json({ error: 'Recurso no encontrado' });
});

module.exports = router;
