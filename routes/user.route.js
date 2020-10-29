const router = require('express').Router();
const controller = require('../controllers/user.controller');

router.post('/register', controller.register);

router.post('/login', controller.login);

router.post('/validEmail', controller.validEmail)

router.post('/validPassword', controller.validPassword)

module.exports = router;