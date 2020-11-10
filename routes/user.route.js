const router = require('express').Router();
const controller = require('../controllers/user.controller');
const validate = require('../validates/user.validate');
const auth = require('../middlewares/auth.middware');

router.post('/register', validate.validRegister, controller.register);

router.post('/login', validate.validLogin, controller.login);

router.post('/', auth, controller.index);

module.exports = router;