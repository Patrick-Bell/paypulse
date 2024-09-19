import { useState } from 'react';
import { TextField, Box, Button } from '@mui/material';

function EditDetails({ id, username, email, number, address_line_1, address_line_2, postal_code, onClick }) {
    
    // Local state to handle form inputs
    const [formData, setFormData] = useState({
        id,
        username,
        email,
        number,
        address_line_1,
        address_line_2,
        postal_code
    });

    // Update form state on input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = () => {
        onClick(formData); // Send updated data to parent
    };

    return (
        <>
            <Box sx={{ margin: '10px', background: '#f9f9f9', padding: '10px', textAlign: 'center', fontSize: '1.5rem', borderRadius: '10px' }}>
                Personal Details
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    type="text"
                    disabled
                    value={formData.email}
                    onChange={handleChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="number"
                    label="Number"
                    name="number"
                    type="text"
                    value={formData.number}
                    onChange={handleChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </Box>
            
            <Box sx={{ margin: '10px', background: '#f9f9f9', padding: '10px', textAlign: 'center', fontSize: '1.5rem', borderRadius: '10px' }}>
                Address
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="address_line_1"
                    label="Address Line 1"
                    name="address_line_1"
                    type="text"
                    value={formData.address_line_1}
                    onChange={handleChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="address_line_2"
                    label="Address Line 2"
                    name="address_line_2"
                    type="text"
                    value={formData.address_line_2}
                    onChange={handleChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="postal_code"
                    label="Post Code"
                    name="postal_code"
                    type="text"
                    value={formData.postal_code}
                    onChange={handleChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </Box>
            
            <Button onClick={handleSubmit} variant='contained' color='primary'>
                Submit
            </Button>
        </>
    );
}

export default EditDetails;
