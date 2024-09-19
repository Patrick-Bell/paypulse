require('dotenv').config()
const User = require('../models/User'); // Adjust the path to your User model
const Shift = require('../models/Shift');
const Payslip = require('../models/PayslipModal')
const authenticateToken = require('../middleware/Auth')
const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer')


/*
router.get('/generate-payslip', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id ? req.user.id : req.user._id;
        console.log('Getting user ID:', userId);

        const user = await User.findById(userId).populate('shifts');
        console.log('User with shifts:', user);
        console.log('shifts for', user.username);

        if (!user) {
            console.log('User not found');
            return res.status(404).json({ error: 'User not found' });
        }

        // Get start and end dates for the previous month using UTC to avoid timezone issues
        const startOfLastMonth = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth() - 1, 1));
        const endOfLastMonth = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 0, 23, 59, 59)); // Last second of the last day of the previous month

        console.log('Start of last month:', startOfLastMonth);
        console.log('End of last month:', endOfLastMonth);

        // Find the shifts for the user that occurred in the previous month
        const shifts = await Shift.find({
            user: userId,
            date: {
                $gte: startOfLastMonth,  // Greater than or equal to start date
                $lte: endOfLastMonth     // Less than or equal to end date
            }
        });

        console.log('Shifts in the previous month:', shifts);

        // Return only the shifts in the previous month
        res.json(shifts);

    } catch (e) {
        console.error('Error getting shifts:', e);
        res.status(500).json({ error: 'Error getting shifts for the previous month' });
    }
});
*/

// UK tax calculation function for annual income with monthly tax calculation
async function calculateMonthlyTax(totalMonthlyPay) {
    // Calculate the total annual income
    let totalAnnualPay = totalMonthlyPay * 12;

    // Define tax brackets
    const personalAllowance = 12570; // No tax up to this amount
    const basicRateThreshold = 50270; // 20% tax up to this amount
    const higherRateThreshold = 125140; // 40% tax up to this amount
    const additionalRateThreshold = Infinity; // 45% tax above this amount

    const basicRate = 0.20;  // 20% tax rate
    const higherRate = 0.40; // 40% tax rate
    const additionalRate = 0.45; // 45% tax rate

    let annualTax = 0;

    // Calculate tax based on the brackets
    if (totalAnnualPay > additionalRateThreshold) {
        annualTax += (totalAnnualPay - additionalRateThreshold) * additionalRate;
        totalAnnualPay = additionalRateThreshold;
    }

    if (totalAnnualPay > higherRateThreshold) {
        annualTax += (totalAnnualPay - higherRateThreshold) * higherRate;
        totalAnnualPay = higherRateThreshold;
    }

    if (totalAnnualPay > basicRateThreshold) {
        annualTax += (totalAnnualPay - basicRateThreshold) * basicRate;
        totalAnnualPay = basicRateThreshold;
    }

    // Calculate the monthly tax
    const monthlyTax = annualTax / 12;

    return monthlyTax;
}


const generatePaySlipEmail = async (user, payslip, monthName) => {
    try {
        // Create the email content with HTML table formatting
        const emailContent = `
            <h1>Payslip for ${monthName}</h1>
            <p>Dear ${user.username},</p>
            <p>Your payslip for ${monthName} is now available. Here are the details:</p>
            
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
                        <td style="text-align: right;">${payslip.month_hours.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Total Pay</td>
                        <td style="text-align: right;">${payslip.month_pay.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Tax Deducted</td>
                        <td style="text-align: right;">${payslip.month_tax.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Net Pay</td>
                        <td style="text-align: right;">${payslip.month_netpay.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>

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
                        <td style="text-align: right;">${payslip.to_date_hours.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Total Pay</td>
                        <td style="text-align: right;">${payslip.to_date_pay.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Total Shifts</td>
                        <td style="text-align: right;">${payslip.to_date_shifts}</td>
                    </tr>
                    <tr>
                        <td>Total Tax Paid</td>
                        <td style="text-align: right;">${payslip.to_date_tax.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Total Net Pay</td>
                        <td style="text-align: right;">${payslip.to_date_netpay.toFixed(2)}</td>
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




async function generatePayslipForPreviousMonth() {
    try {
        // Find all users who have shifts
        const users = await User.find().populate('shifts');

        // Iterate through each user and find their shifts for the previous month
        for (const user of users) {
            const userId = user._id;
            console.log(`Generating payslip for user ID: ${userId}`);

            // Get start and end dates for the previous month using UTC
            const startOfLastMonth = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth() - 1, 1));
            const endOfLastMonth = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 0, 23, 59, 59));

            // Get the name of the previous month (for example: "August 2024")
            const monthName = startOfLastMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

            // Find the shifts for the user that occurred in the previous month
            const shifts = await Shift.find({
                user: userId,
                date: {
                    $gte: startOfLastMonth,
                    $lte: endOfLastMonth
                }
            });

            // Fetch all previous payslips to calculate cumulative totals
            const previousPayslips = await Payslip.find({ user: userId });

            // Initialize cumulative totals for year-to-date
            let totalPayUpToDate = 0;
            let totalHoursUpToDate = 0;
            let totalShiftsUpToDate = 0;
            let totalNetPayUpToDate = 0;
            let totalTaxUpToDate = 0;

            // Calculate the cumulative totals from previous payslips if they exist
            if (previousPayslips.length > 0) {
                totalPayUpToDate = previousPayslips.reduce((sum, payslip) => sum + payslip.month_pay, 0);
                totalHoursUpToDate = previousPayslips.reduce((sum, payslip) => sum + payslip.month_hours, 0);
                totalShiftsUpToDate = previousPayslips.reduce((sum, payslip) => sum + payslip.number_of_shifts, 0);
                totalNetPayUpToDate = previousPayslips.reduce((sum, payslip) => sum + payslip.month_netpay, 0);
                totalTaxUpToDate = previousPayslips.reduce((sum, payslip) => sum + payslip.month_tax, 0);
            }

            // Calculate total hours and total pay for the current month
            const totalHours = shifts.reduce((sum, shift) => sum + shift.total_hours, 0);
            const totalPay = shifts.reduce((sum, shift) => sum + shift.total_pay, 0);
            const tax = await calculateMonthlyTax(totalPay);
            const netpay = totalPay - tax;

            // Add the current month's values to the year-to-date totals
            const updatedTotalPay = totalPayUpToDate + totalPay;
            const updatedTotalHours = totalHoursUpToDate + totalHours;
            const updatedTotalShifts = totalShiftsUpToDate + shifts.length;
            const updatedTotalNetPay = totalNetPayUpToDate + netpay;
            const updatedTotalTax = totalTaxUpToDate + tax;

            // Create a new payslip
            const newPayslip = new Payslip({
                user: userId,
                id: uuidv4(),
                start_date: startOfLastMonth,
                end_date: endOfLastMonth,
                number_of_shifts: shifts.length,
                month_hours: totalHours,
                month_pay: totalPay,
                month_tax: tax,
                month_netpay: netpay,
                created_at: Date.now(),
                to_date_pay: updatedTotalPay, // Updated to-date totals
                to_date_hours: updatedTotalHours,
                to_date_shifts: updatedTotalShifts,
                to_date_netpay: updatedTotalNetPay,
                to_date_tax: updatedTotalTax
            });

            // Save the new payslip
            await newPayslip.save();
            console.log(`Payslip generated for ${user.username} for ${monthName}: £${totalPay.toFixed(2)} for ${totalHours} hours`);

            // Update the user by pushing the new payslip into the user's payslips array
            await User.findOneAndUpdate(
                { _id: userId },
                { $push: { payslips: newPayslip._id } },
                { new: true }
            );

            console.log(`Payslip added to user ${user.username}`);

            await generatePaySlipEmail(user, newPayslip, monthName)
        }
    } catch (e) {
        console.error('Error generating payslips:', e);
    }
}







module.exports = { generatePayslipForPreviousMonth };

