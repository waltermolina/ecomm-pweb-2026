const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'products.json');

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
 * Encapsula el acceso al archivo JSON local que funciona como fuente de datos.
 */
const productModel = {
  /**
   * Lee todos los productos desde `src/data/products.json`.
   * @returns {Product[]} Copia de la colección de productos.
   * @throws {Error} Si el archivo no existe o no contiene JSON válido.
   */
  findAll() {
    const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
    const products = JSON.parse(fileContent);

    if (!Array.isArray(products)) {
      throw new Error('El archivo de productos no contiene un listado válido.');
    }

    return products;
  },
};

module.exports = productModel;
