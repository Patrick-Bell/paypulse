const mongoose = require('mongoose')

const P60Schema = new mongoose.Schema({
    user: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
    id: String,
    year: Date,
    year_start: Date,
    year_end: Date,
    yearly_hours: Number,
    yearly_number_of_shifts: Number,
    yearly_pay: Number,
    yearly_rate: Number,
    yearly_tax: Number,
    yearly_netpay: Number,
    created_at: {type: Date, default: Date.now()}
    // other criteria too, will do this tomorrow as it is quick and easy
})

const P60 = new mongoose.model('P60', P60Schema)

module.exports = P60;


// to calculate this, it is once a year calculated and i just need to go through all the payslips basically so i can trigger this on the first of the next year