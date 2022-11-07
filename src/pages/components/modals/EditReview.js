import React, { useState, useContext, useEffect } from 'react';
import AppContext from '../../../AppContext';
import API from '../../../utils/API'
import { Typography, FormControl, Rating, Stack, Switch, Box, TextField, Button, Select, MenuItem } from '@mui/material/';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
// import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';


export default function EditReview({ type, reviewData, setEditReview, reviewInfo, setEditId, bookId, pages }) {

    const context = useContext(AppContext);

    const [startValue, setStartValue] = useState(null);
    const [endValue, setEndValue] = useState(null);
    const [onPublic, setOnPublic] = useState(false)
    const [status, setStatus] = useState('')
    const [progress, setProgress] = useState(0)
    const [progressVal, setProgressVal] = useState(true)



    const toggleDates = () => {
        setStartValue(new Date())
        setEndValue(new Date())
    }

    const handleStatusChange = (event) => {
        setStatus(event.target.value);
    };

    useEffect(() => {
        setStartValue(reviewData.date_started)
        setEndValue(reviewData.date_finished)
        setOnPublic(reviewData.public)
        setStatus(reviewData.status)
        if (reviewData.progress) {
            if (reviewData.progress.includes('/')) {
                const values = reviewData.progress.split('/')
                setProgress(values[0])
            }

            if (reviewData.progress.includes('%')) {
                const prog = parseInt(reviewData.progress.replace('%', ''))
                setProgressVal(false)
                setProgress(prog)
            }

        }
    }, [reviewData])

    const handleSwitch = (event) => {
        setOnPublic(event.target.checked);
    };


    const handleStartDate = (newValue) => {
        setStartValue(newValue);
    };

    const handleEndDate = (newValue) => {
        setEndValue(newValue);
    };

    const submit = async (e) => {
        e.preventDefault();
        console.log('submitted')
        const data = new FormData(e.currentTarget)
        if (type === 'review') {
            let startDate = dayjs(startValue)
            let finishDate = dayjs(endValue)
            const updatedReview = {
                public: onPublic,
                date_started: startDate.format('YYYY/MM/DD'),
                date_finished: finishDate.format('YYYY/MM/DD'),
                year_finished: finishDate.year(),
                month_finished: finishDate.month(),
                rating: data.get('rating'),
                review: data.get('review'),
                format: data.get('format'),
                series: data.get('series'),
            }
            await API.removeCurrentlyReading(context.userData.id, bookId)
            await API.removeFromDNF(context.userData.id, bookId)
            await API.addRead({
                userId: context.userData.id,
                bookId: bookId
            })

            const updated = await API.editReview(updatedReview, reviewData.id)
            console.log(updated)
        }
        if (type === 'note') {
            const updatedNote = {
                content: data.get('review'),
                status: data.get('status'),
                progress: data.get('progress')
            }

            const updated = await API.editNote(updatedNote, reviewData.id)
            console.log(updated)

        }

        reviewInfo()
        setEditId(null)
        setEditReview(false)
    }

    return (
        <React.Fragment>
            <Box
                component="form"
                // sx={{ m: 1, width: '50%' }}
                noValidate
                autoComplete="off"
                onSubmit={submit}
            >

                {type === 'review' ? (
                    <Stack spacing={3} alignItems="center" justifyContent="center">
                        <Stack
                            alignItems="center" justifyContent="center"
                            direction={{ xs: "column", sm: 'row' }}
                            spacing={5}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant='caption'>Private</Typography>
                                <Switch name='read'
                                    size='small'
                                    color='secondary'
                                    id='read'
                                    checked={onPublic}
                                    onChange={handleSwitch}
                                    inputProps={{ 'aria-label': 'controlled' }} />
                                <Typography variant='caption'>Public</Typography>
                            </Stack>

                            <Stack direction="row" spacing={0}>
                                <Typography variant='caption' component="legend">Your Rating:</Typography>
                                <Rating name="rating" id='rating' defaultValue={reviewData.rating} precision={0.5} />
                            </Stack>
                        </Stack>



                        {startValue || endValue ? (<Stack alignItems="center" justifyContent="center" direction='row' spacing={5}>
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
                        </Stack>) : <Button onClick={toggleDates}>Add Read Dates</Button>}



                        <Stack direction='row'
                            alignItems="center" justifyContent="center"
                            spacing={3} >

                            <TextField
                                name='format'
                                id="format"
                                label="Format"
                                defaultValue={reviewData.format}
                            />
                            <TextField
                                name='series'
                                id="series"
                                label="Series Details"
                                defaultValue={reviewData.series}
                            />
                        </Stack>




                        {/* - Textbox for the actual review */}

                    </Stack>) : (
                    <Stack spacing={3} alignItems="center" justifyContent="center">
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant='caption'>Status:</Typography>
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                                <Select
                                    value={status}
                                    onChange={handleStatusChange}
                                >
                                    <MenuItem value={''}>
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={'Currently Reading'}>Currently Reading</MenuItem>
                                    <MenuItem value={'To Be Read'}>To Be Read</MenuItem>
                                    <MenuItem value={'Did Not Finish'}>Did Not Finish</MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>
                        {status === 'Currently Reading' &&
                            <Box>
                                <TextField
                                    sx={{ width: '70px', mr: 1 }}
                                    size='small'
                                    id="progress"
                                    name='progress'
                                    variant="outlined"
                                    defaultValue={progress} />
                                {progressVal ? <React.Fragment>
                                    <Typography variant='caption'>of {pages} pages</Typography>
                                    <Button variant='outlined' size="small" sx={{ ml: 1 }} onClick={() => setProgressVal(false)}>%</Button>
                                </React.Fragment>
                                    : <React.Fragment>
                                        <Typography variant='caption'>% done</Typography>
                                        <Button variant='outlined' size="small" sx={{ ml: 1 }} onClick={() => setProgressVal(true)}>pages</Button>
                                    </React.Fragment>
                                }
                            </Box>
                        }
                    </Stack>

                )}

                <FormControl fullWidth sx={{ m: 1 }}>

                    <TextField
                        id="review"
                        name='review'
                        label={type === 'review' ? 'Review' : 'Notes'}
                        multiline
                        rows={10}
                        defaultValue={type === 'review' ? reviewData.review : reviewData.content}

                    />
                </FormControl>

                <Button color='secondary' type='submit'>Update</Button>
                <Button color='secondary' onClick={() => setEditId(null)}>Cancel</Button>

            </Box>

        </React.Fragment>
    )
}