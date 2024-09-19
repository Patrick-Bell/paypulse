import { Button, TextField, Box } from '@mui/material';
import { useState } from 'react';

function ChangePassword({ userId, handleSubmit }) {
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleFormSubmit = async () => {
        // Call handleSubmit with parameters
        const result = await handleSubmit(userId, password, newPassword, confirmPassword);
        
        // If successful, reset the fields
        if (result === 'success') {
            setPassword('');
            setNewPassword('');
            setConfirmPassword('');
        }
    };

    return (
        <>

            <Box sx={{margin: '10px', background: '#f9f9f9;', padding: '10px', textAlign: 'center', fontSize: '1.5rem', borderRadius: '10px'}}>Change Password
            <TextField
                margin="normal"
                required
                fullWidth
                id="password"
                label="Current Password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="new-password"
                label="New Password"
                name="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="confirm-password"
                label="Confirm Password"
                name="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            </Box>

            <Button
                onClick={handleFormSubmit}  // Use the local function for form submission
                variant='contained'
                color='primary'
            >
                Update
            </Button>
        </>
    );
}

export default ChangePassword;
