const jwt = require('jsonwebtoken');
// Verify Token
let verifyToken = (req, res, next) => {

    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Invalid Token'
                }
            });
        }

        req.user = decoded.user;
        next();
    });
};
// Verify AdminRole
let verifyAdmin_Role = (req, res, next) => {
    let user = req.user;
    if (user.role === 'ADMIN_ROLE') {
        next();
    } else {

        return res.json({
            ok: false,
            err: {
                message: 'The user is not an Admin User'
            }
        });
    }
};

// Verify image token
let verifyTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Invalid Token'
                }
            });
        }
        req.user = decoded.user;
        next();
    });
}

module.exports = {
    verifyToken,
    verifyAdmin_Role,
    verifyTokenImg
}