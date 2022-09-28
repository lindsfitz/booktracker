import React, { useState } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { useNavigate } from "react-router-dom";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { Box, Typography, Container, Button, Card, CardMedia, CardContent, IconButton, MobileStepper } from '@mui/material';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import "@splidejs/splide/dist/css/themes/splide-default.min.css";


export default function Carousel({ shelf }) {

    let navigate = useNavigate()

    const cardStyle = {
        width: { xs: 130, sm: 158 },
        backgroundColor: 'transparent',
        boxShadow: 0,
        display:'flex',
        flexDirection:'column',
        alignItems: 'center',
        textAlign:'center'
    }

    const imageStyle = {
        boxShadow: '3px 2px 6px #888888',
        height: { xs: 183, sm: 218 },
        width: { xs: 120, sm: 148 }
    }

    const btnStyle = {
        height: { xs: 183, sm: 218 },
        width: { xs: 110, sm: 130 },
        color: '#9da283',
        border: '#939876 1px solid'
    }

    return (
        <React.Fragment>
            {/* <Typography variant='subtitle2'>{shelf.name}</Typography> */}

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
                            gap:1,
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
                            <CardContent className='book-card'>
                                <CardMedia
                                    component="img"
                                    sx={imageStyle}
                                    onClick={() => { navigate(`/book/${book.id}`) }}
                                    image={`${book.cover_img}`}
                                    alt={`${book.title}`}
                                />
                                <Typography variant='caption' display='block'>{book.title}</Typography>
                                <Typography variant='caption' color='text.secondary' display='block'>{book.author}</Typography>
                            </CardContent>
                        </Card>
                    </SplideSlide>
                ))}

                {shelf.id !== 'CR' && <SplideSlide>
                    <Card sx={cardStyle}>
                        <CardContent>
                            <Button variant='outlined' sx={btnStyle}
                                onClick={() => navigate(`/shelf/${shelf.id}`)}>Shelf Details</Button>
                        </CardContent>
                    </Card>
                </SplideSlide>}

            </Splide>

        </React.Fragment>
    )

}