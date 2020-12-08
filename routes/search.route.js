const router = require('express').Router();
const controller = require('../controllers/search.controller');

router.get('/', controller);

module.exports = router;