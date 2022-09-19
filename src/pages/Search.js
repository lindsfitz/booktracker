// Search page for new books to add to your bookshelf
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import API from '../utils/API';
import AppContext from '../AppContext';
import { Box, TextField, InputLabel, MenuItem, FormControl, Select, Button, List, ListItem, ListItemText, Container, Skeleton, Stack, Typography } from '@mui/material';


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

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value)
    }

    const changeSearchBy = (event) => {
        setSearchBy(event.target.value);
    };

    const addToShelf = (shelf,book) => {
        console.log(shelf,book)
    }

    const searchByTitle = async () => {
        API.searchByTitle(searchTerm).then(books => {
            if(!books.data.docs.length){
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
        if(!authorResults.data.docs.length){
            setNoResults(true)
        }
        setSearchResults(authorResults.data.docs)
        console.log(authorResults)
    }

    const search = async () => {
        setSearchResults(null)
        setShelves([...context.userShelves])
        if(searchBy === 'title') {
            searchByTitle()
        }

        if(searchBy === 'author') {
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
    }

    const subjectSearch = async () => {
        let subject = 'fantasy romance'

        const OLsearch = await API.searchBySubject(subject)
        const gbSearch = await API.gbBySubject(subject)

        console.log(OLsearch)
        console.log('------')
        console.log(gbSearch)

    }

    // useEffect(()=> {
    //     nytBestSellers()
    //     subjectSearch()
    // },[])


    return (
        <Container sx={{width:'100%', display:'flex', flexDirection:'column'}}>
            <Box
                component="form"
                sx={{
                    display:'flex',
                    maxWidth:3/5,
                    m:5
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
                <TextField onChange={handleInputChange} sx={{width:2/3}} id="standard-basic" label="Search..." variant="standard" />
                <Button onClick={search}>Search</Button>
            </Box>

            {
                noResults && <Container sx={{m:'20px auto 20px auto', textAlign:'center'}}>
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
                                            <MenuItem onClick={()=>addToShelf(shelf.id,book.key)} key={shelf.id} value={shelf.id}>{shelf.name}
                                            </MenuItem>
                                        ))}

                                    </Select>
                                    <Button onClick={() => { navigate(`${book.key}`) }}>VIEW DETAILS</Button>
                                </FormControl>
                        </ListItem>
                    ))}
                </List>

            </Container> :

                (
                    <Stack spacing={1} sx={{mr:'auto', ml:'auto', mt:10}}>
                        {/* For variant="text", adjust the height via font-size */}
                        {/* For other variants, adjust the size with `width` and `height` */}
                        <Skeleton variant="rectangular" width='90' height={100} />
                        <Skeleton width='90' />
                        <Skeleton variant="rectangular" width='90' height={100} />
                        <Skeleton width='90' />
                        <Skeleton variant="rectangular" width='90' height={100} />
                        <Skeleton width='90' />
                    </Stack>
                )

            }

        </Container>
    );
}
