import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Grid } from '@mui/material';

const AddShifts = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        shiftName: '',
        shiftDate: '',
        timeStarted: '',
        timeFinished: '',
        payRate: '',
        location: '',
        description: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData)
        console.log('Form data submitted:', formData);
    };

    return (
        <Box
            sx={{
                width: '100%',
                padding: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxSizing: 'border-box',
                maxWidth: '1200px',
                margin: '0 auto'
            }}
        >
            <Typography variant="h5" gutterBottom>
                Add Shift
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ width: '100%' }}
            >
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="shiftName"
                    label="Shift Name"
                    name="shiftName"
                    value={formData.shiftName}
                    onChange={handleChange}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="shiftDate"
                    label="Shift Date"
                    name="shiftDate"
                    type="date"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={formData.shiftDate}
                    onChange={handleChange}
                />
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="timeStarted"
                            label="Time Started"
                            name="timeStarted"
                            type="time"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={formData.timeStarted}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="timeFinished"
                            label="Time Finished"
                            name="timeFinished"
                            type="time"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={formData.timeFinished}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="location"
                    label="Location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="payRate"
                    label="Pay Rate"
                    name="payRate"
                    type="number"
                    inputProps={{ step: '0.01' }}
                    value={formData.payRate}
                    onChange={handleChange}
                />

                <TextField
                    margin="normal"
                    fullWidth
                    id="description"
                    label="Description (Optional)"
                    name="description"
                    multiline
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Submit
                </Button>
            </Box>
        </Box>
    );
};

export default AddShifts;
