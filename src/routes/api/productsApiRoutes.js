const express = require('express');
const productsApiController = require('../../controllers/api/productsApiController');

const router = express.Router();

router.get('/', productsApiController.list);
router.get('/:id', productsApiController.detail);
router.post('/', productsApiController.create);
router.put('/:id', productsApiController.update);
router.delete('/:id', productsApiController.delete);

module.exports = router;
