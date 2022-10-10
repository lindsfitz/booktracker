// Search page for new books to add to your bookshelf
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import API from '../utils/API';
// import AppContext from '../AppContext';
import { useTheme } from '@mui/material/styles';
import { Box, TextField, InputLabel, MenuItem, FormControl, Select, Button, List, ListItem, ListItemText, Container, Skeleton, Stack, Typography, Badge, Card, CardMedia, CardContent, useMediaQuery } from '@mui/material';
import NYTMobile from './components/mobile/NYTMobile';


// const NYTweekly = [
//     'combined-print-and-e-book-fiction',
//     'combined-print-and-e-book-nonfiction',
//     'hardcover-fiction',
//     'hardcover-nonfiction',
//     'trade-fiction-paperback',
//     'paperback-nonfiction',
//     'young-adult-hardcover']

// const NYTmonthly = ["audio-fiction",
//     "audio-nonfiction",
//     "graphic-books-and-manga",
//     "mass-market-monthly",
//     "middle-grade-paperback-monthly",
//     "young-adult-paperback-monthly"]

export default function Search() {
    let navigate = useNavigate();
    const theme = useTheme();
    const smxs = useMediaQuery(theme.breakpoints.down('sm'))

    const [searchBy, setSearchBy] = useState('title');
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [NYTdiv, setNYTdiv] = useState(true)
    const [noResults, setNoResults] = useState(false)
    const [bestSellers, setBestSellers] = useState(null)
    const [bestListInfo, setBestListInfo] = useState(null)

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value)
    }

    const changeSearchBy = (event) => {
        setSearchBy(event.target.value);
    };

    const searchByTitle = async () => {
        API.olSearchTitle(searchTerm).then(books => {
            if (!books.data.docs.length) {
                setNoResults(true)
            }
            setSearchResults(books.data.docs)
            console.log(books.data.docs)
        }).catch(err => {
            console.log(err)
        })
    }

    const searchByAuthor = async () => {
        const authorResults = await API.olSearchAuthor(searchTerm)
        if (!authorResults.data.docs.length) {
            setNoResults(true)
        }
        setSearchResults(authorResults.data.docs)
        console.log(authorResults)
    }

    const search = async () => {
        setNYTdiv(false)
        setSearchResults(null)
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
        // console.log(best)
        setBestSellers(best.data.results.books)
        setBestListInfo({
            date: best.data.results.bestsellers_date,
            title: best.data.results.display_name
        })
    }

    const subjectSearch = async () => {
        let subject = 'fantasy romance'

        const OLsearch = await API.olSearchSubject(subject)
        const gbSearch = await API.gbBySubject(subject)

        console.log(OLsearch)
        console.log('------')
        console.log(gbSearch)

    }

    const nytSearch = async (isbn, title, author) => {
        const bookFind = await API.olBookISBN(isbn)
        const formattedTitle = title.toLowerCase().split(' ')
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
        // console.log(bookFind)
        if (bookFind.data) {
            console.log(bookFind.data.key)
            const key = bookFind.data.key.split('/')
            console.log(key)
            navigate(`/book/${key[2]}`, {
                state: {
                    author: author,
                    title: formattedTitle
                }
            })
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
                    maxWidth: { xs: 4 / 5, sm: 3 / 5 },
                    m: { xs: 2, sm: 5 }
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

            {noResults && <Container sx={{ m: '20px auto 20px auto', textAlign: 'center' }}>
                <Typography variant='subtitle2'>No Results Found</Typography>
            </Container>}

            {searchResults ? (
                <Container>
                    <List>
                        {searchResults.map((book) => (
                            <ListItem key={`${book.cover_edition_key}`} id={book.cover_edition_key}
                            >
                                <img src={`https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-M.jpg`} alt={`${book.title}-cover`} />
                                {
                                    book.author_name &&
                                    <ListItemText primary={book.title} secondary={book.author_name[0]} />
                                }
                                <Button onClick={() => {
                                    navigate(`/book/${book.edition_key[0]}`, {
                                        state: {
                                            published: book.first_publish_year,
                                            pages: book.number_of_pages_median,
                                            cover: book.cover_i,
                                            author: book.author_name[0],
                                            title: book.title
                                        }
                                    })
                                }}>VIEW DETAILS</Button>
                            </ListItem>
                        ))}
                    </List>
                </Container>
            ) : (
                <Stack spacing={1} sx={{ mr: 'auto', ml: 'auto', mt: 10, width: 1 / 1 }}>
                    <Skeleton variant="rectangular" width={4 / 5} height={100} />
                    <Skeleton width={4 / 5} />
                    <Skeleton variant="rectangular" width={4 / 5} height={100} />
                    <Skeleton width={4 / 5} />
                    <Skeleton variant="rectangular" width={4 / 5} height={100} />
                    <Skeleton width={4 / 5} />
                </Stack>
            )}

            {NYTdiv && bestSellers && <Container>
                <Box>
                    <Typography variant='h6'>New York Times Best Sellers List</Typography>
                    <Typography variant='subtitle1'>{bestListInfo.title}</Typography>
                    <Typography variant='subtitle2' color='text.secondary'>{bestListInfo.date}</Typography>
                    {smxs ? (
                        <NYTMobile bestSellers={bestSellers} nytSearch={nytSearch} />
                    ) : (
                        <Box sx={{ display: { sm: 'flex' }, flexWrap: 'wrap' }}>
                            {bestSellers.map(book => (
                                <Card key={book.primary_isbn13} sx={{ maxWidth: 120 }}>
                                    <CardContent sx={{ wordWrap: 'break-word' }}>
                                        <Badge anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left',
                                        }}
                                            badgeContent={book.rank} color="primary">
                                            <CardMedia
                                                component="img"
                                                onClick={() => nytSearch(book.primary_isbn13, book.title, book.author)}
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
                            ))}
                        </Box>
                    )}
                </Box>
            </Container>}

        </Container>
    );
}
