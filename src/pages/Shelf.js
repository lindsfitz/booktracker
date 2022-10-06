// basically just lists of books
// can also add new book here but it adds it to the user specifically 
// maybe drag and drop for positioning / organizing on this page ?? 
// add/view reviews in pop up on this page maybe??? 
// Or separate page for individual books w review idk 

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import API from '../utils/API';
import dayjs from 'dayjs'
import AppContext from '../AppContext';
import EditShelf from './components/EditShelf';
import { Container, List, ListItem, Divider, Stack, Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Box, Chip } from '@mui/material';

const imageStyle = {
    boxShadow: '3px 2px 6px #888888',
    width: 148,
    height: 218
}


export default function Shelf() {
    const context = useContext(AppContext);
    const params = useParams()
    let navigate = useNavigate()

    const [open, setOpen] = React.useState(false);
    const [shelf, setShelf] = useState(null)
    const [editDialog, setEditDialog] = useState(false)


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = async () => {
        const remove = await API.deleteShelf(params.id)
        console.log(remove)
        setOpen(false)
        navigate('/shelves')

    }

    const removeBook = async (bookId) => {
        const removed = await API.removefromShelf(params.id, bookId)
        console.log(removed)
        shelfData();
    }

    const shelfData = async () => {
        const shelf = await API.oneUserShelf(params.id, context.userData.id)
        console.log(shelf)
        setShelf(shelf.data)


    }

    const getChips = (shelves) => {
        const chips = []
        shelves.forEach(item => {
            if (item.name !== shelf.name) { 
                console.log(item.name) 
                chips.push(<Chip label={item.name} variant="outlined" />)
            }
        })
        return chips;
    }


    useEffect(() => {
        shelfData()
    }, [context.userShelves])


    return (
        <React.Fragment>
            {shelf && <Container>
                <Box sx={{ p: 3, textAlign: 'center', maxWidth: { xs: 3 / 4, sm: 1 / 2 } }}>
                    <Typography variant='h5'>{shelf.name}</Typography>
                    <Typography variant='subtitle2'>{shelf.description}</Typography>
                    <Typography variant='caption' color='text.secondary'>Last Updated: {dayjs(shelf.last_update).format('MMM D, YYYY')}</Typography>
                    <Stack direction='row'>
                        <Button>Add Books</Button>
                        <Button onClick={() => setEditDialog(true)}>Edit</Button>
                        <Button onClick={handleClickOpen}>Delete</Button>
                    </Stack>
                </Box>

                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>

                    {shelf.Books.map((book) => (

                        <React.Fragment>
                            <ListItem key={`${book.title}${shelf.name}shelf`} id={`${book.title}${shelf.name}shelf`} alignItems="center">
                                <Box sx={{ display: 'flex', justifyContent: 'center', mr: 'auto', ml: 'auto' }}>
                                    <img
                                        src={`${book.cover_img}`}
                                        srcSet={`${book.cover_img}`}
                                        alt={`${book.title}`}
                                        style={imageStyle}
                                        loading="lazy"
                                        onClick={() => { navigate(`/book/${book.id}`) }}
                                    />
                                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', ml: 2 }}>
                                        <Stack sx={{ alignSelf: 'center', ml: 1, p:1 }}>
                                            <Typography variant='subtitle1'>{book.title}</Typography>
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                {book.author}
                                            </Typography>
                                        </Stack>

                                        <Divider />

                                        <Stack sx={{ alignSelf: 'center', ml: 1, p:1 }} direction={{ xs: 'column', md: 'row' }}>
                                            {book.CurrentBooks.length > 0 && <Chip label='Currently Reading' />}
                                            {book.DNFBooks.length > 0 && <Chip label='DNF' />}
                                            {book.Reviews.length > 0 && <Chip label='Read' />}

                                            {book.Shelves.length > 1 && getChips(book.Shelves)}
                                           
                                        </Stack>
                                        <Divider />
                                        <Stack sx={{p:1}}>
                                            <Typography variant='caption' color='text.secondary'>Added to Shelf:</Typography>
                                            <Typography variant='caption' color='text.secondary'>{dayjs(book.bookshelf.createdAt).format('MMM D, YYYY')}</Typography>
                                        </Stack>
                                    </Box>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        <Button onClick={() => removeBook(book.id)}>X</Button>

                                        <Button onClick={() => { navigate(`/book/${book.id}`) }}>Details</Button>
                                    </Box>

                                </Box>



                            </ListItem>
                            <Divider variant="inset" component="li" />

                        </React.Fragment>
                    ))}
                </List>
            </Container>}

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Are you positive you want to delete this Shelf from your Bookcase?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        This action cannot be undone!
                        Any book on this Shelf, and its associated reviews, will still be included on your All Books page.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleDelete}>Delete</Button>
                </DialogActions>
            </Dialog>


            {editDialog && <EditShelf shelf={shelf} setEditShelf={setEditDialog} editShelf={editDialog} />}

        </React.Fragment>
    )
}