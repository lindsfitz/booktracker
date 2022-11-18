import React from 'react';
import { Container, Typography, Link, Box, Divider } from "@mui/material"
import Note from './Note';
import Review from './Review';
import PublicReview from "./PublicReview";




const Feedback = ({ reviewData, noteData, publicReviews, markedAs, toggleNoteForm, toggleReviewForm, reviewInfo, noteInfo, openSnackbar, bookId, pages }) => {

    // IF !noteData && !reviewData && !publicReviews
    // return text - no reviews; links to add your thoughts/reviews

    if (!noteData && !reviewData && !publicReviews) {
        return (
            <Container sx={{ m: '30px auto 85px auto', textAlign: 'center' }}>
                <Typography variant='subtitle2'>
                    It looks like you haven't added any reviews or notes for this book yet, and neither have your fellow Booked members.
                </Typography>

                <Link variant='subtitle2' onClick={toggleNoteForm}>Is this book on your Want to Read or Currently Reading lists? Add Your Thoughts!</Link><br />
                <Link variant='subtitle2' onClick={toggleReviewForm}>Already finished reading this book? Add A Review.</Link>
            </Container>
        )
    }


    // IF !noteData && !reviewData

    // return publicReviews only
    // plus text & link to add your thoughts/review

    if (!noteData && !reviewData && publicReviews) {
        return (
            <Container sx={{ mb: '70px', mt: 2, mx: 0, px: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant='subtitle1'>
                    Community Reviews:
                </Typography>
                <Divider />
                {publicReviews.avg && <Box>
                    <Typography variant='body2'>Average Rating: {publicReviews.avg.avgRating}</Typography>
                    <Typography variant='body2'>{publicReviews.avg.count} Reviews</Typography>
                </Box>}
                <Divider />
                <Box>
                    {publicReviews.reviews.map(review => (
                        <React.Fragment>
                            <Divider />
                            <Box>
                                <PublicReview review={review} />
                            </Box>
                            <Divider />
                        </React.Fragment>
                    ))}
                </Box>
            </Container>
        )
    }


    // IF markedRead && !reviewData

    // return link to add a review
    // IF noteData
    // link to expand noteData
    // expanded publicReviews

    if (markedAs === 'Read') {

        return (
            <Container>
                <Box>
                    <Link variant='subtitle2' onClick={toggleReviewForm}>Already finished reading this book? Add A Review.</Link>
                </Box>
                {noteData && <Link variant='subtitle2'>Your Notes</Link>}
               {publicReviews && <Container sx={{ mb: '70px', mt: 2, mx: 0, px: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography variant='subtitle1'>
                        Community Reviews:
                    </Typography>
                    <Divider />
                    {publicReviews.avg && <Box>
                    <Typography variant='body2'>Average Rating: {publicReviews.avg.avgRating}</Typography>
                    <Typography variant='body2'>{publicReviews.avg.count} Reviews</Typography>
                </Box>}
                    <Divider />
                    <Box>
                        {publicReviews.reviews.map(review => (
                            <React.Fragment>
                                <Divider />
                                <Box>
                                    <PublicReview review={review} />
                                </Box>
                                <Divider />
                            </React.Fragment>
                        ))}
                    </Box>
                </Container>}
            </Container>
        )

    }



    // IF markedRead && reviewData

    // return reviewData
    // link to expand publicReviews
    // IF noteData
    // link to expand noteData

    if (markedAs === 'Read & Reviewed') {

        return (
            <Container>
                {noteData && <Link variant='subtitle2'>Your Notes</Link>}
                {publicReviews && <Box>
                    <Link variant='subtitle2'>See All Community Reviews</Link>
                </Box>}
                <Container sx={{ mb: '70px', mt: 2, mx: 0, px: 0, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant='subtitle1'>
                        Your Reviews:
                    </Typography>
                    <br />
                    {reviewData.map((review) =>
                        <React.Fragment>
                            <Divider />
                            <Review
                                review={review}
                                reviewInfo={reviewInfo}
                                openSnackbar={openSnackbar}
                                bookId={bookId}
                            />
                            <Divider />
                        </React.Fragment>
                    )}


                </Container>

            </Container>
        )

    }


    // IF !markedRead && noteData
    // return notes 
    // and link to expand publicReviews

    if (noteData) {

        return (
            <Container>
                {publicReviews && <Box>
                    <Link variant='subtitle2'>See All Community Reviews</Link>
                </Box>}
                <Container sx={{ mb: '70px', mt: 2, mx: 0, px: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography variant='subtitle1'>
                        Your Notes:
                    </Typography>
                    <br />

                    {noteData.map((note) =>
                        <React.Fragment>
                            <Divider />
                            <Note note={note} noteInfo={noteInfo} openSnackbar={openSnackbar} bookId={bookId} pages={pages} />
                            <Divider />
                        </React.Fragment>
                    )}
                </Container>
            </Container>
        )

    }


}

export default Feedback;