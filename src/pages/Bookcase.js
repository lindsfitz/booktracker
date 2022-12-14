import React, { useState, useContext } from 'react';
import { Link, useNavigate } from "react-router-dom";
import AddShelf from './components/modals/AddShelf'
import API from '../utils/API';
import AppContext from '../AppContext';
import EditShelf from './components/modals/EditShelf';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Divider, Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Container, ButtonGroup, IconButton, Tooltip } from '@mui/material/';
import Carousel from './components/Carousel';



export default function Bookcase() {
    const context = useContext(AppContext);
    let navigate = useNavigate()
    // const theme = useTheme();
    // const md = useMediaQuery(theme.breakpoints.down('md'))

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
            public: shelf.public,
            name: shelf.name,
            description: shelf.description,
            Tags: shelf.Tags
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

    return (
        <React.Fragment>
            <Container sx={{ mr: 'auto', ml: 'auto', textAlign:'center', mt:2, mb:'50px' }}>
                <Typography variant='h6'>Bookcase</Typography>
                <Container sx={{ display: 'flex', justifyContent: 'space-between', m: 5, width:'90%' }}>
                    <ButtonGroup size='small' color='success'>
                        <Button variant="outlined" onClick={() => navigate('/books/currently')}>
                            Currently Reading
                        </Button>
                        <Button variant="outlined" onClick={() => navigate('/books/read')}>
                            Read
                        </Button>
                    </ButtonGroup>
                    <Button variant="outlined" color='success' onClick={context.toggleShelfDialog}>
                        Add Shelf
                    </Button>
                </Container>
                <Divider />
                <Container sx={{ width: '100%', mt:2 }}>
                    {context.userShelves.map(shelf => (
                        <Container key={`${shelf.name}${shelf.id}bc`}>
                            <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant='subtitle1'>
                                    <Link to={`/shelf/${shelf.id}`} style={{
                                        textDecoration: "none",
                                        color: '#5F5B71'
                                    }}>
                                        {shelf.name}
                                    </Link>
                                </Typography>
                                <ButtonGroup variant="outlined" aria-label="text button group">
                                    <Tooltip title="Edit Shelf">
                                        <IconButton size='small' onClick={() => handleShelfEdit(shelf)}>
                                            <EditIcon color='secondary' fontSize="inherit" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete Shelf">
                                        <IconButton size='small' onClick={handleClickOpen}>
                                            <DeleteIcon color='secondary' fontSize="inherit" />
                                        </IconButton>
                                    </Tooltip>
                                </ButtonGroup>
                            </Container>
                            <Carousel shelf={shelf} />

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
                        </Container>
                    ))}
                </Container>

                {context.shelfDialog && <AddShelf />}

                {editShelf && <EditShelf shelf={shelf} setEditShelf={setEditShelf} editShelf={editShelf} />}

            </Container>


        </React.Fragment >
    )
}