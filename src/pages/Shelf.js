// basically just lists of books
// can also add new book here but it adds it to the user specifically 
// maybe drag and drop for positioning / organizing on this page ?? 
// add/view reviews in pop up on this page maybe??? 
// Or separate page for individual books w review idk 

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import API from '../utils/API';
import AppContext from '../AppContext';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ImageListItem from '@mui/material/ImageListItem';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


export default function Shelf() {
    const context = useContext(AppContext);
    const params = useParams()
    let navigate = useNavigate()

    const [open, setOpen] = React.useState(false);
    const [shelf, setShelf] = useState(null)


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


    useEffect(() => {
        API.getOneShelf(params.id).then(res => {
            setShelf(res.data)
        }).catch(err => {
            console.log(err)
        })
    }, [])


    return (
        <React.Fragment>
            {shelf && <div>
                <h1>{shelf.name}</h1>
                <h4>{shelf.description}</h4>
                <Button>Add Books</Button>
                <Button>Edit</Button>
                <Button onClick={handleClickOpen}>Delete</Button>

                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>

                    {shelf.Books.map((book) => (

                        <React.Fragment>
                            <ListItem key={`${book.title}`} alignItems="flex-start">

                                <ImageListItem key={book.title}>
                                    <img
                                        src={`${book.cover_img}`}
                                        srcSet={`${book.cover_img}`}
                                        alt={`${book.title}`}
                                        loading="lazy"
                                    />
                                </ImageListItem>

                                <ListItemText
                                    primary={book.title}
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                {book.author}
                                            </Typography>
                                        </React.Fragment>
                                    }
                                />

                                <Button onClick={()=> {navigate(`/book/${book.id}`)}}>View More</Button>


                            </ListItem>
                            <Divider variant="inset" component="li" />

                        </React.Fragment>
                    ))}
                </List>
            </div>}

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

        </React.Fragment>
    )
}