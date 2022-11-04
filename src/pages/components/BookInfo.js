import React, { useState, useRef, useEffect } from 'react';
import {
    Card,
    CardContent, CardMedia, Typography, Box, Paper, Divider, Stack, Link, Button
} from '@mui/material';

const cardStyle = {
    maxWidth: { xs: 220, md: 345 },
    minWidth: { xs: 200, md: 240 },
    alignSelf: 'center',
    backgroundColor: 'transparent',
    boxShadow: 0,
}

const imageStyle = {
    boxShadow: '3px 2px 6px #888888',
}

const clampedStyle = {
    height: 200,
    overflow: 'hidden',
    textOverflow: 'ellipsis'
}

const unclampedStyle = {
    height: 'fit-content'
}

export default function BookInfo({ book }) {

    const [clamp, setClamp] = useState(true);
    const [overflowActive, setOverflowActive] = useState(null)
    const reviewRef = useRef(null)


    const isOverflowActive = (e) => {
        return e.offsetHeight < e.scrollHeight || e.offsetWidth < e.scrollWidth;
    }

    useEffect(() => {
        if (isOverflowActive(reviewRef.current)) {
            setOverflowActive(true);
            setClamp(true)
            return;
        }
        setOverflowActive(false)
        setClamp(null)
    }, [overflowActive])

    return (
        <Paper
            sx={{
                display: "flex", flexDirection: { xs: 'column', md: 'row' },
                m: { xs: 1, md: 3 }, p: { xs: 0, md: 2 }
            }}>
            <Card sx={cardStyle} >
                <CardContent>
                    <CardMedia
                        component="img"
                        sx={imageStyle}
                        image={`${book.cover_img}`}
                        alt={`${book.title}`}
                    />
                </CardContent>
            </Card>
            <Box sx={{ maxWidth: { xs: 1 / 1, md: 3 / 5 }, p: 4, mt: 0 }}>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography gutterBottom variant="h5" component="div">
                        {book.title}
                    </Typography>
                    <Typography gutterBottom variant="subtitle2" color="text.secondary">
                        by {book.author}
                    </Typography>
                    <Divider />
                    <Stack direction='row' spacing={3} sx={{ justifyContent: 'center', p:0.5, }} >
                        <Typography variant="caption" color="text.secondary">
                            Pages: {book.pages}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Published: {book.published}
                        </Typography>
                    </Stack>
                    <Divider />
                </Box>
                <Box sx={{ py: 2, px:{ xs: 1, sm: 4 }}}>
                    {/* Add in 'clamp' here for description -- if content is longer that max height of the box, 'clamp' and add read more link to expand  */}
                    <Typography ref={reviewRef} sx={clamp ? clampedStyle : unclampedStyle} variant='body2'>
                        {book.description}
                    </Typography>
                    {overflowActive &&
                        <Box sx={{display:'flex',justifyContent:'center'}}>
                            {clamp ? <Button color='success' onClick={() => setClamp(false)} size='small'>See More</Button> : <Button color='success' onClick={() => setClamp(true)} size='small'>Hide</Button>}
                        </Box>
                    }
                </Box>
            </Box>

        </Paper>

    )
}