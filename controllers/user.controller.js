const User = require('../models/User');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

module.exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    const emailRegex = /@gmail.com|@yahoo.com|@hotmail.com|@live.com/;

    if (!emailRegex.test(email)) throw 'Email is not supported.';

    if (password.length < 6) throw 'Password must be atleast 6 characters long.';

    const userExists = await User.findOne({ email });

    if (userExists) throw 'Email already exists.';

    const user = new User({
        name,
        email,
        password: bcrypt.hashSync(password, 10),
    });

    await user.save();

    res.json({
        message: "User [" + name + "] registered successfully!",
    });
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