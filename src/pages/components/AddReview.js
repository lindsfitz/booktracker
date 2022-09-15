import React, { useState, useContext } from 'react';
import { useParams } from "react-router-dom";
import AppContext from '../../AppContext';
import API from '../../utils/API'
import { Typography, FormControl, Rating, Stack, Switch, Box, TextField, Button } from '@mui/material/';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';


export default function AddReview({reviewInfo, toggleReviewForm}) {

    const context = useContext(AppContext);
    const params = useParams();

    const [startValue, setStartValue] = useState(new Date());
    const [endValue, setEndValue] = useState(new Date());

    const [readSwitch, setReadSwitch] = useState(false);

    const handleSwitch = (event) => {
        setReadSwitch(event.target.checked);
    };


    const handleStartDate = (newValue) => {
        setStartValue(newValue);
    };

    const handleEndDate = (newValue) => {
        setEndValue(newValue);
    };

    const reviewSubmit = async (e) => {
        e.preventDefault();
        console.log('submitted')
        let newReview;
        const data = new FormData(e.currentTarget)
        let startDate = dayjs(startValue)
        let finishDate = dayjs(endValue)
        if (readSwitch) {
            newReview = {
                read: readSwitch,
                date_started: startDate.format('YYYY/MM/DD'),
                date_finished: finishDate.format('YYYY/MM/DD'),
                year_finished: finishDate.year(),
                month_finished: finishDate.month(),
                last_update: new Date(),
                rating: data.get('rating'),
                review: data.get('review'),
                format: data.get('format'),
                series: data.get('series'),
                UserId: context.userData.id,
                BookId: params.id
            }
        }
        if (!readSwitch) {
            newReview = {
                read: readSwitch,
                last_update: new Date(),
                review: data.get('review'),
                UserId: context.userData.id,
                BookId: params.id
            }
        }
        console.log(newReview)

        const reviewData = await API.newReview(newReview)
        console.log(reviewData)
        reviewInfo()
        toggleReviewForm();
    }

    return (

        <React.Fragment>
            <Box
                component="form"
                sx={{ m: 1, width: '50%' }}
                noValidate
                autoComplete="off"
                onSubmit={reviewSubmit}
            >

                <Stack direction="row" spacing={4} alignItems="center" justifyContent="center">


                    <Stack spacing={3} alignItems="center" justifyContent="center">

                        {/* For the review form I need:
                    - Toggle for True/False if they are marking the book as read or unread */}

                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography>Unread</Typography>
                            <Switch name='read'
                                id='read'
                                checked={readSwitch}
                                onChange={handleSwitch}
                                inputProps={{ 'aria-label': 'controlled' }} />
                            <Typography>Read</Typography>
                        </Stack>

                        {readSwitch && <Stack spacing={3}>
                            {/* - Date picker for the start date */}
                            <LocalizationProvider dateAdapter={AdapterDayjs}>

                                <DesktopDatePicker
                                    label="Date Started"
                                    name='started'
                                    id='started'
                                    // inputFormat="MM/dd/yyyy"
                                    value={startValue}
                                    onChange={handleStartDate}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                                {/* - Date picker for date finished */}
                                <DesktopDatePicker
                                    label="Date Finished"
                                    id='finished'
                                    name='finished'
                                    value={endValue}
                                    onChange={handleEndDate}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                        </Stack>
                        }
                    </Stack>

                    {readSwitch && <Stack spacing={3} >
                        <Stack direction="row" spacing={0}>
                            <Typography component="legend">Your Rating:</Typography>
                            <Rating name="rating" id='rating' defaultValue={0} precision={0.5} />
                        </Stack>

                        {/* - Dropdown menu for the format 
                    - Ebook, hard copy */}
                        {/* - Or maybe a text field for format, not sure yet */}
                        <TextField
                            name='format'
                            id="format"
                            label="Format"
                            defaultValue="Kindle EBook"
                        />
                        {/* - Textfield for Series? */}
                        <TextField
                            name='series'
                            id="series"
                            label="Series Details"
                            defaultValue="Series Name #2"
                        />
                    </Stack>}

                </Stack>



                {/* - Textbox for the actual review */}
                <FormControl fullWidth sx={{ m: 1 }}>

                    <TextField
                        id="review"
                        name='review'
                        label={readSwitch ? 'Review' : 'Notes'}
                        multiline
                        rows={10}

                    />
                </FormControl>

                <Button type='submit'>Add Review</Button>

            </Box>

        </React.Fragment>
    )
}