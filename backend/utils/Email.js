require('dotenv').config()
const nodemailer = require('nodemailer')
const User = require('../models/User')
const Shift = require('../models/Shift')

// email sent when a new shift is added, trigger after router.post(add shift)
const generateNewShiftEmail = async (user, shift) => {
    try {

        const emailContent = `
    <p>Hi ${user.username},</p>
    <p>You have logged a new shift! Please see the details below:</p>
    <br>
    <table style="width: 100%; border-collapse: collapse;">
        <tr>
            <th style="text-align: left; border-bottom: 1px solid #ddd; padding: 8px;">Detail</th>
            <th style="text-align: left; border-bottom: 1px solid #ddd; padding: 8px;">Shift Summary</th>
        </tr>
        <tr>
            <td style="border-bottom: 1px solid #ddd; padding: 8px;"><strong>Shift Name</strong></td>
            <td style="border-bottom: 1px solid #ddd; padding: 8px;">${shift.shift_name}</td>
        </tr>
        <tr>
            <td style="border-bottom: 1px solid #ddd; padding: 8px;"><strong>Date</strong></td>
            <td style="border-bottom: 1px solid #ddd; padding: 8px;">${(shift.date).toLocaleDateString()}</td>
        </tr>
        <tr>
            <td style="border-bottom: 1px solid #ddd; padding: 8px;"><strong>Start Time</strong></td>
            <td style="border-bottom: 1px solid #ddd; padding: 8px;">${(shift.time_started).toLocaleTimeString()}</td>
        </tr>
        <tr>
            <td style="border-bottom: 1px solid #ddd; padding: 8px;"><strong>End Time</strong></td>
            <td style="border-bottom: 1px solid #ddd; padding: 8px;">${(shift.time_finished).toLocaleTimeString()}</td>
        </tr>
        <tr>
            <td style="border-bottom: 1px solid #ddd; padding: 8px;"><strong>Hours</strong></td>
            <td style="border-bottom: 1px solid #ddd; padding: 8px;">${(shift.total_hours).toFixed(2)}</td>
        </tr>
        <tr>
            <td style="border-bottom: 1px solid #ddd; padding: 8px;"><strong>Location</strong></td>
            <td style="border-bottom: 1px solid #ddd; padding: 8px;">${shift.location}</td>
        </tr>
        <tr>
            <td style="border-bottom: 1px solid #ddd; padding: 8px;"><strong>Pay Rate</strong></td>
            <td style="border-bottom: 1px solid #ddd; padding: 8px;">£${(shift.pay_rate).toFixed(2)} p/hour</td>
        </tr>
         <tr>
            <td style="border-bottom: 1px solid #ddd; padding: 8px;"><strong>Total Pay</strong></td>
            <td style="border-bottom: 1px solid #ddd; padding: 8px;">£${(shift.total_pay).toFixed(2)}</td>
        </tr>
        <tr>
            <td style="border-bottom: 1px solid #ddd; padding: 8px;"><strong>Description</strong></td>
            <td style="border-bottom: 1px solid #ddd; padding: 8px;">${shift.description || 'N/A'}</td>
        </tr>
    </table>
    <br>
    <p>Thank you!</p>
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
            subject: 'New Shift Added!',
            html: emailContent
        });

        console.log('Email sent successfully'); // Log success

    } catch (e) {
        console.error('Error sending email:', e); // Detailed error logging
    }
};


// email sent when a new user registers, will trigger after every router.post register
const generateNewUserEmail = async (user) => {
    try {
        // HTML content for the email
        const emailContent = `
            <p>Hi ${user.username},</p>
            <p>Welcome to Pay Pulse! Thank you for registering with us.</p>
            <p>We’re excited to have you on board. Here are some tips to get you started:</p>
            <ul>
                <li><strong>Add your Shifts:</strong> Filter and view important details!</li>
                <li><strong>Explore your Dashboard:</strong> View your calendar and payslips!</li>
                <li><strong>Projections (new):</strong> View your projected earnings based on your shift data! (coming soon...)</li>
            </ul>
            <p>We’re here to help you make the most of Pay Pulse. If you have any questions, feel free to reach out.</p>
            <p>Best regards,</p>
            <p>The Pay Pulse Team</p>
        `;

        // Configure the email transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS
            }
        });

        // Send the email
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: user.email,
            subject: "Welcome to Pay Pulse! Your Account is Ready",
            html: emailContent
        });

        console.log(`Welcome email sent to ${user.email}`);
    } catch (e) {
        console.error('Error sending welcome email:', e);
    }
};


// email sent when user changes their password
const generateChangePasswordEmail = async (user) => {
    try {
        const emailContent = `
        <p>Dear ${user.username},</p>
        <p>This is to inform you that your password has been successfully changed.</p>
        <p>If you <strong>did not</strong> initiate this change, please contact our support team immediately as your account may be at risk. You can reach us at <a href="mailto:patrickbell1302@gmail.com">patrickbell1302@gmail.com</a>.</p>
        <p>Thank you for your attention to this matter.</p>
        <br>
        <p>Best regards,</p>
        <p>The Pay Pulse Team</p>
        <p><a href="http://www.yourcompanywebsite.com">www.paypulse.com</a></p>
        <p><small>If you have any questions or need further assistance, please do not hesitate to reach out to us.</small></p>
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
            subject: 'Password Change Confirmation',
            html: emailContent
        });

    } catch (e) {
        console.error('Error sending password change email:', e);
    }
};


// email sent when a shift is 1 day away, just set a node cron to run daily with this in it
const generateShiftReminderEmail = async () => {
    try {
        // Get the current date and time
        const now = new Date();
        
        // Define the time window for upcoming shifts (e.g., next 24 hours)
        const reminderWindow = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now
        
        // Find shifts that are within the reminder window
        const shifts = await Shift.find({
            date: {
                $gte: now,
                $lte: reminderWindow
            }
        }).populate('user'); // Assuming you have a reference to the User model in the Shift model

        // Iterate through each shift and send a reminder email to the user
        for (const shift of shifts) {
            const user = shift.user; // User associated with the shift

            const emailContent = `
                <h1>Shift Reminder</h1>
                <p>Dear ${user.username},</p>
                <p>This is a friendly reminder about your upcoming shift:</p>
                
                <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; max-width: 600px;">
                    <thead>
                        <tr style="background-color: #f2f2f2;">
                            <th style="text-align: left;">Description</th>
                            <th style="text-align: left;">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Shift Date</td>
                            <td>${new Date(shift.date).toLocaleDateString()}</td>
                        </tr>
                        <tr>
                            <td>Start Time</td>
                            <td>${new Date(shift.time_started).toLocaleTimeString()}</td>
                        </tr>
                        <tr>
                            <td>End Time</td>
                            <td>${new Date(shift.time_finished).toLocaleTimeString()}</td>
                        </tr>
                        <tr>
                            <td>Location</td>
                            <td>${shift.location}</td>
                        </tr>
                    </tbody>
                </table>
                
                <p>Please make sure to be on time. If you have any questions or need to make changes, contact your supervisor.</p>
                <p>Thank you!</p>
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
                subject: 'Upcoming Shift Reminder',
                html: emailContent
            });

            console.log(`Reminder email sent to ${user.email} for shift on ${shift.date}`);
        }
    } catch (e) {
        console.log('Error sending shift reminder emails:', e);
    }
};

// email sent when a new shift is added, trigger after router.post(add shift)
const generateUpcomingPayslipReminderEmail = async (user) => {
    try {
        // Get the previous month's name
        const today = new Date();
        const previousMonth = new Date(today.setMonth(today.getMonth() - 1));
        const monthName = previousMonth.toLocaleString('default', { month: 'long' }); // E.g., "August" if current month is September

        // Email content with the previous month name
        const emailContent = `
            <p>Hi ${user.username}, </p>
            <p>This is a reminder that your payslip for <strong>${monthName}</strong> will be in your inbox in the upcoming days. 
            Please review your work hours and let us know if you notice any discrepancies.</p>
            <p>Thank you,</p>
            <p>Your Payroll Team</p>
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
            subject: `Payslip Reminder for ${monthName}`,
            html: emailContent
        });

        console.log(`Payslip reminder email sent to ${user.email}`);

    } catch (e) {
        console.log('Error sending email:', e);
    }
};

const sendPayslipRemindersToAllUsers = async () => {
    try {
        // Assuming you have a User model to fetch all users
        const users = await User.find(); // Fetch all users from the database

        // Loop through each user and send the payslip reminder email
        for (const user of users) {
            await generateUpcomingPayslipReminderEmail(user);
        }

        console.log('Payslip reminder emails sent to all users.');
    } catch (error) {
        console.error('Error fetching users or sending emails:', error);
    }
};



const sendConfirmationResetPasswordEmail = async (user) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS
            }
        });

        const emailContent = `
            <p>Dear ${user.username},</p>
            <p>We wanted to inform you that your password has been successfully reset.</p>
            <p>If you did not initiate this request, please contact our support team immediately as your account may be at risk.</p>
            <p>For any further assistance, feel free to reach out to us.</p>
            <p>Best regards,<br>Pay Pulse Team</p>
        `;

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: user.email,
            subject: 'Your Password has been Reset',
            html: emailContent
        });

    } catch (e) {
        console.log('Error sending confirmation email:', e);
    }
}

const sendEmailToUserAfterContact = async (user, contact) => {
    try {
        // Handle urgency text based on contact's urgency
        let urgencyText = '';
        switch (contact.urgency) {
            case 'low':
                urgencyText = '*Low Urgency*. We will respond within 48-72 hours';
                break;
            case 'moderate':
                urgencyText = '*Moderate Urgency*. We will respond within 24-48 hours';
                break;
            case 'high':
                urgencyText = '*High Urgency*. We will respond within 24 hours.';
                break;
            default:
                urgencyText = 'The urgency level of this message is unknown.';
                break;
        }

        // Email content
        let emailContent = `
        <p>Hi ${user.username},</p>
        <p>You have received a new message. Please see the details below:</p>
        <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
            <thead>
                <tr>
                    <th>Details</th>
                    <th>User Response</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>From</strong></td>
                    <td>${user.username} (${user.email})</td>
                </tr>
                 <tr>
                    <td><strong>Date</strong></td>
                    <td>${(contact.created_at).toLocaleDateString()} at ${(contact.created_at).toLocaleTimeString()}</td>
                </tr>
                <tr>
                    <td><strong>Subject</strong></td>
                    <td>${contact.subject}</td>
                </tr>
                <tr>
                    <td><strong>Message</strong></td>
                    <td>${contact.text}</td>
                </tr>
                <tr>
                    <td><strong>Urgency</strong></td>
                    <td>${urgencyText}</td>
                </tr>
            </tbody>
        </table>
        <p>Thank you!</p>
        `;

        // Set up email transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS
            }
        });

        // Send email
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: user.email,
            subject: 'You have received a new message',
            html: emailContent
        });

        console.log('Email sent successfully');
    } catch (e) {
        console.log('Failed to send email:', e);
    }
};



module.exports = { sendEmailToUserAfterContact, sendConfirmationResetPasswordEmail, generateNewShiftEmail, generateNewUserEmail, generateShiftReminderEmail, generateChangePasswordEmail, sendPayslipRemindersToAllUsers }