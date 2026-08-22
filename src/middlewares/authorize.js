const ApiError = require("../utils/ApiError.js");

const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(
                new ApiError(
                    401,
                    "AUTHENTICATION_REQUIRED",
                    "Authentication required"
                )
            );
        }

        if (!allowedRoles.includes(req.user.role)) {
            return next(
                new ApiError(
                    403,
                    "FORBIDDEN",
                    "You do not have permission to perform this action"
                )
            );
        }

        next();
    };
};

module.exports = requireRole;