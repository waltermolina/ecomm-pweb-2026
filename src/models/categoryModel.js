const db = require('../../db/database');

/**
 * Modelo de categorías. Mantiene sus nombres sincronizados con los productos
 * porque las vistas SSR existentes leen la categoría desde cada producto.
 */
const categoryModel = {
  findAll() {
    return db.prepare('SELECT * FROM categories ORDER BY id').all();
  },

  findById(id) {
    return db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
  },

  create(name) {
    const result = db.prepare('INSERT INTO categories (name) VALUES (?)').run(name);
    return this.findById(Number(result.lastInsertRowid));
  },

  ensureExists(name) {
    if (name) {
      db.prepare('INSERT OR IGNORE INTO categories (name) VALUES (?)').run(name);
    }
  },

  update(id, name) {
    const updateCategory = db.prepare('UPDATE categories SET name = ? WHERE id = ?');
    const updateProducts = db.prepare('UPDATE products SET category = ? WHERE category = ?');
    const update = db.transaction(() => {
      const current = this.findById(id);
      if (!current) {
        return undefined;
      }

      updateCategory.run(name, id);
      updateProducts.run(name, current.name);
      return this.findById(id);
    });

    return update();
  },

  delete(id) {
    const deleteCategory = db.prepare('DELETE FROM categories WHERE id = ?');
    const delete = db.transaction(() => {
      const category = this.findById(id);
      if (!category) {
        return false;
      }

      const inUse = db
        .prepare('SELECT 1 FROM products WHERE category = ? LIMIT 1')
        .get(category.name);

      if (inUse) {
        return false;
      }

      return deleteCategory.run(id).changes > 0;
    });

    return delete();
  },

  count() {
    return db.prepare('SELECT COUNT(*) AS total FROM categories').get().total;
  },
};

module.exports = categoryModel;
