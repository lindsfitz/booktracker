import React from 'react';
import {
    Card,
    CardContent, CardMedia, Typography, Box, Paper, Divider, Stack
} from '@mui/material';

const cardStyle = {
    maxWidth: { xs: 250, md: 345 },
    minWidth: { xs: 240 },
    alignSelf: 'center',
    backgroundColor: 'transparent',
    boxShadow: 0,
}

const imageStyle = {
    boxShadow: '3px 2px 6px #888888',
}

export default function BookInfo({ book }) {

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
            <Box sx={{ maxWidth: { xs: 1 / 1, md: 3 / 5 }, p: 4 }}>
                <Box sx={{textAlign:'center'}}>
                    <Typography gutterBottom variant="h5" component="div">
                        {book.title}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                        by {book.author}
                    </Typography>
                    <Divider />
                    <Stack direction='row' spacing={3} sx={{justifyContent:'center'}} >
                        <Typography variant="caption" color="text.secondary">
                            Pages: {book.pages}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Published: {book.published}
                        </Typography>
                    </Stack>
                    <Divider />
                </Box>
                <Typography variant='body2'>
                    {book.description}
                </Typography>
            </Box>

        </Paper>

    )
}