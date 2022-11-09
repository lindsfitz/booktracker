import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";

import AppContext from '../AppContext';
import API from '../utils/API'
import { List, Container, Divider, Typography, Autocomplete, TextField, Box, Stack, Tooltip, IconButton, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ReadingMobile from './components/mobile/ReadingMobile';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import OneShelf from './components/OneShelf';
import Carousel from './components/Carousel';
import ShelfStack from './components/ShelfStack';

export default function AllBooks() {
    const context = useContext(AppContext);
    let navigate = useNavigate();
    const theme = useTheme();
    const smxs = useMediaQuery(theme.breakpoints.down('sm'))



    const [currentReads, setCurrentReads] = useState(null);
    const [favoriteShelf, setFavoriteShelf] = useState(null)
    const [markedRead, setMarkedRead] = useState(null);
    const [ownedBooks, setOwnedBooks] = useState(null);
    const [dnfBooks, setDnfBooks] = useState(null)
    const [previewShelves, setPreviewShelves] = useState(null)
    const [allBooks, setAllBooks] = useState(null);
    const [searchValue, setSearchValue] = useState(null)



    useEffect(() => {
        const userBookData = async () => {
            try {
                const books = await API.allUserBooks(context.userData.id)
                setAllBooks(books.data.allBooks)
                setCurrentReads(books.data.currently)
                setMarkedRead({
                    name: 'Read',
                    id: 'read',
                    Books: books.data.read
                })
                setOwnedBooks(books.data.owned)
                setDnfBooks(books.data.dnf)
                const profile = await API.getProfile(context.userData.id)
                if (profile.data.favorite_shelf) {
                    const favShelf = books.data.shelves.filter(shelf => shelf.id === profile.data.favorite_shelf)
                    // console.log(favShelf[0])
                    // console.log(books.data.shelves)
                    setFavoriteShelf(favShelf[0])
                    const otherShelves = books.data.shelves.filter(shelf => shelf.id !== profile.data.favorite_shelf)
                    smxs ? setPreviewShelves(otherShelves.slice(0,2)) :
                    setPreviewShelves(otherShelves.slice(0,4))
                } else {
                    setFavoriteShelf(books.data.shelves[0])
                    smxs ? setPreviewShelves(books.data.shelves.slice(1, 3)) :
                    setPreviewShelves(books.data.shelves.slice(1, 4))
                }

            } catch (err) {
                console.log(err)
            }
        }
        userBookData();
    }, [])


    return (
        <React.Fragment>
            {allBooks && <Container sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Autocomplete
                    freeSolo
                    sx={{ width: { xs: 3 / 4, md: 1 / 2 } }}
                    size='small'
                    value={searchValue}
                    onChange={(event, newValue) => {
                        //   setSearchValue(newValue);
                        navigate(`/book/${newValue.id}`)
                    }}
                    disableClearable
                    options={allBooks}
                    getOptionLabel={(option) => option.title}
                    renderInput={(params) => (
                        <TextField
                            {...params}

                            label={
                                <React.Fragment>
                                    <Stack direction='row' spacing={0.5} alignItems='center'>
                                        <SearchIcon fontSize="small" />
                                        <Typography variant='caption'>Search your shelved books</Typography>
                                    </Stack>
                                </React.Fragment>}
                            InputProps={{
                                ...params.InputProps,
                                type: 'search',
                            }}
                        />
                    )}
                    renderOption={(props, option) =>
                        <li {...props}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ width: '50px' }}>
                                    <img src={option.cover} alt={option.title} style={{ width: '40px' }} />
                                </Box>
                                <Stack>
                                    <Typography variant='caption'>
                                        {option.title}
                                    </Typography>
                                    <Typography variant='caption'>
                                        {option.author}
                                    </Typography>
                                </Stack>
                            </Box>
                        </li>}
                />
            </Container>
            }
            <Container id='mobile-currently-reading' sx={{ ml: 'auto', mr: 'auto', mt: 5, mb: 5, display: { xs: 'flex' }, flexDirection: 'column' }}>
                <Typography variant='subtitle2' color='text.secondary'>Currently Reading:</Typography>
                {currentReads && <ReadingMobile currentReads={currentReads} />}
            </Container>
            <Container>
                {/* <Typography variant='subtitle2' color='text.secondary'>Pinned Shelf</Typography> */}
                <Divider />
                <Box sx={{ p: 2, pb: 0, display: 'flex', justifyContent: 'space-between' }}>
                    {favoriteShelf && <Typography variant='body2' color='secondary.main'>{favoriteShelf.name}</Typography>}
                    <Tooltip title={
                        <React.Fragment>
                            <Typography variant='caption'>change pinned shelf</Typography>
                        </React.Fragment>
                    }>
                        <IconButton size='small' onClick={() => navigate(`/settings/${context.userData.id}`)}>
                            <EditIcon color='secondary' fontSize="inherit" />
                        </IconButton>
                    </Tooltip>
                </Box>
                <List id='pinned-shelf' sx={{ width: '100%', bgcolor: 'transparent' }}>
                    {/* {favoriteShelf && <OneShelf shelf={favoriteShelf} length={4} />} */}
                    {favoriteShelf && <Carousel shelf={favoriteShelf} />}

                </List>
                <Divider />
            </Container>
            <List id='marked-read' sx={{ width: '100%', bgcolor: 'transparent' }}>
                {markedRead && <ShelfStack shelf={markedRead} />}
                {ownedBooks && <ShelfStack shelf={{ name: 'Owned', id: 'owned', Books: ownedBooks }} />}
                {dnfBooks && <ShelfStack shelf={{ name: 'DNF', id: 'dnf', Books: dnfBooks }} />}
            </List>
            <Container sx={{ mb: '50px' }}>
                <Box sx={{ p: 2, pb: 0 }}>
                    <Typography variant='body2' color='secondary.main'>Bookshelves</Typography>
                </Box>
                <List id='preview-shelves' sx={{ display: 'flex', bgcolor: 'transparent', alignItems:'center' }}>
                    {previewShelves &&
                        <React.Fragment>
                            {previewShelves.map(shelf => (
                                <OneShelf shelf={shelf} length={1} />
                            ))}
                        </React.Fragment>
                    }

                </List>
                <Divider />
            </Container>





        </React.Fragment>
    )
}