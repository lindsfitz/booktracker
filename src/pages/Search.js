// Search page for new books to add to your bookshelf
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import API from '../utils/API';
import AppContext from '../AppContext';
import { Box, TextField, InputLabel, MenuItem, FormControl, Select, Button, List, ListItem, ListItemText, Container } from '@mui/material';

export default function Search() {
    const context = useContext(AppContext);
    let navigate = useNavigate();
    const [searchBy, setSearchBy] = useState('');
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [shelves, setShelves] = useState(null)
    const [shelfAdd, setShelfAdd] = useState('')

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value)
    }

    const changeSearchBy = (event) => {
        setSearchBy(event.target.value);
    };

    const changeShelfAdd = (event) => {
        setShelfAdd(event.target.value)
    }

    const search = async () => {
        API.searchByTitle(searchTerm).then(books => {
            setSearchResults(books.data.docs)
            // console.log(books)
        }).catch(err => {
            console.log(err)
        })
        API.gbByTitle(searchTerm).then(books => {
            console.log(books)
        })
        // const books = await API.searchByTitle(searchTerm)
        // console.log(books)
        // console.log(context.userShelves)
        setShelves([...context.userShelves])
        console.log(shelves)
        // setSearchResults(books.data.docs)
    }

    //   useEffect(()=>{
    //     search()
    //   },[])


    return (
        <Container>
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
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
                <TextField onChange={handleInputChange} id="standard-basic" label="Search..." variant="standard" />
                <Button onClick={search}>Search</Button>
            </Box>

            {searchResults && <Container>
                <List>
                    {searchResults.map((book) => (
                        <ListItem key={`${book.cover_edition_key}`} id={book.cover_edition_key}
                            secondaryAction={
                                <FormControl edge="end" variant="standard" sx={{ m: 1, minWidth: 120 }}>
                                    <InputLabel id="demo-simple-select-standard-label">Add to List</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-standard-label"
                                        id="demo-simple-select-standard"
                                        value={shelfAdd}
                                        onChange={changeShelfAdd}
                                        label="Add to List"
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        {shelves.map((shelf) => (
                                            <MenuItem key={shelf.id} value={shelf.id}>{shelf.name}
                                            </MenuItem>
                                        ))}
                                        {/* <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={'Faves'}>Favorites</MenuItem>
                                    <MenuItem value={20}>TBR</MenuItem>
                                    <MenuItem value={30}>DNF</MenuItem> */}
                                    </Select>
                                    <Button onClick={() => { navigate(`${book.key}`) }}>VIEW DETAILS</Button>
                                </FormControl>

                            }
                        >
                            <img src={`https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-M.jpg`} alt={`${book.title}-cover`} />
                            {
                                book.author_name[0] &&
                                <ListItemText primary={book.title} secondary={book.author_name[0]} />
                            }
                        </ListItem>
                    ))}
                </List>

            </Container>}

        </Container>
    );
}
