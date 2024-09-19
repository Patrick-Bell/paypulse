const Shifts = require('../models/Shift');

const projectedEarnings = async (user) => {
    try {
        const startOfYear = new Date(Date.UTC(new Date().getUTCFullYear(), 0, 1)); // January 1st of the current year
        const today = new Date(); // Current date

        // Calculate the number of months between the start of the year and today
        const monthsDifference = (today.getFullYear() - startOfYear.getFullYear()) * 12 + today.getMonth() - startOfYear.getMonth() + 1;

        console.log(startOfYear, today, 'months', monthsDifference)

        // Find shifts for the user within the specified date range
        const shifts = await Shifts.find({
            user: user.id, // Assuming the shift documents have a userId field to match the user
            date: {
                $gte: startOfYear,
                $lte: today
            }
        });

        // Calculate total earnings
        const totalEarnings = shifts.reduce((acc, shift) => acc + shift.total_pay, 0);
        console.log(shifts)

        // Calculate projected earnings (total earnings / number of months * 12)
        const projectedEarnings = (totalEarnings / monthsDifference) * 12;

        console.log(totalEarnings, projectedEarnings)

        return {
            startOfYear,
            today,
            monthsDifference,
            totalEarnings,
            projectedEarnings
        };
    } catch (e) {
        console.error(e);
        throw new Error('An error occurred while calculating projected earnings.');
    }
};

module.exports = { projectedEarnings };
