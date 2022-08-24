//  once logged in -- this is the homepage. Lets you view existing shelves/add new shelves and you can click one to view details about the shelf 
// add book one time from this page and then can add it to as many shelves as you want 

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import API from '../utils/API';
import AppContext from '../AppContext';
import AddShelf from './AddShelf'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ImageListItem from '@mui/material/ImageListItem';



export default function Dashboard(props) {

    const context = useContext(AppContext);
    let navigate = useNavigate();

    const [userShelves, setUserShelves] = useState([])


    const renderShelves = async () => {
        const shelves = await API.getShelves(context.userData.id)
        setUserShelves(shelves.data)
    }

    // on page load, check for token (aka logged in user) and render shelves if logged in. If no token (not logged in) or token can't be verified (user doesn't exist) then redirect to the login page
    useEffect(() => {
        const myToken = localStorage.getItem("token");
        if (myToken) {
            API.verify(myToken).then(async res => {
                context.setToken(myToken)
                context.setUserData({
                    username: res.data.username,
                    id: res.data.id
                })
                renderShelves()
            }).catch(err => {
                console.log(err)
                localStorage.removeItem("token");
                navigate('/login')
            })
        }
        if (!myToken) { 
            navigate('/login') 
        }
    }, [])


    useEffect(() => {
        console.log(userShelves)

    }, [userShelves])



    return (
        <React.Fragment>
            {/* ONE LIST COMPONENT ALREADY EXISTS PRE DATA PULL */}
            {/* ***** ONCE DATA IS BEING PULLED VIA API SUCCESSFULLY - MAP OVER SHELF RESULTS. CREATE LIST ITEM COMPONENT FOR EACH SHELF IN RESULTS DATA & LIST ITEM TEXT FOR THE TITLE OF EACH SHELF */}
            {/* *** ONE IMAGE LIST ITEM IS CREATED FOR EACH BOOK INSIDE OF THE SHELF. JUST SET THE SRC TO THE IMAGE LINK FROM THE RESULTS */}
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {userShelves.slice(0, 3).map((shelf) => (
                    <React.Fragment>
                        <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                            <ListItemText
                                primary={`${shelf.name}`}
                                sx={{ maxWidth: '10%' }}
                            />
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
                            </div>
                        </ListItem>
                        <Divider variant="inset" component="li" />
                    </React.Fragment>
                ))}
            </List>


            {context.shelfDialog && <AddShelf />}

            {/* <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                <ListItem alignItems="flex-start">
                    <ListItemText
                        primary="Shelf Title"
                    />
                    <ImageListItem key='1'>
                        <img
                            src="https://covers.openlibrary.org/b/olid/OL27924119M-M.jpg"
                            srcSet="https://covers.openlibrary.org/b/olid/OL27924119M-M.jpg"
                            alt='crescent city'
                            loading="lazy"
                        />
                    </ImageListItem>
                    <ImageListItem key='2'>
                        <img
                            src="https://covers.openlibrary.org/b/olid/OL27924119M-M.jpg"
                            srcSet="https://covers.openlibrary.org/b/olid/OL27924119M-M.jpg"
                            alt='crescent city'
                            loading="lazy"
                        />
                    </ImageListItem>
                    <ImageListItem key='3'>
                        <img
                            src="https://covers.openlibrary.org/b/olid/OL27924119M-M.jpg"
                            srcSet="https://covers.openlibrary.org/b/olid/OL27924119M-M.jpg"
                            alt='crescent city'
                            loading="lazy"
                        />
                    </ImageListItem>

                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                        <Avatar>L</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary="Summer BBQ"
                        secondary={
                            <React.Fragment>
                                <Typography
                                    sx={{ display: 'inline' }}
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                >
                                    to Scott, Alex, Jennifer
                                </Typography>
                                {" — Wish I could come, but I'm out of town this…"}
                            </React.Fragment>
                        }
                    />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                        <Avatar>L</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary="Oui Oui"
                        secondary={
                            <React.Fragment>
                                <Typography
                                    sx={{ display: 'inline' }}
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                >
                                    Sandra Adams
                                </Typography>
                                {' — Do you have Paris recommendations? Have you ever…'}
                            </React.Fragment>
                        }
                    />
                </ListItem>
            </List> */}





            {/* <Container maxWidth="md">
                <Typography sx={{ minWidth: 100 }}>Shelf Name</Typography>
                <Container maxWidth="md" sx={{ display: 'flex' }}> */}
            {/* <Card >
                        <CardMedia
                            component="img"
                            height="194"
                            image="https://covers.openlibrary.org/b/olid/OL27924119M-M.jpg"
                            alt="Crescent City Cover"
                        />

                    </Card>
                    <Card >
                        <CardMedia
                            component="img"
                            height="194"
                            image="https://covers.openlibrary.org/b/olid/OL27924119M-M.jpg"
                            alt="Crescent City Cover"
                        />
                        <CardContent> */}
            {/* https://covers.openlibrary.org/b/olid/OL27924119M-M.jpg */}
            {/* <Typography gutterBottom variant="subtitle1">
                                House of Earth and Blood
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Sarah J. Maas
                            </Typography>
                        </CardContent>
                    </Card>

                </Container>
            </Container> */}



            {/* <Button variant="outlined" onClick={handleShelfDialog}>
                Add A Shelf
            </Button>


            {shelfDialog && <AddShelf shelfDialog={shelfDialog} handleCloseShelfDialog={handleCloseShelfDialog} />} */}


        </React.Fragment>
    )




}