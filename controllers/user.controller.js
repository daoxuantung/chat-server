const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const async = require('async');

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

    res.json({ token });
}

module.exports.index = async (req, res) => {
    const { username } = req.body;
    if (username) {
        const user = await User.findOne({ username });
        return res.json({ user });
    }

    const id = res.locals.id;
    const user = await User.findById(id);
    res.json({ user });
}

module.exports.editUser = async (req, res) => {
    const { name, aboutMe, phoneNumber, webUrl, work, avatarUrl } = req.body.user;
    const id = res.locals.id;
    await User.findOneAndUpdate({ _id: id }, { $set: { name, aboutMe, phoneNumber, webUrl, work, avatarUrl } });
    res.status(200);
}

module.exports.addRequest = async (req, res) => {
    const { user } = req.body;
    const id = res.locals.id;

    const currentUser = await User.findById(id);

    async.parallel({
        one: (callback) => {
            if (user.name) {
                const id = res.locals.id;
                const sender = User.findByIdAndUpdate(
                    id,
                    {
                        $addToSet: {
                            sentRequest: {
                                username: user.username
                            }
                        }
                    }, () => {
                        callback(null, sender);
                    });
            }
        },
        two: (callback) => {
            if (user.name) {
                const receiver = User.findOneAndUpdate(
                    { name: user.name },
                    {
                        $addToSet: {
                            request: {
                                userId: currentUser._id,
                                username: currentUser.username,
                                name: currentUser.name,
                                avatarUrl: currentUser.avatarUrl
                            }
                        }
                    }, () => {
                        callback(null, receiver);
                    });
            }
        }
    }, (err, results) => {
    });
}

module.exports.deleteRequest = async (req, res) => {
    const { user } = req.body;
    const id = res.locals.id;

    const currentUser = await User.findById(id);

    async.parallel({
        one: (callback) => {
            if (user.name) {
                const id = res.locals.id;
                const sender = User.findByIdAndUpdate(
                    id,
                    {
                        $pull: {
                            sentRequest: {
                                username: user.username
                            }
                        }
                    }, () => {
                        callback(null, sender);
                    });
            }
        },
        two: (callback) => {
            if (user.name) {
                const receiver = User.findOneAndUpdate(
                    { name: user.name },
                    {
                        $pull: {
                            request: {
                                userId: currentUser._id,
                                username: currentUser.username,
                                name: currentUser.name,
                                avatarUrl: currentUser.avatarUrl
                            }
                        }
                    }, () => {
                        callback(null, receiver);
                    });
            }
        }
    }, (err, results) => {
    });
}

module.exports.acceptRequest = async (req, res) => {
    const { user } = req.body;
    const id = res.locals.id;

    const currentUser = await User.findById(id);

    async.parallel({
        one: (callback) => {
            if (user.name) {
                const sender = User.findOneAndUpdate(
                    { name: user.name },
                    {
                        $pull: {
                            sentRequest: {
                                username: currentUser.username
                            }
                        }
                    }, () => {
                        callback(null, sender);
                    });
            }
        },
        two: (callback) => {
            if (user.name) {
                const id = res.locals.id;
                const receiver = User.findByIdAndUpdate(
                    id,
                    {
                        $pull: {
                            request: {
                                userId: user._id,
                                username: user.username,
                                name: user.name,
                                avatarUrl: user.avatarUrl
                            }
                        }
                    }, () => {
                        callback(null, receiver);
                    });
            }
        },
        three: (callback) => {
            if (user.name) {
                const sender = User.findOneAndUpdate(
                    { name: user.name },
                    {
                        $push: {
                            friendsList: {
                                friendName: currentUser.username,
                                friendId: currentUser._id
                            }
                        }
                    }, () => {
                        callback(null, sender);
                    });
            }
        },
        four: (callback) => {
            if (user.name) {
                const id = res.locals.id;
                const receiver = User.findByIdAndUpdate(
                    id,
                    {
                        $push: {
                            friendsList: {
                                friendName: user.username,
                                friendId: user._id
                            }
                        }
                    }, () => {
                        callback(null, receiver);
                    });
            }
        }
    }, (err, results) => {
    });
}


module.exports.removeRequest = async (req, res) => {
    const { user } = req.body;
    const id = res.locals.id;

    const currentUser = await User.findById(id);

    async.parallel({
        one: (callback) => {
            if (user.name) {
                const id = res.locals.id;
                const sender = User.findByIdAndUpdate(
                    id,
                    {
                        $pull: {
                            friendsList: {
                                friendName: user.username,
                                friendId: user._id
                            }
                        }
                    }, () => {
                        callback(null, sender);
                    });
            }
        },
        two: (callback) => {
            if (user.name) {
                const receiver = User.findOneAndUpdate(
                    { name: user.name },
                    {
                        $pull: {
                            friendsList: {
                                friendName: currentUser.username,
                                friendId: currentUser._id
                            }
                        }
                    }, () => {
                        callback(null, receiver);
                    });
            }
        }
    }, (err, results) => {
    });
}

module.exports.getFriend = async (req, res) => {
    const { query, user } = req.body;
    const datas = user.friendsList;
    const listFriends = [];

    for (let data of datas) {
        const user = await User.findById({ _id: data.friendId })
        listFriends.push(user);
    }

    if (listFriends) {
        if (query) {
            const usersMatched = listFriends.filter(user => user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
            res.json(usersMatched);
            return;
        }

        res.json(listFriends);
    }
}