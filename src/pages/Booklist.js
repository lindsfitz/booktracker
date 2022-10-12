import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import API from '../utils/API';
import AppContext from '../AppContext';
import dayjs from 'dayjs'
import { List, ListItem, Divider, Typography, Button, Box, Stack, Rating, Link, Chip } from '@mui/material';
import AddReadDates from './components/modals/AddReadDates';


export default function Booklist() {
    const context = useContext(AppContext);
    const params = useParams()

    let navigate = useNavigate()

    const [bookData, setBookData] = useState(null)
    const [title, setTitle] = useState('')
    const [openDates, setOpenDates] = useState(false)
    const [datesBook, setDatesBook] = useState(null)

    const handleDatesOpen = (book) => {
        setOpenDates(true);
        setDatesBook({
            id: book.id,
            title: book.title,
            author: book.author,
            cover: book.cover_img
        })
      };
    
      const handleDatesClose = () => {
        setOpenDates(false);
      };

    const renderReadShelf = async (id) => {
        // const books = await API.getReadList(context.userData.id)
        const books = await API.newReadList(id)
        // console.log(books.data)
        setBookData(books.data)
    }

    const renderCurrentlyReading = async (id) => {
        const books = await API.getReadingList(id)
        setBookData(books.data)
    }

    const renderDNF = async (id) => {
        const books = await API.getDNFList(id)
        setBookData(books.data)
    }

    const renderOwned = async (id) => {
        const books = await API.getOwnedList(id)
        setBookData(books.data)
    }

    useEffect(() => {
        switch (params.list) {
            case 'read':
                renderReadShelf(context.userData.id)
                setTitle('Read')
                break;
            case 'currently':
                renderCurrentlyReading(context.userData.id)
                setTitle('Currently Reading')
                break;
            case 'dnf':
                renderDNF(context.userData.id)
                setTitle('Did Not Finish')
                break;
            case 'owned':
                renderOwned(context.userData.id)
                setTitle('Owned')
                break;
            default:
                navigate('/login')
                break;

        }
    }, [params.list, context.userData])

    return (
        <React.Fragment>
            <Typography variant='h6'>{title}</Typography>
            {bookData && <List sx={{ width: { xs: 7 / 8, md: 4 / 5 }, bgcolor: 'transparent', mr: 'auto', ml: 'auto' }}>

                {bookData.map((book) => (
                    <React.Fragment>
                        <ListItem key={book.id} id={`${book.title}${params.list}`} alignItems="center">
                            <Box sx={{ display: 'flex', justifyContent: 'center', mr: 'auto', ml: 'auto' }}>
                                <img
                                    src={`${book.cover_img}`}
                                    srcSet={`${book.cover_img}`}
                                    alt={`${book.title}`}
                                    loading="lazy"
                                    style={{ height: 218, width: 148 }}
                                    onClick={() => { navigate(`/book/${book.id}`) }}
                                />
                                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', ml: 2 }}>
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
                                    {params.list === 'read' &&
                                        <Box>
                                            {book.Reviews.length > 0 ? (<Stack sx={{ alignSelf: 'center' }}>
                                                {book.Reviews[0].date_started && <Typography variant='caption' color='text.secondary'>Read Dates: {dayjs(book.Reviews[0].date_started).format('MMM D, YYYY')} - {dayjs(book.Reviews[0].date_finished).format('MMM D, YYYY')}</Typography>}
                                                <Stack direction="row" spacing={0} alignItems="center">
                                                    <Typography component="legend" variant='caption'>Rating:</Typography>
                                                    <Rating name="half-rating-read" defaultValue={book.Reviews[0].rating} precision={0.5} readOnly />
                                                </Stack>
                                            </Stack>) : (
                                                <Stack sx={{ alignSelf: 'center' }}>
                                                    <Link onClick={()=> handleDatesOpen(book)}>Add read dates </Link>
                                                    {/* <Typography variant='caption'>to count this book towards your Reading Activity</Typography> */}
                                                    {/* <Typography component="legend" variant='caption'>Rating:</Typography> */}



                                                </Stack>
                                            )}

                                            <Stack direction='row'>
                                                {book.Shelves.map((shelf) => (
                                                    <Chip key={shelf.id} id={shelf.id} label={shelf.name} variant="outlined" onClick={() => navigate(`/shelf/${shelf.id}`)} />
                                                ))}
                                            </Stack>

                                            <Stack sx={{ alignSelf: 'center' }}>
                                                <Typography variant='caption' color='text.secondary'>Added on {dayjs(book.ReadBooks[0].MarkedRead.createdAt).format('MMM D, YYYY')}</Typography>
                                            </Stack>

                                        </Box>
                                    }
                                </Box>





                            </Box>
                        </ListItem>
                        <Divider key={`${book.id}-divider`} variant="inset" component="li" />

                    </React.Fragment>
                ))}
            </List>}

            {openDates && <AddReadDates book={datesBook} openDates={openDates} handleDatesClose={handleDatesClose} renderReadShelf={renderReadShelf} />}
        </React.Fragment>
    )
}