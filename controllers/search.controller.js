const User = require('../models/User');

module.exports = async (req, res) => {
    const { user, currentUserId } = req.query;

    const users = await User.find();
    const error = "No results found. Try again!";

    if (user.length <= 0) {
        return res.json([]);
    }

    const usersMatched = users.filter(item => item._id != currentUserId).filter(item => item.name.toLowerCase().indexOf(user.toLowerCase()) > -1);

    if (usersMatched.length) {
        res.json({ usersMatched });
    }
    else {
        res.json({ error })
    }

}