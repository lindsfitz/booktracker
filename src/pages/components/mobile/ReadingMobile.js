import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import SwipeableViews from 'react-swipeable-views';
import { Typography, Box, Card, CardMedia, CardContent, MobileStepper, Button } from '@mui/material';


const imageStyle = {
    boxShadow: '3px 2px 6px #888888',
    height: { xs: 190, md: 218 }, 
    width: { xs: 125, md: 148 },
    m: 2
}

const detailsStyle = {
    display:'flex',
    flexDirection:'column', 
    alignItems: 'flex-start', 
    maxWidth:'50%', 
    justifyContent:'center', 
    ml:1
}

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
                        <CardContent sx={{ display: 'flex', justifyContent:'center' }}>
                            <CardMedia
                                component="img"
                                sx={imageStyle}
                                onClick={() => { navigate(`/book/${book.id}`) }}
                                image={`${book.cover_img}`}
                                alt={`${book.title}`}
                            />
                            <Box sx={detailsStyle}>
                                <Typography variant='subtitle2' display='block'>{book.title}</Typography>
                                <Typography variant='caption' display='block'>{book.author}</Typography>
                                <Button variant='outlined' size='small'>Update Progress</Button>
                                {/* <Button size='small'>Mark Read</Button> */}

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