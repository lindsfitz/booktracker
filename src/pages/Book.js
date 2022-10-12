import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from "react-router-dom";
import AppContext from '../AppContext';
import API from '../utils/API'
import AddShelf from './components/modals/AddShelf'
// import dayjs from 'dayjs'
import {
    // Card,Box,CardContent, IconButton,
    Button, ButtonGroup, Grow, Popper, MenuItem, MenuList, Typography, Container, Paper, Divider, Stack, Chip, Link, ClickAwayListener, Snackbar
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AddReview from './components/modals/AddReview';
import Review from './components/Review';
import BookInfo from './components/BookInfo';


export default function Book() {
    const context = useContext(AppContext);
    const params = useParams();
    const location = useLocation()
    let navigate = useNavigate();


    /* data states used for both */
    const [bookData, setBookData] = useState(null)
    const [shelfChoices, setShelfChoices] = useState([])
    const [reviewForm, setReviewForm] = useState(false)
    const [dbBook, setdbBook] = useState(false)


    /* only if book exists in db & user associated */
    const [reviewData, setReviewData] = useState(false)
    const [markedAs, setMarkedAs] = useState(null)
    const [markedOwned, setMarkOwned] = useState(false)


    /* component states -- for snackbar/popups on page */
    const [shelfOpen, setShelfOpen] = useState(false);
    const [markOpen, setMarkOpen] = useState(false);
    const shelfRef = useRef(null);
    const markedRef = useRef(null)
    const [snack, setSnack] = useState(false);
    const [snackMessage, setSnackMessage] = useState(null)



    /* --------------------------USERBOOK-------------------- */


    const dbBookInfo = useCallback(async (id) => {
        const book = await API.getBookandShelves(id, context.userData.id);
        setBookData(book.data)
        setShelfChoices([])
        console.log(book.data)
        if (book.data.CurrentBooks.length) {
            setMarkedAs('Currently Reading')
        }
        if (book.data.ReadBooks.length) {
            setMarkedAs('Read')
        }
        if (book.data.Reviews.length) {
            setReviewData(book.data.Reviews)
            for (let i = 0; i < book.data.Reviews.length; i++) {
                if (book.data.Reviews[i].read === true) {
                    setMarkedAs('Read & Reviewed')
                }
            }
        }
        if (book.data.OwnedBooks.length) {
            setMarkOwned(true)
        }
        if (book.data.DNFBooks.length) {
            setMarkedAs('DNF')
        }

        if (!book.data.Shelves.length) {
            setShelfChoices(context.userShelves)
            return;
        } else {
            context.userShelves.forEach(shelf => {
                const found = book.data.Shelves.find(element => element.name === shelf.name)
                if (!found) {
                    setShelfChoices(current => [...current, shelf])
                }
            })
        }

        // shelfOptions(book.data)
    },[context.userData.id, context.userShelves])

    // const shelfOptions = (data) => {
    //     if (!data.Shelves.length) {
    //         setShelfChoices(context.userShelves)
    //         return;
    //     }
    //     context.userShelves.forEach(shelf => {
    //         const found = data.Shelves.find(element => element.name === shelf.name)
    //         if (!found) {
    //             setShelfChoices(current => [...current, shelf])
    //         }
    //     })
    // }

    const chipOptions = () => {
        switch (markedAs) {
            case 'Currently Reading':
                return (
                    <Stack spacing={0}>
                        <Typography variant='caption'>Marked As:</Typography>
                        <Chip label='Currently Reading' />
                    </Stack>
                );
            case 'DNF':
                return (
                    <Stack spacing={0}>
                        <Typography variant='caption'>Marked As:</Typography>
                        <Chip label='DNF' />
                    </Stack>
                );
            case 'Read':
                return (
                    <Stack spacing={0}>
                        <Typography variant='caption'>Marked As:</Typography>
                        <Chip label='Read' />
                    </Stack>
                );
            case 'Read & Reviewed':
                return (
                    <Stack spacing={0}>
                        <Typography variant='caption'>Marked As:</Typography>
                        <Chip label='Read' />
                    </Stack>
                );
            default:
                return (
                    <React.Fragment>
                    </React.Fragment>
                )
        }
    }

    /* JUST being defined here to pass into Add Review & Review components */
    const reviewInfo = async () => {
        let bookId;
        if (dbBook) {
            bookId = bookData.id
        } else {
            const book = await addBook();
            bookId = book.data.id
        }
        const review = await API.getOneReview(context.userData.id, bookId)
        if (review.data.length) {
            setReviewData(review.data)
        }

        for (let i = 0; i < review.data.length; i++) {
            if (review.data[i].read === true) {
                setMarkedAs('Read')
            }
        }
    }

    /* ------------------------------------------------------------ */


    /* --------------------------RESULTBOOK-------------------- */



    /* ------------------------------------------------------------ */


    /* --------------------------BTN FUNCTIONS-------------------- */

    const markedMenuOptions = () => {
        switch (markedAs) {
            case 'Currently Reading':
                return ([<MenuItem key={'read'} onClick={markRead}>Read</MenuItem>,
                <MenuItem key={'dnf'} onClick={markDNF}>DNF</MenuItem>,
                <MenuItem key={'remove'} onClick={removeBook}>Remove</MenuItem>])

            case 'DNF':
                return ([<MenuItem onClick={markCurrentlyReading}>Reading</MenuItem>,
                <MenuItem key={'read'} onClick={markRead}>Read</MenuItem>,
                <MenuItem key={'remove'} onClick={removeBook}>Remove</MenuItem>])


            case 'Read':
                return ([<MenuItem key={'reading'} onClick={markCurrentlyReading}>Reading</MenuItem>,
                <MenuItem key={'dnf'} onClick={markDNF}>DNF</MenuItem>,
                <MenuItem key={'remove'} onClick={removeRead}>Remove</MenuItem>])

            case 'Read & Reviewed':
                return ([<MenuItem key={'reading'} onClick={markCurrentlyReading}>Reading</MenuItem>,
                <MenuItem key={'dnf'} onClick={markDNF}>DNF</MenuItem>,
                <MenuItem key={'remove'} onClick={removeRead}>Remove</MenuItem>])


            default:

                return ([<MenuItem key={'reading'} onClick={markCurrentlyReading}>Reading</MenuItem>,
                <MenuItem key={'read'} onClick={markRead}>Read</MenuItem>,
                <MenuItem key={'dnf'} onClick={markDNF}>DNF</MenuItem>])
        }
    }

    const addToShelf = async (e) => {
        let bookId;
        if (dbBook) {
            bookId = bookData.id
        } else {
            const book = await addBook();
            bookId = book.data.id
        }
        const shelfAdd = await API.addtoShelf(e.target.id, { id: bookId })
        setShelfOpen(false);
        if (shelfAdd.data.message) {
            console.log('wow added to shelf')
            openSnackbar(`Added to ${e.target.textContent}`)
        }
        if (shelfAdd.data.name === "SequelizeUniqueConstraintError") {
            openSnackbar(`Already Shelved on ${e.target.textContent}`)
        }
        dbBookInfo(bookId)
    }

    const removeFromShelf = async (shelfName, shelfId) => {
        await API.removefromShelf(shelfId, bookData.id)
        openSnackbar(`Removed from ${shelfName}`)
        // bookInfo()
        dbBookInfo(bookData.id)

    }

    const markCurrentlyReading = async () => {
        let bookId;
        if (dbBook) {
            bookId = bookData.id
        } else {
            const book = await addBook();
            bookId = book.data.id
        }

        if (markedAs === 'DNF') {
            removeDNF()
        }

        if (markedAs === 'Read') {
            removeRead()
        }

        await API.addCurrentRead({
            userId: context.userData.id,
            bookId: bookId
        })
        openSnackbar('Marked As Currently Reading')
        setMarkedAs('Currently Reading')
        dbBookInfo(bookId)
    }

    const markRead = async () => {
        let bookId;
        if (dbBook) {
            bookId = bookData.id
        } else {
            const book = await addBook();
            bookId = book.data.id
        }

        if (markedAs === 'DNF') {
            removeDNF()
        }

        if (markedAs === 'Currently Reading') {
            removeReading()
        }

        await API.addRead({
            userId: context.userData.id,
            bookId: bookId
        })

        openSnackbar('Marked As Read')
        dbBookInfo(bookId)
    }


    const markDNF = async () => {
        let bookId;
        if (dbBook) {
            bookId = bookData.id
        } else {
            const book = await addBook();
            bookId = book.data.id
        }

        if (markedAs === 'Read') {
            removeRead()
        }

        if (markedAs === 'Currently Reading') {
            removeReading()
        }

        await API.addDNF({
            userId: context.userData.id,
            bookId: bookId
        })
        .catch(console.error)

        openSnackbar('Marked As DNF')
        dbBookInfo(bookId)
    }


    const removeDNF = async () => {
        await API.removeFromDNF(context.userData.id, bookData.id)
        .catch(console.error)
    }

    const removeReading = async () => {
        await API.removeCurrentlyReading(context.userData.id, bookData.id)
        .catch(console.error)
    }

    const removeRead = async () => {
        console.log('remove from read')
        if (reviewData) {
            const reviews = reviewData.filter(review => review.read === true)
            console.log(reviews)

            reviews.forEach(async review => {
                await API.editReview({ read: false }, review.id)
            })
        }

        await API.removeRead(context.userData.id, bookData.id)
        .catch(console.error)
    }

    const removeBook = async () => {
        switch (markedAs) {
            case 'Currently Reading':
                removeReading()
                openSnackbar('Book Removed')
                break;
            case 'DNF':
                removeDNF()
                openSnackbar('Book Removed')
                break;
            case 'Read':
                removeRead()
                openSnackbar('Book Removed')
                break;
            default:
                return;
        }

    }

    const addOwned = async () => {
        let bookId;
        if (dbBook) {
            bookId = bookData.id
        } else {
            const book = await addBook();
            bookId = book.data.id
        }
        await API.addOwned({
            userId: context.userData.id,
            bookId: bookId
        })
        .catch(console.error)
        openSnackbar('Added to Owned List')
        setMarkOwned(true)
    }

    const removeOwned = async () => {
        await API.removeFromOwned(context.userData.id, bookData.id)
        .catch(console.error)
        setMarkOwned(false)
        openSnackbar('Removed from Owned List')
    }


    /* ------------------------------------------------------------ */

    /* --------------------------COMPONENT FUNCTIONS----------------- */
    const toggleReviewForm = () => {
        setReviewForm(!reviewForm)
    }

    const toggleShelfMenu = () => {
        setShelfOpen((prevOpen) => !prevOpen);
    };

    const closeShelfMenu = (event) => {
        if (shelfRef.current && shelfRef.current.contains(event.target)) {
            return;
        }
        setShelfOpen(false);
    };

    const toggleMarkMenu = () => {
        setMarkOpen((prev) => !prev)
    }

    const closeMarkMenu = (event) => {
        if (markedRef.current && markedRef.current.contains(event.target)) {
            return;
        }
        setMarkOpen(false);
    }

    const openSnackbar = (message) => {
        setSnackMessage(message)
        setSnack(true)
    }



    /* ------------------------------------------------------------ */


    const addBook = async () => {
        const newBook = {
            title: bookData.title,
            author: bookData.author,
            author_key: bookData.author_key,
            description: bookData.description,
            cover_img: bookData.cover_img,
            pages: bookData.pages,
            published: bookData.published,
            ol_key: bookData.ol_key,
            isbn: bookData.isbn
        }

        const postBook = await API.newBook(newBook)

        return postBook
    }

    const bookCheckById = async (id) => {
        const bookcheck = await API.oneBookById(id)
        return bookcheck;
    }

    const bookCheckByInfo = async (id, title, author) => {
        const bookcheck = await API.oneBookByInfo(id, {
            title: title,
            author: author
        })
        return bookcheck;
    }

    useEffect(() => {

        const olBookInfo = async (id) => {
            // params.id will be the OL 'books' key -- edition_key[0]
            let cover = null;
            let description = null;
            // bibkeys -- title, authors name, isbn13, publish date, publisher name at least 
            // CAN also include number of pages, subjects, cover
            const bibkeys = await API.olBookBibKeys(id)
            const OLID = Object.keys(bibkeys.data)
            const bibkeyData = bibkeys.data[OLID[0]]
            console.log(bibkeyData)
            if (bibkeyData.cover) {
                cover = bibkeyData.cover.medium
            }
            // books -- includes series, works key
            // CAN also include -- covers [0] for cover id 
            const book = await API.olBookBooks(id)
            console.log(book.data)
    
            // literally just to pull the description 
            // can also include covers[0]
            const works = await API.olBookWorks(book.data.works[0].key)
            console.log(works.data)
            if (!bibkeyData.cover && works.data.covers) {
                cover = `https://covers.openlibrary.org/b/id/${works.data.covers[0]}-M.jpg`
            }
    
            if (works.data.description) {
                if (works.data.description.value) {
                    description = works.data.description.value
                } else {
                    description = works.data.description
                }
            }
    
            setBookData({
                title: works.data.title,
                cover_img: cover,
                author: bibkeyData.authors[0].name,
                author_key: bibkeyData.authors[0].key,
                published: bibkeyData.publish_date || location.state.published,
                pages: bibkeyData.number_of_pages || location.state.pages,
                description: description,
                ol_key: bibkeyData.key,
                isbn: bibkeyData.identifiers.isbn_13[0]
            })
            setShelfChoices(context.userShelves)
    
        }

        const pageLoad = async () => {
            const check = await bookCheckById(params.id)
            if (check.data) {
                setdbBook(true)
                dbBookInfo(params.id)
            } else {
                const book = await bookCheckByInfo(params.id, location.state.title, location.state.author)
                // console.log(location.state)
                if (book.data.id) {
                    console.log(book.data.id)
                    // navigate(`/book/${book.data.id}`)
                    setdbBook(true)
                    dbBookInfo(book.data.id)
                } else { olBookInfo(params.id) }
            }
        }
        // very first, check if book exists in db 
        pageLoad()
    }, [params.id, location.state, context.userShelves, dbBookInfo])


    // runs when snack state changes, timer to remove snackbar after 1sec
    useEffect(() => {
        const timer = setTimeout(() => {
            // console.log('timer is running')
            setSnack(false)
        }, 1000);
        return () => clearTimeout(timer);
    }, [snack])

    return (
        <React.Fragment>
            {bookData &&
                <Container sx={{ mt: 5 }}>
                    <BookInfo book={bookData} />

                    {bookData.Shelves && <Stack direction="row" spacing={2} sx={{ mb: 3, ml: 5 }} alignItems='center'>
                        {chipOptions()}
                        {bookData.Shelves.length > 0 && <Stack spacing={0}>
                            <Typography variant='caption'>On Shelves:</Typography>
                            <Stack direction={{ xs: 'column', md: 'row' }}>
                                {bookData.Shelves.map((shelf) => (
                                    <Chip key={shelf.id} id={shelf.id} label={shelf.name} variant="outlined" onDelete={(event) => removeFromShelf(shelf.name, shelf.id)} />
                                ))}
                            </Stack>
                        </Stack>}
                        {markedOwned &&
                            <Stack spacing={0}>
                                <Typography variant='caption'>Status:</Typography>
                                <Chip label='Owned' onDelete={removeOwned} />
                            </Stack>}
                    </Stack>}

                    <Divider />

                    {reviewForm ? (<div>
                        <AddReview reviewInfo={reviewInfo} toggleReviewForm={toggleReviewForm} bookId={bookData.id} addBook={addBook} />
                        <Button onClick={toggleReviewForm}>Cancel</Button>
                    </div>) : (
                        <Stack direction='row' spacing={1}>
                            <ButtonGroup variant="contained" aria-label="text button group" ref={shelfRef}>
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
                                anchorEl={shelfRef.current}
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
                                                            onClick={(event) => addToShelf(event)}
                                                        >
                                                            {shelf.name}
                                                        </MenuItem>
                                                    ))}
                                                    <MenuItem onClick={context.toggleShelfDialog}>
                                                        <Typography variant='caption'>

                                                            ADD NEW SHELF
                                                        </Typography>
                                                    </MenuItem>
                                                </MenuList>
                                            </ClickAwayListener>
                                        </Paper>
                                    </Grow>
                                )}
                            </Popper>

                            {/* {bookBtnOptions()} */}
                            <ButtonGroup aria-label="text button group" ref={markedRef}>
                                <Button onClick={toggleMarkMenu}>Mark As</Button>
                                <Button
                                    size="small"
                                    aria-controls={markOpen ? 'split-button-menu' : undefined}
                                    aria-expanded={markOpen ? 'true' : undefined}
                                    aria-label="select merge strategy"
                                    aria-haspopup="menu"
                                    onClick={toggleMarkMenu}
                                >
                                    <ArrowDropDownIcon />
                                </Button>
                            </ButtonGroup>
                            <Popper
                                sx={{
                                    zIndex: 1,
                                }}
                                open={markOpen}
                                anchorEl={markedRef.current}
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
                                            <ClickAwayListener onClickAway={closeMarkMenu}>
                                                <MenuList id="split-button-menu" autoFocusItem>
                                                    {markedMenuOptions().map(btn => btn
                                                    )}
                                                    {/* {markedMenuOptions()} */}
                                                </MenuList>
                                            </ClickAwayListener>
                                        </Paper>
                                    </Grow>
                                )}
                            </Popper>

                            <Divider orientation='vertical' />

                            <Button onClick={toggleReviewForm}>Add A Review</Button>

                            {markedAs === 'Read' &&
                                <Button onClick={toggleReviewForm}>Add Read Dates</Button>

                            }

                            {!markedOwned && <Button onClick={addOwned}>Mark As Owned</Button>}







                        </Stack>
                    )}

                    <Divider />

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

                            {reviewData.map((review) => <Review
                                review={review}
                                reviewInfo={reviewInfo}
                                openSnackbar={openSnackbar}
                                bookId={bookData.id}
                            />)}

                        </Container>}

                    </Container>
                </Container>}

            {context.shelfDialog && <AddShelf />}

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