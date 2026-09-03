const db = require('./database');
const seedProducts = require('./seedProducts');

/**
 * Migra el catálogo de productos semilla hacia SQLite.
 * Es un script idempotente: usa `INSERT OR IGNORE` para no duplicar
 * productos si se vuelve a ejecutar. Reemplaza a la antigua lectura de
 * `src/data/products.json`, eliminado tras completar la migración.
 * @returns {number} Cantidad de productos insertados.
 */
function migrateProducts() {
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

  const inserted = insertMany(seedProducts);
  console.log(`Migración completada: ${inserted} producto(s) insertado(s).`);

  return inserted;
}

if (require.main === module) {
  migrateProducts();
}

module.exports = { migrateProducts };
