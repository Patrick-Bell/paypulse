const express = require('express')
const router = express.Router()
const authenticateToken = require('../middleware/Auth')

router.get('/check-auth', authenticateToken, async (req, res) => {

    try{
        console.log('checking auth')
        res.json({ isAuthenticated: true, user: req.user });
    } catch(e) {
        console.log('not working', e)
    }
});

module.exports = router
