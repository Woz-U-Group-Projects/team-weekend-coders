const express = require('express');
const router = express.Router();

const contact_controller =
require('../controllers/contact.controller');

router.get('/test', contact_controller.test);

module.exports = router;