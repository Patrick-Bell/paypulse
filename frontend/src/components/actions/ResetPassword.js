import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // For URL params and navigation
import { TextField, Button, Box, Typography, Container } from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const ResetPassword = () => {
  const { token } = useParams(); // Get the token from the URL
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!password || !confirmPassword) {
        setError('Please fill in both fields');
        return;
    }
    if (password !== confirmPassword) {
        setError('Passwords do not match');
        toast.error('Passwords do not match!');
        return;
    }

    try {
        const response = await axios.post(`/api/reset-password`, {
            token, // Pass the token from the URL
            password, // New password
        });

        if (response.data.message === 'Password updated successfully') {
            setSuccess('Password reset successful! Redirecting to login...');
            setTimeout(() => {
                navigate('/login'); // Redirect to login after success
            }, 3000);
            toast.success('Password Reset Successfully!');
        } else {
            setError('Failed to reset password');
            toast.error('Failed to Reset Password!');
        }
    } catch (error) {
        // Handle different error scenarios
        if (error.response) {
            // Backend returned a response with error
            if (error.response.data.message === 'Token has expired') {
                toast.error('This Reset Password Link has Expired!');
            } else {
                setError(error.response.data.message || 'Error resetting password. Please try again.');
                toast.error(error.response.data.message || 'Error resetting password. Please try again.');
            }
        } else {
            // No response from backend
            setError('Error resetting password. Please try again.');
            toast.error('Error resetting password. Please try again.');
        }
    }
};


  return (
    <>
    <ToastContainer 
    position='top-right'
    />


    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 3,
          borderRadius: 1,
          boxShadow: 3,
          mt: 8,
        }}
      >
        <Typography component="h1" variant="h5">
          Reset Password
        </Typography>
        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        {success && (
          <Typography color="primary" variant="body2" sx={{ mt: 2 }}>
            {success}
          </Typography>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Reset Password
          </Button>
        </Box>
      </Box>
    </Container>
    </>
  );
};

export default ResetPassword;
