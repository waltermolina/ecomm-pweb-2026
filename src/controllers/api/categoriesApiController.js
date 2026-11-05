const categoryService = require('../../services/categoryService');

/**
 * Controlador HTTP de categorías. La persistencia queda en el servicio/modelo.
 */
const categoriesApiController = {
  list(req, res) {
    res.status(200).json(categoryService.getAll());
  },

  detail(req, res) {
    const id = parseId(req.params.id);
    if (!id) {
      res.status(400).json({ error: 'El identificador debe ser numérico' });
      return;
    }

    const category = categoryService.getById(id);
    if (!category) {
      res.status(404).json({ error: 'Categoría no encontrada' });
      return;
    }

    res.status(200).json(category);
  },

  create(req, res) {
    const name = validateName(req.body);
    if (!name) {
      res.status(400).json({ error: 'El nombre de la categoría es obligatorio' });
      return;
    }

    res.status(201).json(categoryService.create(name));
  },

  update(req, res) {
    const id = parseId(req.params.id);
    const name = validateName(req.body);
    if (!id || !name) {
      res.status(400).json({ error: 'Los datos de la categoría no son válidos' });
      return;
    }

    if (!categoryService.getById(id)) {
      res.status(404).json({ error: 'Categoría no encontrada' });
      return;
    }

    res.status(200).json(categoryService.update(id, name));
  },

  delete(req, res) {
    const id = parseId(req.params.id);
    if (!id) {
      res.status(400).json({ error: 'El identificador debe ser numérico' });
      return;
    }

    const category = categoryService.getById(id);
    if (!category) {
      res.status(404).json({ error: 'Categoría no encontrada' });
      return;
    }

    if (!categoryService.delete(id)) {
      res.status(409).json({ error: 'No se puede eliminar una categoría con productos asociados' });
      return;
    }

    res.status(200).json({ message: 'Categoría eliminada' });
  },
};

function parseId(value) {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function validateName(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return null;
  }

  return typeof body.name === 'string' && body.name.trim() ? body.name.trim() : null;
}

module.exports = categoriesApiController;
