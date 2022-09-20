// Search page for new books to add to your bookshelf
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import API from '../utils/API';
import AppContext from '../AppContext';
import { Box, TextField, InputLabel, MenuItem, FormControl, Select, Button, List, ListItem, ListItemText, Container, Skeleton, Stack, Typography, Badge, Card, CardMedia, CardContent } from '@mui/material';


const NYTweekly = [
    'combined-print-and-e-book-fiction',
    'combined-print-and-e-book-nonfiction',
    'hardcover-fiction',
    'hardcover-nonfiction',
    'trade-fiction-paperback',
    'paperback-nonfiction',
    'young-adult-hardcover']

const NYTmonthly = ["audio-fiction",
    "audio-nonfiction",
    "graphic-books-and-manga",
    "mass-market-monthly",
    "middle-grade-paperback-monthly",
    "young-adult-paperback-monthly"]

export default function Search() {
    const context = useContext(AppContext);
    let navigate = useNavigate();
    const [searchBy, setSearchBy] = useState('title');
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [shelves, setShelves] = useState(null)
    const [shelfAdd, setShelfAdd] = useState('')
    const [noResults, setNoResults] = useState(false)
    const [bestSellers, setBestSellers] = useState(null)
    const [bestListInfo, setBestListInfo] = useState(null)

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value)
    }

    const changeSearchBy = (event) => {
        setSearchBy(event.target.value);
    };

    const addToShelf = (shelf, book) => {
        console.log(shelf, book)
    }

    const searchByTitle = async () => {
        API.searchByTitle(searchTerm).then(books => {
            if (!books.data.docs.length) {
                setNoResults(true)
            }
            setSearchResults(books.data.docs)
        }).catch(err => {
            console.log(err)
        })
        // setShelves([...context.userShelves])
    }

    const searchByAuthor = async () => {
        const authorResults = await API.searchByAuthor(searchTerm)
        if (!authorResults.data.docs.length) {
            setNoResults(true)
        }
        setSearchResults(authorResults.data.docs)
        console.log(authorResults)
    }

    const search = async () => {
        setSearchResults(null)
        setShelves([...context.userShelves])
        if (searchBy === 'title') {
            searchByTitle()
        }

        if (searchBy === 'author') {
            searchByAuthor()
        }

        // // API.gbByTitle(searchTerm).then(books => {
        // //     console.log(books)
        // // })

    }

    const nytBestSellers = async () => {
        let testlist = 'combined-print-and-e-book-fiction'
        const best = await API.nytList(testlist)
        console.log(best)
        setBestSellers(best.data.results.books)
        setBestListInfo({
            date: best.data.results.bestsellers_date,
            title: best.data.results.display_name
        })
    }

    const subjectSearch = async () => {
        let subject = 'fantasy romance'

        const OLsearch = await API.searchBySubject(subject)
        const gbSearch = await API.gbBySubject(subject)

        console.log(OLsearch)
        console.log('------')
        console.log(gbSearch)

    }

    const nytSearch = async (isbn) => {
        const bookFind = await API.getBookISBN(isbn)
        console.log(bookFind)
        if (bookFind.data) {
            const OLkey = bookFind.data.works[0].key
            console.log(OLkey)
            navigate(`${OLkey}`)
        }

        if (bookFind.code) {
            console.log('this book is missing from OL cause it sucks')
        }
    }

    useEffect(() => {
        nytBestSellers()
        // subjectSearch()
    }, [])


    return (
        <Container sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box
                component="form"
                sx={{
                    display: 'flex',
                    maxWidth: 3 / 5,
                    m: 5
                }}
                noValidate
                autoComplete="off"
            >
                <Box sx={{ minWidth: 120 }}>
                    <FormControl>
                        <InputLabel id="demo-simple-select-label">Search By</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={searchBy}
                            label="Search"
                            onChange={changeSearchBy}
                        >
                            <MenuItem value={'title'}>Title</MenuItem>
                            <MenuItem value={'author'}>Author</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <TextField onChange={handleInputChange} sx={{ width: 2 / 3 }} id="standard-basic" label="Search..." variant="standard" />
                <Button onClick={search}>Search</Button>
            </Box>

            {
                noResults && <Container sx={{ m: '20px auto 20px auto', textAlign: 'center' }}>
                    <Typography variant='subtitle2'>No Results Found</Typography>
                </Container>
            }

            {searchResults ? <Container>
                <List>
                    {searchResults.map((book) => (
                        <ListItem key={`${book.cover_edition_key}`} id={book.cover_edition_key}
                        >
                            <img src={`https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-M.jpg`} alt={`${book.title}-cover`} />
                            {
                                book.author_name[0] &&
                                <ListItemText primary={book.title} secondary={book.author_name[0]} />
                            }
                            <FormControl edge="end" variant="standard" sx={{ m: 1, minWidth: 120 }}>
                                <InputLabel id="demo-simple-select-standard-label">Add to Shelf</InputLabel>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    value={shelfAdd}
                                    // onClick={changeShelfAdd}
                                    label="Add to List"
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {shelves.map((shelf) => (
                                        <MenuItem onClick={() => addToShelf(shelf.id, book.key)} key={shelf.id} value={shelf.id}>{shelf.name}
                                        </MenuItem>
                                    ))}

                                </Select>
                                <Button onClick={() => { navigate(`${book.key}`) }}>VIEW DETAILS</Button>
                            </FormControl>
                        </ListItem>
                    ))}
                </List>

            </Container> : (
                <Stack spacing={1} sx={{ mr: 'auto', ml: 'auto', mt: 10, width: 1 / 1 }}>
                    {/* For variant="text", adjust the height via font-size */}
                    {/* For other variants, adjust the size with `width` and `height` */}
                    <Skeleton variant="rectangular" width={4 / 5} height={100} />
                    <Skeleton width={4 / 5} />
                    <Skeleton variant="rectangular" width={4 / 5} height={100} />
                    <Skeleton width={4 / 5} />
                    <Skeleton variant="rectangular" width={4 / 5} height={100} />
                    <Skeleton width={4 / 5} />
                </Stack>
            )}

            {bestSellers && <Container>
                <Box>
                    <Typography variant='h6'>New York Times Best Sellers List</Typography>
                    <Typography variant='subtitle1'>{bestListInfo.title}</Typography>
                    <Typography variant='subtitle2' color='text.secondary'>{bestListInfo.date}</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        {bestSellers.map(book => (
                            <Card sx={{ maxWidth: 120 }}>
                                <CardContent sx={{ wordWrap: 'break-word' }}>
                                    <Badge anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                        badgeContent={book.rank} color="primary">
                                        <CardMedia
                                            component="img"
                                            onClick={() => nytSearch(book.primary_isbn13)}
                                            // sx={{ maxHeight: { xs: 190, md: 218 }, maxWidth: { xs: 125, md: 148 } }}
                                            height='140'
                                            image={`${book.book_image}`}
                                            alt={`${book.title}`}
                                        />
                                    </Badge>


                                    <Typography variant='caption' sx={{ fontWeight: 'bold' }}>{book.title}</Typography>
                                    <br />
                                    <Typography variant='caption' color='text.secondary'>{book.author}</Typography>
                                    <br />
                                    <Typography variant='caption'>Weeks on List: {book.weeks_on_list}</Typography>
                                </CardContent>
                            </Card>
                        ))
                        }

                    </Box>
                </Box>
            </Container>}

        </Container>
    );
}
