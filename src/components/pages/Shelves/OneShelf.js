// basically just lists of books
// can also add new book here but it adds it to the user specifically 
// maybe drag and drop for positioning / organizing on this page ?? 
// add/view reviews in pop up on this page maybe??? 
// Or separate page for individual books w review idk 

import React, { useState, useEffect, useContext } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ImageListItem from '@mui/material/ImageListItem';
import Typography from '@mui/material/Typography';
import API from '../../../utils/API'


const tempData = {
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


}


export default function OneShelf({ user }) {


    return (
        <React.Fragment>
            <h1>{tempData.name}</h1>
            <h4>{tempData.description}</h4>

            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>

                {tempData.Books.map((book) => (

                    <React.Fragment>
                        <ListItem alignItems="flex-start">

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


                        </ListItem>
                        <Divider variant="inset" component="li" />

                    </React.Fragment>
                ))}



            </List>



        </React.Fragment>
    )
}