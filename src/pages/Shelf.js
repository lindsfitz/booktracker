import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import API from '../utils/API';
import dayjs from 'dayjs'
import AppContext from '../AppContext';
import EditShelf from './components/modals/EditShelf';
import { useTheme } from '@mui/material/styles';
import { Container, List, ListItem, Divider, Stack, Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Box, Chip, IconButton, Tooltip, useMediaQuery } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import Styles from '../utils/Styles';


const titleBoxStyle = {
    p: 3,
    textAlign: 'center',
    maxWidth: { xs: 3 / 4, sm: 1 / 2 },
    mr: 'auto',
    ml: 'auto'
}


export default function Shelf() {
    const context = useContext(AppContext);
    const params = useParams()
    let navigate = useNavigate()
    const theme = useTheme();
    const mobile = useMediaQuery(theme.breakpoints.down('md'))

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

    const handleTagDelete = (tag) => {
        console.log(tag)
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
        const loadShelf = async (shelfId, userId) => {
            const shelf = await API.oneUserShelf(shelfId, userId)
            console.log(shelf)
            setShelf(shelf.data)
        }
        // shelfData()
        loadShelf(params.id, context.userData.id)
    }, [context.userShelves, params.id, context.userData])


    return (
        <React.Fragment>
            {shelf && <Container sx={{ mb: '80px' }}>
                <Box sx={titleBoxStyle}>
                    <Typography variant='h5'>{shelf.name}</Typography>
                    <Typography variant='subtitle2'>{shelf.description}</Typography>
                    <Typography variant='caption' color='text.secondary'>Last Updated: {dayjs(shelf.last_update).format('MMM D, YYYY')}</Typography>
                    <Box>
                        {shelf.Tags && shelf.Tags.map(tag => <Chip key={tag.name} label={tag.name} onDelete={() => handleTagDelete(tag)} />)}
                    </Box>
                    <Stack direction='row' justifyContent='center' spacing={2}>
                        {/* <Button>Add Books</Button> */}
                        <IconButton aria-label="edit" size="small" onClick={() => setEditDialog(true)}>
                            <Tooltip title="Edit Shelf">
                                <EditIcon color='secondary' fontSize="inherit" />
                            </Tooltip>
                        </IconButton>
                        <IconButton aria-label="delete" size="small" onClick={handleClickOpen}>
                            <Tooltip title="Delete Shelf">
                                <DeleteIcon color='secondary' fontSize="inherit" />
                            </Tooltip>
                        </IconButton>
                    </Stack>
                </Box>

                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>

                    {shelf.Books.map((book) => (

                        <React.Fragment>
                            <ListItem key={book.id} id={`${book.title}${shelf.name}shelf`}
                                onClick={mobile ? () => {
                                    navigate(`/book/${book.id}`)
                                } : null} alignItems="center">
                                <Box sx={Styles.bookListBox}>
                                    <Box sx={{
                                        '&:hover': {
                                            cursor: 'pointer'
                                        }
                                    }}>
                                        <img
                                            src={`${book.cover_img}`}
                                            srcSet={`${book.cover_img}`}
                                            alt={`${book.title}`}
                                            style={Styles.medBookCover}
                                            loading="lazy"
                                            onClick={() => { navigate(`/book/${book.id}`) }}
                                        />
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', ml: 2 }}>
                                        <Stack sx={{ alignSelf: 'center', ml: 1, p: 1 }}>
                                            <Typography sx={Styles.title}
                                                onClick={() => { navigate(`/book/${book.id}`) }}
                                                variant='subtitle1'>{book.title}</Typography>
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                {book.author}
                                            </Typography>
                                        </Stack>

                                        <Divider />

                                        <Stack sx={{ alignSelf: 'center', ml: 1, p: 1 }} direction={{ xs: 'column', md: 'row' }}>
                                            {book.CurrentBooks.length > 0 && <Chip label='Currently Reading' />}
                                            {book.DNFBooks.length > 0 && <Chip label='DNF' />}
                                            {book.ReadBooks.length > 0 && <Chip label='Read' />}

                                            {book.Shelves.length > 1 && getChips(book.Shelves)}

                                        </Stack>
                                        <Divider />
                                        <Stack sx={{ p: 1 }}>
                                            <Typography variant='caption' color='text.secondary'>Added to Shelf:</Typography>
                                            <Typography variant='caption' color='text.secondary'>{dayjs(book.bookshelf.createdAt).format('MMM D, YYYY')}</Typography>
                                        </Stack>
                                    </Box>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        <IconButton size='small' onClick={() => removeBook(book.id)}>
                                            <Tooltip title="Remove Book">
                                                <CloseIcon fontSize="small" />
                                            </Tooltip>
                                        </IconButton>
                                    </Box>

                                </Box>
                            </ListItem>
                            <Divider key={`${book.id}-divider`} variant="inset" component="li" />

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