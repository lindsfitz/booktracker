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


const tempData = [
    {
        name: 'Faves',
        description: 'All time favorite books',
        Books: [
            {
                title: "House of Earth and Blood",
                author: "Sarah J. Maas",
                cover_img: "https://covers.openlibrary.org/b/olid/OL27924119M-M.jpg",
                pages: 816,
                edition_key: "OL35866018M"
            },
            {
                title: "House of Sky and Breath",
                author: "Sarah J. Maas",
                cover_img: "https://covers.openlibrary.org/b/olid/OL28946291M-M.jpg",
                pages: 807,
            },
            {
                title: "The Ruin of Kings",
                author: "Jenn Lyons",
                cover_img: "https://covers.openlibrary.org/b/olid/OL27760114M-M.jpg",
                pages: 576,
                edition_key: "OL29792696M"
            },
            {
                title: "The Memory of Souls",
                author: "Jenn Lyons",
                cover_img: "https://covers.openlibrary.org/b/olid/OL28178905M-M.jpg",
                pages: 656,
                edition_key: "OL29831091M"
            },
            {
                title: "The Discord of Gods",
                author: "Jenn Lyons",
                cover_img: "https://covers.openlibrary.org/b/olid/OL34161957M-M.jpg",
                pages: 512,
                edition_key: "OL37998226M"
            },
        ]


    },
    {
        name: "TBR",
        description: "Desperately want to read these",
        Books: [
            {
                title: "Empire of Storms",
                author: "Sarah J. Maas",
                cover_img: "https://covers.openlibrary.org/b/olid/OL26319926M-M.jpg",
                pages: 712,
                edition_key: "OL27696715M"
            },
            {
                title: "A Court of Wings and Ruin",
                author: "Sarah J. Maas",
                cover_img: "https://covers.openlibrary.org/b/olid/OL26832221M-M.jpg",
                pages: 720,
                edition_key: "OL37072070M"
            },
            {
                title: "A Court of Thorns and Roses",
                author: "Sarah J. Maas",
                cover_img: "https://covers.openlibrary.org/b/olid/OL27099075M-M.jpg",
                pages: 432,
                edition_key: "OL31959292M"
            },
            {
                title: "A Court of Mist and Fury",
                author: "Sarah J. Maas",
                cover_img: "https://covers.openlibrary.org/b/olid/OL26992991M-M.jpg",
                pages: 640,
                edition_key: "OL32856480M"
            },

        ]
    },
    {
        name: "Upcoming Releases",
        description: "Counting Down the Days",
        Books: [
            {
                title: "House of Sky and Breath",
                author: "Sarah J. Maas",
                cover_img: "https://covers.openlibrary.org/b/olid/OL28946291M-M.jpg",
                pages: 807,
            },
            {
                title: "The Discord of Gods",
                author: "Jenn Lyons",
                cover_img: "https://covers.openlibrary.org/b/olid/OL34161957M-M.jpg",
                pages: 512,
                edition_key: "OL37998226M"
            },

        ]
    },
    {
        name: "DNF",
        description: "Boo these books",
        Books: [
            {
                title: "A Touch of Darkness",
                author: "Scarlett St. Clair",
                cover_img: "https://covers.openlibrary.org/b/olid/OL28946291M-M.jpg",
                pages: 354,
                edition_key: "OL31995429M"
            },
        ]
    },
]


export default function Dashboard({ user }) {

    // use effect to perform api call on page load , change the shelves piece of state post use effect and use the state variable to render the dependent components?

    const renderShelves = async () => {
        const userShelves = await API.getShelves(user.id)
    }

    return (
        <React.Fragment>
            {/* ONE LIST COMPONENT ALREADY EXISTS PRE DATA PULL */}
            {/* ***** ONCE DATA IS BEING PULLED VIA API SUCCESSFULLY - MAP OVER SHELF RESULTS. CREATE LIST ITEM COMPONENT FOR EACH SHELF IN RESULTS DATA & LIST ITEM TEXT FOR THE TITLE OF EACH SHELF */}
            {/* *** ONE IMAGE LIST ITEM IS CREATED FOR EACH BOOK INSIDE OF THE SHELF. JUST SET THE SRC TO THE IMAGE LINK FROM THE RESULTS */}
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {tempData.map((shelf) => (
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





        </React.Fragment>
    )




}