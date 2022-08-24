// basically just lists of books
// can also add new book here but it adds it to the user specifically 
// maybe drag and drop for positioning / organizing on this page ?? 
// add/view reviews in pop up on this page maybe??? 
// Or separate page for individual books w review idk 

import React, { useState, useEffect, useContext } from 'react';
import API from '../utils/API';
import AppContext from '../AppContext';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ImageListItem from '@mui/material/ImageListItem';
import Typography from '@mui/material/Typography';
import tempData from '../utils/tempData';


export default function Shelf() {
    const context = useContext(AppContext);


    return (
        <React.Fragment>
            <h1>{tempData.shelf.name}</h1>
            <h4>{tempData.shelf.description}</h4>

            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>

                {tempData.shelf.Books.map((book) => (

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