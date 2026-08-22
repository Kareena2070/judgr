const {verifyAccessToken} = require('../utils/token.js');
const ApiError = require('../utils/ApiError.js');

const authenticate = (req, res, next)=>{
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return next(
            new ApiError(
                401,
                "AUTHENTICATION_REQUIRED",
                "Authentication required"
            )
        );
    }

    const token = authHeader.split(" ")[1];

    if(!token){
        return next(
            new ApiError(
                401,
                "AUTHENTICATION_REQUIRED",
                "Authentication required"
            )
        )
    }

    try{
        const decoded = verifyAccessToken(token);
        req.user = decoded;
        next()
    } catch(error){
        return next(
            new ApiError(
                401,
                "INVALID_ACCESS_TOKEN",
                "Invalid or expired access token"
            )
        );
    }
};

module.exports = authenticate;
