require('dotenv').config()
const express = require('express');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User'); // Adjust the path as needed
const router = express.Router();
const bcrypt = require('bcrypt')
const { sendConfirmationResetPasswordEmail } = require('../utils/Email')

// Configure nodemailer (use your email service)
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

const SESSION_SECRET = 'your-key-secret'

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user in the database by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'No user found' });
    }

    // Generate a password reset token
    const resetToken = jwt.sign(
      { userId: user._id, email: user.email },
      SESSION_SECRET,  // Ensure SESSION_SECRET is accessed correctly
      { expiresIn: '10m' }
    );

    // Construct the reset URL
    const protocol = req.protocol; // Get protocol (http or https)
    const resetUrl = `${protocol}://${req.headers.host}/reset-password/${resetToken}`;

    const emailContent = `
    <p>Dear ${user.username},</p>
      <p>We received a request to reset your password. If you did not make this request, please ignore this email or contact our support team immediately.</p>
      <p>To reset your password, please click on the link below:</p>
      <p><a href="${resetUrl}" target="_blank">Reset Password</a></p>
      <p>This link will expire in 10 minutes for security reasons.</p>
      <p>Thank you for using our service.</p>
      <p>Best regards,<br>The Pay Pulse Team</p>
    `

    // Email options
    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: 'Password Reset Request',
      html: emailContent
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Email to reset password sent!' });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: 'Error sending password reset email' });
  }
});


router.post('/reset-password', async (req, res) => {
    const { token, password } = req.body;

    try {
        // Verify the token
        const decoded = jwt.verify(token, SESSION_SECRET);

        // Find the user by email or ID from the token
        const user = await User.findOne({ email: decoded.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash and update the new password
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        await sendConfirmationResetPasswordEmail(user)

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.log(error, 'error with resetting password')
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ message: 'Token has expired' });
        }
        res.status(500).json({ message: 'Error resetting password' });
    }
});

module.exports = router;
