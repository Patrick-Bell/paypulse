const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    id: String,
    username: String,
    email: {type: String, unique: true},
    password: String,
    number: Number,
    address_line_1: String,
    address_line_2: String,
    postal_code: String,
    shifts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shift'}],
    payslips: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payslip'}],
    ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ratings'}],
    p60s: [{ type: mongoose.Schema.Types.ObjectId, ref: 'P60'}],
    terms_conditions: {type: Boolean, default: true}
})

const User = mongoose.model('User', userSchema)

module.exports = User