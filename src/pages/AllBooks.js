import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../AppContext';
import API from '../utils/API'
import { Book } from '@mui/icons-material';
import { List, ListItem, Divider, ListItemText, ImageListItem, Typography } from '@mui/material';

export default function AllBooks() {
    const context = useContext(AppContext);

    const [allBooks, setAllBooks] = useState(null)

    const getBooks = async () => {
        const books = await API.allUserBooks(context.userData.id)
        setAllBooks(books.data)
    }

    useEffect(() => {
        getBooks()
        // console.log(allBooks)
    }, [])


    // changing this entire page -- going to be more of an overview rather than a straight up list of all books
        // eventually this will be profile page? maybe?

    // Currently Reading section @ top again 
    // 'Favorite' Shelf -- can mark one shelf as fav shelf & this is featured on this page 
    // Read
    // Owned
    

    return (
        <React.Fragment>

            {allBooks && <List sx={{ width: '100%', bgcolor: 'background.paper' }}>

                {allBooks.map((book) => (

                    <React.Fragment>
                        <ListItem alignItems="flex-start" key={`${book.id}allbooks`} id={`${book.id}allbooks`}>
                            <List>

                                <ImageListItem key={book.title}>
                                    <img
                                        src={`${book.cover_img}`}
                                        srcSet={`${book.cover_img}`}
                                        alt={`${book.title}`}
                                        loading="lazy"
                                    />
                                </ImageListItem>
                            </List>


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



            </List>}



        </React.Fragment>
    )
}