import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useParams, useLocation } from "react-router-dom";
import AppContext from '../AppContext';
import API from '../utils/API'
import dayjs from 'dayjs'
import AddShelf from './components/modals/AddShelf'
import {
    Button, ButtonGroup, Grow, Popper, MenuItem, MenuList, Typography, Container, Paper, Divider, Stack, Chip, ClickAwayListener, Snackbar, useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AddReview from './components/modals/AddReview';
// import Review from './components/Book/Review';
import BookInfo from './components/Book/BookInfo';
import AddNote from './components/modals/AddNote'
// import Note from './components/Book/Note';
import Feedback from './components/Book/Feedback';


export default function Book() {
    const context = useContext(AppContext);
    const params = useParams();
    const location = useLocation()
    const theme = useTheme();
    const mobile = useMediaQuery(theme.breakpoints.down('sm'))


    /* data states used for both */
    const [bookData, setBookData] = useState(null)
    const [shelfChoices, setShelfChoices] = useState([])
    const [reviewForm, setReviewForm] = useState(false)
    const [noteForm, setNoteForm] = useState(false)
    const [dbBook, setdbBook] = useState(false)


    /* only if book exists in db & user associated */
    const [reviewData, setReviewData] = useState(false)
    const [noteData, setNoteData] = useState(false)
    const [publicReviews, setPublicReviews] = useState(false)
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
        const pubReviews = await API.publicReviews(id)
        setPublicReviews(pubReviews.data)
        setBookData(book.data)
        setShelfChoices([])
        if (book.data.CurrentBooks.length) {
            setMarkedAs('Currently Reading')
        }
        if (book.data.ReadBooks.length) {
            setMarkedAs('Read')
        }
        if (book.data.Reviews.length) {
            setReviewData(book.data.Reviews)
            setMarkedAs('Read & Reviewed')
        }
        if (book.data.Notes.length) {
            setNoteData(book.data.Notes)
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
    }, [context.userData.id, context.userShelves])


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
        setReviewData(false)
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
            setMarkedAs('Read & Reviewed')
        }
    }

    const noteInfo = async () => {
        setNoteData(false)
        let bookId;
        if (dbBook) {
            bookId = bookData.id
        } else {
            const book = await addBook();
            bookId = book.data.id
        }
        const note = await API.getUserNotes(context.userData.id, bookId)
        if (note.data.length) {
            setNoteData(note.data)
        }
    }

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

    const toggleNoteForm = () => {
        setNoteForm(!noteForm)
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

    const olWorks = async (worksKey, bibkeyData) => {
        const works = await API.olBookWorks(worksKey)
        console.log('works')
        console.log(works.data)
        let description = null;


        if (works.data.description) {
            if (works.data.description.value) {
                description = works.data.description.value
            } else {
                description = works.data.description
            }
        }

        setBookData({
            title: bibkeyData.title || location.state.title,
            cover_img: bibkeyData.cover ? bibkeyData.cover.medium : location.state.cover,
            author: location.state.author || bibkeyData.authors[0].name,
            author_key: location.state.authorKey,
            published: bibkeyData.publish_date || location.state.published,
            pages: bibkeyData.number_of_pages || location.state.pages || bibkeyData.pagination,
            description: description,
            ol_key: bibkeyData.key,
            isbn: bibkeyData.identifiers.isbn_13 ? bibkeyData.identifiers.isbn_13[0] : null
        })
        setShelfChoices(context.userShelves)

    }

    useEffect(() => {

        const olBookInfo = async (id) => {

            if (location.state.origin === 'gb') {
                console.log('gb')

                const bibkeys = await API.olBookBibKeys(id)
                const OLID = Object.keys(bibkeys.data)
                const bibkeyData = bibkeys.data[OLID[0]]

                setBookData({
                    title: location.state.title || bibkeyData.title,
                    cover_img: location.state.cover || bibkeyData.cover.medium,
                    author: location.state.author || bibkeyData.authors[0].name,
                    author_key: location.state.authorKey,
                    published: location.state.published || bibkeyData.publish_date,
                    pages: location.state.pages || bibkeyData.number_of_pages || bibkeyData.pagination,
                    description: location.state.description,
                    ol_key: `/books/${id}`,
                    isbn: location.state.isbn
                })

                setShelfChoices(context.userShelves)

                return;
            }

            if (location.state.origin === 'nyt') {
                console.log('nyt')

                const gb = await API.gbByISBN(location.state.isbn)
                const bookInfo = gb.data.items[0].volumeInfo
                console.log(bookInfo)


                setBookData({
                    title: location.state.title || bookInfo.title,
                    cover_img: location.state.cover || bookInfo.imageLinks.smallThumbnail,
                    author: location.state.author,
                    author_key: location.state.authorKey,
                    published: dayjs(bookInfo.publishedDate).format('MMM D, YYYY'),
                    pages: bookInfo.pageCount,
                    description: bookInfo.description || location.state.description,
                    ol_key: `/books/${id}`,
                    isbn: location.state.isbn
                })

                setShelfChoices(context.userShelves)

                return;

            }


            // params.id will be the OL 'books' key -- edition_key[0]
            let cover = null;
            // bibkeys -- title, authors name, isbn13, publish date, publisher name at least 
            // CAN also include number of pages, subjects, cover
            const bibkeys = await API.olBookBibKeys(id)
            const OLID = Object.keys(bibkeys.data)
            const bibkeyData = bibkeys.data[OLID[0]]

            if (!bibkeyData.identifiers.isbn_13) {
                console.log('no isbn')
                olWorks(location.state.worksKey, bibkeyData)
                return;
            }

            const gbInfo = await API.gbByISBN(bibkeyData.identifiers.isbn_13[0])

            if (!gbInfo.data.items || gbInfo.data.items[0].volumeInfo.industryIdentifiers[0].identifier !== bibkeyData.identifiers.isbn_13[0]) {
                console.log('no gb data')
                olWorks(location.state.worksKey, bibkeyData)
                return;
            }

            const bookInfo = gbInfo.data.items[0].volumeInfo
            console.log('bibkey + gb')
            if (bibkeyData.cover) {
                cover = bibkeyData.cover.medium
            }


            setBookData({
                title: bookInfo.title || bibkeyData.title,
                cover_img: bookInfo.imageLinks.smallThumbnail || cover || location.state.cover,
                author: location.state.author || bookInfo.authors[0] || bibkeyData.authors[0].name,
                author_key: location.state.authorKey,
                published: dayjs(bookInfo.publishedDate).format('MMM D, YYYY') || bibkeyData.publish_date || location.state.published,
                pages: bibkeyData.number_of_pages || bookInfo.pageCount || location.state.pages || bibkeyData.pagination,
                description: bookInfo.description,
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
                console.log(location.state)
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

                    {reviewForm || noteForm ? (<div>
                        {reviewForm ? (<AddReview reviewInfo={reviewInfo} toggleReviewForm={toggleReviewForm} bookId={bookData.id} addBook={addBook} />) : (<AddNote noteInfo={noteInfo} toggleNoteForm={toggleNoteForm} bookId={bookData.id} addBook={addBook} pages={bookData.pages} />)}

                    </div>) : (
                        <React.Fragment>
                            {mobile ? (
                                <Stack alignItems='center' sx={{ p: 2 }}>
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
                                        <ButtonGroup variant='contained' aria-label="text button group" ref={markedRef}>
                                            <Button color='secondary' onClick={toggleMarkMenu}>Mark As</Button>
                                            <Button
                                                color='secondary'
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
                                                            </MenuList>
                                                        </ClickAwayListener>
                                                    </Paper>
                                                </Grow>
                                            )}
                                        </Popper>

                                        <Divider orientation='vertical' />
                                    </Stack>
                                    <Stack direction='row' spacing={1}>
                                        {(markedAs !== 'Read' && markedAs !== 'Read & Reviewed') && <Button color='secondary' onClick={toggleNoteForm}>Add A Note</Button>}
                                        <Button color='secondary' onClick={toggleReviewForm}>Add A Review</Button>

                                        {markedAs === 'Read' &&
                                            <Button color='secondary' onClick={toggleReviewForm}>Add Read Dates</Button>
                                        }

                                        {!markedOwned && <Button color='secondary' onClick={addOwned}>Mark As Owned</Button>}

                                    </Stack>
                                </Stack>) : (<Stack direction='row' spacing={1}>
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
                                    <ButtonGroup variant="contained" aria-label="text button group" ref={markedRef}>
                                        <Button color='secondary' onClick={toggleMarkMenu}>Mark As</Button>
                                        <Button
                                            color='secondary'
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


                                    {(markedAs !== 'Read' && markedAs !== 'Read & Reviewed') && <Button color='secondary' onClick={toggleNoteForm}>Add A Note</Button>}
                                    <Button color='secondary' onClick={toggleReviewForm}>Add A Review</Button>

                                    {markedAs === 'Read' &&
                                        <Button color='secondary' onClick={toggleReviewForm}>Add Read Dates</Button>
                                    }

                                    {!markedOwned && <Button color='secondary' onClick={addOwned}>Mark As Owned</Button>}

                                </Stack>)}
                        </React.Fragment>

                    )
                    }

                    <Divider />

                    <Container>

                        {!noteForm && !reviewForm && <Feedback
                            publicReviews={publicReviews}
                            reviewData={reviewData} reviewInfo={reviewInfo}
                            openSnackbar={openSnackbar}
                            bookId={bookData.id} noteData={noteData} noteInfo={noteInfo}
                            pages={bookData.pages} toggleNoteForm={toggleNoteForm}
                            toggleReviewForm={toggleReviewForm} markedAs={markedAs} />}

                        {/* {!reviewData && !reviewForm && !noteData && !noteForm && <div style={{ margin: '30px auto 85px auto', textAlign: 'center' }}>
                            <Typography variant='subtitle2'>
                                It looks like you haven't added any reviews or notes for this book yet.
                            </Typography>

                            <Link variant='subtitle2' onClick={toggleNoteForm}>Add Your Thoughts!</Link><br />
                            <Link variant='subtitle2' onClick={toggleReviewForm}>Already Finished Reading? Add A Review.</Link>
                        </div>}


                        {reviewData && <Container sx={{ mb: '70px', mt: 2, mx: 0, px: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <Typography variant='subtitle1'>
                                Reviews:
                            </Typography>
                            <br />
                            {reviewData.map((review) => <Review
                                review={review}
                                reviewInfo={reviewInfo}
                                openSnackbar={openSnackbar}
                                bookId={bookData.id}
                            />)}


                        </Container>}

                        {noteData && <Container sx={{ mb: '70px', mt: 2, mx: 0, px: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <Typography variant='subtitle1'>
                                Notes:
                            </Typography>
                            <br />

                            {noteData.map((note) =>
                                <Note note={note} noteInfo={noteInfo} openSnackbar={openSnackbar} bookId={bookData.id} pages={bookData.pages} />
                            )}
                        </Container>
                        } */}

                    </Container>
                </Container >}

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

        </React.Fragment >
    )
}