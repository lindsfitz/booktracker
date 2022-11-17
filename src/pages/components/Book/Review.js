import React, { useState, useRef, useEffect } from 'react';
import API from '../../../utils/API'
import dayjs from 'dayjs'
import {
    Rating, Typography, Box, Container, Paper, Switch, Stack, Chip, IconButton, Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EditReview from '../modals/EditReview';

const clampedStyle = {
    height: 230,
    overflow: 'hidden',
    textOverflow: 'ellipsis'
}

const unclampedStyle = {
    height: 'fit-content'
}



export default function Review({ review, reviewInfo, openSnackbar, bookId }) {

    const [editReview, setEditReview] = useState(false);
    const [editId, setEditId] = useState(null);
    const [clamp, setClamp] = useState(true);
    const [overflowActive, setOverflowActive] = useState(null)
    const reviewRef = useRef(null)

    const isOverflowActive = (e) => {
        return e.offsetHeight < e.scrollHeight || e.offsetWidth < e.scrollWidth;
    }

    const toggleEditForm = (id) => {
        setEditId(id)
        setEditReview(!editReview)
    }

    const deleteReview = async (id) => {
        await API.deleteReview(id)
        openSnackbar('Review Removed')
        reviewInfo()
    }

    useEffect(() => {
        if (review.review) {
            if (isOverflowActive(reviewRef.current)) {
                setOverflowActive(true);
                setClamp(true)
                return;
            }
            setOverflowActive(false)
            setClamp(null)
        }
    }, [overflowActive])

    return (
      
        <React.Fragment>
            {editId !== review.id && <Container sx={{ width: { xs: 1 / 1, sm: 3 / 4, md: 3 / 5 }, p: 2, m: '4 0' }}>
                <Stack direction='row' justifyContent="space-between">
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant='caption'>Private</Typography>
                        <Switch name='read'
                            color='secondary'
                            id='read'
                            checked={review.public}
                            size='small'
                            disabled />
                        <Typography variant='caption'>Public</Typography>
                    </Stack>

                    <Stack spacing={0.5} direction="row" alignItems="center">
                        <IconButton onClick={() => toggleEditForm(review.id)} aria-label="edit" size="small">
                            <EditIcon color='success' fontSize="inherit" />
                        </IconButton>
                        <IconButton onClick={() => deleteReview(review.id)} aria-label="delete" size="small">
                            <DeleteIcon color='success' fontSize="inherit" />
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

                    {review.review && <Stack>
                        <Typography ref={reviewRef} sx={clamp ? clampedStyle : unclampedStyle} variant="subtitle1" color="text.secondary">
                            {review.review}
                        </Typography>



                        {overflowActive &&
                            <React.Fragment>
                                {clamp ? <Button onClick={() => setClamp(false)} size='small'>See More</Button> : <Button onClick={() => setClamp(true)} size='small'>Hide</Button>}
                            </React.Fragment>
                        }
                    </Stack>
                    }
                </Box>

            </Container>}

            {editId === review.id &&
                <EditReview type={'review'} reviewData={review} setEditReview={setEditReview} reviewInfo={reviewInfo} setEditId={setEditId} bookId={bookId} />
            }
        </React.Fragment>
    )
}