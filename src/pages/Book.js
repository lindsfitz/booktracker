import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useLocation } from "react-router-dom";
import AppContext from '../AppContext';
import API from '../utils/API'
import AddShelf from './components/AddShelf'
// import dayjs from 'dayjs'
import {
    // Card,Box,CardContent, IconButton,
    Button, ButtonGroup, Grow, Popper, MenuItem, MenuList, Typography, Container, Paper, Divider, Stack, Chip, Link, ClickAwayListener, Snackbar
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AddReview from './components/AddReview';
import Review from './components/Review';
import BookInfo from './components/BookInfo';


export default function Book() {
    const context = useContext(AppContext);
    const params = useParams();
    const location = useLocation()

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
    const anchorRef = useRef(null);
    const [snack, setSnack] = useState(false);
    const [snackMessage, setSnackMessage] = useState(null)



    /* --------------------------USERBOOK-------------------- */


    const dbBookInfo = async (id) => {
        const book = await API.getBookandShelves(id, context.userData.id);
        setBookData(book.data)
        console.log(book.data)
        if (book.data.CurrentBooks.length) {
            // setMarkedReading(true)
            setMarkedAs('Currently Reading')
        }
        if (book.data.Reviews.length) {
            setReviewData(book.data.Reviews)
            for (let i = 0; i < book.data.Reviews.length; i++) {
                if (book.data.Reviews[i].read === true) {
                    // setMarkedRead(true)
                    setMarkedAs('Read')
                }
            }
        }
        if (book.data.OwnedBooks.length) {
            setMarkOwned(true)
        }
        if (book.data.DNFBooks.length) {
            // setMarkedDNF(true)
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
            default:
                return (
                    <React.Fragment>
                    </React.Fragment>
                )
        }
    }

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

    const olBookInfo = async () => {
        // params.id will be the OL 'books' key -- edition_key[0]
        let cover = null;
        let description = null;
        // bibkeys -- title, authors name, isbn13, publish date, publisher name at least 
        // CAN also include number of pages, subjects, cover
        const bibkeys = await API.getBookbyBibKeys(params.id)
        const OLID = Object.keys(bibkeys.data)
        const bibkeyData = bibkeys.data[OLID[0]]
        console.log(bibkeyData)
        if (bibkeyData.cover) {
            cover = bibkeyData.cover.medium
        }
        // books -- includes series, works key
        // CAN also include -- covers [0] for cover id 
        const book = await API.getBookbyBooks(params.id)
        console.log(book.data)

        // literally just to pull the description 
        // can also include covers[0]
        const works = await API.getBook(book.data.works[0].key)
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

        // const details = await API.searchByTitle(book.data.title)
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

    /* ------------------------------------------------------------ */


    /* --------------------------BTN FUNCTIONS-------------------- */

    const markedMenuOptions = () => {
        switch (markedAs) {
            case 'Currently Reading':
                return (
                    <React.Fragment>
                        <MenuItem onClick={moveToRead}>Read</MenuItem>
                        <MenuItem onClick={moveToDNF}>DNF</MenuItem>
                       <MenuItem>Remove</MenuItem>
                    </React.Fragment>
                );
            case 'DNF':
                return (
                    <React.Fragment>
                        <MenuItem onClick={markCurrentlyReading}>Reading</MenuItem>
                        <MenuItem onClick={markRead}>Read</MenuItem>
                        <MenuItem onClick={removeDNF}>Remove</MenuItem>
                        
                    </React.Fragment>
                );
            case 'Read':
                return (
                    <React.Fragment>
                        <MenuItem onClick={markCurrentlyReading}>Reading</MenuItem>
                        <MenuItem onClick={markDNF}>DNF</MenuItem>
                        <MenuItem>Remove</MenuItem>
                    </React.Fragment>
                );
            default:
                return (
                    <React.Fragment>
                        <MenuItem onClick={markCurrentlyReading}>Reading</MenuItem>
                        <MenuItem onClick={markRead}>Read</MenuItem>
                        <MenuItem onClick={markDNF}>DNF</MenuItem>
                    </React.Fragment>
                )

        }
    }

    const bookBtnOptions = () => {
        switch (markedAs) {
            case 'Currently Reading':
                return (
                    <React.Fragment>
                        <Button onClick={moveToRead}>Mark As Read</Button>
                        <Button onClick={moveToDNF}>Mark As DNF</Button>
                        <Button onClick={toggleReviewForm}>Add A Review</Button>
                        {/* <Button>Remove From Currently Reading</Button> */}
                    </React.Fragment>
                );
            case 'DNF':
                return (
                    <React.Fragment>
                        <Button onClick={removeDNF}>Remove From DNF</Button>
                        <Button onClick={toggleReviewForm}>Add A Review</Button>
                    </React.Fragment>
                );
            case 'Read':
                return (
                    <React.Fragment>
                        <Button onClick={toggleReviewForm}>Add A Review</Button>
                    </React.Fragment>
                );
            default:
                return (
                    <React.Fragment>
                        <Button onClick={markCurrentlyReading}>Add To Currently Reading</Button>
                        <Button onClick={markRead}>Mark As Read</Button>
                        <Button onClick={markDNF}>Mark As DNF</Button>
                        <Button onClick={toggleReviewForm}>Add A Review</Button>
                    </React.Fragment>
                )

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
        // bookInfo()
    }

    const removeFromShelf = async (shelfName, shelfId) => {
        await API.removefromShelf(shelfId, bookData.id)
        openSnackbar(`Removed from ${shelfName}`)
        // bookInfo()
    }

    const markCurrentlyReading = async () => {
        let bookId;
        if (dbBook) {
            bookId = bookData.id
        } else {
            const book = await addBook();
            bookId = book.data.id
        }
        await API.addCurrentRead({
            userId: context.userData.id,
            bookId: bookId
        })
        openSnackbar('Marked As Currently Reading')
        pageLoad()
    }

    const markRead = async () => {
        let bookId;
        if (dbBook) {
            bookId = bookData.id
            await API.removeCurrentlyReading(context.userData.id, bookId)
            await API.removeFromDNF(context.userData.id, bookId)
        } else {
            const book = await addBook();
            bookId = book.data.id
        }
        // post request to add review but just setting read to true
        const reviewData = {
            read: true,
            public: false,
            last_update: new Date(),
            UserId: context.userData.id,
            BookId: bookId
        }
        await API.newReview(reviewData)
        openSnackbar('Marked As Read')
        pageLoad()
    }

    const moveToRead = async () => {
        await API.finishedReading({
            UserId: context.userData.id,
            BookId: bookData.id,
            last_update: new Date()
        })
        openSnackbar('Marked As Read')
        // bookInfo()
    }

    const markDNF = async () => {
        let bookId;
        if (dbBook) {
            bookId = bookData.id
        } else {
            const book = await addBook();
            bookId = book.data.id
        }
        await API.addToDNF({
            userId: context.userData.id,
            bookId: bookId
        })
        openSnackbar('Marked As DNF')
    }

    const moveToDNF = async () => {
        console.log('hi')
        await API.didNotFinish({
            userId: context.userData.id,
            bookId: bookData.id
        })
        openSnackbar('Marked As DNF')

    }

    const removeDNF = async () => {
        await API.removeFromDNF(context.userData.id, bookData.id)
        openSnackbar('Removed From DNF List')

    }

    const addOwned = async () => {
        let bookId;
        if (dbBook) {
            bookId = bookData.id
        } else {
            const book = await addBook();
            bookId = book.data.id
        }
        await API.addOwnedBook({
            userId: context.userData.id,
            bookId: bookId
        })
        openSnackbar('Added to Owned List')
    }

    const removeOwned = async () => {
        await API.removeFromOwned(context.userData.id, bookData.id)
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
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setShelfOpen(false);
    };

    const toggleMarkMenu = () => {
        setMarkOpen((prev) => !prev)
    }

    const closeMarkMenu = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
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

    const bookCheck = async () => {
        const bookcheck = await API.getOneBook(params.id)
        return bookcheck;
    }

    const fullbookcheck = async () => {
        const bookcheck = await API.bookCheck(params.id, {
            title: location.state.title,
            author: location.state.author
        })
        return bookcheck;
    }

 
    const pageLoad = async () => {
        const check = await bookCheck()
        if (check.data) {
            console.log('yup book exists')
            setdbBook(true)
            dbBookInfo(params.id)
        } else {
            // console.log('nope, book not in db')
            const book = await fullbookcheck()
            // console.log(book)
            console.log(location.state)
            if (book.data.id) {
                console.log(book.data.id)
                setdbBook(true)
                dbBookInfo(book.data.id)
            } else { olBookInfo() }
        }
    }

    // useEffect(() => {
    //     shelfOptions()
    // }, [context.userShelves])


    useEffect(() => {
        // very first, check if book exists in db 
        pageLoad()
    }, [params.id])


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
                                    <Chip key={`${shelf.name}${shelf.id}`} id={shelf.id} label={shelf.name} variant="outlined" onDelete={(event) => removeFromShelf(shelf.name, shelf.id)} />
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
                        <AddReview reviewInfo={reviewInfo} toggleReviewForm={toggleReviewForm} />
                        <Button onClick={toggleReviewForm}>Cancel</Button>
                    </div>) : (
                        <Stack direction='row' spacing={1}>
                            <ButtonGroup variant="contained" aria-label="text button group" ref={anchorRef}>
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
                            <ButtonGroup  aria-label="text button group" ref={anchorRef}>
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
                                            <ClickAwayListener onClickAway={closeMarkMenu}>
                                                <MenuList id="split-button-menu" autoFocusItem>
                                                  { markedMenuOptions()}
                                                </MenuList>
                                            </ClickAwayListener>
                                        </Paper>
                                    </Grow>
                                )}
                            </Popper>

                            <Divider orientation='vertical' />

                            <Button onClick={toggleReviewForm}>Add A Review</Button>

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