const express = require('express');
const categoriesApiController = require('../../controllers/api/categoriesApiController');
const verifyToken = require('../../middlewares/verifyToken');
const requireAdmin = require('../../middlewares/requireAdmin');

const router = express.Router();

router.get('/', categoriesApiController.list);
router.get('/:id', categoriesApiController.detail);
router.post('/', verifyToken, requireAdmin, categoriesApiController.create);
router.put('/:id', verifyToken, requireAdmin, categoriesApiController.update);
router.delete('/:id', verifyToken, requireAdmin, categoriesApiController.delete);

module.exports = router;
