const express = require('express');
const adminController = require('../controllers/adminController');
const { requireAdminSession } = require('../middlewares/sessionAuth');

const router = express.Router();

router.use(requireAdminSession);
router.get('/', adminController.show);

module.exports = router;
