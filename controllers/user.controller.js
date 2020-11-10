const User = require('../models/User');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

module.exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    const user = new User({
        username,
        name: username,
        email,
        avatarUrl: 'https://res.cloudinary.com/lepis/image/upload/v1604833803/avatar.svg',
        password: bcrypt.hashSync(password, 10),
    });

    await user.save();

    res.json({
        message: "Register Successfully!",
    });
}


module.exports.login = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);

    res.json({
        token, message: 'Login Successfully!'
    });
}

module.exports.index = async (req, res) => {
    const id = res.locals.id;

    const user = await User.findOne({ _id: id });


    res.json({ user });
}