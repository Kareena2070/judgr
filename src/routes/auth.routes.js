const express = require("express");
const { z } = require("zod");

const authController = require("../controllers/auth.controller.js");
const authenticate = require("../middlewares/authenticate.js");
const validate = require("../middlewares/validate.js");

const router = express.Router();

const registerSchema = z.object({
    body: z.object({
        name: z.string().trim().min(1),
        email: z.string().trim().email(),
        password: z.string().min(1),
    }),
});

const loginSchema = z.object({
    body: z.object({
        email: z.string().trim().email(),
        password: z.string().min(1),
    }),
});

router.post(
    "/register",
    validate(registerSchema),
    authController.register
);

router.post(
    "/login",
    validate(loginSchema),
    authController.login
);

router.post(
    "/refresh",
    authController.refresh
);

router.get(
    "/me",
    authenticate,
    authController.me
);

router.post(
    "/logout",
    authenticate,
    authController.logout
);


// testing only 
const requireRole = require("../middlewares/authorize.js");

router.get(
    "/admin-test",
    authenticate,
    requireRole("admin"),
    (req, res) => {
        res.json({
            success: true,
            message: "Admin access granted",
        });
    }
);

module.exports = router;