const express = require('express');
const statsApiController = require('../../controllers/api/statsApiController');

const router = express.Router();

router.get('/', statsApiController.get);

module.exports = router;
