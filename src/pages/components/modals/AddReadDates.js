import React, { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import AppContext from '../../../AppContext';
import API from '../../../utils/API'
import {
    Typography, Stack, Box,
    TextField, Button, useMediaQuery, Dialog, DialogTitle, DialogContent, DialogActions, Card, CardContent, CardMedia
} from '@mui/material/';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

import { useTheme } from '@mui/material/styles';


const cardStyle = {
    // maxWidth: 345,
    backgroundColor: 'transparent',
    boxShadow: 0,
}

const imageStyle = {
    boxShadow: '3px 2px 6px #888888',
    maxHeight: 92,
    maxWidth: 61
}

const contentStyle = {
    display: 'flex'
}


export default function AddReadDates({ book, openDates, handleDatesClose, renderReadShelf }) {
    const context = useContext(AppContext);

    const theme = useTheme();
    const smxs = useMediaQuery(theme.breakpoints.down('sm'))
    let navigate = useNavigate()

    const [startValue, setStartValue] = useState(new Date());
    const [endValue, setEndValue] = useState(new Date());

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(`nice, submitted for book id ${book.id}`)
        // const data = new FormData(e.currentTarget)
        let startDate = dayjs(startValue)
        let finishDate = dayjs(endValue)

        const review = {
            public: false,
            date_started: startDate.format('YYYY/MM/DD'),
            date_finished: finishDate.format('YYYY/MM/DD'),
            year_finished: finishDate.year(),
            month_finished: finishDate.month(),
            UserId: context.userData.id,
            BookId: book.id
        }

        try {
            const reviewData = await API.newReview(review)
            console.log(reviewData)
            renderReadShelf(context.userData.id)
            handleDatesClose()
        }
        catch (err) { console.log(err) }
    }

    const handleStartDate = (newValue) => {
        setStartValue(newValue);
    };

    const handleEndDate = (newValue) => {
        setEndValue(newValue);
    };

    return (
        <React.Fragment>
            <Dialog
                fullScreen={smxs}
                open={openDates} onClose={handleDatesClose}>
                <DialogTitle>
                    <Card sx={cardStyle}>
                        <CardContent sx={contentStyle}>
                            <CardMedia
                                component="img"
                                style={imageStyle}
                                onClick={() => { navigate(`/book/${book.id}`) }}
                                image={`${book.cover}`}
                                alt={`${book.title}`}
                            />
                            <Stack sx={{ p: 1 }}>
                                <Typography variant='caption' display='block'>{book.title}</Typography>
                                <Typography variant='caption' color='text.secondary' display='block'>{book.author}</Typography>
                            </Stack>
                        </CardContent>
                    </Card>
                </DialogTitle>
                <Box
                    component='form'
                    noValidate
                    autoComplete='off'
                    onSubmit={handleSubmit}
                >

                    <DialogContent dividers>
                        <Stack spacing={3}>
                            {/* - Date picker for the start date */}
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <MobileDatePicker
                                    label="Date Started"
                                    name='started'
                                    id='started'
                                    value={startValue}
                                    onChange={handleStartDate}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                                <MobileDatePicker
                                    label="Date Finished"
                                    id='finished'
                                    name='finished'
                                    value={endValue}
                                    onChange={handleEndDate}
                                    renderInput={(params) => <TextField {...params} />}
                                />

                                {/* <DesktopDatePicker
                                label="Date Started"
                                name='started'
                                id='started'
                                // inputFormat="MM/dd/yyyy"
                                value={startValue}
                                onChange={handleStartDate}
                                renderInput={(params) => <TextField {...params} />}
                            /> */}
                                {/* - Date picker for date finished */}
                                {/* <DesktopDatePicker
                                label="Date Finished"
                                id='finished'
                                name='finished'
                                value={endValue}
                                onChange={handleEndDate}
                                renderInput={(params) => <TextField {...params} />}
                            /> */}
                            </LocalizationProvider>
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDatesClose}>Cancel</Button>
                        <Button type='submit'>Add Read Dates</Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </React.Fragment>
    )
}