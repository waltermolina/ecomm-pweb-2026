const productService = require('../services/productService');

/**
 * Controlador de productos.
 * Solo recibe requests, invoca servicios y renderiza vistas.
 */
const productController = {
  /**
   * Renderiza el listado de productos, con orden opcional por precio.
   * @param {import('express').Request} req Request de Express.
   * @param {import('express').Response} res Response de Express.
   * @returns {void}
   */
  list(req, res) {
    const sort = req.query.sort === 'asc' || req.query.sort === 'desc' ? req.query.sort : '';

    res.render('pages/products', {
      title: 'Productos',
      heading: 'Todos los productos',
      products: productService.sortByPrice(productService.getAll(), sort),
      sort,
      showSort: true,
      emptyMessage: 'Todavía no hay productos disponibles.',
    });
  },

  /**
   * Renderiza el detalle de un producto junto con sus relacionados.
   * El producto ya fue validado y cargado por el middleware `validateProductId`.
   * @param {import('express').Request} req Request de Express.
   * @param {import('express').Response} res Response de Express.
   * @returns {void}
   */
  detail(req, res) {
    const product = req.product;

    res.render('pages/product', {
      title: product.name,
      product,
      relatedProducts: productService.getRelated(product),
    });
  },

  /**
   * Renderiza los productos de una categoría.
   * @param {import('express').Request} req Request de Express.
   * @param {import('express').Response} res Response de Express.
   * @returns {void}
   */
  byCategory(req, res) {
    const category = String(req.params.category ?? '');
    const products = productService.getByCategory(category);

    res.render('pages/products', {
      title: `Categoría ${category}`,
      heading: `Categoría: ${category}`,
      products,
      sort: '',
      showSort: false,
      emptyMessage: 'No encontramos productos en esta categoría.',
    });
  },

  /**
   * Renderiza los resultados de búsqueda por nombre.
   * @param {import('express').Request} req Request de Express.
   * @param {import('express').Response} res Response de Express.
   * @returns {void}
   */
  search(req, res) {
    const query = String(req.query.query ?? '').trim();

    res.render('pages/search', {
      title: 'Búsqueda',
      query,
      products: productService.search(query),
    });
  },
};

module.exports = productController;
