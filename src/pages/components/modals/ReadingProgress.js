import React, { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import AppContext from '../../../AppContext';
import API from '../../../utils/API'
import {
    Typography, Stack, Box,
    TextField, Button, useMediaQuery, Dialog, DialogTitle, DialogContent, DialogActions, Card, CardContent, CardMedia, Link, ButtonGroup
} from '@mui/material/';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

import { useTheme } from '@mui/material/styles';


const cardStyle = {
    width: 'fit-content',
    backgroundColor: 'transparent',
    boxShadow: 0,
    m: '0px 10px',
}

const imageStyle = {
    boxShadow: '3px 2px 6px #888888',
    maxHeight: 92,
    maxWidth: 61
}

const contentStyle = {
    display: 'flex'
}


export default function ReadingProgress({ book, open, handleClose }) {
    const context = useContext(AppContext);

    const theme = useTheme();
    const smxs = useMediaQuery(theme.breakpoints.down('sm'))
    let navigate = useNavigate()

    const [startValue, setStartValue] = useState(new Date());
    const [endValue, setEndValue] = useState(new Date());
    const [progressVal, setProgressVal] = useState(true)

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(`nice, submitted for book id ${book.id}`)
        const data = new FormData(e.target)
        let startDate = dayjs(startValue)
        let finishDate = dayjs(endValue)

        const review = {
            public: false,
            date_started: startDate.format('YYYY/MM/DD'),
            review: data.get('note'),
            UserId: context.userData.id,
            BookId: book.id
        }

        try {
            const reviewData = await API.newNote(review)
            handleClose()
        }
        catch (err) { console.log(err) }
    }

    const markRead = async () => {
        try {
            await API.removeCurrentlyReading(context.userData.id, book.id)
                .catch(console.error)

            await API.addRead({
                userId: context.userData.id,
                bookId: book.id
            })

            navigate(`/book/${book.id}`)
        } catch (err) { console.log(err) }
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
                maxWidth={'sm'}
                fullWidth={true}
                fullScreen={smxs}
                open={open} onClose={handleClose}>
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
                            </LocalizationProvider>
                            <Box>
                                <TextField
                                    sx={{ width: 1 / 8, mr: 1 }}
                                    size='small'
                                    id="progress"
                                    name='progress'
                                    variant="outlined" />
                                    {progressVal ? <Typography variant='caption'>of # pages</Typography> : <Typography variant='caption'>% done</Typography>}
                                <ButtonGroup variant='outlined' size="small" sx={{ml:1}}>
                                    <Button onClick={()=> setProgressVal(false)}>%</Button>
                                    <Button onClick={()=> setProgressVal(true)}>pages</Button>
                                </ButtonGroup>
                            </Box>
                            <TextField
                                // autoFocus
                                multiline
                                rows={6}
                                margin="dense"
                                id="note"
                                name='note'
                                label="Notes"
                                fullWidth
                            // variant="standard"
                            />
                            <Link onClick={markRead} sx={{
                                '&:hover': {
                                    textDecoration: 'underline',
                                    cursor: 'pointer'
                                },
                            }} color='success.main'>I've finished this book!</Link>

                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type='submit'>Update Progress</Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </React.Fragment>
    )
}