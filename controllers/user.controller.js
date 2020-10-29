const User = require('../models/User');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

module.exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    const user = new User({
        name,
        email,
        password: bcrypt.hashSync(password, 10),
    });

    await user.save();

    res.json({
        message: "Success!",
    });
}


module.exports.validEmail = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) return res.json({ msg: "Username already been taken" });

    const emailRegex = /@gmail.com|@yahoo.com|@hotmail.com|@live.com/;

    if (!emailRegex.test(email)) return res.json({ msg: 'Email is not supported domain name.' });

    return res.json({ msg: "Username available." })
}

module.exports.validPassword = (req, res) => {
    const { password } = req.body;
    if (password && password.length < 6) return res.json({ msg: 'Password must be atleast 6 characters long.' });

    return res.json({ msg: "Password available." })
}

module.exports.login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        throw 'Email does not exist';
    }

    const check = bcrypt.compareSync(password, user.password);

    if (!check) {
        throw 'Wrong password!';
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);

    res.json({
        message: "User logged in successfully!",
        token,
    });
}