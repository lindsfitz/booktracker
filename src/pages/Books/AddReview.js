import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../../AppContext';
import API from '../../utils/API'
import { Typography, FormControlLabel, Rating, Stack, Switch, Box } from '@mui/material/';
import TextField from '@mui/material/TextField';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
// import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';


export default function AddReview() {

    const [value, setValue] = React.useState(new Date('2014-08-18T21:11:54'));

    const handleChange = (newValue) => {
        setValue(newValue);
    };

    const reviewSubmit = () => {
        // function to actually post review to db
    }

    return (

        <React.Fragment>
            {/* <FormControlLabel disabled control={<Switch />} label="Unread" />
            <Stack spacing={1}>
                <Rating name="half-rating" defaultValue={2.5} precision={0.5} />
                <Rating name="half-rating-read" defaultValue={2.5} precision={0.5} readOnly />
            </Stack>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Stack spacing={3}>
                    <DesktopDatePicker
                        label="Date desktop"
                        inputFormat="MM/dd/yyyy"
                        value={value}
                        onChange={handleChange}
                        renderInput={(params) => <TextField {...params} />}
                    />
                    <MobileDatePicker
                        label="Date mobile"
                        inputFormat="MM/dd/yyyy"
                        value={value}
                        onChange={handleChange}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </Stack>
            </LocalizationProvider> */}


            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
                onSubmit={reviewSubmit}
            >
                <Stack spacing={3}>





                    {/* <TextField
                    required
                    id="outlined-required"
                    label="Required"
                    defaultValue="Hello World"
                /> */}


                    {/* For the review form I need:
                - Toggle for True/False if they are marking the book as read or unread */}
                    <FormControlLabel control={<Switch />} label="Unread" />
                    {/* - Stars for Rating */}
                    <Rating name="rating" defaultValue={0} precision={0.5} />
                    {/* - Date picker for the start date */}
                    {/* <LocalizationProvider dateAdapter={AdapterDateFns}>

                        <DesktopDatePicker
                            label="Date Started"
                            inputFormat="MM/dd/yyyy"
                            value={value}
                            onChange={handleChange}
                            renderInput={(params) => <TextField {...params} />}
                        /> */}
                        {/* - Date picker for date finished */}
                        {/* <DesktopDatePicker
                            label="Date Finished"
                            inputFormat="MM/dd/yyyy"
                            value={value}
                            onChange={handleChange}
                            renderInput={(params) => <TextField {...params} />}
                        /> */}
                        {/* - Textbox for the actual review */}
                    {/* </LocalizationProvider> */}
                    <TextField
                        id="review"
                        name='review'
                        label="Review"
                        multiline
                        rows={10}

                    />
                    {/* - Dropdown menu for the format 
                    - Ebook, hard copy */}
                    {/* - Or maybe a text field for format, not sure yet */}
                    <TextField
                        name='format'
                        id="format"
                        label="Format"
                        placeholder="Kindle EBook"
                    />
                    {/* - Textfield for Series? */}
                    <TextField
                        name='series'
                        id="series"
                        label="Series Details"
                        placeholder="Series Name #2"
                    />
                </Stack>




            </Box>

        </React.Fragment>
    )
}