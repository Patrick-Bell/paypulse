const authenticateToken = require('../middleware/Auth')
const Payslip = require('../models/PayslipModal')
const express = require('express')
const router = express.Router()
const User = require('../models/User')



router.get('/payslips', authenticateToken, async (req, res) => {
    try{

        const userId = req.user.id ? req.user.id : req.user._id;
        //console.log('Getting user ID:', userId);

        const user = await User.findById(userId).populate('payslips');
        //console.log('User with shifts:', user);

        res.json(user)

    }catch(e) {
        console.log(e)
        res.status(500).json({e: 'error getting payslips'})
    }
})

router.get('/payslips/:id', async (req, res) => {
    const payslipId = req.params.id
    try{
        const payslip = await Payslip.findOne({ id: payslipId })

        if(!payslip) {
            return res.status(400).json({ message: 'no payslip found'})
        }

        res.json(payslip)

    }catch(e) {
        console.log(e)
        res.status(500).json({ e: 'error generating payslip' })
    }
})

router.get('/payslip-user-info/:id', async (req, res) => {
    const payslipId = req.params.id; // Extract payslip ID from request parameters

    try {
        // Find payslip by ID and populate associated user details
        const payslip = await Payslip.findOne({ id: payslipId }).populate('user');

        if (!payslip) {
            return res.status(404).json({ error: 'Payslip not found' });
        }

        // Send the populated user data as response
        res.json(payslip);

    } catch (error) {
        console.error('Error gathering user details for payslip:', error);
        res.status(500).json({ error: 'Error gathering user details for payslip' });
    }
});


module.exports = router