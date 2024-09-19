const jwt = require('jsonwebtoken');
require('dotenv').config();
const express = require('express')
const cookieParser = require('cookie-parser')

const app = express()


app.use(cookieParser()); // Initialize cookie-parser
app.use(express.json())


const SESSION_SECRET = process.env.SESSION_SECRET || 'your-secret-key'; // Get from .env or fallback

const authenticateToken = (req, res, next) => {
    //console.log('Request received:', req);
    //console.log('Token received:', req.cookies ? req.cookies.token : 'No token');

    if (!req.cookies || !req.cookies.token) {
        console.log('No token provided');
        return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(req.cookies.token, SESSION_SECRET, (err, user) => {
        if (err) {
            console.log('Invalid token:', err);
            return res.status(403).json({ error: 'Invalid token' });
        }

        req.user = user;
        //console.log(user)
        next();
    });
};






module.exports = authenticateToken; // Correctly export the middleware
