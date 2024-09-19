require('dotenv').config()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const express = require('express')
const router = express.Router()
const authenticateToken = require('../middleware/Auth')
const { generateChangePasswordEmail } = require('../utils/Email')
const jwt = require('jsonwebtoken');
const SESSION_SECRET = 'your-secret-key'

router.post('/change-password', async (req, res) => {
    const { userId, password, newPassword, confirmPassword } = req.body;

    try {
        // Find user by ID
        const user = await User.findOne({ id: userId });
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Compare provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match' })
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password and save the changes
        user.password = hashedPassword;
        await user.save();

        await generateChangePasswordEmail(user)

        return res.status(200).json({ message: 'Password successfully updated!' });

    } catch (error) {
        console.error('Error changing password:', error); // Fixed typo here
        res.status(500).json({ error: 'Error changing password for user' });
    }
});


router.put(`/edit-personal-details`, async (req, res) => {
    const { formData } = req.body;
    console.log(formData)
    
    try {
        // Using await to handle the promise correctly
        const updatedUser = await User.findOneAndUpdate(
            { id: formData.id }, // Assuming _id is the field to match the user
            { $set: formData },
            { new: true } // Return the updated document
        );

        c//onsole.log(updatedUser);


        // Check if the user was found and updated
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const newToken = jwt.sign(
            { id: updatedUser._id, username: updatedUser.username, email: updatedUser.email },
            SESSION_SECRET,
            { expiresIn: '1h' } // Adjust the token expiration as needed
        );

        // Send back the updated user and new token
        res.status(200).json({ 
            message: 'Personal details updated successfully',
            updatedUser,
            newToken // Send the new token if you’re using it
        });



    } catch (e) {
        console.error('Error updating user:', e);
        return res.status(500).json({ error: 'An error occurred while updating personal details' });
    }
});


router.post


module.exports = router