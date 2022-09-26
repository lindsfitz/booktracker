import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from "react-router-dom";
import AppContext from '../AppContext';
import API from '../utils/API'
import dayjs from 'dayjs'
import {
    Card,
    Button, ButtonGroup, Grow, Popper, MenuItem, MenuList, Rating, CardContent, CardMedia, Typography, Box, Container, Paper, Divider, Switch, Stack, Chip, Link, IconButton, ClickAwayListener, Snackbar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AddReview from './components/AddReview';
import EditReview from './components/EditReview';


// single book page - top section of the page has lots of details about the book (maybe one template for super detailed results from open library, one template for user added books w a bit less detail included)
// bottom section includes any user reviews
// Add Review Button for if no review already exists, otherwise render review
// Maybe this bottom section is conditionally rendered? Aka if no review, render add review button; if review, render review; if button is clicked (or edit btn) render the review form? Not sure exactly what would be best here 
// toggle for Read vs unread books goes here and the rating also goes here 



export default function UserBook() {
    const context = useContext(AppContext);
    const params = useParams();

    const [bookData, setBookData] = useState(null)
    const [reviewData, setReviewData] = useState(false)
    const [reviewForm, setReviewForm] = useState(false)
    const [editReview, setEditReview] = useState(false);
    const [shelfChoices, setShelfChoices] = useState([])
    const [editId, setEditId] = useState(null);
    const [markedRead, setMarkedRead] = useState(false);
    const [markedReading, setMarkedReading] = useState(false)
    const [markedDNF, setMarkedDNF] = useState(false);
    const [markedOwned, setMarkOwned] = useState(false)
    const [markedAs, setMarkedAs] = useState(null)
    const [shelfOpen, setShelfOpen] = useState(false);
    const [markedOpen, setMarkedOpen] = useState(false)
    const anchorRef = useRef(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [snack, setSnack] = useState(false);
    const [snackMessage, setSnackMessage] = useState(null)


    const bookInfo = async () => {
        const book = await API.getBookandShelves(params.id, context.userData.id);
        setBookData(book.data)
        if (book.data.CurrentBooks.length) {
            setMarkedReading(true)
            setMarkedAs('Currently Reading')
        }
        if (book.data.Reviews.length) {
            setReviewData(book.data.Reviews)
            for (let i = 0; i < book.data.Reviews.length; i++) {
                if (book.data.Reviews[i].read === true) {
                    setMarkedRead(true)
                    setMarkedAs('Read')
                }
            }
        }
        if (book.data.OwnedBooks.length) {
            setMarkOwned(true)
        }
        if (book.data.DNFBooks.length) {
            setMarkedDNF(true)
            setMarkedAs('DNF')
        }
        shelfOptions(book.data)
    }

    const shelfOptions = (data) => {
        setShelfChoices([])
        if (!data.Shelves.length) {
            setShelfChoices(context.userShelves)
            return;
        }

        context.userShelves.forEach(shelf => {
            const found = data.Shelves.find(element => element.name === shelf.name)
            if (!found) {
                setShelfChoices(current => [...current, shelf])
            }
        })
    }

    const reviewInfo = async () => {
        const review = await API.getOneReview(context.userData.id, params.id)
        if (review.data.length) {
            setReviewData(review.data)
        }

        for (let i = 0; i < review.data.length; i++) {
            if (review.data[i].read === true) {
                setMarkedRead(true)
            }
        }
    }

    const addToRead = async () => {
        await API.newReview({
            last_update: new Date()
        })
        openSnackbar('Marked As Read')
        bookInfo()
    }

    const addToCurrentlyReading = async () => {
        await API.addCurrentRead({
            userId: context.userData.id,
            bookId: bookData.id
        })
        openSnackbar('Marked As Currently Reading')
        bookInfo()
    }

    const moveToRead = async () => {
        await API.finishedReading({
            UserId: context.userData.id,
            BookId: bookData.id,
            last_update: new Date()
        })
        openSnackbar('Marked As Read')
        bookInfo()
    }

    const moveToDNF = async () => {
        console.log('hi')
    }

    const addToShelf = async (e) => {
        await API.addtoShelf(e.target.id, { id: bookData.id })
        setShelfOpen(false);
        openSnackbar(`Added to ${e.target.textContent}`)
        bookInfo()
    }

    const deleteReview = async (id) => {
        await API.deleteReview(id)
        openSnackbar('Review Removed')
        reviewInfo()
    }

    const removeFromShelf = async (shelfName, shelfId) => {
        await API.removefromShelf(shelfId, bookData.id)
        openSnackbar(`Removed from ${shelfName}`)
        bookInfo()
    }

    const toggleReviewForm = () => {
        setReviewForm(!reviewForm)
    }

    const toggleEditForm = (id) => {
        setEditId(id)
        setEditReview(!editReview)
    }

    const toggleShelfMenu = () => {
        setShelfOpen((prevOpen) => !prevOpen);
    };

    const closeShelfMenu = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setShelfOpen(false);
    };

    // const toggleMarkedMenu = () => {
    //     setMarkedOpen((prevOpen) => !prevOpen);
    // };

    // const closeMarkedMenu = (event) => {
    //     if (anchorRef.current && anchorRef.current.contains(event.target)) {
    //         return;
    //     }
    //     setMarkedOpen(false);
    // };

    const openSnackbar = (message) => {
        setSnackMessage(message)
        setSnack(true)
    }

    useEffect(() => {
        bookInfo()
    }, [params.id])


    // useEffect - runs when snack state changes, timer to remove snackbar after 1sec
    useEffect(() => {
        const timer = setTimeout(() => {
            console.log('timer is running')
            setSnack(false)
        }, 1000);
        return () => clearTimeout(timer);
    }, [snack])


    // **** CONDITIONALS ********
    // Book data includes: book specific info, shelves book is currently on, if book is marked as read, currently reading, or DNF, if a book if marked as owned
    /* If book isnt marked as anything yet:
            API.addCurrentRead; API.addToDNF; API.addOwnedBook; (mark as read-already a function for this)
    */
    /*  *** Can mark a book as 'Owned' at any time! 
            - Has 'Owned' lil flag -- can click x to remove from owned list
                - API.removeFromOwned
    */
    /* IF BOOK IS MARKED AS CURRENTLY READING:
        - Has lil marked as: currently reading flag
        - CAN: 
            -Mark as Read --> removed from CR, posts new review with just read: true, public: false, last update set to now (API.finishedReading)
            -Add Review --> currently is not removing from CR, need to fix that. Once removed from CR, posts new review via review form 
            -Mark as DNF --> removed from CR, added to DNF (API.didNotFinish)
    */

    /* IF A BOOK IS MARKED AS READ:
        -Has lil marked as: read flag
        -CAN:
            - Add Review 
    */

    /* IF A BOOK IS MARKED AS DNF:
        - Has lil marked as: DNF flag
        - CAN: 
            - Add Review (Note -- read:false, public:false)
            - Remove from DNF List (API.removeFromDNF)
    */

    // const markedAsOptions = () => {
    //     switch (markedAs) {
    //         case 'Currently Reading':
    //             return (
    //                 <React.Fragment>
    //                     <MenuItem onClick={moveToRead}>Read</MenuItem>
    //                     <MenuItem onClick={moveToDNF}>DNF</MenuItem>
    //                     <MenuItem>Remove</MenuItem>
    //                 </React.Fragment>
    //             );
    //         case 'DNF':
    //             return (
    //                 <React.Fragment>
    //                     <MenuItem onClick={moveToRead}>Read</MenuItem>
    //                     <MenuItem>Reading</MenuItem>
    //                     <MenuItem>Remove</MenuItem>
    //                 </React.Fragment>
    //             );
    //         case 'Read':
    //             return (
    //                 <React.Fragment>
    //                     <MenuItem>Reading</MenuItem>
    //                     <MenuItem>DNF</MenuItem>
    //                     <MenuItem>Remove</MenuItem>
    //                 </React.Fragment>
    //             );
    //         default:
    //             return (
    //                 <React.Fragment>
    //                     <MenuItem onClick={addToCurrentlyReading}>Reading</MenuItem>
    //                     <MenuItem onClick={addToRead}>Read</MenuItem>
    //                     <MenuItem onClick={moveToDNF}>DNF</MenuItem>
    //                 </React.Fragment>
    //             )

    //     }
    // }

    const bookBtnOptions = () => {
        switch (markedAs) {
            case 'Currently Reading':
                return (
                    <React.Fragment>
                        <Button onClick={moveToRead}>Mark As Read</Button>
                        <Button onClick={moveToDNF}>Mark As DNF</Button>
                        <Button onClick={toggleReviewForm}>Add A Review</Button>
                        <Button>Remove From Currently Reading</Button>
                    </React.Fragment>
                );
            case 'DNF':
                return (
                    <React.Fragment>
                        <Button>Remove From DNF</Button>
                        <Button onClick={toggleReviewForm}>Add A Review</Button>
                    </React.Fragment>
                );
            case 'Read':
                return (
                    <React.Fragment>
                        <Button>Remove From DNF</Button>
                        <Button onClick={toggleReviewForm}>Add A Review</Button>
                    </React.Fragment>
                );
            default:
                return (
                    <React.Fragment>
                        <Button onClick={addToCurrentlyReading}>Add To Currently Reading</Button>
                        <Button onClick={addToRead}>Mark As Read</Button>
                        <Button onClick={moveToDNF}>Mark As DNF</Button>
                        <Button onClick={toggleReviewForm}>Add A Review</Button>
                    </React.Fragment>
                )

        }

    }


    return (
        <React.Fragment>
            {bookData && <div>
                {/* ----BOOK DETAILS @ TOP---- */}
                <Container
                    sx={{
                        display: "flex", flexDirection: { xs: 'column', md: 'row' },
                        m: { xs: 1, md: 3 }, p: { xs: 0, md: 2 }
                    }}>
                    <Card sx={{ maxWidth: { xs: 250, md: 345 }, minWidth: { xs: 240 }, alignSelf: 'center' }} >
                        <CardContent>
                            <CardMedia
                                component="img"
                                // height="194"
                                image={`${bookData.cover_img}`}
                                alt={`${bookData.title}`}
                            />
                        </CardContent>
                    </Card>
                    <Box sx={{ maxWidth: { xs: 1 / 1, md: 3 / 5 }, p: 4 }}>
                        <Typography gutterBottom variant="h5" component="div">
                            {bookData.title}
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary">
                            by {bookData.author}
                        </Typography>
                        <Divider />
                        <Typography variant="caption" color="text.secondary">
                            Pages: {bookData.pages}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Published: {bookData.published}
                        </Typography>
                        <Divider />
                        <Typography variant='body2'>
                            {bookData.description}
                        </Typography>

                    </Box>

                </Container>


                {/* ----CONDITIONALS FOR READ/READING & SHELVES---- */}
                {bookData.Shelves &&
                    <Stack direction="row" spacing={2} sx={{ mb: 3, ml: 5 }}>
                        {markedRead &&
                            <Stack spacing={0}>
                                <Typography variant='caption'>Marked As:</Typography>
                                <Chip label='Read' />
                            </Stack>
                        }
                        {markedReading &&
                            <Stack spacing={0}>
                                <Typography variant='caption'>Marked As:</Typography>
                                <Chip label='Currently Reading' />
                            </Stack>
                        }
                        {markedDNF &&
                            <Stack spacing={0}>
                                <Typography variant='caption'>Marked As:</Typography>
                                <Chip label='DNF' />
                            </Stack>
                        }
                        <Stack spacing={0}>
                            <Typography variant='caption'>On Shelves:</Typography>
                            <Stack direction={{ xs: 'column', md: 'row' }}>
                                {bookData.Shelves.map((shelf) => (
                                    <Chip key={`${shelf.name}${shelf.id}`} id={shelf.id} label={shelf.name} variant="outlined" onDelete={(event) => removeFromShelf(shelf.name, shelf.id)} />
                                ))}
                            </Stack>
                        </Stack>
                    </Stack>}



                <Divider />

                {/* ---- ADD NEW REVIEW FORM COMPONENT ---- */}
                {reviewForm ? (<div>
                    <AddReview reviewInfo={reviewInfo} toggleReviewForm={toggleReviewForm} />
                    <Button onClick={toggleReviewForm}>Cancel</Button>
                </div>) : (<div>
                    <Stack direction='row' spacing={1}>


                        <ButtonGroup variant="text" aria-label="text button group" ref={anchorRef}>
                            <Button onClick={toggleShelfMenu}>Add to Shelf</Button>
                            <Button
                                size="small"
                                aria-controls={shelfOpen ? 'split-button-menu' : undefined}
                                aria-expanded={shelfOpen ? 'true' : undefined}
                                aria-label="select merge strategy"
                                aria-haspopup="menu"
                                onClick={toggleShelfMenu}
                            >
                                <ArrowDropDownIcon />
                            </Button>
                        </ButtonGroup>
                        <Popper
                            sx={{
                                zIndex: 1,
                            }}
                            open={shelfOpen}
                            anchorEl={anchorRef.current}
                            role={undefined}
                            transition
                            disablePortal
                        >
                            {({ TransitionProps, placement }) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{
                                        transformOrigin:
                                            placement === 'bottom' ? 'center top' : 'center bottom',
                                    }}
                                >
                                    <Paper>
                                        <ClickAwayListener onClickAway={closeShelfMenu}>
                                            <MenuList id="split-button-menu" autoFocusItem>
                                                {shelfChoices.map((shelf, index) => (
                                                    <MenuItem
                                                        key={shelf.name}
                                                        id={shelf.id}
                                                        selected={index === selectedIndex}
                                                        onClick={(event) => addToShelf(event)}
                                                    >
                                                        {shelf.name}
                                                    </MenuItem>
                                                ))}
                                            </MenuList>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>


                        {/* <ButtonGroup variant="text" aria-label="text button group" ref={anchorRef}>
                            <Button onClick={toggleMarkedMenu}>Mark As</Button>
                            <Button
                                size="small"
                                aria-controls={markedOpen ? 'split-button-menu' : undefined}
                                aria-expanded={markedOpen ? 'true' : undefined}
                                aria-label="select merge strategy"
                                aria-haspopup="menu"
                                onClick={toggleMarkedMenu}
                            >
                                <ArrowDropDownIcon />
                            </Button>
                        </ButtonGroup>
                        <Popper
                            sx={{
                                zIndex: 1,
                            }}
                            open={markedOpen}
                            anchorEl={anchorRef.current}
                            role={undefined}
                            transition
                            disablePortal
                        >
                            {({ TransitionProps, placement }) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{
                                        transformOrigin:
                                            placement === 'bottom' ? 'center top' : 'center bottom',
                                    }}
                                >
                                    <Paper>
                                        <ClickAwayListener onClickAway={closeMarkedMenu}>
                                            <MenuList id="split-button-menu" autoFocusItem>
                                               { markedAsOptions()}
                                            </MenuList>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper> */}


                        {bookBtnOptions()}

                        <Divider orientation='vertical' />

                        {!markedOwned && <Button>Mark As Owned</Button>}

                    </Stack>

                    {/* {!markedRead && !markedReading &&
                        <React.Fragment>
                            <Button onClick={addToCurrentlyReading}>Add To Currently Reading</Button>
                            <Button onClick={addToRead}>Mark As Read</Button>
                        </React.Fragment>
                    }
                    {!markedRead && markedReading &&
                        <React.Fragment>
                            <Button onClick={moveToRead}>Mark As Read</Button>
                        </React.Fragment>
                    }
                    <Button onClick={toggleReviewForm}>Add A Review</Button> */}
                </div>)
                }
                <Divider />


                {/* ---- REVIEWS SECTION ---- */}
                <Container>
                    {!reviewData && !reviewForm && <div style={{ margin: '30px auto 0 auto', textAlign: 'center' }}>
                        <Typography variant='subtitle2'>
                            It looks like you haven't reviewed this book yet.
                        </Typography>

                        <Link variant='subtitle2' onClick={toggleReviewForm}>Add Your Thoughts</Link>
                    </div>}


                    {reviewData && <Container>
                        <Typography variant='subtitle1'>
                            Your Reviews:
                        </Typography>
                        {reviewData.map((review) => (
                            <Paper key={`${review.id}${review.UserId}`} elevation={6} sx={{ width: { xs: 3 / 4, md: 3 / 5 }, p: 2 }}>
                                {editId !== review.id && <Container>
                                    <Stack direction='row' justifyContent="space-between">
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Typography variant='caption'>Unread</Typography>
                                            <Switch name='read'
                                                id='read'
                                                checked={review.read}
                                                size='small'
                                                disabled />
                                            <Typography variant='caption'>Read</Typography>
                                        </Stack>

                                        <Stack spacing={0.5} direction="row" alignItems="center">
                                            <IconButton onClick={() => toggleEditForm(review.id)} aria-label="delete" size="small">
                                                <EditIcon fontSize="inherit" />
                                            </IconButton>
                                            <IconButton onClick={() => deleteReview(review.id)} aria-label="delete" size="small">
                                                <DeleteIcon fontSize="inherit" />
                                            </IconButton>
                                        </Stack>
                                    </Stack>

                                    <Box sx={{ p: 2, mt: 1 }}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, md: 3 }} alignItems='center' justifyContent="center">
                                                <Stack direction="row" spacing={0} alignItems="center">
                                                    <Typography component="legend" variant='caption'>Rated It:</Typography>
                                                    <Rating name="half-rating-read" defaultValue={review.rating} precision={0.5} readOnly />
                                                </Stack>
                                                <Typography variant='caption'>On {dayjs(review.last_update).format('MMMM D, YYYY')}</Typography>
                                            </Stack>

                                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, md: 3 }} justifyContent='center' sx={{ m: 1, p: 1 }}>
                                                {review.format && <Chip label={`Format: ${review.format}`} variant='outlined' />}
                                                {review.series && <Chip label={`Series: ${review.series}`} variant='outlined' />}
                                            </Stack>
                                            {review.date_started && review.date_finished &&
                                                <Typography variant='caption'>Read From: {dayjs(review.date_started).format('MMM D, YYYY')} - {dayjs(review.date_finished).format('MMM D, YYYY')}</Typography>}
                                        </Box>

                                        {review.review && <Typography variant="subtitle1" color="text.secondary">
                                            {review.review}
                                        </Typography>}
                                    </Box>

                                </Container>}

                                {editId === review.id &&
                                    <EditReview reviewData={review} setEditReview={setEditReview} reviewInfo={reviewInfo} setEditId={setEditId} />
                                }
                            </Paper>
                        ))}
                    </Container>}
                </Container>

            </div>}

            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
                open={snack}
                // onClose={handleClose}
                message={snackMessage}
                key={snackMessage}
            />


        </React.Fragment>
    )
}