const productService = require('../../services/productService');

/**
 * Controlador HTTP de productos: valida entrada y delega la lógica al servicio.
 */
const productsApiController = {
  list(req, res) {
    res.status(200).json(productService.getAll());
  },

  detail(req, res) {
    const id = parseId(req.params.id);
    if (!id) {
      res.status(400).json({ error: 'El identificador debe ser numérico' });
      return;
    }

    const product = productService.getById(id);
    if (!product) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }

    res.status(200).json(product);
  },

  create(req, res) {
    const product = validateProduct(req.body);
    if (!product) {
      res.status(400).json({ error: 'Los datos del producto no son válidos' });
      return;
    }

    res.status(201).json(productService.create(product));
  },

  update(req, res) {
    const id = parseId(req.params.id);
    const productData = validateProduct(req.body);
    if (!id || !productData) {
      res.status(400).json({ error: 'Los datos del producto no son válidos' });
      return;
    }

    if (!productService.getById(id)) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }

    res.status(200).json(productService.update(id, productData));
  },

  delete(req, res) {
    const id = parseId(req.params.id);
    if (!id) {
      res.status(400).json({ error: 'El identificador debe ser numérico' });
      return;
    }

    if (!productService.getById(id)) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }

    productService.delete(id);
    res.status(200).json({ message: 'Producto eliminado' });
  },
};

function parseId(value) {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function validateProduct(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return null;
  }

  const { name, description = '', category = '', price, stock = 0, image = '' } = body;
  if (
    typeof name !== 'string' ||
    !name.trim() ||
    typeof description !== 'string' ||
    typeof category !== 'string' ||
    typeof image !== 'string' ||
    !Number.isFinite(Number(price)) ||
    Number(price) < 0 ||
    !Number.isInteger(Number(stock)) ||
    Number(stock) < 0
  ) {
    return null;
  }

  return {
    name: name.trim(),
    description: description.trim(),
    category: category.trim(),
    price: Number(price),
    stock: Number(stock),
    image: image.trim(),
  };
}

module.exports = productsApiController;
