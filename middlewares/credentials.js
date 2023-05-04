const { allowedOrigins } = require('../config/corsConfig');

const credentials = (req, res, next) => {
    const origin = req.headers.referer;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', true);
    }
    next();
}

module.exports = credentials