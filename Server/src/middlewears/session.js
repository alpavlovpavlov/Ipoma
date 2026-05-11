const { verifyToken } = require("../services/authService");

module.exports = () => (req, res, next) => {
    const token = req.headers['x-authorization'];
    if (token) {
        try {
            const userData = verifyToken(token);
            req.user = userData;
            req.token = token;
        } catch (error) {
            return res.status(401).json({ message: 'Invalid authorization token'});
        }
    }
    next();
}