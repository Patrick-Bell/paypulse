

import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';

function ForgotPasswordModal({ open, handleClose, handleSubmit }) {
    const [email, setEmail] = useState('');

    const onSubmit = () => {
        handleSubmit(email); // Pass the email to the handleSubmit function
        handleClose(); // Close the modal after submission
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Forgot Password</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="email"
                    label="Email Address"
                    type="email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{width: '500px'}}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={onSubmit} color="primary" variant="contained">
                    Send
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ForgotPasswordModal;