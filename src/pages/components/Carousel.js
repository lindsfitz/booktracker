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

    return (
        <React.Fragment>
            {/* <Typography variant='subtitle2'>{shelf.name}</Typography> */}

            <Splide
                options={{
                    rewind: false,
                    perPage: 5,
                    perMove: 5,
                    gap: 5,
                    padding: "3rem",
                    pagination: false,
                    arrows: false,
                    fixedWidth: 200,
                    drag: 'free',
                    width:'100%',
                    breakpoints: {
                        600: {
                            fixedWidth: 130,
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
                onMounted={() => {
                    console.log("mounted");
                }}
                onUpdated={() => {
                    console.log("updated");
                }}
                onMoved={() => {
                    console.log("moved");
                }}
                onVisible={(splide, slide) => {
                    console.log("visible", slide.index);
                }}
            >


                {shelf.Books.map((book) => (
                    <SplideSlide key={book.title}>
                        <Card key={`${shelf.id}${book.id}`} id={`${shelf.id}${book.id}`} sx={{ width: {xs:130, sm:200}, textAlign: 'center', bgcolor: 'transparent' }} className='book-card'>
                            <CardContent className='book-card'>
                                <CardMedia
                                    component="img"
                                    sx={{ height: {xs:183,sm:218}, width: {xs:120, sm:148} }}
                                    onClick={() => { navigate(`/book/${book.id}`) }}
                                    image={`${book.cover_img}`}
                                    alt={`${book.title}`}
                                />
                                <Typography variant='subtitle2' display='block'>{book.title}</Typography>
                                <Typography variant='caption' display='block'>{book.author}</Typography>
                            </CardContent>
                        </Card>
                    </SplideSlide>
                ))}

            </Splide>

        </React.Fragment>
    )

}