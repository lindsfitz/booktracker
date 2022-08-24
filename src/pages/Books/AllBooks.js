import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../../AppContext';
import API from '../../utils/API'
import { Book } from '@mui/icons-material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ImageListItem from '@mui/material/ImageListItem';
import Typography from '@mui/material/Typography';
import tempData from '../../utils/tempData';




export default function AllBooks() {
    const context = useContext(AppContext);
    return (
        <React.Fragment>

            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>

                {tempData.books.map((book) => (

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