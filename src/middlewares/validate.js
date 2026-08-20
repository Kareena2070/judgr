// const {zodError} = require('zod');
const ApiError = require('../utils/ApiError.js');

const validate = (schema)=>{
    return (req, res, next)=>{
        try{
            // console.log('Content-Type:', req.headers['content-type']);
            // console.log('Request body:', req.body);
            const result = schema.safeParse({
                body: req.body,
                params: req.params,
                query: req.query,
            });

            if(!result.success){
                const details = result.error.issues.map((issue)=>({
                    path: issue.path,
                    message: issue.message,
                }));

                return next(
                    new ApiError(
                        400,
                        "VALIDATION_ERROR",
                        "Request validation failed",
                        details
                    )
                );
            };

            req.validated = result.data;

            next();
        } catch(error){
            next(error);
        }
    };
};

module.exports = validate;