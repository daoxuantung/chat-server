const User = require('../models/User');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

module.exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    const user = new User({
        username,
        name: username,
        email,
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



module.exports.getUser = async (req, res) => {
    const { token } = req.params;

    var decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (!decoded.id) res.json({ error: 'Email does not exist' });

    const user = await User.findOne({ _id: decoded.id });

    const { name, email } = user;

    res.json({ user: { name, email } });
}