import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../../AppContext';
import API from '../../utils/API'
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import tempData from '../../utils/tempData';

// single book page - top section of the page has lots of details about the book (maybe one template for super detailed results from open library, one template for user added books w a bit less detail included)
// bottom section includes any user reviews
// Add Review Button for if no review already exists, otherwise render review
// Maybe this bottom section is conditionally rendered? Aka if no review, render add review button; if review, render review; if button is clicked (or edit btn) render the review form? Not sure exactly what would be best here 
// toggle for Read vs unread books goes here and the rating also goes here 

export default function OneBook() {
    const context = useContext(AppContext);


    return (
        <React.Fragment>
            <FormControlLabel disabled control={<Switch />} label="Unread" />
            <Stack spacing={1}>
                <Rating name="half-rating" defaultValue={2.5} precision={0.5} />
                <Rating name="half-rating-read" defaultValue={2.5} precision={0.5} readOnly />
            </Stack>
            



        </React.Fragment>
    )
}