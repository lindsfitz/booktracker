import React, { useState, useContext } from 'react';
import { Link, useNavigate } from "react-router-dom";
import AddShelf from './components/AddShelf'
import API from '../utils/API';
import AppContext from '../AppContext';
import EditShelf from './components/EditShelf';
import { List, ListItem, Divider, ListItemText, Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Card, CardMedia, CardContent, Container, ButtonGroup } from '@mui/material/';



export default function Bookcase() {
    const context = useContext(AppContext);
    let navigate = useNavigate()

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
            <h1>All User Shelves</h1>
            <Button variant="outlined" onClick={context.toggleShelfDialog}>
                Add A Shelf
            </Button>
            <List sx={{ width: '100%', bgcolor: 'transparent' }}>
                {context.userShelves.map((shelf) => (
                    <React.Fragment>
                        <ListItem key={`${shelf.name}${shelf.id}`} id={`${shelf.name}${shelf.id}`} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                            <Container sx={{ display: 'flex', alignItems:'center', justifyContent:'space-between' }}>
                                <Link to={`/shelf/${shelf.id}`}>
                                    <Typography variant='subtitle1'>{shelf.name}</Typography>
                                </Link>
                                <ButtonGroup variant="outlined" aria-label="text button group">
                                    <Button onClick={() => handleShelfEdit(shelf)}>Edit</Button>
                                    <Button onClick={handleClickOpen}>Delete</Button>
                                </ButtonGroup>
                            </Container>
                            <div style={{ display: 'flex', width: '100%' }}>

                                {shelf.Books.map((book) => (
                                    <Card key={`${shelf.id}${book.id}`} id={`${shelf.id}${book.id}`} sx={{ maxWidth: 200, textAlign: 'center', bgcolor:'transparent' }} className='book-card'>
                                        <CardContent className='book-card'>
                                            <CardMedia
                                                component="img"
                                                sx={{ maxHeight: 218, maxWidth: 148 }}
                                                onClick={() => { navigate(`/book/${book.id}`) }}
                                                image={`${book.cover_img}`}
                                                alt={`${book.title}`}
                                            />
                                            <Typography variant='subtitle2' display='block'>{book.title}</Typography>
                                            <Typography variant='caption' display='block'>{book.author}</Typography>
                                        </CardContent>
                                    </Card>

                                ))}
                            
                                <Button variant='outlined' sx={{color:'#9da283', border:'#939876 1px solid'}}  
                                onClick={() => navigate(`/shelf/${shelf.id}`)}>Shelf Details</Button> 
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