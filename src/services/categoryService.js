const categoryModel = require('../models/categoryModel');

/**
 * Servicio de categorías: concentra la lógica de negocio fuera de las rutas.
 */
const categoryService = {
  getAll() {
    return categoryModel.findAll();
  },

  getById(id) {
    return categoryModel.findById(Number(id));
  },

  create(name) {
    return categoryModel.create(name.trim());
  },

  ensureExists(name) {
    categoryModel.ensureExists(name);
  },

  update(id, name) {
    return categoryModel.update(Number(id), name.trim());
  },

  delete(id) {
    return categoryModel.delete(Number(id));
  },

  count() {
    return categoryModel.count();
  },
};

module.exports = categoryService;
