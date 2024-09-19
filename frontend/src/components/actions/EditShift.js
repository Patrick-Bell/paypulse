import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const EditShift = ({ open, onClose, shift, onSave }) => {
    const [formData, setFormData] = useState({
        _id: '',
        shift_name: '',
        shift_date: '',
        time_started: '',
        time_finished: '',
        pay_rate: '',
        location: '',
        description: '',
    });

    useEffect(() => {
        if (shift) {
            const formatTime = (dateString) => {
                if (!dateString) return '';
                const date = new Date(dateString);
                return isNaN(date.getTime()) ? '' : date.toTimeString().substring(0, 5); // Extracts HH:mm in local time
            };

            const shiftDate = shift.date.split('T')[0] || ''; // Converts to YYYY-MM-DD

            setFormData({
                _id: shift._id,
                shift_name: shift.shift_name || '',
                shift_date: shiftDate,
                time_started: formatTime(shift.time_started) || '',
                time_finished: formatTime(shift.time_finished) || '',
                pay_rate: shift.pay_rate || '',
                location: shift.location || '',
                description: shift.description || '',
            });
        }
    }, [shift]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = () => {
        const { shift_date, time_started, time_finished } = formData;
        const formattedDate = new Date(shift_date).toISOString().split('T')[0]; // YYYY-MM-DD
        
        // Construct ISO strings for local time
        const formattedStartTime = new Date(`${formattedDate}T${time_started}:00`).toISOString();
        const formattedEndTime = new Date(`${formattedDate}T${time_finished}:00`).toISOString();
    
        onSave({
            ...formData,
            shift_date: formattedDate,
            time_started: formattedStartTime,
            time_finished: formattedEndTime
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Edit Shift</DialogTitle>
            <DialogContent>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Shift Name"
                    name="shift_name"
                    value={formData.shift_name}
                    onChange={handleChange}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Shift Date"
                    name="shift_date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={formData.shift_date}
                    onChange={handleChange}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Time Started"
                    name="time_started"
                    type="time"
                    InputLabelProps={{ shrink: true }}
                    value={formData.time_started}
                    onChange={handleChange}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Time Finished"
                    name="time_finished"
                    type="time"
                    InputLabelProps={{ shrink: true }}
                    value={formData.time_finished}
                    onChange={handleChange}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Pay Rate"
                    name="pay_rate"
                    type="number"
                    inputProps={{ step: '0.01' }}
                    value={formData.pay_rate}
                    onChange={handleChange}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Description (Optional)"
                    name="description"
                    multiline
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditShift;
