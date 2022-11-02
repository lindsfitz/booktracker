// Search page for new books to add to your bookshelf
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import API from '../utils/API';
// import AppContext from '../AppContext';
import { useTheme, styled, alpha } from '@mui/material/styles';
import { Box, OutlinedInput, TextField, InputLabel, MenuItem, FormControl, Select, Button, List, ListItem, ListItemText, Container, Skeleton, Stack, Typography, Badge, Card, CardMedia, CardContent, useMediaQuery, InputBase, IconButton, Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
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

const SearchBar = styled('div')(({ theme }) => ({
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.custom.main, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.custom.main, 0.25),
    },
    marginLeft: 5,
    width: '100%',
    // [theme.breakpoints.up('sm')]: {
    //     marginLeft: theme.spacing(3),
    //     width: 'auto',
    // },
}));


const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 1),
        marginTop: 4,
        transition: theme.transitions.create('width'),
        width: '100%',
        // [theme.breakpoints.up('md')]: {
        //     width: '20ch',
        // },
    },
}));

export default function Search() {
    let navigate = useNavigate();
    const theme = useTheme();
    const smxs = useMediaQuery(theme.breakpoints.down('sm'))

    const [searchBy, setSearchBy] = useState('placeholder');
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
        console.log(best.data.results.books)
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
        console.log(isbn, title, author)
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
        <Container sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            <Box
                component="form"
                sx={{
                    display: 'flex',
                    width: { xs: 1 / 1, sm: 3 / 4, md: 3 / 5 },
                    mt: 5,
                    alignSelf: 'center'
                }}
                noValidate
                autoComplete="off"
            >
                <Box sx={{ minWidth: 116 }}>
                    <FormControl>
                        <Select
                            id="searchby-select"
                            value={searchBy}
                            input={<OutlinedInput />}
                            onChange={changeSearchBy}
                        >
                            <MenuItem disabled value={'placeholder'}>
                                <em>Search By</em>
                            </MenuItem>
                            <MenuItem value={'title'}>Title</MenuItem>
                            <MenuItem value={'author'}>Author</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <SearchBar>
                    <StyledInputBase
                        onChange={handleInputChange}
                        placeholder="Search…"
                        inputProps={{ 'aria-label': 'search' }}
                    />
                </SearchBar>
                {/* <SearchIconWrapper> */}
                <IconButton onClick={search}>
                    <SearchIcon />
                </IconButton>
                {/* </SearchIconWrapper> */}
                {/* <Button onClick={search}>Search</Button> */}
            </Box>

            {noResults && <Container sx={{ m: '20px auto 20px auto', textAlign: 'center' }}>
                <Typography variant='subtitle2'>No Results Found</Typography>
            </Container>}

            {searchResults ? (
                <Container sx={{ mb: '60px' }}>
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
                    <Stack alignItems='center' sx={{mb:4}}>
                        <Typography variant='h6'>New York Times Best Sellers List</Typography>
                        <Typography variant='subtitle1'>{bestListInfo.title}</Typography>
                        <Typography variant='subtitle2' color='text.secondary'>{bestListInfo.date}</Typography>
                    </Stack>
                    {smxs ? (
                        <NYTMobile bestSellers={bestSellers} nytSearch={nytSearch} />
                    ) : (
                        <Box sx={{mt:2, mb:10}}>
                            <Grid container rowSpacing={1} columnSpacing={0.5} 
                       
                            sx={{mr:'auto', ml:'auto',width:{sm: 7/8, md: 3/4, xl: 3/5}}}>

                                {bestSellers.map(book => (
                                    <Grid item sm={3} md={2.4}>

                                        <Card key={book.primary_isbn13} sx={{ width: 120, height: '100%'}} onClick={() => nytSearch(book.primary_isbn13, book.title, book.author)}>
                                            <CardContent sx={{ wordWrap: 'break-word' }}>
                                                <Badge anchorOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'left',
                                                }}
                                                    badgeContent={book.rank} color="primary">
                                                    <CardMedia
                                                        component="img"
                                                        // onClick={() => nytSearch(book.title)}
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
                                    </Grid>

                                ))}
                            </Grid>

                        </Box>
                    )}
                </Box>
            </Container>}

        </Container>
    );
}
