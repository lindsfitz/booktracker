import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from "react-router-dom";
import AppContext from '../../AppContext';
import API from '../../utils/API';
import { Container, Paper, Box, Typography, Stack, Chip, Divider, Button, ButtonGroup, ClickAwayListener, Grow, Popper, MenuItem, MenuList, Grid } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AddReview from './AddReview';

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

    const openShelfMenu = (e) => {
        console.info(`Select a shelf to add to!`);
    };

    const handleShelfAdd = async (e) => {
        console.info(`You clicked ${e.target.id}`)
        setOpen(false);
        // const newBook = {
        //     title: bookData.book.title,
        //     author: bookData.details.author_name[0],
        //     author_key: bookData.details.author_key[0],
        //     description: description,
        //     cover_img: `https://covers.openlibrary.org/b/olid/${bookData.details.cover_edition_key}-M.jpg`,
        //     pages: bookData.details.number_of_pages_median,
        //     published: bookData.details.first_publish_year,
        //     edition_key: bookData.book.key
        // }
        const postBook = await bookCheck()
        const shelfAdd = await API.addtoShelf(e.target.id, { id: postBook.data.id })
        console.log(shelfAdd)
        console.log('wait did that actually work')

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

    const addCurrentlyReading = (e) => {
        // post request to add this book to the currently reading table 
    }

    const markRead = async () => {
        const book = await bookCheck()
        // post request to add review but just setting read to true
        const reviewData = {
            read:true,
            UserId:context.userData.id,
            BookId:book.data.id
        }
       const reviewPost = await API.newReview(reviewData)
       console.log(reviewPost)
    }

    const showReviewForm = () => {
        // post request to add review but adding a full big boy review aka clicking this shows the add review div
        setReviewDiv(!reviewDiv)
    }


    // ///////////////////////////////////////////////

    const bookInfo = async () => {
        // this api call gives us title, description, subjects, author key
        const book = await API.getBook(params.id)
        const details = await API.searchByTitle(book.data.title)
        console.log(book);
        console.log(details)
        setBookData({
            book: book.data,
            details: details.data.docs[0]
        })
        if (book.data.description.value) {
            setDescription(book.data.description.value)
        } else {
            setDescription(book.data.description)
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
            <Container sx={{ mt: 20 }}>
                {bookData &&
                    <Paper elevation={3}>
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <Box>
                                    <Box>
                                        <img src={`https://covers.openlibrary.org/b/olid/${bookData.details.cover_edition_key}-M.jpg`} />
                                    </Box>
                                    <ButtonGroup
                                        orientation="vertical"
                                        aria-label="vertical outlined button group"
                                    >
                                        <Button>Currently Reading</Button>
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
                                                                        // disabled={index === 2}
                                                                        // selected={index === selectedIndex}
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
                                    </ButtonGroup>
                                </Box>
                            </Grid>
                            <Grid item xs={8}>
                                <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <Box>
                                        <Typography variant='h3' gutterBottom>
                                            {bookData.book.title}
                                        </Typography>
                                        <Typography variant='subtitle1' gutterBottom>
                                            by {bookData.details.author_name[0]}
                                        </Typography>
                                        <Divider />
                                        <Stack direction="row" spacing={1}>
                                            <Chip label={`Published: ${bookData.details.first_publish_year}`} variant="outlined" />
                                            <Chip label={`Pages: ${bookData.details.number_of_pages_median}`} variant="outlined" />
                                        </Stack>
                                        <Divider />
                                    </Box>
                                    <Box>
                                        <Typography variant='body1'>
                                            {description}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                }

                {reviewDiv && <div>
                    <AddReview />
                    <Button onClick={showReviewForm}>Cancel</Button>
                </div>
                }
            </Container>

        </React.Fragment>
    )
}