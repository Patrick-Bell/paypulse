import React, { useState } from 'react';
import { Box, TextField, MenuItem, Button, Typography } from '@mui/material';
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'

const urgencyOptions = [
    { value: 'low', label: 'Low' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'high', label: 'High' },
];

function ContactForm() {
    const [formData, setFormData] = useState({
        subject: '',
        text: '',
        urgency: 'low',
    });
    const [sending, setSending] = useState('Submit')

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        setSending('Submitting...')
        e.preventDefault();
        console.log('this is the contact form data', formData)

        try{
            const response = await axios.post('/api/contact-message', formData )
            console.log(response.data)

            toast.success('Message Successfully Sent!')

            setFormData({
                subject: '',
                text: '',
                urgency: 'low',
                })
            
                setSending('Message Successfully Sent!')

            setTimeout(() => {
            setSending('Submit')
            }, 3000);

        } catch(e) {
            console.log(e)
            toast.error('Message Failed to Send!')
        }
        
    };

    return (
        <>

        <ToastContainer />


        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                maxWidth: '100%',
                margin: 'auto',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                borderRadius: '10px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#fff',
            }}
        >
            <Typography variant="h5" component="h2" gutterBottom>
                Contact Us
            </Typography>

            {/* Subject Input */}
            <TextField
                label="Subject"
                name="subject"
                variant="outlined"
                value={formData.subject}
                onChange={handleChange}
                fullWidth
                required
            />

            {/* Message Text Area */}
            <TextField
                label="Message"
                name="text"
                variant="outlined"
                value={formData.text}
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
                required
            />

            {/* Urgency Dropdown */}
            <TextField
                label="Urgency"
                name="urgency"
                select
                value={formData.urgency}
                onChange={handleChange}
                fullWidth
                variant="outlined"
            >
                {urgencyOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>

            {/* Submit Button */}
            <Button type="submit" variant="contained" color="primary" fullWidth>
                {sending}
            </Button>
        </Box>
        </>
    );
}

export default ContactForm;
