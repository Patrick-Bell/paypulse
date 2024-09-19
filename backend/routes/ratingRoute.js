const express = require('express')
const Ratings = require('../models/Ratings')
const User = require('../models/User')
const router = express.Router()
const authenticateToken = require('../middleware/Auth')
const { v4: uuidv4 } = require('uuid');
const Contact = require('../models/Contact')
const { sendEmailToUserAfterContact } = require('../utils/Email')




// route to submit a review, and I will save it under user
router.post('/submit-review', authenticateToken, async (req, res) => {

    const { ratingValue, reviewText } = req.body
    console.log({ratingValue, reviewText})

    try{
        const user = req.user
        //console.log(user)

        if (!user) {
            return res.status(400).json({ message: 'No user found to upload review' })
        }


        const newRating = new Ratings({
            user: user.id,
            id: uuidv4(),
            rating_number: ratingValue,
            rating_text: reviewText,
            rating_date: Date.now()
        })

        //console.log(newRating)

        const savedRating = await newRating.save()

        await User.findOneAndUpdate(
            { _id: user.id },
            { $push: { ratings: savedRating._id }},
            { new: true }
        )

        return res.status(200).json(savedRating)



    }catch(e) {
        console.log(e)
        return res.status(500).json({ message: 'error submitting review' })
    }
})


router.get('/user-reviews', authenticateToken, async (req, res) => {
    try{
        const user = req.user
        //console.log(user)

        const getUser = await User.findOne({ _id: user.id }).populate('reviews')

        //console.log(getUser)

        res.status(200).json(getUser)

    }catch(e) {
        console.log(e)
        res.status(500).json({ message: 'Error getting user reviews' })
    }
})



router.post('/contact-message', authenticateToken, async (req, res) => {
    const { subject, text, urgency } = req.body
    console.log(subject, text, urgency)
    try {
        const user = req.user

        const newContact = new Contact({
            user: user.id,
            id: uuidv4(),
            subject: subject,
            text: text,
            urgency: urgency
        })

        const savedContact = await newContact.save()
        await sendEmailToUserAfterContact(user, newContact)

        return res.status(201).json(savedContact)

    }catch(e) {
        console.log(e)
        res.status(500).json({ e: 'error sending contact message' })
    }
})

module.exports = router