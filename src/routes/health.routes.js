const express = require('express');

const router = express.Router();

router.get('/health', (req, res)=>{
    res.json({
        status: 'healthly',
        uptime: process.uptime(),
    });
});

module.exports = router;