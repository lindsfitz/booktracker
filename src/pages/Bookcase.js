import React, { useState, useContext } from 'react';
import { Link } from "react-router-dom";
import AddShelf from './AddShelf'
import API from '../utils/API';
import AppContext from '../AppContext';
import EditShelf from '../components/EditShelf';
import { List, ListItem, Divider, ListItemText, ImageListItem, Button, Dialog, DialogActions, DialogContent,DialogContentText, DialogTitle } from '@mui/material/';



export default function Bookcase() {
    const context = useContext(AppContext);

    const [open, setOpen] = useState(false);
    const [editShelf, setEditShelf] = useState(false)
    const [shelf, setShelf] = useState(null)

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleShelfEdit = (shelf) => {
        setEditShelf(true)
        setShelf({
            id: shelf.id,
            name: shelf.name,
            description: shelf.description
        })
    }

    const handleDelete = async (e) => {
        console.log(e.target.id)
        const remove = await API.deleteShelf(e.target.id)
        console.log(remove)
        const shelves = await API.getShelves(context.userData.id)
        context.setUserShelves(shelves.data)
        setOpen(false)
    }

    // use effect to perform api call on page load , change the shelves piece of state post use effect and use the state variable to render the dependent components?

    return (


        <React.Fragment>
            {/* ONE LIST COMPONENT ALREADY EXISTS PRE DATA PULL */}
            {/* ***** ONCE DATA IS BEING PULLED VIA API SUCCESSFULLY - MAP OVER SHELF RESULTS. CREATE LIST ITEM COMPONENT FOR EACH SHELF IN RESULTS DATA & LIST ITEM TEXT FOR THE TITLE OF EACH SHELF */}
            {/* *** ONE IMAGE LIST ITEM IS CREATED FOR EACH BOOK INSIDE OF THE SHELF. JUST SET THE SRC TO THE IMAGE LINK FROM THE RESULTS */}
            <h1>All User Shelves</h1>
            <Button variant="outlined" onClick={context.toggleShelfDialog}>
                Add A Shelf
            </Button>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {context.userShelves.map((shelf) => (
                    <React.Fragment>
                        <ListItem key={`${shelf.name}`} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                            <Link to={`/shelf/${shelf.id}`}><ListItemText
                                primary={`${shelf.name}`}
                                sx={{ maxWidth: '10%' }}
                            /></Link>
                            <div style={{ display: 'flex', width: '100%' }}>

                                {shelf.Books.map((book) => (
                                    <ImageListItem key={book.title} sx={{ maxHeight: 218, maxWidth: 148, margin: 2 }}>
                                        <img
                                            src={`${book.cover_img}`}
                                            srcSet={`${book.cover_img}`}
                                            alt={`${book.title}`}
                                            loading="lazy"

                                        />
                                    </ImageListItem>

                                ))}
                                <Button id={shelf.id} onClick={()=>handleShelfEdit(shelf)}>Edit</Button>
                                <Button id={shelf.id} onClick={handleClickOpen}>Delete</Button>
                            </div>
                        </ListItem>
                        <Divider variant="inset" component="li" />
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
                                <Button id={shelf.id} onClick={handleDelete}>Delete</Button>
                            </DialogActions>
                        </Dialog>
                    </React.Fragment>
                ))}
            </List>

            {context.shelfDialog && <AddShelf />}

            {editShelf && <EditShelf shelf={shelf} setEditShelf={setEditShelf} editShelf={editShelf} />}



        </React.Fragment>
    )
}