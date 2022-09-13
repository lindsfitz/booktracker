import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import AppContext from '../../AppContext';
import API from '../../utils/API'
import { Card, Button, FormControlLabel, Rating, Stack, Switch, CardContent, CardMedia, Typography, Box, Paper, Divider } from '@mui/material';
import AddReview from './AddReview';


// single book page - top section of the page has lots of details about the book (maybe one template for super detailed results from open library, one template for user added books w a bit less detail included)
// bottom section includes any user reviews
// Add Review Button for if no review already exists, otherwise render review
// Maybe this bottom section is conditionally rendered? Aka if no review, render add review button; if review, render review; if button is clicked (or edit btn) render the review form? Not sure exactly what would be best here 
// toggle for Read vs unread books goes here and the rating also goes here 

export default function UserBook() {
    const context = useContext(AppContext);
    const params = useParams();

    const [bookData, setBookData] = useState(null)
    const [reviewData, setReviewData] = useState([])
    const [reviewForm, setReviewForm] = useState(false)

    const bookInfo = async () => {
        const book = await API.getOneBook(params.id);
        // console.log(book)
        setBookData(book.data)
        console.log(bookData)
        const review = await API.getOneReview(context.userData.id, params.id)
        // console.log(review)
        setReviewData(review.data)
    }

    const toggleReviewForm = () => {
        setReviewForm(!reviewForm)
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
                <Divider />
                {!reviewForm && <div>
                    <Button onClick={toggleReviewForm}>Add A New Review</Button>
                </div>}
                {reviewForm && <div>
                    <AddReview />
                    <Button onClick={toggleReviewForm}>Cancel</Button>
                </div>
                }
                <Divider />
                {reviewData.map((review) => (
                    <Paper key={`${review.id}`} elevation={3}>
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

        </React.Fragment>
    )
}