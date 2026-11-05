const productService = require('../../services/productService');
const categoryService = require('../../services/categoryService');

/**
 * Devuelve métricas agregadas usando los servicios del catálogo.
 */
const statsApiController = {
  get(req, res) {
    res.status(200).json({
      totalProducts: productService.count(),
      totalCategories: categoryService.count(),
    });
  },
};

module.exports = statsApiController;
