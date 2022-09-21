import React, { useState } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { useNavigate } from "react-router-dom";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { Box, Typography, Container, Button, Card, CardMedia, CardContent, IconButton, MobileStepper } from '@mui/material';


export default function BCMobile({ shelfId, books }) {
    let navigate = useNavigate()

    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepChange = (step) => {
        setActiveStep(step);
    };

    return (
        <React.Fragment>
            <Container>
                <Box sx={{ display: 'flex', width: '100%' }}>
                    {books.slice(0, 3).map(book => (
                        <Card key={`${shelfId}${book.id}`} id={`${shelfId}${book.id}`} sx={{ maxWidth: 200, textAlign: 'center', bgcolor: 'transparent' }} className='book-card'>
                            <CardContent className='book-card'>
                                <CardMedia
                                    component="img"
                                    sx={{ maxHeight: 218, maxWidth: 148 }}
                                    onClick={() => { navigate(`/book/${book.id}`) }}
                                    image={`${book.cover_img}`}
                                    alt={`${book.title}`}
                                />
                                <Typography variant='subtitle2' display='block'>{book.title}</Typography>
                                <Typography variant='caption' display='block'>{book.author}</Typography>
                            </CardContent>
                        </Card>
                    ))}
                    <Button variant='outlined' sx={{ color: '#9da283', border: '#939876 1px solid' }}
                            onClick={() => navigate(`/shelf/${shelfId}`)}>Shelf Details</Button>
                </Box>

                {/* <SwipeableViews
                    index={activeStep}
                    style={{ width: '100%' }}
                    onChangeIndex={handleStepChange}
                    enableMouseEvents>
                    <Box sx={{ display: 'flex', width: '100%' }}>
                        {books.slice(0, 3).map(book => (
                            <Card key={`${shelfId}${book.id}`} id={`${shelfId}${book.id}`} sx={{ maxWidth: 200, textAlign: 'center', bgcolor: 'transparent' }} className='book-card'>
                                <CardContent className='book-card'>
                                    <CardMedia
                                        component="img"
                                        sx={{ maxHeight: 218, maxWidth: 148 }}
                                        onClick={() => { navigate(`/book/${book.id}`) }}
                                        image={`${book.cover_img}`}
                                        alt={`${book.title}`}
                                    />
                                    <Typography variant='subtitle2' display='block'>{book.title}</Typography>
                                    <Typography variant='caption' display='block'>{book.author}</Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                    <Box sx={{ display: 'flex', width: '100%' }}>
                        {books.slice(3, 5).map(book => (
                            <Card key={`${shelfId}${book.id}`} id={`${shelfId}${book.id}`} sx={{ maxWidth: 200, textAlign: 'center', bgcolor: 'transparent' }} className='book-card'>
                                <CardContent className='book-card'>
                                    <CardMedia
                                        component="img"
                                        sx={{ maxHeight: 218, maxWidth: 148 }}
                                        onClick={() => { navigate(`/book/${book.id}`) }}
                                        image={`${book.cover_img}`}
                                        alt={`${book.title}`}
                                    />
                                    <Typography variant='subtitle2' display='block'>{book.title}</Typography>
                                    <Typography variant='caption' display='block'>{book.author}</Typography>
                                </CardContent>
                            </Card>
                        ))}
                        
                    </Box>
                </SwipeableViews>
                <MobileStepper
                    steps={2}
                    position="static"
                    activeStep={activeStep}
                    nextButton={
                        <IconButton size="small"
                            onClick={handleNext}
                            disabled={activeStep === 1}>
                            <NavigateNextIcon /></IconButton>
                    }
                    backButton={
                        <IconButton size="small" onClick={handleBack} disabled={activeStep === 0}>
                            <NavigateBeforeIcon /></IconButton>
                    }
                /> */}
            </Container>

        </React.Fragment>
    )
}