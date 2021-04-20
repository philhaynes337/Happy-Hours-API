const { API_TOKEN } = require('./config');

function bearerToken(req, res, next) {
    const token = req.get('Authorization')

    if (!token || token.split(' ')[1] !== API_TOKEN) {
        return res.status(401).json({ error: 'Unauthorized Request 401'})
    }
    next()
}

module.exports = bearerToken