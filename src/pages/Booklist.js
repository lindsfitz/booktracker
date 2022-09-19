import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import API from '../utils/API';
import AppContext from '../AppContext';
import dayjs from 'dayjs'
import { List, ListItem, Divider, ListItemText, Typography, Button, Box, Stack, Rating } from '@mui/material';


export default function Booklist() {
    const context = useContext(AppContext);
    const params = useParams()
    let navigate = useNavigate()

    const [bookData, setBookData] = useState(null)
    const [title, setTitle] = useState('')

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
            setTitle('Read')
        }

        if (params.list === 'currently') {
            renderCurrentlyReading()
            setTitle('Currently Reading')
        }
    }, [])

    return (
        <React.Fragment>
            <Typography variant='h6'>{title}</Typography>
            {bookData && <List sx={{ width: { xs: 7 / 8, md: 4 / 5 }, bgcolor: 'transparent', mr: 'auto', ml: 'auto' }}>

                {bookData.map((book) => (
                    <React.Fragment>
                        <ListItem key={`${book.title}${params.list}`} id={`${book.title}${params.list}`} alignItems="center">
                            <Box sx={{ display: 'flex', justifyContent:'center', mr:'auto', ml:'auto' }}>
                                <img
                                    src={`${book.cover_img}`}
                                    srcSet={`${book.cover_img}`}
                                    alt={`${book.title}`}
                                    loading="lazy"
                                    style={{height:218, width:148}}
                                    onClick={() => { navigate(`/book/${book.id}`) }}
                                />
                                <Box sx={{ display: 'flex', flexDirection:'column', justifyContent:'center', textAlign:'center', ml: 2  }}>
                                    <Stack sx={{ alignSelf: 'center', ml: 1 }}>
                                        <Typography variant='subtitle1'>{book.title}</Typography>
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {book.author}
                                        </Typography>
                                        <Button onClick={() => { navigate(`/book/${book.id}`) }}>View Details</Button>
                                    </Stack>
                                   {params.list === 'read' && <Stack sx={{ alignSelf: 'center' }}>
                                        {book.Reviews[0].date_started && <Typography variant='caption' color='text.secondary'>Read Dates: {dayjs(book.Reviews[0].date_started).format('MMM D, YYYY')} - {dayjs(book.Reviews[0].date_finished).format('MMM D, YYYY')}</Typography>}
                                        <Stack direction="row" spacing={0} alignItems="center">
                                            <Typography component="legend" variant='caption'>Rating:</Typography>
                                            <Rating name="half-rating-read" defaultValue={book.Reviews[0].rating} precision={0.5} readOnly />
                                        </Stack>
                                    </Stack>}
                                </Box>





                            </Box>
                        </ListItem>
                        <Divider variant="inset" component="li" />

                    </React.Fragment>
                ))}
            </List>}
        </React.Fragment>
    )
}