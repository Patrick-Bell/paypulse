const mongoose = require('mongoose')

const contactUsSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    id: String,
    subject: String,
    text: String,
    urgency: {
        type: String,
        enum: ['low', 'moderate', 'high']
    },
    created_at: { type: Date, default: Date.now() }

})


const Contact = mongoose.model('Contact', contactUsSchema)

module.exports = Contact