const jwt = require('jsonwebtoken');
const config = require('../config/index.js')

const generateAccessToken = (user)=>{
    return jwt.sign(
        {
            sub: user._id.toString(),
            role: user.role
        },
        config.jwt.accessSecret,
        {
            expiresIn: config.jwt.accessExpiresIn,
        }
    );
};

const generateRefreshToken = (user)=>{
    return jwt.sign(
        {
            sub: user._id.toString(),
        },
        config.jwt.refreshSecret,
        {
            expiresIn: config.jwt.refreshExpiresIn,
        }
    );
};

const verifyAccessToken = (token)=>{
    return jwt.verify(token, config.jwt.accessSecret);
};

const verifyRefreshToken = (token)=>{
    return jwt.verify(token, config.jwt.refreshSecret);
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
};