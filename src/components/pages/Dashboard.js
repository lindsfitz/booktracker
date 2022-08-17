//  once logged in -- this is the homepage. Lets you view existing shelves/add new shelves and you can click one to view details about the shelf 
// add book one time from this page and then can add it to as many shelves as you want 

import React, { useState, useEffect, useContext } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import API from '../../utils/API';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import ImageListItem from '@mui/material/ImageListItem';

export default function Dashboard({ user }) {

    const renderShelves = async () => {
        const userShelves = await API.getShelves(user.id)

        for (let i = 0; i < userShelves.length; i++) {


        }
    }

    return (
        <React.Fragment>

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








            {/* ONE LIST COMPONENT ALREADY EXISTS PRE DATA PULL */}
            {/* ***** ONCE DATA IS BEING PULLED VIA API SUCCESSFULLY - MAP OVER SHELF RESULTS. CREATE LIST ITEM COMPONENT FOR EACH SHELF IN RESULTS DATA & LIST ITEM TEXT FOR THE TITLE OF EACH SHELF */}
            {/* *** ONE IMAGE LIST ITEM IS CREATED FOR EACH BOOK INSIDE OF THE SHELF. JUST SET THE SRC TO THE IMAGE LINK FROM THE RESULTS */}

            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
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
            </List>
        </React.Fragment>
    )




}