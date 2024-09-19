import React, { useState } from 'react';
import { Card, CardContent, Typography, Grid, Box, IconButton, Menu, MenuItem } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DateRangeIcon from '@mui/icons-material/DateRange';
import WorkIcon from '@mui/icons-material/Work';
import MoreVertIcon from '@mui/icons-material/MoreVert'; // Icon for dropdown menu
import { FaEdit, FaTrash } from 'react-icons/fa';

function ShiftBox({ shift, onEdit, onDelete }) {
    const { shift_name, total_hours, total_pay, date, time_started, time_finished, location } = shift;

    // State for controlling the menu
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        handleMenuClose();
        onEdit(shift._id); // Call the edit function passed as a prop
        console.log(shift._id)
    };

    const handleDelete = () => {
        handleMenuClose();
        onDelete(shift); // Call the delete function passed as a prop
    };

    return (
        <Card sx={{ margin: '20px', borderRadius: 4, boxShadow: 6, height: 190 }}>
            <CardContent>
                <Grid container spacing={3}>
                    <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center">
                            <WorkIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="h6" component="div" fontWeight="bold" gutterBottom>
                                {shift_name}
                            </Typography>
                        </Box>

                        {/* Dropdown menu button */}
                        <IconButton onClick={handleMenuOpen}>
                            <MoreVertIcon />
                        </IconButton>

                        {/* Dropdown menu */}
                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleMenuClose}
                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        >
                            <MenuItem sx={{width: '150px'}} onClick={handleEdit}> <FaEdit style={{margin: '0 5px'}}/> Edit</MenuItem>
                            <MenuItem sx={{width: '150px'}} onClick={handleDelete}> <FaTrash style={{margin: '0 5px'}}/> Delete</MenuItem>
                        </Menu>
                    </Grid>

                    <Grid item xs={6}>
                        <Box display="flex" alignItems="center" mb={1}>
                            <DateRangeIcon color="action" sx={{ mr: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                                {new Date(date).toLocaleDateString()}
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" mb={1}>
                            <AccessTimeIcon color="action" sx={{ mr: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                                {new Date(time_started).toLocaleTimeString()} - {new Date(time_finished).toLocaleTimeString()}
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center">
                            <LocationOnIcon color="action" sx={{ mr: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                                {location}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={6} textAlign="right">
                        <Box display="flex" flexDirection="column" alignItems="flex-end">
                            <Box display="flex" alignItems="center" mt={1}>
                                <AccessTimeIcon color="action" sx={{ mr: 1 }} />
                                <Typography variant="body2" color="text.secondary">
                                    {total_hours} hours
                                </Typography>
                            </Box>
                            <Box 
                                display="flex" 
                                alignItems="center"
                                sx={{ 
                                    backdropFilter: 'blur(8px)', 
                                    padding: '5px 10px', 
                                    borderRadius: 2, 
                                    bgcolor: 'rgba(255, 255, 255, 0.2)', 
                                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', 
                                    mt: 2 // Add some space between hours and earnings
                                }}
                            >
                                <Typography 
                                    variant="h6" 
                                    color="primary" 
                                    fontWeight="bold" 
                                    sx={{
                                        filter: 'blur(3px)', 
                                        cursor: 'pointer', 
                                        '&:hover': { filter: 'none' } // Removes blur on hover
                                    }}
                                >
                                    £{(total_pay).toFixed(2)}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}

export default ShiftBox;
