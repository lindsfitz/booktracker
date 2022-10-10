import React, { useState } from 'react';
import API from '../../utils/API'
import dayjs from 'dayjs'
import {
    Rating, Typography, Box, Container, Paper, Switch, Stack, Chip, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EditReview from './modals/EditReview';



export default function Review({ review, reviewInfo, openSnackbar }) {

    const [editReview, setEditReview] = useState(false);
    const [editId, setEditId] = useState(null);

    const toggleEditForm = (id) => {
        setEditId(id)
        setEditReview(!editReview)
    }

    const deleteReview = async (id) => {
        await API.deleteReview(id)
        openSnackbar('Review Removed')
        reviewInfo()
    }

    return (
        <Paper key={review.id} elevation={6} sx={{ width: { xs: 3 / 4, md: 3 / 5 }, p: 2 }}>
            {editId !== review.id && <Container>
                <Stack direction='row' justifyContent="space-between">
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant='caption'>Unread</Typography>
                        <Switch name='read'
                            id='read'
                            checked={review.read}
                            size='small'
                            disabled />
                        <Typography variant='caption'>Read</Typography>
                    </Stack>

                    <Stack spacing={0.5} direction="row" alignItems="center">
                        <IconButton onClick={() => toggleEditForm(review.id)} aria-label="delete" size="small">
                            <EditIcon fontSize="inherit" />
                        </IconButton>
                        <IconButton onClick={() => deleteReview(review.id)} aria-label="delete" size="small">
                            <DeleteIcon fontSize="inherit" />
                        </IconButton>
                    </Stack>
                </Stack>

                <Box sx={{ p: 2, mt: 1 }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, md: 3 }} alignItems='center' justifyContent="center">
                            <Stack direction="row" spacing={0} alignItems="center">
                                <Typography component="legend" variant='caption'>Rated It:</Typography>
                                <Rating name="half-rating-read" defaultValue={review.rating} precision={0.5} readOnly />
                            </Stack>
                            <Typography variant='caption'>On {dayjs(review.last_update).format('MMMM D, YYYY')}</Typography>
                        </Stack>

                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, md: 3 }} justifyContent='center' sx={{ m: 1, p: 1 }}>
                            {review.format && <Chip label={`Format: ${review.format}`} variant='outlined' />}
                            {review.series && <Chip label={`Series: ${review.series}`} variant='outlined' />}
                        </Stack>
                        {review.date_started && review.date_finished &&
                            <Typography variant='caption'>Read From: {dayjs(review.date_started).format('MMM D, YYYY')} - {dayjs(review.date_finished).format('MMM D, YYYY')}</Typography>}
                    </Box>

                    {review.review && <Typography variant="subtitle1" color="text.secondary">
                        {review.review}
                    </Typography>}
                </Box>

            </Container>}

            {editId === review.id &&
                <EditReview reviewData={review} setEditReview={setEditReview} reviewInfo={reviewInfo} setEditId={setEditId} />
            }
        </Paper>
    )
}