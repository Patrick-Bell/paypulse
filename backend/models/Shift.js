const mongoose = require('mongoose')

const shiftSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    id: String,
    shift_name: String,
    date: Date,
    time_started: Date,
    time_finished: Date,
    location: String,
    pay_rate: Number,
    total_pay: Number,
    total_hours: Number,
    description: String,
})

const Shift = mongoose.model('Shift', shiftSchema)

module.exports = Shift