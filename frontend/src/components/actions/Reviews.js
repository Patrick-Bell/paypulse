import React, { useState } from 'react';
import { Box, Button, Rating, TextField, Typography, Card, CardContent, Grid, Alert } from '@mui/material';

function Review({ handleSubmit, submit }) {
  // State for form data
  const [formData, setFormData] = useState({
    ratingValue: 5,
    reviewText: '',
  });

  // State for error message
  const [errorMessage, setErrorMessage] = useState("");

  // Update the rating in formData
  const handleRatingChange = (event, newValue) => {
    setFormData(prevState => ({
      ...prevState,
      ratingValue: newValue
    }));
    setErrorMessage(""); // Clear error message when rating changes
  };

  // Update the review text in formData
  const handleReviewChange = (event) => {
    setFormData(prevState => ({
      ...prevState,
      reviewText: event.target.value
    }));
    setErrorMessage(""); // Clear error message when text changes
  };

  // Submit the form data
  const onSubmit = () => {
    const { ratingValue, reviewText } = formData;

    if (ratingValue === 0 || reviewText.trim() === "") {
      setErrorMessage("Please provide a rating and write a review.");
      return;
    }

    // Handle submission
    handleSubmit(formData);

    // Reset form on successful submission
    setFormData({
      ratingValue: 5,
      reviewText: '',
    });
    setErrorMessage("");
  };

  return (
    <Box sx={{ maxWidth: '100%', margin: '0 auto', padding: 4 }}>
      <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            Share Your Experience
          </Typography>

          <Typography variant="body1" sx={{ marginBottom: 3 }}>
            We value your feedback. Please rate your experience and write a brief review to help us improve.
          </Typography>

          {errorMessage && (
            <Alert severity="error" sx={{ marginBottom: 2 }}>
              {errorMessage}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Rating Section */}
            <Grid item xs={12}>
              <Typography variant="h6" component="p">
                Rate your experience:
              </Typography>
              <Rating
                name="user-rating"
                value={formData.ratingValue}
                onChange={handleRatingChange}
                size="large"
                sx={{ marginBottom: 2 }}
              />
            </Grid>

            {/* Review Text Area */}
            <Grid item xs={12}>
              <TextField
                label="Your Review"
                multiline
                rows={5}
                fullWidth
                variant="outlined"
                value={formData.reviewText}
                onChange={handleReviewChange}
                placeholder="Write your review here..."
                InputLabelProps={{
                  sx: {
                    fontSize: '1.1rem',
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={onSubmit}
                disabled={formData.ratingValue === 0 || formData.reviewText.trim() === ""}
                sx={{
                  borderRadius: 2,
                  backgroundColor: '#1976d2',
                  '&:hover': {
                    backgroundColor: '#115293',
                  },
                }}
              >
                {submit}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Review;
