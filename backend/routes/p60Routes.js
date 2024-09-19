const authenticateToken = require('../middleware/Auth')
const Payslip = require('../models/PayslipModal')
const express = require('express')
const router = express.Router()
const User = require('../models/User')
const P60 = require('../models/P60')



router.get('/p60s', authenticateToken, async (req, res) => {
    try{

        const userId = req.user.id ? req.user.id : req.user._id;
        //console.log('Getting user ID:', userId);

        const user = await User.findById(userId).populate('p60s');
        //console.log('User with shifts:', user);

        res.json(user)

    }catch(e) {
        console.log(e)
        res.status(500).json({e: 'error getting payslips'})
    }
})

router.get('/p60s/:id', async (req, res) => {
    const p60Id = req.params.id
    try{
        const p60 = await P60.findOne({ id: p60Id })

        if(!p60) {
            return res.status(400).json({ message: 'no p60 found'})
        }

        res.json(p60)

    }catch(e) {
        console.log(e)
        res.status(500).json({ e: 'error generating payslip' })
    }
})

router.get('/p60-user-info/:id', async (req, res) => {
    const p60Id = req.params.id; // Extract payslip ID from request parameters

    try {
        // Find payslip by ID and populate associated user details
        const p60 = await P60.findOne({ id: p60Id }).populate('user');

        if (!p60) {
            return res.status(404).json({ error: 'Payslip not found' });
        }

        // Send the populated user data as response
        res.json(p60);

    } catch (error) {
        console.error('Error gathering user details for payslip:', error);
        res.status(500).json({ error: 'Error gathering user details for payslip' });
    }
});


module.exports = router