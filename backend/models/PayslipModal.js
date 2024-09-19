const mongoose = require('mongoose')

const PayslipSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    id: String,
    month: String,
    year: String,
    start_date: Date,
    end_date: Date,
    number_of_shifts: Number,
    month_hours: Number,
    month_pay: Number,
    month_tax: Number,
    month_netpay: Number,
    created_at: { type: Date, default: Date.now()},
    to_date_pay: Number,
    to_date_hours: Number,
    to_date_shifts: Number,
    to_date_netpay: Number,
    to_date_tax: Number
})

const Payslip = new mongoose.model('Payslip', PayslipSchema)

module.exports = Payslip