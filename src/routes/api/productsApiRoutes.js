const express = require('express');
const productsApiController = require('../../controllers/api/productsApiController');
const verifyToken = require('../../middlewares/verifyToken');
const requireAdmin = require('../../middlewares/requireAdmin');

const router = express.Router();

router.get('/', productsApiController.list);
router.get('/:id', productsApiController.detail);
router.post('/', verifyToken, requireAdmin, productsApiController.create);
router.put('/:id', verifyToken, requireAdmin, productsApiController.update);
router.delete('/:id', verifyToken, requireAdmin, productsApiController.delete);

module.exports = router;
