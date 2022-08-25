import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import AppContext from '../../AppContext';
import API from '../../utils/API'
import Card from '@mui/material/Card';
import FormControlLabel from '@mui/material/FormControlLabel';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import tempData from '../../utils/tempData';

// single book page - top section of the page has lots of details about the book (maybe one template for super detailed results from open library, one template for user added books w a bit less detail included)
// bottom section includes any user reviews
// Add Review Button for if no review already exists, otherwise render review
// Maybe this bottom section is conditionally rendered? Aka if no review, render add review button; if review, render review; if button is clicked (or edit btn) render the review form? Not sure exactly what would be best here 
// toggle for Read vs unread books goes here and the rating also goes here 

export default function OneBook() {
    const context = useContext(AppContext);
    const params = useParams();

    const [bookData, setBookData] = useState(null)
    const [reviewData, setReviewData] = useState([])

    const bookInfo = async () => {
        const book = await API.getOneBook(params.id);
        // console.log(book)
        setBookData(book.data)
        console.log(bookData)
        const review = await API.getOneReview(context.userData.id, params.id)
        // console.log(review)
        setReviewData(review.data)
    }

    useEffect(() => {
        bookInfo()
    }, [])


    return (
        <React.Fragment>
            {bookData && reviewData && <div>
                <Card>
                    <CardMedia
                        component="img"
                        height="194"
                        image={`${bookData.cover_img}`}
                        alt={`${bookData.title}`}
                    />
                    {/* <img
                        src={`${bookData.cover_img}`}
                        srcSet={`${bookData.cover_img}`}
                        alt={`${bookData.title}`}
                        loading="lazy"
                    /> */}
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {bookData.title}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            {bookData.author}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {bookData.pages}
                        </Typography>
                    </CardContent>
                </Card>
                {reviewData.map((review) => (
                    <Paper elevation={3}>
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                {review.date_started}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {review.date_finished}
                            </Typography>
                            <Rating name="half-rating-read" defaultValue={review.rating} precision={0.5} readOnly />
                            <Typography variant="subtitle1" color="text.secondary">
                                {review.review}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {review.format}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {review.series}
                            </Typography>
                        </Box>
                    </Paper>
                ))}

            </div>}
            <FormControlLabel disabled control={<Switch />} label="Unread" />
            <Stack spacing={1}>
                <Rating name="half-rating" defaultValue={2.5} precision={0.5} />
                <Rating name="half-rating-read" defaultValue={2.5} precision={0.5} readOnly />
            </Stack>




        </React.Fragment>
    )
}