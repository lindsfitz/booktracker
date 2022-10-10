import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import SwipeableViews from 'react-swipeable-views';
import { Typography, Box, Card, CardMedia, CardContent, MobileStepper } from '@mui/material';


export default function ReadingMobile({ currentReads }) {
    let navigate = useNavigate();

    const [activeStep, setActiveStep] = useState(0)

    const handleChangeIndex = (index) => {
        setActiveStep(index)
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 10 }}>
            <SwipeableViews
                index={activeStep}
                onChangeIndex={handleChangeIndex}
                enableMouseEvents>
                {currentReads.map((book) => (
                    <Card key={`${book.id}`} className='book-card'>
                        <CardContent sx={{ display: 'flex' }}>
                            <CardMedia
                                component="img"
                                sx={{ maxHeight: { xs: 190, md: 218 }, maxWidth: { xs: 125, md: 148 } }}
                                onClick={() => { navigate(`/book/${book.id}`) }}
                                image={`${book.cover_img}`}
                                alt={`${book.title}`}
                            />
                            <Box sx={{ m: 'auto', alignItems: 'center' }}>
                                <Typography variant='subtitle2' display='block'>{book.title}</Typography>
                                <Typography variant='caption' display='block'>{book.author}</Typography>
                            </Box>
                        </CardContent>
                    </Card>

                ))}
            </SwipeableViews>
            <MobileStepper
                variant="dots"
                steps={currentReads.length}
                position="static"
                activeStep={activeStep}
                sx={{ flexGrow: 1, bgcolor: 'transparent' }}
            />
        </Box>
    )
}