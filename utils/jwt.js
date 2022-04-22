const jwt = require('jsonwebtoken');

const signJWT = (object) => {
    const token = jwt.sign(object, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
    return token;
};