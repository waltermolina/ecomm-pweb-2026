const productService = require('./productService');

/**
 * @typedef {Object} CartLine
 * @property {number} productId Identificador del producto guardado en sesión.
 * @property {number} quantity Cantidad solicitada del producto.
 */

/**
 * @typedef {Object} CartDetailItem
 * @property {number} productId Identificador del producto.
 * @property {string} name Nombre del producto.
 * @property {string} image Imagen del producto.
 * @property {string} category Categoría del producto.
 * @property {number} price Precio unitario.
 * @property {number} quantity Cantidad en el carrito.
 * @property {number} subtotal Precio unitario por cantidad.
 */

/**
 * Servicio de carrito.
 * Es el único punto de manipulación de `req.session.cart`,
 * que solo almacena `{ productId, quantity }`.
 */
const cartService = {
  /**
   * Devuelve el carrito de la sesión, inicializándolo si hace falta.
   * @param {import('express').Request} req Request de Express.
   * @returns {CartLine[]} Carrito guardado en sesión.
   */
  getCart(req) {
    if (!req.session) {
      return [];
    }

    if (!Array.isArray(req.session.cart)) {
      req.session.cart = [];
    }

    return req.session.cart;
  },

  /**
   * Agrega un producto al carrito o incrementa su cantidad si ya existe.
   * No agrega productos inexistentes ni sin stock.
   * @param {import('express').Request} req Request de Express.
   * @param {number} productId Identificador del producto.
   * @returns {boolean} `true` si el producto fue agregado.
   */
  addProduct(req, productId) {
    const product = productService.getById(productId);

    if (!product || product.stock === 0) {
      return false;
    }

    const cart = cartService.getCart(req);
    const line = cart.find((item) => item.productId === product.id);

    if (line) {
      line.quantity += 1;
    } else {
      cart.push({ productId: product.id, quantity: 1 });
    }

    return true;
  },

  /**
   * Aumenta o disminuye la cantidad de una línea del carrito.
   * Si la cantidad llega a cero, la línea se elimina.
   * @param {import('express').Request} req Request de Express.
   * @param {number} productId Identificador del producto.
   * @param {number} delta Variación de cantidad (por ejemplo `1` o `-1`).
   * @returns {CartLine[]} Carrito actualizado.
   */
  updateQuantity(req, productId, delta) {
    const cart = cartService.getCart(req);
    const line = cart.find((item) => item.productId === Number(productId));

    if (!line) {
      return cart;
    }

    line.quantity += Number(delta);

    if (line.quantity <= 0) {
      return cartService.removeProduct(req, productId);
    }

    return cart;
  },

  /**
   * Elimina por completo un producto del carrito.
   * @param {import('express').Request} req Request de Express.
   * @param {number} productId Identificador del producto.
   * @returns {CartLine[]} Carrito actualizado.
   */
  removeProduct(req, productId) {
    const cart = cartService.getCart(req).filter((item) => item.productId !== Number(productId));
    req.session.cart = cart;

    return cart;
  },

  /**
   * Vacía el carrito de la sesión.
   * @param {import('express').Request} req Request de Express.
   * @returns {CartLine[]} Carrito vacío.
   */
  clear(req) {
    if (req.session) {
      req.session.cart = [];
    }

    return [];
  },

  /**
   * Combina los ids guardados en sesión con los datos reales obtenidos de SQLite.
   * Descarta líneas cuyo producto ya no existe.
   * @param {import('express').Request} req Request de Express.
   * @returns {CartDetailItem[]} Detalle del carrito listo para renderizar.
   */
  getDetailedItems(req) {
    return cartService
      .getCart(req)
      .map((line) => {
        const product = productService.getById(line.productId);

        if (!product) {
          return null;
        }

        return {
          productId: product.id,
          name: product.name,
          image: product.image,
          category: product.category,
          price: product.price,
          quantity: line.quantity,
          subtotal: product.price * line.quantity,
        };
      })
      .filter(Boolean);
  },

  /**
   * Calcula el total general del carrito sumando los subtotales.
   * @param {import('express').Request} req Request de Express.
   * @returns {number} Total de la compra.
   */
  getTotal(req) {
    return cartService
      .getDetailedItems(req)
      .reduce((total, item) => total + item.subtotal, 0);
  },

  /**
   * Calcula la cantidad total de unidades dentro del carrito.
   * @param {import('express').Request} req Request de Express.
   * @returns {number} Suma de todas las cantidades.
   */
  getTotalQuantity(req) {
    return cartService.getCart(req).reduce((total, item) => total + item.quantity, 0);
  },

  /**
   * Resume el estado actual del carrito para vistas y eventos en tiempo real.
   * @param {import('express').Request} req Request de Express.
   * @returns {{items: number, total: number, detailedItems: CartDetailItem[]}} Estado del carrito.
   */
  getSummary(req) {
    const detailedItems = cartService.getDetailedItems(req);

    return {
      items: detailedItems.reduce((total, item) => total + item.quantity, 0),
      total: detailedItems.reduce((total, item) => total + item.subtotal, 0),
      detailedItems,
    };
  },
};

module.exports = cartService;
