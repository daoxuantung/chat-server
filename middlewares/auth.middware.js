var jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers.authorization;

    const { id } = jwt.verify(token, process.env.SECRET_KEY);

    if (!id) return res.json('Error');

    res.locals.id = id;

    next();
}