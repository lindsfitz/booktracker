import React, { useState, useContext } from 'react';
import AppContext from '../../../AppContext';
import API from '../../../utils/API'
import { Typography, FormControl, Stack, Box, TextField, Button, Select, MenuItem, ButtonGroup } from '@mui/material/';



export default function AddNote({ noteInfo, toggleNoteForm, bookId, pages, addBook }) {

    const context = useContext(AppContext);

    const [status, setStatus] = useState('')
    const [progressVal, setProgressVal] = useState(true)

    const handleChange = (event) => {
        setStatus(event.target.value);
    };


    const noteSubmit = async (e) => {
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

        const newNote = {
            content: data.get('content'),
            status: data.get('status'),
            progress: data.get('progress'),
            UserId: context.userData.id,
            BookId: id
        }


        try {
            const reviewData = await API.newNote(newNote)
            console.log(reviewData)
        } catch (err) { console.log(err) }

        noteInfo()
        toggleNoteForm()
    }



    return (
        <Box
            component="form"
            sx={{ m: 1, width: { xs: 1 / 1, md: 1 / 2 } }}
            noValidate
            autoComplete="off"
            onSubmit={noteSubmit}
        >

            <Stack direction="row" spacing={4} alignItems="center" justifyContent="center">


                <Stack spacing={3} alignItems="center" justifyContent="center">



                    <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant='caption'>Status:</Typography>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                            <Select
                                value={status}
                                onChange={handleChange}
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
                                sx={{ width: 1 / 8, mr: 1 }}
                                size='small'
                                id="progress"
                                name='progress'
                                variant="outlined" />
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



            </Stack>



            {/* - Textbox for the actual review */}
            <FormControl fullWidth sx={{ m: 1 }}>

                <TextField
                    id="content"
                    name='content'
                    label={'Notes'}
                    multiline
                    rows={10}

                />
            </FormControl>

            <Button type='submit'>Add Note</Button>
            <Button onClick={toggleNoteForm}>Cancel</Button>

        </Box >

    )

}