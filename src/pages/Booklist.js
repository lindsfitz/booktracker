import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import API from '../utils/API';
import AppContext from '../AppContext';
import { List, ListItem, Divider, ListItemText, Typography, Button } from '@mui/material';


export default function Booklist() {
    const context = useContext(AppContext);
    const params = useParams()
    let navigate = useNavigate()

    const [bookData, setBookData] = useState(null)

    const renderReadShelf = async () => {
        const books = await API.allReadBooks(context.userData.id)
        setBookData(books.data)
    }

    const renderCurrentlyReading = async () => {
        const books = await API.currentlyReading(context.userData.id)
        setBookData(books.data)
    }

    useEffect(() => {
        if (params.list === 'read') {
            renderReadShelf()
        }

        if (params.list === 'currently') {
            renderCurrentlyReading()
        }
    }, [])

    return (
        <React.Fragment>
            {bookData && <List sx={{ width: '100%', bgcolor: 'background.paper' }}>

                {bookData.map((book) => (
                    <React.Fragment>
                        <ListItem key={`${book.title}${params.list}`} id={`${book.title}${params.list}`} alignItems="flex-start">
                            <img
                                src={`${book.cover_img}`}
                                srcSet={`${book.cover_img}`}
                                alt={`${book.title}`}
                                loading="lazy"
                                onClick={() => { navigate(`/book/${book.id}`) }}
                            />
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

                            <Button onClick={() => { navigate(`/book/${book.id}`) }}>View More</Button>
                        </ListItem>
                        <Divider variant="inset" component="li" />

                    </React.Fragment>
                ))}
            </List>}
        </React.Fragment>
    )
}