const allowedOrigins = [
    'http://localhost:3000',
    'https://ipoma.vercel.app'
];

module.exports = () => (req, res, next) => {
    const origin = req.headers.origin;

    console.log('REQ ORIGIN:', origin);

    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Methods', 'HEAD, OPTIONS, GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Authorization');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
};