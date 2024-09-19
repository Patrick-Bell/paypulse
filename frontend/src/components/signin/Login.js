import React, { useState } from 'react';
import { Button, TextField, Typography, Container, Box, Grid, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ForgotPasswordModal from '../actions/ForgotPasswordModal';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [forgotModal, setForgotModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
        const response = await axios.post('/api/login', {
            email: email,
            password: password
        });

        console.log('Login response:', response.data);

        // Ensure the token is set in cookies
        console.log('Cookies after login:', document.cookie);

        setEmail('');
        setPassword('');
        setError('');

        // Ensure redirection happens
        console.log('Navigating to dashboard...');
        navigate('/dashboard');
        toast.success('Login Successful!');
    } catch (err) {
        console.error('Login failed', err);
        setError('Login failed, please try again.');
        toast.error('Login Failed!');
    }
};


  const handleRegisterClick = () => {
    navigate('/register');
  };

  const openModal = () => {
    setForgotModal(true);
  };

  const closeModal = () => {
    setForgotModal(false);
  };

  const handleForgotPasswordSubmit = async (email) => {
    try {
      const response = await axios.post(`/api/forgot-password`, { email });
      console.log(response.data);
      toast.success('Password Reset Link has been sent to your Email!');
    } catch (e) {
      console.error('Error sending reset link:', e);
      toast.error('Error sending reset link.');
    }
  };

  return (
    <>
      <ToastContainer position='top-right' />
      {forgotModal && (
        <ForgotPasswordModal
          open={forgotModal}
          handleClose={closeModal}
          handleSubmit={handleForgotPasswordSubmit}
        />
      )}
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          top: '50%',
          left: '50%',
          position: 'absolute',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 3,
            borderRadius: 1,
            boxShadow: 3,
          }}
        >
          <Typography component="h1" variant="h5">
            Sign In
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            {error && (
              <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Button
                  variant="text"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={openModal}
                >
                  Forgot password?
                </Button>
              </Grid>
            </Grid>
            <Box sx={{ mt: 3 }}>
              <Typography align="center">
                Don't have an account?{' '}
                <Link href="#" variant="body2" onClick={handleRegisterClick}>
                  Click here to register
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Login;
