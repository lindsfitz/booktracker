import React, { useState, useRef, useEffect } from 'react';
import dayjs from 'dayjs'
import {
    Rating, Typography, Box, Container,Stack,  Button
} from '@mui/material';


const clampedStyle = {
    height: 230,
    overflow: 'hidden',
    textOverflow: 'ellipsis'
}

const unclampedStyle = {
    height: 'fit-content'
}



export default function PublicReview({ review }) {

    const [clamp, setClamp] = useState(true);
    const [overflowActive, setOverflowActive] = useState(null)
    const reviewRef = useRef(null)

    const isOverflowActive = (e) => {
        return e.offsetHeight < e.scrollHeight || e.offsetWidth < e.scrollWidth;
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
        <Container key={review.id} sx={{ width: { xs: 1 / 1, sm: 3 / 4, md: 3 / 5 }, p: 2, m: '4 0' }}>
            <Box sx={{ p: 2, mt: 1 }}>
                <Box sx={{ textAlign: 'center' }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, md: 3 }} alignItems='center' justifyContent="center">
                        <Stack direction='row' alignItems='center' spacing={3}>
                            <Typography variant='caption' color='success.main'>{review.ProfileName}</Typography>
                            <Stack direction="row" spacing={0} alignItems="center">
                                <Typography component="legend" variant='caption'>Rated It:</Typography>
                                <Rating name="half-rating-read" defaultValue={review.rating} precision={0.5} readOnly />
                            </Stack>
                        </Stack>
                        <Typography variant='caption'>On {dayjs(review.createdAt).format('MMMM D, YYYY')}</Typography>
                    </Stack>

                    {/* <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, md: 3 }} justifyContent='center' sx={{ m: 1, p: 1 }}>
                            {review.format && <Chip label={`Format: ${review.format}`} variant='outlined' />}
                            {review.series && <Chip label={`Series: ${review.series}`} variant='outlined' />}
                        </Stack> */}
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

        </Container>
    )
}