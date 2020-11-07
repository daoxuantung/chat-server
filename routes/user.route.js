const router = require('express').Router();
const controller = require('../controllers/user.controller');
const validate = require('../validates/user.validate');

router.post('/register', validate.validRegister, controller.register);

router.post('/login', validate.validLogin, controller.login);

router.post('/:token', controller.getUser);

module.exports = router;