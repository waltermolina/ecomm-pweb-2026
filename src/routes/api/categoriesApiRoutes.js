const express = require('express');
const categoriesApiController = require('../../controllers/api/categoriesApiController');

const router = express.Router();

router.get('/', categoriesApiController.list);
router.get('/:id', categoriesApiController.detail);
router.post('/', categoriesApiController.create);
router.put('/:id', categoriesApiController.update);
router.delete('/:id', categoriesApiController.delete);

module.exports = router;
