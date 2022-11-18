import React, { useState, useContext } from 'react';
import { useParams } from "react-router-dom";
import AppContext from '../../../AppContext';
import API from '../../../utils/API'
import { Typography, FormControl, Rating, Stack, Switch, Box, TextField, FormHelperText, Button, Autocomplete } from '@mui/material/';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

const options = [
    { label: '0', val: 0 },
    { label: '0.5', val: 0.5 },
    { label: '1', val: 1 },
    { label: '1.5', val: 1.5 },
    { label: '2', val: 2 },
    { label: '2.5', val: 2.5 },
    { label: '3', val: 3 },
    { label: '3.5', val: 3.5 },
    { label: '4', val: 4 },
    { label: '4.5', val: 4.5 },
    { label: '5', val: 5 }
]

// const labels = {
//     0: '0',
//     0.5: '0.5',
//     1: '1',
//     1.5: '1.5',
//     2: '2',
//     2.5: '2.5',
//     3: '3',
//     3.5: '3.5',
//     4: '4',
//     4.5: '4.5',
//     5: '5',
// }

export default function AddReview({ reviewInfo, toggleReviewForm, bookId, addBook }) {

    const context = useContext(AppContext);
    const params = useParams();

    const [startValue, setStartValue] = useState(new Date());
    const [endValue, setEndValue] = useState(new Date());
    const [addDates, setAddDates] = useState(false);
    const [onPublic, setOnPublic] = useState(false);
    const [rating, setRating] = useState(0);
    const [inputRating, setInputRating] = useState(options[0])


    const toggleDates = () => {
        setAddDates(!addDates)
    }

    const handleStartDate = (newValue) => {
        setStartValue(newValue);
        setEndValue(newValue)
    };

    const handleEndDate = (newValue) => {
        setEndValue(newValue);
    };

    const handleSwitch = (event) => {
        setOnPublic(event.target.checked);
    };

    const handleRating = (event) => {
        setRating(event.target.value)
    }

    const reviewSubmit = async (e) => {
        e.preventDefault();
        console.log('submitted')
        let id;
        if (bookId) {
            id = bookId
        } else {
            console.log('no existing book')
            try {
                const book = await addBook();
                id = book.data.id
            } catch (err) { console.log(err) }
        }
        const data = new FormData(e.target)
        let startDate = dayjs(startValue)
        let finishDate = dayjs(endValue)

        const newReview = {
            date_started: addDates ? startDate.format('YYYY/MM/DD') : null,
            date_finished: addDates ? finishDate.format('YYYY/MM/DD') : null,
            year_finished: finishDate.year(),
            month_finished: finishDate.month(),
            public: onPublic,
            rating: data.get('rating'),
            review: data.get('review'),
            format: data.get('format'),
            series: data.get('series'),
            UserId: context.userData.id,
            BookId: id
        }
        try {
            await API.removeCurrentlyReading(context.userData.id, id)
            await API.removeFromDNF(context.userData.id, id)
            await API.addRead({
                userId: context.userData.id,
                bookId: id
            })
            const reviewData = await API.newReview(newReview)
            console.log(reviewData)
        } catch (err) { console.log(err) }

        reviewInfo()
        toggleReviewForm();
    }

    return (

        <React.Fragment>
            <Box
                component="form"
                sx={{ m: 1, width: { xs: 1 / 1, md: 1 / 2 }, mb: '80px' }}
                noValidate
                autoComplete="off"
                onSubmit={reviewSubmit}
            >

                <Stack spacing={3} alignItems="center" justifyContent="center">

                    <Stack alignItems="center" justifyContent="center"
                        direction={{ xs: "column", sm: 'row' }} spacing={{xs: 3, sm:10}}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant='caption'>Private</Typography>
                            <Switch name='public'
                                id='public'
                                size='small'

                                onChange={handleSwitch}
                                checked={onPublic}
                                inputProps={{ 'aria-label': 'controlled' }} />
                            <Typography variant='caption'>Public</Typography>
                        </Stack>

                        <Stack alignItems="center" direction="row" spacing={1}>
                            <Typography variant='caption' component="legend">Your Rating:</Typography>
                            <FormControl>
                                <Autocomplete
                                    id="ratingInput"
                                    options={options}
                                    size='small'
                                    disableClearable
                                    freeSolo
                                    sx={{ minWidth: 75 }}
                                    value={inputRating}
                                    onChange={(event, newValue) => {
                                        setInputRating(newValue)
                                        setRating(newValue.val);
                                    }}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </FormControl>
                        </Stack>

                    </Stack>
                    <Rating name="rating" id='rating'
                        value={rating}
                        readOnly
                        // onChange={(event, newValue) => {
                        //     setRating(newValue);
                        // }}
                        precision={0.5} />

                    {/* <Typography>{labels[rating]}</Typography> */}

                    {addDates ? <Stack justifyContent="center" spacing={0.5}>
                        <Stack alignItems="center" justifyContent="center" direction='row' spacing={5}>
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
                        <Button size='small' onClick={toggleDates}>Hide Dates</Button>
                    </Stack> : <Button onClick={toggleDates}>Add Read Dates</Button>}



                    <Stack alignItems="center" justifyContent="center" direction='row' spacing={5} >
                        {/* - Dropdown menu for the format 
                    - Ebook, hard copy */}
                        {/* - Or maybe a text field for format, not sure yet */}
                        <FormControl >
                            <TextField
                                name='format'
                                id="format"
                                label="Format"
                            />
                            <FormHelperText>ex: Ebook, Paperback</FormHelperText>
                        </FormControl>
                        {/* - Textfield for Series? */}
                        <FormControl >
                            <TextField
                                name='series'
                                id="series"
                                label="Series Details"
                            />
                            <FormHelperText>ex: Series Name, #2</FormHelperText>

                        </FormControl>
                    </Stack>

                    <FormControl fullWidth sx={{ m: 1 }}>

                        <TextField
                            id="review"
                            name='review'
                            label={'Review'}
                            multiline
                            rows={10}

                        />
                    </FormControl>
                </Stack>



                {/* - Textbox for the actual review */}

                <Button type='submit'>Add Review</Button>
                <Button onClick={toggleReviewForm}>Cancel</Button>


            </Box>

        </React.Fragment>
    )
}