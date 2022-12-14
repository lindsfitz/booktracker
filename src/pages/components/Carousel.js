import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Card, CardMedia, CardContent, Tooltip, Stack } from '@mui/material';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import "@splidejs/splide/dist/css/themes/splide-default.min.css";
import ReadingProgress from './modals/ReadingProgress';
import ProgressBar from './mini-components/ProgressBar';

const cardStyle = {
    width: { xs: 130, sm: 158 },
    backgroundColor: 'transparent',
    boxShadow: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center'
}

const imageStyle = {
    boxShadow: '3px 2px 6px #888888',
    height: { xs: 183, sm: 218 },
    width: { xs: 120, sm: 148 },
    '&:hover': {
        cursor: 'pointer'
    }
}

const detailBoxStyling = {
    width: { xs: 110, sm: 138 },
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
}

const btnStyle = {
    height: { xs: 183, sm: 218 },
    width: { xs: 110, sm: 130 },
    color: '#9da283',
    border: '#939876 1px solid'
}



export default function Carousel({ shelf }) {

    let navigate = useNavigate()

    const [openProgress, setOpenProgress] = useState(false)
    const [bookProgress, setBookProgress] = useState(null)


    const handleOpenProgress = (book) => {
        setOpenProgress(true)
        setBookProgress({
            id: book.id,
            title: book.title,
            author: book.author,
            cover: book.cover_img,
            pages: book.pages
        })
    }

    const handleCloseProgress = () => {
        setOpenProgress(false)
    }

    const calcProgress = (book) => {
        if (book.Notes.length) {
            const noteProg = book.Notes[0].progress;

            if (noteProg.includes('/')) {
                const values = noteProg.split('/')
                const prog = (values[0]) / (values[1]) * 100

                return (<ProgressBar progress={prog} />)
            }

            if (noteProg.includes('%')) {
                const prog = parseInt(noteProg.replace('%', ''))

                return (<ProgressBar progress={prog} />)
            }
        }
    }



    return (
        <React.Fragment>
            <Splide
                options={{
                    rewind: false,
                    perPage: 5,
                    perMove: 5,
                    gap: 2,
                    pagination: false,
                    arrows: false,
                    fixedWidth: 158,
                    drag: 'free',
                    width: '100%',
                    start: 0,
                    breakpoints: {
                        600: {
                            fixedWidth: 130,
                            gap: 1,
                            perPage: 2,
                            perMove: 2
                        },
                        935: {
                            perPage: 3,
                            perMove: 3
                        },
                        1247: {
                            perPage: 4,
                            perMove: 4
                        }
                    }
                }}
            >

                {shelf.Books.map((book) => (
                    <SplideSlide key={book.title}>
                        <Card key={`${shelf.id}${book.id}`} id={`${shelf.id}${book.id}`} sx={cardStyle} className='book-card'>
                            <CardContent
                                className='book-card'>
                                <CardMedia
                                    component="img"
                                    sx={imageStyle}
                                    onClick={() => { navigate(`/book/${book.id}`) }}
                                    image={`${book.cover_img}`}
                                    alt={`${book.title}`}
                                />
                                <Box sx={detailBoxStyling}>
                                    <Typography variant='caption' display='block'>{book.title}</Typography>
                                    <Typography variant='caption' color='text.secondary' display='block'>{book.author}</Typography>
                                    <br />
                                    {shelf.id === 'CR' &&
                                        <Stack spacing={1}>
                                            {calcProgress(book)}
                                            <Button onClick={() => handleOpenProgress(book)} variant='outlined' color='success' size='small'>Update Progress</Button>
                                        </Stack>
                                    }
                                </Box>
                            </CardContent>
                        </Card>
                    </SplideSlide>
                ))}

                {shelf.id !== 'CR' && <SplideSlide>
                    <Card sx={cardStyle}>
                        <CardContent>
                            <Tooltip title={`More About ${shelf.name}`}>
                                <Button variant='outlined' sx={btnStyle}
                                    onClick={() => navigate(`/shelf/${shelf.id}`)}>Shelf Details</Button>
                            </Tooltip>
                        </CardContent>
                    </Card>
                </SplideSlide>}

            </Splide>

            {openProgress && <ReadingProgress book={bookProgress} open={openProgress} handleClose={handleCloseProgress} />}
        </React.Fragment>
    )

}