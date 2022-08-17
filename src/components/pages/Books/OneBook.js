import React, { useState, useEffect, useContext } from 'react';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';


const tempData = {
    title: "House of Earth and Blood",
    author: "Sarah J. Maas",
    cover_img: "https://covers.openlibrary.org/b/olid/OL27924119M-M.jpg",
    pages: 816,
    edition_key: "OL35866018M"
}

const tempReviews = [
    {
        read: true,
        date_started: "2022-03-22",
        date_finished: "2022-03-23",
        rating: 5,
        review: "One of my favorite books of all time srsly",
        format: "Kindle",
        series: "Crescent City #1",
        UserId: 1,
        BookId: 5,
    }
]

// single book page - top section of the page has lots of details about the book (maybe one template for super detailed results from open library, one template for user added books w a bit less detail included)
// bottom section includes any user reviews
// Add Review Button for if no review already exists, otherwise render review
// Maybe this bottom section is conditionally rendered? Aka if no review, render add review button; if review, render review; if button is clicked (or edit btn) render the review form? Not sure exactly what would be best here 
// toggle for Read vs unread books goes here and the rating also goes here 

export default function OneBook({ user }) {


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