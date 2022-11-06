import React, { useState, useRef, useEffect } from 'react';
import API from '../../utils/API'
import {
    Typography, Box, Container, Paper, Stack, IconButton, Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EditReview from './modals/EditReview';

const clampedStyle = {
    height: 230,
    overflow: 'hidden',
    textOverflow: 'ellipsis'
}

const unclampedStyle = {
    height: 'fit-content'
}



export default function Note({ note, noteInfo, openSnackbar, bookId, pages }) {

    const [editNote, setEditNote] = useState(false);
    const [noteId, setNoteId] = useState(null);
    const [clamp, setClamp] = useState(true);
    const [overflowActive, setOverflowActive] = useState(null)
    const noteRef = useRef(null)

    const isOverflowActive = (e) => {
        return e.offsetHeight < e.scrollHeight || e.offsetWidth < e.scrollWidth;
    }

    const toggleEditForm = (id) => {
        setNoteId(id)
        setEditNote(!editNote)
    }

    const deleteNote = async (id) => {
        await API.deleteNote(id)
        openSnackbar('Note Removed')
        noteInfo()
    }

    useEffect(() => {
        if (note.content) {
            if (isOverflowActive(noteRef.current)) {
                setOverflowActive(true);
                setClamp(true)
                return;
            }
            setOverflowActive(false)
            setClamp(null)
        }
    }, [overflowActive])

    return (
        <Paper key={note.id} elevation={6} sx={{ width: { xs: 1 / 1, sm: 3 / 4, md: 3 / 5 }, p: 2, m: '4 0' }}>
            {noteId !== note.id && <Container>
                <Stack direction='row' justifyContent="space-between">
                    <Stack direction="row" spacing={0.5} alignItems="center">
                        <Typography variant='caption'>Status:</Typography>
                        <Typography variant='caption'>{note.status}</Typography>

                    </Stack>

                    <Stack spacing={0.5} direction="row" alignItems="center">
                        <IconButton onClick={() => toggleEditForm(note.id)} aria-label="edit" size="small">
                            <EditIcon color='success' fontSize="inherit" />
                        </IconButton>
                        <IconButton onClick={() => deleteNote(note.id)} aria-label="delete" size="small">
                            <DeleteIcon color='success' fontSize="inherit" />
                        </IconButton>
                    </Stack>
                </Stack>

                <Box sx={{ p: 2, mt: 1 }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, md: 3 }} alignItems='center' justifyContent="center">
                            <Typography variant='caption'>{note.progress}</Typography>
                        </Stack>

                    </Box>

                    {note.content && <Stack>
                        <Typography ref={noteRef} sx={clamp ? clampedStyle : unclampedStyle} variant="subtitle1" color="text.secondary">
                            {note.content}
                        </Typography>



                        {overflowActive &&
                            <React.Fragment>
                                {clamp ? <Button onClick={() => setClamp(false)} size='small'>See More</Button> : <Button onClick={() => setClamp(true)} size='small'>Hide</Button>}
                            </React.Fragment>
                        }
                    </Stack>
                    }
                </Box>

            </Container>}

            {noteId === note.id &&
                <EditReview type={'note'} reviewData={note} setEditReview={setEditNote} reviewInfo={noteInfo} setEditId={setNoteId} bookId={bookId} pages={pages} />
            }
        </Paper>
    )
}