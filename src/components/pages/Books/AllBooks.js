import { Book } from '@mui/icons-material';
import React, { useState, useEffect, useContext } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ImageListItem from '@mui/material/ImageListItem';
import Typography from '@mui/material/Typography';

const tempData = [
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
    {
        title: "A Touch of Darkness",
        author: "Scarlett St. Clair",
        cover_img: "https://covers.openlibrary.org/b/olid/OL28946291M-M.jpg",
        pages: 354,
        edition_key: "OL31995429M"
    },
]



export default function AllBooks({ user }) {


    return (
        <React.Fragment>

            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>

                {tempData.map((book) => (

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