import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from "react-router-dom";
import AppContext from '../AppContext';
import API from '../utils/API';
import { Container, Paper, Box, Typography, Stack, Chip, Divider, Button, ButtonGroup, ClickAwayListener, Grow, Popper, MenuItem, MenuList, Grid, Snackbar, Card, CardContent, CardMedia } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AddReview from '../pages/components/AddReview';
import { data } from 'uikit';
import BookInfo from '../pages/components/BookInfo';

// const options = ['Add to List'];


export default function ResultBook() {
    const context = useContext(AppContext);
    const params = useParams();

    const [bookData, setBookData] = useState(null)
    const [reviewDiv, setReviewDiv] = useState(false)

    // functions/state variables for split btn to add book to list 
    ////////////////////////////////////////////////////////////////////////
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [options, setOptions] = useState([{
        name: 'Add A Shelf First!',
        id: 0
    }])
    const [description, setDescription] = useState('')
    const [snack, setSnack] = useState(false);
    const [snackMessage, setSnackMessage] = useState(null)

    const openShelfMenu = (e) => {
        console.info(`Select a shelf to add to!`);
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const closeShelfMenu = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const openSnackbar = (message) => {
        setSnackMessage(message)
        setSnack(true)
    }

    const actualBookCheck = async () => {
        const bookcheck = await API.getOneBook()

    }

   


    // takes book info from API response & sends to db - returns found book or creates new one and returns db book info
    const bookCheck = async () => {
        const newBook = {
            title: bookData.book.title,
            author: bookData.details.author_name[0],
            author_key: bookData.details.author_key[0],
            description: description,
            cover_img: `https://covers.openlibrary.org/b/olid/${bookData.details.cover_edition_key}-M.jpg`,
            pages: bookData.details.number_of_pages_median,
            published: bookData.details.first_publish_year,
            edition_key: bookData.book.key
        }
        const postBook = await API.newBook(newBook)

        return postBook
    }

    // adds book to selected shelf
    // after adding shelf -- need to update context.userShelves so other pages update as well 
    const handleShelfAdd = async (e) => {
        console.info(`You clicked ${e.target.id}`)
        setOpen(false);
        const postBook = await bookCheck()
        const shelfAdd = await API.addtoShelf(e.target.id, { id: postBook.data.id })
        if (shelfAdd.data.message) {
            console.log('wow added to shelf')
            // then call shelf pull api and update user shelves
            openSnackbar(`Added to ${e.target.textContent}`)
        }
        if (shelfAdd.data.name === "SequelizeUniqueConstraintError") {
            openSnackbar(`Already Shelved on ${e.target.textContent}`)
        }
    };


    // adds book to 'currently reading' junction table w mix in method
    const markCurrentlyReading = async () => {
        const findBook = await bookCheck();
        await API.addCurrentRead({
            userId: context.userData.id,
            bookId: findBook.data.id
        })
        openSnackbar('Marked As Currently Reading')
    }

    // posts new review w just 'read' set to true and other fields as null 
    const markRead = async () => {
        const book = await bookCheck()
        // post request to add review but just setting read to true
        const reviewData = {
            read: true,
            last_update: new Date(),
            UserId: context.userData.id,
            BookId: book.data.id
        }
        await API.newReview(reviewData)
        openSnackbar('Marked As Read')
    }


    // shows review form so that user can add a full review for the book rather than just setting read to true
    const showReviewForm = () => {
        // post request to add review but adding a full big boy review aka clicking this shows the add review div
        setReviewDiv(!reviewDiv)
    }


    // ///////////////////////////////////////////////

    const bookInfo = async () => {
        // this api call gives us title, description, subjects, author key
        const book = await API.getBook(params.id)
        const details = await API.searchByTitle(book.data.title)
        const testerbook = await API.getOneBook(params.id)
        // setBookData({
        //     title: book.data.title,
        //     cover_img:`https://covers.openlibrary.org/b/olid/${details.data.docs[0].cover_edition_key}-M.jpg`,
        //     author:details.data.docs[0].author_name[0],
        //     published:details.data.docs[0].first_publish_year,
        //     pages:details.data.docs[0].number_of_pages_median,
        //     description: book.data.description.value || book.data.description
        // })
        setBookData({
            title: testerbook.title,
            cover_img:`https://covers.openlibrary.org/b/olid/${details.data.docs[0].cover_edition_key}-M.jpg`,
            author:details.data.docs[0].author_name[0],
            published:testerbook.publish_date,
            pages:testerbook.number_of_pages,
            description: book.data.description || book.data.description.value || null
        })
        // setBookData({
        //     book: book.data,
        //     details: details.data.docs[0]
        // })
        // if (book.data.description.value) {
        //     setDescription(book.data.description.value)
        // } else {
        //     setDescription(book.data.description)
        // }

        const allBookData = {
            title: book.data.title,
            cover_img:`https://covers.openlibrary.org/b/olid/${details.data.docs[0].cover_edition_key}-M.jpg`,
            author:details.data.docs[0].author_name[0],
            published:details.data.docs[0].first_publish_year,
            pages:details.data.docs[0].number_of_pages_median,
            description: book.data.description.value || book.data.description
        }
    }

    const shelfInfo = () => {
        console.log(context.userShelves)
        if (context.userShelves.length) {
            setOptions(context.userShelves)
        }
    }

    useEffect(() => {
        bookInfo()
        shelfInfo()
        console.log(bookData)
    }, [])


    return (
        <React.Fragment>
            <Container sx={{ mt: 5 }}>
                {bookData && <BookInfo book={bookData} /> }

                <Divider />

                {reviewDiv ? (<div>
                    <AddReview />
                    <Button onClick={showReviewForm}>Cancel</Button>
                </div>) :
                    (<ButtonGroup
                        aria-label="vertical outlined button group"
                    >
                        <Button onClick={markCurrentlyReading}>Currently Reading</Button>
                        <Button onClick={markRead}>Mark As Read</Button>
                        <Button onClick={showReviewForm}>Add New Review</Button>
                        <ButtonGroup variant='contained' ref={anchorRef} aria-label="split button">
                            <Button onClick={openShelfMenu}>Add to Shelf</Button>
                            <Button
                                size="small"
                                aria-controls={open ? 'split-button-menu' : undefined}
                                aria-expanded={open ? 'true' : undefined}
                                aria-label="select merge strategy"
                                aria-haspopup="menu"
                                onClick={handleToggle}
                            >
                                <ArrowDropDownIcon />
                            </Button>
                        </ButtonGroup>
                        <Popper
                            sx={{
                                zIndex: 1,
                            }}
                            open={open}
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
                                                {options.map((option, index) => (
                                                    <MenuItem
                                                        key={option.id}
                                                        id={option.id}
                                                        onClick={(event) => handleShelfAdd(event)}
                                                    >
                                                        {option.name}
                                                    </MenuItem>
                                                ))}
                                            </MenuList>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>
                    </ButtonGroup>)
                }
                <Divider />

            </Container>

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