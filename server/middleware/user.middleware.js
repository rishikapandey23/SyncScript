const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization;

    console.log(req.params.id)

    if(req?.params?.id !== "undefined_ok" && req?.params?.id !== null && req?.params?.id !== undefined) {
        return next();
    }

    console.log(req.headers.authorization)

    if (!token  || token === 'null' || token === 'undefined') {
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        req.user = decoded;
        req.user.authorization = token;

        next();
    } catch (error) {
        if(req.body.username && req.body.password) {
            next();
            return;
        }
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authenticateToken;
