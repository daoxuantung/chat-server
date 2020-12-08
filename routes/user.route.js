const router = require('express').Router();
const controller = require('../controllers/user.controller');
const validate = require('../validates/user.validate');
const auth = require('../middlewares/auth.middware');

router.post('/register', validate.validRegister, controller.register);

router.post('/login', validate.validLogin, controller.login);

router.post('/', auth, controller.index);

router.post('/edit', auth, controller.editUser);

router.post('/add', auth, controller.addRequest);

router.post('/delete', auth, controller.deleteRequest);

router.post('/accept', auth, controller.acceptRequest);

router.post('/remove', auth, controller.removeRequest);

router.post('/friends', auth, controller.getFriend);

module.exports = router;