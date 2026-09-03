const productModel = require('../models/productModel');

const FEATURED_LIMIT = 5;
const BEST_SELLERS_LIMIT = 10;
const RELATED_LIMIT = 4;

/**
 * Servicio de productos.
 * Concentra toda la lógica de negocio relacionada con el catálogo.
 */
const productService = {
  /**
   * Obtiene el listado completo de productos.
   * @returns {import('../models/productModel').Product[]} Listado de productos.
   */
  getAll() {
    return productModel.findAll();
  },

  /**
   * Busca un producto por su identificador.
   * @param {number} id Identificador numérico del producto.
   * @returns {import('../models/productModel').Product|undefined} Producto encontrado o `undefined`.
   */
  getById(id) {
    return productModel.findById(Number(id));
  },

  /**
   * Verifica si existe un producto con el identificador indicado.
   * Utilizada por el middleware de normalización de ids contra SQLite.
   * @param {number} id Identificador numérico del producto.
   * @returns {boolean} `true` si el producto existe en la base.
   */
  exists(id) {
    return productModel.exists(Number(id));
  },

  /**
   * Filtra los productos que pertenecen a una categoría.
   * La comparación no distingue mayúsculas, minúsculas ni acentos.
   * @param {string} category Nombre de la categoría.
   * @returns {import('../models/productModel').Product[]} Productos de la categoría.
   */
  getByCategory(category) {
    const normalizedCategory = normalizeText(category);

    return productModel
      .findAll()
      .filter((product) => normalizeText(product.category) === normalizedCategory);
  },

  /**
   * Devuelve los nombres de categorías disponibles sin repetir.
   * @returns {string[]} Categorías únicas del catálogo.
   */
  getCategories() {
    return [...new Set(productModel.findAll().map((product) => product.category))];
  },

  /**
   * Obtiene los productos destacados para la sección "Te puede interesar".
   * @param {number} [limit=5] Cantidad máxima de productos.
   * @returns {import('../models/productModel').Product[]} Productos destacados.
   */
  getFeatured(limit = FEATURED_LIMIT) {
    return productModel.findAll().slice(0, limit);
  },

  /**
   * Obtiene los productos para la sección "Los más pedidos".
   * Al no existir órdenes reales, se usan los productos con mayor precio como criterio local.
   * @param {number} [limit=10] Cantidad máxima de productos.
   * @returns {import('../models/productModel').Product[]} Productos más pedidos.
   */
  getBestSellers(limit = BEST_SELLERS_LIMIT) {
    return productModel
      .findAll()
      .slice()
      .sort((a, b) => b.price - a.price)
      .slice(0, limit);
  },

  /**
   * Obtiene productos relacionados por categoría, excluyendo al producto actual.
   * @param {import('../models/productModel').Product} product Producto de referencia.
   * @param {number} [limit=4] Cantidad máxima de relacionados.
   * @returns {import('../models/productModel').Product[]} Productos relacionados.
   */
  getRelated(product, limit = RELATED_LIMIT) {
    if (!product) {
      return [];
    }

    return productService
      .getByCategory(product.category)
      .filter((item) => item.id !== product.id)
      .slice(0, limit);
  },

  /**
   * Ordena un listado de productos por precio.
   * @param {import('../models/productModel').Product[]} products Productos a ordenar.
   * @param {string} [sort] Orden solicitado: `asc` o `desc`.
   * @returns {import('../models/productModel').Product[]} Nuevo listado ordenado.
   */
  sortByPrice(products, sort) {
    if (sort !== 'asc' && sort !== 'desc') {
      return products.slice();
    }

    return products
      .slice()
      .sort((a, b) => (sort === 'asc' ? a.price - b.price : b.price - a.price));
  },

  /**
   * Busca productos por coincidencia parcial del nombre.
   * @param {string} query Texto ingresado por la persona usuaria.
   * @returns {import('../models/productModel').Product[]} Productos coincidentes.
   */
  search(query) {
    const normalizedQuery = normalizeText(query);

    if (!normalizedQuery) {
      return [];
    }

    return productModel
      .findAll()
      .filter((product) => normalizeText(product.name).includes(normalizedQuery));
  },
};

/**
 * Normaliza texto para comparaciones: quita acentos, espacios extra y pasa a minúsculas.
 * @param {string} value Texto a normalizar.
 * @returns {string} Texto normalizado.
 */
function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

module.exports = productService;
