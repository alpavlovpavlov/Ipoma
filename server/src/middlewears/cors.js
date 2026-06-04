const allowedOrigins = [
    'https://ipoma.cloud',
    'https://www.ipoma.cloud',
    'https://ipoma.vercel.app'
];

module.exports = () => (req, res, next) => {

    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader(
        'Access-Control-Allow-Methods',
        'HEAD, OPTIONS, GET, POST, PUT, DELETE'
    );

    res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, X-Authorization'
    );

    next();
};