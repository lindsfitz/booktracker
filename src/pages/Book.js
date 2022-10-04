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
import { WorkSharp } from '@mui/icons-material';


export default function Book() {
    const context = useContext(AppContext);
    const params = useParams();
    const [bookData, setBookData] = useState(null)
    // const [bookInDB, setBookInDB] = useState(false)

    const bookCheck = async () => {
        const bookcheck = await API.getOneBook(params.id)
        return bookcheck;
    }

    const dbBookInfo = async () => {
        const book = await API.getBookandShelves(params.id, context.userData.id);
        setBookData(book.data)
        console.log(book.data)
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
        if (!bibkeyData.cover && works.data.covers){
            cover = `https://covers.openlibrary.org/b/id/${works.data.covers[0]}-M.jpg`
        }

        if (works.data.description){
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
            author:bibkeyData.authors[0].name,
            published:bibkeyData.publish_date,
            pages:bibkeyData.number_of_pages,
            description: description
        })
    }

    const pageLoad = async () => {
       const check = await bookCheck()
       if (check.data){
        console.log('yup book exists')
        dbBookInfo()
       } else {
        console.log('nope, book not in db')
        olBookInfo()
       }

    }

    useEffect(() => {
        // very first, check if book exists in db 
        pageLoad()
    }, [params.id])

    return (

        <React.Fragment>
            <h1>hi welcome to testbook</h1>
            {bookData &&
                <Container sx={{ mt: 5 }}>
                    {/* ----BOOK DETAILS @ TOP---- */}
                    <BookInfo book={bookData} />
                </Container>}
        </React.Fragment>

    )
}