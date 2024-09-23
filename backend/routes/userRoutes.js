require('dotenv').config()
const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { generateNewUserEmail } = require('../utils/Email')

const SESSION_SECRET = 'your-secret-key'

// register route

router.post('/register', async (req, res) => {
    try {
        const { username, email, number, address_line_1, address_line_2, postal_code, password } = req.body

        const existingUser = await User.findOne({ email: email })
        if (existingUser) {
            return res.status(400).json({ message: 'Email Already signed up'})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            id: uuidv4(),
            username: username,
            email: email,
            number: number,
            address_line_1: address_line_1,
            address_line_2: address_line_2,
            password: hashedPassword,
            postal_code: postal_code,
            terms_conditions: true,
            shifts: [],
            payslips: [],
            ratings: [],
            p60s: []
        })

        const savedUser = await newUser.save()

        await generateNewUserEmail(newUser)

        //console.log(savedUser)

        return res.status(201).json(savedUser)

    } catch(error) {
        console.log(error)
        console.log('error with API')
        res.status(500).json({ error: 'error' })
    }
})

// login route

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'No user found with this email' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        const token = jwt.sign({ id: user._id, username: user.username, email: user.email }, SESSION_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict', // changed from Lax
            maxAge: 3600000, // 1 hour
            path: '/',
            //domain: 'localhost'
        });

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.post('/logout', async (req, res) => {
    try{
        res.clearCookie('token')
        res.status(200).json({ message: 'Logged out successful'})

    }catch(e) {
        console.log(e)
        res.status(500).json({ e: 'error logging out' })
    }
})




module.exports = router