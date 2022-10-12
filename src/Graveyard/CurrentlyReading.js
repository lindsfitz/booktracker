import React from 'react';
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Card, CardMedia, CardContent } from '@mui/material';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import "@splidejs/splide/dist/css/themes/splide-default.min.css";


export default function CurrentlyReading({ books }) {

    let navigate = useNavigate()

    const cardStyle = {
        width: 300,
        backgroundColor: 'transparent',
        boxShadow: 0,
       
        textAlign: 'center'
    }

    const cardContentStyle = {
        display:'flex', 
        flexDirection:'column',
        padding:2,
        justifyContent:'center'
    }

    const imageStyle = {
        boxShadow: '3px 2px 6px #888888',
        height: 218,
        width: 148
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
                    fixedWidth: 300,
                    drag: 'free',
                    width: '100%',
                    start: 0,
                    breakpoints: {
                        600: {
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

                {books.map((book) => (
                    <SplideSlide key={book.title}>
                        <Card key={book.id} sx={cardStyle} className='book-card'>
                            <CardContent sx={{display:'flex'}}
                            className='book-card'>
                                <CardMedia
                                    component="img"
                                    sx={imageStyle}
                                    onClick={() => { navigate(`/book/${book.id}`) }}
                                    image={`${book.cover_img}`}
                                    alt={`${book.title}`}
                                />
                                <Box sx={cardContentStyle}>
                                    <Typography variant='caption' display='block'>{book.title}</Typography>
                                    <Typography variant='caption' color='text.secondary' display='block'>{book.author}</Typography>
                                    <Button variant='outlined' size='small'>Update Progress</Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </SplideSlide>
                ))}
            </Splide>

        </React.Fragment>
    )

}