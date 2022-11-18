import React, { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import AppContext from '../../../AppContext';
import API from '../../../utils/API'
import {
    Typography, Stack, Box,
    TextField, Button, useMediaQuery, Dialog, DialogTitle, DialogContent, DialogActions, Card, CardContent, CardMedia, Link
} from '@mui/material/';
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

    const [progressVal, setProgressVal] = useState(true)

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(`nice, submitted for book id ${book.id}`)
        const data = new FormData(e.target)
        let progress;

        progressVal ? progress = `${data.get('progress')}/${book.pages}` : progress = `${data.get('progress')}%`


        const note = {
            content: data.get('note'),
            status:'Currently Reading',
            progress: progress,
            UserId: context.userData.id,
            BookId: book.id
        }

        try {
            await API.newNote(note)
            handleClose()
        }
        catch (err) { console.log(err) }
    }

    const markRead = async () => {
        try {
            await API.removeCurrentlyReading(context.userData.id, book.id)

            await API.addRead({
                userId: context.userData.id,
                bookId: book.id
            })

            navigate(`/book/${book.id}`)
        } catch (err) { console.log(err) }
    }

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
                            <Box>
                                <TextField
                                    sx={{ width:{xs: 1/5, sm: 1 / 8}, mr: 1 }}
                                    size='small'
                                    id="progress"
                                    name='progress'
                                    variant="outlined" />
                                {progressVal ? <React.Fragment>
                                    <Typography variant='caption'>of {book.pages} pages</Typography>
                                    <Button variant='outlined' size="small" sx={{ ml: 1 }} onClick={() => setProgressVal(false)}>%</Button>
                                </React.Fragment>
                                    : <React.Fragment>
                                        <Typography variant='caption'>% done</Typography>
                                        <Button variant='outlined' size="small" sx={{ ml: 1 }} onClick={() => setProgressVal(true)}>pages</Button>
                                    </React.Fragment>
                                }

                            </Box>
                            <TextField
                                multiline
                                rows={6}
                                margin="dense"
                                id="note"
                                name='note'
                                label="Notes"
                                fullWidth
                            />
                            <Link underline='hover' onClick={markRead} sx={{
                                alignSelf:'center',
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