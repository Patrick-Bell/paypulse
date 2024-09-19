// src/components/dashboard/ProjectedEarnings.js
import React from 'react';
import { Typography, Paper, Box, Divider, Chip } from '@mui/material';

const ProjectedEarnings = ({ projectedData }) => {
    const { totalEarnings, projectedEarnings, monthsDifference, startOfYear, today } = projectedData;

    const formatCurrency = (amount) => {
        return `£${amount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return (
        <Paper elevation={3} style={{ padding: '20px', margin: '20px', backgroundColor: '#f9f9f9' }}>
            <Typography variant="h6" gutterBottom>
                Projected Earnings
            </Typography>
            <Divider style={{ margin: '10px 0' }} />
            <Box marginBottom={2}>
                <Typography variant="body1" paragraph>
                    <strong>Total Earnings: </strong>{formatCurrency(totalEarnings)}
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>Projected Earnings: </strong>{formatCurrency(projectedEarnings)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    <em>Calculated from the period of {new Date(startOfYear).toLocaleDateString()} to {new Date(today).toLocaleDateString()}</em>
                </Typography>
            </Box>
            <Divider style={{ margin: '10px 0' }} />
            <Box marginTop={2}>
                <Typography variant="body2" color="textSecondary">
                    <strong>Calculation Details:</strong>
                </Typography>
                <Typography variant="body2">
                    The projected earnings are calculated based on the total earnings from {monthsDifference} month(s) of work. 
                    The formula used is: <br></br>
                    <div style={{marginTop: '10px'}}>
                    <code>(Total Earnings to Date / Number of Months) * 12</code>
                    </div>
                </Typography>
                <Chip label={`Number of Months: ${monthsDifference}`} variant="outlined" style={{ padding:'15px', marginTop: '10px' }} />
            </Box>
        </Paper>
    );
};

export default ProjectedEarnings;
