// Search page for new books to add to your bookshelf
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import AppContext from '../AppContext';
import API from '../utils/API';
// import Styles from '../utils/Styles'
// import AppContext from '../AppContext';
import { useTheme, styled, alpha } from '@mui/material/styles';
import { Box, OutlinedInput, Divider, MenuItem, FormControl, Select, Button, InputAdornment, Container, Skeleton, Stack, Typography, Badge, Card, CardMedia, CardContent, useMediaQuery, InputBase, IconButton, Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import NYTMobile from './components/Browse/NYTMobile';
import BookResults from './components/Browse/BookResults';
import SubjectResults from './components/Browse/SubjectResults';



const SearchBar = styled('div')(({ theme }) => ({
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.custom.main, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.custom.main, 0.25),
    },
    marginLeft: 5,
    width: '100%',
    display:'flex',
    alignItems:'center'
}));


const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 1),
        // marginTop: 4,
        transition: theme.transitions.create('width'),
    },
}));



export default function Search() {
    let navigate = useNavigate();
    const context = useContext(AppContext);

    const theme = useTheme();
    const smxs = useMediaQuery(theme.breakpoints.down('sm'))
    const mobile = useMediaQuery(theme.breakpoints.down('md'))

    const [searchBy, setSearchBy] = useState('placeholder');
    const [searchWith, setSearchWith] = useState('ol')
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
                // setNoResults(true)
                API.gbBySubject(searchTerm).then(books => {
                    setSearchWith('gb')
                    setSearchResults(books.data.items)
                    console.log(books.data)
                })
                return;
            }
            setSearchWith('ol')
            setSearchResults(books.data.docs)
            console.log(books.data.docs)
        }).catch(err => {
            console.log(err)
        })
    }

    const searchByAuthor = async () => {
        const authorResults = await API.olSearchAuthor(searchTerm)
        if (!authorResults.data.docs.length) {
            API.gbBySubject(searchTerm).then(books => {
                setSearchWith('gb')
                setSearchResults(books.data.items)
                console.log(books.data)
            })
            return;
        }
        setSearchWith('ol')
        setSearchResults(authorResults.data.docs)
        console.log(authorResults)
    }

    const search = async () => {
        setNYTdiv(false)
        setSearchResults(null)
        if (searchBy === 'placeholder') {
            setSearchBy('title')
            searchByTitle()
        }

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
        setBestSellers(best.data.results.books)
        setBestListInfo({
            date: best.data.results.bestsellers_date,
            title: best.data.results.display_name
        })
    }

    const subjectSearch = async (topic) => {
        let results;

        // const OLsearch = await API.olSearchBySubject(subject)
        if (topic) {
            const gbSearch = await API.gbBySubject(topic)
            results = gbSearch.data.items
        } else {
            const gbSearch = await API.gbBySubject(searchTerm)
            results = gbSearch.data.items
        }

        console.log('------')
        console.log(results)

        const test = []


        results.forEach(book => {
            if (book.volumeInfo.categories && book.volumeInfo.categories[0] === 'Fiction') {
                test.push(book.volumeInfo)
            }
        })
        console.log(test)
        setSearchWith('gb')
        setSearchResults(results)

    }

    const resultsRender = () => {
        if (searchWith === 'gb') {
            return <SubjectResults searchResults={searchResults} nytSearch={nytSearch} />
        }
        return <BookResults searchResults={searchResults} />
    }

    const nytSearch = async (book) => {
        console.log(book.primary_isbn13)
        const bookFind = await API.olBookISBN(book.primary_isbn13)
        const formattedTitle = book.title.toLowerCase().split(' ')
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
        if (bookFind.data) {
            console.log(bookFind.data.key)
            const key = bookFind.data.key.split('/')
            console.log(key)
            navigate(`/book/${key[2]}`, {
                state: {
                    origin: 'nyt',
                    author: book.author,
                    authorKey: bookFind.data.authors[0].key,
                    title: formattedTitle,
                    description: book.description,
                    cover: book.book_image,
                    isbn: book.primary_isbn13
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
                        value={searchTerm}
                        placeholder="Search…"
                        inputProps={{ 'aria-label': 'search' }}
                        endAdornment={
                            <InputAdornment position="end">
                                {searchTerm === '' ? null : <IconButton
                                    aria-label="clear search input"
                                    onClick={() => setSearchTerm('')}
                                   
                                >
                                    <ClearIcon />
                                </IconButton>}
                            </InputAdornment>
                        }
                    />
                </SearchBar>
                <IconButton onClick={search}>
                    <SearchIcon color='secondary.dark' />
                </IconButton>
            </Box>

            <Button onClick={subjectSearch}>Subject Search</Button>

            {context.profileData.Tags.length > 0 && <Container>
                <Typography variant='subtitle2'>Browse Your Favorite Genres & Topics</Typography>
                <Box>
                    {context.profileData.Tags.map(tag =>
                        <Button variant='outlined' color='success'
                            onClick={() => subjectSearch(tag.name)}
                        >{tag.name}</Button>
                    )}

                </Box>
            </Container>}

            {noResults && <Container sx={{ m: '20px auto 20px auto', textAlign: 'center' }}>
                <Typography variant='subtitle2'>No Results Found</Typography>
            </Container>}

            {searchResults ? (
                <Box>
                    {/* // <BookResults searchResults={searchResults} /> */}
                    {resultsRender()}

                </Box>


            ) : (
                <Stack spacing={1} sx={{ mr: 5, ml: 5, mt: 10, width: 1 / 1 }}>
                    <Skeleton variant="rectangular" width={4 / 5} height={100} />
                    <Skeleton width={4 / 5} />
                    <Skeleton variant="rectangular" width={4 / 5} height={100} />
                    <Skeleton width={4 / 5} />
                    <Skeleton variant="rectangular" width={4 / 5} height={100} />
                    <Skeleton width={4 / 5} />
                </Stack>
            )}

            {NYTdiv && bestSellers && <Container sx={{ mb: 10 }}>
                <Box>
                    <Stack alignItems='center' sx={{ mb: 4 }}>
                        <Typography variant='h6'>New York Times Best Sellers List</Typography>
                        <Typography variant='subtitle1'>{bestListInfo.title}</Typography>
                        <Typography variant='subtitle2' color='text.secondary'>{bestListInfo.date}</Typography>
                    </Stack>
                    {smxs ? (
                        <NYTMobile bestSellers={bestSellers} nytSearch={nytSearch} />
                    ) : (
                        <Box sx={{ mt: 2, mb: 10 }}>
                            <Grid container rowSpacing={1} columnSpacing={0.5}

                                sx={{ mr: 'auto', ml: 'auto', width: { sm: 7 / 8, md: 3 / 4, xl: 3 / 5 } }}>

                                {bestSellers.map(book => (
                                    <Grid item sm={3} md={2.4}>

                                        <Card key={book.primary_isbn13} sx={{
                                            width: 120, height: '100%', '&:hover': {
                                                cursor: 'pointer'
                                            }
                                        }} onClick={() => nytSearch(book)}>
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
