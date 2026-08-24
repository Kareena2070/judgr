const ApiError = require('../utils/ApiError.js');
const logger = require('../utils/logger.js');

const errorHandler = (err, req, res, next)=>{
    if(err instanceof ApiError){
        return res.status(err.statusCode).json({
            success: false,
            error: {
                code: err.code,
                message: err.message,
                ...(err.details !== undefined && {
                    details: err.details,
                }),
            },
        });
    }

    // without logger
    // console.log(err);

    // with logger
    logger.error(
        {
            err,
            method: req.method,
            path: req.originalUrl,
        },

        "Unhandled application error"
    )

    return res.status(500).json({
        success: false,
        error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong"
        },
    });
};

module.exports = errorHandler;