import React from 'react';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Box, Typography, Badge, Card, CardMedia, CardContent } from '@mui/material';
import { Splide, SplideSlide, SplideTrack } from '@splidejs/react-splide';


export default function NYTMobile({ bestSellers, nytSearch }) {

    return (
        <React.Fragment>
            <Box sx={{ display: { xs: 'block', md: 'none' }, width: 1 / 1, mb: '65px' }}>
                <Splide hasTrack={false}
                    options={{
                        rewind: false,
                        perPage: 3,
                        perMove: 3,
                        gap: 0,
                        snap: true,
                        pagination: true,
                        fixedWidth: 125,
                        drag: 'free',
                        width: '100%',
                        start: 0,

                    }}
                >
                    <div className="custom-wrapper">
                        <SplideTrack>
                            {bestSellers.map(book => (
                                <SplideSlide key={book.title}>

                                    <Card key={book.primary_isbn13} sx={{ minWidth: 110, maxWidth: 120 }}>
                                        <CardContent sx={{ wordWrap: 'break-word' }}>
                                            <Badge anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'left',
                                            }}
                                                badgeContent={book.rank} color="primary">
                                                <CardMedia
                                                    component="img"
                                                    onClick={() => nytSearch(book.primary_isbn13, book.title, book.author)}
                                                    // sx={{ maxHeight: { xs: 190, md: 218 }, maxWidth: { xs: 125, md: 148 } }}
                                                    height='140'
                                                    image={`${book.book_image}`}
                                                    alt={`${book.title}`}
                                                />
                                            </Badge>
                                            <Typography variant='caption' sx={{ fontWeight: 'bold' }}>{book.title}</Typography>
                                            <br />
                                            <Typography variant='caption' color='text.secondary'>{book.author}</Typography>
                                            <br />
                                            <Typography variant='caption'>Weeks on List: {book.weeks_on_list}</Typography>
                                        </CardContent>
                                    </Card>
                                </SplideSlide>
                            ))}
                        </SplideTrack>

                        <div className="splide__arrows">
                            <button style={{ top: '96%' }} className="splide__arrow splide__arrow--prev"><NavigateNextIcon /></button>
                            <button style={{ top: '96%' }} className="splide__arrow splide__arrow--next"><NavigateNextIcon /></button>
                        </div>
                    </div>
                </Splide>
            </Box>
        </React.Fragment>
    )
}