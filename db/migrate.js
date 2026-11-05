const db = require('./database');
const seedProducts = require('./seedProducts');

/**
 * Migra el catálogo inicial de productos hacia SQLite una sola vez.
 * @returns {number} Cantidad de productos insertados.
 */
function migrateProducts() {
  migrateProductIds();

  const insert = db.prepare(`
    INSERT OR IGNORE INTO products (id, name, description, category, categories, price, stock, image)
    VALUES (@id, @name, @description, @category, @categories, @price, @stock, @image)
  `);

  const initialized = db.pragma('user_version', { simple: true }) >= 1;
  const migrate = db.transaction(() => {
    let inserted = 0;

    if (!initialized) {
      seedProducts.forEach((product) => {
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

      db.pragma('user_version = 1');
    }

    migrateCategories();
    return inserted;
  });

  const inserted = migrate();
  console.log(`Migración completada: ${inserted} producto(s) insertado(s).`);

  return inserted;
}

function migrateProductIds() {
  const table = db
    .prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'products'")
    .get();

  if (!table || /\bAUTOINCREMENT\b/i.test(table.sql)) {
    return;
  }

  db.pragma('foreign_keys = OFF');
  try {
    db.transaction(() => {
      db.exec(`
        CREATE TABLE products_new (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          category TEXT,
          categories TEXT,
          price REAL NOT NULL,
          stock INTEGER NOT NULL DEFAULT 0,
          image TEXT
        );
        INSERT INTO products_new (id, name, description, category, categories, price, stock, image)
        SELECT id, name, description, category, categories, price, stock, image FROM products;
        DROP TABLE products;
        ALTER TABLE products_new RENAME TO products;
      `);
    })();
  } finally {
    db.pragma('foreign_keys = ON');
  }
}

/**
 * Registra en la tabla administrable las categorías ya presentes en el catálogo.
 * @returns {number} Cantidad de categorías insertadas.
 */
function migrateCategories() {
  return db.prepare(`
    INSERT OR IGNORE INTO categories (name)
    SELECT DISTINCT category FROM products
    WHERE category IS NOT NULL AND TRIM(category) <> ''
  `).run().changes;
}

if (require.main === module) {
  migrateProducts();
}

module.exports = { migrateProducts, migrateCategories };
