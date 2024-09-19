require('dotenv').config()
const express = require('express')
const router = express.Router()
const Shift = require('../models/Shift')
const User = require('../models/User')
const authenticateToken = require('../middleware/Auth')
const { generateNewShiftEmail } = require('../utils/Email')
const { projectedEarnings } = require('../utils/ProjectedEarnings')


router.post('/add-shift', authenticateToken, async (req, res) => {
    try {
        const { shift_name, date, time_started, time_finished, pay_rate, location, description } = req.body;

        const userId = req.user.id;
        const user = req.user

        // Create Date objects for date and time fields
        const shiftDate = new Date(date); // Date of the shift
        const startTime = new Date(`${date}T${time_started}`); // Full start time with date
        let endTime = new Date(`${date}T${time_finished}`); // Full end time with date

        // Adjust endTime if it’s earlier than startTime
        if (endTime < startTime) {
            endTime.setDate(endTime.getDate() + 1); // Adjust for shifts ending after midnight
        }

        // Calculate total hours and pay
        const totalHours = (endTime - startTime) / (1000 * 60 * 60); // Convert milliseconds to hours
        const totalPay = totalHours * pay_rate;

        const newShift = new Shift({
            user: userId,
            shift_name,
            date: shiftDate,
            time_started: startTime,
            time_finished: endTime,
            total_hours: Math.max(totalHours, 0), // Ensure total hours is not negative
            location,
            pay_rate,
            total_pay: totalPay,
            description,
        });

        const savedShift = await newShift.save();

        await User.findOneAndUpdate(
            { _id: userId },
            { $push: { shifts: savedShift._id }},
            { new: true }
        );

        await generateNewShiftEmail(user, newShift)


        res.status(201).json(savedShift);
    } catch (error) {
        console.error('Error adding shift:', error);
        res.status(500).json({ error: 'Error adding shift', details: error.message });
    }
});


router.get('/shifts', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id ? req.user.id : req.user._id;
        //console.log('Getting user ID:', userId);

        const user = await User.findById(userId).populate('shifts');
        //console.log('User with shifts:', user);

        if (!user) {
            console.log('User not found');
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user.shifts); // Send only shifts if that's what you need
    } catch (e) {
        console.error('Error getting shifts:', e);
        res.status(500).json({ error: 'Error getting all shifts for user' });
    }
});


router.delete('/delete-shift/:id', authenticateToken, async (req, res) => {
    const shiftId = req.params.id;
    //console.log(shiftId)
    try {

        const user = req.user

        const shift = await Shift.findOneAndDelete({ _id: shiftId });

        if (!shift) {
            return res.status(404).json({ error: 'Shift not found' });
        }

        await User.findOneAndUpdate(
            { _id: user.id },
            { $pull: { shifts: shiftId }},
            { new: true }
        );


        res.status(200).json({ message: 'Shift deleted successfully' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/get-shift/:id', async (req, res) => {
    const shiftId = req.params.id
    try{
        const shift = await Shift.findOne({ _id: shiftId })

        if (!shift) {
            return res.status(404).json({ error: 'Shift not found' });
        }

        res.status(200).json({ message: 'Shift found successfully' });

    }catch(e) {
        console.log(e)
        res.status(500).json({ e: 'error' })
    }
})

// server/routes/shiftRoutes.js
router.put('/update-shift/:id', authenticateToken, async (req, res) => {
    try {
        //console.log('Received data:', req.body); // Log the incoming data

        const { shift_name, shift_date, time_started, time_finished, pay_rate, location, description } = req.body;

        // Parse the date and time strings from ISO format
        const shiftDate = new Date(shift_date);
        const startTime = new Date(time_started);
        const endTime = new Date(time_finished);

        //console.log('Parsed date:', shiftDate);
        //console.log('Parsed start time:', startTime);
        //console.log('Parsed end time:', endTime);

        // Validate the parsed dates
        if (isNaN(shiftDate.getTime()) || isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
            throw new Error('Invalid date or time format');
        }

        // Adjust endTime if it is earlier than startTime (crosses midnight)
        if (endTime < startTime) {
            endTime.setDate(endTime.getDate() + 1);
        }

        const totalHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60); // Convert from milliseconds to hours
        const validTotalHours = Math.max(totalHours, 0);
        const totalPay = validTotalHours * pay_rate;

        // Find and update the shift
        const updatedShift = await Shift.findByIdAndUpdate(req.params.id, {
            shift_name,
            date: shiftDate,
            time_started: startTime,
            time_finished: endTime,
            total_hours: validTotalHours,
            location,
            pay_rate,
            total_pay: totalPay,
            description,
        }, { new: true });

        if (!updatedShift) {
            return res.status(404).json({ error: 'Shift not found' });
        }

        res.json(updatedShift);
    } catch (error) {
        console.error('Error updating shift:', error); // Log detailed error
        res.status(400).json({ error: 'Error updating shift', details: error.message });
    }
});


// Route to get projected earnings
router.get('/projected-earnings', authenticateToken, async (req, res) => {
    try {
        const user = req.user; // Auth middleware should set req.user
        const earnings = await projectedEarnings(user);

        //console.log(earnings)

        res.json(earnings);
    } catch (error) {
        res.status(500).send('An error occurred while calculating projected earnings.');
    }
});








module.exports = router