const express = require('express');
const ApiError = require("../utils/ApiError.js");
const asyncHandler = require('../middlewares/asyncHandler.js')


const { z } = require('zod');
const validate = require('../middlewares/validate.js');

const router = express.Router();


router.get('/health', (req, res)=>{
    res.json({
        status: 'health',
        uptime: process.uptime(),
    });
});

// Temporary error-handling test route
router.get('/health/error', (req, res) => {
    throw new ApiError(
        400,
        'TEST_ERROR',
        'This is a test error'
    );
});

router.get('/health/error/unexpected', (req, res) => {
    const value = undefined;

    value.foo();
});

router.get('/health/error/async', asyncHandler( async(req,res)=>{
    throw new ApiError(
        400, 
        "ASYNC_TEST_ERROR",
        'This is an async test error'
    )
}))


const testValidationSchema = z.object({
    body: z.object({
        name: z.string().min(3),
    }),
});

router.post(
    '/health/validation',
    validate(testValidationSchema),
    (req, res) => {
        res.status(200).json({
            success: true,
            data: req.validated,
            message: 'Validation passed',
        });
    }
);

module.exports = router;