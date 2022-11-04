import React, { useState, useContext } from 'react';
import { useParams } from "react-router-dom";
import AppContext from '../../../AppContext';
import API from '../../../utils/API'
import { Typography, FormControl, Rating, Stack, Switch, Box, TextField, Button } from '@mui/material/';



export default function AddNote({ reviewInfo, toggleNoteForm, bookId, addBook }) {

    const context = useContext(AppContext);


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


        const newReview = {
            public: false,
            review: data.get('review'),
            UserId: context.userData.id,
            BookId: id
        }
        try {
            const reviewData = await API.newNote(newReview)
            console.log(reviewData)
        } catch (err) { console.log(err) }

        reviewInfo()
        toggleNoteForm()
    }



    return (
        <Box
            component="form"
            sx={{ m: 1, width: {xs:1/1, md:1/2} }}
            noValidate
            autoComplete="off"
            onSubmit={noteSubmit}
        >

            <Stack direction="row" spacing={4} alignItems="center" justifyContent="center">


                <Stack spacing={3} alignItems="center" justifyContent="center">

                    {/* For the review form I need:
                    - Toggle for True/False if they are marking the book as read or unread */}

                    <Stack direction="row" spacing={1} alignItems="center">
                        <Typography>Unread</Typography>
                        <Switch name='read'
                            id='read'
                            checked={false}
                            inputProps={{ 'aria-label': 'controlled' }} />
                        <Typography>Read</Typography>
                    </Stack>
                </Stack>



            </Stack>



            {/* - Textbox for the actual review */}
            <FormControl fullWidth sx={{ m: 1 }}>

                <TextField
                    id="review"
                    name='review'
                    label={'Notes'}
                    multiline
                    rows={10}

                />
            </FormControl>

            <Button type='submit'>Add Note</Button>
            <Button onClick={toggleNoteForm}>Cancel</Button>

        </Box>

    )

}