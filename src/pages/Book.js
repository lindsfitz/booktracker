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
import BookInfo from './components/BookInfo';


export default function Book() {
    const context = useContext(AppContext);
    const params = useParams();
    const [bookData, setBookData] = useState(null)
    // const [bookInDB, setBookInDB] = useState(false)

    const bookCheck = async () => {
        const bookcheck = await API.getOneBook()
        return bookcheck;
    }

    const dbBookInfo = async () => {
        const book = await API.getBookandShelves(params.id, context.userData.id);
        setBookData(book.data)
        // if (book.data.CurrentBooks.length) {
        //     setMarkedReading(true)
        //     setMarkedAs('Currently Reading')
        // }
        // if (book.data.Reviews.length) {
        //     setReviewData(book.data.Reviews)
        //     for (let i = 0; i < book.data.Reviews.length; i++) {
        //         if (book.data.Reviews[i].read === true) {
        //             setMarkedRead(true)
        //             setMarkedAs('Read')
        //         }
        //     }
        // }
        // if (book.data.OwnedBooks.length) {
        //     setMarkOwned(true)
        // }
        // if (book.data.DNFBooks.length) {
        //     setMarkedDNF(true)
        //     setMarkedAs('DNF')
        // }
        // shelfOptions(book.data)

    }

    const olBookInfo = async () => {
        // this api call gives us title, description, subjects, author key
        // params.id will be the OL 'books' key -- seed[0] or edition_key[0]
        const book = await API.getOneBook(params.id)
        const works = await API.getBook(book.works[0].key)
        const details = await API.searchByTitle(book.data.title)
        setBookData({
            title: book.data.title,
            cover_img:`https://covers.openlibrary.org/b/olid/${details.data.docs[0].cover_edition_key}-M.jpg`,
            author:details.data.docs[0].author_name[0],
            published:details.data.docs[0].first_publish_year,
            pages:details.data.docs[0].number_of_pages_median,
            description: book.data.description.value || book.data.description
        })
    }

    const pageLoad = async () => {
       const check = await bookCheck()
       if (check){
        dbBookInfo()
       } else {
        olBookInfo()
       }

    }

    useEffect(() => {
        // very first, check if book exists in db 
        pageLoad()
    }, [params.id])

    return (

        <React.Fragment>
            {bookData &&
                <Container sx={{ mt: 5 }}>
                    {/* ----BOOK DETAILS @ TOP---- */}
                    <BookInfo book={bookData} />
                </Container>}
        </React.Fragment>

    )
}