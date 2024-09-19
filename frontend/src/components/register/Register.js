import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Registration.css';
import { TextField, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom'
import axios from 'axios'

const steps = ['Create Profile', 'Address', 'Password', 'Terms'];

function Register() {
  const [activeStep, setActiveStep] = useState(0);
  const [successMessage, setSuccessMessage] = useState(false);
  const [isChecked, setIsChecked] = useState(false); // state for checkbox
  const [countdown, setCountdown] = useState(10); // Initialize the countdown to 5 seconds
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [address1, setAddress1] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isDetailsValid, setIsDetailsValid] = useState(false);
  const [isAddressValid, setIsAddressValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false)
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [numberError, setNumberError] = useState('');
  const [address1Error, setAddress1Error] = useState('')
  const [cityError, setCityError] = useState('')
  const [postalCodeError, setPostalCodeError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')

  const navigate = useNavigate();

  const handleRegisterClick = () => {
    console.log('going to login page now...')
    window.location.href = '/signin'; // Navigate to the register page
  };

  const handleRegistration = async () => {
    console.log('handling registration')
    try {
      // Make the POST request to the server
      const response = await axios.post('/api/register', {
        username: username,
        email: email,
        number: number,
        address_line_1: address1,
        address_line_2: city,
        postal_code: postalCode,
        password: password
      }, {withCredentials: true});

      console.log('sent over details')
      

      console.log(response.status)
      // Assuming that success is determined by response status or data
      if (response.status === 201) {
        setSuccessMessage(true);  // Set success message state to true
        console.log('showing success data')
      }
  
      console.log(response.data);
    } catch (error) {
      // Log the error for debugging
      console.error("Registration Error: ", error);
    }
  };
  
  
  useEffect(() => {
    const validatePassword = () => {
      const validLength = password.length >= 8;
      const passwordMatch = password === confirmPassword;
  
      if (validLength && passwordMatch) {
        setPasswordError('');
        setConfirmPasswordError('');
        setIsPasswordValid(true);
      } else {
        if (!validLength) {
          setPasswordError('Password must be at least 8 characters.');
        } else {
          setPasswordError('');
        }
  
        if (!passwordMatch) {
          setConfirmPasswordError('Passwords do not match.');
        } else {
          setConfirmPasswordError('');
        }
  
        setIsPasswordValid(false);
      }
    };
  
    validatePassword();
  }, [password, confirmPassword]);
  

  useEffect(() => {
    const validateAddress = () => {
      const address1Valid = address1.length > 1;
      const cityValid = city.length > 1;
      const postalCodeValid = postalCode.length > 1;

      setAddress1Error(address1Valid ? '' : 'Address line 1 cannot be left empty.');
      setCityError(cityValid ? '' : 'City cannot be left empty.');
      setPostalCodeError(postalCodeValid ? '' : 'Postal code cannot be left empty.');

      setIsAddressValid(address1Valid && cityValid && postalCodeValid);
    };

    validateAddress();
  }, [address1, city, postalCode]);


  useEffect(() => {
    const handleDetailsValidation = () => {
      // Username must be at least 8 characters long
      const usernameValid = username.length >= 8;
      setUsernameError(usernameValid ? '' : 'Username must be at least 8 characters long');
      
      // Email regex validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const emailValid = emailRegex.test(email);
      setEmailError(emailValid ? '' : 'Invalid email address');

      // Phone number must be exactly 11 digits
      const numberValid = number.length === 11 && /^[0-9]+$/.test(number);
      setNumberError(numberValid ? '' : 'Phone number must be 11 digits');

      // Check if all fields are valid
      setIsDetailsValid(usernameValid && emailValid && numberValid);
    };

    handleDetailsValidation(); // Call the validation function

  }, [username, email, number]); // Watch the state changes of these fields

  const handleCheckChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box
            component="form"
            sx={{ '& .MuiTextField-root': { width: '100%' } }}
            noValidate
            autoComplete="off"
          >
            <TextField
              required
              id='username'
              type='text'
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={!!usernameError}
              helperText={usernameError}
              style={{ marginTop: '5px' }}
            />
            <TextField
              required
              id='email'
              type='email'
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!emailError} // Corrected to apply error state
              helperText={emailError}
              style={{ marginTop: '10px' }}
            />
            <TextField
              required
              id='number'
              type='number'
              label="Phone Number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              error={!!numberError}
              helperText={numberError}
              style={{ marginTop: '10px' }}
            />
          </Box>
        );
      case 1:
        return (
          <Box
            component="form"
            sx={{ '& .MuiTextField-root': { width: '100%' } }}
            noValidate
            autoComplete="off"
          >
            <TextField
              required
              id='address1'
              label="Address Line 1"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              error={!!address1Error} // Apply error state if there's an error
              helperText={address1Error} // Show the error message
              style={{ marginTop: '10px' }}
            />
            <TextField
              required
              id='city'
              label="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              error={!!cityError}
              helperText={cityError}
              style={{ marginTop: '10px' }}
            />
            <TextField
              required
              id='postalCode'
              label="Postal Code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              error={!!postalCodeError}
              helperText={postalCodeError}
              style={{ marginTop: '10px' }}
            />
          </Box>
        );
      case 2:
        return (
          <>
          <Box
            component="form"
            sx={{ '& .MuiTextField-root': { width: '100%' } }}
            noValidate
            autoComplete="off"
          >
          <TextField
              required
              id='password'
              type='password'
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
              style={{ marginTop: '7px' }}
            />
            <TextField
              required
              id='confirm-password'
              type='password'
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={!!confirmPasswordError}
              helperText={confirmPasswordError}
              style={{ marginTop: '10px' }}
            />
             </Box>
          </>
        )
      case 3:
        return (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <input type='checkbox' checked={isChecked} onChange={handleCheckChange} />
            <p>Please Accept Terms & Conditions to proceed.</p>
          </span>
        );
      default:
        return <>Unknown Step</>;
    }
  };
  

  // Effect to start countdown and redirect after the timer finishes
  useEffect(() => {
    if (successMessage) {
      const timerInterval = setInterval(() => {
        setCountdown((prevCount) => prevCount - 1);
      }, 1000);

      const redirectTimeout = setTimeout(() => {
        navigate('/signin'); // Redirect to login page after 5 seconds
      }, 5000);

      // Cleanup function to clear timers on component unmount
      return () => {
        clearInterval(timerInterval);
        clearTimeout(redirectTimeout);
      };
    }
  }, [successMessage, navigate]);

  return (
    <>
      {successMessage ? (
        <div className='success-wrapper'>
          <p className='success-lg-t'>Thank you <strong>{username ? username : ''}</strong> for registering for Pay Pulse!</p>
          <p>Your registration was successful.</p>
          <p>Redirecting to login page in <strong>{countdown}</strong>... If you are not redirected, please click <span><Link to='/login'>here</Link></span>.</p>
        </div>
      ) : (
        <div className='register-wrapper'>
          <div className="stepper-container">
            {/* Progress Bar */}
            <div className="progress-bar">
              <div
                className="progress-indicator"
                style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
              />
            </div>

            {/* Stepper */}
            <div className="stepper">
              {steps.map((label, index) => (
                <div key={index} className={`step ${index <= activeStep ? 'active' : ''}`}>
                  <div className="step-number">
                    {index < activeStep ? <span className="checkmark">&#10003;</span> : index + 1}
                  </div>
                  <div className="step-label">{label}</div>
                  {index < steps.length - 1 && <div className="step-connector"></div>}
                </div>
              ))}
            </div>

            {/* Step Content */}
            <div className="step-content">
              <p>{renderStepContent(activeStep)}</p>
            </div>

            {/* Stepper Buttons */}
            <div className="stepper-buttons">
              <button onClick={handleBack} disabled={activeStep === 0}>
                Back
              </button>

              {activeStep === steps.length - 1 ? (
                <button disabled={!isChecked} onClick={handleRegistration}>Submit</button>
              ) : (
                <button onClick={handleNext} disabled={!isDetailsValid && activeStep === 0 
                  || !isAddressValid && activeStep === 1
                  || !isPasswordValid && activeStep === 2}>
                    Next
                  </button>
              )}
            </div>

            <Box sx={{ mt: 3 }}>
              <Typography align="center">
                Already have an account?{' '}
                <Link variant="body2" onClick={handleRegisterClick} style={{ cursor: 'pointer' }}>
                Click here to login
              </Link>
                </Typography>
            </Box>


          </div>
        </div>
      )}
    </>
  );
}

export default Register;
