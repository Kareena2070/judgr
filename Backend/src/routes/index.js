const express = require('express');

const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const hackathonRoutes = require("./hackathon.routes");

const router = express.Router();

router.use(healthRoutes);

router.use("/auth", authRoutes);
router.use("/hackathons", hackathonRoutes);

module.exports = router;
