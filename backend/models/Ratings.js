const mongoose = require('mongoose')

const RatingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    id: String,
    rating_number: { type: Number, min: 1, max: 5 },
    rating_text: String,
    rating_date: { type: Date, default: Date.now()}
})

const Ratings = new mongoose.model('Ratings', RatingSchema)

module.exports = Ratings;