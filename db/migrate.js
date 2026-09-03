const fs = require('fs');
const path = require('path');
const db = require('./database');

const PRODUCTS_JSON_FILE = path.join(__dirname, '..', 'src', 'data', 'products.json');

/**
 * Migra el catálogo de productos desde `src/data/products.json` hacia SQLite.
 * Es un script de una sola ejecución: usa `INSERT OR IGNORE` para no duplicar
 * productos si se vuelve a ejecutar por error. Si el archivo JSON ya no existe
 * (porque fue eliminado luego de migrar), no hace nada.
 * @returns {number} Cantidad de productos insertados.
 */
function migrateProducts() {
  if (!fs.existsSync(PRODUCTS_JSON_FILE)) {
    console.log('No se encontró products.json: no hay nada para migrar.');
    return 0;
  }

  const products = JSON.parse(fs.readFileSync(PRODUCTS_JSON_FILE, 'utf-8'));

  const insert = db.prepare(`
    INSERT OR IGNORE INTO products (id, name, description, category, categories, price, stock, image)
    VALUES (@id, @name, @description, @category, @categories, @price, @stock, @image)
  `);

  const insertMany = db.transaction((items) => {
    let inserted = 0;

    items.forEach((product) => {
      const result = insert.run({
        id: product.id,
        name: product.name,
        description: product.description ?? '',
        category: product.category ?? '',
        categories: product.categories ? JSON.stringify(product.categories) : null,
        price: product.price,
        stock: product.stock ?? 0,
        image: product.image ?? '',
      });

      inserted += result.changes;
    });

    return inserted;
  });

  const inserted = insertMany(products);
  console.log(`Migración completada: ${inserted} producto(s) insertado(s).`);

  return inserted;
}

if (require.main === module) {
  migrateProducts();
}

module.exports = { migrateProducts };
