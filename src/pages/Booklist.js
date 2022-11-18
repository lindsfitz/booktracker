import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import API from '../utils/API';
import AppContext from '../AppContext';
import dayjs from 'dayjs'
import { List, ListItem, Divider, Typography, Button, Box, Stack, Rating, Link, Chip, Tooltip } from '@mui/material';
import AddReadDates from './components/modals/AddReadDates';
import ReadingProgress from './components/modals/ReadingProgress';
import Styles from '../utils/Styles';

const bookBoxStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    width: { xs: 3 / 4, sm: 2 / 6 },
    mr: 'auto',
    ml: 'auto'
}


export default function Booklist() {
    const context = useContext(AppContext);
    const params = useParams()

    let navigate = useNavigate()

    const [bookData, setBookData] = useState(null)
    const [title, setTitle] = useState('')
    const [openDates, setOpenDates] = useState(false)
    const [datesBook, setDatesBook] = useState(null)
    const [openProgress, setOpenProgress] = useState(false)
    const [bookProgress, setBookProgress] = useState(null)

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




    const handleOpenProgress = (book) => {
        setOpenProgress(true)
        setBookProgress({
            id: book.id,
            title: book.title,
            author: book.author,
            cover: book.cover_img
        })
    }

    const handleCloseProgress = () => {
        setOpenProgress(false)
    }

    const renderReadShelf = async (id) => {
        const books = await API.getReadList(id)
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

    const listDetails = (book) => {
        switch (params.list) {
            case 'read':
                return (
                    <Box>
                        {book.Reviews.length > 0 ? (<Stack sx={{ alignSelf: 'center' }}>
                            {book.Reviews[0].date_started && <Typography variant='caption' color='text.secondary'>Read Dates: {dayjs(book.Reviews[0].date_started).format('MMM D, YYYY')} - {dayjs(book.Reviews[0].date_finished).format('MMM D, YYYY')}</Typography>}
                            <Stack direction="row" spacing={0} alignItems="center">
                                <Typography component="legend" variant='caption'>Rating:</Typography>
                                <Rating name="half-rating-read" defaultValue={book.Reviews[0].rating} precision={0.5} readOnly />
                            </Stack>
                        </Stack>) : (
                            <Stack sx={{ alignSelf: 'center' }}>
                                <Link onClick={() => handleDatesOpen(book)}>Add read dates </Link>
                            </Stack>
                        )}

                        <Stack sx={{ alignSelf: 'center' }}>
                            <Typography variant='caption' color='text.secondary'>Added on {dayjs(book.ReadBooks[0].MarkedRead.createdAt).format('MMM D, YYYY')}</Typography>
                        </Stack>

                    </Box>
                );
            case 'currently':
                return (
                    <Box>
                        <Stack>
                            <Button variant='outlined' size='mdall' onClick={() => handleOpenProgress(book)}>Update Progress</Button>
                            <Button size='small'>Finished Reading</Button>
                            <Stack sx={{ alignSelf: 'center' }}>
                                <Typography variant='caption' color='text.secondary'>Added on {dayjs(book.CurrentBooks[0].CurrentlyReading.createdAt).format('MMM D, YYYY')}</Typography>
                            </Stack>
                        </Stack>
                    </Box>
                );
            case 'dnf':
                return (
                    <Box>
                        <Stack sx={{ alignSelf: 'center' }}>
                            <Typography variant='caption' color='text.secondary'>Added on {dayjs(book.DNFBooks[0].NotFinished.createdAt).format('MMM D, YYYY')}</Typography>
                        </Stack>
                    </Box>
                );
            case 'owned':
                return (
                    <Box>
                        <Stack sx={{ alignSelf: 'center' }}>
                            <Typography variant='caption' color='text.secondary'>Added on {dayjs(book.OwnedBooks[0].OwnedItems.createdAt).format('MMM D, YYYY')}</Typography>
                        </Stack>
                    </Box>
                );
            default:
                return;
        }
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
            <Typography sx={{ textAlign: 'center', m: 1 }} variant='h6'>{title}</Typography>
            {bookData && <List sx={{ width: { xs: 1/1, md: 4 / 5 }, bgcolor: 'transparent', mr: 'auto', ml: 'auto', mb:'50px' }}>

                {bookData.map((book) => (
                    <React.Fragment>
                        <ListItem key={book.id} id={`${book.title}${params.list}`} alignItems="center">
                            <Box sx={bookBoxStyle}>
                                <Box sx={{
                                    '&:hover': {
                                        cursor: 'pointer'
                                    }
                                }}>
                                    <img
                                        src={`${book.cover_img}`}
                                        // srcSet={`${book.cover_img}`}
                                        alt={`${book.title}`}
                                        loading="lazy"
                                        style={Styles.smallBookCover}
                                        onClick={() => { navigate(`/book/${book.id}`) }}
                                    />
                                </Box>
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
                                        {/* <Tooltip title='Book Info'>
                                            <Button onClick={() => { navigate(`/book/${book.id}`) }}>View Details</Button>
                                        </Tooltip> */}
                                    </Stack>
                                    {listDetails(book)}


                                    <Stack direction='row'>
                                        {book.Shelves.map((shelf) => (
                                            <Tooltip title="View Shelf">
                                                <Chip key={shelf.id} id={shelf.id} size='small' label={shelf.name} variant="outlined" onClick={() => navigate(`/shelf/${shelf.id}`)} />
                                            </Tooltip>
                                        ))}
                                    </Stack>
                                </Box>





                            </Box>
                        </ListItem>
                        <Divider key={`${book.id}-divider`} variant="inset" component="li" />

                    </React.Fragment>
                ))}
            </List>}

            {openDates && <AddReadDates book={datesBook} openDates={openDates} handleDatesClose={handleDatesClose} renderReadShelf={renderReadShelf} />}
            {openProgress && <ReadingProgress book={bookProgress} open={openProgress} handleClose={handleCloseProgress} />}
        </React.Fragment>
    )
}