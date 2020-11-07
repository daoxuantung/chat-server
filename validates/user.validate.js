const User = require('../models/User');
const bcrypt = require('bcrypt');

module.exports.validRegister = async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) return res.json({ error: "Email already been taken." });
    next();
}

module.exports.validLogin = async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        res.json({ error: 'Email does not exist.' });
        return;
    }

    const check = bcrypt.compareSync(password, user.password);

    if (!check) {
        res.json({ error: 'Wrong password! Try again.' })
    }

    next();
}
