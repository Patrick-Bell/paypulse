require('dotenv').config()
const User = require('../models/User'); // Adjust the path to your User model
const Shift = require('../models/Shift');
const P60 = require('../models/P60')
const Payslip = require('../models/PayslipModal')
const authenticateToken = require('../middleware/Auth')
const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer')


const generateP60Email = async (user, p60, year) => {
    try {
        // Create the email content with HTML table formatting
        const emailContent = `
            <h1>Payslip for ${year}</h1>
            <p>Dear ${user.username},</p>
            <p>Your payslip for ${monthName} is now available. Here are the details:</p>

            <h3>Year-to-Date Totals</h3>
            <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; max-width: 600px;">
                <thead>
                    <tr style="background-color: #f2f2f2;">
                        <th style="text-align: left;">Description</th>
                        <th style="text-align: right;">Amount (£)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Total Hours Worked</td>
                        <td style="text-align: right;">${p60.yearly_hours.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Total Pay</td>
                        <td style="text-align: right;">${p60.yearly_pay.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Total Shifts</td>
                        <td style="text-align: right;">${p60.yearly_number_of_shifts}</td>
                    </tr>
                    <tr>
                        <td>Total Tax Paid</td>
                        <td style="text-align: right;">${p60.yearly_tax.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Total Net Pay</td>
                        <td style="text-align: right;">${p60.yearly_netpay.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>

            <p>If you have any questions, please get in touch.</p>
        `;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: user.email,
            subject: `Payslip for ${monthName}`,    
            html: emailContent
        });

        console.log(`Payslip email sent to ${user.email}`);
    } catch (e) {
        console.log('Error sending email:', e);
    }
};





async function generateP60ForYear(year) {
    try {
        const startOfYear = new Date(Date.UTC(year, 0, 1));
        const endOfYear = new Date(Date.UTC(year, 11, 31, 23, 59, 59));

        const currentYear = new Date().getFullYear();
        const previousYear = currentYear - 1; 

        const users = await User.find();

        for (const user of users) {
            const userId = user._id;
            console.log(`Generating P60 for user ID: ${userId}`);

            const payslips = await Payslip.find({
                user: userId,
                start_date: { $gte: startOfYear },
                end_date: { $lte: endOfYear }
            });

            console.log(payslips)
            console.log(payslips.length)

            const yearlyHours = payslips.reduce((sum, payslip) => sum + payslip.month_hours, 0);
            const yearlyPay = payslips.reduce((sum, payslip) => sum + payslip.month_pay, 0);
            const yearlyShifts = payslips.reduce((sum, payslip) => sum + payslip.number_of_shifts, 0);
            const yearlyNetPay = payslips.reduce((sum, payslip) => sum + payslip.month_netpay, 0);
            const yearlyTax = payslips.reduce((sum, payslip) => sum + payslip.month_tax, 0);

            const yearlyRate = yearlyPay;

            const newP60 = new P60({
                user: userId,
                id: uuidv4(),
                year: new Date(previousYear, 0, 1), // For reference
                year_start: startOfYear,
                year_end: endOfYear,
                yearly_hours: yearlyHours,
                yearly_number_of_shifts: yearlyShifts,
                yearly_pay: yearlyPay,
                yearly_rate: yearlyRate,
                yearly_tax: yearlyTax,
                yearly_netpay: yearlyNetPay
            });

            await newP60.save();
            console.log(`P60 generated for ${user.username} for year ${year}: £${yearlyPay.toFixed(2)} for ${yearlyHours} hours`);

            await User.findOneAndUpdate(
                { _id: userId },
                { $push: { p60s: newP60._id } },
                { new: true }
            );

            console.log(`P60 added to user ${user.username}`);
        }
    } catch (e) {
        console.error('Error generating P60s:', e);
    }
}

async function testPayslipFetch(year) {
    try {
        const startOfYear = new Date(Date.UTC(year, 0, 1));
        const endOfYear = new Date(Date.UTC(year, 11, 31, 23, 59, 59));

        const users = await User.find();

        for (const user of users) {
            const userId = user._id;
            console.log(`Fetching payslips for user ID: ${userId}`);

            const payslips = await Payslip.find({
                user: userId,
                start_date: { $gte: startOfYear },
                end_date: { $lte: endOfYear }
            });

            console.log(`Found ${payslips.length} payslips for user ${user.username}`);

            // Optionally log the payslips to check their contents
            payslips.forEach(payslip => {
                console.log(`Payslip: ${payslip}`);
            });
        }
    } catch (e) {
        console.error('Error fetching payslips:', e);
    }
}


module.exports =  { generateP60ForYear, testPayslipFetch } 