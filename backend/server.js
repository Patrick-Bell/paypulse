const express = require('express')
require('dotenv').config()
const cors = require('cors')
const mongoose = require('mongoose')
const userRoutes = require('./routes/userRoutes')
const shiftRoutes = require('./routes/shiftRoutes')
const authRoutes = require('./routes/authRoute')
const paySlipRoute = require('./routes/payslipRoutes')
const UserDetailRoutes = require('./routes/UserDetails')
const passwordRoutes = require('./routes/passwordRoutes')
const ratingRoutes = require('./routes/ratingRoute')
const p60Routes = require('./routes/p60Routes')
const path = require('path')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const cron = require('node-cron')
const authenticateToken = require('./middleware/Auth')
const { generatePayslipForPreviousMonth } = require('./utils/PayslipGen')
const { generateP60ForYear, testPayslipFetch } = require('./utils/P60Gen')
const { sendPayslipRemindersToAllUsers, generateShiftReminderEmail } = require('./utils/Email')
const { projectedEarnings } = require('./utils/ProjectedEarnings')


const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000', // Adjust based on your frontend URL
    credentials: true
}));

app.use(express.static(path.join(__dirname, 'build'))); // Serve static files

// Mongo Connection

const uri = process.env.MONGO_URI

mongoose.connect(uri)
const db = mongoose.connection

db.on('error', () => {
    console.log('Connection to MongoDB failed')
})

db.once('open', () => {
    console.log('Connection to MongoDB Successful!')
})

/*
app.get('/generate-payslip', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id ? req.user.id : req.user._id;
        console.log('Getting user ID:', userId);

        const user = await User.findById(userId).populate('shifts');
        console.log('User with shifts:', user);

        if (!user) {
            console.log('User not found');
            return res.status(404).json({ error: 'User not found' });
        }

        const startOfLastMonth = new Date();
        startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);
        startOfLastMonth.setDate(1);
        const endOfLastMonth = new Date(startOfLastMonth);
        endOfLastMonth.setMonth(endOfLastMonth.getMonth() + 1);
        endOfLastMonth.setDate(0);

        const shifts = await Shift.find({
            userId: userId,
            date: {
                $gte: startOfLastMonth,
                $lte: endOfLastMonth
            }
        });

        console.log(shifts)

        res.json(shifts); // Send only shifts if that's what you need

    } catch (e) {
        console.error('Error getting shifts:', e);
        res.status(500).json({ error: 'Error getting all shifts for user' });
    }
});
*/

// Routes
app.use('/api', userRoutes)
app.use('/api', shiftRoutes)
app.use('/api', authRoutes)
app.use('/api', paySlipRoute)
app.use('/api', UserDetailRoutes)
app.use('/api', passwordRoutes)
app.use('/api', ratingRoutes)
app.use('/api', p60Routes)



// Handle any other routes (like /matches) and serve the frontend api
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


cron.schedule('29 23 * * *', async () => {
    console.log('Running cron job: Generating payslips for the previous month');
    try {
        await generatePayslipForPreviousMonth(); // Ensure async operation is awaited
        console.log('Payslip generation completed successfully');
    } catch (error) {
        console.error('Error during payslip generation:', error);
    }
    console.log('did it work or not');
});

cron.schedule('0 09 1 1 *', async () => {
    try{
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;
    console.log(`Running P60 generation for year ${currentYear}`);
    await generateP60ForYear(previousYear);
    } catch(e) {
        console.log(e)
    }
});

// Cron job to trigger at 9 AM on the last day of every month
cron.schedule('0 09 28 * *', async () => {
   try{
    await sendPayslipRemindersToAllUsers()
   }catch(e) {
    console.log(e)
   }
});

cron.schedule('0 0 * * * ', async () => {
    try {
        await generateShiftReminderEmail()
    }catch(e) {
        console.log(e)
    }
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
