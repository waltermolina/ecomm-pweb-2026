const db = require('../../db/database');

/**
 * @typedef {Object} Product
 * @property {number} id Identificador único del producto.
 * @property {string} name Nombre visible del producto.
 * @property {number} price Precio unitario en pesos.
 * @property {string} category Categoría a la que pertenece el producto.
 * @property {string} description Descripción larga del producto.
 * @property {number} stock Unidades disponibles.
 * @property {string} image Ruta pública de la imagen.
 */

/**
 * Modelo de productos.
 * Encapsula el acceso a la tabla `products` de SQLite mediante `better-sqlite3`.
 * Toda la información de productos proviene exclusivamente de la base de datos.
 */
const productModel = {
  /**
   * Obtiene todos los productos almacenados en SQLite.
   * @returns {Product[]} Colección de productos del catálogo.
   */
  findAll() {
    return db.prepare('SELECT * FROM products ORDER BY id').all();
  },

  /**
   * Busca un producto por su identificador en SQLite.
   * @param {number} id Identificador numérico del producto.
   * @returns {Product|undefined} Producto encontrado o `undefined`.
   */
  findById(id) {
    return db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  },

  create(product) {
    const result = db.prepare(`
      INSERT INTO products (name, description, category, price, stock, image)
      VALUES (@name, @description, @category, @price, @stock, @image)
    `).run(product);

    return this.findById(Number(result.lastInsertRowid));
  },

  update(id, product) {
    const result = db.prepare(`
      UPDATE products
      SET name = @name, description = @description, category = @category,
          price = @price, stock = @stock, image = @image
      WHERE id = @id
    `).run({ ...product, id });

    return result.changes ? this.findById(id) : undefined;
  },

  delete(id) {
    return db.prepare('DELETE FROM products WHERE id = ?').run(id).changes > 0;
  },

  count() {
    return db.prepare('SELECT COUNT(*) AS total FROM products').get().total;
  },
};

module.exports = productModel;
