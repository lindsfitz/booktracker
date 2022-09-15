import React, { useState, useEffect, useContext } from 'react';
import { useParams } from "react-router-dom";
import AppContext from '../AppContext';
import API from '../utils/API'
import { Card, Button, Rating, CardContent, CardMedia, Typography, Box, Container, Paper, Divider, Switch, Stack, Chip, Link, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddReview from './components/AddReview';
import EditReview from './components/EditReview';


// single book page - top section of the page has lots of details about the book (maybe one template for super detailed results from open library, one template for user added books w a bit less detail included)
// bottom section includes any user reviews
// Add Review Button for if no review already exists, otherwise render review
// Maybe this bottom section is conditionally rendered? Aka if no review, render add review button; if review, render review; if button is clicked (or edit btn) render the review form? Not sure exactly what would be best here 
// toggle for Read vs unread books goes here and the rating also goes here 

export default function UserBook() {
    const context = useContext(AppContext);
    const params = useParams();

    const [bookData, setBookData] = useState(null)
    const [reviewData, setReviewData] = useState(false)
    const [reviewForm, setReviewForm] = useState(false)
    const [editReview, setEditReview] = useState(false);
    const [editId, setEditId] = useState(null);
    const [markedRead, setMarkedRead] = useState(false);
    const [markedReading, setMarkedReading] = useState(false)


    const bookInfo = async () => {
        const book = await API.getBookandShelves(params.id, context.userData.id);
        // const book = await API.getOneBook(params.id);
        // console.log(book)
        setBookData(book.data)
        if (book.data.Users.length) {
            setMarkedReading(true)
        }
    }

    const reviewInfo = async () => {
        const review = await API.getOneReview(context.userData.id, params.id)
        if (review.data.length) {
            setReviewData(review.data)
        }

        for (let i = 0; i < review.data.length; i++) {
            if (review.data[i].read === true) {
                setMarkedRead(true)
            }
        }
    }

    const addToRead = () => {
        API.newReview({
            last_update: new Date()
        })
    }

    const addToCurrentlyReading = async () => {
        await API.addCurrentRead({
            userId: context.userData.id,
            bookId: bookData.id
        })
        // console.log(added)
    }

    const moveToRead = async () => {
        await API.finishedReading({
            UserId:context.userData.id,
            BookId:bookData.id,
            last_update: new Date()
        })
    }

    const toggleReviewForm = () => {
        setReviewForm(!reviewForm)
    }

    const toggleEditForm = (id) => {
        setEditId(id)
        setEditReview(!editReview)
    }

    const deleteReview = async (id) => {
        API.deleteReview(id)
        reviewInfo()
    }

    const removeFromShelf = (shelfid) => {
        API.removefromShelf(shelfid, bookData.id)
    }

    useEffect(() => {
        bookInfo()
        reviewInfo()
    }, [])


    return (
        <React.Fragment>
            {bookData && <div>
                {/* ----BOOK DETAILS @ TOP---- */}
                <Container sx={{ display: "flex", m: 3, p: 2 }}>
                    <Card sx={{ maxWidth: 345 }} >
                        <CardContent>
                            <CardMedia
                                component="img"
                                // height="194"
                                image={`${bookData.cover_img}`}
                                alt={`${bookData.title}`}
                            />
                        </CardContent>
                    </Card>
                    <Box sx={{ maxWidth: "60%", p: 4 }}>
                        <Typography gutterBottom variant="h5" component="div">
                            {bookData.title}
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary">
                            by {bookData.author}
                        </Typography>
                        <Divider />
                        <Typography variant="caption" color="text.secondary">
                            Pages: {bookData.pages}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Published: {bookData.published}
                        </Typography>
                        <Divider />
                        <Typography variant='body2'>
                            {bookData.description}
                        </Typography>

                    </Box>

                </Container>


                {/* ----CONDITIONALS FOR READ/READING & SHELVES---- */}
                {bookData.Shelves &&
                    <Stack direction="row" spacing={2}>
                        {markedRead &&
                            <Stack spacing={0}>
                                <Typography variant='caption'>Marked As:</Typography>
                                <Chip label='Read' />
                            </Stack>
                        }
                        {markedReading &&
                            <Stack spacing={0}>
                                <Typography variant='caption'>Marked As:</Typography>
                                <Chip label='Currently Reading' />
                            </Stack>
                        }
                        <Stack spacing={0}>
                            <Typography variant='caption'>On Shelves:</Typography>
                            <Stack direction='row'>
                                {bookData.Shelves.map((shelf) => (
                                    <Chip label={shelf.name} variant="outlined" onDelete={() => removeFromShelf(shelf.id)} />
                                ))}
                            </Stack>
                        </Stack>
                    </Stack>}



                <Divider />

                {/* ---- ADD NEW REVIEW FORM COMPONENT ---- */}
                {reviewForm ? (<div>
                    <AddReview reviewInfo={reviewInfo} toggleReviewForm={toggleReviewForm} />
                    <Button onClick={toggleReviewForm}>Cancel</Button>
                </div>) : (<div>
                    <Button>Add to Shelf</Button>
                    {!markedRead && !markedReading &&
                        <React.Fragment>
                            <Button onClick={addToCurrentlyReading}>Add To Currently Reading</Button>
                            <Button onClick={addToRead}>Mark As Read</Button>
                        </React.Fragment>
                    }
                    {!markedRead && markedReading &&
                        <React.Fragment>
                            <Button onClick={moveToRead}>Mark As Read</Button>
                        </React.Fragment>
                    }
                    <Button onClick={toggleReviewForm}>Add A Review</Button>
                </div>)
                }
                <Divider />


                {/* ---- REVIEWS SECTION ---- */}
                <Container>
                    {!reviewData && !reviewForm && <div style={{ margin: '30px auto 0 auto', textAlign: 'center' }}>
                        <Typography variant='subtitle2'>
                            It looks like you haven't reviewed this book yet.
                        </Typography>

                        <Link variant='subtitle2' onClick={toggleReviewForm}>Add Your Thoughts</Link>
                    </div>}


                    {reviewData && <Container>
                        <Typography variant='subtitle1'>
                            Your Reviews:
                        </Typography>
                        {reviewData.map((review) => (
                            <Paper key={`${review.id}`} elevation={6} sx={{ width: '60%', p: 2 }}>
                                {editId !== review.id && <Container>
                                    <Stack spacing={0.5} direction="row" justifyContent="flex-end">
                                        <IconButton onClick={() => toggleEditForm(review.id)} aria-label="delete" size="small">
                                            <EditIcon fontSize="inherit" />
                                        </IconButton>
                                        <IconButton onClick={() => deleteReview(review.id)} aria-label="delete" size="small">
                                            <DeleteIcon fontSize="inherit" />
                                        </IconButton>
                                    </Stack>
                                    <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <Stack spacing={3} sx={{ m: 1, p: 1 }}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Typography>Unread</Typography>
                                                <Switch name='read'
                                                    id='read'
                                                    checked={review.read}
                                                    disabled />
                                                <Typography>Read</Typography>
                                            </Stack>

                                            <Chip label={`Date Started: ${review.date_started}`} variant='outlined' />

                                            <Chip label={`Date Finished: ${review.date_finished}`} variant='outlined' />
                                        </Stack>
                                        <Stack spacing={3} sx={{ m: 1, p: 1 }}>
                                            <Stack direction="row" spacing={0}>
                                                <Typography component="legend">Your Rating:</Typography>
                                                <Rating name="half-rating-read" defaultValue={review.rating} precision={0.5} readOnly />
                                            </Stack>
                                            <Chip label={`Format: ${review.format}`} variant='outlined' />

                                            <Chip label={`Series: ${review.series}`} variant='outlined' />
                                        </Stack>
                                    </Box>

                                    <Typography variant="subtitle1" color="text.secondary">
                                        {review.review}
                                    </Typography>
                                </Container>}

                                {editId === review.id &&
                                    <EditReview reviewData={review} setEditReview={setEditReview} reviewInfo={reviewInfo} setEditId={setEditId} />
                                }
                            </Paper>
                        ))}
                    </Container>}
                </Container>

            </div>}

            {/* {editReview && } */}

        </React.Fragment>
    )
}