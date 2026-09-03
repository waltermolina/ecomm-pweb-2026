const productService = require('../services/productService');

/**
 * Controlador de la página de inicio.
 */
const homeController = {
  /**
   * Renderiza el home con las secciones "Te puede interesar" y "Los más pedidos".
   * @param {import('express').Request} req Request de Express.
   * @param {import('express').Response} res Response de Express.
   * @returns {void}
   */
  index(req, res) {
    res.render('pages/index', {
      title: 'Home',
      categories: productService.getCategories(),
      featuredProducts: productService.getFeatured(),
      bestSellers: productService.getBestSellers(),
    });
  },
};

module.exports = homeController;
