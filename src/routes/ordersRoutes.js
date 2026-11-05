const express = require('express');
const ordersController = require('../controllers/ordersController');
const { requireLogin } = require('../middlewares/sessionAuth');

const router = express.Router();

router.use(requireLogin);
router.get('/', ordersController.list);

module.exports = router;
